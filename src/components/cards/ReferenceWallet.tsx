"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useClosingScreen } from "@/components/ui/useClosingScreen";
import { Plus, X, ArrowLeft } from "@/components/ui/OfficialIcons";
import { useRevolutStore } from "@/store/useRevolutStore";
import { CardPreview } from "./CardPreview";
import { CardsScreen } from "./CardsScreen";
import { OfficialIcon } from "@/components/ui/ReferenceIcons";
import { LightRays } from "@/components/ui/LightRays";
import { useSheetGesture } from "@/components/ui/useSheetGesture";
export function ReferenceWallet() {
  const state = useRevolutStore();
  const transition = useClosingScreen(() => state.setWalletOpen(false));
  const gesture = useSheetGesture(transition.close);
  const [selected, setSelected] = useState<string | null>(state.walletCardId);
  const [adding, setAdding] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
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
      aria-label="Wallet"
      className="reference-wallet-frame"
    >
      <div {...gesture.handle} className="screen-sheet-grab" aria-hidden="true" />
      <div
        className="reference-wallet no-scrollbar"
        aria-hidden={adding || mapOpen || !!selected}
        ref={(node) => {
          if (node) node.inert = adding || mapOpen || !!selected;
        }}
      >
        <LightRays theme="points" />
        <button
          className="reference-back"
          aria-label="Close wallet"
          onClick={() => transition.close()}
        >
          <X />
        </button>
        <h1>Wallet</h1>
        <div className="reference-wallet-list">
          {state.cards
            .filter((card) => !card.archived)
            .map((card) => (
              <button
                key={card.id}
                className="reference-wallet-row"
                onClick={() => setSelected(card.id)}
              >
                <CardPreview card={card} />
                <span>
                  <strong>{card.name}</strong>
                  <small>
                    {card.isFrozen
                      ? "Card is frozen"
                      : card.type === "disposable"
                        ? "Regenerates details after each use"
                        : `··${card.last4}, ${card.expiry}`}
                  </small>
                </span>
              </button>
            ))}
          <button
            className="reference-wallet-row"
            onClick={() => state.setUiPanel("rewards")}
          >
            <span className="reference-pay-card">R Pay</span>
            <span>
              <strong>Revolut Pay</strong>
              <small>A secure 1-click checkout</small>
            </span>
          </button>
        </div>
        <button
          className="reference-map wallet-map"
          aria-label="View sample ATM locations"
          onClick={() => setMapOpen(true)}
        >
          <OfficialIcon name="bank" />
          <OfficialIcon name="bank" />
          <OfficialIcon name="bank" />
          <span className="wallet-map-caption">
            Find ATMs nearby <OfficialIcon name="chevron-right" />
          </span>
        </button>
        {state.cards.some((card) => card.archived) && (
          <section className="archived-cards">
            <h2>Archived demo cards</h2>
            {state.cards
              .filter((card) => card.archived)
              .map((card) => (
                <button
                  key={card.id}
                  onClick={() => state.restoreCard(card.id)}
                >
                  Restore {card.name} ··{card.last4}
                </button>
              ))}
          </section>
        )}
        <button
          className="wallet-reactivate"
          onClick={() => {
            const frozen = state.cards.find(
              (card) => card.isFrozen && !card.archived,
            );
            if (frozen) setSelected(frozen.id);
            else state.notify("Cards", "All your cards are active.");
          }}
        >
          Reactivate a card <OfficialIcon name="chevron-right" />
        </button>
      </div>
      <button
        className="reference-wallet-add"
        style={{ visibility: selected ? "hidden" : "visible" }}
        disabled={adding || mapOpen || !!selected}
        onClick={() => setAdding(true)}
      >
        <Plus />
        Add new
      </button>
      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: "none" }}
            className="absolute inset-0 z-10 bg-black/70 flex items-end"
          >
            <motion.section
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 36 }}
              role="dialog"
              aria-label="Add new card"
              className="w-full rounded-t-3xl bg-[#202023] p-6 space-y-4"
            >
              <button
                aria-label="Close new card"
                className="float-right"
                onClick={() => setAdding(false)}
              >
                <X />
              </button>
              <h2 className="text-xl">Add new</h2>
              {(["virtual", "disposable"] as const).map((type) => (
                <button
                  key={type}
                  className="block w-full bg-white/10 rounded-2xl p-4 text-left"
                  onClick={() => {
                    state.createNewCard(type);
                    setAdding(false);
                  }}
                >
                  {type === "virtual"
                    ? "Virtual card"
                    : "Disposable virtual card"}
                </button>
              ))}
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
      {mapOpen && (
        <section
          className="reference-local-sheet"
          role="dialog"
          aria-label="ATM locations"
        >
          <button
            className="reference-back"
            aria-label="Close ATM locations"
            onClick={() => setMapOpen(false)}
          >
            <OfficialIcon name="cross" />
          </button>
          <h2>ATMs</h2>
          <div className="reference-map">
            <OfficialIcon name="cash" />
            <OfficialIcon name="cash" />
          </div>
          <p>Sample locations for your presentation</p>
          <button
            className="presentation-primary"
            onClick={() => setMapOpen(false)}
          >
            Done
          </button>
        </section>
      )}
      <AnimatePresence initial={false}>
        {selected && (
          <motion.section
            key="card-detail"
            role="dialog"
            aria-label="Card details"
            className="wallet-card-screen"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%", pointerEvents: "none" }}
            transition={{ type: "spring", stiffness: 340, damping: 36 }}
          >
            <button
              aria-label="Back to wallet"
              onClick={() => setSelected(null)}
              className="reference-back wallet-card-back"
            >
              <ArrowLeft />
            </button>
            <button
              aria-label="Help with cards"
              className="reference-back wallet-card-help"
              onClick={() => state.setUiPanel("help")}
            >
              <OfficialIcon name="question-outline" />
            </button>
            <div className="flex-1 min-h-0">
              <CardsScreen initialCardId={selected} externalHeader />
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
