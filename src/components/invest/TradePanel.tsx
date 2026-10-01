"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRevolutStore } from "@/store/useRevolutStore";
import { demoAssets } from "@/data/assets";
import { AnimatedAmount } from "@/components/ui/AnimatedAmount";
import { OfficialIcon } from "@/components/ui/ReferenceIcons";
import { formatCurrencyAmount } from "@/utils/formatters";
import { useClosingScreen } from "@/components/ui/useClosingScreen";

export function TradePanel({ kind }: { kind: "invest" | "crypto" }) {
  const state = useRevolutStore();
  const transition = useClosingScreen(() => state.setUiPanel(null));
  const assets = demoAssets.filter((item) => item.kind === kind);
  const [symbol, setSymbol] = useState(
    assets.find((item) => item.symbol === state.tradeTicket.asset)?.symbol ||
      assets[0].symbol,
  );
  const [sell, setSell] = useState(state.tradeTicket.sell);
  const [input, setInput] = useState("0");
  const [review, setReview] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const selected = assets.find((item) => item.symbol === symbol)!;
  const amount = Number(input);
  const available = sell
    ? state.demoHoldings[symbol] || 0
    : state.accounts.RON.balance;
  const valid =
    Number.isFinite(amount) && amount >= 0.01 && amount <= available;
  const digit = (value: string) => {
    setError("");
    if (value === "delete")
      setInput(input.length > 1 ? input.slice(0, -1) : "0");
    else if (value === ".") {
      if (!input.includes(".")) setInput(input + ".");
    } else if (input === "0") setInput(value);
    else if (
      input.length < 10 &&
      (!input.includes(".") || input.split(".")[1].length < 2)
    )
      setInput(input + value);
  };
  return (
    <motion.section
      {...transition.props}
      onAnimationComplete={transition.finish}
      role="dialog"
      aria-modal="true"
      aria-label={kind === "invest" ? "Investment order" : "Crypto order"}
      className="trade-screen"
      initial={{ x: "100%" }}
      animate={{ x: transition.closing ? "100%" : 0 }}
      transition={{ type: "spring", stiffness: 340, damping: 34 }}
    >
      <header className="transfer-header">
        <button
          className="reference-back"
          aria-label="Close order"
          onClick={() =>
            review && !done ? setReview(false) : transition.close()
          }
        >
          <OfficialIcon name="back-button-arrow" />
        </button>
        <div>
          <h1>
            {done
              ? "Order completed"
              : review
                ? "Review order"
                : `${sell ? "Sell" : "Buy"} ${selected.name}`}
          </h1>
          <p>{symbol}</p>
        </div>
        <span className="transfer-header-spacer" />
      </header>
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="done"
            className="trade-done"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <OfficialIcon name="check-success" />
            <h2>
              {sell ? "Sold" : "Bought"} {formatCurrencyAmount(amount, "RON")}{" "}
              of {symbol}
            </h2>
            <button
              className="presentation-primary"
              onClick={() => transition.close()}
            >
              Done
            </button>
          </motion.div>
        ) : review ? (
          <motion.div
            key="review"
            className="trade-review"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2>
              <AnimatedAmount value={formatCurrencyAmount(amount, "RON")} />
            </h2>
            <div>
              <p>
                Asset
                <strong>
                  {selected.name} · {symbol}
                </strong>
              </p>
              <p>
                Order type<strong>Market</strong>
              </p>
              <p>
                Fixed demo price
                <strong>{formatCurrencyAmount(selected.price, "RON")}</strong>
              </p>
              <p>
                Approximate units
                <strong>{(amount / selected.price).toFixed(6)}</strong>
              </p>
              <p>
                Fees<strong>0 lei</strong>
              </p>
              <p>
                Your total<strong>{formatCurrencyAmount(amount, "RON")}</strong>
              </p>
            </div>
            <small>
              This order uses fictional holdings and a fixed demonstration
              price.
            </small>
            {error && <p role="alert">{error}</p>}
            <button
              className="presentation-primary"
              onClick={() => {
                const result = state.tradeDemo(symbol, amount, sell);
                if (result) setError(result);
                else setDone(true);
              }}
            >
              Submit order
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="amount"
            className="trade-entry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="asset-view glass-control">
              <button
                className={!sell ? "selected" : ""}
                onClick={() => setSell(false)}
              >
                Buy
              </button>
              <button
                className={sell ? "selected" : ""}
                onClick={() => setSell(true)}
              >
                Sell
              </button>
            </div>
            <label>
              Asset
              <select
                aria-label="Order asset"
                value={symbol}
                onChange={(event) =>
                  setSymbol(event.target.value as typeof symbol)
                }
              >
                {assets.map((item) => (
                  <option key={item.symbol} value={item.symbol}>
                    {item.name} · {item.symbol}
                  </option>
                ))}
              </select>
            </label>
            <div className="trade-entry-amount">
              <AnimatedAmount
                value={input.replace(".", ",")}
                cursor
                placeholder
              />{" "}
              lei
            </div>
            <p>Available: {formatCurrencyAmount(available, "RON")}</p>
            {amount > available && (
              <p role="alert">Insufficient {sell ? "holding" : "balance"}</p>
            )}
            {error && <p role="alert">{error}</p>}
            <button
              className="presentation-primary"
              disabled={!valid}
              onClick={() => {
                setError("");
                setReview(true);
              }}
            >
              Review order
            </button>
            <div className="transfer-keypad">
              {[
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                ".",
                "0",
                "delete",
              ].map((value) => (
                <motion.button
                  key={value}
                  whileTap={{ scale: 0.9 }}
                  aria-label={
                    value === "delete"
                      ? "Delete digit"
                      : value === "."
                        ? "Decimal point"
                        : value
                  }
                  onClick={() => digit(value)}
                >
                  {value === "delete" ? (
                    <OfficialIcon name="arrow-backspace" />
                  ) : value === "." ? (
                    ","
                  ) : (
                    value
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
