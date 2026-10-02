"use client";
import {
  CalendarGlyph as Calendar,
  PlusGlyph as Plus,
  SearchGlyph as Search,
} from "@/components/ui/ReferenceIcons";
import { useRevolutStore } from "@/store/useRevolutStore";
import { AnalyticsGlyph, CardsGlyph } from "@/components/ui/ReferenceIcons";
import { OfficialIcon } from "@/components/ui/ReferenceIcons";
import { useEffect, useRef, useState } from "react";

export function AppHeader({
  payments = false,
  onSearch,
  onAnalytics,
  hideAnalytics = false,
  invest = false,
}: {
  payments?: boolean;
  onSearch?: () => void;
  onAnalytics?: () => void;
  hideAnalytics?: boolean;
  invest?: boolean;
}) {
  const state = useRevolutStore();
  const header = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const parent = header.current?.parentElement;
    if (!parent) return;
    const update = () => setScrolled(parent.scrollTop > 25);
    parent.addEventListener("scroll", update, { passive: true });
    update();
    return () => parent.removeEventListener("scroll", update);
  }, []);
  const unread =
    state.notifications.some((item) => !item.read) ||
    state.contacts.some((contact) => contact.unread);
  return (
    <header
      ref={header}
      className={`reference-header ${scrolled ? "is-scrolled" : ""}`}
    >
      <button
        aria-label="Profile"
        className="reference-avatar"
        onClick={() => state.setUiPanel("profile")}
      >
        <img src="/profile.png" alt="Profile" />
        {unread && <i />}
      </button>
      <button
        aria-label="Search"
        className="reference-search"
        onClick={() => (onSearch ? onSearch() : state.setHomeTool("search"))}
      >
        <Search />
        <span>Search</span>
      </button>
      {!hideAnalytics && (
        <button
          aria-label={payments ? "Scheduled payments" : "Analytics"}
          className="reference-header-circle"
          onClick={() =>
            payments
              ? state.setUiPanel("scheduled")
              : onAnalytics
                ? onAnalytics()
                : state.setHomeTool("analytics")
          }
        >
          {payments ? <Calendar /> : <AnalyticsGlyph />}
        </button>
      )}
      <button
        aria-label={
          payments
            ? "New payment"
            : invest
              ? "Investment products"
              : "Wallet & Cards"
        }
        className="reference-header-circle"
        onClick={() =>
          payments
            ? state.setTransferOpen(true)
            : invest
              ? state.setUiPanel("invest")
              : state.setWalletOpen(true)
        }
      >
        {payments ? (
          <Plus />
        ) : invest ? (
          <OfficialIcon name="globe" />
        ) : (
          <CardsGlyph />
        )}
      </button>
    </header>
  );
}
