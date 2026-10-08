"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Bell,
  Check,
  ChevronRight,
  Settings,
  HelpCircle,
  UserPlus,
  Calendar,
  CreditCard,
  X,
} from "@/components/ui/OfficialIcons";
import { useRevolutStore } from "@/store/useRevolutStore";
import { ReferenceActivity } from "./ReferenceActivity";
import { formatCurrencyAmount } from "@/utils/formatters";
import { TradePanel } from "@/components/invest/TradePanel";
import { useClosingScreen } from "@/components/ui/useClosingScreen";
import { gestureReturn } from "@/components/ui/motion";
import { ReferenceProfile } from "./ReferenceProfile";
import { PlanScreen } from "./PlanScreen";
export function PresentationPanels({
  panel,
}: {
  panel: NonNullable<ReturnType<typeof useRevolutStore.getState>["uiPanel"]>;
}) {
  const state = useRevolutStore();
  const transition = useClosingScreen(() => state.setUiPanel(null), true);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("100");
  const [message, setMessage] = useState("");
  const [contactId, setContactId] = useState("c-briana");
  const [date, setDate] = useState("");
  const [browserStatus, setBrowserStatus] = useState("");
  const [helpQuery, setHelpQuery] = useState("");
  useEffect(() => {
    setMessage("");
  }, [panel]);
  if (panel === "activity") return <ReferenceActivity />;
  if (panel === "profile") return <ReferenceProfile />;
  if (panel === "plan") return <PlanScreen />;
  if (panel === "invest" || panel === "crypto")
    return <TradePanel kind={panel} />;
  const titles = {
    profile: "Profile",
    notifications: "Notifications",
    scheduled: "Scheduled payments",
    "new-contact": "Add recipient",
    help: "Help",
    invest: "Invest",
    crypto: "Crypto",
    rewards: "RevPoints",
    plan: "Your plan",
    joint: "Maria · Joint account",
    accounts: "Add new account",
    linked: "Linked accounts",
    stays: "Stays",
  };
  const field = "w-full bg-white/10 rounded-xl p-3 text-white outline-none";
  return (
    <motion.section
      {...transition.props}
      onAnimationComplete={transition.finish}
      key={panel}
      role="dialog"
      aria-modal="true"
      aria-label={titles[panel]}
      initial={{ x: "100%" }}
      animate={{ x: transition.closing ? "100%" : 0 }}
      transition={{ type: "spring", stiffness: 340, damping: 34 }}
      className="presentation-panel no-scrollbar"
    >
      <header>
        <button
          className="reference-back"
          aria-label="Close menu"
          onClick={() => transition.close()}
        >
          <ArrowLeft />
        </button>
        <h1>{titles[panel]}</h1>
      </header>
      {panel === "linked" && (
        <>
          <p className="text-white/60">
            Explore a sample external account. This does not connect to your
            bank.
          </p>
          <label className="block mt-5">
            Bank name
            <input
              className={field}
              aria-label="Linked bank name"
              placeholder="Bank name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <button
            className="presentation-primary mt-5"
            disabled={!name.trim()}
            onClick={() =>
              setMessage(
                `${name.trim()} · Preview added. No external bank is connected.`,
              )
            }
          >
            Add sample account
          </button>
        </>
      )}
      {panel === "stays" && (
        <>
          <h2 className="text-3xl mb-5">A place for your next trip</h2>
          <p className="text-white/60">
            Explore Stays rewards using your saved points.
          </p>
          <div className="profile-share-card">
            Stays reward · 1.000 points
            <br />
            Available: {state.revPoints} points
          </div>
          <button
            className="presentation-primary"
            disabled={message === "Reward redeemed"}
            onClick={() =>
              setMessage(state.redeemPoints(1000) || "Reward redeemed")
            }
          >
            Redeem 1.000 points
          </button>
          <p className="text-sm text-white/40 mt-5">
            Presentation reward. No accommodation is booked.
          </p>
        </>
      )}
      {panel === "joint" && (
        <div className="space-y-5">
          <h2 className="text-4xl">
            {formatCurrencyAmount(state.jointBalance, "RON")}
          </h2>
          <p className="text-white/50">Joint balance · RON</p>
          <label className="block">
            Amount
            <input
              aria-label="Joint account amount"
              type="number"
              min=".01"
              step=".01"
              className={field}
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </label>
          <button
            className="presentation-primary"
            onClick={() =>
              setMessage(
                state.moveJointMoney(Number(amount), false) ||
                  "Money added to joint account",
              )
            }
          >
            Add money
          </button>
          <button
            className={field}
            onClick={() =>
              setMessage(
                state.moveJointMoney(Number(amount), true) ||
                  "Money moved to Personal RON",
              )
            }
          >
            Withdraw
          </button>
        </div>
      )}
      {panel === "accounts" && (
        <>
          <p className="text-white/50 mb-5">
            Choose a currency account or open your Bills pocket.
          </p>
          {Object.values(state.accounts).map((account) => (
            <button
              key={account.id}
              className="presentation-notification"
              onClick={() => {
                state.setActiveCurrency(account.currency);
                state.setHomeAccount("personal");
                transition.close();
              }}
            >
              <span>
                {account.flag} {account.name}
                <small>{account.code} · Account available</small>
              </span>
              <ChevronRight />
            </button>
          ))}
          <button
            className="presentation-notification"
            onClick={() => {
              state.setHomeAccount("bills");
              transition.close();
            }}
          >
            <span>
              Bills<small>EUR pocket</small>
            </span>
            <ChevronRight />
          </button>
          <button
            className="presentation-notification"
            onClick={() => state.setUiPanel("joint")}
          >
            <span>
              Joint account<small>Maria · RON</small>
            </span>
            <ChevronRight />
          </button>
        </>
      )}
      {panel === "notifications" && (
        <>
          <label className="presentation-toggle">
            Payment notifications
            <input
              type="checkbox"
              checked={state.notificationsEnabled}
              onChange={(event) =>
                state.setNotificationsEnabled(event.target.checked)
              }
            />
          </label>
          <label className="presentation-toggle">
            Notification sounds
            <input
              type="checkbox"
              checked={state.soundEnabled}
              onChange={(event) => state.setSoundEnabled(event.target.checked)}
            />
          </label>
          <div className="flex gap-3 my-5">
            <button
              className={field}
              onClick={() => state.markNotificationsRead()}
            >
              Mark all read
            </button>
            <button
              className={field}
              onClick={() =>
                state.notify(
                  "Test notification",
                  "Your in-app notifications are working.",
                )
              }
            >
              Send test
            </button>
          </div>
          <button
            className="text-blue-300 text-sm mb-4"
            onClick={async () => {
              if (!("Notification" in window)) {
                setBrowserStatus(
                  "This browser does not support system notifications. In-app notifications are available.",
                );
                return;
              }
              const permission = await Notification.requestPermission();
              setBrowserStatus(
                permission === "granted"
                  ? "System notifications enabled."
                  : "Permission was not granted.",
              );
              if (permission === "granted")
                new Notification("Revolut prototype", {
                  body: "This is a demo notification.",
                  icon: "/icon-192.png",
                });
            }}
          >
            Enable browser notifications
          </button>
          {browserStatus && (
            <p className="text-white/50 text-sm mb-4">{browserStatus}</p>
          )}
          {state.notifications.map((item) => (
            <button
              className="presentation-notification"
              key={item.id}
              onClick={() => {
                state.markNotificationsRead();
                state.setUiPanel("activity");
              }}
            >
              <Bell />
              <span>
                <strong>{item.title}</strong>
                <small>{item.message}</small>
              </span>
              {!item.read && <i />}
            </button>
          ))}
        </>
      )}
      {panel === "new-contact" && (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!name.trim()) return;
            state.addContact(name);
            setName("");
            setMessage("Recipient added");
          }}
        >
          <label className="block">
            Name
            <input
              className={field + " mt-2"}
              aria-label="Recipient name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>
          <button className="presentation-primary">Add recipient</button>
        </form>
      )}
      {panel === "scheduled" && (
        <>
          <div className="space-y-4">
            <label className="block">
              Recipient
              <select
                className={field + " mt-2"}
                value={contactId}
                onChange={(event) => setContactId(event.target.value)}
              >
                {state.contacts.map((contact) => (
                  <option
                    className="bg-[#222]"
                    key={contact.id}
                    value={contact.id}
                  >
                    {contact.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              Amount in RON
              <input
                className={field + " mt-2"}
                type="number"
                min=".01"
                step=".01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </label>
            <label className="block">
              Date and time
              <input
                className={field + " mt-2"}
                type="datetime-local"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </label>
            <button
              className="presentation-primary"
              onClick={() =>
                setMessage(
                  state.schedulePayment(contactId, Number(amount), date) ||
                    "Payment scheduled",
                )
              }
            >
              Schedule payment
            </button>
          </div>
          <div className="mt-6 space-y-4">
            {state.scheduledPayments.map((item) => (
              <div key={item.id} className={field}>
                <p>
                  {
                    state.contacts.find(
                      (contact) => contact.id === item.contactId,
                    )?.name
                  }{" "}
                  · {item.amount} RON
                </p>
                <p className="text-white/50 text-sm">
                  {new Date(item.date).toLocaleString("en-GB")} · {item.status}
                </p>
                {item.status === "scheduled" && (
                  <button
                    className="text-blue-300 mt-3"
                    onClick={() => state.cancelScheduledPayment(item.id)}
                  >
                    Cancel payment
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      {panel === "rewards" && (
        <>
          <h2 className="text-4xl mb-5">{state.revPoints} points</h2>
          <p className="text-white/50 mb-5">
            Choose a reward for your presentation.
          </p>
          {[
            { label: "Shopping discount", points: 500 },
            { label: "Travel reward", points: 1000 },
          ].map((reward) => (
            <button
              className="presentation-notification"
              key={reward.label}
              onClick={() =>
                setMessage(
                  state.redeemPoints(reward.points) ||
                    `${reward.label} redeemed`,
                )
              }
            >
              <span>
                <strong>{reward.label}</strong>
                <small>{reward.points} points</small>
              </span>
              <ChevronRight />
            </button>
          ))}
        </>
      )}
      {panel === "help" && (
        <>
          <input
            aria-label="Search help"
            className={field}
            value={helpQuery}
            onChange={(event) => setHelpQuery(event.target.value)}
            placeholder="Search help"
          />
          {[
            {
              title: "Adding money",
              body: "Open Home → Add money, enter an amount, choose Apple Pay and confirm the demo payment.",
            },
            {
              title: "Transfers",
              body: "Open Payments and select a recipient. Amounts move only within this prototype.",
            },
            {
              title: "Notifications",
              body: "Profile → Notifications contains the notification history and preferences.",
            },
            {
              title: "About this project",
              body: "This presentation reproduces supplied interface references. It has no connection to banking or payment networks.",
            },
          ]
            .filter((item) =>
              (item.title + item.body)
                .toLowerCase()
                .includes(helpQuery.toLowerCase()),
            )
            .map((item) => (
              <details
                className="bg-white/5 rounded-2xl p-4 my-4"
                key={item.title}
              >
                <summary>{item.title}</summary>
                <p className="text-white/50 mt-3 text-sm">{item.body}</p>
              </details>
            ))}
        </>
      )}
      {message && (
        <p role="status" className="my-5 text-blue-300">
          {message}
        </p>
      )}
    </motion.section>
  );
}
export function NotificationToast() {
  const state = useRevolutStore();
  const latest = state.notifications[0];
  const [visible, setVisible] = useState(false);
  const [dismissal, setDismissal] = useState<"up" | "left" | "right">("up");
  const timer = useRef<number | null>(null);
  const dragged = useRef(false);
  const dismiss = (direction: typeof dismissal = "up") => {
    if (timer.current) clearTimeout(timer.current);
    setDismissal(direction);
    setVisible(false);
  };
  useEffect(() => {
    if (
      latest &&
      !latest.read &&
      Date.now() - latest.timestamp < 1000 &&
      state.notificationsEnabled
    ) {
      setVisible(true);
      setDismissal("up");
      dragged.current = false;
      timer.current = window.setTimeout(() => setVisible(false), 4500);
      if ("Notification" in window && Notification.permission === "granted")
        new Notification("Revolut prototype", {
          body: latest.message,
          icon: "/icon-192.png",
        });
      return () => { if (timer.current) clearTimeout(timer.current); };
    }
    setVisible(false);
  }, [latest?.id, latest?.read, state.notificationsEnabled]);
  return (
    <AnimatePresence custom={dismissal}>
      {visible && latest && (
        <motion.aside
          key={latest.id}
          initial={{ y: -160, opacity: 1 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          variants={{ exit: (direction: typeof dismissal) => ({
            x: direction === "left" ? -460 : direction === "right" ? 460 : 0,
            y: direction === "up" ? -160 : 0,
            opacity: [1, 1, 0], scale: 1,
            transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1], opacity: { times: [0, 0.65, 1] } },
          }) }}
          exit="exit"
          transition={{
            type: "spring",
            stiffness: 390,
            damping: 38,
            mass: 0.85,
          }}
          drag
          dragDirectionLock
          dragMomentum={false}
          dragTransition={gestureReturn}
          dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
          dragElastic={{ top: 1, bottom: 0.08, left: 1, right: 1 }}
          onPointerDown={() => { dragged.current = false; }}
          onDragStart={() => {
            dragged.current = true;
            if (timer.current) clearTimeout(timer.current);
          }}
          onDragEnd={(_, info) => {
            if (Math.abs(info.offset.x) > 45 || Math.abs(info.velocity.x) > 400)
              dismiss(info.offset.x < 0 || (Math.abs(info.offset.x) < 10 && info.velocity.x < 0) ? "left" : "right");
            else if (info.offset.y < -24 || info.velocity.y < -300) dismiss();
            else timer.current = window.setTimeout(() => setVisible(false), 4500);
          }}
          className="reference-toast"
          role="status"
        >
          <img className="notification-app-icon" src="/icon-192.png" alt="" />
          <button
            className="flex-1 text-left"
            onClick={() => {
              if (dragged.current) return;
              dismiss();
              state.setUiPanel("notifications");
            }}
          >
            <div className="notification-heading">
              <strong>Revolut</strong>
              <time>now</time>
            </div>
            <span>
              <b>{latest.title}</b>
              {latest.message}
            </span>
          </button>
          <button
            aria-label="Dismiss notification"
            onClick={() => { if (!dragged.current) dismiss(); }}
          >
            <X size={18} />
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
