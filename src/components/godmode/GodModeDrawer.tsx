'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRevolutStore } from '@/store/useRevolutStore';
import { Currency, TransactionCategory } from '@/types';
import { X, Sparkles, PlusCircle, MinusCircle, RotateCcw, Volume2, VolumeX, Smartphone, Maximize2, Check } from 'lucide-react';
import { sound } from '@/utils/audio';

export const GodModeDrawer: React.FC = () => {
  const {
    isGodModeOpen,
    setGodModeOpen,
    accounts,
    overrideBalance,
    injectCustomTransaction,
    resetToDefaults,
    soundEnabled,
    setSoundEnabled,
    frameMode,
    setFrameMode,
    activeCurrency,
  } = useRevolutStore();

  const [balances, setBalances] = useState<Record<Currency, string>>({
    RON: accounts.RON.balance.toString(),
    EUR: accounts.EUR.balance.toString(),
    USD: accounts.USD.balance.toString(),
    GBP: accounts.GBP.balance.toString(),
  });

  const [customTitle, setCustomTitle] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [customType, setCustomType] = useState<'incoming' | 'outgoing'>('incoming');
  const [customCategory, setCustomCategory] = useState<TransactionCategory>('Top-up');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isGodModeOpen) return null;

  const handleSaveBalances = () => {
    sound.playSuccessSound();
    (Object.keys(balances) as Currency[]).forEach((curr) => {
      const val = parseFloat(balances[curr]);
      if (!isNaN(val)) {
        overrideBalance(curr, val);
      }
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleInjectCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(customAmount);
    if (!customTitle || isNaN(amt) || amt <= 0) return;

    sound.playSuccessSound();
    injectCustomTransaction({
      title: customTitle,
      amount: customType === 'incoming' ? amt : -amt,
      category: customCategory,
      currency: activeCurrency,
      brand: 'Revolut',
    });

    setCustomTitle('');
    setCustomAmount('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleQuickInject = (
    title: string,
    amount: number,
    cat: TransactionCategory
  ) => {
    sound.playSuccessSound();
    injectCustomTransaction({
      title,
      amount,
      category: cat,
      currency: activeCurrency,
      brand: 'Revolut',
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-[90] flex flex-col justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            sound.playKeypadClick();
            setGodModeOpen(false);
          }}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Drawer content */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          drag="y"
          dragConstraints={{ top: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.y > 150) {
              setGodModeOpen(false);
            }
          }}
          className="relative w-full max-h-[92vh] bg-[#121417] rounded-t-[36px] border-t border-blue-500/40 p-5 pb-10 flex flex-col shadow-[0_-10px_40px_rgba(0,117,235,0.2)] overflow-hidden"
        >
          {/* Grab handle */}
          <div className="w-full flex justify-center pb-2">
            <div className="w-12 h-1.5 bg-blue-500/40 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                  God Mode / Admin Panel
                </h2>
                <div className="text-[11px] text-blue-400 font-medium">
                  Revolut Simulator Controls
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playKeypadClick();
                setGodModeOpen(false);
              }}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable controls */}
          <div className="flex-1 overflow-y-auto pt-3 space-y-5 no-scrollbar">
            {/* Success notification */}
            {savedSuccess && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                <Check className="w-4 h-4" />
                <span>State updated successfully!</span>
              </div>
            )}

            {/* Section 1: Balances Override */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                1. Override Wallet Balances
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {(['RON', 'EUR', 'USD', 'GBP'] as Currency[]).map((curr) => (
                  <div
                    key={curr}
                    className="p-3 rounded-2xl bg-[#191C20] border border-white/[0.05] space-y-1"
                  >
                    <label className="text-[11px] font-semibold text-neutral-400 flex items-center justify-between">
                      <span>{curr} Balance</span>
                      <span className="text-[10px] text-neutral-500">
                        {accounts[curr].flag}
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={balances[curr]}
                      onChange={(e) =>
                        setBalances({ ...balances, [curr]: e.target.value })
                      }
                      className="w-full bg-[#121417] text-white font-mono font-semibold text-sm px-2.5 py-1.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleSaveBalances}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-xs font-semibold text-white transition shadow-sm"
              >
                Apply Balances
              </button>
            </div>

            {/* Section 2: Quick Preset Injectors */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                2. Quick Transaction Injectors
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleQuickInject('Salary Deposit', 5000, 'Top-up')
                  }
                  className="p-2.5 rounded-xl bg-[#191C20] hover:bg-[#23272D] active:scale-95 transition text-left border border-white/[0.04]"
                >
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+5,000 {activeCurrency}</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">
                    Salary Top-up
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleQuickInject('Fancy Dinner', -180, 'Restaurants')
                  }
                  className="p-2.5 rounded-xl bg-[#191C20] hover:bg-[#23272D] active:scale-95 transition text-left border border-white/[0.04]"
                >
                  <div className="text-xs font-semibold text-red-400 flex items-center gap-1">
                    <MinusCircle className="w-3.5 h-3.5" />
                    <span>-180 {activeCurrency}</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">
                    Restaurant Dining
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleQuickInject('Uber Black Ride', -45, 'Transport')
                  }
                  className="p-2.5 rounded-xl bg-[#191C20] hover:bg-[#23272D] active:scale-95 transition text-left border border-white/[0.04]"
                >
                  <div className="text-xs font-semibold text-red-400 flex items-center gap-1">
                    <MinusCircle className="w-3.5 h-3.5" />
                    <span>-45 {activeCurrency}</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">
                    Uber Transport
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleQuickInject('Crypto Payout', 1200, 'Top-up')
                  }
                  className="p-2.5 rounded-xl bg-[#191C20] hover:bg-[#23272D] active:scale-95 transition text-left border border-white/[0.04]"
                >
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+1,200 {activeCurrency}</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">
                    Incoming Transfer
                  </div>
                </button>
              </div>
            </div>

            {/* Section 3: Custom Transaction Injector Form */}
            <form onSubmit={handleInjectCustom} className="space-y-2">
              <div className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                3. Custom Transaction Generator
              </div>

              <div className="p-3.5 rounded-2xl bg-[#191C20] border border-white/[0.05] space-y-2.5">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomType('incoming')}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition ${
                      customType === 'incoming'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#121417] text-neutral-400'
                    }`}
                  >
                    + Incoming
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomType('outgoing')}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition ${
                      customType === 'outgoing'
                        ? 'bg-red-600 text-white'
                        : 'bg-[#121417] text-neutral-400'
                    }`}
                  >
                    - Outgoing
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Merchant / Title"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="bg-[#121417] text-white text-xs px-3 py-2 rounded-xl border border-white/[0.08] focus:outline-none focus:border-blue-500"
                    required
                  />

                  <input
                    type="number"
                    step="any"
                    placeholder={`Amount (${activeCurrency})`}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="bg-[#121417] text-white text-xs px-3 py-2 rounded-xl border border-white/[0.08] focus:outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Category:</span>
                  <select
                    value={customCategory}
                    onChange={(e) =>
                      setCustomCategory(e.target.value as TransactionCategory)
                    }
                    className="bg-[#121417] text-white px-2 py-1 rounded-lg border border-white/[0.08] focus:outline-none"
                  >
                    <option value="Groceries">Groceries</option>
                    <option value="Tech">Tech</option>
                    <option value="Restaurants">Restaurants</option>
                    <option value="Transport">Transport</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Transfers">Transfers</option>
                    <option value="Top-up">Top-up</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-white text-black font-semibold text-xs active:scale-95 transition"
                >
                  Inject Transaction
                </button>
              </div>
            </form>

            {/* Section 4: Simulator Settings */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                4. Simulator Settings
              </div>

              <div className="p-3.5 rounded-2xl bg-[#191C20] border border-white/[0.05] space-y-3 text-xs">
                {/* Audio sound toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-blue-400" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-neutral-500" />
                    )}
                    <span className="text-white font-medium">Haptic Sound Effects</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !soundEnabled;
                      setSoundEnabled(next);
                      sound.enabled = next;
                    }}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                      soundEnabled ? 'bg-blue-600' : 'bg-neutral-800'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        soundEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* iPhone Bezel Mode */}
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    {frameMode === 'iphone' ? (
                      <Smartphone className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Maximize2 className="w-4 h-4 text-neutral-400" />
                    )}
                    <span className="text-white font-medium">
                      Desktop iPhone Bezel Mockup
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFrameMode(frameMode === 'iphone' ? 'fullscreen' : 'iphone')
                    }
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                      frameMode === 'iphone' ? 'bg-blue-600' : 'bg-neutral-800'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        frameMode === 'iphone' ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Section 5: Reset All Data */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  sound.playSuccessSound();
                  resetToDefaults();
                  setBalances({
                    RON: '1879.56',
                    EUR: '0',
                    USD: '120.5',
                    GBP: '50',
                  });
                  setSavedSuccess(true);
                  setTimeout(() => setSavedSuccess(false), 2000);
                }}
                className="w-full py-3 rounded-2xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Simulator to Default Data</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
