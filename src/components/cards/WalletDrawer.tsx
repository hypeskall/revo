'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Snowflake, Check, ShieldCheck } from '@/components/ui/OfficialIcons';
import { sound } from '@/utils/audio';
import { RevolutLogo } from '@/components/ui/RevolutLogo';

interface WalletDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNew: () => void;
}

export const WalletDrawer: React.FC<WalletDrawerProps> = ({ isOpen, onClose, onAddNew }) => {
  const cards = [
    {
      id: 'c1',
      title: 'Online Shopping',
      sub: '··0791, 12/30',
      color: 'bg-gradient-to-r from-blue-700 to-indigo-600',
      logo: 'R',
      scheme: 'mc',
    },
    {
      id: 'c2',
      title: 'Disposable',
      sub: 'Regenerates details after each use',
      color: 'bg-gradient-to-r from-neutral-600 to-neutral-800',
      logo: 'VISA',
      scheme: 'visa',
    },
    {
      id: 'c3',
      title: 'Online Shopping',
      sub: '··0177, 11/30',
      color: 'bg-gradient-to-b from-[#18080a] to-[#3a0a0f] border border-red-900/60',
      logo: 'R',
      scheme: 'visa',
      isDrip: true,
    },
    {
      id: 'c4',
      title: 'Surge',
      sub: '··0345, 01/31',
      color: 'bg-gradient-to-tr from-slate-950 via-slate-900 to-cyan-950 border border-cyan-500/40',
      logo: 'R',
      scheme: 'mc',
    },
    {
      id: 'c5',
      title: 'b',
      sub: '··2470, 01/31',
      color: 'bg-gradient-to-r from-orange-600 to-amber-500',
      logo: 'R',
      scheme: 'mc',
    },
    {
      id: 'c6',
      title: 'Maria · Lavender',
      sub: '··0781, 10/30',
      color: 'bg-gradient-to-r from-purple-300 to-indigo-200 text-black',
      logo: 'R',
      scheme: 'mc',
    },
    {
      id: 'c7',
      title: 'Shirt Sash',
      sub: 'Card is frozen',
      color: 'bg-gradient-to-tr from-slate-800 to-blue-950/70 border border-cyan-400/40 opacity-70',
      logo: 'VISA',
      scheme: 'visa',
      isFrozen: true,
    },
    {
      id: 'c8',
      title: 'Revolut Pay',
      sub: 'A secure 1-click checkout',
      color: 'bg-white text-black',
      logo: 'R Pay',
      isPay: true,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-[75] flex flex-col justify-end select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              sound.playKeypadClick();
              onClose();
            }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Wallet Drawer (Screenshot #3) */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-h-[92vh] bg-[#101318]/95 backdrop-blur-2xl rounded-t-[36px] border-t border-white/10 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Grab handle */}
            <div className="w-full flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Header: X button & Title */}
            <div className="px-5 pt-1 pb-3 flex items-center justify-between">
              <button
                onClick={() => {
                  sound.playKeypadClick();
                  onClose();
                }}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 active:scale-90 flex items-center justify-center text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="w-9" />
            </div>

            <div className="px-6 pb-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">Wallet</h2>
            </div>

            {/* Card List (Matching Screenshot #3) */}
            <div className="flex-1 overflow-y-auto px-5 py-2 space-y-2.5 pb-24 no-scrollbar">
              <div className="bg-[#14181f]/80 rounded-3xl p-3 border border-white/5 divide-y divide-white/[0.04]">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => sound.playKeypadClick()}
                    className="py-3 px-2 flex items-center justify-between hover:bg-white/[0.03] active:bg-white/[0.05] rounded-2xl transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Mini Card Graphic */}
                      <div
                        className={`w-14 h-9 rounded-lg ${card.color} flex flex-col justify-between p-1.5 shadow-md relative overflow-hidden shrink-0`}
                      >
                        <div className="flex justify-between items-start">
                          {card.logo === 'R' ? (
                            <RevolutLogo variant={card.color.includes('text-black') ? 'black' : 'white'} className="w-2.5 h-2.5" />
                          ) : (
                            <span className="text-[8px] font-bold tracking-tight">{card.logo}</span>
                          )}
                        </div>
                        {card.isFrozen ? (
                          <div className="absolute inset-0 bg-cyan-950/60 backdrop-blur-[1px] flex items-center justify-center">
                            <Snowflake className="w-3.5 h-3.5 text-cyan-300" />
                          </div>
                        ) : card.scheme === 'mc' ? (
                          <div className="flex gap-[1px] self-end">
                            <span className="w-2 h-2 rounded-full bg-red-500/80 -mr-1" />
                            <span className="w-2 h-2 rounded-full bg-amber-400/80" />
                          </div>
                        ) : card.scheme === 'visa' ? (
                          <span className="text-[7px] font-black italic self-end">VISA</span>
                        ) : null}
                      </div>

                      {/* Card Details */}
                      <div>
                        <div className="text-[14px] font-semibold text-white flex items-center gap-1.5">
                          <span>{card.title}</span>
                          {card.isFrozen && (
                            <span className="text-[10px] text-cyan-300 bg-cyan-500/20 px-1.5 py-0.2 rounded-full font-normal">
                              Frozen
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-neutral-400 mt-0.5">
                          {card.sub}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Floating + Add new Button (Screenshot #3) */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10">
              <button
                onClick={() => {
                  sound.playSuccessSound();
                  onAddNew();
                  onClose();
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold text-sm shadow-2xl hover:bg-neutral-100 active:scale-95 transition"
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
