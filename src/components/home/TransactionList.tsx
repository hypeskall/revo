'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRevolutStore } from '@/store/useRevolutStore';
import {
  ShoppingBag,
  RotateCcw,
  ArrowDownLeft,
  ArrowUpRight,
  Smartphone,
  ChevronRight,
  Coins,
  ShieldAlert,
  PiggyBank,
  TrendingUp,
  Bitcoin,
  Link2,
  Plus,
} from '@/components/ui/OfficialIcons';
import { sound } from '@/utils/audio';
import { RevolutLogo } from '@/components/ui/RevolutLogo';
import { WalletDrawer } from '@/components/cards/WalletDrawer';
import { formatCurrencyAmount } from '@/utils/formatters';

export const TransactionList: React.FC = () => {
  const {
    accounts,
    transactions,
    setSelectedTransactionDetail,
    setAccountsDrawerOpen,
    createNewCard,
  } = useRevolutStore();

  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [activeCardSlide, setActiveCardSlide] = useState(0);

  const ronBalance = accounts.RON?.balance ?? 1871.07;
  const formattedRon = new Intl.NumberFormat('ro-RO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(ronBalance);

  const recentTransactions = [...transactions]
    .sort((a, b) => b.rawDate - a.rawDate)
    .slice(0, 4);

  const getTransactionVisual = (brand: string, isIncoming: boolean) => {
    if (brand === 'Explee') {
      return { Icon: ShoppingBag, className: 'bg-[#ff3b7f] text-white' };
    }
    if (brand === 'Contact') {
      return {
        Icon: isIncoming ? ArrowDownLeft : ArrowUpRight,
        className: 'bg-[#5b5ce2] text-white',
      };
    }
    if (brand === 'Apple') {
      return { Icon: Smartphone, className: 'bg-white text-black' };
    }
    if (brand === 'Revolut') {
      return { Icon: Coins, className: 'bg-[#0b72ff] text-white' };
    }
    return { Icon: ShoppingBag, className: 'bg-white/10 text-white' };
  };

  return (
    <div className="w-full mt-3 px-4 pb-32 select-none">
      {/* Live activity: every simulated top-up, transfer and exchange appears here. */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="w-full bg-[#0a1228]/80 backdrop-blur-2xl rounded-3xl border border-white/10 p-4 shadow-xl"
      >
        <div className="space-y-3.5">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-xs font-semibold text-white/55">Recent activity</span>
            <span className="text-[11px] text-white/35">Sandbox</span>
          </div>

          {recentTransactions.map((transaction, index) => {
            const visual = getTransactionVisual(transaction.brand, transaction.isIncoming);
            const Icon = visual.Icon;
            const isVerification = transaction.category === 'Verification';

            return (
              <React.Fragment key={transaction.id}>
                {index > 0 && <div className="h-px bg-white/[0.05] w-full" />}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    sound.playKeypadClick();
                    setSelectedTransactionDetail(transaction);
                  }}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div className="flex min-w-0 items-center gap-3.5">
                    <div className="relative shrink-0">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center shadow-sm ${visual.className}`}>
                        <Icon className="w-5 h-5 stroke-[2]" />
                      </div>
                      {transaction.status === 'reverted' && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white text-black flex items-center justify-center shadow-md">
                          <RotateCcw className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="truncate text-[15px] font-semibold text-white tracking-tight">
                        {transaction.title}
                      </h4>
                      <p className="truncate text-xs text-white/50 mt-0.5">
                        {transaction.date}, {transaction.timestamp} · {transaction.status === 'reverted' ? 'Reverted' : transaction.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="pl-3 text-right shrink-0">
                    <span className={`text-[15px] font-semibold tracking-tight ${transaction.isIncoming ? 'text-white' : 'text-white'}`}>
                      {isVerification
                        ? 'Verified'
                        : formatCurrencyAmount(transaction.amount, transaction.currency, { includeSign: true })}
                    </span>
                  </div>
                </motion.button>
              </React.Fragment>
            );
          })}
        </div>
      </motion.div>

      {/* 2. Sub-account Maria Card (Screenshot #3: Square sub-account card) */}
      <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar py-1">
        <motion.div
          whileTap={{ scale: 0.96 }}
          className="w-[155px] h-[165px] shrink-0 rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/10 p-3.5 flex flex-col items-center justify-between shadow-xl cursor-pointer"
        >
          {/* Avatar with name pill overlay */}
          <div className="relative mt-1">
            <div className="w-13 h-13 rounded-full overflow-hidden border border-white/20 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=faces"
                alt="Maria"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#1b2649] border border-white/20 text-[10px] font-semibold text-white shadow-sm">
              Maria
            </div>
          </div>

          {/* Amount */}
          <div className="text-center mt-2">
            <span className="text-[16px] font-bold text-white tracking-tight">1,28 lei</span>
          </div>

          {/* Circular + button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              sound.playKeypadClick();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white border border-white/10 shadow-sm transition"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </motion.button>
        </motion.div>
      </div>

      {/* 3. Cards Carousel ("Cards >" - Screenshot #3) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-4 w-full rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/10 p-4 shadow-xl"
      >
        {/* Header */}
        <div
          onClick={() => {
            sound.playKeypadClick();
            setIsWalletOpen(true);
          }}
          className="flex items-center gap-1 cursor-pointer group mb-3.5"
        >
          <span className="text-sm font-bold text-white tracking-tight group-hover:text-white/80 transition">
            Cards
          </span>
          <ChevronRight className="w-4 h-4 text-white/50 group-hover:translate-x-0.5 transition" />
        </div>

        {/* 3 Mini Cards Horizontal Row */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Card 1: Online Shop... (··0177) - Blood Drip */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              sound.playKeypadClick();
              setIsWalletOpen(true);
            }}
            className="flex flex-col items-center cursor-pointer"
          >
            <div className="w-full h-15 rounded-xl bg-gradient-to-br from-[#1a0505] via-[#2d0000] to-black p-1.5 border border-red-900/40 relative overflow-hidden shadow-md flex flex-col justify-between">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-600/40 via-red-950/20 to-transparent pointer-events-none" />
              <div className="flex justify-end">
                <RevolutLogo className="w-3 h-3" />
              </div>
              <div className="flex justify-end">
                <span className="text-[8px] font-black italic tracking-wider text-white">
                  VISA
                </span>
              </div>
            </div>
            <div className="text-center mt-1.5">
              <div className="text-[11px] font-semibold text-white tracking-tight truncate max-w-[85px]">
                Online Shop...
              </div>
              <div className="text-[10px] text-white/50 font-mono">··0177</div>
            </div>
          </motion.div>

          {/* Card 2: Shirt Sash (··9349) - Light Blue Sash */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              sound.playKeypadClick();
              setIsWalletOpen(true);
            }}
            className="flex flex-col items-center cursor-pointer"
          >
            <div className="w-full h-15 rounded-xl bg-gradient-to-br from-[#4a7c9f] via-[#294c69] to-[#122434] p-1.5 border border-cyan-400/30 relative overflow-hidden shadow-md flex flex-col justify-between">
              {/* Sash diagonal line */}
              <div className="absolute top-0 right-3 w-3 h-20 bg-white/20 transform rotate-45 pointer-events-none" />
              <div className="flex items-center justify-between">
                <div className="w-3.5 h-3.5 rounded-full border border-white/40 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-red-600/80" />
                </div>
                <RevolutLogo className="w-3 h-3" />
              </div>
              <div className="flex justify-end">
                <span className="text-[8px] font-black italic tracking-wider text-white">
                  VISA
                </span>
              </div>
            </div>
            <div className="text-center mt-1.5">
              <div className="text-[11px] font-semibold text-white tracking-tight truncate max-w-[85px]">
                Shirt Sash
              </div>
              <div className="text-[10px] text-white/50 font-mono">··9349</div>
            </div>
          </motion.div>

          {/* Card 3: Surge (··0345) - Dark Neon Glow */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              sound.playKeypadClick();
              setIsWalletOpen(true);
            }}
            className="flex flex-col items-center cursor-pointer"
          >
            <div className="w-full h-15 rounded-xl bg-gradient-to-br from-[#05112a] via-[#091d44] to-[#020714] p-1.5 border border-blue-500/30 relative overflow-hidden shadow-md flex flex-col justify-between">
              <div className="absolute top-1 -left-2 w-8 h-8 rounded-full bg-cyan-400/30 blur-sm pointer-events-none" />
              <div className="flex justify-end">
                <RevolutLogo className="w-3 h-3" />
              </div>
              <div className="flex justify-end items-center gap-0.5">
                <div className="w-2 h-2 rounded-full bg-red-500 opacity-90" />
                <div className="w-2 h-2 rounded-full bg-amber-400 opacity-90 -ml-1" />
              </div>
            </div>
            <div className="text-center mt-1.5">
              <div className="text-[11px] font-semibold text-white tracking-tight truncate max-w-[85px]">
                Surge
              </div>
              <div className="text-[10px] text-white/50 font-mono">··0345</div>
            </div>
          </motion.div>
        </div>

        {/* 3 Pagination dots */}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
        </div>
      </motion.div>

      {/* 4. Total Wealth Card ("Total wealth >" - Screenshot #2 & #3) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-4 w-full rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/10 p-5 shadow-xl"
      >
        {/* Header */}
        <div
          onClick={() => {
            sound.playKeypadClick();
            setAccountsDrawerOpen(true);
          }}
          className="cursor-pointer group"
        >
          <div className="flex items-center gap-1 text-white/60 text-xs font-medium">
            <span>Total wealth</span>
            <ChevronRight className="w-3.5 h-3.5 text-white/50 group-hover:translate-x-0.5 transition" />
          </div>

          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-[28px] font-extrabold text-white tracking-tight">
              {formattedRon} lei
            </span>
          </div>

          <div className="text-xs text-[#00E676] font-medium mt-0.5 flex items-center gap-1">
            <span>▲ 3,14 lei</span>
            <span className="text-white/40">· Past month</span>
          </div>
        </div>

        {/* Wealth List Items (Screenshot #2) */}
        <div className="mt-5 space-y-4">
          {/* Row 1: Cash */}
          <div
            onClick={() => {
              sound.playKeypadClick();
              setAccountsDrawerOpen(true);
            }}
            className="flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#0075eb] flex items-center justify-center text-white shadow-sm shrink-0">
                <Coins className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-[15px] font-semibold text-white tracking-tight">Cash</span>
            </div>
            <div className="text-right">
              <div className="text-[15px] font-semibold text-white tracking-tight">
                {formattedRon} lei
              </div>
              <div className="text-[11px] text-[#00E676] font-medium">▲ 3,14 lei</div>
            </div>
          </div>

          {/* Row 2: Savings & Funds */}
          <div
            onClick={() => sound.playKeypadClick()}
            className="flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3.5 min-w-0 pr-2">
              <div className="w-10 h-10 rounded-full bg-[#FF6D00] flex items-center justify-center text-white shadow-sm shrink-0">
                <PiggyBank className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <div className="text-[15px] font-semibold text-white tracking-tight">
                  Savings & Funds
                </div>
                <div className="text-xs text-white/50 truncate">
                  Earn up to 4,25% p.a. with savings or invest in low-risk funds
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/40 shrink-0" />
          </div>

          {/* Row 3: Loan */}
          <div
            onClick={() => sound.playKeypadClick()}
            className="flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3.5 min-w-0 pr-2">
              <div className="w-10 h-10 rounded-full bg-[#C6FF00] text-black flex items-center justify-center shadow-sm shrink-0 font-bold">
                <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <div className="text-[15px] font-semibold text-white tracking-tight">Loan</div>
                <div className="text-xs text-white/50 truncate">
                  Get a low-rate loan up to 200.000 lei
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/40 shrink-0" />
          </div>

          {/* Row 4: Invest */}
          <div
            onClick={() => sound.playKeypadClick()}
            className="flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3.5 min-w-0 pr-2">
              <div className="w-10 h-10 rounded-full bg-[#00B0FF] flex items-center justify-center text-white shadow-sm shrink-0">
                <TrendingUp className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <div className="text-[15px] font-semibold text-white tracking-tight">Invest</div>
                <div className="text-xs text-white/50 truncate">Invest for as little as 1 lei</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/40 shrink-0" />
          </div>

          {/* Row 5: Crypto */}
          <div
            onClick={() => sound.playKeypadClick()}
            className="flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#9C27B0] flex items-center justify-center text-white shadow-sm shrink-0">
                <Bitcoin className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-[15px] font-semibold text-white tracking-tight">Crypto</span>
            </div>
            <span className="text-[15px] font-semibold text-white tracking-tight">0 lei</span>
          </div>

          {/* Row 6: Linked */}
          <div
            onClick={() => sound.playKeypadClick()}
            className="flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3.5 min-w-0 pr-2">
              <div className="w-10 h-10 rounded-full bg-[#00E5FF] text-black flex items-center justify-center shadow-sm shrink-0">
                <Link2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <div className="text-[15px] font-semibold text-white tracking-tight">Linked</div>
                <div className="text-xs text-white/50 truncate">Link external accounts</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/40 shrink-0" />
          </div>
        </div>
      </motion.div>

      {/* 5. Spent This Month Card (Screenshot #2) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-4 w-full rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/10 p-5 shadow-xl relative overflow-hidden"
      >
        <div className="flex items-center justify-between text-xs text-white/60">
          <span className="font-medium">Spent this month</span>
          <span className="font-mono text-white/50">3,99k lei</span>
        </div>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-[28px] font-extrabold text-white tracking-tight">
            3.840 lei
          </span>
          <span className="text-xs text-[#00E676] font-medium flex items-center">
            ▼ 409 lei
          </span>
        </div>

        {/* Smooth Area Curve Chart */}
        <div className="mt-4 w-full h-24 relative overflow-hidden">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 320 80"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00E676" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#00E676" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Area fill */}
            <path
              d="M0,75 Q40,68 80,62 T160,45 T240,25 T320,10 L320,80 L0,80 Z"
              fill="url(#chartGradient)"
            />
            {/* Line glow */}
            <path
              d="M0,75 Q40,68 80,62 T160,45 T240,25 T320,10"
              fill="none"
              stroke="#00E676"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </motion.div>

      {/* Wallet Cards Sheet */}
      <WalletDrawer
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        onAddNew={() => createNewCard('virtual')}
      />
    </div>
  );
};
