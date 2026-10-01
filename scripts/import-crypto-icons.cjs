const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
async function main() {
  const dir = path.resolve(__dirname, "../public/icons/crypto");
  fs.mkdirSync(dir, { recursive: true });
  for (const token of [
    "BTC",
    "ETH",
    "SOL",
    "XRP",
    "ALICE",
    "DIMO",
    "JASMY",
    "GTC",
  ]) {
    const source = path.resolve(
      __dirname,
      `../.reference-cache/web3/package/dist/svgs/tokens/branded/${token}.svg.js`,
    );
    const svg = (await import(pathToFileURL(source).href)).default;
    fs.writeFileSync(
      path.join(dir, token + ".svg"),
      `<!-- @web3icons/core 4.0.57. MIT. Copyright (c) 2024 0xa3k5. -->\n` +
        svg,
    );
  }
  console.log("Imported eight token marks.");
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
