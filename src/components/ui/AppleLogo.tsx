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
      className={`inline-block object-contain select-none shrink-0 ${
        variant === 'white'
          ? 'brightness-0 invert'
          : variant === 'black'
          ? 'brightness-0'
          : ''
      } ${className}`}
    />
  );
};

// Official Apple Pay Emblem (Apple mark + Pay word with authentic proportions)
export const ApplePayLogo: React.FC<{
  className?: string;
  variant?: 'black' | 'white';
}> = ({ className = 'h-5', variant = 'black' }) => {
  const fill = variant === 'black' ? '#000000' : '#FFFFFF';
  return (
    <svg
      viewBox="0 0 165 68"
      className={`inline-block select-none shrink-0 ${className}`}
      fill={fill}
    >
      {/* Apple Mark */}
      <path d="M51.9 33.7c0-7.3 5.9-10.9 6.2-11.1-3.4-5-8.7-5.7-10.6-5.8-4.5-.5-8.8 2.7-11.1 2.7-2.3 0-5.8-2.6-9.6-2.5-4.9.1-9.5 2.9-12 7.3-5.2 8.9-1.3 22.1 3.7 29.3 2.5 3.5 5.4 7.4 9.3 7.3 3.7-.1 5.1-2.4 9.6-2.4s5.8 2.4 9.6 2.3c4-.1 6.5-3.6 8.9-7.1 2.9-4.1 4-8.1 4.1-8.3-.1-.1-7.7-3-7.7-11.8zm-6.2-20.1c2-2.5 3.4-5.9 3-9.4-2.9.1-6.5 2-8.5 4.4-1.8 2.1-3.4 5.6-3 9 3.3.3 6.6-1.6 8.5-4z"/>
      {/* Pay Letters */}
      <path d="M72.2 46.1V27.4h6.3c4.8 0 8.3 3.2 8.3 7.8 0 4.7-3.5 7.9-8.4 7.9h-3.4v3H72.2zm2.9-5.7h3.3c3.1 0 5.4-2 5.4-5.2 0-3.1-2.2-5.1-5.3-5.1h-3.4v10.3zm18 5.7V33.6h2.8v2.1c.9-1.5 2.7-2.4 4.8-2.4 3.7 0 6.6 2.8 6.6 6.6v6.2h-2.9v-5.9c0-2.4-1.6-4.1-3.8-4.1-2.3 0-4.6 1.7-4.6 4.4v5.6h-2.9zm27.8 4.2c-1.3 0-2.5-.4-3.4-1.2l.9-2.2c.8.6 1.7.9 2.6.9 1.7 0 2.6-.9 2.6-2.5v-1.1c-1 1.2-2.7 1.9-4.4 1.9-4.2 0-7.3-3.2-7.3-7.4 0-4.3 3.1-7.5 7.3-7.5 1.8 0 3.4.7 4.4 2v-1.7h2.8v13.5c0 3.5-2.2 5.3-5.5 5.3zm-1.5-6.8c2.4 0 4.3-1.8 4.3-4.5 0-2.6-1.9-4.5-4.3-4.5-2.4 0-4.4 1.9-4.4 4.5 0 2.6 2 4.5 4.4 4.5z"/>
    </svg>
  );
};
