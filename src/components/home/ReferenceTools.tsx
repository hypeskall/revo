"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { OfficialIcon } from "@/components/ui/ReferenceIcons";
import { useClosingScreen } from "@/components/ui/useClosingScreen";
import { useRevolutStore } from "@/store/useRevolutStore";
import { formatCurrencyAmount } from "@/utils/formatters";
import { Currency, Transaction } from "@/types";
import { accountSummary, wealthSummary, roundMoney } from "@/utils/finance";

export function ReferenceTools({
  tool,
  onClose,
  onNavigate,
  transactions,
  currency,
}: {
  tool: "search" | "analytics";
  onClose: () => void;
  onNavigate: (
    target: "converter" | "rewards" | "stays" | "transaction" | "contact",
    id?: string,
  ) => void;
  transactions: Transaction[];
  currency: Currency;
}) {
  const state = useRevolutStore();
  const closing = useClosingScreen(onClose);
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [local, setLocal] = useState<"atms" | null>(null);
  const [selectedCurrency, setCurrency] = useState(currency);
  const [period, setPeriod] = useState("This month");
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    try {
      setHistory(
        JSON.parse(localStorage.getItem("revo-search-history") || "[]")
          .filter((v: unknown) => typeof v === "string")
          .slice(0, 5),
      );
    } catch {}
  }, []);
  const saveQuery = () => {
    const text = query.trim();
    if (!text) return;
    const next = [text, ...history.filter((v) => v !== text)].slice(0, 5);
    setHistory(next);
    localStorage.setItem("revo-search-history", JSON.stringify(next));
  };
  const matching = useMemo(
    () => ({
      people: state.contacts.filter((c) =>
        `${c.name} ${c.revtag || ""}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
      payments: transactions.filter((t) =>
        `${t.title} ${t.category}`.toLowerCase().includes(query.toLowerCase()),
      ),
    }),
    [query, state.contacts, transactions],
  );
  const now = new Date();
  const month = period === "Last month" ? now.getMonth() - 1 : now.getMonth();
  const start =
    period === "All time" ? 0 : new Date(now.getFullYear(), month, 1).getTime();
  const end =
    period === "All time"
      ? Infinity
      : new Date(now.getFullYear(), month + 1, 1).getTime();
  const summary = accountSummary(
    state.transactions,
    state.accounts[selectedCurrency].balance,
    selectedCurrency,
    start,
    end,
  );
  const { external: txs, spent, income, net } = summary;
  const previousStart = new Date(now.getFullYear(), month - 1, 1).getTime();
  const previous = accountSummary(
    state.transactions,
    state.accounts[selectedCurrency].balance,
    selectedCurrency,
    previousStart,
    start,
  );
  const spendingChange =
    period === "All time" ? 0 : roundMoney(spent - previous.spent);
  const incomeChange =
    period === "All time" ? 0 : roundMoney(income - previous.income);
  const categories = Array.from(
    new Set(txs.filter((t) => t.amount < 0).map((t) => t.category)),
  )
    .map((category) => ({
      category,
      value: txs
        .filter((t) => t.category === category)
        .reduce((a, t) => a + Math.max(0, -t.amount), 0),
    }))
    .sort((a, b) => b.value - a.value);
  // Keep the cumulative graph chronological, including across month boundaries.
  const chartStart =
    period === "All time"
      ? Math.min(now.getTime(), ...txs.map((t) => t.rawDate))
      : start;
  const chartEnd = period === "All time" ? now.getTime() + 1 : end;
  const chartRange = Math.max(1, chartEnd - chartStart);
  const days = Array.from({ length: 31 }, (_, day) =>
    txs
      .filter((t) => t.rawDate < chartStart + (chartRange * (day + 1)) / 31)
      .reduce(
        (a, t) =>
          a +
          (slide === 0
            ? Math.max(0, -t.amount)
            : slide === 1
              ? Math.max(0, t.amount)
              : t.amount),
        0,
      ),
  );
  const min = Math.min(0, ...days),
    max = Math.max(0, ...days),
    range = Math.max(1, max - min);
  const y = (v: number) => 70 - ((v - min) / range) * 55;
  const line = days.map((v, i) => `${i * 10},${y(v)}`).join(" ");
  const money = (v: number) =>
    formatCurrencyAmount(v, selectedCurrency, { showDecimalsIfZero: false });
  const incomeBars = Array.from({ length: 5 }, (_, i) =>
    txs
      .filter(
        (t) =>
          t.amount > 0 &&
          Math.min(
            4,
            Math.floor(((t.rawDate - chartStart) / chartRange) * 5),
          ) === i,
      )
      .reduce((a, t) => a + t.amount, 0),
  );
  const wealth = wealthSummary(state);
  const { cash, total } = wealth;
  return (
    <motion.section
      {...closing.props}
      onAnimationComplete={closing.finish}
      role="dialog"
      aria-modal="true"
      aria-label={tool === "search" ? "Search" : "Analytics"}
      className={`reference-full-tool ${tool}`}
      initial={{ y: "100%" }}
      animate={{ y: closing.closing ? "100%" : 0 }}
      transition={{ type: "spring", stiffness: 340, damping: 34 }}
    >
      {tool === "search" ? (
        <>
          <form
            className="reference-search-top"
            onSubmit={(e) => {
              e.preventDefault();
              saveQuery();
            }}
          >
            <label className="glass-control">
              <OfficialIcon name="search" />
              <input
                autoFocus
                aria-label="Search people and payments"
                placeholder={'Search "TFL, Starbucks, Amazon, et...'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                enterKeyHint="search"
              />
            </label>
            <button
              type="button"
              className="reference-back"
              aria-label="Close search"
              onClick={closing.close}
            >
              <OfficialIcon name="cross" />
            </button>
          </form>
          <div className="reference-search-shortcuts">
            {[
              {
                label: "Converter",
                icon: "arrow-exchange",
                target: "converter",
              },
              { label: "ATMs", icon: "cash", target: "atms" },
              { label: "RevPoints", icon: "rev-points", target: "rewards" },
              { label: "Stays", icon: "resort", target: "stays" },
            ].map((i) => (
              <button
                key={i.label}
                onClick={() =>
                  i.target === "atms"
                    ? setLocal("atms")
                    : onNavigate(i.target as "converter" | "rewards" | "stays")
                }
              >
                <i>
                  <OfficialIcon name={i.icon} />
                </i>
                {i.label}
              </button>
            ))}
          </div>
          {!query &&
            history.map((text) => (
              <div className="reference-search-history" key={text}>
                <button onClick={() => setQuery(text)}>
                  <OfficialIcon name="time-outline" />
                  {text}
                </button>
                <button
                  aria-label={`Remove search ${text}`}
                  onClick={() => {
                    const next = history.filter((v) => v !== text);
                    setHistory(next);
                    localStorage.setItem(
                      "revo-search-history",
                      JSON.stringify(next),
                    );
                  }}
                >
                  <OfficialIcon name="cross" />
                </button>
              </div>
            ))}
          {query && (
            <div className="reference-search-results">
              {matching.people.length > 0 && (
                <>
                  <h2>People</h2>
                  {matching.people.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        saveQuery();
                        onNavigate("contact", c.id);
                      }}
                    >
                      <i>{c.initials}</i>
                      <span>
                        {c.name}
                        <small>@{c.revtag || c.initials.toLowerCase()}</small>
                      </span>
                      <OfficialIcon name="chevron-right" />
                    </button>
                  ))}
                </>
              )}
              <h2>Transactions</h2>
              {matching.payments.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    saveQuery();
                    onNavigate("transaction", t.id);
                  }}
                >
                  <span>
                    {t.title}
                    <small>
                      {t.date}, {t.timestamp}
                    </small>
                  </span>
                  <span>{money(t.amount)}</span>
                </button>
              ))}
              {!matching.people.length && !matching.payments.length && (
                <p>No results</p>
              )}
            </div>
          )}
          {local && (
            <section
              className="reference-local-sheet"
              role="dialog"
              aria-label="ATMs"
            >
              <button
                className="reference-back"
                aria-label="Close ATM map"
                onClick={() => setLocal(null)}
              >
                <OfficialIcon name="cross" />
              </button>
              <h2>ATMs</h2>
              <div className="reference-map">
                <OfficialIcon name="cash" />
                <OfficialIcon name="cash" />
                <OfficialIcon name="cash" />
              </div>
              <p>Explore sample cash withdrawal locations</p>
              <button
                className="presentation-primary"
                onClick={() => setLocal(null)}
              >
                Done
              </button>
            </section>
          )}
        </>
      ) : (
        <>
          <button
            className="reference-back"
            aria-label="Close analytics"
            onClick={closing.close}
          >
            <OfficialIcon name="cross" />
          </button>
          <h1>Analytics</h1>
          <div className="reference-analytics-selectors">
            <label>
              <select
                aria-label="Analytics account"
                value={selectedCurrency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
              >
                {(["RON", "EUR", "USD", "GBP"] as const).map((c) => (
                  <option key={c} value={c}>
                    {c === "RON" ? "Personal" : `Personal · ${c}`}
                  </option>
                ))}
              </select>
              <OfficialIcon name="chevron-down" />
            </label>
            <select
              aria-label="Analytics period"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              {["This month", "Last month", "All time"].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <motion.div
            className="reference-analytics-main"
            key={slide}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span>
              {slide === 0 ? "Spent" : slide === 1 ? "Income" : "Net cashflow"}
            </span>
            <div className="analytics-total">
              <strong>
                {money(slide === 0 ? spent : slide === 1 ? income : net)}
              </strong>
              {slide === 0 && period !== "All time" && (
                <small className={spendingChange > 0 ? "negative" : "positive"}>
                  {spendingChange >= 0 ? "▲" : "▼"}{" "}
                  {money(Math.abs(spendingChange))}
                </small>
              )}
            </div>
            <svg
              viewBox="0 0 310 95"
              role="img"
              aria-label={`Cumulative ${["spending", "income", "cashflow"][slide]} chart`}
            >
              <polyline
                points={line}
                fill="none"
                stroke="#66666a"
                strokeWidth="1.7"
              />
              <circle cx="0" cy={y(days[0])} r="3.6" fill="#ff516b" />
            </svg>
            <div className="analytics-days">
              {[1, 6, 11, 16, 21, 26, 31].map((d) => (
                <span key={d}>
                  {period === "All time"
                    ? new Date(
                        chartStart + (chartRange * (d - 1)) / 30,
                      ).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })
                    : Math.min(
                        d,
                        new Date(now.getFullYear(), month + 1, 0).getDate(),
                      )}
                </span>
              ))}
            </div>
          </motion.div>
          <div className="reference-analytics-pair">
            <button onClick={() => setSlide(1)}>
              <span>Income</span>
              <strong>{money(income)}</strong>
              <small className={incomeChange >= 0 ? "positive" : "negative"}>
                {incomeChange >= 0 ? "▲" : "▼"} {money(Math.abs(incomeChange))}
              </small>
              <div className="analytics-bars">
                {incomeBars.map((v, i) => (
                  <i
                    key={i}
                    style={{
                      height: `${v ? (v / Math.max(1, ...incomeBars)) * 100 : 100}%`,
                      background: v ? "#548aff" : "#55565c",
                    }}
                  />
                ))}
              </div>
            </button>
            <button onClick={() => setSlide(2)}>
              <span>Net cashflow</span>
              <strong>{money(net)}</strong>
              <small className={net >= 0 ? "positive" : "negative"}>
                {net >= 0 ? "⊕ Positive" : "⊖ Negative"}
              </small>
              <div className="cashflow-bars">
                <i
                  style={{
                    width: `${Math.max(3, (income / Math.max(income, spent, 1)) * 100)}%`,
                  }}
                />
                <i
                  style={{
                    width: `${Math.max(3, (spent / Math.max(income, spent, 1)) * 100)}%`,
                  }}
                />
              </div>
            </button>
          </div>
          <div className="reference-carousel-dots">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                aria-label={`Show ${["spending", "income", "cashflow"][i]}`}
                aria-pressed={slide === i}
                onClick={() => setSlide(i)}
              />
            ))}
          </div>
          <h2>Overview</h2>
          <button
            className="reference-analytics-assets"
            onClick={() => {
              onClose();
              state.setAccountsDrawerOpen(true);
            }}
          >
            <span>Total assets</span>
            <strong>
              {formatCurrencyAmount(total, "RON", {
                showDecimalsIfZero: false,
              })}
            </strong>
            <div className="analytics-allocation" aria-label="Asset allocation">
              <i
                style={{
                  width: total ? (cash / total) * 100 + "%" : "100%",
                  background: "#699cff",
                }}
              />
              <i
                style={{
                  width: total
                    ? (wealth.investments / total) * 100 + "%"
                    : "0%",
                  background: "#f88b4c",
                }}
              />
              <i
                style={{
                  width: total ? (wealth.crypto / total) * 100 + "%" : "0%",
                  background: "#b666ef",
                }}
              />
            </div>
            <small>
              <i />
              Cash · {formatCurrencyAmount(cash, "RON")}
            </small>
            {wealth.investments > 0 && (
              <small>
                Investments · {formatCurrencyAmount(wealth.investments, "RON")}
              </small>
            )}
            {wealth.crypto > 0 && (
              <small>
                Crypto · {formatCurrencyAmount(wealth.crypto, "RON")}
              </small>
            )}
          </button>
          <h2>Account balance</h2>
          <section
            className="analytics-reconciliation"
            aria-label="Account balance reconciliation"
          >
            <div>
              <span>Opening balance</span>
              <strong>{money(summary.opening)}</strong>
            </div>
            <div>
              <span>Income</span>
              <strong className="positive">+{money(income)}</strong>
            </div>
            <div>
              <span>Spent</span>
              <strong>{money(-spent)}</strong>
            </div>
            {summary.moved !== 0 && (
              <div>
                <span>Exchanges & account moves</span>
                <strong>{money(summary.moved)}</strong>
              </div>
            )}
            <div>
              <span>
                {period === "Last month"
                  ? "Closing balance"
                  : "Current balance"}
              </span>
              <strong>{money(summary.closing)}</strong>
            </div>
          </section>
          {categories.length > 0 && (
            <>
              <h2>Spending by category</h2>
              <div className="reference-analytics-categories">
                {categories.map((c) => (
                  <div key={c.category}>
                    <span>{c.category}</span>
                    <strong>{money(c.value)}</strong>
                    <i
                      style={{
                        width: `${(c.value / Math.max(spent, 1)) * 100}%`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </motion.section>
  );
}
