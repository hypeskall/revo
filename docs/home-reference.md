# Home reference and asset sources

The Bills home layout follows the user-supplied 640 × 1136 screenshot. English replaces the original French labels. Sizing scales with the content width; navigation is available below the transaction card. The avatar is a demo profile. The sandbox marker remains visible and all balances and operations are local simulations.

## Public sources checked

- [Revolut: withdrawing from Pockets](https://help.revolut.com/en-FR/help/app-features/vaults/how-do-i-withdraw-money-from-my-personal-vault/) — withdrawing moves money back to the main account.
- [CoType: Revolut typography](https://cotypefoundry.com/fonts-in-use/revolut) — identifies Aeonik Pro as a Revolut typeface. No licensed Aeonik Pro files are supplied in this repository, so the dashboard uses Inter as a fallback. Exact typography parity is not claimed.
- [Official 32px favicon](https://assets.revolut.com/assets/favicons/favicon-32x32.png) — saved as `public/revolut-official-favicon.png`.
- [Official icon manifest](https://assets.revolut.com/assets/favicons/site.webmanifest) — provides the 192px and 512px installation icon URLs, saved as `public/icon-192.png` and `public/icon-512.png`.
- [Official Apple icon](https://assets.revolut.com/assets/favicons/apple-touch-icon.png) — saved as `public/apple-touch-icon.png`.

## Functional checks

Run `npm run check:sandbox` for validation, fund conservation, activity, persistence, and reset checks against the actual store.

Verify invalid and over-balance withdrawals are rejected; a €10 withdrawal reduces Bills by €10 and increases EUR by €10; adding €10 reverses that movement; both operations appear in activity; reset restores Bills to €100.67. Search must find the reference utility payment, Accounts must switch to EUR and back to Bills, and Cards must reflect freezing and unfreezing. Statements downloads a CSV containing fictional activity. Analytics totals transactions in one currency and excludes internal pocket movements.
