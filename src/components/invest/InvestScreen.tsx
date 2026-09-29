'use client';

import React from 'react';
import { Search, BarChart2, Globe, Coins, Percent, Lightbulb } from 'lucide-react';
import { sound } from '@/utils/audio';

export const InvestScreen: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col pt-3 px-4 pb-28 overflow-y-auto no-scrollbar relative select-none">
      {/* Aurora glow matching Screenshot #1 */}
      <div
        className="absolute top-0 left-0 right-0 h-[450px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 130% 60% at 70% 20%, rgba(0, 210, 255, 0.45) 0%, rgba(0, 160, 140, 0.25) 45%, rgba(7, 11, 14, 0) 80%)',
        }}
      />
      <div className="absolute top-[140px] left-1/2 -translate-x-1/2 w-[500px] h-[150px] rounded-[100%] bg-gradient-to-t from-transparent via-cyan-400/25 to-white/30 blur-[20px] pointer-events-none" />

      {/* Top Header matching Screenshot #1 */}
      <div className="relative z-10 flex items-center justify-between gap-2.5 h-12">
        {/* Left: Avatar with unread red notification dot */}
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 relative flex items-center justify-center bg-gradient-to-tr from-amber-700 via-stone-800 to-amber-400">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#FF3B30] rounded-full border-2 border-[#070b0e] shadow-[0_0_8px_#FF3B30]" />
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

        {/* Right: BarChart & Globe icons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => sound.playKeypadClick()}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-95 transition"
          >
            <BarChart2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => sound.playKeypadClick()}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-95 transition"
          >
            <Globe className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Section matching Screenshot #1 */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center mt-12 mb-6">
        <h1 className="text-[34px] font-bold text-white tracking-tight leading-tight">
          Grow your wealth
        </h1>
        <p className="text-sm text-white/75 mt-1 font-medium">Invest today, from €1</p>

        {/* Big pill: "Start investing" */}
        <button
          onClick={() => sound.playSuccessSound()}
          className="mt-8 w-full max-w-[340px] py-4 rounded-full bg-white/15 hover:bg-white/20 backdrop-blur-2xl border border-white/20 text-white font-semibold text-sm active:scale-95 transition shadow-lg"
        >
          Start investing
        </button>
      </div>

      {/* Features list cards matching Screenshot #1 */}
      <div className="relative z-10 bg-[#0d141c]/80 backdrop-blur-xl rounded-3xl p-5 border border-white/10 space-y-5 shadow-2xl mt-4">
        {/* Item 1 */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 mt-0.5">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-white">Invest in the brands you love</h3>
            <p className="text-xs text-white/60 mt-0.5">Choose from 4,000+ stocks</p>
          </div>
        </div>

        {/* Item 2 */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 mt-0.5">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-white">Save on trading fees</h3>
            <p className="text-xs text-white/60 mt-0.5 leading-relaxed">
              0% commission trading i.e. no order execution fees within your plan limits.{' '}
              <span className="text-blue-400 cursor-pointer">Other fees</span> e.g. FX fees may apply
            </p>
          </div>
        </div>

        {/* Item 3 */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 mt-0.5">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-white">Investing made simple</h3>
            <p className="text-xs text-white/60 mt-0.5 leading-relaxed">
              From automated strategies to recurring buys, we&apos;ll help you invest at your own pace
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
