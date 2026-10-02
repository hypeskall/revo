export type Currency = "RON" | "EUR" | "USD" | "GBP";

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
  | "Groceries"
  | "Tech"
  | "Entertainment"
  | "Transport"
  | "Transfers"
  | "Top-up"
  | "Exchange"
  | "Restaurants"
  | "General"
  | "Shopping"
  | "Verification";

export type BrandName =
  | "Lidl"
  | "Apple"
  | "Netflix"
  | "Uber"
  | "Bolt"
  | "Starbucks"
  | "McDonalds"
  | "Revolut"
  | "Contact"
  | "Explee"
  | string;

export interface Transaction {
  kind?:
    | "external"
    | "internal"
    | "investment"
    | "adjustment"
    | "asset-transfer";
  linkedId?: string;
  cardId?: string;
  pointsEarned?: number;
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
  status: "completed" | "pending" | "reverted";
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
  status: "completed" | "arriving";
  isSender: boolean; // true if sent by user, false if received
  note?: string;
  rawDate?: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  isSender: boolean;
  dateLabel: string;
  timeLabel: string;
  rawDate: number;
  requestedAmount?: number;
  currency?: Currency;
}

export interface Contact {
  revtag?: string;
  messages?: ChatMessage[];
  unread?: number;
  id: string;
  name: string;
  phone: string;
  iban: string;
  initials: string;
  avatarColor?: string;
  avatarUrl?: string;
  badge?: string;
  transfers: ContactTransfer[];
}

export type CardTheme =
  | "platinum"
  | "mclaren"
  | "blood_drip"
  | "neon_purple"
  | "cyan_glow";

export interface BankCard {
  onlineEnabled?: boolean;
  contactlessEnabled?: boolean;
  id: string;
  type: "physical" | "virtual" | "disposable";
  name: string;
  last4: string;
  fullNumber: string;
  expiry: string;
  cvv: string;
  isFrozen: boolean;
  scheme: "visa" | "mastercard";
  theme: CardTheme;
  status: "active" | "frozen";
}
