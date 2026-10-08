"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { OfficialIcon } from "@/components/ui/ReferenceIcons";
import { useClosingScreen } from "@/components/ui/useClosingScreen";
import { useRevolutStore } from "@/store/useRevolutStore";
import { presentationIban } from "@/data/account-details";
import { LightRays } from "@/components/ui/LightRays";
import { useSheetGesture } from "@/components/ui/useSheetGesture";

export function ReferenceProfile() {
  const state = useRevolutStore();
  const transition = useClosingScreen(() => state.setUiPanel(null));
  const gesture = useSheetGesture(transition.close);
  const [page, setPage] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setName] = useState(state.profileName);
  const [lock, setLock] = useState(false);
  const unreadChats = state.contacts.reduce(
    (sum, c) => sum + (c.unread || 0),
    0,
  );
  const unread = state.notifications.filter((n) => !n.read).length;
  const open = (next: string) => {
    setPage(next);
    setMessage("");
  };
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setMessage("Copied");
    } catch {
      setMessage(text);
    }
  };
  const menu = [
    {
      title: "Student benefits",
      desc: "Verify your student email",
      icon: "education",
      action: () => open("Student benefits"),
    },
    {
      title: "Invite friends",
      desc: "Earn 250 lei or more",
      icon: "envelope",
      action: () => open("Invite friends"),
    },
    {
      title: "Chats",
      icon: "chat",
      count: unreadChats,
      action: () => {
        state.setUiPanel(null);
        state.setTransferOpen(true);
      },
    },
    {
      title: "Inbox",
      icon: "megaphone",
      count: unread,
      action: () => state.setUiPanel("notifications"),
    },
    {
      title: "Personal info",
      icon: "profile",
      action: () => open("Personal info"),
    },
    {
      title: "Account details",
      icon: "bank",
      action: () => open("Account details"),
    },
    { title: "Security", icon: "shield", action: () => open("Security") },
    {
      title: "Notifications",
      icon: "bell",
      action: () => state.setUiPanel("notifications"),
    },
    {
      title: "Scheduled payments",
      icon: "calendar",
      action: () => state.setUiPanel("scheduled"),
    },
    {
      title: "Help",
      icon: "question-outline",
      action: () => state.setUiPanel("help"),
    },
    {
      title: "Presentation settings",
      icon: "gear",
      action: () => {
        state.setUiPanel(null);
        state.setGodModeOpen(true);
      },
    },
  ];
  return (
    <motion.section
      {...transition.props}
      {...gesture.props}
      onAnimationComplete={transition.finish}
      className="reference-profile-screen no-scrollbar"
      role="dialog"
      aria-modal="true"
      aria-label={page || "Profile"}
      initial={{ y: "100%" }}
      animate={{ y: transition.closing ? "100%" : 0 }}
      transition={{ type: "spring", stiffness: 340, damping: 34 }}
    >
      <LightRays theme="points" />
      <div {...gesture.handle} className="screen-sheet-grab" aria-hidden="true" />
      <header>
        <button
          className="reference-back"
          aria-label={page ? "Back to profile" : "Close profile"}
          onClick={() => (page ? setPage(null) : transition.close())}
        >
          <OfficialIcon name={page ? "back-button-arrow" : "cross"} />
        </button>
        {!page && (
          <button
            className="profile-upgrade glass-control"
            onClick={() => state.setUiPanel("plan")}
          >
            <OfficialIcon name="premium" />
            Upgrade
          </button>
        )}
      </header>
      <AnimatePresence mode="popLayout" initial={false} custom={page ? 1 : -1}>
      <motion.div className="profile-motion-pane" key={page || "profile"} custom={page ? 1 : -1} initial={{ opacity: 0, x: page ? 32 : -20 }} animate={{ opacity: 1, x: 0 }} variants={{ exit: (direction: number) => ({ opacity: 0, x: direction * -24 }) }} exit="exit" transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
      {!page ? (
        <>
          <div className="reference-profile-identity">
            <img src="/profile.png" alt="Profile" />
            <h1>{displayName}</h1>
            <button
              onClick={() => open("Revtag")}
              aria-label="Show your Revtag"
            >
              @mihai <OfficialIcon name="qr" />
            </button>
          </div>
          <button
            className="reference-profile-plan"
            onClick={() => state.setUiPanel("plan")}
          >
            <span>
              <strong>{state.selectedPlan}</strong>
              <small>View plan benefits</small>
            </span>
            <i>
              <OfficialIcon name="chevron-right" />
            </i>
          </button>
          <div className="reference-profile-menu">
            {menu.map((item) => (
              <button key={item.title} onClick={item.action}>
                <OfficialIcon name={item.icon} />
                <span>
                  {item.title}
                  {item.desc && <small>{item.desc}</small>}
                </span>
                {item.count ? <b>{item.count}</b> : null}
              </button>
            ))}
          </div>
          <p className="reference-prototype-note">
            Revolut interface prototype · All money and payment details are
            fictional.
          </p>
        </>
      ) : (
        <div className="reference-profile-subpage">
          <h1>{page}</h1>
          {page === "Student benefits" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setMessage(
                  "Student email saved for this presentation. No email was sent.",
                );
              }}
            >
              <p>Verify your student email</p>
              <input
                aria-label="Student email"
                placeholder="Student email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="presentation-primary">Continue</button>
            </form>
          )}
          {page === "Invite friends" && (
            <>
              <p>Invite your friends to explore your presentation.</p>
              <div className="profile-share-card">revo.local/invite/mihai</div>
              <button
                className="presentation-primary"
                onClick={() => copy("revo.local/invite/mihai")}
              >
                Copy invitation
              </button>
              <small>
                This sample invitation does not create a Revolut account.
              </small>
            </>
          )}
          {page === "Personal info" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                state.setProfileName(displayName);
                setMessage("Name updated for this presentation");
              }}
            >
              <label>
                Name
                <input
                  required
                  aria-label="Profile name"
                  value={displayName}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <button className="presentation-primary">Save</button>
            </form>
          )}
          {page === "Account details" && (
            <>
              {[
                { label: "Beneficiary", value: displayName },
                { label: "IBAN", value: presentationIban },
                { label: "BIC / SWIFT", value: "REVOROB1" },
              ].map((i) => (
                <button
                  className="profile-detail-row"
                  key={i.label}
                  onClick={() => copy(i.value)}
                >
                  <span>
                    <small>{i.label}</small>
                    {i.value}
                  </span>
                  <OfficialIcon name="copy" />
                </button>
              ))}
            </>
          )}
          {page === "Security" && (
            <>
              <label className="presentation-toggle">
                App lock preview
                <input
                  type="checkbox"
                  checked={lock}
                  onChange={(e) => {
                    setLock(e.target.checked);
                    setMessage(
                      e.target.checked
                        ? "App lock preview enabled"
                        : "App lock preview disabled",
                    );
                  }}
                />
              </label>
              <button
                className="profile-detail-row"
                onClick={() => setMessage("Current session · This device")}
              >
                <OfficialIcon name="smartphone" />
                Devices
              </button>
              <button
                className="profile-detail-row"
                onClick={() => {
                  state.setUiPanel(null);
                  state.setWalletOpen(true);
                }}
              >
                <OfficialIcon name="card-shield" />
                Card security
              </button>
              <p>
                The preview toggle does not secure this browser. Card controls
                open your saved card settings.
              </p>
            </>
          )}
          {page === "Revtag" && (
            <>
              <div className="profile-share-card">
                <OfficialIcon name="qr" />
                <strong>@mihai</strong>
              </div>
              <button
                className="presentation-primary"
                onClick={() => copy("@mihai")}
              >
                Copy Revtag
              </button>
            </>
          )}
          {message && <p role="status">{message}</p>}
        </div>
      )}
      </motion.div>
      </AnimatePresence>
    </motion.section>
  );
}
