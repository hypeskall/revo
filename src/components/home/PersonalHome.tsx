"use client";
import {
  ChevronRight,
  X,
  Coins,
  PiggyBank,
} from "@/components/ui/OfficialIcons";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRevolutStore } from "@/store/useRevolutStore";
import { AppHeader } from "./AppHeader";
import {
  BankGlyph,
  PlusGlyph as Plus,
  MoveGlyph as Shuffle,
  MoreGlyph as MoreHorizontal,
} from "@/components/ui/ReferenceIcons";
import { AnimatedAmount } from "@/components/ui/AnimatedAmount";
import { TransactionRow } from "./ReferenceActivity";
import { CardPreview } from "@/components/cards/CardPreview";
import { formatCurrencyAmount } from "@/utils/formatters";
import {
  wealthSummary,
  transactionDate,
  personalTransaction,
  isExternalFlow,
  exchangeRate,
  roundMoney,
} from "@/utils/finance";
import { presentationIban } from "@/data/account-details";
import { TabId } from "@/components/navigation/BottomTabBar";
import { OfficialIcon } from "@/components/ui/ReferenceIcons";

export function PersonalHome({
  onNavigate,
}: {
  onNavigate: (tab: TabId) => void;
}) {
  const state = useRevolutStore();
  const [showPromo, setShowPromo] = useState(true);
  const [cardPage, setCardPage] = useState(0);
  const currencies = ["RON", "EUR", "USD", "GBP"] as const;
  const current = state.accounts[state.activeCurrency];
  const wealth = wealthSummary(state);
  const { cash, total } = wealth;
  const monthStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 1,
    1,
  ).getTime();
  const monthEnd = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  ).getTime();
  const monthChange = roundMoney(
    state.transactions
      .map(personalTransaction)
      .filter(
        (t) =>
          (isExternalFlow(t) || t.kind === "asset-transfer") &&
          t.status === "completed" &&
          t.rawDate >= monthStart &&
          t.rawDate < monthEnd,
      )
      .reduce(
        (sum, t) =>
          sum + t.amount * exchangeRate(state.rates, t.currency, "RON"),
        0,
      ),
  );
  const [whole, cents] = new Intl.NumberFormat(
    state.activeCurrency === "RON" ? "ro-RO" : "en-GB",
    { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  )
    .format(current.balance)
    .split(state.activeCurrency === "RON" ? "," : ".");
  const actions = [
    {
      label: "Add money",
      Icon: Plus,
      action: () => state.setAddMoneyOpen(true),
    },
    { label: "Move", Icon: Shuffle, action: () => state.setTransferOpen(true) },
    {
      label: "Details",
      Icon: BankGlyph,
      action: () => state.setHomeTool("details"),
    },
    {
      label: "More",
      Icon: MoreHorizontal,
      action: () => state.setHomeTool("more"),
    },
  ];
  const activity = state.transactions
    .map(personalTransaction)
    .map((tx) => ({ ...tx, date: transactionDate(tx.rawDate) }))
    .sort((a, b) => b.rawDate - a.rawDate)
    .filter(
      (tx) =>
        tx.currency === state.activeCurrency && tx.kind !== "asset-transfer",
    )
    .slice(0, 3);
  return (
    <div className="reference-home no-scrollbar">
      <AppHeader />
      <motion.section
        className="reference-balance"
        aria-label="Personal balance"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={(_, info) => {
          if (Math.abs(info.offset.x) > 45) {
            const index = currencies.indexOf(state.activeCurrency);
            state.setActiveCurrency(
              currencies[(index + (info.offset.x < 0 ? 1 : 3)) % 4],
            );
          }
        }}
      >
        <h1>Personal · {state.activeCurrency}</h1>
        <div className="reference-amount">
          <AnimatedAmount value={whole} />
          <small>
            <AnimatedAmount
              value={`${state.activeCurrency === "RON" ? "," : "."}${cents}`}
            />{" "}
            {current.symbol}
          </small>
        </div>
        <button
          className="reference-iban"
          onClick={() => state.setHomeTool("details")}
        >
          <BankGlyph />
          <span>{presentationIban}</span>
        </button>
        <button
          className="reference-accounts"
          onClick={() => state.setAccountsDrawerOpen(true)}
        >
          Accounts<span>{Object.keys(state.accounts).length + 2}</span>
        </button>
      </motion.section>
      <div className="reference-actions">
        {actions.map(({ label, Icon, action }) => (
          <button aria-label={label} key={label} onClick={action}>
            <i>
              <Icon />
            </i>
            <span>{label}</span>
          </button>
        ))}
      </div>
      {showPromo && (
        <section className="reference-promo">
          <button
            className="reference-promo-close"
            aria-label="Dismiss promotion"
            onClick={() => setShowPromo(false)}
          >
            <X />
          </button>
          <button onClick={() => state.setUiPanel("rewards")}>
            <strong>Turn RevPoints into discounts</strong>
            <span>
              Redeem your points as discounts with Revolut Pay. T&Cs apply
            </span>
            <b>Revolut Pay</b>
          </button>
        </section>
      )}
      <section className="reference-feed" aria-label="Recent activity">
        {activity.map((tx) => (
          <TransactionRow key={tx.id} transaction={tx} />
        ))}
        <button
          className="reference-see-all"
          onClick={() => state.setUiPanel("activity")}
        >
          See all <ChevronRight size={15} />
        </button>
      </section>
      <section className="reference-widgets">
        <button
          className="reference-joint"
          onClick={() => state.setUiPanel("joint")}
        >
          <span className="joint-avatar">M</span>
          <span>Maria</span>
          <strong>{formatCurrencyAmount(state.jointBalance, "RON")}</strong>
          <i>
            <Plus />
          </i>
        </button>
        <section className="reference-widget">
          <button
            className="reference-widget-title"
            onClick={() => state.setWalletOpen(true)}
          >
            Cards <ChevronRight size={19} />
          </button>
          <motion.div
            key={cardPage}
            className="reference-mini-cards"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) > 40)
                setCardPage((cardPage + (info.offset.x < 0 ? 1 : 2)) % 3);
            }}
          >
            {[
              ["card-blood", "card-shopping-blue", "card-shirt"],
              ["card-surge", "card-orange", "card-lavender"],
              ["card-disposable"],
            ][cardPage]
              .flatMap((id) => state.cards.filter((card) => card.id === id))
              .map((card) => (
                <button
                  key={card.id}
                  onClick={() => state.openWalletCard(card.id)}
                >
                  <CardPreview card={card} />
                  <span>{card.name}</span>
                  <small>··{card.last4}</small>
                </button>
              ))}
          </motion.div>
          <div className="reference-carousel-dots">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                aria-label={`Card page ${index + 1}`}
                aria-pressed={index === cardPage}
                onClick={() => setCardPage(index)}
              />
            ))}
          </div>
        </section>
        <section className="reference-widget reference-wealth">
          <button
            className="reference-widget-title"
            onClick={() => state.setAccountsDrawerOpen(true)}
          >
            Total wealth <ChevronRight size={19} />
          </button>
          <strong>
            {formatCurrencyAmount(total, "RON", {
              showDecimalsIfZero: false,
            })}
          </strong>
          <p className="wealth-period">
            <span className={monthChange >= 0 ? "positive" : "negative"}>
              {monthChange >= 0 ? "▲" : "▼"}{" "}
              {formatCurrencyAmount(Math.abs(monthChange), "RON")}
            </span>{" "}
            · Past month
          </p>
          <button onClick={() => state.setAccountsDrawerOpen(true)}>
            <i>
              <Coins />
            </i>
            <span>Cash</span>
            <span>{formatCurrencyAmount(cash, "RON")}</span>
          </button>
          <button onClick={() => state.openTrade("SAVINGS")}>
            <i>
              <PiggyBank />
            </i>
            <span>
              Savings & Funds
              <small>
                Earn up to 4,25% p.a. with savings or invest in low-risk funds
              </small>
            </span>
            <ChevronRight />
          </button>
          {[
            {
              title: "Loan",
              desc: "Get a low-rate loan up to 200.000 lei",
              icon: "credit",
              color: "#c6dc06",
              action: () => onNavigate("credit"),
            },
            {
              title: "Invest",
              desc: "Invest for as little as 1 lei",
              icon: "line-chart",
              color: "#26aff0",
              action: () => onNavigate("invest"),
            },
            {
              title: "Crypto",
              desc: formatCurrencyAmount(wealth.crypto, "RON", {
                showDecimalsIfZero: false,
              }),
              icon: "bitcoin",
              color: "#ba4feb",
              action: () => onNavigate("cards"),
            },
            {
              title: "Linked",
              desc: "Link external accounts",
              icon: "link",
              color: "#21bdc6",
              action: () => state.setUiPanel("linked"),
            },
          ].map((item) => (
            <button key={item.title} onClick={item.action}>
              <i style={{ background: item.color }}>
                <OfficialIcon name={item.icon} />
              </i>
              <span>
                {item.title}
                <small>{item.desc}</small>
              </span>
              <ChevronRight />
            </button>
          ))}
        </section>
      </section>
    </div>
  );
}
