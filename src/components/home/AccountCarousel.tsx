'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, Sparkles, Wallet, PiggyBank } from 'lucide-react';
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
  const [activeIndex, setActiveIndex] = useState(0);

  // Helper to dynamically format balances into { main, cents }
  const formatBalanceParts = (amount: number, symbol: string) => {
    const formatted = new Intl.NumberFormat('ro-RO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    const parts = formatted.split(',');
    return {
      main: parts[0],
      cents: `,${parts[1]} ${symbol}`,
    };
  };

  const ronParts = formatBalanceParts(accounts.RON?.balance ?? 0, 'lei');
  const eurParts = formatBalanceParts(accounts.EUR?.balance ?? 0, '€');
  const usdParts = formatBalanceParts(accounts.USD?.balance ?? 0, '$');
  const gbpParts = formatBalanceParts(accounts.GBP?.balance ?? 0, '£');

  const allAccountsTotal =
    (accounts.RON?.balance ?? 0) +
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
      color: 'cyan' as const,
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
      color: 'cyan' as const,
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
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex flex-col items-center"
          >
            {/* Subtitle tag */}
            <div className="text-xs text-white/70 font-medium tracking-wide">
              {currentSlide.tag}
            </div>

            {/* Large Bold Hero Balance */}
            <div
              onClick={() => {
                sound.playKeypadClick();
                onOpenAccounts();
              }}
              className="cursor-pointer group flex items-baseline justify-center mt-1 active:opacity-85 transition"
            >
              <span className="text-[44px] font-bold text-white tracking-tight leading-none">
                {currentSlide.main}
              </span>
              <span className="text-[34px] font-semibold text-white/95 tracking-tight ml-0.5">
                {currentSlide.cents}
              </span>
            </div>

            {/* IBAN / Description Pill in cyan tint */}
            <div className="mt-1 flex items-center justify-center gap-1.5 text-cyan-200/80 text-[11px] font-mono tracking-tight">
              <currentSlide.icon className="w-3 h-3 text-cyan-300 shrink-0" />
              <span className="truncate max-w-[280px]">{currentSlide.sub}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* "Accounts" Pill with Notification Badge (5) */}
      <div className="relative mt-4">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            sound.playKeypadClick();
            onOpenAccounts();
          }}
          className="relative px-5 py-2 rounded-full bg-[#1b3b57]/60 hover:bg-[#204566]/70 backdrop-blur-xl border border-cyan-400/30 text-xs font-semibold text-white shadow-lg transition"
        >
          Accounts
          {/* Notification badge 5 */}
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center shadow-md">
            5
          </span>
        </motion.button>
      </div>

      {/* Dynamic Pagination Dots */}
      <div className="flex items-center gap-1.5 mt-3">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setActiveIndex(idx);
              sound.playKeypadClick();
              if (onColorChange) onColorChange(s.color);
              if (['ron', 'eur', 'usd', 'gbp'].includes(s.id)) {
                setActiveCurrency(s.currency);
              }
            }}
            className={`transition-all duration-200 ${
              activeIndex === idx
                ? 'w-4 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                : 'w-1.5 h-1.5 rounded-full bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
