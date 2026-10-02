"use client";
import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useRevolutStore } from "@/store/useRevolutStore";
import { LightRays } from "@/components/ui/LightRays";
import { FaceIdIsland } from "@/components/ui/FaceIdIsland";
export function WelcomeScreen({ onDone }: { onDone: () => void }) {
  const name = useRevolutStore((s) => s.profileName);
  const reduced = useReducedMotion();
  useEffect(() => {
    const timer = window.setTimeout(onDone, reduced ? 1000 : 5200);
    return () => window.clearTimeout(timer);
  }, [onDone, reduced]);
  return (
    <motion.section
      className="welcome-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: reduced ? 1 : 1.015 }}
      transition={{ duration: reduced ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Welcome"
    >
      <LightRays />
      <FaceIdIsland onComplete={onDone} />
      <motion.div
        className="welcome-identity"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <img src="/profile.png" alt="" />
        <h1>Nice to see you again, {name.split(" ")[0]}</h1>
      </motion.div>
    </motion.section>
  );
}
