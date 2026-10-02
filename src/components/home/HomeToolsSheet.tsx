"use client";

import React, { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeftRight,
  BarChart3,
  CreditCard,
  FileText,
  Landmark,
  Plus,
  X,
} from "@/components/ui/OfficialIcons";
import { useRevolutStore } from "@/store/useRevolutStore";
import { formatCurrencyAmount } from "@/utils/formatters";
import { sound } from "@/utils/audio";
import { Currency, Transaction } from "@/types";
import { personalTransaction } from "@/utils/finance";
import { ReferenceTools } from "./ReferenceTools";
import { AccountDetails } from "./AccountDetails";

export type HomeTool = "search" | "analytics" | "details" | "more";

interface HomeToolsSheetProps {
  tool: HomeTool | null;
  onClose: () => void;
  onOpenWallet: () => void;
  onSelectTool: (tool: HomeTool) => void;
  additionalTransactions?: Transaction[];
  currency?: Currency;
  onNavigatePoints?: () => void;
}

export const HomeToolsSheet: React.FC<HomeToolsSheetProps> = ({
  tool,
  onClose,
  onOpenWallet,
  onSelectTool,
  additionalTransactions,
  currency,
  onNavigatePoints,
}) => {
  const {
    accounts,
    activeCurrency: selectedCurrency,
    transactions: storedTransactions,
    contacts,
    setExchangeOpen,
    setAccountsDrawerOpen,
    setSelectedTransactionDetail,
    setSelectedContactForTransfer,
    billsBalance,
    setUiPanel,
  } = useRevolutStore();
  const activeCurrency = currency || selectedCurrency;
  const transactions = useMemo(
    () => [
      ...storedTransactions.map(personalTransaction),
      ...(additionalTransactions || []),
    ],
    [storedTransactions, additionalTransactions],
  );

  const account = accounts[activeCurrency];
  const openTool = (action: () => void) => {
    sound.playKeypadClick();
    onClose();
    window.setTimeout(action, 120);
  };

  const titles: Record<HomeTool, string> = {
    search: "Search",
    analytics: "Analytics",
    details: "Account details",
    more: "More",
  };

  if (tool === "details")
    return <AccountDetails currency={activeCurrency} onClose={onClose} />;
  if (tool === "search" || tool === "analytics")
    return (
      <ReferenceTools
        key={tool}
        tool={tool}
        onClose={onClose}
        transactions={transactions}
        currency={activeCurrency}
        onNavigate={(target, id) => {
          onClose();
          if (target === "converter") setExchangeOpen(true);
          if (target === "rewards")
            onNavigatePoints ? onNavigatePoints() : setUiPanel("rewards");
          if (target === "stays") setUiPanel("stays");
          if (target === "contact") {
            const contact = contacts.find((c) => c.id === id);
            if (contact) setSelectedContactForTransfer(contact);
          }
          if (target === "transaction") {
            const tx = transactions.find((t) => t.id === id);
            if (tx) setSelectedTransactionDetail(tx);
          }
        }}
      />
    );

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
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            style={{
              paddingBottom: "max(env(safe-area-inset-bottom, 0px), 22px)",
            }}
            className="relative max-h-[88dvh] overflow-y-auto no-scrollbar rounded-t-[34px] border-t border-white/10 bg-[#111317] px-5 pt-3 shadow-2xl"
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" />
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">
                {titles[tool]}
              </h2>
              <button
                type="button"
                aria-label="Close sheet"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {tool === "more" && (
              <div className="home-more-actions">
                {[
                  {
                    label: "Exchange",
                    detail: "Convert currencies",
                    Icon: ArrowLeftRight,
                    action: () => setExchangeOpen(true),
                  },
                  {
                    label: "Cards",
                    detail: "Manage your cards",
                    Icon: CreditCard,
                    action: onOpenWallet,
                  },
                  {
                    label: "Statements",
                    detail: "Download demo activity",
                    Icon: FileText,
                    action: () => {
                      const cell = (value: string | number) =>
                        `"${String(value).replace(/"/g, '""')}"`;
                      const rows = [
                        ["Date", "Time", "Description", "Amount", "Currency"],
                        ...transactions.map((tx) => [
                          tx.date,
                          tx.timestamp,
                          tx.title,
                          tx.amount,
                          tx.currency,
                        ]),
                      ];
                      const url = URL.createObjectURL(
                        new Blob(
                          [
                            "Sandbox statement — fictional transactions\r\n" +
                              rows
                                .map((row) => row.map(cell).join(","))
                                .join("\r\n"),
                          ],
                          { type: "text/csv;charset=utf-8" },
                        ),
                      );
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = "sandbox-statement.csv";
                      link.click();
                      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
                    },
                  },
                  {
                    label: "Add account",
                    detail: "Currencies & pockets",
                    Icon: Plus,
                    action: () => setAccountsDrawerOpen(true),
                  },
                  {
                    label: "Analytics",
                    detail: "Spending overview",
                    Icon: BarChart3,
                    action: () => onSelectTool("analytics"),
                  },
                  {
                    label: "Details",
                    detail: "Account information",
                    Icon: Landmark,
                    action: () => onSelectTool("details"),
                  },
                ].map(({ label, detail, Icon, action }) => (
                  <button
                    type="button"
                    key={label}
                    onClick={() => {
                      if (label === "Analytics" || label === "Details") {
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

            {tool !== "more" && account && (
              <div className="mt-5 text-center text-[11px] text-white/30">
                Available balance{" "}
                {formatCurrencyAmount(
                  additionalTransactions ? billsBalance : account.balance,
                  activeCurrency,
                )}
              </div>
            )}
          </motion.section>
        </div>
      )}
    </AnimatePresence>
  );
};
