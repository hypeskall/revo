'use client';

import React, { useState } from 'react';
import { useRevolutStore } from '@/store/useRevolutStore';
import { formatCurrencyAmount } from '@/utils/formatters';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Keypad } from '@/components/ui/Keypad';
import { ApplePaySheet } from '@/components/add-money/ApplePaySheet';
import { sound } from '@/utils/audio';

import { AppleLogo } from '@/components/ui/AppleLogo';

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
    // Strictly constrained inside the 430px root container
    <div className="absolute inset-0 z-50 bg-black text-white flex flex-col justify-between overflow-hidden">
      {/* Top Header */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <button
          onClick={() => {
            sound.playKeypadClick();
            setAddMoneyOpen(false);
          }}
          className="w-10 h-10 rounded-full bg-[#181A1D] hover:bg-[#22252A] active:scale-90 flex items-center justify-center text-white transition border border-white/[0.05]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h2 className="text-base font-semibold text-white">Add money</h2>
          <div className="text-xs text-neutral-400">Balance: {formattedBalance}</div>
        </div>

        <div className="w-10" />
      </div>

      {/* Main Amount Display */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="flex items-center justify-center font-bold text-white tracking-tight my-2">
          <span className="text-[54px] font-bold leading-none">{inputStr}</span>
          <span className="w-[3px] h-12 bg-blue-500 mx-1.5 animate-pulse rounded-full" />
          <span className="text-[44px] font-bold text-white/90 ml-1">
            {activeCurrency === 'RON'
              ? 'lei'
              : activeCurrency === 'EUR'
              ? '€'
              : activeCurrency === 'USD'
              ? '$'
              : '£'}
          </span>
        </div>

        {/* Clean Apple Pay · RON dropdown pill */}
        <button
          type="button"
          onClick={() => sound.playKeypadClick()}
          className="mt-3 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#191C1F] hover:bg-[#22262B] text-xs font-medium text-white border border-white/[0.06] active:scale-95 transition"
        >
          <div className="flex items-center gap-1">
            <AppleLogo variant="white" className="w-3.5 h-3.5" />
            <span className="font-semibold text-white">Pay</span>
          </div>
          <span className="text-neutral-300">· {activeCurrency}</span>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
        </button>

        {/* Subtitle arrival note */}
        <p className="text-xs text-neutral-400 mt-6 font-normal">
          Arriving · Usually instantly
        </p>

        {/* Primary Apple Pay Button */}
        <button
          onClick={() => {
            if (numericAmount <= 0) return;
            sound.playKeypadClick();
            setIsApplePayOpen(true);
          }}
          disabled={numericAmount <= 0}
          className={`w-full max-w-[340px] mt-4 py-3.5 rounded-full font-semibold text-base flex items-center justify-center gap-1.5 shadow-xl transition-all duration-150 active:scale-[0.98] ${
            numericAmount > 0
              ? 'bg-white text-black hover:bg-neutral-100 cursor-pointer'
              : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
          }`}
        >
          <AppleLogo variant="black" className="w-4 h-4" />
          <span className="tracking-tight text-base font-bold">Pay</span>
        </button>
      </div>

      {/* Clean Keypad (strictly numbers 1-9, comma, 0, delete icon) */}
      <div className="pb-4">
        <Keypad
          onDigit={handleDigit}
          onDelete={handleDelete}
        />
      </div>

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
