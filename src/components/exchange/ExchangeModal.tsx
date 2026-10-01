'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRevolutStore } from '@/store/useRevolutStore';
import { Currency } from '@/types';
import { formatCurrencyAmount } from '@/utils/formatters';
import { ArrowLeft, ArrowDownUp, RefreshCw, CheckCircle2, AlertCircle } from '@/components/ui/OfficialIcons';
import { sound } from '@/utils/audio';

export const ExchangeModal: React.FC = () => {
  const {
    isExchangeOpen,
    setExchangeOpen,
    accounts,
    rates,
    exchangeCurrency,
  } = useRevolutStore();

  const [fromCurr, setFromCurr] = useState<Currency>('EUR');
  const [toCurr, setToCurr] = useState<Currency>('RON');
  const [sellAmountStr, setSellAmountStr] = useState('10');
  const [buyAmountStr, setBuyAmountStr] = useState('49.76');
  const [lastEdited, setLastEdited] = useState<'sell' | 'buy'>('sell');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isExchangeOpen) return null;

  const getRate = (from: Currency, to: Currency) => {
    if (from === to) return 1;
    const pair = `${from}_${to}`;
    if (rates[pair]) return rates[pair];
    // Fallback compute via RON
    const fromToRon = rates[`${from}_RON`] || 1;
    const toToRon = rates[`${to}_RON`] || 1;
    return fromToRon / toToRon;
  };

  const currentRate = getRate(fromCurr, toCurr);

  // Sync calculations whenever amounts or currencies change
  useEffect(() => {
    const rate = getRate(fromCurr, toCurr);
    if (lastEdited === 'sell') {
      const sellNum = parseFloat(sellAmountStr.replace(',', '.')) || 0;
      const computedBuy = Math.round(sellNum * rate * 100) / 100;
      setBuyAmountStr(computedBuy.toString().replace('.', ','));
    } else {
      const buyNum = parseFloat(buyAmountStr.replace(',', '.')) || 0;
      const computedSell = rate > 0 ? Math.round((buyNum / rate) * 100) / 100 : 0;
      setSellAmountStr(computedSell.toString().replace('.', ','));
    }
  }, [fromCurr, toCurr, sellAmountStr, buyAmountStr, lastEdited]);

  const fromAccount = accounts[fromCurr];
  const toAccount = accounts[toCurr];
  const sellNum = parseFloat(sellAmountStr.replace(',', '.')) || 0;
  const buyNum = parseFloat(buyAmountStr.replace(',', '.')) || 0;

  const handleSwapCurrencies = () => {
    sound.playKeypadClick();
    const temp = fromCurr;
    setFromCurr(toCurr);
    setToCurr(temp);
  };

  const handlePercentage = (pct: number) => {
    sound.playKeypadClick();
    setErrorMsg(null);
    if (!fromAccount) return;
    const val = Math.round(fromAccount.balance * pct * 100) / 100;
    setLastEdited('sell');
    setSellAmountStr(val.toString().replace('.', ','));
  };

  const handleConfirm = () => {
    if (sellNum <= 0) {
      setErrorMsg('Enter an amount greater than 0');
      return;
    }
    if (sellNum > fromAccount.balance) {
      setErrorMsg(
        `Insufficient ${fromCurr} balance (${formatCurrencyAmount(fromAccount.balance, fromCurr)})`
      );
      return;
    }

    sound.playKeypadClick();
    const res = exchangeCurrency(fromCurr, toCurr, sellNum, buyNum);
    if (res.success) {
      sound.playSuccessSound();
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setExchangeOpen(false);
      }, 1400);
    } else {
      setErrorMsg(res.error || 'Exchange failed');
    }
  };

  const currencies: Currency[] = ['RON', 'EUR', 'USD', 'GBP'];

  return (
    <div className="absolute inset-0 z-[65] bg-black text-white flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div
        style={{
          paddingTop: 'max(env(safe-area-inset-top, 0px), 14px)',
        }}
        className="px-5 pb-3 flex items-center justify-between border-b border-white/[0.04]"
      >
        <button
          onClick={() => {
            sound.playKeypadClick();
            setExchangeOpen(false);
          }}
          className="w-10 h-10 rounded-full bg-[#181A1D] hover:bg-[#22252A] active:scale-90 flex items-center justify-center text-white transition border border-white/[0.05]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h2 className="text-base font-semibold text-white">Exchange</h2>
          <div className="text-xs text-neutral-400">
            1 {fromCurr} = {currentRate.toFixed(4)} {toCurr}
          </div>
        </div>

        <div className="w-10" />
      </div>

      {/* Main exchange body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 no-scrollbar">
        {/* Sell Container */}
        <div className="bg-[#191C20] rounded-2xl p-4 border border-white/[0.06] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Sell
            </span>
            <span className="text-xs text-neutral-400">
              Balance: {formatCurrencyAmount(fromAccount.balance, fromCurr)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <input
              type="text"
              value={sellAmountStr}
              onChange={(e) => {
                setLastEdited('sell');
                setErrorMsg(null);
                setSellAmountStr(e.target.value);
              }}
              className="bg-transparent text-3xl font-bold text-white focus:outline-none w-1/2 tracking-tight"
              placeholder="0"
            />

            <select
              value={fromCurr}
              onChange={(e) => {
                sound.playKeypadClick();
                setFromCurr(e.target.value as Currency);
              }}
              className="bg-[#24282E] text-white font-semibold text-sm px-3 py-2 rounded-xl border border-white/[0.08] focus:outline-none cursor-pointer"
            >
              {currencies.map((c) => (
                <option key={c} value={c} className="bg-[#191C20] text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Quick percentage pills */}
          <div className="flex items-center gap-2 pt-1 border-t border-white/[0.04]">
            {[
              { label: '25%', val: 0.25 },
              { label: '50%', val: 0.5 },
              { label: 'Max', val: 1.0 },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => handlePercentage(p.val)}
                className="px-2.5 py-1 rounded-full bg-[#24282E] hover:bg-[#2F343C] text-[11px] font-semibold text-neutral-300 hover:text-white transition active:scale-95"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Swap button divider */}
        <div className="relative flex items-center justify-center my-1">
          <div className="w-full border-t border-white/[0.06] absolute" />
          <button
            onClick={handleSwapCurrencies}
            className="relative z-10 w-11 h-11 rounded-full bg-[#20252B] hover:bg-[#2A3038] active:rotate-180 transition-all duration-200 border border-white/[0.08] flex items-center justify-center text-blue-400 shadow-md"
            title="Swap currencies"
          >
            <ArrowDownUp className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Buy Container */}
        <div className="bg-[#191C20] rounded-2xl p-4 border border-white/[0.06] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Buy
            </span>
            <span className="text-xs text-neutral-400">
              Balance: {formatCurrencyAmount(toAccount.balance, toCurr)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <input
              type="text"
              value={buyAmountStr}
              onChange={(e) => {
                setLastEdited('buy');
                setErrorMsg(null);
                setBuyAmountStr(e.target.value);
              }}
              className="bg-transparent text-3xl font-bold text-white focus:outline-none w-1/2 tracking-tight"
              placeholder="0"
            />

            <select
              value={toCurr}
              onChange={(e) => {
                sound.playKeypadClick();
                setToCurr(e.target.value as Currency);
              }}
              className="bg-[#24282E] text-white font-semibold text-sm px-3 py-2 rounded-xl border border-white/[0.08] focus:outline-none cursor-pointer"
            >
              {currencies.map((c) => (
                <option key={c} value={c} className="bg-[#191C20] text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Rate info card */}
        <div className="p-3 rounded-2xl bg-[#14171A] border border-white/[0.04] flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Guaranteed rate:</span>
          </div>
          <span className="font-semibold text-white">
            1 {fromCurr} = {currentRate.toFixed(4)} {toCurr}
          </span>
        </div>
      </div>

      {/* Bottom Confirm Action */}
      <div
        style={{
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 20px)',
        }}
        className="px-5 pt-2 bg-gradient-to-t from-black via-black/90 to-transparent"
      >
        {isSuccess ? (
          <div className="w-full py-4 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-base flex items-center justify-center gap-2 border border-emerald-500/30">
            <CheckCircle2 className="w-5 h-5" />
            <span>Exchange Successful</span>
          </div>
        ) : (
          <button
            onClick={handleConfirm}
            className="w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition font-semibold text-base text-white shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            <span>Confirm Exchange</span>
          </button>
        )}
      </div>
    </div>
  );
};
