"use client";
import { useEffect, useRef, useState } from "react";
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
  const sceneNodes = useRef<Partial<Record<TabId, HTMLDivElement | null>>>({});
  const order: TabId[] = ["home", "credit", "invest", "transfer", "cards", "hub"];
  const direction = previous && order.indexOf(current) < order.indexOf(previous) ? -1 : 1;
  // Synchronize before paint so there is never a frame with all scenes hidden.
  if (current !== active) {
    setPrevious(current);
    setCurrent(active);
    setScenes((items) => (items.includes(active) ? items : [...items, active]));
  }
  useEffect(() => {
    for (const [id, node] of Object.entries(sceneNodes.current)) {
      if (node) node.inert = id !== current;
    }
  }, [current]);
  useEffect(() => {
    if (!previous) return;
    const timer = window.setTimeout(() => setPrevious(null), reduced ? 0 : 340);
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
              sceneNodes.current[id] = node;
              if (node) node.inert = !shown;
            }}
            initial={id === "home" || reduced ? false : { opacity: 0, x: direction * 16, scale: 0.995 }}
            animate={{ opacity: shown || outgoing ? 1 : 0, x: reduced ? 0 : shown ? 0 : outgoing ? -direction * 10 : direction * 16, scale: shown || reduced ? 1 : 0.995 }}
            transition={{
              duration: reduced ? 0 : 0.3,
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
