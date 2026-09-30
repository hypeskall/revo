import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { presentationContacts, presentationTransactions, presentationCards } from '@/data/presentation';
import {
  Account,
  BankCard,
  Contact,
  Currency,
  Transaction,
} from '@/types';

interface RevolutState {
  uiPanel: 'profile' | 'notifications' | 'activity' | 'scheduled' | 'new-contact' | 'help' | 'invest' | 'crypto' | 'rewards' | 'plan' | null;
  setUiPanel: (panel: RevolutState['uiPanel']) => void;
  walletOpen: boolean;
  setWalletOpen: (open: boolean) => void;
  notifications: {id:string;title:string;message:string;read:boolean;timestamp:number}[];
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled:boolean) => void;
  notify: (title:string,message:string) => void;
  markNotificationsRead: () => void;
  markContactRead: (id:string) => void;
  addContact: (name:string) => Contact;
  scheduledPayments: {id:string;contactId:string;amount:number;date:string;status:'scheduled'|'completed'|'failed'}[];
  schedulePayment: (contactId:string,amount:number,date:string) => string|null;
  cancelScheduledPayment: (id:string) => void;
  processScheduledPayments: () => void;
  demoHoldings: Record<string,number>;
  tradeDemo: (asset:string,amount:number,sell:boolean) => string|null;
  revPoints: number;
  redeemPoints: (points:number) => string|null;
  selectedPlan: string;
  selectPlan: (plan:string) => void;
  homeAccount: 'bills' | 'personal';
  setHomeAccount: (account: 'bills' | 'personal') => void;
  billsBalance: number;
  moveBillsMoney: (amount: number, withdraw: boolean) => string | null;
  // Accounts & Balances
  accounts: Record<Currency, Account>;
  activeCurrency: Currency;
  
  // Transactions
  transactions: Transaction[];
  
  // Contacts & Chats
  contacts: Contact[];
  
  // Cards
  cards: BankCard[];
  
  // Exchange Rates
  rates: Record<string, number>;
  
  // Settings & Simulator toggles
  soundEnabled: boolean;
  frameMode: 'iphone' | 'fullscreen';
  
  // Modals & UI States
  isAccountsDrawerOpen: boolean;
  isAddMoneyOpen: boolean;
  isTransferOpen: boolean;
  selectedContactForTransfer: Contact | null;
  isExchangeOpen: boolean;
  isGodModeOpen: boolean;
  selectedTransactionDetail: Transaction | null;
  homeTool: 'search' | 'analytics' | 'details' | 'more' | null;

  // Actions
  setActiveCurrency: (currency: Currency) => void;
  setAccountsDrawerOpen: (open: boolean) => void;
  setAddMoneyOpen: (open: boolean) => void;
  setTransferOpen: (open: boolean) => void;
  setSelectedContactForTransfer: (contact: Contact | null) => void;
  setExchangeOpen: (open: boolean) => void;
  setGodModeOpen: (open: boolean) => void;
  setSelectedTransactionDetail: (tx: Transaction | null) => void;
  setHomeTool: (tool: 'search' | 'analytics' | 'details' | 'more' | null) => void;
  setFrameMode: (mode: 'iphone' | 'fullscreen') => void;
  setSoundEnabled: (enabled: boolean) => void;
  
  // Financial Operations
  addMoney: (amount: number, currency: Currency, method?: string) => void;
  sendTransfer: (contactId: string, amount: number, currency: Currency, note?: string) => { success: boolean; error?: string };
  exchangeCurrency: (fromCurr: Currency, toCurr: Currency, fromAmount: number, toAmount: number) => { success: boolean; error?: string };
  
  // Card Actions
  toggleFreezeCard: (cardId: string) => void;
  createNewCard: (type: 'virtual' | 'disposable') => void;
  
  // God Mode Operations
  overrideBalance: (currency: Currency, newBalance: number) => void;
  injectCustomTransaction: (tx: Partial<Transaction> & { amount: number; title: string }) => void;
  resetToDefaults: () => void;
}

const DEFAULT_ACCOUNTS: Record<Currency, Account> = {
  RON: {
    id: 'acc-ron',
    currency: 'RON',
    name: 'Romanian Leu',
    balance: 1796.46,
    symbol: 'lei',
    flag: '🇷🇴',
    code: 'RON',
  },
  EUR: {
    id: 'acc-eur',
    currency: 'EUR',
    name: 'Euro',
    balance: 0.00,
    symbol: '€',
    flag: '🇪🇺',
    code: 'EUR',
  },
  USD: {
    id: 'acc-usd',
    currency: 'USD',
    name: 'US Dollar',
    balance: 120.50,
    symbol: '$',
    flag: '🇺🇸',
    code: 'USD',
  },
  GBP: {
    id: 'acc-gbp',
    currency: 'GBP',
    name: 'British Pound',
    balance: 50.00,
    symbol: '£',
    flag: '🇬🇧',
    code: 'GBP',
  },
};

const DEFAULT_RATES: Record<string, number> = {
  'EUR_RON': 4.9765,
  'RON_EUR': 1 / 4.9765,
  'USD_RON': 4.5820,
  'RON_USD': 1 / 4.5820,
  'GBP_RON': 5.8910,
  'RON_GBP': 1 / 5.8910,
  'EUR_USD': 1.0860,
  'USD_EUR': 1 / 1.0860,
  'GBP_EUR': 1.1840,
  'EUR_GBP': 1 / 1.1840,
  'GBP_USD': 1.2860,
  'USD_GBP': 1 / 1.2860,
};

export const useRevolutStore = create<RevolutState>()(
  persist(
    (set, get) => ({
      uiPanel: null,
      scheduledPayments: [],
      schedulePayment: (contactId,amount,date) => {
        if(!get().contacts.some(contact=>contact.id===contactId)||!Number.isFinite(amount)||amount<=0||!Number.isFinite(Date.parse(date))||Date.parse(date)<=Date.now())return 'Choose a recipient, a positive amount and a future date.';
        set(state=>({scheduledPayments:[...state.scheduledPayments,{id:crypto.randomUUID(),contactId,amount:Math.round(amount*100)/100,date,status:'scheduled'}]}));get().notify('Payment scheduled',`${amount.toFixed(2)} RON scheduled.`);return null;
      },
      cancelScheduledPayment: (id) => set(state=>({scheduledPayments:state.scheduledPayments.filter(item=>item.id!==id)})),
      processScheduledPayments: () => {
        for(const payment of get().scheduledPayments.filter(item=>item.status==='scheduled'&&Date.parse(item.date)<=Date.now())){
          const result=get().sendTransfer(payment.contactId,payment.amount,'RON','Scheduled payment');
          set(state=>({scheduledPayments:state.scheduledPayments.map(item=>item.id===payment.id?{...item,status:result.success?'completed':'failed'}:item)}));
          if(!result.success)get().notify('Scheduled payment failed',result.error||'Transfer failed');
        }
      },
      demoHoldings: {},
      tradeDemo: (asset,amount,sell) => {
        if(!Number.isFinite(amount)||amount<=0)return 'Enter a positive amount.';
        const value=Math.round(amount*100)/100;
        const state=get();const available=sell?(state.demoHoldings[asset]||0):state.accounts.RON.balance;
        if(value>available)return sell?'Not enough in this holding.':'Insufficient RON balance.';
        set({accounts:{...state.accounts,RON:{...state.accounts.RON,balance:Math.round((state.accounts.RON.balance+(sell?value:-value))*100)/100}},demoHoldings:{...state.demoHoldings,[asset]:Math.round(((state.demoHoldings[asset]||0)+(sell?-value:value))*100)/100}});
        get().notify('Demo order completed',`${sell?'Sold':'Bought'} ${value.toFixed(2)} RON of ${asset}.`);return null;
      },
      revPoints: 1420,
      redeemPoints: (points) => {if(!Number.isInteger(points)||points<=0||points>get().revPoints)return 'Not enough points.';set(state=>({revPoints:state.revPoints-points}));get().notify('Reward redeemed',`${points} points redeemed for a demo reward.`);return null;},
      selectedPlan: 'Standard',
      selectPlan: (selectedPlan) => {set({selectedPlan});get().notify('Plan changed',`${selectedPlan} selected for this prototype.`);},
      setUiPanel: (uiPanel) => set({uiPanel}),
      walletOpen: false,
      setWalletOpen: (walletOpen) => set({walletOpen}),
      notifications: [{id:'welcome',title:'Welcome',message:'Your presentation is ready. All payments are simulated.',read:true,timestamp:Date.now()}],
      notificationsEnabled: true,
      setNotificationsEnabled: (notificationsEnabled) => set({notificationsEnabled}),
      notify: (title,message) => set(state=>({notifications:[{id:crypto.randomUUID(),title,message,read:false,timestamp:Date.now()},...state.notifications]})),
      markNotificationsRead: () => set(state=>({notifications:state.notifications.map(item=>({...item,read:true}))})),
      markContactRead: (id) => set(state=>({contacts:state.contacts.map(contact=>contact.id===id?{...contact,unread:0}:contact)})),
      addContact: (name) => {
        const contact:Contact={id:crypto.randomUUID(),name:name.trim(),initials:name.trim().split(/\s+/).map(part=>part[0]).slice(0,2).join('').toUpperCase(),phone:'',iban:'Demo contact account',avatarColor:'#8053ff',transfers:[]};
        set(state=>({contacts:[contact,...state.contacts]}));return contact;
      },
      homeAccount: 'personal',
      setHomeAccount: (homeAccount) => set({ homeAccount }),
      billsBalance: 100.67,
      moveBillsMoney: (amount, withdraw) => {
        const state = get();
        if (!Number.isFinite(amount) || amount <= 0) return 'Enter a valid amount.';
        const value = Math.round(amount * 100) / 100;
        if (value <= 0) return 'Minimum amount is €0.01.';
        if (value > (withdraw ? state.billsBalance : state.accounts.EUR.balance)) return 'Not enough money in this account.';
        const now = new Date();
        set({
          billsBalance: Math.round((state.billsBalance + (withdraw ? -value : value)) * 100) / 100,
          accounts: { ...state.accounts, EUR: { ...state.accounts.EUR, balance: Math.round((state.accounts.EUR.balance + (withdraw ? value : -value)) * 100) / 100 } },
          transactions: [{ id: `bills-${crypto.randomUUID()}`, title: withdraw ? 'Withdrawn from Bills' : 'Added to Bills', subtitle: 'Pocket transfer · Sandbox', amount: withdraw ? -value : value, currency: 'EUR', date: 'Today', timestamp: now.toLocaleTimeString('en-GB', {hour:'2-digit', minute:'2-digit'}), category: 'Transfers', brand: 'Revolut', isIncoming: !withdraw, status: 'completed', rawDate: now.getTime() }, ...state.transactions],
        });
        return null;
      },
      accounts: DEFAULT_ACCOUNTS,
      activeCurrency: 'RON',
      transactions: presentationTransactions,
      contacts: presentationContacts,
      cards: presentationCards,
      rates: DEFAULT_RATES,
      soundEnabled: true,
      frameMode: 'iphone',

      isAccountsDrawerOpen: false,
      isAddMoneyOpen: false,
      isTransferOpen: false,
      selectedContactForTransfer: null,
      isExchangeOpen: false,
      isGodModeOpen: false,
      selectedTransactionDetail: null,
      homeTool: null,

      setActiveCurrency: (currency: Currency) => {
        set({ activeCurrency: currency });
      },

      setAccountsDrawerOpen: (open: boolean) => set({ isAccountsDrawerOpen: open }),
      setAddMoneyOpen: (open: boolean) => set({ isAddMoneyOpen: open }),
      setTransferOpen: (open: boolean) => set({ isTransferOpen: open }),
      setSelectedContactForTransfer: (contact: Contact | null) => set({ selectedContactForTransfer: contact }),
      setExchangeOpen: (open: boolean) => set({ isExchangeOpen: open }),
      setGodModeOpen: (open: boolean) => set({ isGodModeOpen: open }),
      setSelectedTransactionDetail: (tx: Transaction | null) => set({ selectedTransactionDetail: tx }),
      setHomeTool: (homeTool) => set({ homeTool }),
      setFrameMode: (mode: 'iphone' | 'fullscreen') => set({ frameMode: mode }),
      setSoundEnabled: (enabled: boolean) => set({ soundEnabled: enabled }),

      addMoney: (amount: number, currency: Currency, method = 'Apple Pay') => {
        const state = get();
        const account = state.accounts[currency];
        if (!account || !Number.isFinite(amount) || amount <= 0) return;
        amount = Math.round(amount * 100) / 100;
        if(amount <= 0)return;

        const newBalance = Math.round((account.balance + amount) * 100) / 100;
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const newTx: Transaction = {
          id: `tx-topup-${crypto.randomUUID()}`,
          title: `Added via ${method}`,
          subtitle: 'Top-up · Arrived instantly',
          amount: amount,
          currency: currency,
          date: 'Today',
          timestamp: timeStr,
          category: 'Top-up',
          brand: 'Revolut',
          isIncoming: true,
          status: 'completed',
          rawDate: Date.now(),
        };

        set({
          accounts: {
            ...state.accounts,
            [currency]: {
              ...account,
              balance: newBalance,
            },
          },
          transactions: [newTx, ...state.transactions],
        });
        get().notify('Money added', `${amount.toFixed(2)} ${currency} added via ${method}.`);
      },

      sendTransfer: (contactId: string, amount: number, currency: Currency, note?: string) => {
        const state = get();
        const account = state.accounts[currency];
        const contact = state.contacts.find((c) => c.id === contactId);

        if (!Number.isFinite(amount) || amount <= 0) return {success:false,error:'Enter a valid amount'};
        amount = Math.round(amount * 100) / 100;
        if(amount<=0)return {success:false,error:'Minimum amount is 0.01'};
        if (!contact) return {success:false,error:'Contact not found'};

        if (!account) {
          return { success: false, error: 'Account not found' };
        }
        if (account.balance < amount) {
          return { success: false, error: 'Insufficient funds in this currency' };
        }

        const newBalance = Math.round((account.balance - amount) * 100) / 100;
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const newTransfer = {
          id: `ct-${crypto.randomUUID()}`,
          amount: amount,
          currency: currency,
          dateLabel: 'Today',
          timeLabel: timeStr,
          status: 'completed' as const,
          isSender: true,
        };

        const updatedContacts = state.contacts.map((c) => {
          if (c.id === contactId) {
            return {
              ...c,
              transfers: [...c.transfers, newTransfer],
            };
          }
          return c;
        });

        const newTx: Transaction = {
          id: `tx-transfer-${crypto.randomUUID()}`,
          title: contact ? contact.name : 'Transfer',
          subtitle: 'Sent from Revolut',
          amount: -amount,
          currency: currency,
          date: 'Today',
          timestamp: timeStr,
          category: 'Transfers',
          brand: 'Contact',
          isIncoming: false,
          status: 'completed',
          contactId: contact?.id,
          contactName: contact?.name,
          note: note,
          rawDate: Date.now(),
        };

        set({
          accounts: {
            ...state.accounts,
            [currency]: {
              ...account,
              balance: newBalance,
            },
          },
          contacts: updatedContacts,
          transactions: [newTx, ...state.transactions],
        });

        get().notify('Transfer completed', `${amount.toFixed(2)} ${currency} sent to ${contact.name}.`);
        return { success: true };
      },

      exchangeCurrency: (fromCurr: Currency, toCurr: Currency, fromAmount: number, toAmount: number) => {
        const state = get();
        const fromAcc = state.accounts[fromCurr];
        const toAcc = state.accounts[toCurr];

        if(fromCurr===toCurr||!Number.isFinite(fromAmount)||!Number.isFinite(toAmount)||fromAmount<=0||toAmount<=0)return {success:false,error:'Enter valid amounts in different currencies'};

        if (!fromAcc || !toAcc) {
          return { success: false, error: 'Invalid currency account' };
        }
        if (fromAcc.balance < fromAmount) {
          return { success: false, error: 'Insufficient balance for exchange' };
        }

        const newFromBalance = Math.round((fromAcc.balance - fromAmount) * 100) / 100;
        const newToBalance = Math.round((toAcc.balance + toAmount) * 100) / 100;
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const newTx: Transaction = {
          id: `tx-ex-${crypto.randomUUID()}`,
          title: `Exchange to ${toCurr}`,
          subtitle: `Sold ${fromCurr} for ${toCurr}`,
          amount: -fromAmount,
          currency: fromCurr,
          date: 'Today',
          timestamp: timeStr,
          category: 'Exchange',
          brand: 'Revolut',
          isIncoming: false,
          status: 'completed',
          rawDate: Date.now(),
        };

        set({
          accounts: {
            ...state.accounts,
            [fromCurr]: { ...fromAcc, balance: newFromBalance },
            [toCurr]: { ...toAcc, balance: newToBalance },
          },
          transactions: [newTx, ...state.transactions],
        });

        return { success: true };
      },

      toggleFreezeCard: (cardId: string) => {
        const state = get();
        const selectedCard=state.cards.find(card=>card.id===cardId);
        if(!selectedCard)return;
        set({
          cards: state.cards.map((card) => {
            if (card.id === cardId) {
              const newFrozen = !card.isFrozen;
              return {
                ...card,
                isFrozen: newFrozen,
                status: newFrozen ? 'frozen' : 'active',
              };
            }
            return card;
          }),
        });
        get().notify(selectedCard.isFrozen?'Card unfrozen':'Card frozen',`${selectedCard.name} ··${selectedCard.last4}`);
      },

      createNewCard: (type: 'virtual' | 'disposable') => {
        const state = get();
        const rand4 = Math.floor(1000 + Math.random() * 9000).toString();
        const randCvv = Math.floor(100 + Math.random() * 900).toString();

        const newCard: BankCard = {
          id: `card-${crypto.randomUUID()}`,
          type: type,
          name: type === 'disposable' ? 'Disposable Virtual' : 'Virtual Card',
          last4: rand4,
          fullNumber: `0000 0000 0000 ${rand4}`,
          expiry: '10/29',
          cvv: randCvv,
          isFrozen: false,
          scheme: 'visa',
          theme: type === 'disposable' ? 'neon_purple' : 'cyan_glow',
          status: 'active',
        };

        set({
          cards: [newCard, ...state.cards],
        });
        get().notify('Card created',`Your ${type} card is ready.`);
      },

      overrideBalance: (currency: Currency, newBalance: number) => {
        const state = get();
        const account = state.accounts[currency];
        if (!account) return;
        set({
          accounts: {
            ...state.accounts,
            [currency]: {
              ...account,
              balance: Math.round(newBalance * 100) / 100,
            },
          },
        });
      },

      injectCustomTransaction: (txData) => {
        const state = get();
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const currency = txData.currency || state.activeCurrency;

        const newTx: Transaction = {
          id: `tx-custom-${Date.now()}`,
          title: txData.title,
          subtitle: txData.subtitle || (txData.amount > 0 ? 'Received transfer' : 'Card payment'),
          amount: txData.amount,
          currency: currency,
          date: 'Today',
          timestamp: timeStr,
          category: txData.category || (txData.amount > 0 ? 'Top-up' : 'Groceries'),
          brand: txData.brand || 'Revolut',
          isIncoming: txData.amount > 0,
          status: 'completed',
          rawDate: Date.now(),
        };

        // Also adjust balance
        const acc = state.accounts[currency];
        if (acc) {
          const updatedBalance = Math.round((acc.balance + txData.amount) * 100) / 100;
          set({
            accounts: {
              ...state.accounts,
              [currency]: { ...acc, balance: updatedBalance },
            },
            transactions: [newTx, ...state.transactions],
          });
        }
      },

      resetToDefaults: () => {
        set({
          billsBalance: 100.67,
          homeAccount: 'personal',
          accounts: DEFAULT_ACCOUNTS,
          activeCurrency: 'RON',
          transactions: presentationTransactions,
          contacts: presentationContacts,
          cards: presentationCards,
          notifications: [],
          scheduledPayments: [],
          demoHoldings: {},
          revPoints: 1420,
          selectedPlan: 'Standard',
          rates: DEFAULT_RATES,
        });
      },
    }),
    {
      name: 'revolut_simulator_storage_v2',
      version: 3,
      migrate: (persisted) => {
        const old = persisted as Partial<RevolutState>;
        return {...old,homeAccount:'personal',activeCurrency:'RON',accounts:{...DEFAULT_ACCOUNTS,...old.accounts,RON:{...DEFAULT_ACCOUNTS.RON}},transactions:[...(old.transactions || []).filter(tx=>/^tx-(topup|transfer|custom)-|^bills-/.test(tx.id)),...presentationTransactions],contacts:presentationContacts,cards:presentationCards};
      },
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        notifications: state.notifications,
        notificationsEnabled: state.notificationsEnabled,
        scheduledPayments: state.scheduledPayments,
        demoHoldings: state.demoHoldings,
        revPoints: state.revPoints,
        selectedPlan: state.selectedPlan,
        homeAccount: state.homeAccount,
        billsBalance: state.billsBalance,
        accounts: state.accounts,
        activeCurrency: state.activeCurrency,
        transactions: state.transactions,
        contacts: state.contacts,
        cards: state.cards,
        soundEnabled: state.soundEnabled,
        frameMode: state.frameMode,
      }),
    }
  )
);
