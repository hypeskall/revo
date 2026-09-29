'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Currency } from '@/types';
import { formatCurrencyAmount } from '@/utils/formatters';
import { RevolutLogo } from '@/components/ui/RevolutLogo';
import { sound } from '@/utils/audio';

interface TransferSuccessModalProps {
  isOpen: boolean;
  recipientName: string;
  recipientAvatar?: string;
  amount: number;
  currency: Currency;
  onDismiss: () => void;
}

export const TransferSuccessModal: React.FC<TransferSuccessModalProps> = ({
  isOpen,
  recipientName,
  recipientAvatar,
  amount,
  currency,
  onDismiss,
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playSuccessSound();
    }
  }, [isOpen]);

  const formattedAmount = formatCurrencyAmount(amount, currency);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 z-[80] bg-[#020510] flex flex-col items-center justify-between p-6 select-none overflow-hidden"
        >
          {/* Ambient Lighting Dome */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_100%_80%_at_50%_35%,rgba(16,70,240,0.55)_0%,rgba(5,15,60,0.3)_50%,rgba(2,5,16,0)_85%)]" />

          <div className="w-full flex justify-end pt-4 relative z-10" />

          {/* Central Animation Area */}
          <div className="relative flex flex-col items-center justify-center my-auto w-full">
            {/* Concentric Ripple Wave Rings (Official Revolut Transfer Animation) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[0, 0.25, 0.5, 0.75].map((delay, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.6, opacity: 0.8 }}
                  animate={{
                    scale: [0.6, 2.8],
                    opacity: [0.75, 0],
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    delay: delay,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="absolute w-36 h-36 rounded-full border border-blue-400/40 shadow-[0_0_20px_rgba(0,140,255,0.3)]"
                />
              ))}

              {/* Radiant volumetric core glow */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-48 h-48 rounded-full bg-blue-500/20 blur-[40px] pointer-events-none"
              />
            </div>

            {/* Recipient Avatar Container with Spring Pop */}
            <div className="relative z-10 mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 22,
                  delay: 0.1,
                }}
                className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.6)] bg-gradient-to-tr from-amber-600 via-stone-800 to-amber-400 flex items-center justify-center relative"
              >
                {recipientAvatar ? (
                  <img
                    src={recipientAvatar}
                    alt={recipientName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=faces"
                    alt={recipientName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                )}
                <span className="text-white font-extrabold text-2xl">
                  {recipientName.charAt(0)}
                </span>
              </motion.div>

              {/* Glossy Green Checkmark Badge springing onto bottom-right rim */}
              <motion.div
                initial={{ scale: 0, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 18,
                  delay: 0.28,
                }}
                className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-[#00D26A] text-white flex items-center justify-center shadow-[0_0_20px_#00D26A] border-3 border-[#020510]"
              >
                <Check className="w-5 h-5 stroke-[3.5]" />
              </motion.div>
            </div>

            {/* Amount & Sent details */}
            <motion.div
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 28,
                delay: 0.25,
              }}
              className="text-center space-y-1 relative z-10"
            >
              <div className="text-sm text-white/70 font-medium tracking-tight">
                Sent to <span className="text-white font-semibold">{recipientName}</span>
              </div>

              {/* Large Bold Hero Balance */}
              <div className="text-[44px] font-extrabold text-white tracking-tight leading-none pt-1">
                {formattedAmount}
              </div>

              {/* Revolut Instant Badge */}
              <div className="pt-3 flex items-center justify-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/10 text-xs text-white/80">
                  <RevolutLogo variant="white" className="w-3.5 h-3.5" />
                  <span className="font-medium">Sent with Revolut · Instant</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Action Button */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            style={{
              paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)',
            }}
            className="w-full relative z-10"
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onDismiss}
              className="w-full py-4 rounded-full bg-white text-black font-bold text-base shadow-[0_10px_30px_rgba(255,255,255,0.2)] hover:bg-neutral-100 transition active:scale-95"
            >
              Done
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
