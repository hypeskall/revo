'use client';

import React from 'react';
import { Delete } from 'lucide-react';
import { sound } from '@/utils/audio';

interface KeypadProps {
  onDigit: (digit: string) => void;
  onDelete: () => void;
  hasDecimal?: boolean;
}

export const Keypad: React.FC<KeypadProps> = ({
  onDigit,
  onDelete,
  hasDecimal = true,
}) => {
  const handlePress = (digit: string) => {
    sound.playKeypadClick();
    onDigit(digit);
  };

  const handleDelete = () => {
    sound.playKeypadClick();
    onDelete();
  };

  return (
    <div className="w-full max-w-[340px] mx-auto px-4 pb-2 select-none">
      {/* Strictly numbers 1-9, dot/comma, 0, and Lucide Delete icon */}
      <div className="grid grid-cols-3 gap-y-3 gap-x-6 text-center">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => handlePress(digit)}
            className="h-14 rounded-full flex items-center justify-center text-[28px] font-normal text-white active:bg-white/10 active:scale-95 transition-all duration-75"
          >
            {digit}
          </button>
        ))}

        {/* Bottom row: comma/dot, 0, backspace */}
        <button
          type="button"
          onClick={() => (hasDecimal ? handlePress(',') : null)}
          className={`h-14 rounded-full flex items-center justify-center text-[28px] font-normal text-white active:bg-white/10 active:scale-95 transition-all duration-75 ${
            !hasDecimal ? 'invisible pointer-events-none' : ''
          }`}
        >
          ,
        </button>

        <button
          type="button"
          onClick={() => handlePress('0')}
          className="h-14 rounded-full flex items-center justify-center text-[28px] font-normal text-white active:bg-white/10 active:scale-95 transition-all duration-75"
        >
          0
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="h-14 rounded-full flex items-center justify-center text-white active:bg-white/10 active:scale-95 transition-all duration-75"
        >
          <Delete className="w-6 h-6 stroke-[1.8]" />
        </button>
      </div>
    </div>
  );
};
