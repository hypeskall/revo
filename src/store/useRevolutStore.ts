import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  presentationContacts,
  presentationTransactions,
  presentationCards,
} from "@/data/presentation";
import { demoAssets } from "@/data/assets";
import { exchangeRate, roundMoney } from "@/utils/finance";
import { Account, BankCard, Contact, Currency, Transaction } from "@/types";

interface RevolutState {
  topUpCardId: string;
  setTopUpCard: (id: string) => void;
  profileName: string;
  setProfileName: (name: string) => void;
  cryptoActivity: {
    id: string;
    asset: string;
    units: number;
    value: number;
    title: string;
    timestamp: number;
  }[];
  transferCrypto: (
    asset: string,
    amount: number,
    contactId: string,
  ) => string | null;
  screenOverlayOpen: boolean;
  setScreenOverlayOpen: (open: boolean) => void;
  tradeTicket: { asset: string; sell: boolean };
  openTrade: (asset: string, sell?: boolean) => void;
  swapHoldings: (from: string, to: string, amount: number) => string | null;
  setCardSetting: (
    id: string,
    setting: "onlineEnabled" | "contactlessEnabled",
    enabled: boolean,
  ) => void;
  uiPanel:
    | "profile"
    | "notifications"
    | "activity"
    | "scheduled"
    | "new-contact"
    | "help"
    | "invest"
    | "crypto"
    | "rewards"
    | "plan"
    | "joint"
    | "accounts"
    | "linked"
    | "stays"
    | null;
  jointBalance: number;
  moveJointMoney: (amount: number, withdraw: boolean) => string | null;
  setUiPanel: (panel: RevolutState["uiPanel"]) => void;
  activityCardId: string | null;
  setActivityCardId: (id: string | null) => void;
  walletOpen: boolean;
  walletCardId: string | null;
  openWalletCard: (id: string) => void;
  setWalletOpen: (open: boolean) => void;
  notifications: {
    id: string;
    title: string;
    message: string;
    read: boolean;
    timestamp: number;
  }[];
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  notify: (title: string, message: string) => void;
  markNotificationsRead: () => void;
  markContactRead: (id: string) => void;
  addContact: (name: string) => Contact;
  sendChatMessage: (
    contactId: string,
    text: string,
    requestedAmount?: number,
    currency?: Currency,
  ) => void;
  scheduledPayments: {
    id: string;
    contactId: string;
    amount: number;
    date: string;
    status: "scheduled" | "completed" | "failed";
  }[];
  schedulePayment: (
    contactId: string,
    amount: number,
    date: string,
  ) => string | null;
  cancelScheduledPayment: (id: string) => void;
  processScheduledPayments: () => void;
  demoHoldings: Record<string, number>;
  tradeDemo: (asset: string, amount: number, sell: boolean) => string | null;
  revPoints: number;
  redeemPoints: (points: number) => string | null;
  selectedPlan: string;
  selectPlan: (plan: string) => void;
  homeAccount: "bills" | "personal";
  setHomeAccount: (account: "bills" | "personal") => void;
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
  frameMode: "iphone" | "fullscreen";

  // Modals & UI States
  isAccountsDrawerOpen: boolean;
  isAddMoneyOpen: boolean;
  isTransferOpen: boolean;
  selectedContactForTransfer: Contact | null;
  isExchangeOpen: boolean;
  isGodModeOpen: boolean;
  selectedTransactionDetail: Transaction | null;
  homeTool: "search" | "analytics" | "details" | "more" | null;

  // Actions
  setActiveCurrency: (currency: Currency) => void;
  setAccountsDrawerOpen: (open: boolean) => void;
  setAddMoneyOpen: (open: boolean) => void;
  setTransferOpen: (open: boolean) => void;
  setSelectedContactForTransfer: (contact: Contact | null) => void;
  setExchangeOpen: (open: boolean) => void;
  setGodModeOpen: (open: boolean) => void;
  setSelectedTransactionDetail: (tx: Transaction | null) => void;
  setHomeTool: (
    tool: "search" | "analytics" | "details" | "more" | null,
  ) => void;
  setFrameMode: (mode: "iphone" | "fullscreen") => void;
  setSoundEnabled: (enabled: boolean) => void;

  // Financial Operations
  addMoney: (
    amount: number,
    currency: Currency,
    method?: string,
    cardId?: string,
  ) => string | null;
  sendTransfer: (
    contactId: string,
    amount: number,
    currency: Currency,
    note?: string,
  ) => { success: boolean; error?: string };
  exchangeCurrency: (
    fromCurr: Currency,
    toCurr: Currency,
    fromAmount: number,
    toAmount: number,
  ) => { success: boolean; error?: string };

  // Card Actions
  toggleFreezeCard: (cardId: string) => void;
  createNewCard: (type: "virtual" | "disposable") => void;

  // God Mode Operations
  overrideBalance: (currency: Currency, newBalance: number) => void;
  injectCustomTransaction: (
    tx: Partial<Transaction> & { amount: number; title: string },
  ) => void;
  resetToDefaults: () => void;
}

const DEFAULT_ACCOUNTS: Record<Currency, Account> = {
  RON: {
    id: "acc-ron",
    currency: "RON",
    name: "Romanian Leu",
    balance: 1796.46,
    symbol: "lei",
    flag: "🇷🇴",
    code: "RON",
  },
  EUR: {
    id: "acc-eur",
    currency: "EUR",
    name: "Euro",
    balance: 0.0,
    symbol: "€",
    flag: "🇪🇺",
    code: "EUR",
  },
  USD: {
    id: "acc-usd",
    currency: "USD",
    name: "US Dollar",
    balance: 120.5,
    symbol: "$",
    flag: "🇺🇸",
    code: "USD",
  },
  GBP: {
    id: "acc-gbp",
    currency: "GBP",
    name: "British Pound",
    balance: 50.0,
    symbol: "£",
    flag: "🇬🇧",
    code: "GBP",
  },
};

const DEFAULT_RATES: Record<string, number> = {
  EUR_RON: 4.9765,
  RON_EUR: 1 / 4.9765,
  USD_RON: 4.582,
  RON_USD: 1 / 4.582,
  GBP_RON: 5.891,
  RON_GBP: 1 / 5.891,
  EUR_USD: 1.086,
  USD_EUR: 1 / 1.086,
  GBP_EUR: 1.184,
  EUR_GBP: 1 / 1.184,
  GBP_USD: 1.286,
  USD_GBP: 1 / 1.286,
};

export const useRevolutStore = create<RevolutState>()(
  persist(
    (set, get) => ({
      topUpCardId: "card-blood",
      setTopUpCard: (id) => {
        if (get().cards.some((c) => c.id === id)) set({ topUpCardId: id });
      },
      screenOverlayOpen: false,
      setScreenOverlayOpen: (screenOverlayOpen) => set({ screenOverlayOpen }),
      jointBalance: 1.28,
      moveJointMoney: (amount, withdraw) => {
        const state = get();
        const value = Math.round(amount * 100) / 100;
        if (!Number.isFinite(amount) || value < 0.01)
          return "Enter at least 0.01 RON.";
        if (
          value > (withdraw ? state.jointBalance : state.accounts.RON.balance)
        )
          return "Insufficient balance.";
        const now = new Date();
        set({
          jointBalance:
            Math.round(
              (state.jointBalance + (withdraw ? -value : value)) * 100,
            ) / 100,
          transactions: [
            {
              id: `joint-${crypto.randomUUID()}`,
              title: withdraw
                ? "Withdrawn from joint account"
                : "Added to joint account",
              subtitle: "Internal transfer",
              kind: "internal",
              amount: withdraw ? value : -value,
              currency: "RON",
              date: "Today",
              timestamp: now.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              category: "Transfers",
              brand: "Revolut",
              isIncoming: withdraw,
              status: "completed",
              rawDate: now.getTime(),
            },
            ...state.transactions,
          ],
          accounts: {
            ...state.accounts,
            RON: {
              ...state.accounts.RON,
              balance:
                Math.round(
                  (state.accounts.RON.balance + (withdraw ? value : -value)) *
                    100,
                ) / 100,
            },
          },
        });
        get().notify(
          "Money moved",
          `${value.toFixed(2)} RON ${withdraw ? "withdrawn from" : "added to"} your joint account.`,
        );
        return null;
      },
      tradeTicket: { asset: "AAPL", sell: false },
      openTrade: (asset, sell = false) => {
        const selected = demoAssets.find((item) => item.symbol === asset);
        if (!selected) return;
        set({ tradeTicket: { asset, sell }, uiPanel: selected.kind });
      },
      swapHoldings: (from, to, amount) => {
        if (
          from === to ||
          !demoAssets.some(
            (item) => item.kind === "crypto" && item.symbol === from,
          ) ||
          !demoAssets.some(
            (item) => item.kind === "crypto" && item.symbol === to,
          )
        )
          return "Choose two different crypto assets.";
        if (!Number.isFinite(amount) || amount < 0.01)
          return "Enter at least 0.01 RON.";
        const value = Math.round(amount * 100) / 100;
        const holdings = get().demoHoldings;
        if (value > (holdings[from] || 0)) return "Not enough in this holding.";
        const eventId = crypto.randomUUID();
        const now = Date.now();
        set({
          cryptoActivity: [
            {
              id: eventId + "-out",
              asset: from,
              units: -value / demoAssets.find((a) => a.symbol === from)!.price,
              value: -value,
              title: from + " → " + to,
              timestamp: now,
            },
            {
              id: eventId + "-in",
              asset: to,
              units: value / demoAssets.find((a) => a.symbol === to)!.price,
              value,
              title: from + " → " + to,
              timestamp: now,
            },
            ...get().cryptoActivity,
          ],
          demoHoldings: {
            ...holdings,
            [from]: Math.round(((holdings[from] || 0) - value) * 100) / 100,
            [to]: Math.round(((holdings[to] || 0) + value) * 100) / 100,
          },
        });
        get().notify(
          "Swap completed",
          `${value.toFixed(2)} RON swapped from ${from} to ${to}.`,
        );
        return null;
      },
      setCardSetting: (id, setting, enabled) =>
        set((state) => ({
          cards: state.cards.map((card) =>
            card.id === id ? { ...card, [setting]: enabled } : card,
          ),
        })),
      uiPanel: null,
      scheduledPayments: [],
      schedulePayment: (contactId, amount, date) => {
        if (
          !get().contacts.some((contact) => contact.id === contactId) ||
          !Number.isFinite(amount) ||
          amount <= 0 ||
          !Number.isFinite(Date.parse(date)) ||
          Date.parse(date) <= Date.now()
        )
          return "Choose a recipient, a positive amount and a future date.";
        set((state) => ({
          scheduledPayments: [
            ...state.scheduledPayments,
            {
              id: crypto.randomUUID(),
              contactId,
              amount: Math.round(amount * 100) / 100,
              date,
              status: "scheduled",
            },
          ],
        }));
        get().notify(
          "Payment scheduled",
          `${amount.toFixed(2)} RON scheduled.`,
        );
        return null;
      },
      cancelScheduledPayment: (id) =>
        set((state) => ({
          scheduledPayments: state.scheduledPayments.filter(
            (item) => item.id !== id,
          ),
        })),
      processScheduledPayments: () => {
        for (const payment of get().scheduledPayments.filter(
          (item) =>
            item.status === "scheduled" && Date.parse(item.date) <= Date.now(),
        )) {
          const result = get().sendTransfer(
            payment.contactId,
            payment.amount,
            "RON",
            "Scheduled payment",
          );
          set((state) => ({
            scheduledPayments: state.scheduledPayments.map((item) =>
              item.id === payment.id
                ? { ...item, status: result.success ? "completed" : "failed" }
                : item,
            ),
          }));
          if (!result.success)
            get().notify(
              "Scheduled payment failed",
              result.error || "Transfer failed",
            );
        }
      },
      demoHoldings: {},
      profileName: "Mihai",
      setProfileName: (name) => {
        const value = name.trim().slice(0, 80);
        if (value) set({ profileName: value });
      },
      cryptoActivity: [],
      transferCrypto: (asset, amount, contactId) => {
        const state = get();
        const selected = demoAssets.find(
          (a) => a.symbol === asset && a.kind === "crypto",
        );
        const contact = state.contacts.find((c) => c.id === contactId);
        if (!selected || !contact) return "Choose a token and recipient.";
        if (!Number.isFinite(amount) || amount < 0.01)
          return "Enter at least 0.01 RON.";
        const value = Math.round(amount * 100) / 100;
        if (value > (state.demoHoldings[asset] || 0))
          return "Not enough in this holding.";
        const eventId = crypto.randomUUID();
        const eventDate = Date.now();
        set({
          transactions: [
            {
              id: "tx-crypto-send-" + eventId,
              linkedId: eventId,
              title: asset + " to " + contact.name,
              subtitle: "Crypto transfer",
              amount: -value,
              currency: "RON",
              category: "Transfers",
              kind: "asset-transfer",
              brand: "Contact",
              contactId: contact.id,
              contactName: contact.name,
              isIncoming: false,
              status: "completed",
              date: "Today",
              timestamp: new Date(eventDate).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              rawDate: eventDate,
            },
            ...state.transactions,
          ],
          demoHoldings: {
            ...state.demoHoldings,
            [asset]:
              Math.round(((state.demoHoldings[asset] || 0) - value) * 100) /
              100,
          },
          cryptoActivity: [
            {
              id: eventId,
              asset,
              units: -value / selected.price,
              value: -value,
              title: `To ${contact.name}`,
              timestamp: eventDate,
            },
            ...state.cryptoActivity,
          ],
        });
        get().notify(
          "Crypto transfer sent",
          `You sent ${(value / selected.price).toFixed(8)} ${asset} to ${contact.name}. Simulated transfer completed.`,
        );
        return null;
      },
      tradeDemo: (asset, amount, sell) => {
        if (!demoAssets.some((item) => item.symbol === asset))
          return "Select an available asset.";
        if (!Number.isFinite(amount) || amount < 0.01)
          return "Enter at least 0.01 RON.";
        const value = Math.round(amount * 100) / 100;
        const state = get();
        const eventId = crypto.randomUUID();
        const eventDate = Date.now();
        const available = sell
          ? state.demoHoldings[asset] || 0
          : state.accounts.RON.balance;
        if (value > available)
          return sell
            ? "Not enough in this holding."
            : "Insufficient RON balance.";
        set({
          transactions: [
            {
              id: "tx-trade-" + eventId,
              linkedId: eventId,
              title: (sell ? "Sold " : "Bought ") + asset,
              subtitle: "Personal account · " + asset,
              amount: sell ? value : -value,
              currency: "RON",
              date: "Today",
              timestamp: new Date(eventDate).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              category: "Exchange",
              kind: "investment",
              brand: "Revolut",
              isIncoming: sell,
              status: "completed",
              rawDate: eventDate,
            },
            ...state.transactions,
          ],
          accounts: {
            ...state.accounts,
            RON: {
              ...state.accounts.RON,
              balance:
                Math.round(
                  (state.accounts.RON.balance + (sell ? value : -value)) * 100,
                ) / 100,
            },
          },
          demoHoldings: {
            ...state.demoHoldings,
            [asset]:
              Math.round(
                ((state.demoHoldings[asset] || 0) + (sell ? -value : value)) *
                  100,
              ) / 100,
          },
          cryptoActivity:
            demoAssets.find((a) => a.symbol === asset)?.kind === "crypto"
              ? [
                  {
                    id: eventId,
                    asset,
                    units:
                      (value /
                        demoAssets.find((a) => a.symbol === asset)!.price) *
                      (sell ? -1 : 1),
                    value: value * (sell ? -1 : 1),
                    title: sell ? `${asset} → RON` : `RON → ${asset}`,
                    timestamp: eventDate,
                  },
                  ...state.cryptoActivity,
                ]
              : state.cryptoActivity,
        });
        get().notify(
          "Demo order completed",
          `${sell ? "Sold" : "Bought"} ${value.toFixed(2)} RON of ${asset}.`,
        );
        return null;
      },
      revPoints: 1420,
      redeemPoints: (points) => {
        if (
          !Number.isInteger(points) ||
          points <= 0 ||
          points > get().revPoints
        )
          return "Not enough points.";
        set((state) => ({ revPoints: state.revPoints - points }));
        get().notify(
          "Reward redeemed",
          `${points} points redeemed for a demo reward.`,
        );
        return null;
      },
      selectedPlan: "Standard",
      selectPlan: (selectedPlan) => {
        set({ selectedPlan });
        get().notify(
          "Plan changed",
          `${selectedPlan} selected for this prototype.`,
        );
      },
      setUiPanel: (uiPanel) => set({ uiPanel, activityCardId: null }),
      activityCardId: null,
      setActivityCardId: (activityCardId) => set({ activityCardId }),
      walletOpen: false,
      walletCardId: null,
      openWalletCard: (id) => {
        if (get().cards.some((card) => card.id === id))
          set({ walletOpen: true, walletCardId: id });
      },
      setWalletOpen: (walletOpen) =>
        set({ walletOpen, ...(walletOpen ? {} : { walletCardId: null }) }),
      notifications: [
        {
          id: "welcome",
          title: "Welcome",
          message: "Your presentation is ready. All payments are simulated.",
          read: true,
          timestamp: Date.now(),
        },
      ],
      notificationsEnabled: true,
      setNotificationsEnabled: (notificationsEnabled) =>
        set({ notificationsEnabled }),
      notify: (title, message) =>
        set((state) => ({
          notifications: [
            {
              id: crypto.randomUUID(),
              title,
              message,
              read: false,
              timestamp: Date.now(),
            },
            ...state.notifications,
          ],
        })),
      markNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((item) => ({
            ...item,
            read: true,
          })),
        })),
      markContactRead: (id) =>
        set((state) => ({
          contacts: state.contacts.map((contact) =>
            contact.id === id ? { ...contact, unread: 0 } : contact,
          ),
        })),
      addContact: (name) => {
        const contact: Contact = {
          id: crypto.randomUUID(),
          name: name.trim(),
          initials: name
            .trim()
            .split(/\s+/)
            .map((part) => part[0])
            .slice(0, 2)
            .join("")
            .toUpperCase(),
          phone: "",
          iban: "Demo contact account",
          avatarColor: "#8053ff",
          transfers: [],
        };
        set((state) => ({ contacts: [contact, ...state.contacts] }));
        return contact;
      },
      sendChatMessage: (contactId, text, requestedAmount, currency = "RON") => {
        if (
          !text.trim() ||
          !get().contacts.some((contact) => contact.id === contactId)
        )
          return;
        if (
          requestedAmount !== undefined &&
          (!Number.isFinite(requestedAmount) || requestedAmount < 0.01)
        )
          return;
        const now = new Date();
        const message = {
          id: crypto.randomUUID(),
          text: text.trim().slice(0, 2000),
          isSender: true,
          dateLabel: "Today",
          timeLabel: now.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          rawDate: now.getTime(),
          requestedAmount,
          currency,
        };
        set((state) => ({
          contacts: state.contacts.map((contact) =>
            contact.id === contactId
              ? { ...contact, messages: [...(contact.messages || []), message] }
              : contact,
          ),
        }));
        if (requestedAmount)
          get().notify(
            "Request sent",
            `${requestedAmount.toFixed(2)} ${currency} requested. No money moved.`,
          );
      },
      homeAccount: "personal",
      setHomeAccount: (homeAccount) => set({ homeAccount }),
      billsBalance: 100.67,
      moveBillsMoney: (amount, withdraw) => {
        const state = get();
        if (!Number.isFinite(amount) || amount <= 0)
          return "Enter a valid amount.";
        const value = Math.round(amount * 100) / 100;
        if (value <= 0) return "Minimum amount is €0.01.";
        if (
          value > (withdraw ? state.billsBalance : state.accounts.EUR.balance)
        )
          return "Not enough money in this account.";
        const now = new Date();
        set({
          billsBalance:
            Math.round(
              (state.billsBalance + (withdraw ? -value : value)) * 100,
            ) / 100,
          accounts: {
            ...state.accounts,
            EUR: {
              ...state.accounts.EUR,
              balance:
                Math.round(
                  (state.accounts.EUR.balance + (withdraw ? value : -value)) *
                    100,
                ) / 100,
            },
          },
          transactions: [
            {
              id: `bills-${crypto.randomUUID()}`,
              title: withdraw ? "Withdrawn from Bills" : "Added to Bills",
              subtitle: "Pocket transfer · Sandbox",
              kind: "internal",
              amount: withdraw ? -value : value,
              currency: "EUR",
              date: "Today",
              timestamp: now.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              category: "Transfers",
              brand: "Revolut",
              isIncoming: !withdraw,
              status: "completed",
              rawDate: now.getTime(),
            },
            ...state.transactions,
          ],
        });
        get().notify(
          "Money moved",
          `${value.toFixed(2)} EUR ${withdraw ? "withdrawn from" : "added to"} Bills.`,
        );
        return null;
      },
      accounts: DEFAULT_ACCOUNTS,
      activeCurrency: "RON",
      transactions: presentationTransactions,
      contacts: presentationContacts,
      cards: presentationCards,
      rates: DEFAULT_RATES,
      soundEnabled: true,
      frameMode: "iphone",

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

      setAccountsDrawerOpen: (open: boolean) =>
        set({ isAccountsDrawerOpen: open }),
      setAddMoneyOpen: (open: boolean) => set({ isAddMoneyOpen: open }),
      setTransferOpen: (open: boolean) => set({ isTransferOpen: open }),
      setSelectedContactForTransfer: (contact: Contact | null) =>
        set({ selectedContactForTransfer: contact }),
      setExchangeOpen: (open: boolean) => set({ isExchangeOpen: open }),
      setGodModeOpen: (open: boolean) => set({ isGodModeOpen: open }),
      setSelectedTransactionDetail: (tx: Transaction | null) =>
        set({ selectedTransactionDetail: tx }),
      setHomeTool: (homeTool) => set({ homeTool }),
      setFrameMode: (mode: "iphone" | "fullscreen") => set({ frameMode: mode }),
      setSoundEnabled: (enabled: boolean) => set({ soundEnabled: enabled }),

      addMoney: (
        amount: number,
        currency: Currency,
        method = "Apple Pay",
        cardId?: string,
      ) => {
        const state = get();
        const account = state.accounts[currency];
        if (!account || !Number.isFinite(amount) || amount <= 0)
          return "Enter a valid amount.";
        const card = cardId
          ? state.cards.find((c) => c.id === cardId)
          : undefined;
        if (cardId && (!card || card.isFrozen || card.onlineEnabled === false))
          return "Choose an active card with online payments enabled.";
        amount = Math.round(amount * 100) / 100;
        if (amount <= 0) return "Minimum amount is 0.01.";

        const newBalance = Math.round((account.balance + amount) * 100) / 100;
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

        const newTx: Transaction = {
          id: `tx-topup-${crypto.randomUUID()}`,
          title: `Added via ${method}`,
          subtitle: card
            ? `Top-up · ${card.name} ··${card.last4}`
            : "Top-up · Arrived instantly",
          cardId: card?.id,
          amount: amount,
          currency: currency,
          date: "Today",
          timestamp: timeStr,
          category: "Top-up",
          brand: "Revolut",
          isIncoming: true,
          status: "completed",
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
        get().notify(
          "Money added",
          `${amount.toFixed(2)} ${currency} added via ${method}.`,
        );
        return null;
      },

      sendTransfer: (
        contactId: string,
        amount: number,
        currency: Currency,
        note?: string,
      ) => {
        const state = get();
        const account = state.accounts[currency];
        const contact = state.contacts.find((c) => c.id === contactId);

        if (!Number.isFinite(amount) || amount <= 0)
          return { success: false, error: "Enter a valid amount" };
        amount = Math.round(amount * 100) / 100;
        if (amount <= 0)
          return { success: false, error: "Minimum amount is 0.01" };
        if (!contact) return { success: false, error: "Contact not found" };

        if (!account) {
          return { success: false, error: "Account not found" };
        }
        if (account.balance < amount) {
          return {
            success: false,
            error: "Insufficient funds in this currency",
          };
        }

        const newBalance = Math.round((account.balance - amount) * 100) / 100;
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

        const newTransfer = {
          id: `ct-${crypto.randomUUID()}`,
          amount: amount,
          currency: currency,
          dateLabel: "Today",
          timeLabel: timeStr,
          status: "completed" as const,
          isSender: true,
          note,
          rawDate: now.getTime(),
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
          title: contact ? contact.name : "Transfer",
          subtitle: "Sent from Revolut",
          amount: -amount,
          currency: currency,
          date: "Today",
          timestamp: timeStr,
          category: "Transfers",
          brand: "Contact",
          isIncoming: false,
          status: "completed",
          linkedId: newTransfer.id,
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

        get().notify(
          "Transfer sent ✅",
          `You sent ${amount} ${currency} to ${contact.name}. It will arrive in seconds.`,
        );
        return { success: true };
      },

      exchangeCurrency: (
        fromCurr: Currency,
        toCurr: Currency,
        fromAmount: number,
        toAmount: number,
      ) => {
        const state = get();
        const fromAcc = state.accounts[fromCurr];
        const toAcc = state.accounts[toCurr];

        if (
          fromCurr === toCurr ||
          !Number.isFinite(fromAmount) ||
          !Number.isFinite(toAmount) ||
          fromAmount <= 0 ||
          toAmount <= 0
        )
          return {
            success: false,
            error: "Enter valid amounts in different currencies",
          };

        if (!fromAcc || !toAcc) {
          return { success: false, error: "Invalid currency account" };
        }
        fromAmount = roundMoney(fromAmount);
        toAmount = roundMoney(
          fromAmount * exchangeRate(state.rates, fromCurr, toCurr),
        );
        if (!Number.isFinite(toAmount) || fromAmount < 0.01 || toAmount < 0.01)
          return {
            success: false,
            error: "Minimum amount is 0.01 in each currency",
          };
        if (fromAcc.balance < fromAmount) {
          return { success: false, error: "Insufficient balance for exchange" };
        }

        const newFromBalance =
          Math.round((fromAcc.balance - fromAmount) * 100) / 100;
        const newToBalance = Math.round((toAcc.balance + toAmount) * 100) / 100;
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

        const newTx: Transaction = {
          id: `tx-ex-${crypto.randomUUID()}`,
          title: `Exchange to ${toCurr}`,
          subtitle: `Sold ${fromCurr} for ${toCurr}`,
          amount: -fromAmount,
          currency: fromCurr,
          date: "Today",
          timestamp: timeStr,
          category: "Exchange",
          brand: "Revolut",
          isIncoming: false,
          status: "completed",
          rawDate: Date.now(),
        };

        set({
          accounts: {
            ...state.accounts,
            [fromCurr]: { ...fromAcc, balance: newFromBalance },
            [toCurr]: { ...toAcc, balance: newToBalance },
          },
          transactions: [
            newTx,
            {
              ...newTx,
              id: newTx.id + "-received",
              linkedId: newTx.id,
              title: `Exchange from ${fromCurr}`,
              amount: toAmount,
              currency: toCurr,
              isIncoming: true,
            },
            ...state.transactions,
          ],
        });

        get().notify(
          "Exchange completed",
          `${fromAmount.toFixed(2)} ${fromCurr} exchanged for ${toAmount.toFixed(2)} ${toCurr}.`,
        );

        return { success: true };
      },

      toggleFreezeCard: (cardId: string) => {
        const state = get();
        const selectedCard = state.cards.find((card) => card.id === cardId);
        if (!selectedCard) return;
        set({
          cards: state.cards.map((card) => {
            if (card.id === cardId) {
              const newFrozen = !card.isFrozen;
              return {
                ...card,
                isFrozen: newFrozen,
                status: newFrozen ? "frozen" : "active",
              };
            }
            return card;
          }),
        });
        get().notify(
          selectedCard.isFrozen ? "Card unfrozen" : "Card frozen",
          `${selectedCard.name} ··${selectedCard.last4}`,
        );
      },

      createNewCard: (type: "virtual" | "disposable") => {
        const state = get();
        const rand4 = Math.floor(1000 + Math.random() * 9000).toString();
        const randCvv = Math.floor(100 + Math.random() * 900).toString();

        const newCard: BankCard = {
          id: `card-${crypto.randomUUID()}`,
          type: type,
          name: type === "disposable" ? "Disposable Virtual" : "Virtual Card",
          last4: rand4,
          fullNumber: `0000 0000 0000 ${rand4}`,
          expiry: "10/29",
          cvv: randCvv,
          isFrozen: false,
          scheme: "visa",
          theme: type === "disposable" ? "neon_purple" : "cyan_glow",
          status: "active",
        };

        set({
          cards: [newCard, ...state.cards],
        });
        get().notify("Card created", `Your ${type} card is ready.`);
      },

      overrideBalance: (currency: Currency, newBalance: number) => {
        const state = get();
        const account = state.accounts[currency];
        if (!account || !Number.isFinite(newBalance) || newBalance < 0) return;
        const delta = roundMoney(newBalance - account.balance);
        if (!delta) return;
        set({
          transactions: [
            {
              id: "tx-adjustment-" + crypto.randomUUID(),
              title: "Balance adjustment",
              subtitle: "Presentation balance adjustment",
              amount: delta,
              currency,
              date: "Today",
              timestamp: new Date().toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              category: "General",
              kind: "adjustment",
              brand: "Revolut",
              isIncoming: delta > 0,
              status: "completed",
              rawDate: Date.now(),
            },
            ...state.transactions,
          ],
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
        const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        const currency = txData.currency || state.activeCurrency;
        const value = roundMoney(txData.amount);
        if (
          !Number.isFinite(value) ||
          Math.abs(value) < 0.01 ||
          !txData.title.trim() ||
          state.accounts[currency].balance + value < 0
        )
          return;

        const newTx: Transaction = {
          id: `tx-custom-${crypto.randomUUID()}`,
          title: txData.title,
          subtitle:
            txData.subtitle ||
            (txData.amount > 0 ? "Received transfer" : "Card payment"),
          amount: value,
          currency: currency,
          date: "Today",
          timestamp: timeStr,
          category:
            txData.category || (txData.amount > 0 ? "Top-up" : "Groceries"),
          brand: txData.brand || "Revolut",
          isIncoming: txData.amount > 0,
          status: "completed",
          rawDate: Date.now(),
        };
        const eligible =
          value < 0 &&
          !["Transfers", "Exchange", "Verification", "Top-up"].includes(
            newTx.category,
          );
        const paymentCard = eligible
          ? state.cards.find(
              (card) =>
                !card.isFrozen &&
                card.onlineEnabled !== false &&
                card.type !== "disposable",
            )
          : undefined;
        const pointsEarned = paymentCard
          ? Math.floor(
              ((Math.abs(value) * exchangeRate(state.rates, currency, "RON")) /
                50) *
                100,
            ) / 100
          : 0;
        if (paymentCard) {
          newTx.cardId = paymentCard.id;
          newTx.pointsEarned = pointsEarned;
        }

        // Also adjust balance
        const acc = state.accounts[currency];
        if (acc) {
          const updatedBalance = Math.round((acc.balance + value) * 100) / 100;
          set({
            accounts: {
              ...state.accounts,
              [currency]: { ...acc, balance: updatedBalance },
            },
            transactions: [newTx, ...state.transactions],
            revPoints: roundMoney(state.revPoints + pointsEarned),
          });
        }
      },

      resetToDefaults: () => {
        set({
          billsBalance: 100.67,
          jointBalance: 1.28,
          homeAccount: "personal",
          accounts: DEFAULT_ACCOUNTS,
          activeCurrency: "RON",
          transactions: presentationTransactions,
          contacts: presentationContacts,
          cards: presentationCards,
          notifications: [],
          scheduledPayments: [],
          demoHoldings: {},
          cryptoActivity: [],
          revPoints: 1420,
          selectedPlan: "Standard",
          profileName: "Mihai",
          topUpCardId: "card-blood",
          rates: DEFAULT_RATES,
        });
      },
    }),
    {
      name: "revolut_simulator_storage_v2",
      version: 7,
      migrate: (persisted, version) => {
        const old = persisted as Partial<RevolutState>;
        if (version < 7) {
          old.transactions = (old.transactions || presentationTransactions).map(
            (tx) => {
              const reference = presentationTransactions.find(
                (item) => item.id === tx.id,
              );
              return !tx.cardId && reference?.cardId
                ? { ...tx, cardId: reference.cardId }
                : tx;
            },
          );
        }
        // Recover cash legs of saved crypto purchases without changing balances.
        // Older builds only wrote these operations to cryptoActivity.
        if (version < 6) {
          const ledger = [...(old.transactions || presentationTransactions)];
          for (const activity of old.cryptoActivity || []) {
            const buy = activity.title === "RON → " + activity.asset;
            const sell = activity.title === activity.asset + " → RON";
            if (
              (!buy && !sell) ||
              ledger.some((t) => t.linkedId === activity.id)
            )
              continue;
            ledger.push({
              id: "tx-trade-" + activity.id,
              linkedId: activity.id,
              title: (sell ? "Sold " : "Bought ") + activity.asset,
              subtitle: "Personal account · " + activity.asset,
              amount: -activity.value,
              currency: "RON",
              date: "Today",
              timestamp: new Date(activity.timestamp).toLocaleTimeString(
                "en-GB",
                { hour: "2-digit", minute: "2-digit" },
              ),
              category: "Exchange",
              kind: "investment",
              brand: "Revolut",
              isIncoming: sell,
              status: "completed",
              rawDate: activity.timestamp,
            });
          }
          old.transactions = ledger.sort((a, b) => b.rawDate - a.rawDate);
        }
        if (version >= 5) return old;
        if (version >= 3)
          return {
            ...old,
            transactions:
              old.transactions?.map((tx) => {
                const reference = presentationTransactions.find(
                  (item) => item.id === tx.id,
                );
                return reference ? { ...tx, rawDate: reference.rawDate } : tx;
              }) || presentationTransactions,
            contacts: [
              ...presentationContacts.map((reference) => {
                const previous = old.contacts?.find(
                  (contact) => contact.id === reference.id,
                );
                return {
                  ...reference,
                  unread: previous?.unread ?? reference.unread,
                  transfers: [
                    ...reference.transfers,
                    ...(previous?.transfers || []).filter(
                      (transfer) => !transfer.id.startsWith("reference-"),
                    ),
                  ],
                  messages: [
                    ...(reference.messages || []),
                    ...(previous?.messages || []).filter(
                      (message) => !message.id.startsWith("reference-"),
                    ),
                  ],
                };
              }),
              ...(old.contacts || []).filter(
                (contact) =>
                  !presentationContacts.some(
                    (reference) => reference.id === contact.id,
                  ),
              ),
            ],
          };
        return {
          ...old,
          homeAccount: "personal",
          activeCurrency: "RON",
          accounts: {
            ...DEFAULT_ACCOUNTS,
            ...old.accounts,
            RON: { ...DEFAULT_ACCOUNTS.RON },
          },
          transactions: [
            ...(old.transactions || []).filter((tx) =>
              /^tx-(topup|transfer|custom)-|^bills-/.test(tx.id),
            ),
            ...presentationTransactions,
          ],
          contacts: presentationContacts,
          cards: presentationCards,
        };
      },
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        topUpCardId: state.topUpCardId,
        rates: state.rates,
        profileName: state.profileName,
        cryptoActivity: state.cryptoActivity,
        jointBalance: state.jointBalance,
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
    },
  ),
);
