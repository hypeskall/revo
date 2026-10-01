# Revo — Revolut-style Sandbox PWA

An interactive mobile prototype built with Next.js, Tailwind CSS, Framer Motion and Revolut's public icon geometry. Home opens the personal RON account. Home, Payments, chats, activity, Wallet, Add money and the simulated Apple Pay sheet follow the supplied iPhone screenshots, with English labels, Romanian RON number formatting and proportional sizing. This is a simulation, not a verified replica of every screen in the current Revolut app.

## Features

- **Entire navigation**: Home, Credit, Invest, Payments, Crypto and RevPoints share the profile/search header and a persistent glass dock. Credit includes a local repayment calculator. Invest/Crypto provide search, selected-asset buy/sell review, holdings and a separate validated crypto swap. RevPoints opens each reward category and updates saved points.
- **Motion and materials**: Animated amount digits, payment-to-chat transitions, message insertion, sheet entrance/exit, Apple Pay processing/completion and glass notification banners. Reduced-motion/transparency preferences have fallbacks. Motion timings are approximations.
- **Chats and transfers**: Reference history, revtags, text messages, stickers, requests that never debit funds, currency selection, transfer notes, review, scheduled payments and notifications. Bank recipients show a bank-style history and review with fictional account details.
- **Card/account controls**: Reference card previews, reveal/copy details, freeze/unfreeze, saved online/contactless toggles, card creation, currency switching and conserved movement between personal/joint balances.

- **Bills pocket**: Starts at €100.67. Add money from the EUR account and withdraw it back, with balance validation, saved activity, and a reset option. Accounts switches between the pocket and personal currency accounts.
- **RON presentation**: Opens with 1,796.46 lei, the supplied profile photo, and reference transaction/contact fixtures. No actual phone numbers, card credentials or friend account identifiers are included in the new fixtures.
- **Restored Add money**: Numeric keypad, decimal amounts, calculator operations, payment-method chooser and a cancellable simulated Apple Pay confirmation. Successful confirmation updates RON balance, activity and notifications.
- **Payments and Wallet**: Contacts open their own histories; new recipients can be added; scheduled payments execute while the app is open. Wallet lists live cards, supports creation and opens freeze/details controls.
- **Notifications and profile**: In-app banners, persistent history, read states, sound and notification preferences, plus opt-in browser notifications identifying the prototype.
- **Official favicon and installation icons**: Retrieved from Revolut's public asset server. Asset sources and typography limitations are documented in [docs/home-reference.md](docs/home-reference.md).

- **Account tools**: Search people and payments, inspect spending analytics, exchange using fixed demo rates, copy account details and download fictional statements.
- **Presentation settings**: Available from Profile to edit balances, add example transactions, toggle sounds and reset demo data.

## Sandbox behavior

All balances, cards, account details, payments, and investments are fictional and stored only in the browser. Reference entries are presentation fixtures. The lateral badge is removed; Profile identifies the project as a prototype. It does not connect to Revolut, a bank, Apple Pay, or any payment network. System notifications use the title “Revolut prototype”. Scheduling runs only while the app is open and catches up when it is next opened.

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
