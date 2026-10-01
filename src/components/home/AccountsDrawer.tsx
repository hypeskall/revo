"use client";
import { CurrencyFlag } from "@/components/ui/CurrencyFlag";
import { AnimatePresence, motion } from "framer-motion";
import { useRevolutStore } from "@/store/useRevolutStore";
import { OfficialIcon } from "@/components/ui/ReferenceIcons";
import { formatCurrencyAmount } from "@/utils/formatters";
export function AccountsDrawer({ onCredit }: { onCredit?: () => void }) {
  const state = useRevolutStore();
  const close = () => state.setAccountsDrawerOpen(false);
  const choose = (currency: typeof state.activeCurrency) => {
    state.setActiveCurrency(currency);
    state.setHomeAccount("personal");
    close();
  };
  const total =
    state.accounts.RON.balance +
    state.accounts.EUR.balance * 4.9765 +
    state.accounts.USD.balance * 4.582 +
    state.accounts.GBP.balance * 5.891;
  return (
    <AnimatePresence>
      {state.isAccountsDrawerOpen && (
        <motion.div
          className="accounts-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            className="accounts-backdrop"
            aria-label="Dismiss accounts"
            onClick={close}
          />
          <motion.section
            className="accounts-sheet no-scrollbar"
            role="dialog"
            aria-modal="true"
            aria-label="Accounts"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 700) close();
            }}
          >
            <div className="sheet-handle" />
            <button
              className="reference-back"
              aria-label="Close accounts"
              onClick={close}
            >
              <OfficialIcon name="cross" />
            </button>
            <h2>Personal</h2>
            <div className="accounts-card">
              {Object.values(state.accounts).map((account) => (
                <button
                  key={account.id}
                  className="account-row"
                  onClick={() => choose(account.currency)}
                >
                  <i>
                    <CurrencyFlag currency={account.currency} />
                  </i>
                  <span>
                    <strong>{account.name}</strong>
                    <small>
                      {account.code}
                      {account.code === "RON" ? " · Primary" : ""}
                    </small>
                  </span>
                  <strong>
                    {formatCurrencyAmount(account.balance, account.currency)}
                  </strong>
                  {state.homeAccount === "personal" &&
                    state.activeCurrency === account.code && (
                      <OfficialIcon name="check" />
                    )}
                </button>
              ))}
              <div className="account-row">
                <i>
                  <OfficialIcon name="coins" />
                </i>
                <span>
                  <strong>All accounts</strong>
                  <small>4 accounts</small>
                </span>
                <strong>{formatCurrencyAmount(total, "RON")}</strong>
              </div>
            </div>
            <h2>Pockets</h2>
            <button
              className="accounts-card account-row"
              onClick={() => {
                state.setHomeAccount("bills");
                close();
              }}
            >
              <i>
                <OfficialIcon name="pocket" />
              </i>
              <span>
                <strong>Bills</strong>
                <small>EUR pocket</small>
              </span>
              <strong>{formatCurrencyAmount(state.billsBalance, "EUR")}</strong>
            </button>
            <button
              className="accounts-card account-row"
              onClick={() => {
                close();
                state.openTrade("SAVINGS");
              }}
            >
              <i>
                <OfficialIcon name="savings-vault" />
              </i>
              <span>
                <strong>Savings & Funds</strong>
                <small>Explore savings</small>
              </span>
              <OfficialIcon name="chevron-right" />
            </button>
            <button
              className="accounts-card account-row"
              onClick={() => {
                close();
                onCredit?.();
              }}
            >
              <i>
                <OfficialIcon name="credit" />
              </i>
              <span>
                <strong>Personal loan</strong>
                <small>Calculate repayments</small>
              </span>
              <OfficialIcon name="chevron-right" />
            </button>
            <h2>Maria</h2>
            <button
              className="accounts-card account-row"
              onClick={() => {
                close();
                state.setUiPanel("joint");
              }}
            >
              <i>M</i>
              <span>
                <strong>Main</strong>
                <small>Joint account</small>
              </span>
              <strong>{formatCurrencyAmount(state.jointBalance, "RON")}</strong>
            </button>
            <button
              className="accounts-add"
              onClick={() => {
                close();
                state.setUiPanel("accounts");
              }}
            >
              <OfficialIcon name="plus" />
              Add new
            </button>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
