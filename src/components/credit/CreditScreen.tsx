"use client";
import { useState } from "react";
import { AppHeader } from "@/components/home/AppHeader";
import { CreditGlyph } from "@/components/ui/ReferenceIcons";
import { useRevolutStore } from "@/store/useRevolutStore";

export function CreditScreen() {
  const [amount, setAmount] = useState(5000);
  const [months, setMonths] = useState(12);
  const state = useRevolutStore();
  return (
    <section className="reference-payments no-scrollbar">
      <AppHeader />
      <div className="credit-content">
        <CreditGlyph />
        <h1>Credit</h1>
        <p>Explore a personal loan</p>
        <div className="credit-quote">
          <h2>Calculate your repayments</h2>
          <label>
            Amount in RON
            <input
              aria-label="Loan amount in RON"
              type="number"
              min="100"
              max="100000"
              step="100"
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
            />
          </label>
          <label>
            Term
            <select
              aria-label="Loan term"
              value={months}
              onChange={(event) => setMonths(Number(event.target.value))}
            >
              {[6, 12, 24, 36].map((value) => (
                <option key={value} value={value}>
                  {value} months
                </option>
              ))}
            </select>
          </label>
          <strong>
            {Number.isFinite(amount) && amount > 0
              ? (amount / months).toFixed(2)
              : "0.00"}{" "}
            lei / month
          </strong>
          <p>
            Illustrative calculation with no interest. No credit application or
            borrowing is created.
          </p>
          <button
            className="presentation-primary"
            disabled={
              !Number.isFinite(amount) || amount < 100 || amount > 100000
            }
            onClick={() =>
              state.notify(
                "Loan quote saved",
                `${amount} RON over ${months} months. Demo quote only.`,
              )
            }
          >
            Save demo quote
          </button>
        </div>
      </div>
    </section>
  );
}
