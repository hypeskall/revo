// Render the repo-native vector icon. Provide a sharp module path if it is not installed locally.
const fs = require("node:fs");
const path = require("node:path");
const sharp = require(process.argv[2] || "sharp");
async function main() {
  const source = fs.readFileSync(
    path.resolve(__dirname, "../public/home-screen-icon.svg"),
  );
  for (const [file, size] of [
    ["home-icon-192.png", 192],
    ["home-icon-512.png", 512],
    ["home-apple-touch-icon.png", 180],
    ["home-favicon.png", 32],
  ])
    await sharp(source)
      .resize(size, size)
      .png()
      .toFile(path.resolve(__dirname, "../public", file));
  console.log("Rendered home-screen icons.");
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
