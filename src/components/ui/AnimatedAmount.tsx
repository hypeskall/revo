"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export function AnimatedAmount({
  value,
  cursor = false,
  placeholder = false,
}: {
  value: string;
  cursor?: boolean;
  placeholder?: boolean;
}) {
  const reduced = useReducedMotion();
  const remainder =
    placeholder && /[.,]/.test(value)
      ? "0".repeat(Math.max(0, 2 - value.split(/[.,]/).at(-1)!.length))
      : "";
  return (
    <span className="animated-amount" aria-label={value}>
      <AnimatePresence initial={false} mode="popLayout">
        {value.split("").map((digit, index) => (
          <motion.span
            aria-hidden="true"
            key={`${index}-${digit}`}
            layout={!reduced}
            initial={
              reduced ? false : { y: "45%", opacity: 0, filter: "blur(3px)" }
            }
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={
              reduced
                ? { opacity: 0 }
                : { y: "-45%", opacity: 0, filter: "blur(3px)" }
            }
            transition={{
              type: "spring",
              stiffness: 520,
              damping: 34,
              mass: 0.6,
            }}
          >
            {digit}
          </motion.span>
        ))}
      </AnimatePresence>
      {cursor && (
        <motion.i
          className="amount-cursor"
          animate={reduced ? {} : { opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      )}
      {remainder && (
        <span className="amount-placeholder" aria-hidden="true">
          {remainder}
        </span>
      )}
    </span>
  );
}
