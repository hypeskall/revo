# Revo - 1:1 Revolut 10 Mobile Simulator PWA

An interactive, pixel-perfect mobile simulator of the Revolut 10 app built as a standalone Progressive Web App (PWA) using Next.js (App Router), Tailwind CSS, Framer Motion, and Lucide React.

## Features

- **Revolut 10 Atmosphere**: Deep navy `#06090e` canvas with an animated volumetric cyan/blue aurora glow and lens flare horizon arc.
- **Horizontal Account Carousel**: Swipeable Framer Motion multi-currency cards (Personal RON, Personal EUR, All accounts, Savings, Loans) with spring physics and responsive pagination dots.
- **Persistent Floating Liquid Glass Dock**: Centered iOS glass pill navigation bar (`backdrop-blur-2xl bg-white/[0.12] border border-white/15 rounded-full`) that stays mounted across all tabs (Home, Invest, Payments, Crypto, RevPoints).
- **Curved Glass Transaction Feed**: Flat list with authentic contact avatars, outgoing/incoming badges, and vector brand logos (SimpleIcons).
- **Interactive Add Money & Apple Pay Simulator**: Numeric keypad with blinking currency cursor and Apple Pay bottom sheet authorization chime.
- **Transfers & Chat History**: Interactive contact chat threads (e.g. Rareș Roman) with real-time transfer bubbles and spring checkmark animations.
- **Dual-Currency Exchange Converter**: Live pegged conversion between RON, EUR, USD, and GBP.
- **Digital Cards & Wallet**: Flip, unmask, and freeze debit cards (including the Red Drip virtual card).
- **Hidden God Mode**: Triple-tap or hold the profile avatar to override wallet balances, inject custom transactions, or reset data.

## Getting Started

### Installation

```bash
npm install
```

### Running Locally

```bash
npm run dev
# or for production build:
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser.
