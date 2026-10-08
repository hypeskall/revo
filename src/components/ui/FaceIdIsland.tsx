"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FaceIdAnimation } from "./FaceIdAnimation";

export function FaceIdIsland({ onComplete }: { onComplete: () => void }) {
  const [open, setOpen] = useState(true);
  const reduced = useReducedMotion();
  const callback = useRef(onComplete);
  callback.current = onComplete;
  useEffect(() => {
    const fallback = window.setTimeout(() => setOpen(false), reduced ? 600 : 4200);
    return () => {
      window.clearTimeout(fallback);
    };
  }, [reduced]);
  return (
    <div className="face-island-anchor" role="status" aria-label="Face ID">
      <AnimatePresence onExitComplete={() => callback.current()}>
        {open && (
          <motion.div
            className="face-island"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.12 }}
          >
            <FaceIdAnimation onComplete={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
