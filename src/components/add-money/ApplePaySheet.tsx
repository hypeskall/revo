'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, CreditCard, ChevronRight, Loader2 } from 'lucide-react';
import { Currency } from '@/types';
import { formatCurrencyAmount } from '@/utils/formatters';
import { sound } from '@/utils/audio';

interface ApplePaySheetProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  currency: Currency;
  onSuccess: () => void;
}

const AppleLogo = ({ className = 'w-4 h-4 fill-current' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 170 170">
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.6-7.85-11.75-14.42-6.52-10.43-11.53-21.78-15.03-34.05-3.5-12.27-5.25-23.77-5.25-34.5 0-14.56 3.73-26.69 11.19-36.39 7.46-9.7 16.92-14.67 28.37-14.92 5.09 0 10.58 1.34 16.48 4.02 5.9 2.68 9.77 4.07 11.61 4.17 1.54 0 5.48-1.42 11.83-4.26 6.35-2.84 11.7-4.14 16.05-3.9 12.04.64 21.64 5.38 28.79 14.22-10.55 6.42-15.67 15.42-15.36 27 .3 10.37 4.34 18.9 12.13 25.59 5.01 4.35 10.66 7.23 16.96 8.65-2.61 7.64-5.83 15.17-9.66 22.58zM119.22 33.64c0-7.23 2.64-13.91 7.92-20.03 5.28-6.12 11.72-9.88 19.32-11.28.3 1.13.45 2.21.45 3.24 0 7.23-2.73 14.07-8.19 20.52-5.46 6.45-12.04 10.15-19.74 11.1-.3-.9-.45-2.09-.45-3.55z" />
  </svg>
);

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
                <AppleLogo className="w-4 h-4 fill-white" />
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
