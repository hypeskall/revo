'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowLeftRight, Bitcoin } from 'lucide-react';
import { sound } from '@/utils/audio';
import { RevolutLogo } from '@/components/ui/RevolutLogo';

export type TabId = 'home' | 'invest' | 'transfer' | 'cards' | 'hub';

interface BottomTabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  hidden?: boolean;
}

// RevPoints Hexagon Vector Glyph matching Revolut 10
const RevPointsLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2l7.5 4.33v8.66L12 22 4.5 17.33V8.67L12 2z" />
    <path d="M12 8v8M8 12h8" strokeWidth="2.2" />
  </svg>
);

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabChange,
  hidden = false,
}) => {
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
    // Floating Liquid Glass iOS Tab Dock with Motion.dev spring hide/show
    <motion.div
      initial={false}
      animate={{
        y: hidden ? 100 : 0,
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? 'none' : 'auto',
      }}
      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
      style={{
        bottom: 'calc(max(0.65rem, env(safe-area-inset-bottom, 0.65rem)) + 0.2rem)',
      }}
      className="absolute left-3 right-3 max-w-[404px] mx-auto h-[62px] rounded-full bg-white/[0.14] backdrop-blur-2xl border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.85)] flex items-center justify-around px-2 z-40 select-none"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleSelect(tab.id)}
            className="flex flex-col items-center justify-center transition-all duration-150 active:scale-90 relative px-3.5 py-1.5 rounded-full"
          >
            {/* Smooth gliding active pill animation from motion.dev */}
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-white/20 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}

            <div className="relative z-10 flex items-center justify-center h-5">
              {tab.isR ? (
                <RevolutLogo
                  variant="white"
                  className={`w-4 h-4 transition-opacity ${
                    isActive ? 'opacity-100' : 'opacity-70'
                  }`}
                />
              ) : tab.isRevPoints ? (
                <RevPointsLogo
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-white' : 'text-white/70'
                  }`}
                />
              ) : Icon ? (
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-white stroke-[2.4]' : 'text-white/70 stroke-[1.8]'
                  }`}
                />
              ) : null}

              {/* Small glowing red unread notification dot on Payments tab */}
              {tab.hasRedDot && (
                <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-[#FF3B30] shadow-[0_0_6px_#FF3B30]" />
              )}
            </div>

            <span
              className={`relative z-10 text-[10px] mt-0.5 tracking-tight font-medium ${
                isActive ? 'text-white font-semibold' : 'text-white/70'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </motion.div>
  );
};
