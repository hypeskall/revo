'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRevolutStore } from '@/store/useRevolutStore';
import { Transaction } from '@/types';
import { formatCurrencyAmount } from '@/utils/formatters';
import { sound } from '@/utils/audio';
import { ArrowRight } from 'lucide-react';
import { AppleLogo } from '@/components/ui/AppleLogo';

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 28,
    },
  },
};

export const TransactionList: React.FC = () => {
  const { transactions, setSelectedTransactionDetail } = useRevolutStore();

  const getMerchantIcon = (tx: Transaction) => {
    if (tx.brand === 'Contact') {
      const isAndrei = tx.title.includes('Andrei');
      return (
        <div className="relative shrink-0">
          {isAndrei ? (
            <div className="w-11 h-11 rounded-full overflow-hidden border border-white/10 shadow-sm bg-neutral-800 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=96&h=96&fit=crop&crop=faces"
                alt="Andrei Durla"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-11 h-11 rounded-full overflow-hidden border border-white/10 shadow-sm bg-amber-600 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=faces"
                alt="Rareș Roman"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Status Badge on bottom right corner: arrow or R logo */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white text-black flex items-center justify-center shadow-md">
            {isAndrei ? (
              <span className="text-[9px] font-black leading-none">R</span>
            ) : (
              <ArrowRight className="w-2.5 h-2.5 stroke-[3]" />
            )}
          </div>
        </div>
      );
    }

    const isApple = tx.brand === 'Apple' || tx.title.toLowerCase().includes('apple');

    // Clean vector SVGs from simpleicons
    const iconSlugMap: Record<string, string> = {
      Netflix: 'netflix',
      Uber: 'uber',
      Steam: 'steam',
      Lidl: 'lidl',
    };

    const slug = iconSlugMap[tx.brand];

    return (
      <div className="w-11 h-11 rounded-full bg-white/10 border border-white/5 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
        {isApple ? (
          <AppleLogo variant="white" className="w-5 h-5" />
        ) : slug ? (
          <img
            src={`https://cdn.simpleicons.org/${slug}/FFFFFF`}
            alt={tx.title}
            className="w-5 h-5 object-contain"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : tx.amount > 0 ? (
          <div className="w-5 h-5 rounded-full bg-[#00E676]/20 text-[#00E676] flex items-center justify-center text-xs font-bold">
            ↓
          </div>
        ) : (
          <span className="text-white text-xs font-bold">{tx.title[0]}</span>
        )}
      </div>
    );
  };

  return (
    // 6. Bottom Glass Card Sheet with Staggered Entrance
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full bg-[#090d12]/95 backdrop-blur-2xl rounded-t-[32px] border-t border-white/10 p-5 mt-4 min-h-[500px] pb-32"
    >
      {/* Sheet Handle */}
      <div className="w-full flex justify-center -mt-1 pb-3">
        <div className="w-10 h-1 bg-white/20 rounded-full" />
      </div>

      <div className="flex items-center justify-between text-xs font-semibold text-neutral-400 pb-2">
        <span className="text-sm font-bold text-white">Transactions</span>
        <button
          onClick={() => sound.playKeypadClick()}
          className="text-cyan-400 hover:text-cyan-300 transition text-xs font-medium"
        >
          See all
        </button>
      </div>

      {/* Flat List Layout with Staggered Fade-Slide Animation */}
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="show"
        className="divide-y divide-white/[0.04]"
      >
        {/* Contact Row 1: Rareș Roman (Screenshot #4) */}
        <motion.div
          variants={itemVariants}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            sound.playKeypadClick();
            if (transactions[0]) setSelectedTransactionDetail(transactions[0]);
          }}
          className="py-3.5 flex items-center justify-between hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            {getMerchantIcon({
              id: 'c-rares',
              title: 'Rareș Roman',
              subtitle: 'Today, 15:15 · Sent from Revolut',
              amount: -1,
              currency: 'RON',
              date: 'Today',
              timestamp: '15:15',
              category: 'Transfers',
              brand: 'Contact',
              isIncoming: false,
              status: 'completed',
              rawDate: Date.now(),
            })}
            <div className="min-w-0">
              <div className="text-[15px] font-semibold text-white tracking-tight truncate">
                Rareș Roman
              </div>
              <div className="text-xs text-white/50 truncate mt-0.5">
                Today, 15:15 · Sent from Revolut
              </div>
            </div>
          </div>
          <div className="text-right shrink-0 pl-3">
            <span className="text-[15px] font-semibold text-white tracking-tight">
              -1 lei
            </span>
          </div>
        </motion.div>

        {/* Contact Row 2: Andrei Durla (Screenshot #4) */}
        <motion.div
          variants={itemVariants}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            sound.playKeypadClick();
            if (transactions[1]) setSelectedTransactionDetail(transactions[1]);
          }}
          className="py-3.5 flex items-center justify-between hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            {getMerchantIcon({
              id: 'c-andrei-d',
              title: 'Andrei Durla',
              subtitle: 'Today, 10:21 · Sent from Revolut',
              amount: -46,
              currency: 'RON',
              date: 'Today',
              timestamp: '10:21',
              category: 'Transfers',
              brand: 'Contact',
              isIncoming: false,
              status: 'completed',
              rawDate: Date.now(),
            })}
            <div className="min-w-0">
              <div className="text-[15px] font-semibold text-white tracking-tight truncate">
                Andrei Durla
              </div>
              <div className="text-xs text-white/50 truncate mt-0.5">
                Today, 10:21 · Sent from Revolut
              </div>
            </div>
          </div>
          <div className="text-right shrink-0 pl-3">
            <span className="text-[15px] font-semibold text-white tracking-tight">
              -46 lei
            </span>
          </div>
        </motion.div>

        {/* Dynamic & Merchant Transactions */}
        {transactions.map((tx) => {
          if (tx.title === 'Rareș Roman' && tx.amount === -1) return null;

          const isPositive = tx.amount > 0;
          return (
            <motion.div
              key={tx.id}
              variants={itemVariants}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                sound.playKeypadClick();
                setSelectedTransactionDetail(tx);
              }}
              className="py-3.5 flex items-center justify-between hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {getMerchantIcon(tx)}
                <div className="min-w-0">
                  <div className="text-[15px] font-semibold text-white tracking-tight truncate">
                    {tx.title}
                  </div>
                  <div className="text-xs text-white/50 truncate mt-0.5">
                    {tx.date}, {tx.timestamp} · {tx.subtitle}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0 pl-3">
                <div
                  className={`text-[15px] font-semibold tracking-tight ${
                    isPositive ? 'text-[#00E676]' : 'text-white'
                  }`}
                >
                  {isPositive ? '+ ' : ''}
                  {formatCurrencyAmount(tx.amount, tx.currency)}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};
