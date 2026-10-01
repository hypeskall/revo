"use client";
import { motion } from "framer-motion";
import { RevolutLogo } from "@/components/ui/RevolutLogo";
import {
  InvestGlyph,
  PaymentsGlyph,
  PointsGlyph,
  CreditGlyph,
  CryptoGlyph,
} from "@/components/ui/ReferenceIcons";
import { useRevolutStore } from "@/store/useRevolutStore";
export type TabId = "home" | "credit" | "invest" | "transfer" | "cards" | "hub";
export function BottomTabBar({
  activeTab,
  onTabChange,
  hidden = false,
}: {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  hidden?: boolean;
}) {
  const unread = useRevolutStore((state) =>
    state.contacts.some((contact) => contact.unread),
  );
  const tabs = [
    { id: "home" as const, label: "Home", Icon: RevolutLogo },
    { id: "credit" as const, label: "Credit", Icon: CreditGlyph },
    { id: "invest" as const, label: "Invest", Icon: InvestGlyph },
    { id: "transfer" as const, label: "Payments", Icon: PaymentsGlyph },
    { id: "cards" as const, label: "Crypto", Icon: CryptoGlyph },
    { id: "hub" as const, label: "RevPoints", Icon: PointsGlyph },
  ];
  return (
    <motion.nav
      aria-label="Main navigation"
      aria-hidden={hidden}
      className="reference-dock"
      initial={false}
      animate={{
        y: hidden ? 130 : 0,
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? "none" : "auto",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
    >
      {tabs.map(({ id, label, Icon }) => (
        <button
          aria-label={label}
          aria-current={id === activeTab ? "page" : undefined}
          tabIndex={hidden ? -1 : 0}
          key={id}
          onClick={() => onTabChange(id)}
        >
          {id === activeTab && (
            <motion.i
              layoutId="activeTabPill"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            />
          )}
          <span className="dock-glyph">
            <Icon className="dock-icon" />
            {id === "transfer" && unread && <b />}
          </span>
          <span className="dock-label">{label}</span>
        </button>
      ))}
    </motion.nav>
  );
}
