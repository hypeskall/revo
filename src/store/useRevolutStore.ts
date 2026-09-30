import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Account,
  BankCard,
  Contact,
  Currency,
  Transaction,
} from '@/types';

interface RevolutState {
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
    balance: 1879.56,
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

const DEFAULT_CONTACTS: Contact[] = [
  {
    id: 'c-rares',
    name: 'Rareș Roman',
    phone: '+40 742 819 032',
    iban: 'RO60 ROIN 4021 L1ZY TN7Q ETE6',
    initials: 'RR',
    avatarColor: '#F59E0B',
    badge: 'S&P',
    transfers: [
      {
        id: 'tr-1',
        amount: 40,
        currency: 'RON',
        dateLabel: '27 Sep',
        timeLabel: '21:40',
        status: 'completed',
        isSender: true,
      },
      {
        id: 'tr-2',
        amount: 94,
        currency: 'RON',
        dateLabel: 'Yesterday',
        timeLabel: '08:18',
        status: 'completed',
        isSender: true,
      },
      {
        id: 'tr-3',
        amount: 1,
        currency: 'RON',
        dateLabel: 'Today',
        timeLabel: '15:15',
        status: 'completed',
        isSender: true,
      },
    ],
  },
  {
    id: 'c-maria',
    name: 'Maria Popa',
    phone: '+40 721 554 990',
    iban: 'RO44 BTRL 9872 1092 8841 0001',
    initials: 'MP',
    avatarColor: '#EC4899',
    transfers: [
      {
        id: 'tr-4',
        amount: 85,
        currency: 'RON',
        dateLabel: '22 Sep',
        timeLabel: '14:20',
        status: 'completed',
        isSender: false,
      },
    ],
  },
  {
    id: 'c-elena',
    name: 'Elena Popescu',
    phone: '+40 733 912 341',
    iban: 'RO12 BPOS 3321 0092 1144 0002',
    initials: 'EP',
    avatarColor: '#8B5CF6',
    transfers: [],
  },
  {
    id: 'c-andrei',
    name: 'Andrei Ionescu',
    phone: '+40 755 882 119',
    iban: 'RO88 INGB 0000 9999 1234 5678',
    initials: 'AI',
    avatarColor: '#10B981',
    transfers: [],
  },
];

const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-explee-reverted',
    title: 'Explee Ltd',
    subtitle: 'Reverted card payment',
    amount: 4.68,
    currency: 'RON',
    date: 'Today',
    timestamp: '17:56',
    category: 'Shopping',
    brand: 'Explee',
    isIncoming: true,
    status: 'reverted',
    rawDate: Date.now() - 3600000 * 0.05,
  },
  {
    id: 'tx-explee-verify',
    title: 'Explee Ltd',
    subtitle: 'Card verification',
    amount: 0,
    currency: 'RON',
    date: 'Today',
    timestamp: '17:55',
    category: 'Verification',
    brand: 'Explee',
    isIncoming: false,
    status: 'completed',
    rawDate: Date.now() - 3600000 * 0.08,
  },
  {
    id: 'tx-1',
    title: 'Rareș Roman',
    subtitle: 'Sent from Revolut',
    amount: -1,
    currency: 'RON',
    date: 'Today',
    timestamp: '15:15',
    category: 'Transfers',
    brand: 'Contact',
    isIncoming: false,
    status: 'completed',
    contactId: 'c-rares',
    contactName: 'Rareș Roman',
    rawDate: Date.now() - 3600000 * 0.2,
  },
  {
    id: 'tx-2',
    title: 'Rareș Roman',
    subtitle: 'Sent from Revolut',
    amount: -94,
    currency: 'RON',
    date: 'Yesterday',
    timestamp: '08:18',
    category: 'Transfers',
    brand: 'Contact',
    isIncoming: false,
    status: 'completed',
    contactId: 'c-rares',
    contactName: 'Rareș Roman',
    rawDate: Date.now() - 3600000 * 24,
  },
  {
    id: 'tx-3',
    title: 'Apple Store',
    subtitle: 'Services & Subscriptions',
    amount: -389,
    currency: 'RON',
    date: 'Yesterday',
    timestamp: '19:30',
    category: 'Tech',
    brand: 'Apple',
    isIncoming: false,
    status: 'completed',
    rawDate: Date.now() - 3600000 * 30,
  },
  {
    id: 'tx-4',
    title: 'Rareș Roman',
    subtitle: 'Sent from Revolut',
    amount: -40,
    currency: 'RON',
    date: '27 Sep',
    timestamp: '21:40',
    category: 'Transfers',
    brand: 'Contact',
    isIncoming: false,
    status: 'completed',
    contactId: 'c-rares',
    contactName: 'Rareș Roman',
    rawDate: Date.now() - 3600000 * 48,
  },
  {
    id: 'tx-5',
    title: 'Lidl România',
    subtitle: 'Groceries & supermarket',
    amount: -142.5,
    currency: 'RON',
    date: '26 Sep',
    timestamp: '17:15',
    category: 'Groceries',
    brand: 'Lidl',
    isIncoming: false,
    status: 'completed',
    rawDate: Date.now() - 3600000 * 72,
  },
  {
    id: 'tx-6',
    title: 'Netflix',
    subtitle: 'Monthly subscription',
    amount: -59.99,
    currency: 'RON',
    date: '25 Sep',
    timestamp: '12:00',
    category: 'Entertainment',
    brand: 'Netflix',
    isIncoming: false,
    status: 'completed',
    rawDate: Date.now() - 3600000 * 96,
  },
  {
    id: 'tx-7',
    title: 'Uber',
    subtitle: 'Rides & transit',
    amount: -24.8,
    currency: 'RON',
    date: '24 Sep',
    timestamp: '22:45',
    category: 'Transport',
    brand: 'Uber',
    isIncoming: false,
    status: 'completed',
    rawDate: Date.now() - 3600000 * 120,
  },
  {
    id: 'tx-8',
    title: 'Salary Deposit',
    subtitle: 'Monthly income transfer',
    amount: 4500,
    currency: 'RON',
    date: '20 Sep',
    timestamp: '09:00',
    category: 'Top-up',
    brand: 'Revolut',
    isIncoming: true,
    status: 'completed',
    rawDate: Date.now() - 3600000 * 210,
  },
];

const DEFAULT_CARDS: BankCard[] = [
  {
    id: 'card-blood',
    type: 'virtual',
    name: 'Virtual Blood Drip',
    last4: '0177',
    fullNumber: '4129 8831 0921 0177',
    expiry: '09/28',
    cvv: '382',
    isFrozen: false,
    scheme: 'visa',
    theme: 'blood_drip',
    status: 'active',
  },
  {
    id: 'card-metal',
    type: 'physical',
    name: 'Revolut Metal',
    last4: '4821',
    fullNumber: '5218 9012 3456 4821',
    expiry: '11/27',
    cvv: '914',
    isFrozen: false,
    scheme: 'mastercard',
    theme: 'platinum',
    status: 'active',
  },
  {
    id: 'card-disposable',
    type: 'disposable',
    name: 'Disposable Virtual',
    last4: '9942',
    fullNumber: '4929 1102 3341 9942',
    expiry: '12/26',
    cvv: '621',
    isFrozen: false,
    scheme: 'visa',
    theme: 'neon_purple',
    status: 'active',
  },
];

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
      homeAccount: 'bills',
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
      transactions: DEFAULT_TRANSACTIONS,
      contacts: DEFAULT_CONTACTS,
      cards: DEFAULT_CARDS,
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
        if (!account) return;

        const newBalance = Math.round((account.balance + amount) * 100) / 100;
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const newTx: Transaction = {
          id: `tx-topup-${Date.now()}`,
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
      },

      sendTransfer: (contactId: string, amount: number, currency: Currency, note?: string) => {
        const state = get();
        const account = state.accounts[currency];
        const contact = state.contacts.find((c) => c.id === contactId);

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
          id: `ct-${Date.now()}`,
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
          id: `tx-transfer-${Date.now()}`,
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

        return { success: true };
      },

      exchangeCurrency: (fromCurr: Currency, toCurr: Currency, fromAmount: number, toAmount: number) => {
        const state = get();
        const fromAcc = state.accounts[fromCurr];
        const toAcc = state.accounts[toCurr];

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
          id: `tx-ex-${Date.now()}`,
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
      },

      createNewCard: (type: 'virtual' | 'disposable') => {
        const state = get();
        const rand4 = Math.floor(1000 + Math.random() * 9000).toString();
        const randMid1 = Math.floor(1000 + Math.random() * 9000).toString();
        const randMid2 = Math.floor(1000 + Math.random() * 9000).toString();
        const randCvv = Math.floor(100 + Math.random() * 900).toString();

        const newCard: BankCard = {
          id: `card-${Date.now()}`,
          type: type,
          name: type === 'disposable' ? 'Disposable Virtual' : 'Virtual Card',
          last4: rand4,
          fullNumber: `4532 ${randMid1} ${randMid2} ${rand4}`,
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
          homeAccount: 'bills',
          accounts: DEFAULT_ACCOUNTS,
          activeCurrency: 'RON',
          transactions: DEFAULT_TRANSACTIONS,
          contacts: DEFAULT_CONTACTS,
          cards: DEFAULT_CARDS,
          rates: DEFAULT_RATES,
        });
      },
    }),
    {
      name: 'revolut_simulator_storage_v2',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
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
