"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, Loader2, X } from "@/components/ui/OfficialIcons";
import { Currency } from "@/types";
import { useRevolutStore } from "@/store/useRevolutStore";
import { ApplePayLogo } from "@/components/ui/AppleLogo";
import { CardPreview } from "@/components/cards/CardPreview";
import { formatCurrencyAmount } from "@/utils/formatters";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  currency: Currency;
  onSuccess: (cardId: string) => void;
}
export function ApplePaySheet({
  isOpen,
  onClose,
  amount,
  currency,
  onSuccess,
}: Props) {
  const cards = useRevolutStore((state) => state.cards);
  const selectedId = useRevolutStore((state) => state.topUpCardId);
  const setSelectedId = useRevolutStore((state) => state.setTopUpCard);
  const [options, setOptions] = useState(false);
  const [phase, setPhase] = useState<"ready" | "processing" | "done">("ready");
  const success = useRef(onSuccess);
  success.current = onSuccess;
  const selected = cards.find((card) => card.id === selectedId);
  const available =
    !!selected && !selected.isFrozen && selected.onlineEnabled !== false;
  const otherCards = cards.filter((card) => card.id !== selectedId);
  const confirmedId = useRef<string | null>(null);
  const [error, setError] = useState("");
  const formatted = formatCurrencyAmount(amount, currency, {
    useFormalCode: true,
  });
  useEffect(() => {
    if (!isOpen) {
      setPhase("ready");
      setOptions(false);
      setError("");
      confirmedId.current = null;
    }
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen || phase === "ready") return;
    const timer = window.setTimeout(
      () => {
        const card = useRevolutStore
          .getState()
          .cards.find((c) => c.id === confirmedId.current);
        if (!card || card.isFrozen || card.onlineEnabled === false) {
          setError("Choose an active card with online payments enabled.");
          setPhase("ready");
          return;
        }
        if (phase === "processing") setPhase("done");
        else success.current(card.id);
      },
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
              {otherCards.slice(0, 2).map((card, index) => (
                <div
                  key={card.id}
                  className={`apple-back-card ${index ? "right" : "left"}`}
                >
                  <CardPreview card={card} details />
                </div>
              ))}
              {selected && <CardPreview card={selected} details />}
            </div>
            <button
              className="reference-other-cards"
              disabled={phase !== "ready"}
              onClick={() => setOptions(!options)}
            >
              Other Cards & Payment Options
            </button>
            {options && (
              <div className="reference-apple-options">
                {cards.map((card) => (
                  <button
                    key={card.id}
                    disabled={card.isFrozen || card.onlineEnabled === false}
                    aria-pressed={card.id === selectedId}
                    onClick={() => {
                      setSelectedId(card.id);
                      setOptions(false);
                      setError("");
                    }}
                  >
                    <CardPreview card={card} />
                    <span>
                      {card.name} ··{card.last4}
                      <small>
                        {card.isFrozen
                          ? "Card is frozen"
                          : card.onlineEnabled === false
                            ? "Online payments disabled"
                            : card.scheme === "visa"
                              ? "Visa"
                              : "Mastercard"}
                      </small>
                    </span>
                  </button>
                ))}
              </div>
            )}
            <button
              className="reference-apple-method"
              disabled={phase !== "ready"}
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
              {error && <p role="alert">{error}</p>}
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
                    disabled={!available}
                    onClick={() => {
                      confirmedId.current = selected!.id;
                      setPhase("processing");
                    }}
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
