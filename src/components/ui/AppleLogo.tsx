'use client';

import React from 'react';

interface AppleLogoProps {
  className?: string;
  variant?: 'white' | 'black' | 'auto';
}

// Standalone official Apple silhouette logo
export const AppleLogo: React.FC<AppleLogoProps> = ({
  className = 'w-4 h-4',
  variant = 'auto',
}) => {
  return (
    <img
      src="/apple-logo.png"
      alt="Apple"
      className={`inline-block object-contain select-none shrink-0 pointer-events-none ${
        variant === 'white'
          ? 'brightness-0 invert'
          : variant === 'black'
          ? 'brightness-0'
          : ''
      } ${className}`}
    />
  );
};

// Official Apple Pay Badge: Authentic Apple Logo + clean bold "Pay" text
export const ApplePayLogo: React.FC<{
  className?: string;
  variant?: 'black' | 'white';
  size?: 'sm' | 'md' | 'lg';
}> = ({ className = '', variant = 'black', size = 'md' }) => {
  const isWhite = variant === 'white';

  const logoSizeClasses =
    size === 'sm'
      ? 'w-3.5 h-3.5'
      : size === 'lg'
      ? 'w-5 h-5'
      : 'w-4 h-4';

  const textSizeClasses =
    size === 'sm'
      ? 'text-[13px] font-semibold'
      : size === 'lg'
      ? 'text-[20px] font-bold'
      : 'text-[16px] font-bold';

  return (
    <div
      className={`inline-flex items-center justify-center gap-1.5 select-none pointer-events-none ${className}`}
    >
      <img
        src="/apple-logo.png"
        alt="Apple"
        className={`object-contain shrink-0 ${
          isWhite ? 'brightness-0 invert' : 'brightness-0'
        } ${logoSizeClasses}`}
      />
      <span
        className={`tracking-tight leading-none ${
          isWhite ? 'text-white' : 'text-black'
        } ${textSizeClasses}`}
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif',
        }}
      >
        Pay
      </span>
    </div>
  );
};
