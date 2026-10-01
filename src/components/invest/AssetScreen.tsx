"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppHeader } from "@/components/home/AppHeader";
import { AnimatedAmount } from "@/components/ui/AnimatedAmount";
import { OfficialIcon } from "@/components/ui/ReferenceIcons";
import { useRevolutStore } from "@/store/useRevolutStore";
import { demoAssets } from "@/data/assets";
import { formatCurrencyAmount } from "@/utils/formatters";

export function AssetScreen({ kind }: { kind: "invest" | "crypto" }) {
  const state = useRevolutStore();
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [view, setView] = useState<"Discover" | "Portfolio">("Discover");
  const [swapping, setSwapping] = useState(false);
  const [from, setFrom] = useState("BTC");
  const [to, setTo] = useState("ETH");
  const [amount, setAmount] = useState("10");
  const [message, setMessage] = useState("");
  const searchInput = useRef<HTMLInputElement>(null);
  const assets = demoAssets.filter((item) => item.kind === kind);
  const total = assets.reduce(
    (sum, item) => sum + (state.demoHoldings[item.symbol] || 0),
    0,
  );
  const filtered = assets.filter(
    (item) =>
      (item.name + " " + item.symbol)
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (view === "Discover" || !!state.demoHoldings[item.symbol]),
  );
  useEffect(() => {
    state.setScreenOverlayOpen(swapping);
    return () => useRevolutStore.getState().setScreenOverlayOpen(false);
  }, [swapping]);
  return (
    <section className={`reference-asset-screen ${kind} no-scrollbar`}>
      <AppHeader
        onSearch={() => {
          setSearching(true);
          requestAnimationFrame(() => searchInput.current?.focus());
        }}
        onAnalytics={() => setView("Portfolio")}
      />
      <div className="asset-content">
        <div className="asset-view glass-control">
          {(["Discover", "Portfolio"] as const).map((tab) => (
            <button
              className={view === tab ? "selected" : ""}
              key={tab}
              onClick={() => setView(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="asset-hero">
          <p>{kind === "invest" ? "Investments" : "Crypto"}</p>
          <h1>
            <AnimatedAmount value={formatCurrencyAmount(total, "RON")} />
          </h1>
          <span>Portfolio value</span>
        </div>
        <div className="asset-actions">
          <button onClick={() => state.openTrade(assets[0].symbol)}>
            <OfficialIcon name="plus" />
            Buy
          </button>
          <button
            disabled={!total}
            onClick={() =>
              state.openTrade(
                assets.find((item) => state.demoHoldings[item.symbol])
                  ?.symbol || assets[0].symbol,
                true,
              )
            }
          >
            <OfficialIcon name="arrow-send" />
            Sell
          </button>
          {kind === "crypto" && (
            <button
              onClick={() => {
                setMessage("");
                setSwapping(true);
              }}
            >
              <OfficialIcon name="arrow-exchange" />
              Swap
            </button>
          )}
        </div>
        <AnimatePresence>
          {searching && (
            <motion.label
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 48, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="asset-search glass-control"
            >
              <OfficialIcon name="search" />
              <input
                ref={searchInput}
                aria-label={`Search ${kind === "invest" ? "investments" : "crypto"}`}
                placeholder="Search by name or symbol"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <button
                aria-label="Close asset search"
                onClick={() => {
                  setSearching(false);
                  setSearch("");
                }}
              >
                <OfficialIcon name="cross" />
              </button>
            </motion.label>
          )}
        </AnimatePresence>
        <h2>
          {view === "Portfolio"
            ? "Your holdings"
            : kind === "invest"
              ? "Stocks & funds"
              : "Explore crypto"}
        </h2>
        <div className="asset-list">
          {filtered.map((item) => (
            <motion.button
              key={item.symbol}
              whileTap={{ scale: 0.98 }}
              onClick={() => state.openTrade(item.symbol)}
            >
              <i style={{ background: item.color }}>
                {item.symbol === "BTC" ? (
                  <OfficialIcon name="bitcoin" />
                ) : (
                  item.symbol.slice(0, 1)
                )}
              </i>
              <span>
                <strong>{item.name}</strong>
                <small>{item.symbol}</small>
              </span>
              <span className="asset-value">
                <strong>
                  {formatCurrencyAmount(
                    view === "Portfolio"
                      ? state.demoHoldings[item.symbol] || 0
                      : item.price,
                    "RON",
                  )}
                </strong>
                <small>
                  {view === "Portfolio"
                    ? "Allocated value"
                    : "Fixed demo quote"}
                </small>
              </span>
            </motion.button>
          ))}
        </div>
        {!filtered.length && (
          <p className="asset-empty">
            {search
              ? "No assets match your search."
              : "No holdings yet. Choose an asset in Discover to get started."}
          </p>
        )}
        <button
          className="asset-learn"
          onClick={() => state.setUiPanel("help")}
        >
          <OfficialIcon name="lightbulb" />
          <span>Learn about {kind === "crypto" ? "crypto" : "investing"}</span>
          <OfficialIcon name="chevron-right" />
        </button>
      </div>
      <AnimatePresence>
        {swapping && (
          <motion.div
            className="asset-swap-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.form
              className="transfer-choice"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              role="dialog"
              aria-label="Swap crypto"
              onSubmit={(event) => {
                event.preventDefault();
                const error = state.swapHoldings(from, to, Number(amount));
                setMessage(error || "Swap completed");
              }}
            >
              <h2>Swap crypto</h2>
              <label>
                From
                <select
                  aria-label="Swap from"
                  value={from}
                  onChange={(event) => {
                    setFrom(event.target.value);
                    if (event.target.value === to)
                      setTo(
                        assets.find(
                          (item) => item.symbol !== event.target.value,
                        )!.symbol,
                      );
                  }}
                >
                  {assets.map((item) => (
                    <option key={item.symbol}>{item.symbol}</option>
                  ))}
                </select>
              </label>
              <p>
                Available:{" "}
                {formatCurrencyAmount(state.demoHoldings[from] || 0, "RON")}
              </p>
              <label>
                To
                <select
                  aria-label="Swap to"
                  value={to}
                  onChange={(event) => setTo(event.target.value)}
                >
                  {assets
                    .filter((item) => item.symbol !== from)
                    .map((item) => (
                      <option key={item.symbol}>{item.symbol}</option>
                    ))}
                </select>
              </label>
              <label>
                Amount in RON
                <input
                  aria-label="Swap amount"
                  type="number"
                  min=".01"
                  step=".01"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                />
              </label>
              {message && <p role="status">{message}</p>}
              <button>Swap</button>
              <button type="button" onClick={() => setSwapping(false)}>
                Close
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
