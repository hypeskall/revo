'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRevolutStore } from '@/store/useRevolutStore';
import { BankCard, CardTheme } from '@/types';
import { Snowflake, Eye, EyeOff, Plus, Copy, Check, ShieldCheck, Wifi, Sparkles, X } from 'lucide-react';
import { sound } from '@/utils/audio';

export const CardsScreen: React.FC = () => {
  const { cards, toggleFreezeCard, createNewCard } = useRevolutStore();
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isNewCardModalOpen, setIsNewCardModalOpen] = useState(false);

  const activeCard: BankCard | undefined = cards[activeCardIndex] || cards[0];

  const handleCopy = (text: string, field: string) => {
    sound.playKeypadClick();
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleToggleFreeze = () => {
    if (!activeCard) return;
    const willBeFrozen = !activeCard.isFrozen;
    sound.playToggleSound(willBeFrozen);
    toggleFreezeCard(activeCard.id);
  };

  const handleCreateNew = (type: 'virtual' | 'disposable') => {
    sound.playSuccessSound();
    createNewCard(type);
    setIsNewCardModalOpen(false);
    setActiveCardIndex(0);
  };

  // Card background styles based on theme
  const getCardStyle = (theme: CardTheme, isFrozen: boolean) => {
    if (isFrozen) {
      return 'bg-gradient-to-tr from-slate-900 via-slate-800 to-blue-950/60 opacity-65 border-cyan-400/40 shadow-[0_0_20px_rgba(56,189,248,0.2)]';
    }

    switch (theme) {
      case 'blood_drip':
        return 'bg-gradient-to-b from-[#181112] via-[#240e11] to-[#3a080d] border-red-900/60 shadow-[0_15px_35px_rgba(185,28,28,0.25)]';
      case 'platinum':
        return 'bg-gradient-to-tr from-[#1a1c20] via-[#2d3238] to-[#121417] border-white/20 shadow-[0_15px_35px_rgba(255,255,255,0.08)]';
      case 'neon_purple':
        return 'bg-gradient-to-tr from-[#240b36] via-[#48126b] to-[#180829] border-purple-500/50 shadow-[0_15px_35px_rgba(168,85,247,0.3)]';
      case 'cyan_glow':
        return 'bg-gradient-to-tr from-[#0b2436] via-[#104b6b] to-[#081f29] border-cyan-500/50 shadow-[0_15px_35px_rgba(6,182,212,0.3)]';
      default:
        return 'bg-gradient-to-tr from-[#16191d] to-[#252a32] border-white/10';
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between px-5 pt-3 pb-24 overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-3">
          <h1 className="text-2xl font-bold text-white tracking-tight">Cards</h1>
          <button
            onClick={() => {
              sound.playKeypadClick();
              setIsNewCardModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 text-xs font-semibold active:scale-95 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New card</span>
          </button>
        </div>

        {/* Card Carousel Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
          {cards.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => {
                sound.playKeypadClick();
                setActiveCardIndex(idx);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition active:scale-95 ${
                activeCardIndex === idx
                  ? 'bg-white text-black font-semibold shadow'
                  : 'bg-[#191C1F] text-neutral-400 hover:text-white border border-white/[0.04]'
              }`}
            >
              {c.name} (•• {c.last4})
            </button>
          ))}
        </div>

        {/* 3D Interactive Card Preview */}
        {activeCard && (
          <div className="py-4 flex justify-center">
            <motion.div
              key={activeCard.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className={`relative w-full max-w-[340px] h-[210px] rounded-[24px] p-5 border flex flex-col justify-between overflow-hidden transition-all duration-300 ${getCardStyle(
                activeCard.theme,
                activeCard.isFrozen
              )}`}
            >
              {/* Glass frost overlay if frozen */}
              {activeCard.isFrozen && (
                <div className="absolute inset-0 bg-cyan-950/30 backdrop-blur-[2px] flex items-center justify-center z-20">
                  <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                    <Snowflake className="w-4 h-4 animate-spin" />
                    <span>Card Frozen</span>
                  </div>
                </div>
              )}

              {/* Decorative blood drip overlay for blood_drip theme */}
              {activeCard.theme === 'blood_drip' && !activeCard.isFrozen && (
                <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-red-600/20 blur-2xl pointer-events-none" />
              )}

              {/* Card Top Row: Revolut logo & Contactless & Chip */}
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white tracking-wider">Revolut</span>
                  <span className="text-[10px] text-neutral-300 uppercase tracking-widest bg-white/10 px-1.5 py-0.5 rounded font-medium">
                    {activeCard.type}
                  </span>
                </div>
                <Wifi className="w-4 h-4 text-white/70 rotate-90" />
              </div>

              {/* EMV Chip graphic */}
              <div className="relative z-10 w-10 h-7 rounded-md bg-gradient-to-tr from-amber-400 to-yellow-200 border border-amber-600/40 flex items-center justify-center overflow-hidden opacity-90 shadow-sm">
                <div className="w-full h-[1px] bg-amber-800/40 my-1" />
                <div className="absolute w-[1px] h-full bg-amber-800/40 left-1/3" />
                <div className="absolute w-[1px] h-full bg-amber-800/40 right-1/3" />
              </div>

              {/* Card Number & Expiry & CVV */}
              <div className="relative z-10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-mono tracking-widest text-white font-semibold">
                    {showDetails ? activeCard.fullNumber : `•••• •••• •••• ${activeCard.last4}`}
                  </div>
                  {showDetails && (
                    <button
                      onClick={() => handleCopy(activeCard.fullNumber.replace(/\s/g, ''), 'num')}
                      className="p-1 text-neutral-400 hover:text-white"
                      title="Copy Card Number"
                    >
                      {copiedField === 'num' ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-300 font-mono">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400 block font-sans">
                        Expires
                      </span>
                      <span>{showDetails ? activeCard.expiry : '••/••'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400 block font-sans">
                        CVV
                      </span>
                      <span>{showDetails ? activeCard.cvv : '•••'}</span>
                    </div>
                  </div>

                  <span className="text-base font-black italic tracking-wider text-white">
                    {activeCard.scheme.toUpperCase()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Card Controls Bar */}
        <div className="grid grid-cols-2 gap-3 mt-1">
          {/* Freeze / Unfreeze */}
          <button
            onClick={handleToggleFreeze}
            className={`py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold transition active:scale-95 border ${
              activeCard?.isFrozen
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30'
                : 'bg-[#191C1F] hover:bg-[#22272C] text-white border-white/[0.05]'
            }`}
          >
            <Snowflake className={`w-4 h-4 ${activeCard?.isFrozen ? 'animate-spin' : ''}`} />
            <span>{activeCard?.isFrozen ? 'Unfreeze' : 'Freeze'}</span>
          </button>

          {/* Show / Hide Details */}
          <button
            onClick={() => {
              sound.playKeypadClick();
              setShowDetails(!showDetails);
            }}
            className="py-3 px-4 rounded-2xl bg-[#191C1F] hover:bg-[#22272C] text-white border border-white/[0.05] flex items-center justify-center gap-2 text-sm font-semibold transition active:scale-95"
          >
            {showDetails ? (
              <>
                <EyeOff className="w-4 h-4 text-neutral-400" />
                <span>Hide details</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-neutral-400" />
                <span>Show details</span>
              </>
            )}
          </button>
        </div>

        {/* Card Settings List */}
        <div className="mt-4 bg-[#14171A] rounded-2xl border border-white/[0.04] divide-y divide-white/[0.03] text-xs">
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-white font-medium">Online transactions</span>
            </div>
            <span className="text-emerald-400 font-semibold">Enabled</span>
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Wifi className="w-4 h-4 text-blue-400" />
              <span className="text-white font-medium">Contactless payments</span>
            </div>
            <span className="text-emerald-400 font-semibold">Enabled</span>
          </div>
        </div>
      </div>

      {/* New Card Modal */}
      <AnimatePresence>
        {isNewCardModalOpen && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewCardModalOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-full bg-[#14171A] rounded-t-[32px] border-t border-white/[0.08] p-5 pb-8 flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <h3 className="text-lg font-bold text-white">Create New Card</h3>
                <button
                  onClick={() => setIsNewCardModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 mt-4">
                <button
                  onClick={() => handleCreateNew('virtual')}
                  className="w-full p-4 rounded-2xl bg-[#1C2025] hover:bg-[#252A30] active:scale-95 transition border border-white/[0.04] flex items-center gap-3 text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Virtual Card</div>
                    <div className="text-xs text-neutral-400">
                      Ideal for online subscriptions and recurrent shopping
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleCreateNew('disposable')}
                  className="w-full p-4 rounded-2xl bg-[#1C2025] hover:bg-[#252A30] active:scale-95 transition border border-white/[0.04] flex items-center gap-3 text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      Disposable Virtual Card
                    </div>
                    <div className="text-xs text-neutral-400">
                      Card details automatically refresh after every transaction
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
