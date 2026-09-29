'use client';

import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#030608] flex justify-center items-center overflow-x-hidden">
      {/* 430px Root Mobile Simulator Container */}
      <div className="w-full max-w-[430px] mx-auto min-h-screen h-screen bg-[#070b0e] text-white relative overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] font-sans flex flex-col select-none">
        {children}
      </div>
    </div>
  );
};
