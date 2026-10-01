'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, Wallet, PiggyBank, Sparkles } from '@/components/ui/OfficialIcons';
import { sound } from '@/utils/audio';
import { useRevolutStore } from '@/store/useRevolutStore';
import { Currency } from '@/types';

interface AccountCarouselProps {
  onOpenAccounts: () => void;
  onColorChange?: (color: 'cyan' | 'blue' | 'purple') => void;
}

export const AccountCarousel: React.FC<AccountCarouselProps> = ({
  onOpenAccounts,
  onColorChange,
}) => {
  const { accounts, activeCurrency, setActiveCurrency, rates } = useRevolutStore();
  const [activeIndex, setActiveIndex] = useState(() => ['RON', 'EUR', 'USD', 'GBP'].indexOf(activeCurrency));

  // Helper to dynamically format balances into { main, cents }
  const formatBalanceParts = (amount: number, symbol: string) => {
    const formatted = new Intl.NumberFormat('en-GB', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    const parts = formatted.split('.');
    return {
      main: parts[0],
      cents: `.${parts[1]} ${symbol}`,
    };
  };

  const ronParts = formatBalanceParts(accounts.RON?.balance ?? 1871.07, 'lei');
  const eurParts = formatBalanceParts(accounts.EUR?.balance ?? 0, '€');
  const usdParts = formatBalanceParts(accounts.USD?.balance ?? 0, '$');
  const gbpParts = formatBalanceParts(accounts.GBP?.balance ?? 0, '£');

  const allAccountsTotal =
    (accounts.RON?.balance ?? 1871.07) +
    (accounts.EUR?.balance ?? 0) * (rates['EUR_RON'] || 4.9765) +
    (accounts.USD?.balance ?? 0) * (rates['USD_RON'] || 4.582) +
    (accounts.GBP?.balance ?? 0) * (rates['GBP_RON'] || 5.891);
  const allParts = formatBalanceParts(allAccountsTotal, 'lei');

  const slides = [
    {
      id: 'ron',
      currency: 'RON' as Currency,
      tag: 'Personal · RON',
      main: ronParts.main,
      cents: ronParts.cents,
      sub: 'RO50 REVO 0000 1697 1825 8222',
      icon: Landmark,
      color: 'blue' as const,
    },
    {
      id: 'eur',
      currency: 'EUR' as Currency,
      tag: 'Personal · EUR',
      main: eurParts.main,
      cents: eurParts.cents,
      sub: 'LT82 REVO 0000 3250 0123 4567',
      icon: Landmark,
      color: 'blue' as const,
    },
    {
      id: 'usd',
      currency: 'USD' as Currency,
      tag: 'Personal · USD',
      main: usdParts.main,
      cents: usdParts.cents,
      sub: 'US44 REVO 0000 7819 4521 9901',
      icon: Landmark,
      color: 'blue' as const,
    },
    {
      id: 'gbp',
      currency: 'GBP' as Currency,
      tag: 'Personal · GBP',
      main: gbpParts.main,
      cents: gbpParts.cents,
      sub: 'GB98 REVO 0000 1192 8841 0001',
      icon: Landmark,
      color: 'blue' as const,
    },
    {
      id: 'all',
      currency: 'RON' as Currency,
      tag: 'All accounts · 4 accounts',
      main: allParts.main,
      cents: allParts.cents,
      sub: 'Combined multi-currency balance',
      icon: Wallet,
      color: 'cyan' as const,
    },
    {
      id: 'savings',
      currency: 'RON' as Currency,
      tag: 'Savings & Vaults',
      main: '4,25%',
      cents: ' p.a.',
      sub: 'Daily interest payout · Instant access',
      icon: PiggyBank,
      color: 'purple' as const,
    },
    {
      id: 'loan',
      currency: 'RON' as Currency,
      tag: 'Personal Loan',
      main: '200.000',
      cents: ' lei',
      sub: 'Pre-approved loan limit',
      icon: Sparkles,
      color: 'blue' as const,
    },
  ];

  // Sync active slide if currency changes outside (e.g. AccountsDrawer)
  useEffect(() => {
    const idx = slides.findIndex((s) => s.id === activeCurrency.toLowerCase());
    if (idx !== -1 && idx !== activeIndex) {
      setActiveIndex(idx);
    }
  }, [activeCurrency]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    const threshold = 40;
    let nextIdx = activeIndex;
    if (info.offset.x < -threshold && activeIndex < slides.length - 1) {
      nextIdx = activeIndex + 1;
    } else if (info.offset.x > threshold && activeIndex > 0) {
      nextIdx = activeIndex - 1;
    }
    if (nextIdx !== activeIndex) {
      setActiveIndex(nextIdx);
      sound.playKeypadClick();
      if (onColorChange) onColorChange(slides[nextIdx].color);
      if (['ron', 'eur', 'usd', 'gbp'].includes(slides[nextIdx].id)) {
        setActiveCurrency(slides[nextIdx].currency);
      }
    }
  };

  const currentSlide = slides[activeIndex] || slides[0];

  return (
    <div className="w-full flex flex-col items-center justify-center text-center mt-5 select-none overflow-hidden">
      {/* Swipeable Carousel Viewport */}
      <motion.div
        className="w-full cursor-grab active:cursor-grabbing px-2"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.25}
        onDragEnd={handleDragEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="flex flex-col items-center"
          >
            {/* Subtitle tag: Personal · RON */}
            <div className="text-[13px] text-white/70 font-medium tracking-wide">
              {currentSlide.tag}
            </div>

            {/* Large Bold Hero Balance matching Screenshot #1 */}
            <div
              onClick={() => {
                sound.playKeypadClick();
                onOpenAccounts();
              }}
              className="cursor-pointer group flex items-baseline justify-center mt-1 active:opacity-85 transition"
            >
              <span className="text-[46px] font-extrabold text-white tracking-tight leading-none">
                {currentSlide.main}
              </span>
              <span className="text-[34px] font-bold text-white tracking-tight ml-0.5">
                {currentSlide.cents}
              </span>
            </div>

            {/* IBAN Pill matching Screenshot #1: bank icon + white/90 IBAN */}
            <div className="mt-1.5 flex items-center justify-center gap-1.5 text-white/80 text-[12px] font-mono tracking-tight">
              <currentSlide.icon className="w-3.5 h-3.5 text-white/70 shrink-0" />
              <span className="truncate max-w-[280px]">{currentSlide.sub}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* "Accounts" Pill with Notification Badge (5) matching Screenshot #1 */}
      <div className="relative mt-4">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            sound.playKeypadClick();
            onOpenAccounts();
          }}
          className="relative px-5 py-1.5 rounded-full bg-[#1b2649]/80 hover:bg-[#253464] backdrop-blur-xl border border-white/15 text-[13px] font-semibold text-white shadow-lg transition"
        >
          Accounts
          {/* Notification badge 5 */}
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center shadow-md">
            5
          </span>
        </motion.button>
      </div>
    </div>
  );
};
