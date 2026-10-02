const fs = require("node:fs");
const names = [
  "nvidia",
  "apple",
  "spacex",
  "amazon",
  "tesla",
  "taketwointeractivesoftware",
  "microsoft",
  "on",
  "uber",
  "bookingdotcom",
  "shein",
  "airbnb",
  "wizzair",
  "glovo",
  "zalando",
  "nike",
  "lego",
  "wolt",
  "douglas",
  "kfc",
  "spotify",
  "carrefour",
];
fs.mkdirSync("public/icons/brands", { recursive: true });
(async () => {
  for (const name of names) {
    let response = await fetch(
      "https://raw.githubusercontent.com/simple-icons/simple-icons/16.0.0/icons/" +
        name +
        ".svg",
    );
    if (!response.ok && ["amazon", "microsoft"].includes(name))
      response = await fetch(
        "https://raw.githubusercontent.com/simple-icons/simple-icons/11.0.0/icons/" +
          name +
          ".svg",
      );
    if (response.ok)
      fs.writeFileSync(
        "public/icons/brands/" + name + ".svg",
        await response.text(),
      );
    else console.log(name + ": " + response.status);
  }
  const license = await fetch(
    "https://raw.githubusercontent.com/simple-icons/simple-icons/16.0.0/LICENSE.md",
  );
  if (license.ok)
    fs.writeFileSync("public/icons/brands/LICENSE.md", await license.text());
})();
