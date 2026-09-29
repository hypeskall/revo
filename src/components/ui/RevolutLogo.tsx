'use client';

import React from 'react';

interface RevolutLogoProps {
  className?: string;
  variant?: 'white' | 'black' | 'auto';
}

export const RevolutLogo: React.FC<RevolutLogoProps> = ({
  className = 'w-5 h-5',
  variant = 'white',
}) => {
  return (
    <img
      src="/revolut-logo.png"
      alt="Revolut"
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
