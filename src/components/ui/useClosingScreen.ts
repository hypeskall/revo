"use client";
import { useEffect, useRef, useState } from "react";
import { useDragControls, useReducedMotion } from "framer-motion";
import type { PointerEvent } from "react";
import { gestureReturn } from "./motion";
import { useInertRef } from "./useInertRef";

export function useClosingScreen(onClose: () => void, swipeBack = false) {
  const [closing, setClosing] = useState(false);
  const inertRef = useInertRef(closing);
  const handler = useRef(onClose);
  handler.current = onClose;
  const completed = useRef(false);
  const reduced = useReducedMotion();
  const dragControls = useDragControls();
  const width = useRef(430);
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
      ...(swipeBack ? {
        drag: "x" as const,
        dragControls,
        dragListener: false,
        dragMomentum: false,
        dragConstraints: { left: 0, right: 0 },
        dragElastic: { left: 0, right: 1 },
        dragTransition: gestureReturn,
        "data-swipe-back": true,
        onPointerDown: (event: PointerEvent<HTMLElement>) => {
          if (closing || reduced || event.button !== 0) return;
          const target = event.target as HTMLElement;
          if (target.closest('input, textarea, select, [data-no-back-swipe]')) return;
          if (target.closest('[role="dialog"]') !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX - bounds.left > 28) return;
          width.current = bounds.width;
          dragControls.start(event);
        },
        onDragEnd: (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
          const projected = info.offset.x + Math.max(0, info.velocity.x) * 0.18;
          if (info.offset.x > 12 && projected > width.current * 0.34) setClosing(true);
        },
      } : {}),
      "aria-hidden": closing,
      ref: inertRef,
    },
  };
}
