'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MobileFrame } from '@/components/frame/MobileFrame';
import { BottomTabBar, TabId } from '@/components/navigation/BottomTabBar';
import { AuroraBackground } from '@/components/home/AuroraBackground';
import { BalanceHero } from '@/components/home/BalanceHero';
import { TransactionList } from '@/components/home/TransactionList';
import { AccountsDrawer } from '@/components/home/AccountsDrawer';
import { AddMoneyModal } from '@/components/add-money/AddMoneyModal';
import { ContactListModal } from '@/components/transfer/ContactListModal';
import { ExchangeModal } from '@/components/exchange/ExchangeModal';
import { TransactionDetailSheet } from '@/components/home/TransactionDetailSheet';
import { CardsScreen } from '@/components/cards/CardsScreen';
import { InvestScreen } from '@/components/invest/InvestScreen';
import { CryptoScreen } from '@/components/crypto/CryptoScreen';
import { HubScreen } from '@/components/hub/HubScreen';
import { GodModeDrawer } from '@/components/godmode/GodModeDrawer';
import { RevolutLogo } from '@/components/ui/RevolutLogo';
import { useRevolutStore } from '@/store/useRevolutStore';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [mounted, setMounted] = useState(false);
  const [auroraColor, setAuroraColor] = useState<'cyan' | 'blue' | 'purple'>('blue');

  const {
    selectedContactForTransfer,
    isAddMoneyOpen,
    isExchangeOpen,
    isTransferOpen,
    isGodModeOpen,
    selectedTransactionDetail,
  } = useRevolutStore();

  const isModalActive =
    !!selectedContactForTransfer ||
    isAddMoneyOpen ||
    isExchangeOpen ||
    isTransferOpen ||
    isGodModeOpen ||
    !!selectedTransactionDetail;

  useEffect(() => {
    setMounted(true);
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
    <MobileFrame>
      {/* Dynamic Animated Aurora Glow (Active in background) */}
      <AuroraBackground colorVariant={auroraColor} />

      {/* Screen Views with Butter-Smooth Cross-Fade (Duration: 0.15s) */}
      <main className="flex-1 flex flex-col w-full h-full relative overflow-hidden z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col w-full h-full overflow-y-auto no-scrollbar relative"
            >
              {/* Header, Carousel Balance Hero, 4-Grid & Promo Card */}
              <BalanceHero onColorChange={(col) => setAuroraColor(col)} />

              {/* Curved Glass Bottom Sheet for Transactions */}
              <TransactionList />
            </motion.div>
          )}

          {activeTab === 'invest' && (
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

          {activeTab === 'transfer' && (
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

          {activeTab === 'cards' && (
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

          {activeTab === 'hub' && (
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
      <BottomTabBar activeTab={activeTab} onTabChange={handleTabChange} hidden={isModalActive} />

      {/* Global Bottom Sheets & Modals */}
      <AccountsDrawer />
      <AddMoneyModal />
      <ContactListModal />
      <ExchangeModal />
      <TransactionDetailSheet />
      <GodModeDrawer />
    </MobileFrame>
  );
}
