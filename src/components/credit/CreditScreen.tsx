"use client";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/home/AppHeader";
import { OfficialIcon } from "@/components/ui/ReferenceIcons";
import { LightRays } from "@/components/ui/LightRays";
import { useRevolutStore } from "@/store/useRevolutStore";
const features = [
  [
    "credit",
    "Loans for any milestone",
    "Planning a big purchase? Apply for up to 200,000 lei, with an APR starting from 6.44%",
  ],
  [
    "time-outline",
    "Receive your funds, fast",
    "Send off your application in just a few minutes",
  ],
  [
    "calendar",
    "Repay flexibly",
    "Pay it back early and change repayment dates — you're in control",
  ],
  [
    "question-outline",
    "24/7 customer support",
    "For any hiccups along the way, check the FAQs or contact our customer support team",
  ],
];
export function CreditScreen() {
  const state = useRevolutStore();
  const [quote, setQuote] = useState(false);
  const [amount, setAmount] = useState(5000);
  const [months, setMonths] = useState(12);
  useEffect(() => {
    state.setScreenOverlayOpen(quote);
    return () => useRevolutStore.getState().setScreenOverlayOpen(false);
  }, [quote]);
  const monthlyRate = 0.094 / 12;
  const repayment =
    (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  return (
    <div className="reference-section-root relative flex h-full flex-col">
      <section
        className="reference-credit-screen no-scrollbar"
        aria-hidden={quote}
        ref={(node) => {
          if (node) node.inert = quote;
        }}
      >
        <LightRays theme="credit" />
        <AppHeader />
        <div className="reference-product-content">
          <div className="reference-product-hero">
            <h1>Personal loan</h1>
            <p>Boost your budget</p>
          </div>
          <button
            className="reference-product-cta glass-control"
            onClick={() => setQuote(true)}
          >
            Apply now
          </button>
          <section className="reference-product-features">
            {features.map(([icon, title, desc]) => (
              <button
                key={title}
                onClick={() =>
                  title === "24/7 customer support"
                    ? state.setUiPanel("help")
                    : setQuote(true)
                }
              >
                <i>
                  <OfficialIcon name={icon} />
                </i>
                <span>
                  <strong>{title}</strong>
                  <small>{desc}</small>
                </span>
              </button>
            ))}
          </section>
          <p className="product-smallprint">
            Illustrative product information for this local prototype. Rates are
            sample figures, not a credit offer. No application is submitted.
            <br />
            Representative calculation: fixed annual interest 9.40%, with no
            additional fees in this calculator.
          </p>
        </div>
      </section>
      {quote && (
        <div className="asset-swap-overlay">
          <section
            className="transfer-choice"
            role="dialog"
            aria-label="Personal loan calculator"
          >
            <h2>Personal loan</h2>
            <label>
              Amount in RON
              <input
                aria-label="Loan amount in RON"
                type="number"
                min="100"
                max="200000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </label>
            <label>
              Term
              <select
                aria-label="Loan term"
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
              >
                {[6, 12, 24, 36, 60].map((v) => (
                  <option key={v} value={v}>
                    {v} months
                  </option>
                ))}
              </select>
            </label>
            <p>
              {Number.isFinite(repayment)
                ? repayment.toLocaleString("ro-RO", {
                    maximumFractionDigits: 2,
                  })
                : "0"}{" "}
              lei / month
            </p>
            <p>Sample calculation · 9.40% annual interest</p>
            <button
              disabled={
                !Number.isFinite(amount) || amount < 100 || amount > 200000
              }
              onClick={() => {
                state.notify(
                  "Loan quote saved",
                  `${amount} RON over ${months} months · sample quote`,
                );
                setQuote(false);
              }}
            >
              Save quote
            </button>
            <button onClick={() => setQuote(false)}>Close</button>
          </section>
        </div>
      )}
    </div>
  );
}
