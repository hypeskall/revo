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
      </div>
    </div>
  );
};
