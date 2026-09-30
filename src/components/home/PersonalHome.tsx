'use client';
import { Plus, Shuffle, MoreHorizontal, ChevronRight, X, Coins, PiggyBank } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRevolutStore } from '@/store/useRevolutStore';
import { AppHeader } from './AppHeader';
import { BankGlyph } from '@/components/ui/ReferenceIcons';
import { TransactionRow } from './ReferenceActivity';
import { CardPreview } from '@/components/cards/CardPreview';
import { formatCurrencyAmount } from '@/utils/formatters';

export function PersonalHome() {
  const state=useRevolutStore();
  const [showPromo,setShowPromo]=useState(true);
  const currencies=['RON','EUR','USD','GBP'] as const;
  const current=state.accounts[state.activeCurrency];
  const [whole,cents]=new Intl.NumberFormat('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2}).format(current.balance).split('.');
  const actions=[
    {label:'Add money',Icon:Plus,action:()=>state.setAddMoneyOpen(true)},
    {label:'Move',Icon:Shuffle,action:()=>state.setTransferOpen(true)},
    {label:'Details',Icon:BankGlyph,action:()=>state.setHomeTool('details')},
    {label:'More',Icon:MoreHorizontal,action:()=>state.setHomeTool('more')},
  ];
  const activity=state.transactions.filter(tx=>tx.currency===state.activeCurrency).slice(0,3);
  return <div className="reference-home no-scrollbar">
    <AppHeader/>
    <motion.section className="reference-balance" aria-label="Personal balance" drag="x" dragConstraints={{left:0,right:0}} dragElastic={0.12} onDragEnd={(_,info)=>{if(Math.abs(info.offset.x)>45){const index=currencies.indexOf(state.activeCurrency);state.setActiveCurrency(currencies[(index+(info.offset.x<0?1:3))%4]);}}}>
      <h1>Personal · {state.activeCurrency}</h1>
      <div className="reference-amount"><span>{whole}</span><small>.{cents} {current.symbol}</small></div>
      <button className="reference-iban" onClick={()=>state.setHomeTool('details')}><BankGlyph/><span>RO50 REVO 0000 1697 1825 8222</span></button>
      <button className="reference-accounts" onClick={()=>state.setAccountsDrawerOpen(true)}>Accounts<span>5</span></button>
    </motion.section>
    <div className="reference-actions">{actions.map(({label,Icon,action})=><button aria-label={label} key={label} onClick={action}><i><Icon/></i><span>{label}</span></button>)}</div>
    {showPromo&&<section className="reference-promo"><button className="reference-promo-close" aria-label="Dismiss promotion" onClick={()=>setShowPromo(false)}><X/></button><button onClick={()=>state.setUiPanel('rewards')}><strong>Turn RevPoints into discounts</strong><span>Redeem your points as discounts with Revolut Pay. T&Cs apply</span><b>Revolut Pay</b></button></section>}
    <section className="reference-feed" aria-label="Recent activity">{activity.map(tx=><TransactionRow key={tx.id} transaction={tx}/>)}<button className="reference-see-all" onClick={()=>state.setUiPanel('activity')}>See all <ChevronRight size={15}/></button></section>
    <section className="reference-widgets">
      <button className="reference-joint" onClick={()=>state.setAccountsDrawerOpen(true)}><span className="joint-avatar">M</span><span>Maria</span><strong>1.28 lei</strong><i><Plus/></i></button>
      <section className="reference-widget"><button className="reference-widget-title" onClick={()=>state.setWalletOpen(true)}>Cards <ChevronRight size={19}/></button><div className="reference-mini-cards">{['card-blood','card-shirt','card-surge'].flatMap(id=>state.cards.filter(card=>card.id===id)).map(card=><button key={card.id} onClick={()=>state.setWalletOpen(true)}><CardPreview card={card}/><span>{card.name}</span><small>··{card.last4}</small></button>)}</div><div className="reference-dots">● ● ●</div></section>
      <section className="reference-widget reference-wealth"><button className="reference-widget-title" onClick={()=>state.setAccountsDrawerOpen(true)}>Total wealth <ChevronRight size={19}/></button><strong>{formatCurrencyAmount(state.accounts.RON.balance,'RON',{showDecimalsIfZero:false})}</strong><button onClick={()=>state.setAccountsDrawerOpen(true)}><i><Coins/></i><span>Cash</span><span>{formatCurrencyAmount(state.accounts.RON.balance,'RON')}</span></button><button onClick={()=>state.setUiPanel('invest')}><i><PiggyBank/></i><span>Savings & Funds<small>Explore savings in this prototype</small></span><ChevronRight/></button></section>
    </section>
  </div>;
}
