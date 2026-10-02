// Extract unchanged glyph geometry from Revolut's Apache-2.0 public icon package.
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const root = path.resolve(__dirname, "../.reference-cache/package");
const output = path.resolve(__dirname, "../public/icons/revolut");
const names = [
  "lounges",
  "auto-exchange",
  "flag",
  "bar-chart",
  "line-chart",
  "arrow-right-left",
  "bitcoin",
  "coins",
  "card",
  "bank",
  "calendar",
  "search",
  "plus",
  "arrow-shuffle",
  "more-i-os",
  "back-button-arrow",
  "arrow-send",
  "arrow-request",
  "arrow-split",
  "arrow-backspace",
  "arrow-dropdown",
  "palette",
  "send-message",
  "cross",
  "check",
  "check-success",
  "info",
  "star-filled",
  "shield",
  "chat",
  "shopping",
  "revert-left",
  "smartphone",
  "chevron-right",
  "savings-vault",
  "link",
  "copy",
  "statement",
  "bell",
  "gear",
  "question-outline",
  "add-contact",
  "arrow-exchange",
  "rev-points",
  "arrow-down",
  "info-outline",
  "chevron-down",
  "filter",
  "document",
  "chevron-up",
  "vault",
  "wallet",
  "globe",
  "percent",
  "lightbulb",
  "snowflake",
  "eye-show",
  "eye-hide",
  "card-shield",
  "contactless",
  "retry",
  "exclamation-mark-outline",
  "loading",
  "plus-circle",
  "minus-circle",
  "sound",
  "sound-off",
  "size",
  "travel",
  "gift",
  "people",
  "qr",
  "arrow-thin-right",
  "pencil",
  "sticker",
  "hotel",
  "travel",
  "premium",
  "pocket",
  "credit",
  "logo-visa",
  "logo-mc",
  "cash",
  "envelope",
  "megaphone",
  "profile",
  "time-outline",
  "sim-card",
  "coins-earning",
  "inbox",
  "logo-revolut",
  "performance",
  "resort",
  "invest",
  "arrow-rates",
];
fs.mkdirSync(output, { recursive: true });
for (const name of names) {
  const filename = path.join(root, "cjs/variants/24", name + ".js");
  const mod = new Module(filename, module);
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  mod.require = function (id) {
    return id === "../../icon-base"
      ? { IconBase: "svg" }
      : Module.prototype.require.call(this, id);
  };
  mod._compile(fs.readFileSync(filename, "utf8"), filename);
  const Icon = Object.values(mod.exports).find((value) => value?.render);
  if (!Icon) throw Error("Missing icon " + name);
  const rendered = renderToStaticMarkup(React.createElement(Icon));
  const geometry = rendered.slice(
    rendered.indexOf(">") + 1,
    rendered.lastIndexOf("</svg>"),
  );
  fs.writeFileSync(
    path.join(output, name + ".svg"),
    `<!-- Copyright 2018-present Revolut LTD. Apache-2.0. Source: @revolut/icons@2.8.0/${name}. -->\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><symbol id="glyph" viewBox="0 0 24 24">${geometry}</symbol><use href="#glyph"/></svg>\n`,
  );
}
fs.copyFileSync(path.join(root, "LICENSE"), path.join(output, "LICENSE.txt"));
console.log(`Imported ${names.length} official Revolut glyphs.`);
