'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, CreditCard, Loader2, X } from 'lucide-react';
import { Currency } from '@/types';
import { useRevolutStore } from '@/store/useRevolutStore';
import { ApplePayLogo } from '@/components/ui/AppleLogo';
import { CardPreview } from '@/components/cards/CardPreview';
import { formatCurrencyAmount } from '@/utils/formatters';

interface Props {isOpen:boolean;onClose:()=>void;amount:number;currency:Currency;onSuccess:()=>void;}
export function ApplePaySheet({isOpen,onClose,amount,currency,onSuccess}:Props) {
  const cards=useRevolutStore(state=>state.cards);
  const [selectedId,setSelectedId]=useState('card-blood');
  const [options,setOptions]=useState(false);
  const [phase,setPhase]=useState<'ready'|'processing'|'done'>('ready');
  const selected=cards.find(card=>card.id===selectedId)||cards.find(card=>!card.isFrozen);
  const formatted=formatCurrencyAmount(amount,currency,{useFormalCode:true});
  useEffect(()=>{if(!isOpen){setPhase('ready');setOptions(false);}},[isOpen]);
  useEffect(()=>{
    if(!isOpen||phase==='ready')return;
    const timer=window.setTimeout(()=>phase==='processing'?setPhase('done'):onSuccess(),phase==='processing'?1200:700);
    return()=>window.clearTimeout(timer);
  },[isOpen,phase,onSuccess]);
  return <AnimatePresence>{isOpen&&<div className="absolute inset-0 z-[80] bg-black/65 flex items-end p-[2cqw]">
    <motion.section role="dialog" aria-modal="true" aria-label="Apple Pay confirmation" initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} transition={{type:'spring',stiffness:280,damping:30}} className="reference-apple-sheet">
      <header><button className="reference-back" aria-label="Cancel Apple Pay" onClick={onClose}><X/></button><ApplePayLogo variant="white"/><span/></header>
      <div className="reference-apple-total"><p>Pay Revolut</p><h2>{formatted}</h2></div>
      <div className="reference-apple-cards"><div className="apple-back-card left"/><div className="apple-back-card right"/>{selected&&<CardPreview card={selected} details/>}</div>
      <button className="reference-other-cards" onClick={()=>setOptions(!options)}>Other Cards & Payment Options</button>
      {options&&<div className="reference-apple-options">{cards.filter(card=>!card.isFrozen).map(card=><button key={card.id} onClick={()=>{setSelectedId(card.id);setOptions(false);}}>{card.name} ··{card.last4}</button>)}</div>}
      <button className="reference-apple-method" onClick={()=>setOptions(!options)}><i><CreditCard/></i><span><small>Revolut {selected?.scheme==='mastercard'?'Mastercard':'Visa'}</small><span>Pay {formatted}</span></span></button>
      <div className="reference-apple-summary"><strong>Total</strong><strong>{formatted}</strong></div>
      <div className="reference-apple-confirm">{phase==='done'?<span role="status"><Check/>Done</span>:phase==='processing'?<span role="status"><Loader2 className="animate-spin"/>Processing demo payment…</span>:<button disabled={!selected||selected.isFrozen} onClick={()=>setPhase('processing')}><i>⇥</i><span>Confirm with Side Button</span></button>}</div>
    </motion.section>
  </div>}</AnimatePresence>;
}
