'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, CreditCard, ChevronRight, Loader2 } from 'lucide-react';
import { Currency } from '@/types';
import { formatCurrencyAmount } from '@/utils/formatters';
import { sound } from '@/utils/audio';

import { AppleLogo } from '@/components/ui/AppleLogo';

interface ApplePaySheetProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  currency: Currency;
  onSuccess: () => void;
}

export const ApplePaySheet: React.FC<ApplePaySheetProps> = ({
  isOpen,
  onClose,
  amount,
  currency,
  onSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const formattedFormalAmount = formatCurrencyAmount(amount, currency, {
    useFormalCode: true,
  });

  const handleConfirm = () => {
    if (isProcessing || isDone) return;
    sound.playKeypadClick();
    setIsProcessing(true);

    // Simulate 1.2s Apple Pay authentication
    setTimeout(() => {
      sound.playSuccessSound();
      setIsProcessing(false);
      setIsDone(true);

      setTimeout(() => {
        setIsDone(false);
        onSuccess();
      }, 900);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-[70] flex flex-col justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Apple Pay Sheet (Screenshot #3) */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="relative w-full bg-[#18191B] rounded-t-[36px] border-t border-white/[0.1] px-5 pt-3 pb-8 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Grab handle */}
            <div className="w-full flex justify-center pb-2">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Top Bar with X and Apple Pay logo */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  sound.playKeypadClick();
                  onClose();
                }}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5 text-white font-bold tracking-tight text-lg">
                <AppleLogo variant="white" className="w-4 h-4" />
                <span>Pay</span>
              </div>

              <div className="w-8" />
            </div>

            {/* Payment Title & Amount */}
            <div className="text-center mt-3 mb-4">
              <div className="text-xs text-neutral-400 font-medium">Pay Revolut</div>
              <div className="text-3xl font-bold text-white tracking-tight mt-0.5">
                {formattedFormalAmount}
              </div>
            </div>

            {/* Stacked Cards Preview (Matching Screenshot #3) */}
            <div className="relative h-32 w-full flex items-center justify-center my-2 overflow-visible">
              {/* Back Card (Blue / Cyan) */}
              <div className="absolute w-44 h-28 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-400 shadow-md transform -translate-x-12 -rotate-12 scale-90 opacity-70 border border-white/20" />

              {/* Back Card Right (McLaren Yellow / Orange) */}
              <div className="absolute w-44 h-28 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-yellow-400 shadow-md transform translate-x-12 rotate-12 scale-90 opacity-70 border border-white/20" />

              {/* Center Main Card (Blood Drip Virtual Card) */}
              <div className="relative z-10 w-52 h-32 rounded-xl bg-gradient-to-b from-[#111111] via-[#1a0a0a] to-[#2d0000] p-3 shadow-2xl border border-red-900/40 flex flex-col justify-between overflow-hidden">
                {/* Blood drip graphic overlay */}
                <div className="absolute inset-0 opacity-80 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-600/40 via-red-900/20 to-transparent" />
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-xs font-bold text-white tracking-wide">Revolut</span>
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold">
                    Virtual
                  </span>
                </div>

                <div className="relative z-10 flex items-center justify-between text-white">
                  <span className="text-[11px] font-mono tracking-widest text-neutral-300">
                    •••• 0177
                  </span>
                  <span className="text-xs font-black italic tracking-wider text-white">
                    VISA
                  </span>
                </div>
              </div>
            </div>

            {/* Other cards link */}
            <div className="text-center mt-1 mb-3">
              <button
                type="button"
                onClick={() => sound.playKeypadClick()}
                className="text-xs text-neutral-400 hover:text-white transition font-medium"
              >
                Other Cards & Payment Options
              </button>
            </div>

            {/* Payment Method Selector Card */}
            <div className="bg-[#24262A] rounded-2xl p-3.5 border border-white/[0.05] flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Revolut Visa</div>
                  <div className="text-xs text-neutral-400 font-medium">
                    Pay {formattedFormalAmount}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </div>

            {/* Total Row */}
            <div className="flex items-center justify-between px-1 text-xs text-neutral-400 mb-4">
              <span>Total</span>
              <span className="font-semibold text-white">{formattedFormalAmount}</span>
            </div>

            {/* Confirm button / Side button indicator */}
            <div className="flex flex-col items-center">
              {isDone ? (
                <div className="flex items-center gap-2 text-emerald-400 font-semibold py-3 animate-bounce">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span>Done</span>
                </div>
              ) : isProcessing ? (
                <div className="flex items-center gap-2 text-white font-medium py-3">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                  <span>Authorizing with Apple Pay...</span>
                </div>
              ) : (
                <button
                  onClick={handleConfirm}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-white text-black font-semibold text-sm active:scale-[0.98] transition shadow-lg hover:bg-neutral-100"
                >
                  <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center text-blue-600 text-[10px]">
                    ←
                  </div>
                  <span>Confirm with Side Button</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
