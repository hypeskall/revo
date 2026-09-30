'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRevolutStore } from '@/store/useRevolutStore';
import { Contact, Currency } from '@/types';
import { formatCurrencyAmount } from '@/utils/formatters';
import { ArrowLeft, ArrowRight, Clock, Loader2, X, AlertCircle } from 'lucide-react';
import { Keypad } from '@/components/ui/Keypad';
import { TransferSuccessModal } from './TransferSuccessModal';
import { sound } from '@/utils/audio';

interface ContactChatScreenProps {
  contact: Contact;
  onBack: () => void;
}

export const ContactChatScreen: React.FC<ContactChatScreenProps> = ({ contact, onBack }) => {
  const { accounts, activeCurrency, sendTransfer, contacts } = useRevolutStore();

  // Find live contact from store to get live updated transfers
  const liveContact = contacts.find((c) => c.id === contact.id) || contact;

  const [isKeypadOpen, setIsKeypadOpen] = useState(false);
  const [transferAmountStr, setTransferAmountStr] = useState('10');
  const [transferError, setTransferError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastSentAmount, setLastSentAmount] = useState(0);
  const processingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (processingTimer.current) clearTimeout(processingTimer.current); }, []);
  const cancelTransfer = () => {
    if (processingTimer.current) clearTimeout(processingTimer.current);
    processingTimer.current = null;
    setIsProcessing(false);
    setIsKeypadOpen(false);
  };

  const currentAccount = accounts[activeCurrency];
  const currentBalance = currentAccount ? currentAccount.balance : 0;

  const handleDigit = (d: string) => {
    setTransferError(null);
    if (d === ',') {
      if (!transferAmountStr.includes(',')) {
        setTransferAmountStr(transferAmountStr + ',');
      }
      return;
    }
    if (transferAmountStr === '0') {
      setTransferAmountStr(d);
    } else {
      if (transferAmountStr.length < 7) {
        setTransferAmountStr(transferAmountStr + d);
      }
    }
  };

  const handleDelete = () => {
    setTransferError(null);
    if (transferAmountStr.length <= 1) {
      setTransferAmountStr('0');
    } else {
      setTransferAmountStr(transferAmountStr.slice(0, -1));
    }
  };

  const handleSend = () => {
    if (isProcessing) return;
    const num = parseFloat(transferAmountStr.replace(',', '.'));
    if (isNaN(num) || num <= 0) {
      setTransferError('Please enter a valid amount');
      return;
    }
    if (num > currentBalance) {
      setTransferError(
        `Insufficient funds. Available: ${formatCurrencyAmount(currentBalance, activeCurrency)}`
      );
      return;
    }

    sound.playKeypadClick();
    setIsProcessing(true);

    // 1.2s simulated processing time as requested
    processingTimer.current = setTimeout(() => {
      processingTimer.current = null;
      const res = sendTransfer(contact.id, num, activeCurrency, 'Sent from Revolut');
      setIsProcessing(false);

      if (res.success) {
        sound.playSuccessSound();
        setLastSentAmount(num);
        setIsKeypadOpen(false);
        setIsSuccessModalOpen(true);
      } else {
        setTransferError(res.error || 'Transfer failed');
      }
    }, 1200);
  };

  return (
    <div className="absolute inset-0 z-[65] bg-black text-white flex flex-col justify-between overflow-hidden">
      {/* Background ambient blue glow matching Screenshot #5 */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_center,_rgba(0,50,180,0.35)_0%,_rgba(0,0,0,0.9)_70%)]" />

      {/* Top Header matching Screenshot #5 */}
      <div
        style={{
          paddingTop: 'max(env(safe-area-inset-top, 0px), 16px)',
        }}
        className="relative z-10 px-4 pb-2 flex items-center justify-between border-b border-white/[0.04] bg-black/60 backdrop-blur-md"
      >
        <button
          aria-label="Back to payments"
          onClick={() => {
            sound.playKeypadClick();
            onBack();
          }}
          className="w-10 h-10 rounded-full bg-[#181A1D] hover:bg-[#22252A] active:scale-90 flex items-center justify-center text-white transition border border-white/[0.05]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center px-2 min-w-0">
          <h2 className="text-[15px] font-semibold text-white tracking-tight truncate">
            {liveContact.name}
          </h2>
          <div className="text-[11px] font-mono text-neutral-400 truncate">
            {liveContact.iban}
          </div>
        </div>

        {/* Contact Avatar Circle with S&P or initials badge */}
        <div className="relative">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
            style={{ backgroundColor: liveContact.avatarColor || '#F59E0B' }}
          >
            {liveContact.initials}
          </div>
          {liveContact.badge && (
            <span className="absolute -bottom-1 -right-1 bg-black text-[9px] font-bold text-emerald-400 px-1 py-0.2 rounded border border-neutral-700">
              {liveContact.badge}
            </span>
          )}
        </div>
      </div>

      {/* Chat Messages Activity Feed (Screenshot #5) */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar flex flex-col justify-end">
        {liveContact.transfers.map((transfer,index) => <React.Fragment key={transfer.id}>
          {(index===0||liveContact.transfers[index-1].dateLabel!==transfer.dateLabel)&&<div className="text-center"><span className="text-xs text-neutral-400">{transfer.dateLabel}</span></div>}
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className={`flex flex-col ${transfer.isSender?'items-end':'items-start'}`}>
            <div className="w-[200px] bg-[#22252A] rounded-2xl p-3 border border-white/5">
              <div className="text-[11px] text-neutral-400 mb-2">{transfer.isSender?'You sent':'You received'}</div>
              <div className="text-[26px] font-semibold">{formatCurrencyAmount(transfer.amount,transfer.currency)}</div>
              <div className="text-[11px] text-neutral-400 mt-2">{transfer.status==='completed'?'Completed':'Arriving'} · {transfer.timeLabel}</div>
            </div>
          </motion.div>
        </React.Fragment>)}
        {!liveContact.transfers.length&&<p className="text-center text-white/40">No payments yet</p>}
      </div>
      {/* Floating Bottom Send Button (Screenshot #5) */}
      <div
        style={{
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 20px)',
        }}
        className="relative z-10 px-5 pt-2 bg-gradient-to-t from-black via-black/90 to-transparent"
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            sound.playKeypadClick();
            setIsKeypadOpen(true);
          }}
          className="w-full py-3.5 rounded-full bg-white text-black font-semibold text-base flex items-center justify-center gap-2 shadow-2xl hover:bg-neutral-100 transition"
        >
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          <span>Send</span>
        </motion.button>
      </div>

      {/* Transfer Amount Keypad Drawer */}
      <AnimatePresence>
        {isKeypadOpen && (
          <div className="absolute inset-0 z-[70] flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={cancelTransfer}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              style={{
                paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)',
              }}
              className="relative w-full bg-[#14171A] rounded-t-[32px] border-t border-white/[0.08] p-5 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2">
                <div className="text-left">
                  <div className="text-xs text-neutral-400">Send to {liveContact.name}</div>
                  <div className="text-[11px] text-neutral-500">
                    Balance: {formatCurrencyAmount(currentBalance, activeCurrency)}
                  </div>
                </div>
                <button
                  aria-label="Cancel transfer"
                  onClick={cancelTransfer}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Fancy Rolling Amount Display */}
              <div className="flex flex-col items-center justify-center py-4">
                <motion.div
                  key={transferAmountStr.length}
                  animate={{ scale: [0.97, 1.02, 1] }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="flex items-center justify-center overflow-hidden h-[60px]"
                >
                  <div className="flex items-center justify-center">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {transferAmountStr.split('').map((char, idx) => (
                        <motion.span
                          key={`${idx}-${char}`}
                          initial={{ opacity: 0, y: 18, scale: 0.7, filter: 'blur(4px)' }}
                          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, y: -18, scale: 0.7, filter: 'blur(4px)' }}
                          transition={{
                            type: 'spring',
                            stiffness: 550,
                            damping: 28,
                            mass: 0.35,
                          }}
                          className="text-[44px] font-bold text-white tracking-tight leading-none inline-block select-none font-sans"
                        >
                          {char}
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Cyan Glowing Cursor */}
                  <motion.div
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.85, ease: 'easeInOut' }}
                    className="w-[3px] h-9 bg-cyan-400 mx-1.5 rounded-full shadow-[0_0_10px_#00d2ff]"
                  />

                  <motion.span layout className="text-[34px] font-semibold text-neutral-300 ml-1 select-none">
                    {activeCurrency === 'RON' ? 'lei' : activeCurrency}
                  </motion.span>
                </motion.div>

                {/* Validation error badge */}
                {transferError && (
                  <div className="flex items-center gap-1.5 text-xs text-red-400 mt-1 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{transferError}</span>
                  </div>
                )}
              </div>

              {/* Send Action Button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSend}
                disabled={isProcessing}
                className="w-full py-3.5 mb-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base flex items-center justify-center gap-2 shadow-lg active:scale-95 transition"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending to {liveContact.name}...</span>
                  </>
                ) : (
                  <>
                    <span>Send {transferAmountStr} {activeCurrency === 'RON' ? 'lei' : activeCurrency}</span>
                  </>
                )}
              </motion.button>

              {/* Keypad */}
              <Keypad
                onDigit={handleDigit}
                onDelete={handleDelete}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Fullscreen Animation */}
      <TransferSuccessModal
        isOpen={isSuccessModalOpen}
        recipientName={liveContact.name}
        amount={lastSentAmount}
        currency={activeCurrency}
        onDismiss={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
};
