"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FaceIdAnimation } from "./FaceIdAnimation";

export function FaceIdIsland({ onComplete }: { onComplete: () => void }) {
  const [open, setOpen] = useState(true);
  const [scanning, setScanning] = useState(false);
  const reduced = useReducedMotion();
  const callback = useRef(onComplete);
  callback.current = onComplete;
  useEffect(() => {
    const start = window.setTimeout(() => setScanning(true), reduced ? 0 : 280);
    const fallback = window.setTimeout(() => setOpen(false), reduced ? 600 : 4200);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(fallback);
    };
  }, [reduced]);
  return (
    <div className="face-island-anchor" role="status" aria-label="Face ID">
      <AnimatePresence onExitComplete={() => callback.current()}>
        {open && (
          <motion.div
            className="face-island"
            initial={{ width: 126, height: 36, borderRadius: 24 }}
            animate={{ width: 164, height: 112, borderRadius: 32 }}
            exit={{ width: 126, height: 36, borderRadius: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 310, damping: 28 }}
          >
            {scanning && <FaceIdAnimation onComplete={() => setOpen(false)} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
