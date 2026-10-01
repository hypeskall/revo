import type { Account, Currency, Transaction } from "@/types";
import { demoAssets } from "@/data/assets";

export const roundMoney = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100;

// All conversions use the same RON valuation, so a cross-currency exchange
// cannot create a different valuation from the one shown in Total wealth.
export function exchangeRate(
  rates: Record<string, number>,
  from: Currency,
  to: Currency,
) {
  const inRon = (currency: Currency) =>
    currency === "RON" ? 1 : rates[`${currency}_RON`];
  return inRon(from) / inRon(to);
}

export function personalTransaction(tx: Transaction): Transaction {
  // Bills activity is stored from the pocket's perspective.
  return tx.id.startsWith("bills-")
    ? {
        ...tx,
        amount: -tx.amount,
        isIncoming: !tx.isIncoming,
        kind: "internal",
      }
    : tx;
}

export function transactionDate(timestamp: number) {
  const date = new Date(timestamp),
    today = new Date();
  const yesterday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 1,
  );
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    ...(date.getFullYear() !== today.getFullYear() ? { year: "numeric" } : {}),
  });
}

export function isAccountMovement(tx: Transaction) {
  return (
    tx.status === "completed" &&
    Number.isFinite(tx.amount) &&
    tx.kind !== "asset-transfer"
  );
}

export function isExternalFlow(tx: Transaction) {
  return (
    isAccountMovement(tx) &&
    !["internal", "investment", "adjustment"].includes(tx.kind || "") &&
    tx.category !== "Exchange" &&
    !/^(joint-|bills-|tx-trade-)/.test(tx.id)
  );
}

export function accountSummary(
  transactions: Transaction[],
  balance: number,
  currency: Currency,
  start: number,
  end: number,
) {
  const ledger = transactions
    .map(personalTransaction)
    .filter((t) => t.currency === currency && isAccountMovement(t));
  const period = ledger.filter((t) => t.rawDate >= start && t.rawDate < end);
  const external = period.filter(isExternalFlow);
  const spent = roundMoney(
    external.reduce((sum, t) => sum + Math.max(0, -t.amount), 0),
  );
  const income = roundMoney(
    external.reduce((sum, t) => sum + Math.max(0, t.amount), 0),
  );
  const movement = roundMoney(period.reduce((sum, t) => sum + t.amount, 0));
  const closing = roundMoney(
    balance -
      ledger
        .filter((t) => t.rawDate >= end)
        .reduce((sum, t) => sum + t.amount, 0),
  );
  return {
    period,
    external,
    spent,
    income,
    net: roundMoney(income - spent),
    movement,
    moved: roundMoney(movement - (income - spent)),
    opening: roundMoney(closing - movement),
    closing,
  };
}

export function wealthSummary(state: {
  accounts: Record<Currency, Account>;
  rates: Record<string, number>;
  billsBalance: number;
  jointBalance: number;
  demoHoldings: Record<string, number>;
}) {
  const cash = roundMoney(
    Object.values(state.accounts).reduce(
      (sum, a) =>
        sum + a.balance * exchangeRate(state.rates, a.currency, "RON"),
      0,
    ) +
      state.billsBalance * exchangeRate(state.rates, "EUR", "RON") +
      state.jointBalance,
  );
  const holding = (kind: string) =>
    roundMoney(
      demoAssets
        .filter((a) => a.kind === kind)
        .reduce((sum, a) => sum + (state.demoHoldings[a.symbol] || 0), 0),
    );
  const investments = holding("invest");
  const crypto = holding("crypto");
  return {
    cash,
    investments,
    crypto,
    total: roundMoney(cash + investments + crypto),
  };
}
