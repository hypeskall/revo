"use client";
import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useRevolutStore } from "@/store/useRevolutStore";
import { LightRays } from "@/components/ui/LightRays";
export function WelcomeScreen({ onDone }: { onDone: () => void }) {
  const name = useRevolutStore((s) => s.profileName);
  const reduced = useReducedMotion();
  useEffect(() => {
    const timer = window.setTimeout(onDone, reduced ? 300 : 2100);
    return () => window.clearTimeout(timer);
  }, [onDone, reduced]);
  return (
    <motion.section
      className="welcome-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: reduced ? 1 : 1.04 }}
      transition={{ duration: 0.6 }}
      aria-label="Welcome"
    >
      <LightRays />
      <div className="welcome-orbit" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
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
