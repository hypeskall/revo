'use client';

import React, { useEffect, useState } from 'react';
import { Search, Plus, ArrowDown, Info, MoreHorizontal, X, ArrowUpRight, TrendingUp, ArrowLeftRight, Bitcoin, Sparkles } from '@/components/ui/OfficialIcons';
import { useRevolutStore } from '@/store/useRevolutStore';
import { HomeToolsSheet } from './HomeToolsSheet';
import { Transaction } from '@/types';
import { TabId } from '@/components/navigation/BottomTabBar';
import { CardsScreen } from '@/components/cards/CardsScreen';

const examples: Transaction[] = [
  { id:'bills-utility-example', title:'Utility bills', subtitle:'Bills pocket', amount:-634, currency:'EUR', date:'Today', timestamp:'14:35', category:'General', brand:'Utilities', isIncoming:false, status:'completed', rawDate:0 },
  { id:'bills-gym-example', title:'Gym membership', subtitle:'Bills pocket', amount:-29.99, currency:'EUR', date:'Today', timestamp:'10:20', category:'General', brand:'Gym', isIncoming:false, status:'completed', rawDate:0 },
];
const euro = (value: number) => new Intl.NumberFormat('en-GB', {maximumFractionDigits:2}).format(value);

function UtilityIcon() {
  return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M2 15 16 3l14 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="m5 15 11-9 11 9v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Zm8 6v7h6v-7a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2Z" fill="currentColor" fillRule="evenodd"/></svg>;
}

function GymIcon() {
  return <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><rect x="0" y="11" width="5" height="10" rx="2"/><rect x="4" y="6" width="6" height="20" rx="3"/><rect x="9" y="11" width="14" height="10" rx="2"/><rect x="22" y="6" width="6" height="20" rx="3"/><rect x="27" y="11" width="5" height="10" rx="2"/></svg>;
}

export function BillsHome({ onNavigate }: { onNavigate: (tab: TabId) => void }) {
  const state = useRevolutStore();
  const [panel, setPanel] = useState<'add'|'withdraw'|'information'|'cards'|null>(null);
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  useEffect(() => { state.setScreenOverlayOpen(!!panel || appearanceOpen); return () => useRevolutStore.getState().setScreenOverlayOpen(false); }, [panel, appearanceOpen]);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [whole, cents] = state.billsBalance.toFixed(2).split('.');
  const activity = [...state.transactions.filter(tx => tx.id.startsWith('bills-')), ...examples];
  const open = (next: typeof panel) => { setPanel(next); setAmount(''); setError(''); setNotice(''); };
  const actions = [
    {label:'Add money', Icon:Plus, action:()=>open('add')},
    {label:'Withdraw', Icon:ArrowDown, action:()=>open('withdraw')},
    {label:'Information', Icon:Info, action:()=>open('information')},
    {label:'More', Icon:MoreHorizontal, action:()=>state.setHomeTool('more')},
  ];
  return <>
    <div className="bills-home no-scrollbar" aria-hidden={!!state.homeTool || !!panel || appearanceOpen} ref={node => { if (node) node.inert = !!state.homeTool || !!panel || appearanceOpen; }}>
      <header className="bills-header">
        <button aria-label="Profile" onClick={()=>state.setUiPanel('profile')} className="bills-avatar"><img src="/profile.png" alt="Profile" /></button>
        <button aria-label="Search" className="bills-search" onClick={()=>state.setHomeTool('search')}><Search /></button>
        <button aria-label="Analytics" className="bills-header-icon" onClick={()=>state.setHomeTool('analytics')}><svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><rect x="3" y="19" width="6" height="10" rx="3"/><rect x="13" y="3" width="6" height="26" rx="3"/><rect x="23" y="11" width="6" height="18" rx="3"/></svg></button>
        <button aria-label="Cards" className="bills-header-icon" onClick={()=>open('cards')}><svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M5 6h22a3 3 0 0 1 3 3v2H2V9a3 3 0 0 1 3-3Zm-3 8h28v9a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3Zm5 6v3h11v-3Z" fillRule="evenodd"/></svg></button>
      </header>
      <section className="bills-balance" aria-label="Bills pocket balance">
        <h1>Bills</h1>
        <div className="bills-amount"><span>{whole}</span><span className="bills-cents">.{cents}</span><span className="bills-symbol">€</span></div>
        <button className="bills-accounts" onClick={()=>state.setAccountsDrawerOpen(true)}>Accounts</button>
      </section>
      <div className="bills-actions">{actions.map(({label,Icon,action})=><button key={label} aria-label={label} data-home-more={label === 'More' ? '' : undefined} onClick={action}><span className="bills-action-circle"><Icon strokeWidth={label==='Withdraw'?4:2.6}/></span><span>{label==='Add money'?<>Add<br/>money</>:label}</span></button>)}</div>
      <section className="bills-transactions" aria-label="Bills transactions">{activity.map(tx=>{
        const Icon = tx.brand==='Utilities'?UtilityIcon:tx.brand==='Gym'?GymIcon:ArrowUpRight;
        return <button className="bills-transaction" key={tx.id} onClick={()=>state.setSelectedTransactionDetail(tx)}>
          <span className={`bills-merchant ${tx.brand==='Utilities'?'utility':tx.brand==='Gym'?'gym':'transfer'}`}><Icon /></span>
          <span className="bills-transaction-copy"><span>{tx.brand==='Utilities'?<>Utility<br/>bills</>:tx.brand==='Gym'?<>Gym<br/>membership</>:tx.title}</span><time>{tx.timestamp}</time></span>
          <span className="bills-transaction-amount">{tx.amount<0?'-':'+'}{euro(Math.abs(tx.amount))} €</span>
        </button>;
      })}</section>
    </div>
    <HomeToolsSheet tool={state.homeTool} additionalTransactions={examples} currency="EUR" onClose={()=>state.setHomeTool(null)} onSelectTool={state.setHomeTool} onOpenWallet={()=>open('cards')} onThemeOpenChange={setAppearanceOpen}/>
    {panel === 'cards' && <section role="dialog" aria-modal="true" aria-label="Cards" className="absolute inset-0 z-[70] flex flex-col bg-black">
      <button aria-label="Close cards" onClick={() => setPanel(null)} className="self-start rounded-full bg-white/10 p-2 m-4"><X size={20}/></button>
      <div className="flex-1 min-h-0"><CardsScreen /></div>
    </section>}
    {panel && panel !== 'cards' && <div className="absolute inset-0 z-[70] flex flex-col justify-end bg-black/65 backdrop-blur-sm">
      <section role="dialog" aria-modal="true" aria-label={panel==='information'?'Bills information':panel==='add'?'Add money to Bills':'Withdraw from Bills'} className="relative max-h-[90%] overflow-y-auto rounded-t-[28px] bg-[#191919] p-5 pb-8">
        <button aria-label="Close panel" onClick={()=>setPanel(null)} className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2"><X size={20}/></button>
        {panel==='information'?<><h2 className="text-2xl mb-5">Bills</h2><p className="text-white/60 leading-relaxed">Keep money aside for regular expenses. Add money from your EUR account or withdraw it back to that account.</p><p className="mt-5">Available: {euro(state.billsBalance)} €</p><p className="mt-5 text-sm text-white/50">Sandbox pocket. No real payments are made.</p></>:<>
          <h2 className="text-2xl mb-5 pr-10">{panel==='add'?'Add money':'Withdraw'}</h2>
          <p className="text-sm text-white/60">{panel==='add'?'EUR account → Bills':'Bills → EUR account'}</p>
          <p className="text-sm text-white/60 mt-2">Available: {euro(panel==='add'?state.accounts.EUR.balance:state.billsBalance)} €</p>
          <label className="block mt-6 text-sm">Amount in EUR<input aria-label="Amount in EUR" inputMode="decimal" type="number" min="0.01" step="0.01" value={amount} onChange={e=>{setAmount(e.target.value);setError('');}} className="block w-full bg-transparent py-3 text-4xl outline-none" placeholder="0.00"/></label>
          {error && <p role="alert" className="text-red-400 mb-3">{error}</p>}{notice && <p role="status" className="text-green-400 mb-3">{notice}</p>}
          <button className="w-full rounded-full bg-white text-black py-4 mt-3" onClick={()=>{const problem=state.moveBillsMoney(Number(amount),panel==='withdraw');if(problem)setError(problem);else{setNotice('Pocket transfer completed');setAmount('');}}}>{panel==='add'?'Add money':'Withdraw'}</button>
          {panel==='add' && <button className="w-full text-blue-300 mt-4" onClick={()=>{setPanel(null);state.setActiveCurrency('EUR');state.setAddMoneyOpen(true);}}>Top up EUR account with demo money</button>}
        </>}
      </section>
    </div>}
  </>;
}
