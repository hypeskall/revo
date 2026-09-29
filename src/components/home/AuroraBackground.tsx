'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AuroraBackgroundProps {
  colorVariant?: 'cyan' | 'blue' | 'purple';
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({ colorVariant = 'blue' }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none bg-[#030612]">
      {/* 1. Base deep midnight navy-black background */}
      <div className="absolute inset-0 bg-[#020510]" />

      {/* 2. Primary Atmospheric Royal Blue Aurora Dome (Screenshot #1 - Revolut Default) */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.85, 1, 0.85],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-[12%] -left-[20%] -right-[20%] h-[520px] pointer-events-none"
        style={{
          background:
            colorVariant === 'purple'
              ? 'radial-gradient(ellipse 95% 75% at 50% 22%, rgba(138, 43, 226, 0.55) 0%, rgba(30, 40, 180, 0.35) 45%, rgba(4, 7, 24, 0) 80%)'
              : colorVariant === 'cyan'
              ? 'radial-gradient(ellipse 95% 75% at 50% 22%, rgba(0, 195, 255, 0.5) 0%, rgba(16, 70, 240, 0.35) 45%, rgba(3, 6, 20, 0) 80%)'
              : 'radial-gradient(ellipse 110% 80% at 50% 20%, rgba(20, 85, 255, 0.75) 0%, rgba(12, 50, 205, 0.45) 42%, rgba(5, 16, 80, 0.2) 65%, rgba(2, 5, 16, 0) 85%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* 3. Secondary dynamic ambient glow for depth and luxury liquid feel */}
      <motion.div
        animate={{
          x: [-15, 15, -15],
          y: [-10, 10, -10],
          opacity: [0.4, 0.65, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[5%] left-[5%] right-[5%] h-[320px] pointer-events-none blur-[60px]"
        style={{
          background:
            colorVariant === 'purple'
              ? 'radial-gradient(circle at 45% 40%, rgba(180, 70, 255, 0.4) 0%, transparent 65%)'
              : colorVariant === 'cyan'
              ? 'radial-gradient(circle at 50% 40%, rgba(0, 225, 255, 0.4) 0%, transparent 65%)'
              : 'radial-gradient(circle at 50% 35%, rgba(60, 130, 255, 0.55) 0%, rgba(20, 60, 220, 0.25) 50%, transparent 70%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* 4. Smooth lower fade into pitch dark navy & black */}
      <div className="absolute top-[400px] bottom-0 left-0 right-0 bg-gradient-to-b from-transparent via-[#030612]/80 to-[#020510] pointer-events-none" />
    </div>
  );
};
