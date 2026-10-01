"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppHeader } from "@/components/home/AppHeader";
import { AnimatedAmount } from "@/components/ui/AnimatedAmount";
import { OfficialIcon } from "@/components/ui/ReferenceIcons";
import { useRevolutStore } from "@/store/useRevolutStore";
const perks = [
  {
    title: "Shopping",
    desc: "Turn points into discounts",
    icon: "shopping",
    points: 500,
  },
  {
    title: "Stays",
    desc: "Find a place for your next trip",
    icon: "hotel",
    points: 1000,
  },
  {
    title: "Experiences",
    desc: "Explore activities and attractions",
    icon: "travel",
    points: 750,
  },
  {
    title: "Gift cards",
    desc: "Choose a gift to share",
    icon: "gift",
    points: 500,
  },
  {
    title: "Airline miles",
    desc: "Exchange points for miles",
    icon: "travel",
    points: 1000,
  },
];
export function HubScreen() {
  const state = useRevolutStore();
  const [selected, setSelected] = useState<(typeof perks)[number] | null>(null);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    state.setScreenOverlayOpen(!!selected);
    return () => useRevolutStore.getState().setScreenOverlayOpen(false);
  }, [selected]);
  return (
    <section className="reference-asset-screen points no-scrollbar">
      <AppHeader
        onSearch={() => setSearching(!searching)}
        onAnalytics={() => state.setUiPanel("rewards")}
      />
      <div className="asset-content">
        <div className="asset-hero">
          <p>RevPoints</p>
          <h1>
            <AnimatedAmount value={state.revPoints.toLocaleString("en-GB")} />
          </h1>
          <span>Your points</span>
        </div>
        <button
          className="presentation-primary"
          onClick={() => state.setUiPanel("rewards")}
        >
          Use points
        </button>
        {searching && (
          <label className="asset-search glass-control">
            <OfficialIcon name="search" />
            <input
              aria-label="Search rewards"
              placeholder="Search rewards"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        )}
        <h2>Explore your rewards</h2>
        <div className="asset-list">
          {perks
            .filter((item) =>
              (item.title + item.desc)
                .toLowerCase()
                .includes(query.toLowerCase()),
            )
            .map((item) => (
              <button
                key={item.title}
                onClick={() => {
                  setSelected(item);
                  setMessage("");
                }}
              >
                <i>
                  <OfficialIcon name={item.icon} />
                </i>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.desc}</small>
                </span>
                <OfficialIcon name="chevron-right" />
              </button>
            ))}
        </div>
        <button
          className="asset-learn"
          onClick={() => state.setUiPanel("plan")}
        >
          <OfficialIcon name="premium" />
          <span>Earn more with your plan</span>
          <OfficialIcon name="chevron-right" />
        </button>
      </div>
      <AnimatePresence>
        {selected && (
          <motion.div
            className="asset-swap-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.section
              role="dialog"
              aria-label={selected.title}
              className="transfer-choice"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
            >
              <h2>{selected.title}</h2>
              <p>{selected.desc}</p>
              <p>Presentation reward · {selected.points} points</p>
              <p>Available: {state.revPoints} points</p>
              {message && <p role="status">{message}</p>}
              <button
                disabled={message === "Reward redeemed"}
                onClick={() =>
                  setMessage(
                    state.redeemPoints(selected.points) || "Reward redeemed",
                  )
                }
              >
                Redeem {selected.points} points
              </button>
              <button onClick={() => setSelected(null)}>Close</button>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
