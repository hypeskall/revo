'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowUpRight, ArrowDownRight, Bitcoin, Sparkles, Plus, ArrowDownUp } from 'lucide-react';
import { sound } from '@/utils/audio';
import { useRevolutStore } from '@/store/useRevolutStore';
import { formatCurrencyAmount } from '@/utils/formatters';

export const CryptoScreen: React.FC = () => {
  const {setUiPanel,demoHoldings}=useRevolutStore();
  const cryptos = [
    {
      name: 'Bitcoin',
      ticker: 'BTC',
      price: '298.410 lei',
      change: '+3.42%',
      isUp: true,
      color: '#F7931A',
      icon: '₿',
    },
    {
      name: 'Ethereum',
      ticker: 'ETH',
      price: '12.450 lei',
      change: '+1.85%',
      isUp: true,
      color: '#627EEA',
      icon: 'Ξ',
    },
    {
      name: 'Solana',
      ticker: 'SOL',
      price: '680 lei',
      change: '+5.12%',
      isUp: true,
      color: '#14F195',
      icon: '◎',
    },
    {
      name: 'Ripple',
      ticker: 'XRP',
      price: '2,85 lei',
      change: '-0.41%',
      isUp: false,
      color: '#23292F',
      icon: '✕',
    },
  ];

  return (
    <div
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 14px)',
      }}
      className="w-full h-full flex flex-col px-4 pb-28 overflow-y-auto no-scrollbar relative select-none"
    >
      {/* Aurora glow matching theme */}
      <div
        className="absolute top-0 left-0 right-0 h-[400px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 130% 60% at 50% 18%, rgba(247, 147, 26, 0.3) 0%, rgba(0, 82, 255, 0.2) 45%, rgba(6, 9, 14, 0) 80%)',
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between gap-2.5 h-12">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg border border-amber-500/30">
            ₿
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Crypto</h2>
            <div className="text-[11px] text-white/50">Market Overview</div>
          </div>
        </div>

        <button
          aria-label="Search crypto"
          onClick={() => setUiPanel('crypto')}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Portfolio Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-[#0d141c]/80 backdrop-blur-xl rounded-3xl p-5 border border-white/10 shadow-2xl mt-5"
      >
        <div className="text-xs text-white/60 font-medium">Crypto Portfolio</div>
        <div className="text-3xl font-bold text-white tracking-tight mt-1">{formatCurrencyAmount(['BTC','ETH','SOL'].reduce((sum,ticker)=>sum+(demoHoldings[ticker]||0),0),'RON')}</div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mt-1">
          <ArrowUpRight className="w-4 h-4" />
          <span>Demo holdings · Fixed values</span>
        </div>

        {/* Action pills */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/[0.06]">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setUiPanel('crypto')}
            className="py-2.5 rounded-xl bg-white text-black font-semibold text-xs active:scale-95 transition flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Buy Crypto</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setUiPanel('crypto')}
            className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs active:scale-95 transition flex items-center justify-center gap-1.5"
          >
            <ArrowDownUp className="w-3.5 h-3.5" />
            <span>Swap</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Live Assets */}
      <div className="relative z-10 mt-6 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-neutral-400 px-1">
          <span>Popular Coins</span>
          <span className="text-cyan-400">See all 150+</span>
        </div>

        <div className="bg-[#090d12]/95 backdrop-blur-2xl rounded-3xl p-4 border border-white/10 divide-y divide-white/[0.04]">
          {cryptos.map((c) => (
            <motion.div
              key={c.ticker}
              whileTap={{ scale: 0.98 }}
              onClick={() => setUiPanel('crypto')}
              className="py-3 px-1 flex items-center justify-between hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm"
                  style={{ backgroundColor: `${c.color}25`, color: c.color }}
                >
                  {c.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{c.name}</div>
                  <div className="text-xs text-white/50">{c.ticker}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-semibold text-white">{c.price}</div>
                <div
                  className={`text-xs font-medium flex items-center justify-end gap-0.5 ${
                    c.isUp ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {c.isUp ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  <span>{c.change}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
