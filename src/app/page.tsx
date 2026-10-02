"use client";
import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { MobileFrame } from "@/components/frame/MobileFrame";
import { BottomTabBar, TabId } from "@/components/navigation/BottomTabBar";
import { AuroraBackground } from "@/components/home/AuroraBackground";
import { AccountsDrawer } from "@/components/home/AccountsDrawer";
import { AddMoneyModal } from "@/components/add-money/AddMoneyModal";
import { ContactListModal } from "@/components/transfer/ContactListModal";
import { ExchangeModal } from "@/components/exchange/ExchangeModal";
import { TransactionDetailSheet } from "@/components/home/TransactionDetailSheet";
import { InvestScreen } from "@/components/invest/InvestScreen";
import { CryptoScreen } from "@/components/crypto/CryptoScreen";
import { HubScreen } from "@/components/hub/HubScreen";
import { GodModeDrawer } from "@/components/godmode/GodModeDrawer";
import { TabScenes } from "@/components/navigation/TabScenes";
import { useRevolutStore } from "@/store/useRevolutStore";
import { BillsHome } from "@/components/home/BillsHome";
import { PersonalHome } from "@/components/home/PersonalHome";
import { HomeToolsSheet } from "@/components/home/HomeToolsSheet";
import { ReferenceWallet } from "@/components/cards/ReferenceWallet";
import {
  PresentationPanels,
  NotificationToast,
} from "@/components/home/PresentationPanels";
import { CreditScreen } from "@/components/credit/CreditScreen";
import { ContactChatScreen } from "@/components/transfer/ContactChatScreen";
import { WelcomeScreen } from "@/components/home/WelcomeScreen";
export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [mounted, setMounted] = useState(false);
  const [welcoming, setWelcoming] = useState(true);
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const finishWelcome = useCallback(() => setWelcoming(false), []);
  const {
    selectedContactForTransfer,
    isAddMoneyOpen,
    isExchangeOpen,
    isTransferOpen,
    isGodModeOpen,
    selectedTransactionDetail,
    homeTool,
    homeAccount,
    uiPanel,
    walletOpen,
    isAccountsDrawerOpen,
    screenOverlayOpen,
    setHomeTool,
    setWalletOpen,
  } = useRevolutStore();
  const isGlobalModalActive =
    appearanceOpen ||
    !!selectedContactForTransfer ||
    isAddMoneyOpen ||
    isExchangeOpen ||
    isTransferOpen ||
    isGodModeOpen ||
    !!selectedTransactionDetail ||
    !!uiPanel ||
    walletOpen ||
    isAccountsDrawerOpen;
  const isModalActive = isGlobalModalActive || !!homeTool;
  const localBillsTool = activeTab === "home" && homeAccount === "bills";
  const mainBlocked =
    isGlobalModalActive || (!!homeTool && !localBillsTool) || welcoming;
  useEffect(() => {
    setMounted(true);
    useRevolutStore.getState().processScheduledPayments();
    const timer = window.setInterval(
      () => useRevolutStore.getState().processScheduledPayments(),
      30000,
    );
    return () => window.clearInterval(timer);
  }, []);
  const handleTabChange = (tab: TabId) => {
    if (homeTool === "more") setHomeTool(null);
    setActiveTab(tab);
  };
  if (!mounted) {
    return (
      <MobileFrame>
        <div className="welcome-screen" aria-label="Loading app" />
      </MobileFrame>
    );
  }
  return (
    <MotionConfig reducedMotion="user">
      <MobileFrame>
        {/* Dynamic Animated Aurora Glow (Active in background) */}
        <AuroraBackground colorVariant="blue" />
        {/* Page content remains mounted to preserve scroll and prevent empty frames. */}
        <main
          aria-hidden={mainBlocked}
          ref={(node) => {
            if (node) node.inert = mainBlocked;
          }}
          className="flex-1 flex flex-col w-full h-full relative overflow-hidden z-10"
        >
          <TabScenes
            active={activeTab}
            render={(tab) => {
              switch (tab) {
                case "home":
                  return homeAccount === "bills" ? (
                    <BillsHome onNavigate={handleTabChange} />
                  ) : (
                    <PersonalHome onNavigate={handleTabChange} />
                  );
                case "credit":
                  return <CreditScreen />;
                case "invest":
                  return <InvestScreen />;
                case "transfer":
                  return <ContactListModal isTabMode />;
                case "cards":
                  return <CryptoScreen />;
                case "hub":
                  return <HubScreen />;
              }
            }}
          />
        </main>
        {/* 1. PERSISTENT FLOATING LIQUID GLASS DOCK:
          Hides smoothly when in a chat or full-screen modal
      */}
        <BottomTabBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          hidden={
            (isModalActive && homeTool !== "more") ||
            screenOverlayOpen ||
            welcoming
          }
        />
        {/* Global Bottom Sheets & Modals */}
        <AccountsDrawer onCredit={() => handleTabChange("credit")} />
        {isAddMoneyOpen && <AddMoneyModal />}
        {isTransferOpen && !selectedContactForTransfer && <ContactListModal />}
        {selectedContactForTransfer && (
          <ContactChatScreen
            key={selectedContactForTransfer.id}
            contact={selectedContactForTransfer}
            onBack={() =>
              useRevolutStore.getState().setSelectedContactForTransfer(null)
            }
          />
        )}
        <ExchangeModal />
        <TransactionDetailSheet />
        <GodModeDrawer />
        {!(activeTab === "home" && homeAccount === "bills") && (
          <HomeToolsSheet
            tool={homeTool}
            onClose={() => setHomeTool(null)}
            onSelectTool={setHomeTool}
            onOpenWallet={() => setWalletOpen(true)}
            onNavigatePoints={() => handleTabChange("hub")}
            onThemeOpenChange={setAppearanceOpen}
          />
        )}
        {walletOpen && <ReferenceWallet />}
        {uiPanel && <PresentationPanels key={uiPanel} panel={uiPanel} />}
        <NotificationToast />
        <AnimatePresence>
          {welcoming && <WelcomeScreen onDone={finishWelcome} />}
        </AnimatePresence>
      </MobileFrame>
    </MotionConfig>
  );
}
