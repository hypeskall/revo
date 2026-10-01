"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppHeader } from "@/components/home/AppHeader";
import { OfficialIcon } from "@/components/ui/ReferenceIcons";
import { AnimatedAmount } from "@/components/ui/AnimatedAmount";
import { useRevolutStore } from "@/store/useRevolutStore";
import { demoAssets } from "@/data/assets";
import { formatCurrencyAmount } from "@/utils/formatters";
import { CurrencyFlag } from "@/components/ui/CurrencyFlag";

const movers = [
  { symbol: "IOTX", change: 44.4 },
  { symbol: "ALICE", change: 26.47 },
  { symbol: "DIMO", change: 21.18 },
  { symbol: "JASMY", change: 15.51 },
  { symbol: "GTC", change: 13.8 },
  { symbol: "ELA", change: 13.27 },
  { symbol: "MON", change: 11.1 },
  { symbol: "PONKE", change: 9.1 },
];
function Token({ symbol }: { symbol: string }) {
  const asset = demoAssets.find((a) => a.symbol === symbol);
  return (
    <i
      className={`reference-token token-${symbol}`}
      style={{ background: asset?.color }}
    >
      {symbol === "BTC" ? (
        <OfficialIcon name="bitcoin" />
      ) : (
        <img
          src={`/icons/crypto/${symbol === "DIMO" ? "DIMO-reference" : symbol}.svg`}
          alt={symbol}
        />
      )}
    </i>
  );
}
function Sparkline({ eth = false }: { eth?: boolean }) {
  const path = eth
    ? "M0 66 8 70 16 82 25 71 38 69 52 63 62 51 70 32 82 29 94 30 104 34 110 68 118 73 129 54 138 47 146 49 163 38 174 32 181 15 189 12 196 24 203 18 210 3 218 8 225 7"
    : "M0 76 12 82 21 83 29 78 40 82 51 75 63 78 73 60 83 66 92 74 99 58 106 50 113 73 121 66 135 61 148 55 160 42 169 35 178 38 187 28 198 17 207 1 215 4";
  return (
    <svg
      viewBox="0 0 225 100"
      role="img"
      aria-label={`Sample ${eth ? "Ethereum" : "Bitcoin"} price chart`}
    >
      <defs>
        <linearGradient id={eth ? "eth-area" : "btc-area"} x2="0" y2="1">
          <stop stopColor="#19b89a" stopOpacity=".28" />
          <stop offset="1" stopColor="#19b89a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${path}L225 100H0Z`}
        fill={`url(#${eth ? "eth-area" : "btc-area"})`}
      />
      <path d="M0 75H225" stroke="#777" strokeDasharray="1 7" />
      <motion.path
        d={path}
        fill="none"
        stroke="#20b99b"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7 }}
      />
    </svg>
  );
}
export function CryptoScreen() {
  const state = useRevolutStore();
  const [menu, setMenu] = useState<string | null>(null);
  const [promo, setPromo] = useState(true);
  const [losers, setLosers] = useState(false);
  const [query, setQuery] = useState("");
  const [symbol, setSymbol] = useState("BTC");
  const [recipient, setRecipient] = useState("c-rares");
  const [amount, setAmount] = useState("10");
  const [message, setMessage] = useState("");
  const [selectedActivity, setActivity] = useState<
    (typeof state.cryptoActivity)[number] | null
  >(null);
  const [swapTo, setSwapTo] = useState("ETH");
  const assets = demoAssets.filter((a) => a.kind === "crypto");
  const total = assets.reduce(
    (sum, a) => sum + (state.demoHoldings[a.symbol] || 0),
    0,
  );
  const money = (value: number) =>
    formatCurrencyAmount(value, "RON", { showDecimalsIfZero: false });
  useEffect(() => {
    state.setScreenOverlayOpen(!!menu);
    return () => useRevolutStore.getState().setScreenOverlayOpen(false);
  }, [menu]);
  const open = (page: string) => {
    setMessage("");
    setMenu(page);
  };
  const fixtures = [
    {
      id: "crypto-reference-send",
      asset: "BTC",
      units: -0.000086,
      value: -25.36,
      title: "To Rareș Roman",
      timestamp: new Date(2026, 6, 19, 3, 11).getTime(),
    },
    {
      id: "crypto-reference-buy",
      asset: "BTC",
      units: 0.000016,
      value: 6.4,
      title: "RON → BTC",
      timestamp: new Date(2026, 6, 19, 3, 7).getTime(),
    },
  ];
  const activity = [...state.cryptoActivity, ...fixtures];
  return (
    <div className="reference-section-root">
      <section
        className="reference-crypto-screen no-scrollbar"
        aria-hidden={!!menu}
        ref={(node) => {
          if (node) node.inert = !!menu;
        }}
      >
        <AppHeader onAnalytics={() => open("Crypto analytics")} />
        <div className="reference-crypto-hero">
          <p>Crypto</p>
          <h1>
            <AnimatedAmount
              value={total.toLocaleString("ro-RO", {
                maximumFractionDigits: 2,
              })}
            />
            <small>lei</small>
          </h1>
          <span>0,00 lei&nbsp;&nbsp; 0,00%</span>
        </div>
        <div className="reference-actions crypto-actions">
          {[
            { label: "Trade", icon: "arrow-rates", page: "Trade crypto" },
            { label: "Receive", icon: "arrow-request", page: "Receive crypto" },
            { label: "Send", icon: "arrow-send", page: "Send crypto" },
            { label: "More", icon: "more-i-os", page: "More" },
          ].map((i) => (
            <button key={i.label} onClick={() => open(i.page)}>
              <i>
                <OfficialIcon name={i.icon} />
              </i>
              <span>{i.label}</span>
            </button>
          ))}
        </div>
        {promo && (
          <section className="reference-crypto-promo">
            <button
              aria-label="Dismiss crypto promotion"
              className="reference-promo-close"
              onClick={() => setPromo(false)}
            >
              <OfficialIcon name="cross" />
            </button>
            <button onClick={() => state.setWalletOpen(true)}>
              <strong>Pay in crypto without fees</strong>
              <span>
                Pick a holographic card to spend fiat or crypto. T&Cs apply
              </span>
              <div className="crypto-promo-art">
                <i>
                  Revolut<span>WHEN LAMBO?</span>
                </i>
                <i>
                  Revolut<span>HOWL</span>
                </i>
              </div>
            </button>
          </section>
        )}
        <section className="reference-crypto-transactions">
          <button
            className="reference-widget-title"
            onClick={() => open("Crypto transactions")}
          >
            Transactions <OfficialIcon name="chevron-right" />
          </button>
          {activity.slice(0, 2).map((tx) => (
            <button
              key={tx.id}
              className="crypto-transaction-row"
              onClick={() => {
                setActivity(tx);
                open("Crypto transaction");
              }}
            >
              {tx.title.startsWith("To") ? (
                <i className="crypto-person">
                  RR
                  <b>
                    <OfficialIcon name="arrow-send" />
                  </b>
                </i>
              ) : (
                <i className="crypto-exchange-badge">
                  <CurrencyFlag currency="RON" />
                  <Token symbol={tx.asset} />
                </i>
              )}
              <span>
                {tx.title}
                <small>
                  {new Date(tx.timestamp).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                  ,{" "}
                  {new Date(tx.timestamp).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>
              </span>
              <span>
                {tx.units > 0 ? "+" : ""}
                {tx.units.toLocaleString("ro-RO", {
                  maximumFractionDigits: 8,
                })}{" "}
                {tx.asset}
                <small>{money(tx.value)}</small>
              </span>
            </button>
          ))}
          <button
            className="reference-see-all"
            onClick={() => open("Crypto transactions")}
          >
            See all
          </button>
        </section>
        <div className="reference-market-pair">
          {["BTC", "ETH"].map((s, i) => (
            <button key={s} onClick={() => state.openTrade(s)}>
              <span>{s}</span>
              <Token symbol={s} />
              <strong>
                {money(assets.find((a) => a.symbol === s)!.price)}
              </strong>
              <small>▲ {i ? "2,07" : "2,84"}%</small>
              <Sparkline eth={!!i} />
            </button>
          ))}
        </div>
        <section className="reference-top-movers">
          <button
            className="reference-widget-title"
            onClick={() => open("Trade crypto")}
          >
            Top movers <OfficialIcon name="chevron-right" />
          </button>
          <div className="mover-tabs">
            <button aria-pressed={!losers} onClick={() => setLosers(false)}>
              Top gainers
            </button>
            <button aria-pressed={losers} onClick={() => setLosers(true)}>
              Top losers
            </button>
          </div>
          <div className="movers-grid">
            {movers.map((item) => (
              <button
                key={item.symbol}
                onClick={() => state.openTrade(item.symbol)}
              >
                <Token symbol={item.symbol} />
                <span>{item.symbol}</span>
                <small className={losers ? "negative" : "positive"}>
                  {losers ? "▼ -" : "▲ "}
                  {(losers ? item.change / 5 : item.change).toLocaleString(
                    "ro-RO",
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                  )}
                  %
                </small>
              </button>
            ))}
          </div>
        </section>
        <section className="reference-crypto-features">
          <h2>Features</h2>
          <button onClick={() => open("Earn crypto")}>
            <i>
              <OfficialIcon name="percent" />
            </i>
            <span>
              Earn<small>Up to 21,04% APY</small>
            </span>
            <OfficialIcon name="chevron-right" />
          </button>
          <button onClick={() => open("Crypto analytics")}>
            <i>
              <OfficialIcon name="bar-chart" />
            </i>
            <span>Your holdings</span>
            <OfficialIcon name="chevron-right" />
          </button>
        </section>
        <p className="reference-prototype-note">
          Prices, charts, rates and market moves are fixed presentation data.
        </p>
      </section>
      <AnimatePresence>
        {menu && (
          <motion.section
            className="reference-crypto-dialog no-scrollbar"
            role="dialog"
            aria-modal="true"
            aria-label={menu}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 34 }}
          >
            <button
              className="reference-back"
              aria-label="Close crypto menu"
              onClick={() => setMenu(null)}
            >
              <OfficialIcon name="cross" />
            </button>
            <h1>{menu}</h1>
            {menu === "Trade crypto" && (
              <>
                <label className="asset-search glass-control">
                  <OfficialIcon name="search" />
                  <input
                    autoFocus
                    aria-label="Search crypto"
                    placeholder="Search by name or symbol"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <div className="asset-list">
                  {assets
                    .filter((a) =>
                      (a.name + a.symbol)
                        .toLowerCase()
                        .includes(query.toLowerCase()),
                    )
                    .map((a) => (
                      <button
                        key={a.symbol}
                        onClick={() => state.openTrade(a.symbol)}
                      >
                        <Token symbol={a.symbol} />
                        <span>
                          {a.name}
                          <small>{a.symbol}</small>
                        </span>
                        <span>{money(a.price)}</span>
                      </button>
                    ))}
                </div>
              </>
            )}
            {(menu === "Receive crypto" || menu === "Send crypto") && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setMessage(
                    (menu === "Receive crypto"
                      ? state.tradeDemo(symbol, Number(amount), false)
                      : state.transferCrypto(
                          symbol,
                          Number(amount),
                          recipient,
                        )) || "Completed",
                  );
                }}
              >
                <label>
                  Token
                  <select
                    aria-label="Crypto token"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                  >
                    {assets.map((a) => (
                      <option key={a.symbol}>{a.symbol}</option>
                    ))}
                  </select>
                </label>
                <p>Available: {money(state.demoHoldings[symbol] || 0)}</p>
                {menu === "Send crypto" ? (
                  <label>
                    Recipient
                    <select
                      aria-label="Crypto recipient"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                    >
                      {state.contacts.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <>
                    <div className="profile-share-card">
                      demo:{symbol.toLowerCase()}:mihai
                    </div>
                    <p>
                      Fund this simulated holding from Personal RON. The sample
                      address cannot receive blockchain transfers.
                    </p>
                  </>
                )}
                <label>
                  Value in RON
                  <input
                    aria-label="Crypto transfer amount"
                    type="number"
                    min=".01"
                    step=".01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </label>
                <button className="presentation-primary">
                  {menu === "Receive crypto" ? "Add from Personal" : "Send"}
                </button>
              </form>
            )}
            {menu === "More" &&
              [
                "Trade crypto",
                "Swap crypto",
                "Crypto analytics",
                "Crypto transactions",
                "Earn crypto",
              ].map((page) => (
                <button
                  className="profile-detail-row"
                  key={page}
                  onClick={() => open(page)}
                >
                  {page}
                  <OfficialIcon name="chevron-right" />
                </button>
              ))}
            {menu === "Swap crypto" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setMessage(
                    state.swapHoldings(symbol, swapTo, Number(amount)) ||
                      "Swap completed",
                  );
                }}
              >
                <label>
                  From
                  <select
                    aria-label="Swap from"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                  >
                    {assets.map((a) => (
                      <option key={a.symbol}>{a.symbol}</option>
                    ))}
                  </select>
                </label>
                <p>Available: {money(state.demoHoldings[symbol] || 0)}</p>
                <label>
                  To
                  <select
                    aria-label="Swap to"
                    value={swapTo}
                    onChange={(e) => setSwapTo(e.target.value)}
                  >
                    {assets.map((a) => (
                      <option key={a.symbol}>{a.symbol}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Value in RON
                  <input
                    type="number"
                    min=".01"
                    step=".01"
                    aria-label="Swap amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </label>
                <button className="presentation-primary">Swap</button>
              </form>
            )}
            {menu === "Crypto analytics" && (
              <>
                <h2>{money(total)}</h2>
                <div className="asset-list">
                  {assets.map((a) => (
                    <button
                      key={a.symbol}
                      onClick={() => state.openTrade(a.symbol, true)}
                    >
                      <Token symbol={a.symbol} />
                      <span>{a.name}</span>
                      <span>{money(state.demoHoldings[a.symbol] || 0)}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            {menu === "Crypto transactions" &&
              activity.map((tx) => (
                <button
                  key={tx.id}
                  className="profile-detail-row"
                  onClick={() => {
                    setActivity(tx);
                    open("Crypto transaction");
                  }}
                >
                  <span>
                    {tx.title}
                    <small>
                      {tx.units.toFixed(8)} {tx.asset}
                    </small>
                  </span>
                  <span>{money(tx.value)}</span>
                </button>
              ))}
            {menu === "Crypto transaction" && selectedActivity && (
              <>
                <Token symbol={selectedActivity.asset} />
                <h2>
                  {selectedActivity.units.toFixed(8)} {selectedActivity.asset}
                </h2>
                <div className="profile-detail-row">
                  {selectedActivity.title}
                </div>
                <div className="profile-detail-row">Completed</div>
                <div className="profile-detail-row">
                  {money(selectedActivity.value)}
                </div>
                <p>
                  {new Date(selectedActivity.timestamp).toLocaleString("en-GB")}
                </p>
              </>
            )}
            {menu === "Earn crypto" && (
              <>
                <p>
                  Explore the sample earning feature. The reference APY is
                  illustrative and no yield is paid by this prototype.
                </p>
                <button
                  className="presentation-primary"
                  onClick={() => {
                    open("Trade crypto");
                  }}
                >
                  Choose a token
                </button>
              </>
            )}
            {message && <p role="status">{message}</p>}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
