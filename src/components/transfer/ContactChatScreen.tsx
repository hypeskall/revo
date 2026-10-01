"use client";
import { CurrencyFlag } from "@/components/ui/CurrencyFlag";

import React, { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import { Contact, Currency } from "@/types";
import { useRevolutStore } from "@/store/useRevolutStore";
import { formatCurrencyAmount } from "@/utils/formatters";
import { AnimatedAmount } from "@/components/ui/AnimatedAmount";
import {
  BackGlyph,
  SendGlyph,
  RequestGlyph,
  CalendarGlyph,
  OfficialIcon,
} from "@/components/ui/ReferenceIcons";
import { ContactAvatar } from "./ContactAvatar";
import { sound } from "@/utils/audio";
import { useClosingScreen } from "@/components/ui/useClosingScreen";

export function ContactChatScreen({
  contact,
  onBack,
}: {
  contact: Contact;
  onBack: () => void;
}) {
  const state = useRevolutStore();
  const transition = useClosingScreen(onBack);
  const live = state.contacts.find((item) => item.id === contact.id) || contact;
  const reduced = useReducedMotion();
  const [stage, setStage] = useState<"chat" | "amount" | "review">("chat");
  const [mode, setMode] = useState<"send" | "request">("send");
  const [input, setInput] = useState("0");
  const [currency, setCurrency] = useState<Currency>(state.activeCurrency);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [accountsOpen, setAccountsOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [stickersOpen, setStickersOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [schedule, setSchedule] = useState("");
  const [morphId, setMorphId] = useState("");
  const [messageMorphId, setMessageMorphId] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feed = useRef<HTMLDivElement>(null);
  const amount = Number(input);
  const account = state.accounts[currency];
  const motionId = `payment-${contact.id}`;
  const spring = {
    type: "spring" as const,
    stiffness: 360,
    damping: 34,
    mass: 0.8,
  };
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  useEffect(() => {
    if (stage === "chat" && feed.current)
      feed.current.scrollTo({
        top: feed.current.scrollHeight,
        behavior: reduced ? "auto" : "smooth",
      });
  }, [stage, live.transfers.length, live.messages?.length, reduced]);
  const back = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setProcessing(false);
    setError("");
    if (stage === "chat") transition.close();
    else setStage(stage === "review" ? "amount" : "chat");
  };
  const start = (next: "send" | "request") => {
    setMode(next);
    setInput("0");
    setNote("");
    setError("");
    setStage("amount");
    setOptionsOpen(false);
    setMorphId("");
  };
  const digit = (value: string) => {
    if (processing) return;
    setError("");
    if (value === "delete") {
      setInput(input.length > 1 ? input.slice(0, -1) : "0");
      return;
    }
    if (value === ".") {
      if (!input.includes(".")) setInput(input + ".");
      return;
    }
    if (input === "0") setInput(value);
    else if (
      input.length < 11 &&
      (!input.includes(".") || input.split(".")[1].length < 2)
    )
      setInput(input + value);
  };
  const valid =
    Number.isFinite(amount) &&
    amount >= 0.01 &&
    (mode === "request" || amount <= account.balance);
  const validate = () => {
    if (!Number.isFinite(amount) || amount < 0.01) {
      setError("Enter at least 0.01");
      return false;
    }
    if (mode === "send" && amount > account.balance) {
      setError("Insufficient balance");
      return false;
    }
    return true;
  };
  const submitMessage = () => {
    if (!message.trim()) return;
    state.sendChatMessage(contact.id, message);
    const posted = useRevolutStore
      .getState()
      .contacts.find((item) => item.id === contact.id)
      ?.messages?.at(-1);
    setMessageMorphId(posted?.id || "");
    setMessage("");
    setStickersOpen(false);
  };
  const send = () => {
    if (processing || !validate()) return;
    if (mode === "request") {
      state.sendChatMessage(
        contact.id,
        note || "Payment request",
        amount,
        currency,
      );
      setStage("chat");
      return;
    }
    setProcessing(true);
    sound.playKeypadClick();
    timer.current = setTimeout(
      () => {
        timer.current = null;
        const result = useRevolutStore
          .getState()
          .sendTransfer(
            contact.id,
            amount,
            currency,
            note || "Sent from Revolut",
          );
        setProcessing(false);
        if (!result.success) {
          setError(result.error || "Transfer failed");
          return;
        }
        const payment = useRevolutStore
          .getState()
          .contacts.find((item) => item.id === contact.id)
          ?.transfers.at(-1);
        setMorphId(payment?.id || "");
        setStage("chat");
        sound.playSuccessSound();
      },
      reduced ? 100 : 650,
    );
  };
  const entries = [
    ...live.transfers.map((item) => ({
      kind: "payment" as const,
      item,
      time: item.rawDate || 0,
    })),
    ...(live.messages || []).map((item) => ({
      kind: "message" as const,
      item,
      time: item.rawDate,
    })),
  ].sort((a, b) => a.time - b.time);
  const header = (review = false) => (
    <header className="transfer-header">
      <button
        aria-label={
          stage === "chat"
            ? "Back to payments"
            : stage === "review"
              ? "Back to amount"
              : "Back to chat"
        }
        className="reference-back"
        onClick={back}
      >
        <BackGlyph />
      </button>
      <div>
        <h1>{review ? "Review transfer" : live.name}</h1>
        {!review && (
          <p>
            {live.revtag
              ? `@${live.revtag}`
              : live.badge === "Salt"
                ? "Salt Bank"
                : ""}
          </p>
        )}
      </div>
      {review ? (
        <span className="transfer-header-spacer" />
      ) : (
        <button
          aria-label="Recipient information"
          onClick={() => setOptionsOpen(!optionsOpen)}
        >
          <ContactAvatar contact={live} className="transfer-avatar" />
        </button>
      )}
    </header>
  );
  return (
    <LayoutGroup id={`chat-${contact.id}`}>
      <motion.section
        {...transition.props}
        onAnimationComplete={transition.finish}
        initial={reduced ? false : { x: "100%" }}
        animate={{ x: transition.closing ? "100%" : 0 }}
        transition={spring}
        role="dialog"
        aria-modal="true"
        className="reference-chat"
        aria-label={`Chat with ${live.name}`}
      >
        <div
          className="chat-content"
          aria-hidden={stage !== "chat"}
          ref={(node) => {
            if (node) node.inert = stage !== "chat";
          }}
        >
          {header()}
          <div ref={feed} className="chat-feed no-scrollbar">
            {entries.map((entry, index) => {
              const item = entry.item;
              const day =
                item.id === "reference-briana"
                  ? "Yesterday"
                  : item.id === "reference-rares"
                    ? "29 Sep"
                    : item.dateLabel;
              const previous = entries[index - 1]?.item;
              const previousDay =
                previous?.id === "reference-briana"
                  ? "Yesterday"
                  : previous?.id === "reference-rares"
                    ? "29 Sep"
                    : previous?.dateLabel;
              return (
                <React.Fragment key={item.id}>
                  {(!previous || previousDay !== day) && (
                    <p className="chat-date">{day}</p>
                  )}
                  {entry.kind === "payment" ? (
                    <motion.div
                      layout
                      layoutId={morphId === item.id ? motionId : undefined}
                      transition={spring}
                      initial={
                        morphId === item.id ? false : { opacity: 0, y: 12 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      className={`chat-payment ${entry.item.isSender ? "outgoing" : "incoming"}`}
                    >
                      <span className="chat-payment-label">
                        {entry.item.isSender ? <SendGlyph /> : <RequestGlyph />}
                        {entry.item.isSender ? "You sent" : "You received"}
                      </span>
                      <strong>
                        {formatCurrencyAmount(
                          entry.item.amount,
                          entry.item.currency,
                          { showDecimalsIfZero: false },
                        )}
                      </strong>
                      {entry.item.isSender && (
                        <p>{entry.item.note || "Sent from Revolut"}</p>
                      )}
                      <time>{entry.item.timeLabel}</time>
                    </motion.div>
                  ) : (
                    <motion.div
                      layout
                      layoutId={
                        messageMorphId === item.id
                          ? `message-${contact.id}`
                          : undefined
                      }
                      transition={spring}
                      className={`chat-message ${entry.item.isSender ? "outgoing" : "incoming"}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {entry.item.requestedAmount && (
                        <span className="chat-payment-label">
                          <RequestGlyph />
                          Requested{" "}
                          {formatCurrencyAmount(
                            entry.item.requestedAmount,
                            entry.item.currency || "RON",
                            { showDecimalsIfZero: false },
                          )}
                        </span>
                      )}
                      <span>{entry.item.text}</span>
                      <time>{entry.item.timeLabel}</time>
                    </motion.div>
                  )}
                </React.Fragment>
              );
            })}
            {!entries.length && (
              <p className="chat-empty">Start a conversation</p>
            )}
          </div>
          <footer className="chat-footer">
            <div className="chat-actions">
              {live.badge !== "Salt" && (
                <>
                  <button
                    aria-label="Payment options"
                    className="glass-control chat-split"
                    onClick={() => setOptionsOpen(!optionsOpen)}
                  >
                    <OfficialIcon name="arrow-split" />
                  </button>
                  <button
                    className="glass-control"
                    onClick={() => start("request")}
                  >
                    <RequestGlyph />
                    Request
                  </button>
                </>
              )}
              <button className="chat-send" onClick={() => start("send")}>
                <SendGlyph />
                Send
              </button>
            </div>
            {live.badge !== "Salt" && (
              <motion.form
                layoutId={message.trim() ? `message-${contact.id}` : undefined}
                className="chat-composer glass-control"
                onSubmit={(event) => {
                  event.preventDefault();
                  submitMessage();
                }}
              >
                <input
                  aria-label="Message"
                  value={message}
                  onChange={(event) => {
                    setMessage(event.target.value);
                    setMessageMorphId("");
                  }}
                  maxLength={2000}
                  placeholder="Type a message…"
                />
                {message.trim() ? (
                  <button aria-label="Send message">
                    <OfficialIcon name="send-message" />
                  </button>
                ) : (
                  <button
                    type="button"
                    aria-label="Stickers"
                    onClick={() => setStickersOpen(!stickersOpen)}
                  >
                    <OfficialIcon name="sticker" />
                  </button>
                )}
              </motion.form>
            )}
          </footer>
          {optionsOpen && (
            <div
              className="chat-options glass-control"
              role="dialog"
              aria-label="Payment options"
            >
              <button onClick={() => start("request")}>Split a bill</button>
              <button onClick={() => start("request")}>Request money</button>
              <button
                onClick={() => {
                  setOptionsOpen(false);
                  state.setUiPanel("scheduled");
                }}
              >
                Scheduled payments
              </button>
              <button onClick={() => setOptionsOpen(false)}>Close</button>
              <p>
                {live.name} · {live.badge === "Salt" ? "Salt Bank" : "Revolut"}
              </p>
            </div>
          )}
          {stickersOpen && (
            <div className="chat-stickers glass-control">
              {["👍", "❤️", "💸", "🎉", "🙏"].map((emoji) => (
                <button
                  key={emoji}
                  aria-label={`Sticker ${emoji}`}
                  onClick={() => {
                    state.sendChatMessage(contact.id, emoji);
                    setStickersOpen(false);
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
        <AnimatePresence initial={false}>
          {stage === "amount" && (
            <motion.section
              key="amount"
              role="dialog"
              aria-modal="true"
              aria-label={
                mode === "send" ? "Transfer amount" : "Request amount"
              }
              className="transfer-input"
              initial={reduced ? false : { y: "100%" }}
              animate={{ y: 0 }}
              exit={{ opacity: 0 }}
              transition={spring}
            >
              {header()}
              <div className="transfer-input-main">
                <motion.div
                  className="transfer-amount"
                  layoutId={motionId}
                  transition={spring}
                >
                  <AnimatedAmount
                    value={currency === "RON" ? input.replace(".", ",") : input}
                    cursor={input !== "0"}
                    placeholder
                  />
                  <span>{account.symbol}</span>
                </motion.div>
                <p className="transfer-no-fees">No fees</p>
                <button
                  className="transfer-account"
                  onClick={() => setAccountsOpen(true)}
                >
                  <CurrencyFlag currency={currency} />
                  Personal · {formatCurrencyAmount(account.balance, currency)}
                  <OfficialIcon name="arrow-dropdown" />
                </button>
                <label className="transfer-note">
                  <input
                    aria-label="Transfer note"
                    placeholder="Add note"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    maxLength={140}
                  />
                  <button
                    aria-label="Add payment emoji"
                    onClick={() => setNote(note + " 💸")}
                  >
                    <OfficialIcon name="palette" />
                  </button>
                </label>
              </div>
              {error && (
                <p role="alert" className="transfer-error">
                  {error}
                </p>
              )}
              <div className="transfer-continue">
                <button
                  aria-label="Schedule this transfer"
                  disabled={mode === "request"}
                  onClick={() => setScheduleOpen(true)}
                >
                  <CalendarGlyph />
                </button>
                <button
                  disabled={!valid || processing}
                  onClick={() => {
                    if (validate()) setStage("review");
                  }}
                >
                  Continue
                </button>
              </div>
              <div className="transfer-suggestions">
                {[10, 20, 50, 100].map((value) => (
                  <button
                    key={value}
                    onClick={() => {
                      setInput(String(value));
                      setError("");
                    }}
                  >
                    {value} {account.symbol}
                  </button>
                ))}
              </div>
              <div className="transfer-keypad">
                {[
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  ".",
                  "0",
                  "delete",
                ].map((value) => (
                  <motion.button
                    whileTap={
                      reduced
                        ? {}
                        : { scale: 0.9, backgroundColor: "#ffffff10" }
                    }
                    aria-label={
                      value === "delete"
                        ? "Delete digit"
                        : value === "."
                          ? "Decimal point"
                          : value
                    }
                    key={value}
                    onClick={() => digit(value)}
                  >
                    {value === "delete" ? (
                      <OfficialIcon name="arrow-backspace" />
                    ) : value === "." ? (
                      ","
                    ) : (
                      value
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.section>
          )}
          {stage === "review" && (
            <motion.section
              key="review"
              role="dialog"
              aria-modal="true"
              aria-label="Review transfer"
              className="transfer-review no-scrollbar"
              initial={reduced ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={{ opacity: 0 }}
              transition={spring}
            >
              {header(true)}
              <motion.div
                className="transfer-review-amount"
                layoutId={motionId}
                transition={spring}
              >
                <AnimatedAmount
                  value={formatCurrencyAmount(amount, currency, {
                    showDecimalsIfZero: false,
                  })}
                />
              </motion.div>
              <div className="transfer-review-content">
                <section className="transfer-recipient">
                  <ContactAvatar contact={live} />
                  <div>
                    <h2>{live.name}</h2>
                    <p>{live.name.toUpperCase()}</p>
                    {live.badge === "Salt" && (
                      <>
                        <p className="transfer-demo-iban">
                          RO00 DEMO 0000 0000 0000 0000
                        </p>
                        <p>Salt Bank</p>
                      </>
                    )}
                  </div>
                  <button
                    aria-label="Review recipient information"
                    onClick={() =>
                      setError(
                        "Recipient details are fictional presentation data.",
                      )
                    }
                  >
                    <OfficialIcon name="info" />
                  </button>
                </section>
                <section className="transfer-review-row">
                  <span>Estimated arrival</span>
                  <strong>Usually in seconds</strong>
                </section>
                <section className="transfer-reference">
                  <div>
                    <span>Reference</span>
                    <button
                      onClick={() => {
                        setStage("amount");
                      }}
                    >
                      <OfficialIcon name="pencil" />
                      Edit
                    </button>
                  </div>
                  <p>{note || "Sent from Revolut"}</p>
                </section>
                <section className="transfer-breakdown">
                  <div>
                    <span>
                      {mode === "request"
                        ? "Requested amount"
                        : "Recipient gets"}
                    </span>
                    <strong>
                      {formatCurrencyAmount(amount, currency, {
                        showDecimalsIfZero: false,
                      })}
                    </strong>
                  </div>
                  <div>
                    <span>Fees</span>
                    <strong>No fees</strong>
                  </div>
                  <div>
                    <span>Your total</span>
                    <strong>
                      {formatCurrencyAmount(amount, currency, {
                        showDecimalsIfZero: false,
                      })}
                    </strong>
                  </div>
                </section>
              </div>
              {error && (
                <p role="alert" className="transfer-error">
                  {error}
                </p>
              )}
              <button
                className="transfer-final-send"
                disabled={processing}
                onClick={send}
              >
                {processing ? (
                  <span role="status">Sending…</span>
                ) : mode === "request" ? (
                  "Request"
                ) : (
                  "Send"
                )}
              </button>
            </motion.section>
          )}
        </AnimatePresence>
        {accountsOpen && (
          <div className="transfer-choice-backdrop">
            <section
              className="transfer-choice"
              role="dialog"
              aria-label="Choose payment account"
            >
              <h2>Choose an account</h2>
              {(["RON", "EUR", "USD", "GBP"] as Currency[]).map((value) => (
                <button
                  key={value}
                  onClick={() => {
                    setCurrency(value);
                    setAccountsOpen(false);
                    setError("");
                  }}
                >
                  <CurrencyFlag currency={value} /> Personal ·{" "}
                  {formatCurrencyAmount(state.accounts[value].balance, value)}
                </button>
              ))}
              <button onClick={() => setAccountsOpen(false)}>Cancel</button>
            </section>
          </div>
        )}
        {scheduleOpen && (
          <div className="transfer-choice-backdrop">
            <form
              className="transfer-choice"
              role="dialog"
              aria-label="Schedule transfer"
              onSubmit={(event) => {
                event.preventDefault();
                const result = state.schedulePayment(
                  contact.id,
                  amount,
                  schedule,
                );
                if (result) setError(result);
                else {
                  setScheduleOpen(false);
                  setStage("chat");
                }
              }}
            >
              <h2>Schedule transfer</h2>
              <p>
                {formatCurrencyAmount(amount, currency)} to {live.name}
              </p>
              <input
                aria-label="Scheduled date and time"
                type="datetime-local"
                required
                value={schedule}
                onChange={(event) => setSchedule(event.target.value)}
              />
              <p>Scheduled payments use your RON account.</p>
              {error && (
                <p role="alert" className="transfer-error">
                  {error}
                </p>
              )}
              <button disabled={amount < 0.01 || currency !== "RON"}>
                Schedule
              </button>
              <button type="button" onClick={() => setScheduleOpen(false)}>
                Cancel
              </button>
            </form>
          </div>
        )}
      </motion.section>
    </LayoutGroup>
  );
}
