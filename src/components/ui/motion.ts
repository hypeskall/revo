export const screenSpring = { type: "spring" as const, stiffness: 310, damping: 34, mass: 1 };
export const sheetSpring = { type: "spring" as const, stiffness: 340, damping: 36, mass: 0.9 };
export const gestureReturn = { bounceStiffness: 420, bounceDamping: 38 };

export function shouldDismissSheet(offset: number, velocity: number) {
  return offset > 90 || (offset > 12 && offset + velocity * 0.16 > 140);
}
