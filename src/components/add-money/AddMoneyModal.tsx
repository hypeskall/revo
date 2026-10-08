"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronDown,
  Delete,
  X,
} from "@/components/ui/OfficialIcons";
import { useRevolutStore } from "@/store/useRevolutStore";
import { formatCurrencyAmount } from "@/utils/formatters";
import { ApplePayLogo } from "@/components/ui/AppleLogo";
import { ApplePaySheet } from "./ApplePaySheet";
import { AnimatedAmount } from "@/components/ui/AnimatedAmount";
import { useClosingScreen } from "@/components/ui/useClosingScreen";
import { useSheetGesture } from "@/components/ui/useSheetGesture";
import { CardPreview } from "@/components/cards/CardPreview";

export function AddMoneyModal() {
  const state = useRevolutStore();
  const transition = useClosingScreen(() => state.setAddMoneyOpen(false));
  const gesture = useSheetGesture(transition.close);
  const [input, setInput] = useState("610");
  const [appleOpen, setAppleOpen] = useState(false);
  const [methodsOpen, setMethodsOpen] = useState(false);
  const [method, setMethod] = useState("Apple Pay");
  const [operator, setOperator] = useState<string | null>(null);
  const [operand, setOperand] = useState<number | null>(null);
  const [replace, setReplace] = useState(false);
  const [error, setError] = useState("");
  const overlayOpen = appleOpen || methodsOpen;
  const backgroundRef = (node: HTMLElement | null) => {
    if (node) node.inert = overlayOpen;
  };
  const amount = Number(input.replace(",", "."));
  const digit = (value: string) => {
    setError("");
    if (value === ".") {
      if (!input.includes(".")) setInput(input + ".");
      return;
    }
    if (replace || input === "0") {
      setInput(value);
      setReplace(false);
    } else if (
      input.length < 12 &&
      (!input.includes(".") || input.split(".")[1].length < 2)
    )
      setInput(input + value);
  };
  const calculate = (next: string) => {
    let result = amount;
    if (operator && operand !== null) {
      result =
        operator === "+"
          ? operand + amount
          : operator === "−"
            ? operand - amount
            : operator === "×"
              ? operand * amount
              : operand / amount;
    }
    if (!Number.isFinite(result) || result < 0 || result > 999999999) {
      setError("Enter a valid amount");
      return;
    }
    setInput(String(Math.round(result * 100) / 100));
    setOperand(next === "=" ? null : result);
    setOperator(next === "=" ? null : next);
    setReplace(true);
  };
  useEffect(() => {
    if (state.isAddMoneyOpen) {
      const blood = useRevolutStore
        .getState()
        .cards.find((card) => card.id === "card-blood" && !card.archived);
      if (blood) useRevolutStore.getState().setTopUpCard(blood.id);
      setAppleOpen(false);
      setMethodsOpen(false);
      setError("");
    }
  }, [state.isAddMoneyOpen]);
  useEffect(() => {
    if (!state.isAddMoneyOpen || appleOpen || methodsOpen || transition.closing)
      return;
    const handle = (event: KeyboardEvent) => {
      if (/^[0-9]$/.test(event.key)) {
        event.preventDefault();
        digit(event.key);
      } else if (event.key === "." || event.key === ",") {
        event.preventDefault();
        digit(".");
      } else if (event.key === "Backspace") {
        event.preventDefault();
        setInput((value) => (value.length > 1 ? value.slice(0, -1) : "0"));
      } else if (event.key === "Escape") transition.close();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  });
  return (
    <motion.section
      {...transition.props}
      {...gesture.props}
      onAnimationComplete={transition.finish}
      initial={{ y: "100%" }}
      animate={{ y: transition.closing ? "100%" : 0 }}
      transition={{ type: "spring", stiffness: 340, damping: 34 }}
      role="dialog"
      aria-modal="true"
      aria-label="Add money"
      className="reference-add-money"
    >
      {!overlayOpen && <div {...gesture.handle} className="screen-sheet-grab" aria-hidden="true" />}
      <header aria-hidden={overlayOpen} ref={backgroundRef}>
        <button
          className="reference-back"
          aria-label="Close add money"
          onClick={() => transition.close()}
        >
          <ArrowLeft />
        </button>
        <div>
          <h1>Add money</h1>
          <p>
            Balance:{" "}
            {formatCurrencyAmount(
              state.accounts[state.activeCurrency].balance,
              state.activeCurrency,
            )}
          </p>
        </div>
        <span />
      </header>
      <div
        className="reference-topup-main"
        aria-hidden={overlayOpen}
        ref={backgroundRef}
      >
        <div className="reference-topup-amount">
          <AnimatedAmount
            value={
              state.activeCurrency === "RON" ? input.replace(".", ",") : input
            }
            cursor
            placeholder
          />
          <span>{state.accounts[state.activeCurrency].symbol}</span>
        </div>
        <button
          className="reference-method"
          onClick={() => setMethodsOpen(true)}
        >
          {method === "Apple Pay" && (
            <img
              className="apple-pay-mark"
              src="/apple-pay-mark.svg"
              alt="Apple Pay"
            />
          )}
          <span>
            {method} · {state.activeCurrency}
          </span>
          <ChevronDown />
        </button>
        <div className="reference-arrival">
          <p>
            {error || (
              <>
                Arriving <span>· Usually instantly</span>
              </>
            )}
          </p>
          <button
            className="reference-pay"
            aria-label={
              method === "Apple Pay"
                ? "Pay with Apple Pay"
                : "Add money with card"
            }
            disabled={!Number.isFinite(amount) || amount <= 0}
            onClick={() => setAppleOpen(true)}
          >
            {method === "Apple Pay" ? (
              <ApplePayLogo variant="black" />
            ) : (
              "Add money"
            )}
          </button>
        </div>
      </div>
      <div
        className="reference-keypad"
        aria-hidden={overlayOpen}
        ref={backgroundRef}
      >
        <div className="reference-operators">
          {["+", "−", "×", "÷", "="].map((op) => (
            <button
              key={op}
              aria-label={`Calculate ${op}`}
              onClick={() => calculate(op)}
              className={operator === op ? "active" : ""}
            >
              {op}
            </button>
          ))}
        </div>
        <div className="reference-digits">
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
              whileTap={{ scale: 0.9 }}
              aria-label={
                value === "delete"
                  ? "Delete digit"
                  : value === "."
                    ? "Decimal point"
                    : value
              }
              key={value}
              onClick={() =>
                value === "delete"
                  ? setInput(input.length > 1 ? input.slice(0, -1) : "0")
                  : digit(value)
              }
            >
              {value === "delete" ? <Delete /> : value === "." ? "," : value}
            </motion.button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {methodsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: "none" }}
            className="absolute inset-0 z-[70] bg-black/70 flex items-end"
          >
            <motion.section
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 36 }}
              role="dialog"
              aria-label="Payment method"
              className="w-full rounded-t-3xl bg-[#202023] p-6"
            >
              <button
                aria-label="Close payment methods"
                className="float-right"
                onClick={() => setMethodsOpen(false)}
              >
                <X />
              </button>
              <h2 className="text-xl mb-6">Add money with</h2>
              {["Apple Pay", "Debit card"].map((option) => (
                <button
                  className="block w-full p-4 rounded-xl bg-white/10 mb-3 text-left"
                  key={option}
                  onClick={() => {
                    setMethod(option);
                    setMethodsOpen(false);
                  }}
                >
                  {option}
                </button>
              ))}
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
      {method === "Apple Pay" ? (
        <ApplePaySheet
          isOpen={appleOpen}
          onClose={() => setAppleOpen(false)}
          amount={amount}
          currency={state.activeCurrency}
          onSuccess={(cardId) => {
            setAppleOpen(false);
            const failure = state.addMoney(
              amount,
              state.activeCurrency,
              method,
              cardId,
            );
            if (failure) setError(failure);
            else transition.close();
          }}
        />
      ) : (
        <AnimatePresence>
          {appleOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, pointerEvents: "none" }}
              className="transfer-choice-backdrop"
            >
              <motion.section
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 340, damping: 36 }}
                className="transfer-choice"
                role="dialog"
                aria-label="Confirm card top-up"
              >
                <h2>Review top-up</h2>
                <p>
                  {formatCurrencyAmount(amount, state.activeCurrency)} · Debit
                  card
                </p>
                <label>
                  Card
                  <select
                    aria-label="Top-up card"
                    value={state.topUpCardId}
                    onChange={(event) => state.setTopUpCard(event.target.value)}
                  >
                    {state.cards
                      .filter((card) => !card.archived)
                      .map((card) => (
                        <option
                          key={card.id}
                          value={card.id}
                          disabled={
                            card.isFrozen || card.onlineEnabled === false
                          }
                        >
                          {card.name} ··{card.last4}
                          {card.isFrozen
                            ? " · Frozen"
                            : card.onlineEnabled === false
                              ? " · Online payments disabled"
                              : ""}
                        </option>
                      ))}
                  </select>
                </label>
                {state.cards.find((c) => c.id === state.topUpCardId) && (
                  <CardPreview
                    card={state.cards.find((c) => c.id === state.topUpCardId)!}
                    details
                  />
                )}
                {error && <p role="alert">{error}</p>}
                <button
                  onClick={() => {
                    const failure = state.addMoney(
                      amount,
                      state.activeCurrency,
                      method,
                      state.topUpCardId,
                    );
                    if (failure) setError(failure);
                    else {
                      setAppleOpen(false);
                      transition.close();
                    }
                  }}
                >
                  Confirm top-up
                </button>
                <button onClick={() => setAppleOpen(false)}>Cancel</button>
              </motion.section>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.section>
  );
}
