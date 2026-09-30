'use client';

import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="h-[100dvh] min-h-[100dvh] w-full bg-black flex justify-center items-center overflow-hidden">
      {/* 430px Root Mobile Simulator Container with Dynamic Viewport Height */}
      <div className="w-full max-w-[430px] mx-auto h-[100dvh] max-h-[100dvh] bg-[#000000] text-white relative overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] font-sans flex flex-col select-none">
        {children}
        <div className="pointer-events-none absolute right-0 top-1/2 z-[90] -translate-y-1/2 rounded-l-md border-y border-l border-white/10 bg-black/45 px-1.5 py-2 text-[8px] font-bold tracking-[0.22em] text-white/35 [writing-mode:vertical-rl] backdrop-blur-md">
          SANDBOX
        </div>
      </div>
    </div>
  );
};
