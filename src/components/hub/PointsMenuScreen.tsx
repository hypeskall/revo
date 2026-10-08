"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRevolutStore } from "@/store/useRevolutStore";
import { OfficialIcon } from "@/components/ui/ReferenceIcons";
import { useClosingScreen } from "@/components/ui/useClosingScreen";
import { formatCurrencyAmount } from "@/utils/formatters";

export function PointsMenuScreen({
  menu,
  onClose,
  onReward,
}: {
  menu: "Earn" | "Redeem";
  onClose: () => void;
  onReward: (title: string) => void;
}) {
  const state = useRevolutStore();
  const transition = useClosingScreen(onClose, true);
  const [choice, setChoice] = useState<string | null>(null);
  const [input, setInput] = useState("100");
  const [message, setMessage] = useState("");
  const points = Number(input);
  const cost = Math.round(points * 10) / 100;
  const row = (
    title: string,
    detail: string,
    icon: string,
    action: () => void,
  ) => (
    <button key={title} className="points-menu-row" onClick={action}>
      <i>
        <OfficialIcon name={icon} />
      </i>
      <span>
        <strong>{title}</strong>
        <small>{detail}</small>
      </span>
      <OfficialIcon name="chevron-right" />
    </button>
  );
  return (
    <motion.section
      {...transition.props}
      onAnimationComplete={transition.finish}
      role="dialog"
      aria-modal="true"
      aria-label={`${menu} points`}
      className="points-menu-screen no-scrollbar"
      initial={{ x: "100%" }}
      animate={{ x: transition.closing ? "100%" : 0 }}
      transition={{ type: "spring", stiffness: 340, damping: 36 }}
    >
      <header>
        <button
          className="reference-back"
          aria-label={`Close ${menu} points`}
          onClick={transition.close}
        >
          <OfficialIcon name="back-button-arrow" />
        </button>
        <span>
          <OfficialIcon name="rev-points" />
          {state.revPoints.toLocaleString("ro-RO")}
        </span>
      </header>
      <h1>{menu} points</h1>
      {menu === "Earn" ? (
        <>
          <button
            className="points-menu-promo"
            onClick={() => state.setUiPanel("plan")}
          >
            <strong>Earn more with your plan</strong>
            <small>Explore your plan benefits</small>
            <OfficialIcon name="premium" />
          </button>
          <h2>Card spend</h2>
          <section className="points-menu-card">
            {row("Debit card", "1 point / 50 lei spent", "card", () => {
              onClose();
              state.setWalletOpen(true);
            })}
          </section>
          <h2>Points top-ups</h2>
          <section className="points-menu-card">
            {row(
              "Buy points",
              "Top up your points balance now",
              "rev-points",
              () => {
                setMessage("");
                setChoice("Buy points");
              },
            )}
            {row("Recurring buy", "Buy points automatically", "arrow-repeat", () =>
              setChoice("Recurring buy"),
            )}
            {row("Spare change", "Buy 10 points / 1 lei spared", "coins", () =>
              setChoice("Spare change"),
            )}
          </section>
          <h2>Bonus points</h2>
          <section className="points-menu-card">
            {row("Shops", "Explore brands and rewards", "shopping", () =>
              onReward("Shopping"),
            )}
          </section>
        </>
      ) : (
        <>
          <h2>Featured rewards</h2>
          <div className="points-featured-rewards">
            <button onClick={() => onReward("Airline miles")}>
              <i>
                <OfficialIcon name="travel" />
              </i>
              <strong>Airline miles</strong>
              <small>From 1.000 points</small>
            </button>
            <button onClick={() => onReward("eSIM")}>
              <i>
                <OfficialIcon name="sim-card" />
              </i>
              <strong>Global eSIM</strong>
              <small>From 500 points</small>
            </button>
          </div>
          <h2>Ways to redeem</h2>
          <section className="points-menu-card">
            {row("Airline miles", "Exchange points for miles", "travel", () =>
              onReward("Airline miles"),
            )}
            {row("Gift Cards", "Choose your next reward", "gift", () =>
              onReward("Gift cards"),
            )}
            {row(
              "Revolut Pay",
              "Use points towards discounts",
              "logo-revolut",
              () => onReward("Shopping"),
            )}
            {row("Stays", "Save on your next trip", "resort", () =>
              onReward("Stays"),
            )}
            {row(
              "Experiences",
              "Explore activities and attractions",
              "lounges",
              () => onReward("Experiences"),
            )}
          </section>
        </>
      )}
      <AnimatePresence>
        {choice && (
          <motion.div
            className="asset-swap-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.section
              className="transfer-choice"
              role="dialog"
              aria-label={choice}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
            >
              <h2>{choice}</h2>
              {choice === "Buy points" ? (
                <>
                  <label>
                    Points
                    <input
                      aria-label="Points to buy"
                      type="number"
                      min="10"
                      max="1000000"
                      step="10"
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                    />
                  </label>
                  <p>10 points / 1 lei · demo rate</p>
                  <p>
                    Cost:{" "}
                    {Number.isFinite(cost)
                      ? formatCurrencyAmount(cost, "RON")
                      : "—"}
                  </p>
                  <p>
                    Balance:{" "}
                    {formatCurrencyAmount(state.accounts.RON.balance, "RON")}
                  </p>
                  <button
                    disabled={
                      !Number.isInteger(points) ||
                      points < 10 ||
                      points > 1000000 ||
                      cost > state.accounts.RON.balance
                    }
                    onClick={() => {
                      const error = state.buyPoints(points);
                      if (error) setMessage(error);
                      else {
                        setMessage("Points added");
                        setChoice(null);
                      }
                    }}
                  >
                    Buy {points || 0} demo points
                  </button>
                </>
              ) : (
                <p>
                  {choice === "Recurring buy"
                    ? "Recurring purchases are not scheduled in this prototype. You can buy points manually and see each purchase in your activity."
                    : "Automatic round-ups are not enabled in this prototype. Eligible card purchases already earn their saved spending points."}
                </p>
              )}
              {message && <p role="status">{message}</p>}
              <button onClick={() => setChoice(null)}>Close</button>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
      {message && !choice && (
        <p role="status" className="points-menu-message">
          {message}
        </p>
      )}
    </motion.section>
  );
}
