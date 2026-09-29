'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AuroraBackgroundProps {
  colorVariant?: 'cyan' | 'blue' | 'purple';
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({ colorVariant = 'cyan' }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none bg-black">
      {/* 1. Base deep pitch-black background */}
      <div className="absolute inset-0 bg-[#000000]" />

      {/* 2. Ambient diffuse color cloud filling top half (breathing effect) */}
      <motion.div
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.65, 0.85, 0.65],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-0 left-[-20%] right-[-20%] h-[380px] pointer-events-none"
        style={{
          background:
            colorVariant === 'purple'
              ? 'radial-gradient(ellipse 90% 70% at 50% 35%, rgba(138, 43, 226, 0.45) 0%, rgba(0, 82, 255, 0.25) 50%, transparent 80%)'
              : colorVariant === 'blue'
              ? 'radial-gradient(ellipse 90% 70% at 50% 35%, rgba(0, 100, 255, 0.5) 0%, rgba(0, 50, 200, 0.25) 50%, transparent 80%)'
              : 'radial-gradient(ellipse 90% 70% at 50% 35%, rgba(0, 210, 255, 0.45) 0%, rgba(0, 110, 255, 0.25) 50%, transparent 80%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* 3. SIGNATURE REVOLUT 10 NEON ARC (Matching user reference template screenshot) */}
      {/* Sitting directly behind the 4 quick action buttons at top-[280px] */}
      <div className="absolute top-[245px] left-1/2 -translate-x-1/2 w-[520px] h-[160px] pointer-events-none">
        {/* Soft volumetric wide bloom */}
        <motion.div
          animate={{
            opacity: [0.75, 0.95, 0.75],
            scale: [1, 1.04, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 rounded-[100%] blur-[35px]"
          style={{
            background:
              colorVariant === 'purple'
                ? 'radial-gradient(ellipse at center, rgba(160, 50, 255, 0.75) 0%, rgba(0, 90, 255, 0.45) 50%, transparent 75%)'
                : colorVariant === 'blue'
                ? 'radial-gradient(ellipse at center, rgba(0, 140, 255, 0.8) 0%, rgba(0, 60, 220, 0.5) 50%, transparent 75%)'
                : 'radial-gradient(ellipse at center, rgba(0, 235, 255, 0.85) 0%, rgba(0, 120, 255, 0.55) 45%, rgba(0, 255, 200, 0.3) 65%, transparent 78%)',
            mixBlendMode: 'screen',
          }}
        />

        {/* Curved luminous crescent neon arc */}
        <motion.div
          animate={{
            opacity: [0.85, 1, 0.85],
            filter: ['blur(14px)', 'blur(18px)', 'blur(14px)'],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-[35px] left-1/2 -translate-x-1/2 w-[460px] h-[90px] rounded-[100%] bg-gradient-to-r from-[#00f0d0] via-white to-[#0052ff] blur-[15px] opacity-95"
          style={{ mixBlendMode: 'screen' }}
        />

        {/* Sharp radiant white-hot focal horizon beam */}
        <div className="absolute top-[48px] left-1/2 -translate-x-1/2 w-[420px] h-[3px] rounded-full bg-gradient-to-r from-transparent via-white to-transparent blur-[1px] opacity-100 shadow-[0_0_24px_#00d2ff,0_0_45px_#00f0d0]" />
      </div>

      {/* 4. Lower viewport fade into pure dark black */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none" />
    </div>
  );
};
