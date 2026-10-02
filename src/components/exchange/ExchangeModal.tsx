"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRevolutStore } from "@/store/useRevolutStore";
import { Currency } from "@/types";
import { OfficialIcon } from "@/components/ui/ReferenceIcons";
import { exchangeRate, roundMoney } from "@/utils/finance";
import { formatCurrencyAmount } from "@/utils/formatters";
import { useClosingScreen } from "@/components/ui/useClosingScreen";
const currencies: Currency[] = ["RON", "EUR", "USD", "GBP"];
export const ExchangeModal = () => {
  const state = useRevolutStore();
  const closing = useClosingScreen(() => state.setExchangeOpen(false));
  const [from, setFrom] = useState<Currency>("EUR");
  const [to, setTo] = useState<Currency>("RON");
  const [amount, setAmount] = useState("0");
  const [note, setNote] = useState("");
  const [phase, setPhase] = useState<"entry" | "review" | "done">("entry");
  const [error, setError] = useState("");
  useEffect(() => {
    if (state.isExchangeOpen) {
      setAmount("0");
      setPhase("entry");
      setError("");
      setNote("");
    }
  }, [state.isExchangeOpen]);
  if (!state.isExchangeOpen) return null;
  const value = Number(amount.replace(",", "."));
  const rate = exchangeRate(state.rates, from, to);
  const received = roundMoney(value * rate);
  const valid =
    value > 0 &&
    value <= state.accounts[from].balance &&
    received > 0 &&
    from !== to;
  const changeCurrency = (side: "from" | "to", currency: Currency) => {
    if (side === "from") {
      if (currency === to) setTo(from);
      setFrom(currency);
    } else {
      if (currency === from) setFrom(to);
      setTo(currency);
    }
    setError("");
  };
  const digit = (key: string) =>
    setAmount((old) =>
      key === ","
        ? old.includes(",")
          ? old
          : old + ","
        : old.length >= 11 ||
            (old.includes(",") && old.split(",")[1].length >= 2)
          ? old
          : old === "0"
            ? key
            : old + key,
    );
  return (
    <motion.section
      {...closing.props}
      onAnimationComplete={closing.finish}
      initial={{ x: "100%" }}
      animate={{ x: closing.closing ? "100%" : 0 }}
      transition={{ type: "spring", damping: 34, stiffness: 340 }}
      className="move-screen"
      role="dialog"
      aria-modal="true"
      aria-label="Move money"
    >
      <header>
        <button
          className="reference-back"
          aria-label="Back from move money"
          onClick={() =>
            phase === "review"
              ? setPhase("entry")
              : closing.close()
          }
        >
          <OfficialIcon name="back-button-arrow" />
        </button>
        <div>
          <h1>{phase === "review" ? "Review order" : "Move money"}</h1>
          <p>
            <OfficialIcon name="arrow-rates" />1 {state.accounts[from].symbol} ={" "}
            {rate.toLocaleString("ro-RO", { maximumFractionDigits: 4 })}{" "}
            {state.accounts[to].symbol}
          </p>
        </div>
      </header>
      {phase === "done" ? (
        <motion.div initial={{ opacity: 0, scale: 0.94, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="move-success">
          <OfficialIcon name="check-success" />
          <h2>Money moved</h2>
          <p>
            {formatCurrencyAmount(value, from)} →{" "}
            {formatCurrencyAmount(received, to)}
          </p>
          <button
            className="presentation-primary"
            onClick={closing.close}
          >
            Done
          </button>
        </motion.div>
      ) : (
        <>
          <div className="move-body no-scrollbar">
            <div className="move-accounts">
              {(["from", "to"] as const).map((side) => {
                const currency = side === "from" ? from : to;
                return (
                  <div key={side}>
                    <label>
                      <span className={`currency-flag flag-${currency}`}>
                        {currency === "EUR"
                          ? "✦"
                          : currency === "RON"
                            ? ""
                            : currency === "USD"
                              ? "$"
                              : "£"}
                      </span>
                      <select
                        aria-label={
                          side === "from"
                            ? "Move from currency"
                            : "Move to currency"
                        }
                        value={currency}
                        disabled={phase !== "entry"}
                        onChange={(e) =>
                          changeCurrency(side, e.target.value as Currency)
                        }
                      >
                        {currencies.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </label>
                    <strong>
                      {side === "from" ? "−" : "+"}
                      {side === "from"
                        ? amount
                        : received.toLocaleString("ro-RO", {
                            maximumFractionDigits: 2,
                          })}{" "}
                      {state.accounts[currency].symbol}
                    </strong>
                    <small>
                      Balance:{" "}
                      {formatCurrencyAmount(
                        state.accounts[currency].balance,
                        currency,
                      )}
                    </small>
                  </div>
                );
              })}
              <button
                className="move-swap"
                aria-label="Swap currencies"
                disabled={phase !== "entry"}
                onClick={() => {
                  setFrom(to);
                  setTo(from);
                }}
              >
                <OfficialIcon name="arrow-down" />
              </button>
            </div>
            <input
              className="move-note"
              aria-label="Exchange note"
              placeholder="Add note"
              value={note}
              readOnly={phase !== "entry"}
              onChange={(e) => setNote(e.target.value)}
            />
            {phase === "review" && (
              <div className="move-review">
                <p>
                  <span>Fees</span>
                  <strong>No fees</strong>
                </p>
                <p>
                  <span>You receive</span>
                  <strong>{formatCurrencyAmount(received, to)}</strong>
                </p>
                {note && <p>{note}</p>}
              </div>
            )}
            {error && (
              <p className="negative" role="alert">
                {error}
              </p>
            )}
            {value > state.accounts[from].balance && (
              <p className="negative">Insufficient {from} balance</p>
            )}
          </div>
          <div className="move-bottom">
            <div className="move-submit">
              <button
                aria-label="Exchange information"
                onClick={() =>
                  state.notify(
                    "Move money",
                    "The displayed exchange rate is a fixed rate for this prototype.",
                  )
                }
              >
                <OfficialIcon name="arrow-exchange" />
              </button>
              <button
                disabled={!valid}
                onClick={() => {
                  if (phase === "entry") setPhase("review");
                  else {
                    const result = state.exchangeCurrency(
                      from,
                      to,
                      value,
                      received,
                    );
                    if (result.success) setPhase("done");
                    else setError(result.error || "Unable to move money");
                  }
                }}
              >
                {phase === "review" ? "Confirm exchange" : "Review order"}
              </button>
            </div>
            {phase === "entry" && (
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="move-keyboard"
              >
                <div className="move-suggestions">
                  {[10, 20, 50, 100].map((v) => (
                    <button
                      className="glass-control"
                      key={v}
                      onClick={() => setAmount(String(v))}
                    >
                      {v} {state.accounts[from].symbol}
                    </button>
                  ))}
                </div>
                <div className="move-digits">
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
                    ",",
                    "0",
                    "delete",
                  ].map((key) => (
                    <motion.button
                      whileTap={{ scale: 0.86 }}
                      key={key}
                      aria-label={
                        key === "delete" ? "Delete amount digit" : key
                      }
                      onClick={() =>
                        key === "delete"
                          ? setAmount((old) => old.slice(0, -1) || "0")
                          : digit(key)
                      }
                    >
                      {key === "delete" ? (
                        <OfficialIcon name="arrow-backspace" />
                      ) : (
                        key
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </>
      )}
    </motion.section>
  );
};
