'use client';

import React, { useState } from 'react';
import { useRevolutStore } from '@/store/useRevolutStore';
import { Plus, ArrowLeftRight, Shuffle, MoreHorizontal, Copy, Check, ShieldCheck, X } from 'lucide-react';
import { sound } from '@/utils/audio';
import { motion, AnimatePresence } from 'framer-motion';

export const QuickActions: React.FC = () => {
  const { setAddMoneyOpen, setTransferOpen, setExchangeOpen, activeCurrency, accounts } = useRevolutStore();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const currentAccount = accounts[activeCurrency];

  const handleCopy = (text: string, field: string) => {
    sound.playKeypadClick();
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const actions = [
    {
      label: 'Add money',
      icon: Plus,
      onClick: () => {
        sound.playKeypadClick();
        setAddMoneyOpen(true);
      },
    },
    {
      label: 'Transfer',
      icon: ArrowLeftRight,
      onClick: () => {
        sound.playKeypadClick();
        setTransferOpen(true);
      },
    },
    {
      label: 'Exchange',
      icon: Shuffle,
      onClick: () => {
        sound.playKeypadClick();
        setExchangeOpen(true);
      },
    },
    {
      label: 'Details',
      icon: MoreHorizontal,
      onClick: () => {
        sound.playKeypadClick();
        setShowDetailsModal(true);
      },
    },
  ];

  return (
    <>
      {/* 4 Small Circles with labels underneath (Revolut 10) */}
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between max-w-[340px] mx-auto">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <div key={action.label} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={action.onClick}
                  className="w-12 h-12 rounded-full bg-[#1E1E20] hover:bg-[#2A2A2D] flex items-center justify-center text-white active:scale-90 transition-all duration-150 border border-white/5 shadow-sm"
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </button>
                <span className="text-[11px] text-neutral-400 font-medium text-center mt-1.5 tracking-tight">
                  {action.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Account Details Sheet - constrained to 430px container */}
      <AnimatePresence>
        {showDetailsModal && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailsModal(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-full max-h-[85vh] bg-[#14171A] rounded-t-[32px] border-t border-white/[0.08] p-5 pb-10 flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-500" />
                  <h3 className="text-base font-bold text-white">
                    {currentAccount?.name} Details
                  </h3>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-neutral-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <div className="p-3.5 rounded-2xl bg-[#1C2025] border border-white/[0.04] flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-neutral-400">Beneficiary</div>
                    <div className="text-sm font-semibold text-white mt-0.5">Mihai Andrei</div>
                  </div>
                  <button
                    onClick={() => handleCopy('Mihai Andrei', 'beneficiary')}
                    className="p-2 text-neutral-400 hover:text-white"
                  >
                    {copiedField === 'beneficiary' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#1C2025] border border-white/[0.04] flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-neutral-400">IBAN ({activeCurrency})</div>
                    <div className="text-sm font-mono font-medium text-white mt-0.5">
                      {activeCurrency === 'RON'
                        ? 'RO49 REVO 0000 1234 5678 9901'
                        : activeCurrency === 'EUR'
                        ? 'LT82 3250 0123 4567 8901'
                        : activeCurrency === 'GBP'
                        ? 'GB29 REVO 0099 1234 5678 90'
                        : 'US12 REVO 0001 2345 6789 01'}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleCopy(
                        activeCurrency === 'RON'
                          ? 'RO49 REVO 0000 1234 5678 9901'
                          : 'LT82 3250 0123 4567 8901',
                        'iban'
                      )
                    }
                    className="p-2 text-neutral-400 hover:text-white"
                  >
                    {copiedField === 'iban' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#1C2025] border border-white/[0.04] flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-neutral-400">BIC / SWIFT</div>
                    <div className="text-sm font-mono font-medium text-white mt-0.5">
                      {activeCurrency === 'RON' ? 'REVOROB1' : 'REVOB121'}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy('REVOROB1', 'bic')}
                    className="p-2 text-neutral-400 hover:text-white"
                  >
                    {copiedField === 'bic' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
