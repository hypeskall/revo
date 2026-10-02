"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppHeader } from "@/components/home/AppHeader";
import { AnimatedAmount } from "@/components/ui/AnimatedAmount";
import { OfficialIcon } from "@/components/ui/ReferenceIcons";
import { useRevolutStore } from "@/store/useRevolutStore";
import { LightRays } from "@/components/ui/LightRays";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { transactionDate, exchangeRate } from "@/utils/finance";
import { PointsMenuScreen } from "./PointsMenuScreen";
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
    icon: "resort",
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
  {
    title: "eSIM",
    desc: "Stay connected wherever you go",
    icon: "sim-card",
    points: 500,
  },
];
export function HubScreen() {
  const state = useRevolutStore();
  const [selected, setSelected] = useState<(typeof perks)[number] | null>(null);
  const [message, setMessage] = useState("");
  const [promo, setPromo] = useState(true);
  const [menu, setMenu] = useState<string | null>(null);
  const [promoIndex, setPromoIndex] = useState(0);
  const promos = [
    {
      title: "Your wallet, race-ready",
      desc: "Get the Audi Revolut F1® Team virtual cards for 500 points",
    },
    {
      title: "Turn points into discounts",
      desc: "Redeem your points with Revolut Pay",
    },
    {
      title: "Your next adventure",
      desc: "Explore airline miles with your RevPoints",
    },
    { title: "Find your next stay", desc: "Use points towards a Stays reward" },
    {
      title: "Find something you love",
      desc: "Explore shopping rewards with your points",
    },
  ];
  useEffect(() => {
    state.setScreenOverlayOpen(!!selected || !!menu);
    return () => useRevolutStore.getState().setScreenOverlayOpen(false);
  }, [selected, menu]);
  return (
    <div className="reference-section-root">
      <section
        className="reference-points-screen no-scrollbar"
        aria-hidden={!!selected || !!menu}
        ref={(node) => {
          if (node) node.inert = !!selected || !!menu;
        }}
      >
        <LightRays theme="points" />
        <AppHeader hideAnalytics />
        <div className="reference-points-content">
          <div className="reference-points-hero">
            <p>{state.selectedPlan} plan</p>
            <h1>
              <OfficialIcon name="rev-points" />
              <AnimatedAmount value={state.revPoints.toLocaleString("ro-RO")} />
            </h1>
            <button
              onClick={() => setMenu("Points earning")}
              aria-label="Points earning information"
            >
              1 point / 50 lei spent <OfficialIcon name="info-outline" />
            </button>
            <button
              className="reference-points-upgrade"
              onClick={() => state.setUiPanel("plan")}
            >
              Upgrade
            </button>
          </div>
          <div className="reference-actions points-actions">
            {[
              { label: "Earn", icon: "plus", action: () => setMenu("Earn") },
              {
                label: "Redeem",
                icon: "coins-earning",
                action: () => setMenu("Redeem"),
              },
              {
                label: "Plan perks",
                icon: "premium",
                action: () => state.setUiPanel("plan"),
              },
              {
                label: "More",
                icon: "more-i-os",
                action: () => setMenu("More"),
              },
            ].map((i) => (
              <button key={i.label} onClick={i.action}>
                <i>
                  <OfficialIcon name={i.icon} />
                </i>
                <span>{i.label}</span>
              </button>
            ))}
          </div>
          {promo && (
            <motion.section
              key={promoIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="reference-points-promo"
            >
              <button
                aria-label="Dismiss points promotion"
                className="reference-promo-close"
                onClick={() => setPromo(false)}
              >
                <OfficialIcon name="cross" />
              </button>
              <button
                onClick={() => {
                  setSelected(
                    promoIndex === 0
                      ? {
                          title: "Audi Revolut F1 Team cards",
                          desc: "Get a race-ready virtual card for your presentation",
                          icon: "card",
                          points: 500,
                        }
                      : perks.find(
                          (p) =>
                            p.title ===
                            [
                              "",
                              "Shopping",
                              "Airline miles",
                              "Stays",
                              "Shopping",
                            ][promoIndex],
                        )!,
                  );
                  setMessage("");
                }}
              >
                <strong>{promos[promoIndex].title}</strong>
                <span>{promos[promoIndex].desc}</span>
                <div className="points-card-art">
                  <i>
                    Audi
                    <br />
                    Revolut
                    <br />
                    F1 TEAM
                  </i>
                  <i>
                    Revolut
                    <br />
                    VIRTUAL
                  </i>
                </div>
              </button>
            </motion.section>
          )}
          {promo && (
            <div className="reference-carousel-dots">
              {[0, 1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  aria-label={`Points promotion ${i + 1}`}
                  aria-pressed={i === promoIndex}
                  onClick={() => setPromoIndex(i)}
                />
              ))}
            </div>
          )}
          <section className="reference-points-products">
            <h2>Products</h2>
            <div>
              {[
                { label: "Miles", title: "Airline miles", icon: "travel" },
                { label: "Stays", title: "Stays", icon: "resort" },
                { label: "eSIM", title: "eSIM", icon: "sim-card" },
                { label: "Shops", title: "Shopping", icon: "shopping" },
                { label: "Gift Cards", title: "Gift cards", icon: "gift" },
                { label: "Lounges", title: "Experiences", icon: "lounges" },
                { label: "Pocket", title: "Shopping", icon: "rev-points" },
                {
                  label: "Fast Track",
                  title: "Experiences",
                  icon: "arrow-thin-right",
                },
              ].map((i) => (
                <button
                  key={i.label}
                  onClick={() => {
                    setSelected(perks.find((p) => p.title === i.title)!);
                    setMessage("");
                  }}
                >
                  <i>
                    <OfficialIcon name={i.icon} />
                  </i>
                  {i.label}
                </button>
              ))}
            </div>
            <button
              className="points-show-more"
              onClick={() => setMenu("Redeem")}
            >
              Show more
            </button>
          </section>
          <section className="points-activity-panel">
            <h2>
              Transactions <OfficialIcon name="chevron-right" />
            </h2>
            {state.transactions
              .filter(
                (tx) =>
                  tx.amount < 0 &&
                  tx.status === "completed" &&
                  !tx.contactId &&
                  (!tx.kind || tx.kind === "external") &&
                  !["Exchange", "Transfers", "Verification", "Top-up"].includes(
                    tx.category,
                  ),
              )
              .slice(0, 3)
              .map((tx) => (
                <button
                  key={tx.id}
                  onClick={() => state.setSelectedTransactionDetail(tx)}
                >
                  <BrandIcon brand={tx.brand} />
                  <span>
                    <strong>{tx.title}</strong>
                    <small>
                      {transactionDate(tx.rawDate)}, {tx.timestamp}
                    </small>
                  </span>
                  <strong>
                    +
                    {(
                      tx.pointsPurchased ??
                      tx.pointsEarned ??
                      Math.floor(
                        ((Math.abs(tx.amount) *
                          exchangeRate(state.rates, tx.currency, "RON")) /
                          50) *
                          100,
                      ) / 100
                    ).toLocaleString("ro-RO", {
                      maximumFractionDigits: 2,
                    })}{" "}
                    points
                  </strong>
                </button>
              ))}
            <button
              className="points-show-more"
              onClick={() => state.setUiPanel("rewards")}
            >
              See all
            </button>
          </section>
          <section className="points-brands-panel">
            <h2>Top brands</h2>
            <div>
              {[
                "Uber",
                "Booking",
                "SHEIN",
                "Airbnb",
                "Wizz Air",
                "Glovo",
                "Lounge by Zalando",
                "Nike",
                "LEGO Store",
                "Wolt",
                "Douglas",
                "99+",
              ].map((brand) => (
                <button
                  key={brand}
                  onClick={() => {
                    setSelected({
                      ...perks[0],
                      title: brand === "99+" ? "All shops" : brand,
                    });
                    setMessage("");
                  }}
                >
                  <span>
                    <BrandIcon brand={brand} />
                    <b>
                      <OfficialIcon name="rev-points" />
                    </b>
                  </span>
                  {brand === "99+" ? "See all" : brand}
                </button>
              ))}
            </div>
          </section>
          <section className="points-travel-panel">
            <h2>
              <BrandIcon brand="Airbnb" />
              Airbnb
            </h2>
            <div className="points-stays-carousel">
              {[
                ["Italian escape", "Bask in the Mediterranean sun"],
                ["London stays", "Find your home away from home"],
              ].map(([title, desc], index) => (
                <button
                  className={`points-stay stay-${index}`}
                  key={title}
                  onClick={() => {
                    setSelected({ ...perks[1], title });
                    setMessage("");
                  }}
                >
                  <div className="stay-image">
                    <OfficialIcon name="resort" />
                  </div>
                  <BrandIcon brand="Airbnb" />
                  <strong>{title}</strong>
                  <small>{desc}</small>
                  <span>
                    <OfficialIcon name="rev-points" />5 / 50 lei
                  </span>
                </button>
              ))}
            </div>
            <button
              className="points-show-more"
              onClick={() => state.setUiPanel("stays")}
            >
              Book now
            </button>
          </section>
          <button
            className="points-fashion-panel"
            onClick={() => {
              setSelected({ ...perks[0], title: "Lounge by Zalando" });
              setMessage("");
            }}
          >
            <BrandIcon brand="Lounge by Zalando" />
            <h2>Lounge by Zalando</h2>
            <div className="fashion-art">
              <span>New season</span>
              <strong>Find your next favourite</strong>
              <OfficialIcon name="shopping" />
            </div>
          </button>
          <h2 className="points-explore-title">Explore your rewards</h2>
          <div className="asset-list">
            {perks.map((item) => (
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
      </section>
      <AnimatePresence>
        {(menu === "Earn" || menu === "Redeem") && (
          <PointsMenuScreen
            key={menu}
            menu={menu}
            onClose={() => setMenu(null)}
            onReward={(title) => {
              setMenu(null);
              setSelected(perks.find((item) => item.title === title)!);
              setMessage("");
            }}
          />
        )}
        {menu && menu !== "Earn" && menu !== "Redeem" && (
          <motion.div
            key="points-menu"
            className="asset-swap-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <section
              className="transfer-choice"
              role="dialog"
              aria-label={menu}
            >
              <h2>{menu}</h2>
              {menu === "Redeem" ? (
                perks.map((item) => (
                  <button
                    key={item.title}
                    onClick={() => {
                      setMenu(null);
                      setSelected(item);
                      setMessage("");
                    }}
                  >
                    {item.title}
                  </button>
                ))
              ) : menu === "Earn" ? (
                <>
                  <p>Collect points with card spending or explore rewards.</p>
                  <button onClick={() => state.setUiPanel("plan")}>
                    Compare plans
                  </button>
                  <button
                    onClick={() => {
                      setMenu(null);
                      state.setWalletOpen(true);
                    }}
                  >
                    Your cards
                  </button>
                </>
              ) : menu === "More" ? (
                <>
                  <button onClick={() => state.setUiPanel("rewards")}>
                    Points activity
                  </button>
                  <button onClick={() => state.setUiPanel("help")}>
                    Help with RevPoints
                  </button>
                </>
              ) : (
                <p>
                  Standard plan: 1 point for every 50 lei of eligible spending.
                  Rates shown are presentation fixtures.
                </p>
              )}
              <button onClick={() => setMenu(null)}>Close</button>
            </section>
          </motion.div>
        )}
        {selected && (
          <motion.div
            key="points-reward"
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
    </div>
  );
}
