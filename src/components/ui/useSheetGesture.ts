"use client";
import { useDragControls, useReducedMotion } from "framer-motion";
import type { PointerEvent } from "react";
import { gestureReturn, shouldDismissSheet } from "./motion";

export function useSheetGesture(onClose: () => void) {
  const controls = useDragControls();
  const reduced = useReducedMotion();
  return {
    props: {
      drag: reduced ? false as const : "y" as const,
      dragControls: controls,
      dragListener: false,
      dragMomentum: false,
      dragConstraints: { top: 0, bottom: 0 },
      dragElastic: { top: 0.025, bottom: 1 },
      dragTransition: gestureReturn,
      onDragEnd: (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
        if (shouldDismissSheet(info.offset.y, info.velocity.y)) onClose();
      },
    },
    handle: {
      "data-sheet-grab": true,
      onPointerDown: (event: PointerEvent<HTMLElement>) => { if (!reduced) controls.start(event); },
    },
  };
}
