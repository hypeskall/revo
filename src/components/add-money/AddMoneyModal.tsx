'use client';

import React, { useState } from 'react';
import { useRevolutStore } from '@/store/useRevolutStore';
import { formatCurrencyAmount } from '@/utils/formatters';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Keypad } from '@/components/ui/Keypad';
import { ApplePaySheet } from '@/components/add-money/ApplePaySheet';
import { sound } from '@/utils/audio';

// Crisp authentic Apple Pay logo SVG
export const AppleLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 fill-current' }) => (
  <svg className={className} viewBox="0 0 170 170">
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.6-7.85-11.75-14.42-6.52-10.43-11.53-21.78-15.03-34.05-3.5-12.27-5.25-23.77-5.25-34.5 0-14.56 3.73-26.69 11.19-36.39 7.46-9.7 16.92-14.67 28.37-14.92 5.09 0 10.58 1.34 16.48 4.02 5.9 2.68 9.77 4.07 11.61 4.17 1.54 0 5.48-1.42 11.83-4.26 6.35-2.84 11.7-4.14 16.05-3.9 12.04.64 21.64 5.38 28.79 14.22-10.55 6.42-15.67 15.42-15.36 27 .3 10.37 4.34 18.9 12.13 25.59 5.01 4.35 10.66 7.23 16.96 8.65-2.61 7.64-5.83 15.17-9.66 22.58zM119.22 33.64c0-7.23 2.64-13.91 7.92-20.03 5.28-6.12 11.72-9.88 19.32-11.28.3 1.13.45 2.21.45 3.24 0 7.23-2.73 14.07-8.19 20.52-5.46 6.45-12.04 10.15-19.74 11.1-.3-.9-.45-2.09-.45-3.55z" />
  </svg>
);

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
            <AppleLogo className="w-3.5 h-3.5 fill-white" />
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
          <AppleLogo className="w-4 h-4 fill-current" />
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
