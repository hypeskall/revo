"use client";

import React from "react";
import { useRevolutStore } from "@/store/useRevolutStore";

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const palette = useRevolutStore((state) => state.lightPalette);
  return (
    <div className="app-viewport bg-black flex justify-center items-center">
      {/* 430px Root Mobile Simulator Container with Dynamic Viewport Height */}
      <div
        data-light-palette={palette}
        className="app-phone w-full max-w-[430px] mx-auto bg-[#000000] text-white relative shadow-[0_0_60px_rgba(0,0,0,0.9)] font-sans flex flex-col select-none"
      >
        {children}
      </div>
    </div>
  );
};
