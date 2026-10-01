"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, Loader2, X } from "@/components/ui/OfficialIcons";
import { Currency } from "@/types";
import { useRevolutStore } from "@/store/useRevolutStore";
import { ApplePayLogo } from "@/components/ui/AppleLogo";
import { CardPreview } from "@/components/cards/CardPreview";
import { formatCurrencyAmount } from "@/utils/formatters";
import { ReferencePaymentArt } from "./ReferencePaymentArt";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  currency: Currency;
  onSuccess: () => void;
}
export function ApplePaySheet({
  isOpen,
  onClose,
  amount,
  currency,
  onSuccess,
}: Props) {
  const cards = useRevolutStore((state) => state.cards);
  const [selectedId, setSelectedId] = useState("reference-amex");
  const [options, setOptions] = useState(false);
  const [phase, setPhase] = useState<"ready" | "processing" | "done">("ready");
  const success = useRef(onSuccess);
  success.current = onSuccess;
  const selected =
    cards.find((card) => card.id === selectedId) ||
    (selectedId === "reference-amex"
      ? cards.find((card) => card.id === "card-blood" && !card.isFrozen)
      : undefined) ||
    cards.find((card) => !card.isFrozen);
  const formatted = formatCurrencyAmount(amount, currency, {
    useFormalCode: true,
  });
  useEffect(() => {
    if (!isOpen) {
      setPhase("ready");
      setOptions(false);
    }
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen || phase === "ready") return;
    const timer = window.setTimeout(
      () => (phase === "processing" ? setPhase("done") : success.current()),
      phase === "processing" ? 1200 : 700,
    );
    return () => window.clearTimeout(timer);
  }, [isOpen, phase]);
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[80] bg-black/65 flex items-end p-[2cqw]"
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label="Apple Pay confirmation"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="reference-apple-sheet"
          >
            <header>
              <button
                className="reference-back"
                aria-label="Cancel Apple Pay"
                onClick={onClose}
              >
                <X />
              </button>
              <ApplePayLogo variant="white" />
              <span />
            </header>
            <div className="reference-apple-total">
              <p>Pay Revolut</p>
              <h2>{formatted}</h2>
            </div>
            <div className="reference-apple-cards">
              <div
                className={`apple-back-card left ${selectedId === "reference-amex" ? "apple-bmw-card" : ""}`}
              >
                {selectedId === "reference-amex" && (
                  <>
                    <strong>///M</strong>
                    <span>··6326</span>
                  </>
                )}
              </div>
              <div
                className={`apple-back-card right ${selectedId === "reference-amex" ? "apple-pattern-card" : ""}`}
              />
              {selectedId === "reference-amex" ? (
                <ReferencePaymentArt />
              ) : (
                selected && <CardPreview card={selected} details />
              )}
            </div>
            <button
              className="reference-other-cards"
              onClick={() => setOptions(!options)}
            >
              Other Cards & Payment Options
            </button>
            {options && (
              <div className="reference-apple-options">
                <button
                  onClick={() => {
                    setSelectedId("reference-amex");
                    setOptions(false);
                  }}
                >
                  Decorative Amex ··0177
                </button>
                {cards
                  .filter((card) => !card.isFrozen)
                  .map((card) => (
                    <button
                      key={card.id}
                      onClick={() => {
                        setSelectedId(card.id);
                        setOptions(false);
                      }}
                    >
                      {card.name} ··{card.last4}
                    </button>
                  ))}
              </div>
            )}
            <button
              className="reference-apple-method"
              onClick={() => setOptions(!options)}
            >
              <i>
                <CreditCard />
              </i>
              <span>
                <small>
                  Revolut{" "}
                  {selected?.scheme === "mastercard" ? "Mastercard" : "Visa"}
                </small>
                <span>Pay {formatted}</span>
              </span>
            </button>
            <div className="reference-apple-summary">
              <strong>Total</strong>
              <strong>{formatted}</strong>
            </div>
            <div className="reference-apple-confirm">
              <AnimatePresence mode="wait">
                {phase === "done" ? (
                  <motion.span
                    key="done"
                    role="status"
                    initial={{ scale: 0.65, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="apple-result"
                  >
                    <svg viewBox="0 0 48 48" fill="none">
                      <motion.circle
                        cx="24"
                        cy="24"
                        r="21"
                        stroke="currentColor"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.35 }}
                      />
                      <motion.path
                        d="m14 24 7 7 14-15"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.15, duration: 0.3 }}
                      />
                    </svg>
                    Done
                  </motion.span>
                ) : phase === "processing" ? (
                  <motion.span
                    key="processing"
                    role="status"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Loader2 className="animate-spin" />
                    Processing…
                  </motion.span>
                ) : (
                  <motion.button
                    key="ready"
                    exit={{ opacity: 0, scale: 0.9 }}
                    disabled={!selected || selected.isFrozen}
                    onClick={() => setPhase("processing")}
                  >
                    <i>⇥</i>
                    <span>Confirm with Side Button</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
