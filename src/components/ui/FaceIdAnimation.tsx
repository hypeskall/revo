"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { AnimationItem } from "lottie-web";
import animationData from "../../../public/animations/face-id.json";

/** The user's linked, licensed recreation. This is decorative, not authentication. */
export function FaceIdAnimation({ onComplete }: { onComplete?: () => void }) {
  const container = useRef<HTMLDivElement>(null);
  const complete = useRef(onComplete);
  complete.current = onComplete;
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let disposed = false;
    let player: AnimationItem | undefined;
    let hold: number | undefined;
    const finish = () => {
      hold = window.setTimeout(() => complete.current?.(), 180);
    };
    if (reduced) {
      hold = window.setTimeout(() => complete.current?.(), 300);
      return () => window.clearTimeout(hold);
    }
    import("lottie-web")
      .then(({ default: lottie }) => {
        if (disposed || !container.current) return;
        player = lottie.loadAnimation({
          container: container.current,
          renderer: "svg",
          loop: false,
          autoplay: false,
          animationData: JSON.parse(JSON.stringify(animationData)),
          rendererSettings: {
            preserveAspectRatio: "xMidYMid meet",
            progressiveLoad: false,
          },
        });
        player.addEventListener("DOMLoaded", () => {
          if (disposed) return;
          setReady(true);
          player?.play();
        });
        player.addEventListener("complete", finish);
      })
      .catch(() => {
        /* The static face and welcome timeout remain usable offline. */
      });
    return () => {
      disposed = true;
      window.clearTimeout(hold);
      player?.destroy();
    };
  }, [reduced]);
  return (
    <div className="face-id-animation" aria-hidden="true">
      {!ready && (
        <svg
          className="face-id-fallback"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        >
          <path d="M28 10H20Q10 10 10 20v8 M72 10h8q10 0 10 10v8 M90 72v8q0 10-10 10h-8 M28 90h-8Q10 90 10 80v-8 M34 36v8 M66 36v8 M51 36v19q0 6-7 6 M34 69q16 14 32 0" />
        </svg>
      )}
      <div
        ref={container}
        className={ready ? "face-id-player ready" : "face-id-player"}
      />
    </div>
  );
}
