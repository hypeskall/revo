"use client";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { OfficialIcon } from "@/components/ui/ReferenceIcons";
import { useRevolutStore } from "@/store/useRevolutStore";
import { sound } from "@/utils/audio";
import { Currency, Transaction } from "@/types";
import { personalTransaction } from "@/utils/finance";
import { ReferenceTools } from "./ReferenceTools";
import { AccountDetails } from "./AccountDetails";
export type HomeTool = "search" | "analytics" | "details" | "more";
interface HomeToolsSheetProps {
  tool: HomeTool | null;
  onClose: () => void;
  onOpenWallet: () => void;
  onSelectTool: (tool: HomeTool) => void;
  additionalTransactions?: Transaction[];
  currency?: Currency;
  onNavigatePoints?: () => void;
  onThemeOpenChange?: (open: boolean) => void;
}
export const HomeToolsSheet: React.FC<HomeToolsSheetProps> = ({
  tool,
  onClose,
  onSelectTool,
  additionalTransactions,
  currency,
  onNavigatePoints,
  onThemeOpenChange,
}) => {
  const {
    activeCurrency: selectedCurrency,
    transactions: storedTransactions,
    contacts,
    setExchangeOpen,
    setAccountsDrawerOpen,
    setSelectedTransactionDetail,
    setSelectedContactForTransfer,
    setUiPanel,
  } = useRevolutStore();
  const [themeOpen, setThemeOpen] = useState(false);
  useEffect(() => {
    onThemeOpenChange?.(themeOpen);
    return () => onThemeOpenChange?.(false);
  }, [themeOpen, onThemeOpenChange]);
  const activeCurrency = currency || selectedCurrency;
  const transactions = useMemo(
    () => [
      ...storedTransactions.map(personalTransaction),
      ...(additionalTransactions || []),
    ],
    [storedTransactions, additionalTransactions],
  );
  const openTool = (action: () => void) => {
    sound.playKeypadClick();
    onClose();
    window.setTimeout(action, 120);
  };
  if (tool === "details")
    return <AccountDetails currency={activeCurrency} onClose={onClose} />;
  if (tool === "search" || tool === "analytics")
    return (
      <ReferenceTools
        key={tool}
        tool={tool}
        onClose={onClose}
        transactions={transactions}
        currency={activeCurrency}
        onNavigate={(target, id) => {
          onClose();
          if (target === "converter") setExchangeOpen(true);
          if (target === "rewards")
            onNavigatePoints ? onNavigatePoints() : setUiPanel("rewards");
          if (target === "stays") setUiPanel("stays");
          if (target === "contact") {
            const contact = contacts.find((c) => c.id === id);
            if (contact) setSelectedContactForTransfer(contact);
          }
          if (target === "transaction") {
            const tx = transactions.find((t) => t.id === id);
            if (tx) setSelectedTransactionDetail(tx);
          }
        }}
      />
    );
  return (
    <HomeMoreMenu
      open={tool === "more"}
      onClose={onClose}
      onAction={(action) => {
        openTool(() => {
          if (action === "salary") onSelectTool("details");
          if (action === "converter") setExchangeOpen(true);
          if (action === "theme") setThemeOpen(true);
          if (action === "accounts") setAccountsDrawerOpen(true);
          if (action === "statement") {
            const cell = (value: string | number) =>
              `"${String(value).replace(/"/g, '""')}"`;
            const rows = [
              ["Date", "Time", "Description", "Amount", "Currency"],
              ...transactions.map((tx) => [
                tx.date,
                tx.timestamp,
                tx.title,
                tx.amount,
                tx.currency,
              ]),
            ];
            const url = URL.createObjectURL(
              new Blob(
                [
                  "Sandbox statement — fictional transactions\r\n" +
                    rows.map((row) => row.map(cell).join(",")).join("\r\n"),
                ],
                { type: "text/csv;charset=utf-8" },
              ),
            );
            const link = document.createElement("a");
            link.href = url;
            link.download = "sandbox-statement.csv";
            link.click();
            window.setTimeout(() => URL.revokeObjectURL(url), 1000);
          }
        });
      }}
      themeOpen={themeOpen}
      onCloseTheme={() => setThemeOpen(false)}
    />
  );
};
function HomeMoreMenu({
  open,
  onClose,
  onAction,
  themeOpen,
  onCloseTheme,
}: {
  open: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
  themeOpen: boolean;
  onCloseTheme: () => void;
}) {
  const [position, setPosition] = useState({ top: 70, right: 16 });
  const { lightPalette, setLightPalette } = useRevolutStore();
  useLayoutEffect(() => {
    if (!open) return;
    const anchor = document.querySelector(
      '[data-tab-scene][data-active="true"] [data-home-more]',
    );
    const frame = document.querySelector(".app-phone");
    if (!anchor || !frame) return;
    const a = anchor.getBoundingClientRect(),
      f = frame.getBoundingClientRect();
    setPosition({
      top: Math.max(16, a.bottom - f.top - f.width * 0.76),
      right: Math.max(12, f.right - a.right),
    });
  }, [open]);
  useEffect(() => {
    if (!open && !themeOpen) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        onCloseTheme();
      }
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [open, themeOpen, onClose, onCloseTheme]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="more-menu"
          className="home-more-layer"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, pointerEvents: "none" }}
          transition={{ duration: 0.18 }}
        >
          <button
            className="home-more-dismiss"
            aria-label="Close More menu"
            onClick={onClose}
          />
          <motion.section
            className="home-more-popover"
            role="menu"
            aria-label="More"
            style={{
              top: position.top,
              right: position.right,
              transformOrigin: "90% 95%",
            }}
            initial={{ opacity: 0, scale: 0.88, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 8 }}
            transition={{ type: "spring", stiffness: 460, damping: 34 }}
          >
            {[
              ["Salary", "credit", "salary"],
              ["Statement", "document", "statement"],
              ["Converter", "arrow-right-left", "converter"],
              ["Theme", "palette", "theme"],
              ["Add products & accounts", "plus", "accounts"],
            ].map(([label, icon, action]) => (
              <button
                role="menuitem"
                key={action}
                onClick={() => onAction(action)}
              >
                <OfficialIcon name={icon} />
                <span>{label}</span>
              </button>
            ))}
          </motion.section>
        </motion.div>
      )}
      {themeOpen && (
        <motion.div
          key="theme-chooser"
          className="asset-swap-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, pointerEvents: "none" }}
        >
          <motion.section
            className="transfer-choice"
            role="dialog"
            aria-label="Theme"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
          >
            <h2>Theme</h2>
            {(["dynamic", "blue", "teal"] as const).map((palette) => (
              <button
                aria-pressed={lightPalette === palette}
                key={palette}
                onClick={() => setLightPalette(palette)}
              >
                {palette === "dynamic"
                  ? "Animated glow"
                  : palette === "blue"
                    ? "Blue glow"
                    : "Teal glow"}
                <OfficialIcon
                  name={lightPalette === palette ? "check" : "palette"}
                />
              </button>
            ))}
            <button onClick={onCloseTheme}>Done</button>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
