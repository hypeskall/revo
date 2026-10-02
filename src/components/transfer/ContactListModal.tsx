"use client";
import { useState } from "react";
import {
  ArrowLeft,
  Search,
  Plus,
  Landmark,
  CreditCard,
  Users,
  Link,
  Globe,
  Bitcoin,
  QrCode,
} from "@/components/ui/OfficialIcons";
import { useRevolutStore } from "@/store/useRevolutStore";
import { AppHeader } from "@/components/home/AppHeader";
import { ContactAvatar } from "./ContactAvatar";
import { formatCurrencyAmount } from "@/utils/formatters";
import { LightRays } from "@/components/ui/LightRays";

export function ContactListModal({
  isTabMode = false,
}: {
  isTabMode?: boolean;
}) {
  const state = useRevolutStore();
  const [query, setQuery] = useState("");
  const [paymentType, setPaymentType] = useState("Revolut");
  if (!isTabMode && !state.isTransferOpen && !state.selectedContactForTransfer)
    return null;
  const contacts = state.contacts.filter((contact) =>
    contact.name.toLowerCase().includes(query.toLowerCase()),
  );
  const openContact = (id: string) => {
    const contact = state.contacts.find((item) => item.id === id);
    if (contact) {
      state.markContactRead(id);
      state.setSelectedContactForTransfer(contact);
    }
  };
  const tiles = [
    { label: "Revolut", Icon: Plus },
    { label: "Bank", Icon: Landmark },
    { label: "Card", Icon: CreditCard },
    { label: "Group", Icon: Users },
    { label: "Link", Icon: Link },
    { label: "International", Icon: Globe },
    { label: "Crypto", Icon: Bitcoin },
    { label: "Scan", Icon: QrCode },
  ];
  return (
    <section
      className={`${isTabMode ? "reference-payments" : "reference-new-payment"} no-scrollbar`}
    >
      {isTabMode && <LightRays theme="points" />}
      {isTabMode ? (
        <AppHeader payments />
      ) : (
        <>
          <button
            className="reference-back"
            aria-label="Close new payment"
            onClick={() => state.setTransferOpen(false)}
          >
            <ArrowLeft />
          </button>
          <h1>New payment</h1>
        </>
      )}
      {!isTabMode && (
        <>
          <label className="reference-payment-search">
            <Search />
            <input
              aria-label="Search payment recipients"
              placeholder="Name, @Revtag, phone, email"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <div className="reference-payment-tiles">
            {tiles.map(({ label, Icon }) => (
              <button
                key={label}
                aria-label={`${label} payment`}
                onClick={() =>
                  label === "Crypto"
                    ? state.setUiPanel("crypto")
                    : label === "Scan"
                      ? state.setUiPanel("new-contact")
                      : setPaymentType(label)
                }
              >
                <i>
                  <Icon />
                </i>
                {label}
              </button>
            ))}
          </div>
          <p className="text-sm text-white/50 my-4">
            {paymentType === "Revolut"
              ? "Select a friend"
              : `${paymentType} payment · Choose a recipient for a simulated transfer`}
          </p>
          <button
            className="reference-add-contact"
            onClick={() => state.setUiPanel("new-contact")}
          >
            <Plus />
            Add a recipient
          </button>
        </>
      )}
      <div className="reference-contact-card">
        {contacts.map((contact) => {
          const transfer = contact.transfers.at(-1);
          return (
            <button
              className="reference-contact"
              key={contact.id}
              onClick={() => openContact(contact.id)}
            >
              <ContactAvatar contact={contact} />
              <span className="reference-contact-copy">
                <strong>{contact.name}</strong>
                <span>
                  {transfer
                    ? `${transfer.isSender ? "You sent" : "Sent you"} ${formatCurrencyAmount(transfer.amount, transfer.currency, { showDecimalsIfZero: false })}`
                    : "Start a conversation"}
                </span>
              </span>
              <span className="reference-contact-meta">
                <span>{transfer?.dateLabel || ""}</span>
                {!!contact.unread && <b>{contact.unread}</b>}
              </span>
            </button>
          );
        })}
      </div>
      {!contacts.length && (
        <p className="text-center text-white/50 p-8">No contacts found</p>
      )}
    </section>
  );
}
