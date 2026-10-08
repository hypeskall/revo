"use client";
import { useCallback, useEffect, useRef } from "react";

/** Motion retains ref callbacks, so synchronize interaction locks separately. */
export function useInertRef(blocked: boolean) {
  const element = useRef<HTMLElement | null>(null);
  const latest = useRef(blocked);
  latest.current = blocked;
  const ref = useCallback((node: HTMLElement | null) => {
    element.current = node;
    if (node) node.inert = latest.current;
  }, []);
  useEffect(() => {
    if (element.current) element.current.inert = blocked;
  }, [blocked]);
  return ref;
}
