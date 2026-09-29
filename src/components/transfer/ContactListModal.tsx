'use client';

import React, { useState } from 'react';
import { useRevolutStore } from '@/store/useRevolutStore';
import { Contact } from '@/types';
import { Search, Calendar, Plus, ArrowLeft } from 'lucide-react';
import { sound } from '@/utils/audio';
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

  // If a contact is selected, show the 1:1 Contact Chat / Transfer screen (Screenshot #5)
  if (selectedContactForTransfer) {
    return (
      <ContactChatScreen
        contact={selectedContactForTransfer}
        onBack={() => setSelectedContactForTransfer(null)}
      />
    );
  }

  const paymentContacts = [
    {
      id: 'c-rares',
      name: 'Rareș Roman',
      sub: 'You sent 1 lei',
      time: '15:15',
      initials: 'RR',
      color: '#F59E0B',
      isRR: true,
    },
    {
      id: 'c-andrei-d',
      name: 'Andrei Durla',
      sub: 'You sent 46 lei',
      time: '10:21',
      isCat: true,
      hasR: true,
    },
    {
      id: 'c-angelica',
      name: 'ANGELICA ADRIANA BAL...',
      sub: 'Sent you 22,99 lei',
      time: '10:21',
      hasR: true,
      unreadBadge: '1',
      color: '#4B5563',
      initials: 'AB',
    },
    {
      id: 'c-briana',
      name: 'Briana Filip',
      sub: 'Sent you 10 lei',
      time: '26 Sep',
      initials: 'BF',
      color: '#60A5FA',
      hasR: true,
      unreadBadge: '1',
    },
    {
      id: 'c-raisa',
      name: 'Raisa Sabau',
      sub: 'Sent you 50 lei',
      time: '7 Sep',
      initials: 'RS',
      color: '#EC4899',
      hasR: true,
      unreadBadge: '1',
    },
    {
      id: 'c-mihaela',
      name: 'Mihaela Ioana Laslau',
      sub: 'Sent you 6 lei',
      time: '1 Sep',
      initials: 'MI',
      color: '#0284C7',
      hasR: true,
    },
    {
      id: 'c-luca',
      name: 'Luca Bucurean',
      sub: 'You sent 20 lei',
      time: '16 Aug',
      initials: 'LB',
      color: '#14B8A6',
      hasR: true,
    },
    {
      id: 'c-diana',
      name: 'Diana Codruta Tipi',
      sub: 'Sent you 820 lei',
      time: '4 Aug',
      initials: 'DC',
      color: '#818CF8',
      hasR: true,
    },
    {
      id: 'c-cristian',
      name: 'Cristian Mesesan',
      sub: 'You sent 20 lei',
      time: '2 Aug',
      initials: 'CM',
      color: '#D97706',
      hasR: true,
    },
  ];

  const filtered = paymentContacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectContact = (c: (typeof paymentContacts)[0]) => {
    sound.playKeypadClick();
    const full = contacts.find((item) => item.id === c.id) || {
      id: c.id,
      name: c.name,
      phone: '+40 742 819 032',
      iban: 'RO60 ROIN 4021 L1ZY TN7Q ETE6',
      initials: c.initials || 'RR',
      avatarColor: c.color || '#F59E0B',
      badge: 'S&P',
      transfers: [],
    };
    setSelectedContactForTransfer(full);
  };

  return (
    <div
      className={`${
        isTabMode ? 'w-full h-full' : 'absolute inset-0 z-[60]'
      } bg-[#070b0e] text-white flex flex-col justify-between overflow-hidden select-none`}
    >
      {/* Top Header matching Screenshot #2 */}
      <div
        style={{
          paddingTop: 'max(env(safe-area-inset-top, 0px), 14px)',
        }}
        className="px-4 pb-2 flex items-center justify-between gap-2.5"
      >
        {isTabMode ? (
          // In tab mode: Avatar with unread dot matching Screenshot #2
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 relative flex items-center justify-center bg-gradient-to-tr from-amber-700 via-stone-800 to-amber-400">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#FF3B30] rounded-full border-2 border-[#070b0e] shadow-[0_0_8px_#FF3B30]" />
          </div>
        ) : (
          // In modal mode: Back arrow
          <button
            onClick={() => {
              sound.playKeypadClick();
              setTransferOpen(false);
            }}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-white active:scale-90 transition shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        {/* Center: Search pill */}
        <div className="flex-1">
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-full px-3.5 py-1.5 flex items-center gap-2 text-white/70 shadow-sm">
            <Search className="w-3.5 h-3.5 text-white/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="bg-transparent text-xs text-white placeholder-white/60 focus:outline-none w-full"
            />
          </div>
        </div>

        {/* Right buttons: Calendar & Plus */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => sound.playKeypadClick()}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-95 transition"
          >
            <Calendar className="w-4 h-4" />
          </button>
          <button
            onClick={() => sound.playKeypadClick()}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-95 transition"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Main Curved Payments List Sheet matching Screenshot #2 */}
      <div className="flex-1 bg-[#090d12]/95 backdrop-blur-2xl rounded-t-[32px] border-t border-white/10 p-5 mt-2 overflow-y-auto no-scrollbar pb-28">
        <div className="divide-y divide-white/[0.04]">
          {filtered.map((c) => (
            <div
              key={c.id}
              onClick={() => handleSelectContact(c)}
              className="py-3.5 px-1 flex items-center justify-between hover:bg-white/[0.02] active:bg-white/[0.04] transition cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Avatar with optional Revolut R badge */}
                <div className="relative shrink-0">
                  {c.isCat ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 shadow-sm bg-neutral-800 flex items-center justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=96&h=96&fit=crop&crop=faces"
                        alt="Andrei Durla"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm"
                      style={{ backgroundColor: c.color || '#F59E0B' }}
                    >
                      {c.initials}
                    </div>
                  )}

                  {/* Revolut R badge on bottom-right */}
                  {c.hasR && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white text-black flex items-center justify-center shadow-md">
                      <span className="text-[9px] font-black leading-none">R</span>
                    </div>
                  )}
                </div>

                {/* Contact Name & Subtitle */}
                <div className="min-w-0">
                  <div className="text-[15px] font-semibold text-white tracking-tight truncate">
                    {c.name}
                  </div>
                  <div className="text-xs text-white/50 truncate mt-0.5">{c.sub}</div>
                </div>
              </div>

              {/* Timestamp & unread badge */}
              <div className="flex flex-col items-end shrink-0 pl-2">
                <span className="text-xs text-white/40">{c.time}</span>
                {c.unreadBadge && (
                  <span className="mt-1 w-4 h-4 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center shadow-sm">
                    {c.unreadBadge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
