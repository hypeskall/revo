"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { OfficialIcon } from "@/components/ui/ReferenceIcons";
import { useRevolutStore } from "@/store/useRevolutStore";
import { presentationIban } from "@/data/account-details";
import { Currency } from "@/types";
import { useClosingScreen } from "@/components/ui/useClosingScreen";
export function AccountDetails({
  currency,
  onClose,
}: {
  currency: Currency;
  onClose: () => void;
}) {
  const state = useRevolutStore();
  const closing = useClosingScreen(onClose, true);
  const [international, setInternational] = useState(false);
  const [copied, setCopied] = useState("");
  const [selected, setSelected] = useState(currency);
  const values = [
    ["Beneficiary", state.profileName],
    ["IBAN", presentationIban],
    ["BIC / SWIFT code", "REVOROBB"],
  ];
  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
    } catch {
      state.notify(
        "Copy unavailable",
        "Select and copy the displayed details.",
      );
    }
  };
  const share = async () => {
    const text = values
      .map(([label, value]) => `${label}: ${value}`)
      .join("\n");
    try {
      if (navigator.share)
        await navigator.share({ title: "Account details", text });
      else await copy("details", text);
    } catch {
      /* Closing the share sheet leaves the account unchanged. */
    }
  };
  return (
    <motion.section
      {...closing.props}
      onAnimationComplete={closing.finish}
      initial={{ x: "100%" }}
      animate={{ x: closing.closing ? "100%" : 0 }}
      className="account-details-screen no-scrollbar"
      role="dialog"
      aria-modal="true"
      aria-label="Account details"
    >
      <button
        className="reference-back"
        aria-label="Close account details"
        onClick={() => closing.close()}
      >
        <OfficialIcon name="back-button-arrow" />
      </button>
      <h1>Account details</h1>
      <label className="account-currency">
        <span className={`currency-flag flag-${selected}`}>
          {selected === "EUR" ? "✦" : ""}
        </span>
        <select
          aria-label="Account details currency"
          value={selected}
          onChange={(e) => setSelected(e.target.value as Currency)}
        >
          {Object.keys(state.accounts).map((c) => (
            <option key={c} value={c}>
              {c === "RON"
                ? "Romanian Leu"
                : c === "EUR"
                  ? "Euro"
                  : c === "USD"
                    ? "US Dollar"
                    : "British Pound"}
            </option>
          ))}
        </select>
      </label>
      <div className="reference-segment">
        <button
          aria-pressed={!international}
          onClick={() => setInternational(false)}
        >
          Local
        </button>
        <button
          aria-pressed={international}
          onClick={() => setInternational(true)}
        >
          International
        </button>
      </div>
      <section className="account-detail-card">
        <p>
          {international
            ? "For international transfers"
            : "For domestic transfers only"}
        </p>
        {values.map(([label, value]) => (
          <button key={label} onClick={() => copy(label, value)}>
            <span>
              <small>{label}</small>
              <strong>{value}</strong>
            </span>
            <OfficialIcon name={copied === label ? "check" : "copy"} />
          </button>
        ))}
        <button className="account-share" onClick={share}>
          <OfficialIcon name="arrow-send" />
          Share details
        </button>
      </section>
      <section className="account-detail-card account-information">
        {[
          [
            "bank",
            "Eligible deposits are protected up to a value of €100,000, or more in exceptions.",
          ],
          [
            "time-outline",
            "If the sending bank supports instant payments, the payment will arrive in a few seconds. Otherwise, it will take up to 2 working days.",
          ],
          [
            "flag",
            "Only local transfers are accepted. For international transfers, please use the SWIFT details found above.",
          ],
        ].map(([icon, text]) => (
          <div key={icon}>
            <OfficialIcon name={icon} />
            <p>{text}</p>
          </div>
        ))}
        <small>
          Fictional account details for the prototype. No real transfers can be
          received.
        </small>
      </section>
    </motion.section>
  );
}
