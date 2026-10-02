"use client";
import { useState } from "react";
import { AppHeader } from "@/components/home/AppHeader";
import { OfficialIcon } from "@/components/ui/ReferenceIcons";
import { LightRays } from "@/components/ui/LightRays";
import { useRevolutStore } from "@/store/useRevolutStore";
import { demoAssets } from "@/data/assets";
import { formatCurrencyAmount } from "@/utils/formatters";
import { BrandIcon } from "@/components/ui/BrandIcon";
const popular = [
  ["NVDA", "1,27"],
  ["AAPL", "-2,09"],
  ["SPCX", "2,39"],
  ["AMZN", "0,07"],
  ["TSLA", "-1,44"],
  ["TTWO", "0,00"],
  ["MSFT", "-0,51"],
  ["ONON", "-1,17"],
];
export function InvestScreen() {
  const state = useRevolutStore();
  const [etfs, setEtfs] = useState(false);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState(false);
  const total = demoAssets
    .filter((a) => a.kind === "invest")
    .reduce((sum, a) => sum + (state.demoHoldings[a.symbol] || 0), 0);
  return (
    <section className="reference-invest-screen no-scrollbar">
      <LightRays theme="invest" />
      <AppHeader
        invest
        onSearch={() => setSearch((v) => !v)}
        onAnalytics={() => state.setHomeTool("analytics")}
      />
      <div className="reference-product-content">
        <div className="reference-product-hero">
          <h1>
            {total ? formatCurrencyAmount(total, "RON") : "Grow your wealth"}
          </h1>
          <p>{total ? "Your investments" : "Invest today, from €1"}</p>
        </div>
        <button
          className="reference-product-cta glass-control"
          onClick={() => state.openTrade("NVDA")}
        >
          Start investing
        </button>
        <section className="reference-product-features">
          {[
            [
              "coins",
              "Invest in the brands you love",
              "Choose from 4,000+ stocks",
            ],
            [
              "percent",
              "Save on trading fees",
              "0% commission trading i.e. no order execution fees within your plan limits. Other fees e.g. FX fees may apply",
            ],
            [
              "lightbulb",
              "Investing made simple",
              "From automated strategies to recurring buys, we'll help you invest at your own pace",
            ],
          ].map(([icon, title, desc]) => (
            <button key={title} onClick={() => state.openTrade("NVDA")}>
              <i>
                <OfficialIcon name={icon} />
              </i>
              <span>
                <strong>{title}</strong>
                <small>{desc}</small>
              </span>
            </button>
          ))}
        </section>
        {search && (
          <input
            className="invest-search"
            autoFocus
            aria-label="Search investments"
            placeholder="Search stocks and ETFs"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        )}
        <section className="invest-market-panel">
          <h2>
            Popular first time buys <OfficialIcon name="chevron-right" />
          </h2>
          <div className="reference-segment">
            <button aria-pressed={!etfs} onClick={() => setEtfs(false)}>
              Stocks
            </button>
            <button aria-pressed={etfs} onClick={() => setEtfs(true)}>
              ETFs
            </button>
          </div>
          <div className="invest-popular">
            {(etfs
              ? [
                  ["EXI2", "0,92"],
                  ["VWCE", "0,47"],
                  ["VUSA", "0,63"],
                  ["SXR8", "0,63"],
                ]
              : popular
            )
              .filter(([s]) => s.toLowerCase().includes(query.toLowerCase()))
              .map(([symbol, change]) => (
                <button key={symbol} onClick={() => state.openTrade(symbol)}>
                  <BrandIcon brand={symbol} />
                  <span>{symbol}</span>
                  <small
                    className={change.startsWith("-") ? "negative" : "positive"}
                  >
                    {change.startsWith("-") ? "▼" : "▲"}{" "}
                    {change.replace("-", "")}%
                  </small>
                </button>
              ))}
          </div>
        </section>
        <section className="invest-market-panel">
          <h2>
            Watchlist <OfficialIcon name="chevron-right" />
          </h2>
          {[
            { symbol: "NVDA", name: "NVIDIA", desc: "NVDA · GPU Developer" },
            {
              symbol: "EXI2",
              name: "iShares Dow Jones Global Titans 50 ETF",
              desc: "EXI2 · Global multinationals",
            },
          ].map((item) => (
            <button
              className="invest-watch-row"
              key={item.symbol}
              onClick={() => state.openTrade(item.symbol)}
            >
              <BrandIcon brand={item.symbol} />
              <span>
                <strong>{item.name}</strong>
                <small>{item.desc}</small>
              </span>
              <span>
                <strong>
                  {formatCurrencyAmount(
                    demoAssets.find((a) => a.symbol === item.symbol)?.price ||
                      0,
                    "RON",
                  )}
                </strong>
                <small className="positive">
                  ▲ {item.symbol === "NVDA" ? "1,27" : "0,92"}%
                </small>
              </span>
            </button>
          ))}
        </section>
        {total > 0 && (
          <section className="invest-market-panel">
            <h2>Your holdings</h2>
            {demoAssets
              .filter(
                (a) => a.kind === "invest" && state.demoHoldings[a.symbol],
              )
              .map((a) => (
                <button
                  className="invest-watch-row"
                  key={a.symbol}
                  onClick={() => state.openTrade(a.symbol, true)}
                >
                  <BrandIcon brand={a.symbol} />
                  <span>{a.name}</span>
                  <strong>
                    {formatCurrencyAmount(state.demoHoldings[a.symbol], "RON")}
                  </strong>
                </button>
              ))}
          </section>
        )}
        <section className="invest-market-panel">
          <h2>
            Products <OfficialIcon name="chevron-right" />
          </h2>
          <div className="invest-products">
            {[
              ["line-chart", "Stocks", "NVDA"],
              ["performance", "ETFs", "EXI2"],
              ["percent", "Funds", "SAVINGS"],
              ["bank", "Bonds", "BONDS"],
            ].map(([icon, label, symbol]) => (
              <button key={label} onClick={() => state.openTrade(symbol)}>
                <i>
                  <OfficialIcon name={icon} />
                </i>
                {label}
              </button>
            ))}
          </div>
        </section>
        <p className="product-smallprint">
          Sample market quotes for the prototype. Holdings and account activity
          use your saved balance.
        </p>
      </div>
    </section>
  );
}
