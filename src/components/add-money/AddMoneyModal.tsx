'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRevolutStore } from '@/store/useRevolutStore';
import { formatCurrencyAmount } from '@/utils/formatters';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Keypad } from '@/components/ui/Keypad';
import { ApplePaySheet } from '@/components/add-money/ApplePaySheet';
import { sound } from '@/utils/audio';
import { ApplePayLogo } from '@/components/ui/AppleLogo';

export const AddMoneyModal: React.FC = () => {
  const {
    isAddMoneyOpen,
    setAddMoneyOpen,
    accounts,
    activeCurrency,
    addMoney,
  } = useRevolutStore();

  const [inputStr, setInputStr] = useState('610');
  const [isApplePayOpen, setIsApplePayOpen] = useState(false);

  if (!isAddMoneyOpen) return null;

  const currentAccount = accounts[activeCurrency];
  const formattedBalance = formatCurrencyAmount(
    currentAccount ? currentAccount.balance : 0,
    activeCurrency
  );

  const handleDigit = (digit: string) => {
    if (digit === ',') {
      if (!inputStr.includes(',')) {
        setInputStr(inputStr + ',');
      }
      return;
    }
    if (inputStr === '0') {
      setInputStr(digit);
    } else {
      if (inputStr.length < 8) {
        setInputStr(inputStr + digit);
      }
    }
  };

  const handleDelete = () => {
    if (inputStr.length <= 1) {
      setInputStr('0');
    } else {
      setInputStr(inputStr.slice(0, -1));
    }
  };

  const numericAmount = parseFloat(inputStr.replace(',', '.')) || 0;

  const handleApplePaySuccess = () => {
    setIsApplePayOpen(false);
    addMoney(numericAmount, activeCurrency, 'Apple Pay');
    setAddMoneyOpen(false);
  };

  return (
    // Strictly constrained inside root container with safe-area support
    <div className="absolute inset-0 z-50 bg-black text-white flex flex-col justify-between overflow-hidden">
      {/* Top Header with Dynamic iPhone Safe Area */}
      <div
        style={{
          paddingTop: 'max(env(safe-area-inset-top, 0px), 16px)',
        }}
        className="px-5 pb-2 flex items-center justify-between"
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            sound.playKeypadClick();
            setAddMoneyOpen(false);
          }}
          className="w-10 h-10 rounded-full bg-[#181A1D] hover:bg-[#22252A] flex items-center justify-center text-white transition border border-white/[0.08] shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>

        <div className="text-center">
          <h2 className="text-base font-semibold text-white tracking-tight">Add money</h2>
          <div className="text-xs text-neutral-400">Balance: {formattedBalance}</div>
        </div>

        <div className="w-10" />
      </div>

      {/* Main Fancy Animated Amount Display (Motion.dev rolling ticker) */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          key={inputStr.length}
          animate={{ scale: [0.97, 1.02, 1] }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className="flex items-center justify-center my-3 overflow-hidden h-[76px]"
        >
          {/* Rolling character animation */}
          <div className="flex items-center justify-center">
            <AnimatePresence mode="popLayout" initial={false}>
              {inputStr.split('').map((char, idx) => (
                <motion.span
                  key={`${idx}-${char}`}
                  initial={{ opacity: 0, y: 22, scale: 0.7, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -22, scale: 0.7, filter: 'blur(4px)' }}
                  transition={{
                    type: 'spring',
                    stiffness: 550,
                    damping: 28,
                    mass: 0.35,
                  }}
                  className="text-[58px] font-extrabold text-white tracking-tight leading-none inline-block font-sans select-none"
                >
                  {char}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>

          {/* Glowing Luminous Electric Cyan Blinking Cursor */}
          <motion.div
            animate={{
              opacity: [1, 0.25, 1],
              scaleY: [1, 0.92, 1],
            }}
            transition={{ repeat: Infinity, duration: 0.85, ease: 'easeInOut' }}
            className="w-[3.5px] h-12 bg-cyan-400 mx-2 rounded-full shadow-[0_0_14px_#00d2ff]"
          />

          {/* Currency Indicator with Spring Layout */}
          <motion.span
            layout
            className="text-[44px] font-bold text-white/90 ml-0.5 tracking-tight select-none"
          >
            {activeCurrency === 'RON'
              ? 'lei'
              : activeCurrency === 'EUR'
              ? '€'
              : activeCurrency === 'USD'
              ? '$'
              : '£'}
          </motion.span>
        </motion.div>

        {/* Clean Apple Pay · RON dropdown pill */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          type="button"
          onClick={() => sound.playKeypadClick()}
          className="mt-2 flex items-center gap-2 px-4 py-2 rounded-full bg-[#191C1F] hover:bg-[#22262B] text-xs font-medium text-white border border-white/[0.08] shadow-sm transition"
        >
          <ApplePayLogo variant="white" className="h-4" />
          <span className="text-neutral-300 font-medium">· {activeCurrency}</span>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400 ml-0.5" />
        </motion.button>

        {/* Subtitle arrival note */}
        <p className="text-xs text-neutral-400 mt-5 font-normal tracking-tight">
          Arriving · Usually instantly
        </p>

        {/* Primary Official Apple Pay Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          onClick={() => {
            if (numericAmount <= 0) return;
            sound.playKeypadClick();
            setIsApplePayOpen(true);
          }}
          disabled={numericAmount <= 0}
          className={`w-full max-w-[340px] mt-4 py-3.5 rounded-full font-semibold text-base flex items-center justify-center gap-1.5 shadow-xl transition-colors ${
            numericAmount > 0
              ? 'bg-white text-black hover:bg-neutral-100 cursor-pointer shadow-[0_10px_30px_rgba(255,255,255,0.15)]'
              : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
          }`}
        >
          <ApplePayLogo variant="black" className="h-6" />
        </motion.button>
      </div>

      {/* Tactile Motion Keypad */}
      <Keypad onDigit={handleDigit} onDelete={handleDelete} />

      {/* Apple Pay Confirmation Bottom Sheet */}
      <ApplePaySheet
        isOpen={isApplePayOpen}
        onClose={() => setIsApplePayOpen(false)}
        amount={numericAmount}
        currency={activeCurrency}
        onSuccess={handleApplePaySuccess}
      />
    </div>
  );
};
