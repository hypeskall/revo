"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
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
import { RevolutLogo } from "@/components/ui/RevolutLogo";
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

  const isModalActive =
    !!selectedContactForTransfer ||
    isAddMoneyOpen ||
    isExchangeOpen ||
    isTransferOpen ||
    isGodModeOpen ||
    !!selectedTransactionDetail ||
    !!homeTool ||
    !!uiPanel ||
    walletOpen ||
    isAccountsDrawerOpen;

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
    setActiveTab(tab);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen w-full bg-[#020510] flex flex-col items-center justify-center select-none">
        <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-[0_0_50px_rgba(0,117,235,0.6)] animate-pulse">
          <RevolutLogo variant="white" className="w-9 h-9" />
        </div>
      </div>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <MobileFrame>
        {/* Dynamic Animated Aurora Glow (Active in background) */}
        <AuroraBackground colorVariant="blue" />

        {/* Screen Views with Butter-Smooth Cross-Fade (Duration: 0.15s) */}
        <main
          aria-hidden={isModalActive || welcoming}
          ref={(node) => {
            if (node) node.inert = isModalActive || welcoming;
          }}
          className="flex-1 flex flex-col w-full h-full relative overflow-hidden z-10"
        >
          <AnimatePresence mode="wait">
            {activeTab === "credit" && (
              <motion.div
                key="credit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 flex flex-col w-full h-full relative"
              >
                <CreditScreen />
              </motion.div>
            )}
            {activeTab === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 flex flex-col w-full h-full min-h-0 min-w-0 overflow-hidden relative"
              >
                {homeAccount === "bills" ? (
                  <BillsHome onNavigate={handleTabChange} />
                ) : (
                  <PersonalHome onNavigate={handleTabChange} />
                )}
              </motion.div>
            )}

            {activeTab === "invest" && (
              <motion.div
                key="invest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 flex flex-col w-full h-full relative"
              >
                <InvestScreen />
              </motion.div>
            )}

            {activeTab === "transfer" && (
              <motion.div
                key="payments"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 flex flex-col w-full h-full relative"
              >
                {/* Payments Screen (Matching Screenshot #2) */}
                <ContactListModal isTabMode={true} />
              </motion.div>
            )}

            {activeTab === "cards" && (
              <motion.div
                key="crypto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 flex flex-col w-full h-full relative"
              >
                <CryptoScreen />
              </motion.div>
            )}

            {activeTab === "hub" && (
              <motion.div
                key="hub"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 flex flex-col w-full h-full relative"
              >
                <HubScreen />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* 1. PERSISTENT FLOATING LIQUID GLASS DOCK:
          Hides smoothly when in a chat or full-screen modal
      */}
        <BottomTabBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          hidden={isModalActive || screenOverlayOpen || welcoming}
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
