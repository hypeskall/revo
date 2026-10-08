"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRevolutStore } from "@/store/useRevolutStore";
import { OfficialIcon } from "@/components/ui/ReferenceIcons";
import { useClosingScreen } from "@/components/ui/useClosingScreen";
import { exchangeRate, roundMoney } from "@/utils/finance";
import { formatCurrencyAmount } from "@/utils/formatters";

export function PlanScreen() {
  const state = useRevolutStore();
  const transition = useClosingScreen(() => state.setUiPanel(null), true);
  const [upgrade, setUpgrade] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const month = new Date();
  const start = new Date(month.getFullYear(), month.getMonth(), 1).getTime();
  const recent = state.transactions.filter(
    (tx) =>
      tx.status === "completed" &&
      tx.rawDate >= start &&
      tx.rawDate <= Date.now(),
  );
  const exchanges = roundMoney(
    recent
      .filter((tx) => tx.category === "Exchange" && tx.amount < 0)
      .reduce(
        (sum, tx) =>
          sum +
          Math.abs(tx.amount) * exchangeRate(state.rates, tx.currency, "RON"),
        0,
      ),
  );
  const withdrawals = recent.filter(
    (tx) => tx.amount < 0 && /ATM|withdrawal/i.test(tx.title),
  );
  const withdrawn = roundMoney(
    withdrawals.reduce(
      (sum, tx) =>
        sum +
        Math.abs(tx.amount) * exchangeRate(state.rates, tx.currency, "RON"),
      0,
    ),
  );
  const trades = recent.filter(
    (tx) => tx.kind === "investment" && tx.amount < 0,
  ).length;
  return (
    <motion.section
      {...transition.props}
      onAnimationComplete={transition.finish}
      role="dialog"
      aria-modal="true"
      aria-label="Your plan"
      className="plan-screen no-scrollbar"
      initial={{ x: "100%" }}
      animate={{ x: transition.closing ? "100%" : 0 }}
      transition={{ type: "spring", stiffness: 340, damping: 36 }}
    >
      <header>
        <button
          className="reference-back"
          aria-label="Close plan"
          onClick={transition.close}
        >
          <OfficialIcon name="back-button-arrow" />
        </button>
        <button className="plan-upgrade" onClick={() => setUpgrade(!upgrade)}>
          <OfficialIcon name="premium" />
          {upgrade ? "Plan benefits" : "Upgrade"}
        </button>
      </header>
      <div className="plan-title">
        <h1>{state.selectedPlan}</h1>
        <span>
          <OfficialIcon name="rev-points" />
          {state.revPoints.toLocaleString("ro-RO")}
        </span>
      </div>
      {upgrade ? (
        <section className="plan-card plan-options">
          <h2>Choose your demo plan</h2>
          {["Standard", "Plus", "Premium", "Metal", "Ultra"].map((plan) => (
            <button
              key={plan}
              aria-pressed={state.selectedPlan === plan}
              onClick={() => {
                state.selectPlan(plan);
                setUpgrade(false);
              }}
            >
              <strong>{plan}</strong>
              <OfficialIcon
                name={state.selectedPlan === plan ? "check" : "chevron-right"}
              />
            </button>
          ))}
          <p>
            Presentation plans. No subscriptions or charges are created.
            Allowances shown below use the Standard reference.
          </p>
        </section>
      ) : (
        <>
          <h2>Save on your spending</h2>
          <section className="plan-card">
            <PlanRow
              icon="cash"
              title="Fee-free ATM withdrawals"
              detail={`${formatCurrencyAmount(withdrawn, "RON")} / 800 lei or ${withdrawals.length} / 5 withdrawn`}
              progress={withdrawn / 800}
            />
            <PlanRow
              icon="arrow-right-left"
              title="Fee-free exchanges"
              detail={`${formatCurrencyAmount(exchanges, "RON")} / 5.000 lei exchanged`}
              progress={exchanges / 5000}
            />
            <PlanRow
              icon="rev-points"
              title="RevPoints"
              detail="Earn 1 point for every 50 lei spent"
            />
            {expanded && (
              <PlanRow
                icon="card"
                title="Virtual cards"
                detail={`${state.cards.filter((card) => !card.archived).length} cards in your Wallet`}
              />
            )}
            <button
              className="points-show-more"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          </section>
          <h2>Plan your wealth</h2>
          <section className="plan-card">
            <PlanRow
              icon="vault"
              title="Savings Account"
              detail="2,50% p.a. · reference example"
            />
            <PlanRow
              icon="invest"
              title="Commission-free trades"
              detail={`${trades} / 1 used this month`}
              progress={trades}
            />
            <PlanRow
              icon="bitcoin"
              title="Crypto trades"
              detail="1,49% · reference example"
            />
          </section>
          <p className="plan-footnote">
            Monthly usage comes from your saved activity. Rates and allowances
            are presentation examples.
          </p>
        </>
      )}
    </motion.section>
  );
}
function PlanRow({
  icon,
  title,
  detail,
  progress,
}: {
  icon: string;
  title: string;
  detail: string;
  progress?: number;
}) {
  return (
    <div className="plan-row">
      <i>
        <OfficialIcon name={icon} />
      </i>
      <div>
        <strong>{title}</strong>
        <small>{detail}</small>
        {progress !== undefined && (
          <div className="plan-progress">
            <span
              style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
