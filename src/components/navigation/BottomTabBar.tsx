'use client';

import React from 'react';
import { TrendingUp, ArrowLeftRight, Bitcoin, Award } from 'lucide-react';
import { sound } from '@/utils/audio';

export type TabId = 'home' | 'invest' | 'transfer' | 'cards' | 'hub';

interface BottomTabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

// Iconic Revolut 'R' vector glyph matching Revolut 10
const RevolutRLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M5.5 3h6.8c3.4 0 5.7 2.1 5.7 5.2 0 2.2-1.2 4-3.1 4.8l3.9 7.5h-4.3l-3.3-6.6H9.2v6.6H5.5V3zm3.7 7.5h3c1.4 0 2.3-.8 2.3-2.1s-.9-2.1-2.3-2.1h-3v4.2z" />
  </svg>
);

// RevPoints Hexagon Vector Glyph matching Revolut 10
const RevPointsLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2l7.5 4.33v8.66L12 22 4.5 17.33V8.67L12 2z" />
    <path d="M12 8v8M8 12h8" strokeWidth="2.2" />
  </svg>
);

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as TabId, label: 'Home', isR: true },
    { id: 'invest' as TabId, label: 'Invest', icon: TrendingUp },
    { id: 'transfer' as TabId, label: 'Payments', icon: ArrowLeftRight, hasRedDot: true },
    { id: 'cards' as TabId, label: 'Crypto', icon: Bitcoin },
    { id: 'hub' as TabId, label: 'RevPoints', isRevPoints: true },
  ];

  const handleSelect = (id: TabId) => {
    sound.playKeypadClick();
    onTabChange(id);
  };

  return (
    // 7. Floating "Liquid Glass" iOS Tab Dock (Crucial)
    <div className="fixed bottom-4 left-4 right-4 max-w-[400px] mx-auto h-[62px] rounded-full bg-white/[0.12] backdrop-blur-2xl border border-white/15 shadow-[0_15px_40px_rgba(0,0,0,0.8)] flex items-center justify-around px-2 z-50 select-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleSelect(tab.id)}
            className={`flex flex-col items-center justify-center transition-all duration-150 active:scale-90 relative ${
              isActive
                ? 'bg-white/15 px-3.5 py-1.5 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]'
                : 'px-2 py-1 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="relative flex items-center justify-center h-5">
              {tab.isR ? (
                <RevolutRLogo
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-white' : 'text-white/80'
                  }`}
                />
              ) : tab.isRevPoints ? (
                <RevPointsLogo
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-white' : 'text-white/80'
                  }`}
                />
              ) : Icon ? (
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-white stroke-[2.4]' : 'text-white/80 stroke-[1.8]'
                  }`}
                />
              ) : null}

              {/* Small glowing red unread notification dot on Payments tab */}
              {tab.hasRedDot && (
                <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-[#FF3B30] shadow-[0_0_6px_#FF3B30]" />
              )}
            </div>

            <span
              className={`text-[10px] mt-0.5 tracking-tight font-medium ${
                isActive ? 'text-white font-semibold' : 'text-white/70'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
