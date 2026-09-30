'use client';
import { Calendar, Plus, Search } from 'lucide-react';
import { useRevolutStore } from '@/store/useRevolutStore';
import { AnalyticsGlyph, CardsGlyph } from '@/components/ui/ReferenceIcons';

export function AppHeader({payments=false}:{payments?:boolean}) {
  const state=useRevolutStore();
  const unread=state.notifications.some(item=>!item.read)||state.contacts.some(contact=>contact.unread);
  return <header className="reference-header">
    <button aria-label="Profile" className="reference-avatar" onClick={()=>state.setUiPanel('profile')}><img src="/profile.png" alt="Profile"/>{unread&&<i/>}</button>
    <button aria-label="Search" className="reference-search" onClick={()=>state.setHomeTool('search')}><Search/><span>Search</span></button>
    <button aria-label={payments?'Scheduled payments':'Analytics'} className="reference-header-circle" onClick={()=>payments?state.setUiPanel('scheduled'):state.setHomeTool('analytics')}>{payments?<Calendar/>:<AnalyticsGlyph/>}</button>
    <button aria-label={payments?'New payment':'Wallet & Cards'} className="reference-header-circle" onClick={()=>payments?state.setTransferOpen(true):state.setWalletOpen(true)}>{payments?<Plus/>:<CardsGlyph/>}</button>
  </header>;
}
