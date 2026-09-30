'use client';
import { useState } from 'react';
import { Plus, X, ArrowLeft } from 'lucide-react';
import { useRevolutStore } from '@/store/useRevolutStore';
import { CardPreview } from './CardPreview';
import { CardsScreen } from './CardsScreen';

export function ReferenceWallet() {
  const state=useRevolutStore();
  const [selected,setSelected]=useState<string|null>(null);
  const [adding,setAdding]=useState(false);
  if(!state.walletOpen)return null;
  if(selected)return <section role="dialog" aria-modal="true" aria-label="Card details" className="absolute inset-0 z-[75] bg-black flex flex-col"><button aria-label="Back to wallet" onClick={()=>setSelected(null)} className="reference-back m-4"><ArrowLeft/></button><div className="flex-1 min-h-0"><CardsScreen initialCardId={selected}/></div></section>;
  return <section role="dialog" aria-modal="true" aria-label="Wallet" className="reference-wallet no-scrollbar">
    <button className="reference-back" aria-label="Close wallet" onClick={()=>state.setWalletOpen(false)}><X/></button><h1>Wallet</h1>
    <div className="reference-wallet-list">{state.cards.map(card=><button key={card.id} className="reference-wallet-row" onClick={()=>setSelected(card.id)}><CardPreview card={card}/><span><strong>{card.name}</strong><small>{card.isFrozen?'Card is frozen':card.type==='disposable'?'Regenerates details after each use':`··${card.last4}, ${card.expiry}`}</small></span></button>)}<button className="reference-wallet-row" onClick={()=>state.setUiPanel('rewards')}><span className="reference-pay-card">R Pay</span><span><strong>Revolut Pay</strong><small>A secure 1-click checkout</small></span></button></div>
    <button className="reference-wallet-add" onClick={()=>setAdding(true)}><Plus/>Add new</button>
    {adding&&<div className="absolute inset-0 z-10 bg-black/70 flex items-end"><section role="dialog" aria-label="Add new card" className="w-full rounded-t-3xl bg-[#202023] p-6 space-y-4"><button aria-label="Close new card" className="float-right" onClick={()=>setAdding(false)}><X/></button><h2 className="text-xl">Add new</h2>{(['virtual','disposable'] as const).map(type=><button key={type} className="block w-full bg-white/10 rounded-2xl p-4 text-left" onClick={()=>{state.createNewCard(type);setAdding(false);}}>{type==='virtual'?'Virtual card':'Disposable virtual card'}</button>)}</section></div>}
  </section>;
}
