'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRevolutStore } from '@/store/useRevolutStore';
import { Contact } from '@/types';
import {
  X,
  Search,
  QrCode,
  Landmark,
  CreditCard,
  Users,
  Upload,
  Globe,
  Bitcoin,
  MoreHorizontal,
  User,
  ArrowLeft,
  Calendar,
  Plus,
} from 'lucide-react';
import { sound } from '@/utils/audio';
import { RevolutLogo } from '@/components/ui/RevolutLogo';
import { ContactChatScreen } from './ContactChatScreen';

interface ContactListModalProps {
  isTabMode?: boolean;
}

export const ContactListModal: React.FC<ContactListModalProps> = ({ isTabMode = false }) => {
  const {
    isTransferOpen,
    setTransferOpen,
    contacts,
    selectedContactForTransfer,
    setSelectedContactForTransfer,
  } = useRevolutStore();

  const [searchQuery, setSearchQuery] = useState('');

  if (!isTransferOpen && !isTabMode) return null;

  // If a contact is selected, show the Contact Chat / Transfer screen
  if (selectedContactForTransfer) {
    return (
      <ContactChatScreen
        contact={selectedContactForTransfer}
        onBack={() => setSelectedContactForTransfer(null)}
      />
    );
  }

  // 8 Action Tiles matching Screenshot #4 (media_1790702591995.jpg)
  const actionTiles = [
    {
      id: 'revolut',
      label: 'Revolut',
      icon: () => <RevolutLogo variant="white" className="w-6 h-6" />,
      onClick: () => sound.playKeypadClick(),
    },
    {
      id: 'bank',
      label: 'Bank',
      icon: () => <Landmark className="w-6 h-6 stroke-[2]" />,
      onClick: () => sound.playKeypadClick(),
    },
    {
      id: 'card',
      label: 'Card',
      icon: () => <CreditCard className="w-6 h-6 stroke-[2]" />,
      onClick: () => sound.playKeypadClick(),
    },
    {
      id: 'group',
      label: 'Group',
      icon: () => <Users className="w-6 h-6 stroke-[2]" />,
      onClick: () => sound.playKeypadClick(),
    },
    {
      id: 'link',
      label: 'Link',
      icon: () => <Upload className="w-6 h-6 stroke-[2]" />,
      onClick: () => sound.playKeypadClick(),
    },
    {
      id: 'international',
      label: 'International',
      icon: () => <Globe className="w-6 h-6 stroke-[2]" />,
      onClick: () => sound.playKeypadClick(),
    },
    {
      id: 'crypto',
      label: 'Crypto',
      icon: () => <Bitcoin className="w-6 h-6 stroke-[2]" />,
      onClick: () => sound.playKeypadClick(),
    },
    {
      id: 'more',
      label: 'More',
      icon: () => <MoreHorizontal className="w-6 h-6 stroke-[2]" />,
      onClick: () => sound.playKeypadClick(),
    },
  ];

  // Specific contacts matching Screenshot #4
  const raresContact = {
    id: 'c-rares',
    name: 'Rareș Roman',
    phone: '+40 742 819 032',
    iban: 'RO50 REVO 0000 1697 1825 8222',
    initials: 'RR',
    avatarColor: '#F59E0B',
    badge: '@rares_roman',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=faces',
    transfers: [],
  };

  const revolutFriends = [
    {
      id: 'c-angelica',
      name: 'ANGELICA ADRIANA BALAJ',
      handle: '@balaja5lp4',
      phone: '+40 755 123 456',
      iban: 'RO32 REVO 0000 5512 3456 7890',
      initials: 'AB',
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=faces',
      badge: 'Revolut',
      transfers: [],
    },
    {
      id: 'c-alexandru',
      name: 'Alexandru Acatrinei',
      handle: '@alexandmbd',
      phone: '+40 722 987 654',
      iban: 'RO88 REVO 0000 2298 7654 3210',
      initials: 'AA',
      avatarColor: '#3B82F6',
      badge: 'Revolut',
      transfers: [],
    },
    {
      id: 'c-ana',
      name: 'Ana Paina',
      handle: '@anapaina',
      phone: '+40 733 456 789',
      iban: 'RO12 REVO 0000 3345 6789 0123',
      initials: 'AP',
      avatarColor: '#F97316',
      badge: 'Revolut',
      transfers: [],
    },
  ];

  const handleSelectContact = (contact: Contact) => {
    sound.playKeypadClick();
    setSelectedContactForTransfer(contact);
  };

  return (
    <div
      className={`${
        isTabMode ? 'w-full h-full' : 'absolute inset-0 z-[60]'
      } bg-[#060a14] text-white flex flex-col justify-between overflow-y-auto no-scrollbar select-none`}
    >
      <div
        style={{
          paddingTop: 'max(env(safe-area-inset-top, 0px), 16px)',
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 80px)',
        }}
        className="px-4 pb-24 flex flex-col w-full"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              sound.playKeypadClick();
              if (isTabMode) {
                // If in tab mode, keep tab state
              } else {
                setTransferOpen(false);
              }
            }}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-white transition shadow-sm"
          >
            {isTabMode ? (
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-amber-700 via-stone-800 to-amber-400 flex items-center justify-center">
                <span className="text-white font-bold text-xs">M</span>
              </div>
            ) : (
              <X className="w-5 h-5" />
            )}
          </motion.button>
        </div>

        {/* Title: New payment */}
        <h1 className="text-[28px] font-bold text-white tracking-tight mt-3">
          New payment
        </h1>

        {/* Search Bar with QR scanner icon (Screenshot #4) */}
        <div className="mt-3 w-full bg-white/10 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2.5 flex items-center justify-between text-white/70 shadow-sm">
          <div className="flex items-center gap-2.5 flex-1 mr-2">
            <Search className="w-4 h-4 text-white/60 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Name, @Revtag, phone, email"
              className="bg-transparent text-xs text-white placeholder-white/50 focus:outline-none w-full"
            />
          </div>
          <button
            onClick={() => sound.playKeypadClick()}
            className="text-white/80 hover:text-white transition shrink-0"
          >
            <QrCode className="w-5 h-5" />
          </button>
        </div>

        {/* 8 Action Tiles (2 rows of 4) matching Screenshot #4 */}
        <div className="mt-5 grid grid-cols-4 gap-y-4 gap-x-2">
          {actionTiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <div key={tile.id} className="flex flex-col items-center">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  onClick={tile.onClick}
                  className="w-14 h-14 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 flex items-center justify-center text-white shadow-md transition-colors"
                >
                  <Icon />
                </motion.button>
                <span className="text-[11px] text-white/70 font-medium text-center mt-1.5 tracking-tight">
                  {tile.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* "Add your contacts" Card (Screenshot #4) */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => sound.playKeypadClick()}
          className="mt-6 w-full rounded-2xl bg-white/[0.06] hover:bg-white/[0.09] border border-white/10 p-3.5 flex items-center gap-3.5 shadow-md cursor-pointer transition"
        >
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/80 shrink-0">
            <User className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white tracking-tight">
              Add your contacts
            </div>
            <div className="text-xs text-white/50 mt-0.5">
              Send money to friends on Revolut, instantly
            </div>
          </div>
        </motion.div>

        {/* Rareș Roman Contact Card (Screenshot #4) */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelectContact(raresContact)}
          className="mt-3 w-full rounded-2xl bg-white/[0.06] hover:bg-white/[0.09] border border-white/10 p-3.5 flex items-center justify-between shadow-md cursor-pointer transition"
        >
          <div className="flex items-center gap-3.5">
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-white/20 shadow-sm">
                <img
                  src={raresContact.avatarUrl}
                  alt={raresContact.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Revolut R badge on bottom-right corner */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-md p-0.5">
                <RevolutLogo variant="black" className="w-3 h-3" />
              </div>
            </div>

            <div>
              <div className="text-[15px] font-semibold text-white tracking-tight">
                {raresContact.name}
              </div>
              <div className="text-xs text-white/50 mt-0.5">{raresContact.badge}</div>
            </div>
          </div>
        </motion.div>

        {/* Revolut Friends · 22 Section (Screenshot #4) */}
        <div className="mt-6">
          <div className="text-sm font-semibold text-white/90 mb-2 px-1">
            Revolut friends · 22
          </div>

          <div className="w-full rounded-2xl bg-white/[0.06] border border-white/10 divide-y divide-white/5 overflow-hidden shadow-md">
            {revolutFriends.map((f) => (
              <motion.div
                key={f.id}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  handleSelectContact({
                    id: f.id,
                    name: f.name,
                    phone: f.phone,
                    iban: f.iban,
                    initials: f.initials,
                    avatarColor: f.avatarColor,
                    badge: f.badge,
                    transfers: [],
                  })
                }
                className="p-3.5 flex items-center justify-between hover:bg-white/[0.03] active:bg-white/[0.06] transition cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative shrink-0">
                    {f.avatarUrl ? (
                      <div className="w-11 h-11 rounded-full overflow-hidden border border-white/20 shadow-sm">
                        <img
                          src={f.avatarUrl}
                          alt={f.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm"
                        style={{ backgroundColor: f.avatarColor }}
                      >
                        {f.initials}
                      </div>
                    )}
                    {/* Revolut R badge */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-md p-0.5">
                      <RevolutLogo variant="black" className="w-3 h-3" />
                    </div>
                  </div>

                  <div>
                    <div className="text-[15px] font-semibold text-white tracking-tight">
                      {f.name}
                    </div>
                    <div className="text-xs text-white/50 mt-0.5">{f.handle}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
