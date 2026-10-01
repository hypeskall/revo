# Home reference and asset sources

The personal RON dashboard, Payments, Wallet, transaction history, Add money and Apple Pay confirmation follow the user-supplied iPhone screenshots. The profile image and Revolut glyph are copied unchanged from supplied files. The Bills pocket remains available in Accounts. English replaces French/Romanian interface formatting where applicable. Sizing scales with the content width, with one persistent navigation dock that includes Home. All operations are local simulations; Profile identifies the project as a prototype.

## Public sources checked

- [Revolut: withdrawing from Pockets](https://help.revolut.com/en-FR/help/app-features/vaults/how-do-i-withdraw-money-from-my-personal-vault/) — withdrawing moves money back to the main account.
- [CoType: Revolut typography](https://cotypefoundry.com/fonts-in-use/revolut) — identifies Aeonik Pro as a Revolut typeface. No licensed Aeonik Pro files are supplied in this repository, so the dashboard uses Inter as a fallback. Exact typography parity is not claimed.
- [Official 32px favicon](https://assets.revolut.com/assets/favicons/favicon-32x32.png) — saved as `public/revolut-official-favicon.png`.
- [Official icon manifest](https://assets.revolut.com/assets/favicons/site.webmanifest) — provides the 192px and 512px installation icon URLs, saved as `public/icon-192.png` and `public/icon-512.png`.
- [Official Apple icon](https://assets.revolut.com/assets/favicons/apple-touch-icon.png) — saved as `public/apple-touch-icon.png`.
- [Official notification settings](https://help.revolut.com/en-US/help/profile-and-plan/profile-plan/notifications/how-do-i-manage-my-notifications/) — documents Profile → Notification settings and distinguishes app preferences from device notifications.
- [Revolut's official design overview](https://www.revolut.com/blog/post/revolut-10/) — documents account switching and navigation. This 2023 article is background, not proof of exact 2026 layouts.
- [Apple's motion guidance](https://developer.apple.com/design/human-interface-guidelines/motion) — platform reference. Neither source supplies Revolut's current animation timings. Spring transitions and reduced-motion support are approximations, not verified native parity.

The supplied images determine layout. Merchant marks without individual supplied assets use local letter/icon placeholders, and card artwork is recreated in SVG/CSS. Aeonik Pro font files, exact native card artwork and undocumented menus remain limitations to a full carbon copy.

## Current screenshot and motion research

The newly supplied Payments, Briana chat, amount input, bank-transfer review and transfer-notification screenshots take priority over older design examples. Their six-tab dock includes Credit; initials are dark grey; chats use translucent payment bubbles over a blurred teal/blue horizon. RON uses Romanian separators while labels stay English.

- [Official Revolut icons package](https://www.npmjs.com/package/@revolut/icons): unchanged glyph paths from version 2.8.0 are vendored into `public/icons/revolut`, with its Apache-2.0 licence. That public package is not proof that every glyph matches the latest native release. Reproduce the import using `scripts/import-revolut-icons.cjs` after extracting the npm package into the ignored `.reference-cache/package` folder.
- [Revolut design team: Chat / Send money / Send Message](https://dribbble.com/shots/25740532-Chat-Send-money-Send-Message): direction for amount-to-bubble and composer-to-message motion. It does not provide native timings or prove current 2026 parity.
- [Revolut design team: Animated amount input](https://dribbble.com/shots/25131150-Animated-amount-input): digit transitions and fractional placeholders.
- [Recent user discussion of the glass dock](https://www.reddit.com/r/Revolut/comments/1tqbqog/bring_back_the_native_liquid_glass_bottom_bar/): May 2026 discussion, useful evidence that appearance varies between releases. The uploaded September screenshots control this implementation.
- [Apple materials guidance](https://developer.apple.com/design/human-interface-guidelines/materials): platform guidance for translucent material treatment. CSS blur/reflections approximate this; browser rendering does not reproduce iOS's native Liquid Glass compositor.
- [Official stock workflow](https://www.revolut.com/stocks/): select Stocks, search, enter the amount, review and submit. The prototype follows these steps with fixed fictional quotes.
- [Official crypto workflow](https://www.revolut.com/crypto/buy-crypto/): select a token, Buy/Sell, amount, review and confirm. No live price or exchange API is connected.
- [Official RevPoints redemptions](https://help.revolut.com/help/revpoints/what-is-revpoints/question-how-can-i-redeem-my-revpoints/): reward categories include miles, Stays, Experiences, gift cards and shopping. Prototype redemption prices are sample data, not official conversion rates.

All six existing sections and their local flows are covered. Unprovided screens are functional presentation layouts, not independently verified carbon copies. Native account onboarding, identity checks, camera QR scanning, real credit applications, insurance, bookings and financial network operations are not implemented. The project cannot honestly claim indistinguishability from the entire current native app.

## Functional checks

Run `npm run check:sandbox` for validation, fund conservation, activity, persistence, and reset checks against the actual store.

Verify invalid and over-balance withdrawals are rejected; a €10 withdrawal reduces Bills by €10 and increases EUR by €10; adding €10 reverses that movement; both operations appear in activity; reset restores Bills to €100.67. Search must find the reference utility payment, Accounts must switch to EUR and back to Bills, and Cards must reflect freezing and unfreezing. Statements downloads a CSV containing fictional activity. Analytics totals transactions in one currency and excludes internal pocket movements.
