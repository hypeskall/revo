'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown, Delete, X } from 'lucide-react';
import { useRevolutStore } from '@/store/useRevolutStore';
import { formatCurrencyAmount } from '@/utils/formatters';
import { ApplePayLogo } from '@/components/ui/AppleLogo';
import { ApplePaySheet } from './ApplePaySheet';

export function AddMoneyModal() {
  const state=useRevolutStore();
  const [input,setInput]=useState('610');
  const [appleOpen,setAppleOpen]=useState(false);
  const [methodsOpen,setMethodsOpen]=useState(false);
  const [method,setMethod]=useState('Apple Pay');
  const [operator,setOperator]=useState<string|null>(null);
  const [operand,setOperand]=useState<number|null>(null);
  const [replace,setReplace]=useState(false);
  const [error,setError]=useState('');
  const amount=Number(input.replace(',','.'));
  const digit=(value:string)=>{setError('');if(value==='.'){if(!input.includes('.'))setInput(input+'.');return;}if(replace||input==='0'){setInput(value);setReplace(false);}else if(input.length<12&&(!input.includes('.')||input.split('.')[1].length<2))setInput(input+value);};
  const calculate=(next:string)=>{
    let result=amount;
    if(operator&&operand!==null){result=operator==='+'?operand+amount:operator==='−'?operand-amount:operator==='×'?operand*amount:operand/amount;}
    if(!Number.isFinite(result)||result<0||result>999999999){setError('Enter a valid amount');return;}
    setInput(String(Math.round(result*100)/100));setOperand(next==='='?null:result);setOperator(next==='='?null:next);setReplace(true);
  };
  useEffect(()=>{if(state.isAddMoneyOpen){setAppleOpen(false);setMethodsOpen(false);setError('');}},[state.isAddMoneyOpen]);
  useEffect(()=>{
    if(!state.isAddMoneyOpen||appleOpen||methodsOpen)return;
    const handle=(event:KeyboardEvent)=>{if(/^[0-9]$/.test(event.key)){event.preventDefault();digit(event.key);}else if(event.key==='.'||event.key===','){event.preventDefault();digit('.');}else if(event.key==='Backspace'){event.preventDefault();setInput(value=>value.length>1?value.slice(0,-1):'0');}else if(event.key==='Escape')state.setAddMoneyOpen(false);};
    window.addEventListener('keydown',handle);return()=>window.removeEventListener('keydown',handle);
  });
  if(!state.isAddMoneyOpen)return null;
  return <section role="dialog" aria-modal="true" aria-label="Add money" className="reference-add-money">
    <header><button className="reference-back" aria-label="Close add money" onClick={()=>state.setAddMoneyOpen(false)}><ArrowLeft/></button><div><h1>Add money</h1><p>Balance: {formatCurrencyAmount(state.accounts[state.activeCurrency].balance,state.activeCurrency)}</p></div><span/></header>
    <div className="reference-topup-main"><div className="reference-topup-amount"><span>{input}</span><motion.i animate={{opacity:[1,0,1]}} transition={{repeat:Infinity,duration:1}}/><span>{state.accounts[state.activeCurrency].symbol}</span></div><button className="reference-method" onClick={()=>setMethodsOpen(true)}>{method==='Apple Pay'&&<ApplePayLogo variant="white"/>}<span>{method} · {state.activeCurrency}</span><ChevronDown/></button><div className="reference-arrival"><p>{error||<>Arriving <span>· Usually instantly</span></>}</p><button className="reference-pay" aria-label={method==='Apple Pay'?'Pay with Apple Pay':'Add money with card'} disabled={!Number.isFinite(amount)||amount<=0} onClick={()=>setAppleOpen(true)}>{method==='Apple Pay'?<ApplePayLogo variant="black"/>:'Add money'}</button></div></div>
    <div className="reference-keypad"><div className="reference-operators">{['+','−','×','÷','='].map(op=><button key={op} aria-label={`Calculate ${op}`} onClick={()=>calculate(op)} className={operator===op?'active':''}>{op}</button>)}</div><div className="reference-digits">{['1','2','3','4','5','6','7','8','9','.','0','delete'].map(value=><motion.button whileTap={{scale:.9}} aria-label={value==='delete'?'Delete digit':value==='.'?'Decimal point':value} key={value} onClick={()=>value==='delete'?setInput(input.length>1?input.slice(0,-1):'0'):digit(value)}>{value==='delete'?<Delete/>:value}</motion.button>)}</div></div>
    {methodsOpen&&<div className="absolute inset-0 z-[70] bg-black/70 flex items-end"><section role="dialog" aria-label="Payment method" className="w-full rounded-t-3xl bg-[#202023] p-6"><button aria-label="Close payment methods" className="float-right" onClick={()=>setMethodsOpen(false)}><X/></button><h2 className="text-xl mb-6">Add money with</h2>{['Apple Pay','Debit card'].map(option=><button className="block w-full p-4 rounded-xl bg-white/10 mb-3 text-left" key={option} onClick={()=>{setMethod(option);setMethodsOpen(false);}}>{option}</button>)}</section></div>}
    <ApplePaySheet isOpen={appleOpen} onClose={()=>setAppleOpen(false)} amount={amount} currency={state.activeCurrency} onSuccess={()=>{setAppleOpen(false);state.addMoney(amount,state.activeCurrency,method);state.setAddMoneyOpen(false);}}/>
  </section>;
}
