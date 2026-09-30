const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

// Exercise the actual Zustand store with an isolated browser-storage substitute.
const saved = new Map();
global.localStorage = {
  getItem: (key) => saved.get(key) ?? null,
  setItem: (key, value) => saved.set(key, value),
  removeItem: (key) => saved.delete(key),
};
global.crypto = require('node:crypto').webcrypto;
const filename = path.resolve(__dirname, '../src/store/useRevolutStore.ts');
const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const loaded = new Module(filename, module);
loaded.paths = Module._nodeModulePaths(path.dirname(filename));
loaded._compile(compiled, filename);
const store = loaded.exports.useRevolutStore;
const totalCents = () => Math.round((store.getState().billsBalance + store.getState().accounts.EUR.balance) * 100);

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
  assert.ok(store.getState().moveBillsMoney(1, false), 'Empty EUR source must reject a top-up');
  assert.equal(store.getState().moveBillsMoney(10, true), null);
  assert.equal(store.getState().billsBalance, 90.67);
  assert.equal(store.getState().accounts.EUR.balance, initial.accounts.EUR.balance + 10);
  assert.equal(totalCents(), initialTotal, 'Withdrawal conserves combined funds');
  assert.ok(store.getState().moveBillsMoney(10.01, false), 'Cannot add more than EUR holds');
  assert.equal(store.getState().moveBillsMoney(10, false), null);
  assert.equal(store.getState().billsBalance, 100.67);
  assert.equal(totalCents(), initialTotal, 'Deposit conserves combined funds');
  assert.equal(store.getState().transactions.length, initialCount + 2);
  assert.equal(new Set(store.getState().transactions.map(tx => tx.id)).size, initialCount + 2);

  store.getState().moveBillsMoney(0.01, true);
  await store.persist.rehydrate();
  assert.equal(store.getState().billsBalance, 100.66, 'Pocket balance survives hydration');
  assert.equal(totalCents(), initialTotal);
  store.getState().resetToDefaults();
  assert.equal(store.getState().billsBalance, 100.67);
  assert.equal(store.getState().homeAccount, 'bills');
  assert.equal(store.getState().transactions.length, initialCount);
  console.log('Bills checks passed: validation, conservation, activity, persistence and reset.');
}
check().catch(error => { console.error(error); process.exitCode = 1; });
