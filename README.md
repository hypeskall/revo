# Revo — Revolut-style Sandbox PWA

An interactive mobile sandbox built with Next.js, Tailwind CSS, Framer Motion, and Lucide React. The default Bills pocket follows the supplied dashboard screenshot with English labels, a purple-to-black background, and proportional sizing. This is a simulation, not a verified replica of every screen in the current Revolut app.

## Features

- **Bills pocket**: Starts at €100.67. Add money from the EUR account and withdraw it back, with balance validation, saved activity, and a reset option. Accounts switches between the pocket and personal currency accounts.
- **Official favicon and installation icons**: Retrieved from Revolut's public asset server. Asset sources and typography limitations are documented in [docs/home-reference.md](docs/home-reference.md).

- **Revolut 10 Atmosphere**: Deep navy `#06090e` canvas with an animated volumetric cyan/blue aurora glow and lens flare horizon arc.
- **Horizontal Account Carousel**: Swipeable Framer Motion multi-currency cards (Personal RON, Personal EUR, All accounts, Savings, Loans) with spring physics and responsive pagination dots.
- **Persistent Floating Liquid Glass Dock**: Centered iOS glass pill navigation bar (`backdrop-blur-2xl bg-white/[0.12] border border-white/15 rounded-full`) that stays mounted across all tabs (Home, Invest, Payments, Crypto, RevPoints).
- **Curved Glass Transaction Feed**: Flat list with authentic contact avatars, outgoing/incoming badges, and vector brand logos (SimpleIcons).
- **Interactive Add Money & Apple Pay Simulator**: Numeric keypad with blinking currency cursor and Apple Pay bottom sheet authorization chime.
- **Transfers & Chat History**: Interactive contact chat threads (e.g. Rareș Roman) with real-time transfer bubbles and spring checkmark animations.
- **Dual-Currency Exchange Converter**: Simulated conversion between RON, EUR, USD, and GBP using fixed demo rates.
- **Digital Cards & Wallet**: Flip, unmask, and freeze debit cards (including the Red Drip virtual card).
- **Hidden God Mode**: Triple-tap or hold the profile avatar to override wallet balances, inject custom transactions, or reset data.
- **Live sandbox activity**: Simulated top-ups, transfers, and exchanges update balances and immediately appear in the Home activity feed.
- **Home tools**: Search people and payments, inspect spending analytics, copy fictional account details, and open Exchange, Cards, Statements, or Accounts from the More sheet.

## Sandbox behavior

All balances, cards, account details, payments, and investments are fictional and stored only in the browser. The interface carries a persistent `SANDBOX` marker and does not connect to Revolut, a bank, Apple Pay, or any payment network.

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
