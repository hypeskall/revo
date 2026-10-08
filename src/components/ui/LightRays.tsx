"use client";
import { useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRevolutStore } from "@/store/useRevolutStore";
export function LightRays({
  theme = "home",
}: {
  theme?: "home" | "credit" | "invest" | "points" | "crypto";
}) {
  const id = useId().replace(/:/g, "");
  const palette = useRevolutStore((state) => state.lightPalette);
  return (
    <div className={`light-rays rays-${theme}`} aria-hidden="true">
      <AnimatePresence initial={false}>
      <motion.svg key={palette} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.65 }} viewBox="0 0 430 570" preserveAspectRatio="xMidYMin slice">
        <defs>
          <filter
            id={`glow-${id}`}
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur stdDeviation="19" />
          </filter>
          <filter
            id={`core-${id}`}
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur stdDeviation="2.6" />
          </filter>
          <linearGradient id={`color-${id}-${palette}`}>
            <stop
              stopColor={
                palette === "teal" ? "#0cbfaa" : theme === "points" || theme === "credit" ? "#d80fff" : "#2874ff"
              }
            />
            <stop
              offset=".6"
              stopColor={palette === "teal" ? "#54ffe2" : theme === "points" ? "#e226ff" : "#29dfeb"}
            />
            <stop
              offset="1"
              stopColor={palette === "teal" ? "#078e99" : theme === "invest" ? "#15e4a2" : "#6266ff"}
            />
          </linearGradient>
        </defs>
        <g fill="none">
          <g
            stroke={`url(#color-${id}-${palette})`}
            strokeWidth="46"
            filter={`url(#glow-${id})`}
          >
            <path
              d={
                theme === "home"
                  ? "M-70 275 Q210 420 505 285"
                  : theme === "invest"
                    ? "M-60 235L250 -60 M170 570L490 225"
                    : theme === "credit"
                      ? "M-60 280Q190 410 510 290 M370 -60Q290 280 220 520"
                      : theme === "points"
                        ? "M-50 215Q210 395 500 205 M-60 330Q210 490 505 335"
                        : "M-60 -30Q320 50 345 220L440 575"
              }
            />
          </g>
          <path
            stroke="#eeffff"
            strokeWidth="8"
            filter={`url(#core-${id})`}
            d={
              theme === "home"
                ? "M-70 275 Q210 420 505 285"
                : theme === "invest"
                  ? "M-60 235L250 -60 M170 570L490 225"
                  : theme === "credit"
                    ? "M-60 280Q190 410 510 290 M370 -60Q290 280 220 520"
                    : theme === "points"
                      ? "M-50 215Q210 395 500 205 M-60 330Q210 490 505 335"
                      : "M-60 -30Q320 50 345 220L440 575"
            }
          />
        </g>
      </motion.svg>
      </AnimatePresence>
    </div>
  );
}
