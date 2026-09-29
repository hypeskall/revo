'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { Currency } from '@/types';
import { formatCurrencyAmount } from '@/utils/formatters';

interface TransferSuccessModalProps {
  isOpen: boolean;
  recipientName: string;
  amount: number;
  currency: Currency;
  onDismiss: () => void;
}

export const TransferSuccessModal: React.FC<TransferSuccessModalProps> = ({
  isOpen,
  recipientName,
  amount,
  currency,
  onDismiss,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[80] bg-black/95 flex flex-col items-center justify-center p-6 text-center select-none"
        >
          {/* Spring animated checkmark badge */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 340,
              damping: 18,
              delay: 0.1,
            }}
            className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-[0_0_40px_rgba(0,117,235,0.6)] mb-6"
          >
            <Check className="w-12 h-12 stroke-[3.5]" />
          </motion.div>

          {/* Amount and Recipient info */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="space-y-2"
          >
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {formatCurrencyAmount(amount, currency)}
            </h2>
            <p className="text-base text-neutral-300">
              Sent to <span className="font-semibold text-white">{recipientName}</span>
            </p>
            <p className="text-xs text-neutral-500 pt-1">
              Arrived instantly · Revolut to Revolut
            </p>
          </motion.div>

          {/* Dismiss button */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={onDismiss}
            className="mt-10 px-8 py-3.5 rounded-full bg-white text-black font-semibold text-sm active:scale-95 transition shadow-lg"
          >
            Done
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
