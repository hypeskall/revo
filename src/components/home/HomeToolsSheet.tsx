'use client';

import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeftRight,
  BarChart3,
  Check,
  ChevronRight,
  Copy,
  CreditCard,
  FileText,
  Landmark,
  Plus,
  Search,
  X,
} from 'lucide-react';
import { useRevolutStore } from '@/store/useRevolutStore';
import { formatCurrencyAmount } from '@/utils/formatters';
import { sound } from '@/utils/audio';

export type HomeTool = 'search' | 'analytics' | 'details' | 'more';

interface HomeToolsSheetProps {
  tool: HomeTool | null;
  onClose: () => void;
  onOpenWallet: () => void;
  onSelectTool: (tool: HomeTool) => void;
}

const categoryColors: Record<string, string> = {
  Transfers: '#7c5cff',
  Shopping: '#ff3b7f',
  Tech: '#65d5ff',
  Groceries: '#39d98a',
  Entertainment: '#ff9f43',
  Transport: '#4d8dff',
  Exchange: '#00c2a8',
};

export const HomeToolsSheet: React.FC<HomeToolsSheetProps> = ({
  tool,
  onClose,
  onOpenWallet,
  onSelectTool,
}) => {
  const {
    accounts,
    activeCurrency,
    transactions,
    contacts,
    setExchangeOpen,
    setAccountsDrawerOpen,
    setSelectedTransactionDetail,
    setSelectedContactForTransfer,
  } = useRevolutStore();
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const account = accounts[activeCurrency];
  const iban = 'RO50 REVO 0000 1697 1825 8222';

  const spending = useMemo(() => {
    const totals = new Map<string, number>();
    transactions.forEach((transaction) => {
      if (transaction.amount < 0) {
        totals.set(
          transaction.category,
          (totals.get(transaction.category) || 0) + Math.abs(transaction.amount)
        );
      }
    });
    return Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);
  }, [transactions]);

  const totalSpent = spending.reduce((sum, [, value]) => sum + value, 0);

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('ro-RO');
    if (!normalized) return { transactions: transactions.slice(0, 5), contacts: contacts.slice(0, 4) };
    return {
      transactions: transactions.filter((item) =>
        `${item.title} ${item.subtitle} ${item.category}`.toLocaleLowerCase('ro-RO').includes(normalized)
      ),
      contacts: contacts.filter((item) =>
        `${item.name} ${item.phone}`.toLocaleLowerCase('ro-RO').includes(normalized)
      ),
    };
  }, [contacts, query, transactions]);

  const copyValue = async (label: string, value: string) => {
    sound.playKeypadClick();
    await navigator.clipboard?.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(null), 1400);
  };

  const openTool = (action: () => void) => {
    sound.playKeypadClick();
    onClose();
    window.setTimeout(action, 120);
  };

  const titles: Record<HomeTool, string> = {
    search: 'Search',
    analytics: 'Analytics',
    details: 'Account details',
    more: 'More',
  };

  return (
    <AnimatePresence>
      {tool && (
        <div className="absolute inset-0 z-[64] flex flex-col justify-end">
          <motion.button
            type="button"
            aria-label="Close"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          <motion.section
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 22px)' }}
            className="relative max-h-[88dvh] overflow-y-auto no-scrollbar rounded-t-[34px] border-t border-white/10 bg-[#111317] px-5 pt-3 shadow-2xl"
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" />
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">{titles[tool]}</h2>
              <button
                type="button"
                aria-label="Close sheet"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {tool === 'search' && (
              <div className="space-y-5">
                <label className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3">
                  <Search className="h-4 w-4 text-white/55" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="People, merchants or payments"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                  />
                </label>

                {searchResults.contacts.length > 0 && (
                  <div>
                    <div className="mb-2 text-xs font-semibold text-white/45">People</div>
                    <div className="overflow-hidden rounded-2xl bg-white/[0.05]">
                      {searchResults.contacts.map((contact) => (
                        <button
                          type="button"
                          key={contact.id}
                          onClick={() => openTool(() => setSelectedContactForTransfer(contact))}
                          className="flex w-full items-center justify-between border-b border-white/[0.05] px-4 py-3 last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                              style={{ backgroundColor: contact.avatarColor || '#52525b' }}
                            >
                              {contact.initials}
                            </div>
                            <div className="text-left">
                              <div className="text-sm font-semibold">{contact.name}</div>
                              <div className="text-xs text-white/40">Revolut contact</div>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-white/30" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="mb-2 text-xs font-semibold text-white/45">Transactions</div>
                  <div className="overflow-hidden rounded-2xl bg-white/[0.05]">
                    {searchResults.transactions.length ? (
                      searchResults.transactions.slice(0, 8).map((transaction) => (
                        <button
                          type="button"
                          key={transaction.id}
                          onClick={() => openTool(() => setSelectedTransactionDetail(transaction))}
                          className="flex w-full items-center justify-between border-b border-white/[0.05] px-4 py-3 text-left last:border-0"
                        >
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold">{transaction.title}</div>
                            <div className="truncate text-xs text-white/40">{transaction.subtitle}</div>
                          </div>
                          <div className="pl-3 text-sm font-semibold">
                            {formatCurrencyAmount(transaction.amount, transaction.currency, { includeSign: true })}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-sm text-white/40">No results</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {tool === 'analytics' && (
              <div>
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#1b315e] to-[#111722] p-5">
                  <div className="text-xs text-white/50">Spent in this sandbox</div>
                  <div className="mt-1 text-3xl font-bold tracking-tight">
                    {formatCurrencyAmount(totalSpent, activeCurrency)}
                  </div>
                  <div className="mt-1 text-xs text-emerald-400">↓ 9.6% compared with last month</div>
                </div>

                <div className="mt-5 space-y-4">
                  {spending.slice(0, 6).map(([category, value]) => {
                    const percent = totalSpent ? (value / totalSpent) * 100 : 0;
                    return (
                      <div key={category}>
                        <div className="mb-1.5 flex items-center justify-between text-sm">
                          <span className="font-medium">{category}</span>
                          <span className="text-white/60">{formatCurrencyAmount(value, activeCurrency)}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(percent, 3)}%` }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: categoryColors[category] || '#8b8b96' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {tool === 'details' && (
              <div className="space-y-4">
                <div className="rounded-3xl border border-white/10 bg-[#191c21] p-5">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
                      <Landmark className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Personal · {activeCurrency}</div>
                      <div className="text-xs text-white/45">Local account · Sandbox</div>
                    </div>
                  </div>

                  {[
                    ['Beneficiary', 'Mihai Andrei'],
                    ['IBAN', iban],
                    ['BIC / SWIFT', 'REVOROB1'],
                  ].map(([label, value]) => (
                    <button
                      type="button"
                      key={label}
                      onClick={() => copyValue(label, value)}
                      className="flex w-full items-center justify-between border-t border-white/[0.06] py-3 text-left"
                    >
                      <div>
                        <div className="text-[11px] text-white/40">{label}</div>
                        <div className="mt-0.5 text-sm font-medium">{value}</div>
                      </div>
                      {copied === label ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-white/35" />}
                    </button>
                  ))}
                </div>
                <div className="rounded-2xl bg-blue-500/10 px-4 py-3 text-xs leading-relaxed text-blue-200">
                  These are fictional sandbox details. They cannot receive or send real money.
                </div>
              </div>
            )}

            {tool === 'more' && (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Exchange', detail: 'Convert currencies', Icon: ArrowLeftRight, action: () => setExchangeOpen(true) },
                  { label: 'Cards', detail: 'Manage your cards', Icon: CreditCard, action: onOpenWallet },
                  { label: 'Statements', detail: 'View activity', Icon: FileText, action: () => setSelectedTransactionDetail(transactions[0]) },
                  { label: 'Add account', detail: 'Currencies & pockets', Icon: Plus, action: () => setAccountsDrawerOpen(true) },
                  { label: 'Analytics', detail: 'Spending overview', Icon: BarChart3, action: () => onSelectTool('analytics') },
                  { label: 'Details', detail: 'Account information', Icon: Landmark, action: () => onSelectTool('details') },
                ].map(({ label, detail, Icon, action }) => (
                  <button
                    type="button"
                    key={label}
                    onClick={() => {
                      if (label === 'Analytics' || label === 'Details') {
                        sound.playKeypadClick();
                        action();
                        return;
                      }
                      openTool(action);
                    }}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.06] p-4 text-left active:scale-[0.98]"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-sm font-semibold">{label}</div>
                    <div className="mt-0.5 text-xs text-white/40">{detail}</div>
                  </button>
                ))}
              </div>
            )}

            {tool !== 'search' && tool !== 'more' && account && (
              <div className="mt-5 text-center text-[11px] text-white/30">
                Available balance {formatCurrencyAmount(account.balance, activeCurrency)}
              </div>
            )}
          </motion.section>
        </div>
      )}
    </AnimatePresence>
  );
};
