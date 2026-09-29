'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AuroraBackgroundProps {
  colorVariant?: 'cyan' | 'blue' | 'purple';
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({ colorVariant = 'cyan' }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Base deep navy/black background */}
      <div className="absolute inset-0 bg-[#06090e]" />

      {/* Dynamic Animated Volumetric Aurora Glow (Breathing mesh effect) */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.75, 0.95, 0.75],
          y: [0, -6, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-0 left-0 right-0 h-[490px] w-full"
        style={{
          background:
            colorVariant === 'purple'
              ? 'radial-gradient(ellipse 130% 65% at 50% 18%, rgba(138, 43, 226, 0.55) 0%, rgba(0, 82, 255, 0.35) 45%, rgba(6, 9, 14, 0) 80%)'
              : colorVariant === 'blue'
              ? 'radial-gradient(ellipse 130% 65% at 50% 18%, rgba(0, 100, 255, 0.6) 0%, rgba(0, 50, 200, 0.35) 45%, rgba(6, 9, 14, 0) 80%)'
              : 'radial-gradient(ellipse 130% 65% at 50% 18%, rgba(0, 210, 255, 0.52) 0%, rgba(0, 110, 255, 0.32) 45%, rgba(6, 9, 14, 0) 80%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Secondary slow color-shifting glow cloud (shifting between cyan #00d2ff, royal blue #0052ff and purple) */}
      <motion.div
        animate={{
          scale: [1.05, 0.98, 1.05],
          rotate: [-2, 2, -2],
          opacity: [0.4, 0.65, 0.4],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-4 left-[-10%] w-[120%] h-[360px] rounded-full blur-[70px]"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0, 210, 255, 0.4) 0%, rgba(0, 82, 255, 0.35) 40%, rgba(120, 40, 240, 0.2) 70%, transparent 85%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Signature Revolut 10 Lens Flare / Neon Arc Horizon (matching 'Вогники' reference) */}
      <motion.div
        animate={{
          opacity: [0.8, 1, 0.8],
          filter: ['blur(16px)', 'blur(20px)', 'blur(16px)'],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[165px] left-1/2 -translate-x-1/2 w-[520px] h-[165px] rounded-[100%] bg-gradient-to-t from-transparent via-cyan-400/40 to-white/70 blur-[18px]"
      />

      {/* Crisp radiant white-hot focal beam */}
      <div className="absolute top-[172px] left-1/2 -translate-x-1/2 w-[460px] h-[3px] rounded-full bg-gradient-to-r from-transparent via-white to-transparent blur-[1px] opacity-95 shadow-[0_0_18px_#00d2ff]" />

      {/* Bottom fade into darkness */}
      <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#06090e] via-[#06090e]/80 to-transparent" />
    </div>
  );
};
