"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, X } from "@/components/ui/OfficialIcons";
import { Currency } from "@/types";
import { useRevolutStore } from "@/store/useRevolutStore";
import { ApplePayLogo } from "@/components/ui/AppleLogo";
import { CardPreview } from "@/components/cards/CardPreview";
import { formatCurrencyAmount } from "@/utils/formatters";
import { FaceIdIsland } from "@/components/ui/FaceIdIsland";

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
    !!selected &&
    !selected.archived &&
    !selected.isFrozen &&
    selected.onlineEnabled !== false;
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
    if (!isOpen || phase !== "done") return;
    const timer = window.setTimeout(
      () => {
        const card = useRevolutStore
          .getState()
          .cards.find((c) => c.id === confirmedId.current);
        if (
          !card ||
          card.archived ||
          card.isFrozen ||
          card.onlineEnabled === false
        ) {
          setError("Choose an active card with online payments enabled.");
          setPhase("ready");
          return;
        }
        success.current(card.id);
      },
      700,
    );
    return () => window.clearTimeout(timer);
  }, [isOpen, phase]);
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, pointerEvents: "none" }}
          className="absolute inset-0 z-[80] bg-black/65 flex items-end p-[2cqw]"
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label="Apple Pay confirmation"
            initial={{ y: "-25%", clipPath: "inset(0% 34% 92% 34% round 48px)", opacity: 0.4 }}
            animate={{ y: 0, clipPath: "inset(0% 0% 0% 0% round 40px)", opacity: 1 }}
            exit={{ y: "-25%", clipPath: "inset(0% 34% 92% 34% round 48px)", opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 340,
              damping: 36,
              mass: 0.9,
            }}
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
              <AnimatePresence initial={false}>
                {selected && (
                  <motion.div
                    key={selected.id}
                    className="apple-selected-card"
                    initial={{ y: -120, scale: 0.65, opacity: 0 }}
                    animate={{ y: 0, scale: 1, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28, delay: 0.12 }}
                  >
                    <CardPreview card={selected} details />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              className="reference-other-cards"
              disabled={phase !== "ready"}
              onClick={() => setOptions(!options)}
            >
              Other Cards & Payment Options
            </button>
            <AnimatePresence>
              {options && (
                <motion.div
                  className="apple-options-layer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, pointerEvents: "none" }}
                >
                  <button
                    className="apple-options-dismiss"
                    aria-label="Close card choices"
                    onClick={() => setOptions(false)}
                  />
                  <motion.section
                    className="reference-apple-options"
                    role="dialog"
                    aria-label="Choose payment card"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", stiffness: 340, damping: 36 }}
                  >
                    <header>
                      <h3>Payment cards</h3>
                      <button
                        aria-label="Close payment cards"
                        onClick={() => setOptions(false)}
                      >
                        <X />
                      </button>
                    </header>
                    {cards
                      .filter((card) => !card.archived)
                      .map((card) => (
                        <button
                          key={card.id}
                          disabled={
                            card.isFrozen || card.onlineEnabled === false
                          }
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
                  </motion.section>
                </motion.div>
              )}
            </AnimatePresence>
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
              <div className="apple-confirm-slot">
                <AnimatePresence initial={false}>
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
                      Confirming with Face ID…
                    </motion.span>
                  ) : (
                    <motion.button
                      key="ready"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      disabled={!available || options}
                      onClick={() => {
                        confirmedId.current = selected!.id;
                        setPhase("processing");
                      }}
                    >
                      <svg
                        className="apple-side-button"
                        viewBox="0 0 48 48"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle
                          cx="24"
                          cy="24"
                          r="21"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M17 6h9q5 0 5 5v27q0 4-5 4h-9 M12 10h9q3 0 3 3v24q0 3-3 3h-9 M39 23H28m6-6-6 6 6 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Confirm with Side Button</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.section>
          {phase === "processing" && (
            <FaceIdIsland onComplete={() => {
              const card = useRevolutStore.getState().cards.find((c) => c.id === confirmedId.current);
              if (!card || card.archived || card.isFrozen || card.onlineEnabled === false) {
                setError("Choose an active card with online payments enabled.");
                setPhase("ready");
              } else setPhase("done");
            }} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
