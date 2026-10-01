'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Delete } from '@/components/ui/OfficialIcons';
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
    <div
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)',
      }}
      className="w-full max-w-[340px] mx-auto px-4 select-none"
    >
      {/* Motion-enhanced tactile iOS Keypad */}
      <div className="grid grid-cols-3 gap-y-2.5 gap-x-5 text-center">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <motion.button
            key={digit}
            whileTap={{ scale: 0.86, backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
            transition={{ type: 'spring', stiffness: 600, damping: 28 }}
            type="button"
            onClick={() => handlePress(digit)}
            className="h-14 rounded-full flex items-center justify-center text-[28px] font-medium text-white transition-colors"
          >
            {digit}
          </motion.button>
        ))}

        {/* Bottom row: comma/dot, 0, backspace */}
        <motion.button
          whileTap={{ scale: 0.86, backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
          transition={{ type: 'spring', stiffness: 600, damping: 28 }}
          type="button"
          onClick={() => (hasDecimal ? handlePress(',') : null)}
          className={`h-14 rounded-full flex items-center justify-center text-[28px] font-medium text-white transition-colors ${
            !hasDecimal ? 'invisible pointer-events-none' : ''
          }`}
        >
          ,
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.86, backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
          transition={{ type: 'spring', stiffness: 600, damping: 28 }}
          type="button"
          onClick={() => handlePress('0')}
          className="h-14 rounded-full flex items-center justify-center text-[28px] font-medium text-white transition-colors"
        >
          0
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.86, backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
          transition={{ type: 'spring', stiffness: 600, damping: 28 }}
          type="button"
          onClick={handleDelete}
          className="h-14 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <Delete className="w-6 h-6 stroke-[1.8]" />
        </motion.button>
      </div>
    </div>
  );
};
