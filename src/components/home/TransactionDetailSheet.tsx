'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRevolutStore } from '@/store/useRevolutStore';
import { formatCurrencyAmount } from '@/utils/formatters';
import { X, CheckCircle2, Split, RotateCcw, HelpCircle, Receipt, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { sound } from '@/utils/audio';

export const TransactionDetailSheet: React.FC = () => {
  const { selectedTransactionDetail, setSelectedTransactionDetail, setTransferOpen, setSelectedContactForTransfer, contacts } =
    useRevolutStore();

  if (!selectedTransactionDetail) return null;
  const tx = selectedTransactionDetail;

  const handleRepeat = () => {
    sound.playKeypadClick();
    if (tx.contactId) {
      const contact = contacts.find((c) => c.id === tx.contactId);
      if (contact) {
        setSelectedTransactionDetail(null);
        setSelectedContactForTransfer(contact);
        setTransferOpen(true);
        return;
      }
    }
    setSelectedTransactionDetail(null);
    setTransferOpen(true);
  };

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 flex flex-col justify-end">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            sound.playKeypadClick();
            setSelectedTransactionDetail(null);
          }}
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        />

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          drag="y"
          dragConstraints={{ top: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.y > 120) {
              setSelectedTransactionDetail(null);
            }
          }}
          style={{
            paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 24px)',
          }}
          className="relative w-full max-h-[85vh] bg-[#14171A] rounded-t-[32px] border-t border-white/[0.08] p-5 flex flex-col overflow-hidden"
        >
          {/* Grab handle */}
          <div className="w-full flex justify-center pb-2">
            <div className="w-10 h-1 bg-white/20 rounded-full" />
          </div>

          {/* Top header */}
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Completed</span>
            </div>
            <button
              onClick={() => {
                sound.playKeypadClick();
                setSelectedTransactionDetail(null);
              }}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-neutral-300 active:scale-90 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Amount and title hero */}
          <div className="text-center py-4">
            <div className="text-3xl font-bold text-white tracking-tight">
              {formatCurrencyAmount(tx.amount, tx.currency, { includeSign: true })}
            </div>
            <div className="text-base font-semibold text-white/90 mt-1">{tx.title}</div>
            <div className="text-xs text-neutral-400 mt-0.5">
              {tx.date} · {tx.timestamp}
            </div>
          </div>

          {/* Action buttons: Split bill, Repeat, Receipt */}
          <div className="grid grid-cols-3 gap-2.5 my-3">
            <button
              onClick={() => sound.playKeypadClick()}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#1D2126] hover:bg-[#252A30] active:scale-95 transition border border-white/[0.04]"
            >
              <Split className="w-5 h-5 text-blue-400 mb-1" />
              <span className="text-[11px] font-medium text-white">Split bill</span>
            </button>
            <button
              onClick={handleRepeat}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#1D2126] hover:bg-[#252A30] active:scale-95 transition border border-white/[0.04]"
            >
              <RotateCcw className="w-5 h-5 text-emerald-400 mb-1" />
              <span className="text-[11px] font-medium text-white">Repeat</span>
            </button>
            <button
              onClick={() => sound.playKeypadClick()}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#1D2126] hover:bg-[#252A30] active:scale-95 transition border border-white/[0.04]"
            >
              <Receipt className="w-5 h-5 text-amber-400 mb-1" />
              <span className="text-[11px] font-medium text-white">Receipt</span>
            </button>
          </div>

          {/* Details list */}
          <div className="bg-[#191D21] rounded-2xl p-4 border border-white/[0.04] space-y-3 text-xs mt-2">
            <div className="flex items-center justify-between text-neutral-300">
              <span className="text-neutral-400">Category</span>
              <span className="font-medium text-white bg-white/5 px-2 py-0.5 rounded-full">
                {tx.category}
              </span>
            </div>
            <div className="flex items-center justify-between text-neutral-300">
              <span className="text-neutral-400">Payment method</span>
              <span className="font-medium text-white">Revolut Virtual Card</span>
            </div>
            <div className="flex items-center justify-between text-neutral-300">
              <span className="text-neutral-400">Status</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                {tx.isIncoming ? (
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                ) : (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                )}
                Completed
              </span>
            </div>
            {tx.contactName && (
              <div className="flex items-center justify-between text-neutral-300">
                <span className="text-neutral-400">Recipient</span>
                <span className="font-medium text-white">{tx.contactName}</span>
              </div>
            )}
          </div>

          {/* Help link */}
          <button
            onClick={() => sound.playKeypadClick()}
            className="mt-4 flex items-center justify-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition py-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Need help with this transaction?</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
