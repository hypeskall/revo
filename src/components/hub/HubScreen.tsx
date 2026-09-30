'use client';

import React from 'react';
import { Sparkles, Plane, Shield, Gift, Wifi, Smartphone, Award, ChevronRight } from 'lucide-react';
import { sound } from '@/utils/audio';
import { useRevolutStore } from '@/store/useRevolutStore';

export const HubScreen: React.FC = () => {
  const {setUiPanel,revPoints}=useRevolutStore();
  const perks = [
    { title: 'RevPoints Rewards', desc: '1,420 points available to redeem', icon: Award, color: '#0075EB' },
    { title: 'Travel & Stays', desc: 'Up to 10% cashback on hotels', icon: Plane, color: '#10B981' },
    { title: 'eSIM Global Data', desc: 'Stay connected anywhere with zero roaming', icon: Wifi, color: '#8B5CF6' },
    { title: 'Purchase Protection', desc: 'Insurance coverage on daily shopping', icon: Shield, color: '#F59E0B' },
    { title: 'Gift Cards & Vouchers', desc: 'Steam, PlayStation, Amazon & more', icon: Gift, color: '#EC4899' },
  ];

  return (
    <div
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 14px)',
      }}
      className="w-full h-full flex flex-col px-5 pb-24 overflow-y-auto no-scrollbar"
    >
      <div className="flex items-center justify-between pb-3">
        <h1 className="text-2xl font-bold text-white tracking-tight">RevPoints & Hub</h1>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>{revPoints.toLocaleString('en-GB')} pts</span>
        </div>
      </div>

      {/* Featured Banner */}
      <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/50 to-purple-900/40 rounded-3xl p-5 border border-blue-500/30 shadow-xl mb-4 relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
            Revolut Ultra
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Unlock World-Class Perks</h2>
          <p className="text-xs text-neutral-300 mt-1">
            Unlimited airport lounges, platinum card, and maximum RevPoints multiplier.
          </p>
          <button
            onClick={() => setUiPanel('plan')}
            className="mt-4 px-4 py-2 rounded-full bg-white text-black font-semibold text-xs active:scale-95 transition"
          >
            Upgrade Now
          </button>
        </div>
      </div>

      {/* Perks List */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-neutral-400 px-1">Lifestyle & Products</div>
        <div className="bg-[#14171A] rounded-2xl border border-white/[0.04] divide-y divide-white/[0.03] overflow-hidden">
          {perks.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                onClick={() => setUiPanel('rewards')}
                className="px-4 py-3.5 flex items-center justify-between hover:bg-white/[0.03] active:bg-white/[0.05] transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: `${p.color}20`, color: p.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{p.title}</div>
                    <div className="text-xs text-neutral-400">{p.desc}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
