'use client';
import { useState } from 'react';
import { ArrowLeft, ArrowDownLeft, Search, SlidersHorizontal, ShoppingBag, ChevronDown } from '@/components/ui/OfficialIcons';
import { Transaction } from '@/types';
import { useRevolutStore } from '@/store/useRevolutStore';
import { formatCurrencyAmount } from '@/utils/formatters';
import { motion } from 'framer-motion';
import { useClosingScreen } from '@/components/ui/useClosingScreen';

export function TransactionRow({transaction:tx,compact=false}:{transaction:Transaction;compact?:boolean}) {
  const state=useRevolutStore();
  const contact=state.contacts.find(item=>item.id===tx.contactId);
  const color=tx.brand==='Contact'?contact?.avatarColor:tx.brand==='Kfc'?'#ed0034':tx.brand==='Chantia'?'#071236':'white';
  const glyph=tx.brand==='Contact'?contact?.initials||'BF':tx.brand==='Kfc'?'KFC':tx.brand==='Carrefour'?'C':tx.brand==='City Market'?'CityMarket':tx.brand==='Chantia'?'✧':tx.brand==='Primaria Oradea'?'PO':tx.brand.startsWith('Nufaru')?'Nufăru':null;
  return <button className={`reference-transaction ${compact?'compact':''}`} onClick={()=>state.setSelectedTransactionDetail(tx)}>
    <span className={`reference-merchant ${tx.brand==='Contact'?'is-contact':''}`} style={{background:color||'#5b5ce2',color:tx.brand==='Contact'||tx.brand==='Kfc'||tx.brand==='Chantia'?'white':tx.brand==='Carrefour'?'#1757a0':'#171717'}}>{glyph||<ShoppingBag/>}{tx.isIncoming&&tx.brand==='Contact'&&<i><ArrowDownLeft/></i>}</span>
    <span className="reference-transaction-copy"><span>{tx.title}</span><small>{compact?`${tx.date}, ${tx.timestamp} · ${tx.subtitle}`:tx.timestamp}</small></span>
    <span className={`reference-transaction-value ${tx.isIncoming?'incoming':''} ${tx.status==='reverted'?'reverted':''}`}>{tx.category==='Verification'?'':formatCurrencyAmount(tx.amount,tx.currency,{showDecimalsIfZero:false,includeSign:tx.isIncoming})}</span>
  </button>;
}

export function ReferenceActivity() {
  const state=useRevolutStore();
  const transition=useClosingScreen(()=>state.setUiPanel(null));
  const [query,setQuery]=useState('');
  const [filtersOpen,setFiltersOpen]=useState(false);
  const [direction,setDirection]=useState('all');
  const transactions=state.transactions.filter(tx=>tx.currency===state.activeCurrency&&`${tx.title} ${tx.category}`.toLowerCase().includes(query.toLowerCase())&&(direction==='all'||(direction==='incoming'?tx.isIncoming:!tx.isIncoming)));
  const dates=Array.from(new Set(transactions.map(tx=>tx.date)));
  return <motion.section {...transition.props} onAnimationComplete={transition.finish} initial={{x:'100%'}} animate={{x:transition.closing?'100%':0}} transition={{type:'spring',stiffness:340,damping:34}} role="dialog" aria-modal="true" aria-label="Activity" className="reference-activity no-scrollbar">
    <button className="reference-back" aria-label="Close activity" onClick={()=>transition.close()}><ArrowLeft/></button>
    <h1>{formatCurrencyAmount(state.accounts[state.activeCurrency].balance,state.activeCurrency)}</h1><p>Current balance</p>
    <div className="reference-activity-search"><label><Search/><input aria-label="Search transactions" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search"/></label><button aria-label="Filter transactions" className="reference-back" onClick={()=>setFiltersOpen(!filtersOpen)}><SlidersHorizontal/></button></div>
    {filtersOpen&&<label className="reference-filter">Show<select aria-label="Transaction direction" value={direction} onChange={event=>setDirection(event.target.value)}><option value="all">All transactions</option><option value="incoming">Money in</option><option value="outgoing">Money out</option></select><ChevronDown size={16}/></label>}
    {dates.map(date=><section key={date}><header className="reference-day"><h2>{date}</h2><span>{formatCurrencyAmount(transactions.filter(tx=>tx.date===date).reduce((sum,tx)=>sum+tx.amount,0),state.activeCurrency)}</span></header><div className="reference-history-card">{transactions.filter(tx=>tx.date===date).map(tx=><TransactionRow key={tx.id} transaction={tx}/>)}</div></section>)}
    {!transactions.length&&<p className="text-center py-8">No transactions found</p>}
  </motion.section>;
}
