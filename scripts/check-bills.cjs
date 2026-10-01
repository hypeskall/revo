const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");

// Exercise the actual Zustand store with an isolated browser-storage substitute.
const saved = new Map();
global.localStorage = {
  getItem: (key) => saved.get(key) ?? null,
  setItem: (key, value) => saved.set(key, value),
  removeItem: (key) => saved.delete(key),
};
global.crypto = require("node:crypto").webcrypto;
const filename = path.resolve(__dirname, "../src/store/useRevolutStore.ts");
const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;
const loaded = new Module(filename, module);
loaded.paths = Module._nodeModulePaths(path.dirname(filename));
const fixturesFilename = path.resolve(__dirname, "../src/data/presentation.ts");
const fixtures = new Module(fixturesFilename, module);
fixtures._compile(
  ts.transpileModule(fs.readFileSync(fixturesFilename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText,
  fixturesFilename,
);
const assetsFilename = path.resolve(__dirname, "../src/data/assets.ts");
const assets = new Module(assetsFilename, module);
assets._compile(
  ts.transpileModule(fs.readFileSync(assetsFilename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText,
  assetsFilename,
);
loaded.require = function (name) {
  return name === "@/data/presentation"
    ? fixtures.exports
    : name === "@/data/assets"
      ? assets.exports
      : Module.prototype.require.call(this, name);
};
loaded._compile(compiled, filename);
const store = loaded.exports.useRevolutStore;
const totalCents = () =>
  Math.round(
    (store.getState().billsBalance + store.getState().accounts.EUR.balance) *
      100,
  );

async function check() {
  store.getState().resetToDefaults();
  const initial = store.getState();
  const initialCount = initial.transactions.length;
  const initialTotal = totalCents();
  assert.equal(initial.billsBalance, 100.67);

  for (const invalid of [0, -1, NaN, Infinity, 0.004, 100.68]) {
    assert.ok(store.getState().moveBillsMoney(invalid, true));
    assert.equal(totalCents(), initialTotal);
    assert.equal(store.getState().transactions.length, initialCount);
  }
  assert.ok(
    store.getState().moveBillsMoney(1, false),
    "Empty EUR source must reject a top-up",
  );
  assert.equal(store.getState().moveBillsMoney(10, true), null);
  assert.equal(store.getState().billsBalance, 90.67);
  assert.equal(
    store.getState().accounts.EUR.balance,
    initial.accounts.EUR.balance + 10,
  );
  assert.equal(
    totalCents(),
    initialTotal,
    "Withdrawal conserves combined funds",
  );
  assert.ok(
    store.getState().moveBillsMoney(10.01, false),
    "Cannot add more than EUR holds",
  );
  assert.equal(store.getState().moveBillsMoney(10, false), null);
  assert.equal(store.getState().billsBalance, 100.67);
  assert.equal(totalCents(), initialTotal, "Deposit conserves combined funds");
  assert.equal(store.getState().transactions.length, initialCount + 2);
  assert.equal(
    new Set(store.getState().transactions.map((tx) => tx.id)).size,
    initialCount + 2,
  );

  store.getState().moveBillsMoney(0.01, true);
  await store.persist.rehydrate();
  assert.equal(
    store.getState().billsBalance,
    100.66,
    "Pocket balance survives hydration",
  );
  assert.equal(totalCents(), initialTotal);
  store.getState().resetToDefaults();
  assert.equal(store.getState().billsBalance, 100.67);
  assert.equal(store.getState().homeAccount, "personal");
  assert.equal(store.getState().transactions.length, initialCount);

  const startRon = store.getState().accounts.RON.balance;
  for (const invalid of [NaN, Infinity, -100, 0, 0.004])
    store.getState().addMoney(invalid, "RON");
  assert.equal(store.getState().accounts.RON.balance, startRon);
  store.getState().addMoney(610, "RON");
  assert.equal(
    store.getState().accounts.RON.balance,
    Math.round((startRon + 610) * 100) / 100,
  );
  assert.equal(store.getState().transactions[0].amount, 610);
  assert.equal(store.getState().notifications[0].title, "Money added");
  assert.equal(
    store.getState().sendTransfer("missing", 10, "RON").success,
    false,
  );
  assert.equal(
    store.getState().sendTransfer("c-briana", -1, "RON").success,
    false,
  );
  const beforeTransfer = store.getState().accounts.RON.balance;
  assert.equal(
    store.getState().sendTransfer("c-briana", 10, "RON").success,
    true,
  );
  assert.equal(
    store.getState().accounts.RON.balance,
    Math.round((beforeTransfer - 10) * 100) / 100,
  );
  assert.equal(
    store
      .getState()
      .contacts.find((item) => item.id === "c-briana")
      .transfers.at(-1).amount,
    10,
  );
  const beforeTrade = store.getState().accounts.RON.balance;
  assert.equal(store.getState().tradeDemo("BTC", 25, false), null);
  assert.equal(
    Math.round(
      (store.getState().accounts.RON.balance +
        store.getState().demoHoldings.BTC) *
        100,
    ),
    Math.round(beforeTrade * 100),
  );
  assert.ok(store.getState().tradeDemo("BTC", 26, true));
  assert.equal(store.getState().tradeDemo("BTC", 25, true), null);
  assert.equal(store.getState().accounts.RON.balance, beforeTrade);
  for (const invalid of [0.004, NaN, Infinity, -1])
    assert.ok(store.getState().tradeDemo("BTC", invalid, false));
  assert.ok(store.getState().tradeDemo("unknown", 10, false));
  assert.equal(store.getState().tradeDemo("BTC", 25, false), null);
  const beforeSwap = store.getState().accounts.RON.balance;
  assert.ok(store.getState().swapHoldings("BTC", "BTC", 10));
  assert.ok(store.getState().swapHoldings("BTC", "ETH", 26));
  assert.ok(store.getState().swapHoldings("BTC", "ETH", NaN));
  assert.equal(store.getState().swapHoldings("BTC", "ETH", 10), null);
  assert.equal(store.getState().demoHoldings.BTC, 15);
  assert.equal(store.getState().demoHoldings.ETH, 10);
  assert.equal(
    store.getState().accounts.RON.balance,
    beforeSwap,
    "Swapping preserves cash and allocated funds",
  );
  const beforeMessage = store.getState().accounts.RON.balance;
  const messageCount = store
    .getState()
    .contacts.find((item) => item.id === "c-briana").messages.length;
  store.getState().sendChatMessage("c-briana", "");
  store.getState().sendChatMessage("c-briana", "Invalid request", -1);
  assert.equal(
    store.getState().contacts.find((item) => item.id === "c-briana").messages
      .length,
    messageCount,
  );
  store.getState().sendChatMessage("c-briana", "Presentation message");
  store.getState().sendChatMessage("c-briana", "Lunch", 12, "RON");
  assert.equal(
    store
      .getState()
      .contacts.find((item) => item.id === "c-briana")
      .messages.at(-1).requestedAmount,
    12,
  );
  assert.equal(
    store.getState().accounts.RON.balance,
    beforeMessage,
    "Messages and requests never move funds",
  );
  const jointTotal = Math.round(
    (store.getState().jointBalance + store.getState().accounts.RON.balance) *
      100,
  );
  assert.ok(store.getState().moveJointMoney(-1, false));
  assert.ok(store.getState().moveJointMoney(2, true));
  assert.equal(store.getState().moveJointMoney(10, false), null);
  assert.equal(store.getState().moveJointMoney(10, true), null);
  assert.equal(
    Math.round(
      (store.getState().jointBalance + store.getState().accounts.RON.balance) *
        100,
    ),
    jointTotal,
  );
  store.getState().setCardSetting("card-blood", "onlineEnabled", false);
  await store.persist.rehydrate();
  assert.equal(
    store.getState().cards.find((card) => card.id === "card-blood")
      .onlineEnabled,
    false,
  );
  assert.equal(
    store
      .getState()
      .contacts.find((item) => item.id === "c-briana")
      .messages.at(-1).text,
    "Lunch",
  );
  assert.equal(store.getState().demoHoldings.ETH, 10);
  const persisted = JSON.parse(saved.get("revolut_simulator_storage_v2"));
  saved.set(
    "revolut_simulator_storage_v2",
    JSON.stringify({ ...persisted, version: 3 }),
  );
  const preservedBalance = store.getState().accounts.RON.balance;
  await store.persist.rehydrate();
  const migrated = store
    .getState()
    .contacts.find((item) => item.id === "c-briana");
  assert.equal(
    store.getState().accounts.RON.balance,
    preservedBalance,
    "Migration preserves the saved balance",
  );
  assert.equal(migrated.revtag, "brianaf13");
  assert.equal(
    migrated.messages.at(-1).text,
    "Lunch",
    "Migration preserves custom messages",
  );
  assert.ok(
    migrated.transfers.some((item) => item.id.startsWith("ct-")),
    "Migration preserves custom payments",
  );
  assert.equal(
    new Set(migrated.transfers.map((item) => item.id)).size,
    migrated.transfers.length,
    "Migration does not duplicate fixtures",
  );
  assert.ok(store.getState().schedulePayment("c-briana", 10, "invalid"));
  assert.equal(
    store
      .getState()
      .schedulePayment(
        "c-briana",
        10,
        new Date(Date.now() + 60000).toISOString(),
      ),
    null,
  );
  store.setState({
    scheduledPayments: store.getState().scheduledPayments.map((item) => ({
      ...item,
      date: new Date(Date.now() - 1000).toISOString(),
    })),
  });
  const beforeScheduled = store.getState().accounts.RON.balance;
  store.getState().processScheduledPayments();
  store.getState().processScheduledPayments();
  assert.equal(
    store.getState().accounts.RON.balance,
    Math.round((beforeScheduled - 10) * 100) / 100,
    "A due payment executes only once",
  );
  assert.equal(store.getState().scheduledPayments[0].status, "completed");
  assert.ok(store.getState().redeemPoints(2000));
  assert.equal(store.getState().redeemPoints(500), null);
  assert.equal(store.getState().revPoints, 920);
  store.getState().markNotificationsRead();
  assert.ok(store.getState().notifications.every((item) => item.read));
  const cryptoBalance = store.getState().demoHoldings.ETH;
  const cashBeforeCrypto = store.getState().accounts.RON.balance;
  const historyBeforeCrypto = store.getState().cryptoActivity.length;
  for (const invalid of [NaN, Infinity, -1, 0, 0.001, cryptoBalance + 1])
    assert.ok(store.getState().transferCrypto("ETH", invalid, "c-rares"));
  assert.ok(store.getState().transferCrypto("AAPL", 1, "c-rares"));
  assert.ok(store.getState().transferCrypto("ETH", 1, "missing"));
  assert.equal(
    store.getState().cryptoActivity.length,
    historyBeforeCrypto,
    "Invalid crypto sends create no activity",
  );
  assert.equal(store.getState().transferCrypto("ETH", 1, "c-rares"), null);
  assert.equal(store.getState().demoHoldings.ETH, cryptoBalance - 1);
  assert.equal(
    store.getState().accounts.RON.balance,
    cashBeforeCrypto,
    "Sending crypto does not credit cash as a sale",
  );
  assert.equal(store.getState().cryptoActivity[0].value, -1);
  assert.equal(store.getState().cryptoActivity[0].title, "To Rareș Roman");
  assert.ok(store.getState().cryptoActivity[0].units < 0);
  store.getState().setProfileName("  Presentation Person  ");
  assert.equal(store.getState().profileName, "Presentation Person");
  store.getState().setProfileName(" ");
  assert.equal(store.getState().profileName, "Presentation Person");
  assert.equal(store.getState().tradeDemo("MON", 1, false), null);
  const savedCryptoHistory = store.getState().cryptoActivity.length;
  const persistedSnapshot = saved.get("revolut_simulator_storage_v2");
  store.setState({ profileName: "temporary", cryptoActivity: [] });
  saved.set("revolut_simulator_storage_v2", persistedSnapshot);
  await store.persist.rehydrate();
  assert.equal(store.getState().profileName, "Presentation Person");
  assert.equal(store.getState().cryptoActivity.length, savedCryptoHistory);
  assert.equal(store.getState().cryptoActivity[0].title, "RON → MON");
  assert.equal(store.getState().cryptoActivity[1].title, "To Rareș Roman");
  const migrationFixture = JSON.parse(persistedSnapshot);
  const reference = migrationFixture.state.transactions.find(
    (t) => t.id === "reference-carrefour",
  );
  assert.ok(reference);
  reference.rawDate = Date.UTC(2026, 8, 30, 21, 35);
  saved.set(
    "revolut_simulator_storage_v2",
    JSON.stringify({ ...migrationFixture, version: 4 }),
  );
  await store.persist.rehydrate();
  assert.equal(
    store.getState().transactions.find((t) => t.id === reference.id).rawDate,
    Date.parse("2026-09-30T21:35:00+03:00"),
    "Migration keeps reference payments in the correct Romanian calendar day",
  );
  assert.equal(
    store.getState().accounts.RON.balance,
    migrationFixture.state.accounts.RON.balance,
  );
  assert.equal(store.getState().cryptoActivity.length, savedCryptoHistory);
  store.getState().resetToDefaults();
  assert.equal(store.getState().accounts.RON.balance, 1796.46);
  assert.equal(store.getState().profileName, "Mihai");
  assert.equal(store.getState().cryptoActivity.length, 0);
  console.log(
    "Sandbox checks passed: top-ups, transfers, cancellation guards, holdings, schedules, notifications, persistence and reset.",
  );
}
check().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
