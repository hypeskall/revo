'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useRevolutStore } from '@/store/useRevolutStore';
import {
  Search,
  BarChart2,
  CreditCard,
  Landmark,
  Plus,
  Shuffle,
  MoreHorizontal,
  X,
  Users,
} from 'lucide-react';
import { sound } from '@/utils/audio';
import { WalletDrawer } from '@/components/cards/WalletDrawer';
import { AccountCarousel } from './AccountCarousel';

interface BalanceHeroProps {
  onColorChange?: (color: 'cyan' | 'blue' | 'purple') => void;
}

export const BalanceHero: React.FC<BalanceHeroProps> = ({ onColorChange }) => {
  const {
    setAccountsDrawerOpen,
    setAddMoneyOpen,
    setTransferOpen,
    setExchangeOpen,
    setGodModeOpen,
    createNewCard,
  } = useRevolutStore();

  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [showPromo, setShowPromo] = useState(true);

  // Triple-tap or long-press detector for profile avatar to launch "God Mode"
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleAvatarTouchStart = () => {
    longPressTimerRef.current = setTimeout(() => {
      sound.playSuccessSound();
      setGodModeOpen(true);
    }, 500);
  };

  const handleAvatarTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };

  const handleAvatarClick = () => {
    sound.playKeypadClick();
    tapCountRef.current += 1;
    if (tapCountRef.current === 1) {
      tapTimerRef.current = setTimeout(() => {
        tapCountRef.current = 0;
      }, 400);
    } else if (tapCountRef.current >= 3) {
      tapCountRef.current = 0;
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
      sound.playSuccessSound();
      setGodModeOpen(true);
    }
  };

  // Quick Action Buttons (4-Grid matching Screenshot #4) with whileTap={{ scale: 0.94 }}
  const quickActions = [
    {
      label: 'Add money',
      icon: Plus,
      onClick: () => {
        sound.playKeypadClick();
        setAddMoneyOpen(true);
      },
    },
    {
      label: 'Move',
      icon: Shuffle,
      onClick: () => {
        sound.playKeypadClick();
        setTransferOpen(true);
      },
    },
    {
      label: 'Details',
      icon: Landmark,
      onClick: () => {
        sound.playKeypadClick();
        setAccountsDrawerOpen(true);
      },
    },
    {
      label: 'More',
      icon: MoreHorizontal,
      onClick: () => {
        sound.playKeypadClick();
        setExchangeOpen(true);
      },
    },
  ];

  return (
    <div
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 14px)',
      }}
      className="relative z-10 w-full flex flex-col px-4"
    >
      {/* 1. Top Header Bar (Screenshot #4) */}
      <div className="flex items-center justify-between gap-2.5 h-12">
        {/* Left: Avatar with glowing red notification dot */}
        <div className="relative shrink-0">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handleAvatarClick}
            onTouchStart={handleAvatarTouchStart}
            onTouchEnd={handleAvatarTouchEnd}
            onMouseDown={handleAvatarTouchStart}
            onMouseUp={handleAvatarTouchEnd}
            className="w-10 h-10 rounded-full overflow-hidden border border-white/20 relative flex items-center justify-center bg-gradient-to-tr from-amber-700 via-stone-800 to-amber-400 shadow-sm"
            title="Profile (Triple-tap for God Mode)"
          >
            <span className="text-white font-bold text-sm">M</span>
          </motion.button>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#FF3B30] rounded-full border-2 border-[#06090e] shadow-[0_0_8px_#FF3B30]" />
        </div>

        {/* Center: Frosted glass Search pill */}
        <div className="flex-1 max-w-[210px]">
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-full px-3.5 py-1.5 flex items-center gap-2 text-white/70 shadow-sm">
            <Search className="w-3.5 h-3.5 text-white/70" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent text-xs text-white placeholder-white/60 focus:outline-none w-full"
            />
          </div>
        </div>

        {/* Right: Two circular frosted buttons (BarChart & CreditCard) */}
        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => sound.playKeypadClick()}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition"
            title="Analytics"
          >
            <BarChart2 className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              sound.playKeypadClick();
              setIsWalletOpen(true);
            }}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition"
            title="Wallet & Cards"
          >
            <CreditCard className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* 2. Swipeable Account Carousel with Spring Physics */}
      <AccountCarousel
        onOpenAccounts={() => setAccountsDrawerOpen(true)}
        onColorChange={onColorChange}
      />

      {/* 3. Quick Action Glass Buttons (4-Grid) with whileTap={{ scale: 0.94 }} */}
      <div className="w-full px-2 mt-5">
        <div className="flex items-center justify-between max-w-[340px] mx-auto">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <div key={action.label} className="flex flex-col items-center">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  type="button"
                  onClick={action.onClick}
                  className="w-14 h-14 rounded-full bg-white/[0.18] backdrop-blur-2xl border border-white/30 flex items-center justify-center text-white shadow-[0_8px_25px_rgba(0,180,255,0.22)] hover:bg-white/[0.24] transition-all"
                >
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </motion.button>
                <span className="text-[12px] text-white/80 font-medium text-center mt-2 tracking-tight">
                  {action.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Promo Banner Card (Screenshot #4) with whileTap={{ scale: 0.98 }} */}
      {showPromo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 mb-1"
        >
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/10 p-4 relative overflow-hidden flex items-center justify-between shadow-xl cursor-pointer"
          >
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPromo(false);
              }}
              className="absolute top-2.5 right-3 text-white/40 hover:text-white transition z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Promo text */}
            <div className="pr-3 max-w-[230px]">
              <h3 className="text-[15px] font-bold text-white tracking-tight leading-snug">
                Settle up without the stress
              </h3>
              <p className="text-xs text-white/60 mt-1 leading-normal">
                Get paid back in a tap for one-off or ongoing expenses
              </p>
            </div>

            {/* 3D Smartphone Render Graphic */}
            <div className="relative w-16 h-20 shrink-0 flex items-center justify-center">
              <div className="w-14 h-20 rounded-2xl bg-gradient-to-tr from-neutral-800 to-neutral-700 border-2 border-neutral-600 shadow-2xl flex flex-col items-center justify-center p-1 relative transform rotate-6">
                <div className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center shadow-inner">
                  <Users className="w-4 h-4 text-white/90" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* 3 Pagination dots below promo card */}
          <div className="flex items-center justify-center gap-1.5 mt-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
          </div>
        </motion.div>
      )}

      {/* Wallet Cards Sheet */}
      <WalletDrawer
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        onAddNew={() => createNewCard('virtual')}
      />
    </div>
  );
};
