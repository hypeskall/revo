export type Currency = 'RON' | 'EUR' | 'USD' | 'GBP';

export interface Account {
  id: string;
  currency: Currency;
  name: string;
  balance: number;
  symbol: string;
  flag: string;
  code: string;
}

export type TransactionCategory =
  | 'Groceries'
  | 'Tech'
  | 'Entertainment'
  | 'Transport'
  | 'Transfers'
  | 'Top-up'
  | 'Exchange'
  | 'Restaurants'
  | 'General';

export type BrandName =
  | 'Lidl'
  | 'Apple'
  | 'Netflix'
  | 'Uber'
  | 'Bolt'
  | 'Starbucks'
  | 'McDonalds'
  | 'Revolut'
  | 'Contact';

export interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number; // negative for outgoing, positive for incoming
  currency: Currency;
  date: string; // "Today", "Yesterday", "27 Sep", etc.
  timestamp: string; // "15:15", "08:18", etc.
  category: TransactionCategory;
  brand: BrandName;
  isIncoming: boolean;
  status: 'completed' | 'pending';
  contactId?: string;
  contactName?: string;
  note?: string;
  rawDate: number; // epoch ms for sorting
}

export interface ContactTransfer {
  id: string;
  amount: number;
  currency: Currency;
  dateLabel: string; // "27 Sep", "Yesterday", "Today"
  timeLabel: string; // "21:40", "08:18", "15:15"
  status: 'completed' | 'arriving';
  isSender: boolean; // true if sent by user, false if received
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  iban: string;
  initials: string;
  avatarColor: string;
  badge?: string;
  transfers: ContactTransfer[];
}

export type CardTheme = 'platinum' | 'mclaren' | 'blood_drip' | 'neon_purple' | 'cyan_glow';

export interface BankCard {
  id: string;
  type: 'physical' | 'virtual' | 'disposable';
  name: string;
  last4: string;
  fullNumber: string;
  expiry: string;
  cvv: string;
  isFrozen: boolean;
  scheme: 'visa' | 'mastercard';
  theme: CardTheme;
  status: 'active' | 'frozen';
}
