'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRevolutStore } from '@/store/useRevolutStore';
import { Currency } from '@/types';
import { formatCurrencyAmount } from '@/utils/formatters';
import { X, ChevronUp, Check, Coins, Vault, Wallet2, Plus } from 'lucide-react';
import { sound } from '@/utils/audio';

export const AccountsDrawer: React.FC = () => {
  const {
    isAccountsDrawerOpen,
    setAccountsDrawerOpen,
    accounts,
    activeCurrency,
    setActiveCurrency,
    setAddMoneyOpen,
  } = useRevolutStore();

  const handleSelectCurrency = (currency: Currency) => {
    sound.playKeypadClick();
    setActiveCurrency(currency);
    setAccountsDrawerOpen(false);
  };

  // Compute total in RON
  const totalAllRon = accounts.RON.balance + accounts.EUR.balance * 4.9765 + accounts.USD.balance * 4.582;

  return (
    <AnimatePresence>
      {isAccountsDrawerOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              sound.playKeypadClick();
              setAccountsDrawerOpen(false);
            }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer content (Replicating Screenshot #1) */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 140) {
                setAccountsDrawerOpen(false);
              }
            }}
            className="relative w-full max-h-[90vh] bg-[#121417] rounded-t-[32px] border-t border-white/[0.09] flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Grab handle bar */}
            <div className="w-full flex justify-center pt-2.5 pb-1">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Top header with close button */}
            <div className="px-5 pt-2 pb-2 flex items-center justify-between">
              <button
                onClick={() => {
                  sound.playKeypadClick();
                  setAccountsDrawerOpen(false);
                }}
                className="w-9 h-9 rounded-full bg-[#1C2025] hover:bg-[#262B32] active:scale-90 flex items-center justify-center text-neutral-300 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto px-5 pb-24 pt-1 space-y-4 no-scrollbar">
              <h2 className="text-xl font-bold text-white tracking-tight">Personal</h2>

              {/* Accounts Card Block */}
              <div className="bg-[#191C20] rounded-2xl p-4 border border-white/[0.05] space-y-4">
                <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold">
                  <span>Accounts</span>
                  <ChevronUp className="w-4 h-4" />
                </div>

                {/* Euro */}
                <div
                  onClick={() => handleSelectCurrency('EUR')}
                  className="flex items-center justify-between cursor-pointer group active:opacity-75 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full bg-[#003399] flex items-center justify-center text-white text-base overflow-hidden shadow-sm">
                      🇪🇺
                    </div>
                    <div>
                      <div className="text-[15px] font-medium text-white">Euro</div>
                      <div className="text-xs text-neutral-400">EUR</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-medium text-white">
                      {formatCurrencyAmount(accounts.EUR.balance, 'EUR')}
                    </span>
                    {activeCurrency === 'EUR' && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Romanian Leu */}
                <div
                  onClick={() => handleSelectCurrency('RON')}
                  className="flex items-center justify-between cursor-pointer group active:opacity-75 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full bg-[#1b263b] flex items-center justify-center text-white text-base overflow-hidden shadow-sm">
                      🇷🇴
                    </div>
                    <div>
                      <div className="text-[15px] font-medium text-white">Romanian Leu</div>
                      <div className="text-xs text-neutral-400">RON · Primary</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-medium text-white">
                      {formatCurrencyAmount(accounts.RON.balance, 'RON')}
                    </span>
                    {activeCurrency === 'RON' && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    )}
                  </div>
                </div>

                {/* US Dollar */}
                <div
                  onClick={() => handleSelectCurrency('USD')}
                  className="flex items-center justify-between cursor-pointer group active:opacity-75 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full bg-[#1e293b] flex items-center justify-center text-white text-base overflow-hidden shadow-sm">
                      🇺🇸
                    </div>
                    <div>
                      <div className="text-[15px] font-medium text-white">US Dollar</div>
                      <div className="text-xs text-neutral-400">USD</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-medium text-white">
                      {formatCurrencyAmount(accounts.USD.balance, 'USD')}
                    </span>
                    {activeCurrency === 'USD' && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    )}
                  </div>
                </div>

                {/* British Pound */}
                <div
                  onClick={() => handleSelectCurrency('GBP')}
                  className="flex items-center justify-between cursor-pointer group active:opacity-75 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full bg-[#1e293b] flex items-center justify-center text-white text-base overflow-hidden shadow-sm">
                      🇬🇧
                    </div>
                    <div>
                      <div className="text-[15px] font-medium text-white">British Pound</div>
                      <div className="text-xs text-neutral-400">GBP</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-medium text-white">
                      {formatCurrencyAmount(accounts.GBP.balance, 'GBP')}
                    </span>
                    {activeCurrency === 'GBP' && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    )}
                  </div>
                </div>

                {/* All accounts row */}
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#262B32] flex items-center justify-center text-neutral-300">
                      <Coins className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[15px] font-medium text-white">All accounts</div>
                      <div className="text-xs text-neutral-400">4 accounts</div>
                    </div>
                  </div>
                  <span className="text-[15px] font-medium text-white">
                    {formatCurrencyAmount(totalAllRon, 'RON')}
                  </span>
                </div>
              </div>

              {/* Savings & Funds Discovery Card */}
              <div className="bg-[#191C20] rounded-2xl p-4 border border-white/[0.05] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                    <Vault className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-white">Savings & Funds</h3>
                    <p className="text-xs text-neutral-400 leading-snug">
                      Earn up to 4,25% p.a. with savings or invest in low-risk funds
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => sound.playKeypadClick()}
                  className="px-3.5 py-1.5 rounded-full bg-[#282E36] hover:bg-[#323943] text-xs font-semibold text-white shrink-0 active:scale-95 transition"
                >
                  Discover
                </button>
              </div>

              {/* Personal Loan Discovery Card */}
              <div className="bg-[#191C20] rounded-2xl p-4 border border-white/[0.05] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Wallet2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-white">Personal loan</h3>
                    <p className="text-xs text-neutral-400 leading-snug">
                      Up to 200.000 lei
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => sound.playKeypadClick()}
                  className="px-3.5 py-1.5 rounded-full bg-[#282E36] hover:bg-[#323943] text-xs font-semibold text-white shrink-0 active:scale-95 transition"
                >
                  Discover
                </button>
              </div>

              {/* Joint / Other Accounts: Maria */}
              <div className="pt-2">
                <h3 className="text-lg font-bold text-white mb-2">Maria</h3>
                <div className="bg-[#191C20] rounded-2xl p-4 border border-white/[0.05] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full bg-pink-600/30 text-pink-400 flex items-center justify-center font-bold text-sm">
                      M
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neutral-900 border border-neutral-700 text-[10px] text-white flex items-center justify-center">
                        5
                      </span>
                    </div>
                    <div>
                      <div className="text-[15px] font-medium text-white">Main</div>
                      <div className="text-xs text-neutral-400">5 new transactions</div>
                    </div>
                  </div>
                  <span className="text-[15px] font-medium text-white">1,28 lei</span>
                </div>
              </div>
            </div>

            {/* Bottom floating "+ Add new" pill matching screenshot #1 */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10">
              <button
                onClick={() => {
                  sound.playKeypadClick();
                  setAccountsDrawerOpen(false);
                  setAddMoneyOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-white text-black font-semibold text-sm shadow-xl hover:bg-neutral-200 active:scale-95 transition"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add new</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
