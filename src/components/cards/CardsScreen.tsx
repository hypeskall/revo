"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { useRevolutStore } from "@/store/useRevolutStore";
import { OfficialIcon } from "@/components/ui/ReferenceIcons";
import { CardPreview } from "./CardPreview";
import { TransactionRow } from "@/components/home/ReferenceActivity";
import { personalTransaction, transactionDate } from "@/utils/finance";
import { BrandIcon } from "@/components/ui/BrandIcon";
export function CardsScreen({
  initialCardId,
  externalHeader = false,
}: {
  initialCardId?: string;
  externalHeader?: boolean;
}) {
  const state = useRevolutStore();
  const cards = state.cards.filter((item) => !item.archived);
  const [selectedId, setSelectedId] = useState(
    initialCardId || state.cards[0]?.id,
  );
  const [details, setDetails] = useState(false);
  const [copied, setCopied] = useState("");
  const [adding, setAdding] = useState(false);
  const [more, setMore] = useState(false);
  const [walletPreview, setWalletPreview] = useState(false);
  const [terminate, setTerminate] = useState(false);
  const carousel = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(390);
  useEffect(() => {
    const element = carousel.current;
    if (!element) return;
    const measure = () => {
      if (element.clientWidth) setWidth(element.clientWidth);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const reduced = useReducedMotion();
  const trackControls = useAnimationControls();
  const card = cards.find((item) => item.id === selectedId) || cards[0];
  const index = cards.findIndex((item) => item.id === card?.id);
  const trackSpring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 320, damping: 34, mass: 0.8 };
  useEffect(() => {
    void trackControls.start({ x: width * (0.0415 - Math.max(0, index) * 0.942), transition: reduced ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 34, mass: 0.8 } });
  }, [index, width, reduced, trackControls]);
  const subscriptionBrands =
    card?.id === "card-blood"
      ? ["Spotify", "AAPL"]
      : card?.id === "card-shirt"
        ? ["YouTube"]
        : [];
  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
    } catch {
      setCopied("Copy unavailable in this browser");
    }
  };
  if (!card) return <p>No cards yet.</p>;
  const select = (next: number) => {
    const target = cards[Math.max(0, Math.min(cards.length - 1, next))];
    setSelectedId(target.id);
    setDetails(false);
    setCopied("");
    setMore(false);
  };
  return (
    <section
      className={`card-detail-content no-scrollbar card-background-${card.theme}`}
    >
      <header>
        {!externalHeader && (
          <button
            className="glass-control"
            aria-label="Help with cards"
            onClick={() => state.setUiPanel("help")}
          >
            <OfficialIcon name="question-outline" />
          </button>
        )}
      </header>
      <div
        data-no-back-swipe
        className="card-carousel"
        ref={carousel}
        role="region"
        aria-label="Choose card"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            select(index + (event.key === "ArrowRight" ? 1 : -1));
          }
        }}
      >
        <motion.div
          className="card-carousel-track"
          initial={false}
          animate={trackControls}
          transition={
            reduced
              ? { duration: 0 }
              : { type: "spring", stiffness: 320, damping: 34, mass: 0.8 }
          }
          drag="x"
          dragConstraints={{
            left: width * (0.0415 - (cards.length - 1) * 0.942),
            right: width * 0.0415,
          }}
          dragElastic={0.12}
          dragMomentum={false}
          onDragEnd={(_, info) => {
            const projected = info.offset.x + info.velocity.x * 0.15;
            const steps = Math.round(-projected / Math.max(1, width * 0.942));
            const next = Math.max(0, Math.min(cards.length - 1, index + (steps || (Math.abs(projected) > width * 0.2 ? (projected < 0 ? 1 : -1) : 0))));
            select(next);
            void trackControls.start({ x: width * (0.0415 - next * 0.942), transition: trackSpring });
          }}
        >
          {cards.map((item, position) => (
            <div
              key={item.id}
              className="card-detail-art"
              aria-hidden={position !== index}
            >
              <CardPreview card={item} details />
              <span className="card-display-name">{item.name}</span>
              <span className="card-display-type">
                {item.type === "physical" ? "Physical" : "Virtual"}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
      <div className="card-carousel-controls">
        <button
          aria-label="Previous card"
          disabled={index === 0}
          onClick={() => select(index - 1)}
        >
          <OfficialIcon name="back-button-arrow" />
        </button>
        <span aria-live="polite">
          {card.name} ··{card.last4}
        </span>
        <button
          aria-label="Next card"
          disabled={index === cards.length - 1}
          onClick={() => select(index + 1)}
        >
          <OfficialIcon name="chevron-right" />
        </button>
      </div>
      <div className="card-bottom-sheet">
        <div
          className={`card-detail-actions ${card.isFrozen ? "frozen-actions" : ""}`}
        >
          {!card.isFrozen && (
            <button onClick={() => setDetails(!details)}>
              <i className="glass-control">
                <OfficialIcon name={details ? "eye-hide" : "eye-show"} />
              </i>
              {details ? "Hide details" : "Show details"}
            </button>
          )}
          <button onClick={() => state.toggleFreezeCard(card.id)}>
            <i className="glass-control">
              <OfficialIcon name="snowflake" />
            </i>
            {card.isFrozen ? "Unfreeze" : "Freeze"}
          </button>
          <button
            onClick={() =>
              card.isFrozen ? setTerminate(true) : setMore(!more)
            }
          >
            <i className="glass-control">
              <OfficialIcon name={card.isFrozen ? "delete" : "more-i-os"} />
            </i>
            {card.isFrozen ? "Terminate" : "More"}
          </button>
        </div>
        {more && (
          <div className="card-settings">
            <label>
              <OfficialIcon name="card-shield" />
              <span>Online transactions</span>
              <input
                type="checkbox"
                checked={card.onlineEnabled !== false}
                onChange={(event) =>
                  state.setCardSetting(
                    card.id,
                    "onlineEnabled",
                    event.target.checked,
                  )
                }
              />
            </label>
            <label>
              <OfficialIcon name="contactless" />
              <span>Contactless payments</span>
              <input
                type="checkbox"
                checked={card.contactlessEnabled !== false}
                onChange={(event) =>
                  state.setCardSetting(
                    card.id,
                    "contactlessEnabled",
                    event.target.checked,
                  )
                }
              />
            </label>
            <button
              className="presentation-primary"
              onClick={() => setAdding(true)}
            >
              Add new card
            </button>
          </div>
        )}
        <AnimatePresence>
          {details && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="card-details-fields"
            >
              {[
                { label: "Card number", value: card.fullNumber },
                { label: "Expiry date", value: card.expiry },
                { label: "CVV", value: card.cvv },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => copy(item.value, item.label)}
                >
                  <span>
                    <small>{item.label}</small>
                    <strong>{item.value}</strong>
                  </span>
                  <OfficialIcon
                    name={copied === item.label ? "check" : "copy"}
                  />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        {copied && (
          <p role="status">
            {copied.includes("unavailable") ? copied : `${copied} copied`}
          </p>
        )}
        {subscriptionBrands.length > 0 && (
          <button
            className="card-subscriptions"
            onClick={() => state.setUiPanel("scheduled")}
          >
            <span>
              {subscriptionBrands.map((brand) =>
                brand === "YouTube" ? (
                  <i key={brand} className="card-youtube-brand">
                    <OfficialIcon name="logo-youtube" />
                  </i>
                ) : (
                  <BrandIcon key={brand} brand={brand} />
                ),
              )}
            </span>
            <span>
              <strong>Subscriptions</strong>
              <small>Manage upcoming payments</small>
            </span>
            <OfficialIcon name="chevron-right" />
          </button>
        )}
        <section className="card-transactions reference-history-card">
          {state.transactions
            .map(personalTransaction)
            .filter(
              (tx) => tx.cardId === card.id && tx.kind !== "asset-transfer",
            )
            .sort((a, b) => b.rawDate - a.rawDate)
            .slice(0, 3)
            .map((tx) => (
              <TransactionRow
                key={tx.id}
                transaction={{ ...tx, date: transactionDate(tx.rawDate) }}
                compact
              />
            ))}
          {!state.transactions.some((tx) => tx.cardId === card.id) && (
            <p>No transactions on this card yet</p>
          )}
          <button
            className="reference-see-all"
            onClick={() => {
              state.setUiPanel("activity");
              state.setActivityCardId(card.id);
            }}
          >
            See all
          </button>
        </section>
        {!card.isFrozen && (
          <button
            className="add-apple-wallet"
            onClick={() => setWalletPreview(true)}
          >
            <svg viewBox="0 0 32 28" aria-hidden="true">
              <rect x="1" y="2" width="30" height="24" rx="5" fill="#aaa" />
              <rect x="3" y="4" width="26" height="12" rx="2" fill="#53b7f8" />
              <path d="M3 8h26v8H3Z" fill="#ffd85f" />
              <path d="M3 12h26v7H3Z" fill="#fb826d" />
              <path
                d="M2 16h8l6 4 6-4h8v6q0 4-4 4H6q-4 0-4-4Z"
                fill="#d8b7ad"
              />
            </svg>{" "}
            Add to Apple Wallet
          </button>
        )}
      </div>
      <AnimatePresence>
        {(walletPreview || terminate) && (
          <motion.div
            key="card-wallet-preview"
            className="asset-swap-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.section
              className="transfer-choice"
              role="dialog"
              aria-label={terminate ? "Terminate card" : "Apple Wallet preview"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 36 }}
            >
              <h2>{terminate ? "Terminate card?" : "Apple Wallet"}</h2>
              <CardPreview card={card} details />
              <p>
                {terminate
                  ? "This demo card will be archived. Its transaction history stays saved. You can restore it from Wallet."
                  : "Card preview. Adding a payment card to Apple Wallet requires the native bank app."}
              </p>
              {terminate && (
                <button
                  onClick={() => {
                    state.archiveCard(card.id);
                    setTerminate(false);
                  }}
                >
                  Terminate demo card
                </button>
              )}
              <button
                onClick={() => {
                  setWalletPreview(false);
                  setTerminate(false);
                }}
              >
                Close
              </button>
            </motion.section>
          </motion.div>
        )}
        {adding && (
          <motion.div
            key="create-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="asset-swap-overlay"
          >
            <motion.section
              role="dialog"
              aria-label="Add new card"
              className="transfer-choice"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
            >
              <h2>Add new</h2>
              {(["virtual", "disposable"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    state.createNewCard(type);
                    setSelectedId(useRevolutStore.getState().cards[0].id);
                    setAdding(false);
                  }}
                >
                  {type === "virtual"
                    ? "Virtual card"
                    : "Disposable virtual card"}
                </button>
              ))}
              <button onClick={() => setAdding(false)}>Cancel</button>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
