"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import type { TabId } from "./BottomTabBar";

/** Keep the outgoing page opaque until the incoming page covers it. */
export function TabScenes({
  active,
  render,
}: {
  active: TabId;
  render: (tab: TabId) => ReactNode;
}) {
  const reduced = useReducedMotion();
  const [scenes, setScenes] = useState<TabId[]>([active]);
  const [previous, setPrevious] = useState<TabId | null>(null);
  const [current, setCurrent] = useState(active);
  // Synchronize before paint so there is never a frame with all scenes hidden.
  if (current !== active) {
    setPrevious(current);
    setCurrent(active);
    setScenes((items) => (items.includes(active) ? items : [...items, active]));
  }
  useEffect(() => {
    if (!previous) return;
    const timer = window.setTimeout(() => setPrevious(null), reduced ? 0 : 260);
    return () => window.clearTimeout(timer);
  }, [current, previous, reduced]);
  return (
    <>
      {scenes.map((id) => {
        const shown = id === current;
        const outgoing = id === previous;
        return (
          <motion.div
            key={id}
            data-tab-scene={id}
            data-active={shown}
            aria-hidden={!shown}
            ref={(node) => {
              if (node) node.inert = !shown;
            }}
            initial={id === "home" ? false : { opacity: 0 }}
            animate={{ opacity: shown || outgoing ? 1 : 0 }}
            transition={{
              duration: reduced || outgoing ? 0 : 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="tab-scene"
            style={{
              visibility: shown || outgoing ? "visible" : "hidden",
              zIndex: shown ? 2 : 1,
              pointerEvents: shown ? "auto" : "none",
            }}
          >
            {render(id)}
          </motion.div>
        );
      })}
    </>
  );
}
