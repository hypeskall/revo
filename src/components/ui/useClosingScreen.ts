"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function useClosingScreen(onClose: () => void) {
  const [closing, setClosing] = useState(false);
  const handler = useRef(onClose);
  handler.current = onClose;
  const completed = useRef(false);
  const reduced = useReducedMotion();
  const finish = () => {
    if (closing && !completed.current) {
      completed.current = true;
      handler.current();
    }
  };
  useEffect(() => {
    if (!closing) return;
    const timer = window.setTimeout(
      () => {
        if (!completed.current) {
          completed.current = true;
          handler.current();
        }
      },
      reduced ? 60 : 600,
    );
    return () => window.clearTimeout(timer);
  }, [closing, reduced]);
  return {
    closing,
    close: () => setClosing(true),
    finish,
    props: {
      "aria-hidden": closing,
      ref: (node: HTMLElement | null) => {
        if (node) node.inert = closing;
      },
    },
  };
}
