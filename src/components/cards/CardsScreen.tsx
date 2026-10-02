"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  const [selectedId, setSelectedId] = useState(
    initialCardId || state.cards[0]?.id,
  );
  const [details, setDetails] = useState(false);
  const [copied, setCopied] = useState("");
  const [adding, setAdding] = useState(false);
  const [more, setMore] = useState(false);
  const card =
    state.cards.find((item) => item.id === selectedId) || state.cards[0];
  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
    } catch {
      setCopied("Copy unavailable in this browser");
    }
  };
  if (!card) return <p>No cards yet.</p>;
  return (
    <section className="card-detail-content no-scrollbar">
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
      <div className="card-selector no-scrollbar" aria-label="Choose card">
        {state.cards.map((item) => (
          <button
            aria-pressed={item.id === card.id}
            key={item.id}
            onClick={() => {
              setSelectedId(item.id);
              setDetails(false);
              setCopied("");
            }}
          >
            {item.name} ··{item.last4}
          </button>
        ))}
      </div>
      <motion.div
        key={card.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-detail-art"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={(_, info) => {
          if (Math.abs(info.offset.x) > 40) {
            const index = state.cards.findIndex((item) => item.id === card.id);
            setSelectedId(
              state.cards[
                (index + (info.offset.x < 0 ? 1 : state.cards.length - 1)) %
                  state.cards.length
              ].id,
            );
            setDetails(false);
          }
        }}
      >
        <CardPreview card={card} details />
        <span className="card-display-name">{card.name}</span>
        <span className="card-display-type">
          {card.type === "physical" ? "Physical" : "Virtual"}
        </span>
      </motion.div>
      <div className="card-detail-actions">
        <button onClick={() => setDetails(!details)}>
          <i className="glass-control">
            <OfficialIcon name={details ? "eye-hide" : "eye-show"} />
          </i>
          {details ? "Hide details" : "Show details"}
        </button>
        <button onClick={() => state.toggleFreezeCard(card.id)}>
          <i className="glass-control">
            <OfficialIcon name="snowflake" />
          </i>
          {card.isFrozen ? "Unfreeze" : "Freeze"}
        </button>
        <button onClick={() => setMore(!more)}>
          <i className="glass-control">
            <OfficialIcon name="more-i-os" />
          </i>
          More
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
                <OfficialIcon name={copied === item.label ? "check" : "copy"} />
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
      <button
        className="card-subscriptions"
        onClick={() => state.setUiPanel("scheduled")}
      >
        <span>
          <BrandIcon brand="Spotify" />
          <BrandIcon brand="AAPL" />
        </span>
        <span>
          <strong>Subscriptions</strong>
          <small>Manage upcoming payments</small>
        </span>
        <OfficialIcon name="chevron-right" />
      </button>
      <section className="card-transactions reference-history-card">
        {state.transactions
          .map(personalTransaction)
          .filter((tx) => tx.cardId === card.id && tx.kind !== "asset-transfer")
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
      <AnimatePresence>
        {adding && (
          <motion.div
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
