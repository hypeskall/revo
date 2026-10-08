const assert = require("node:assert/strict");
const { chromium } = require("playwright");

// Run against a local production build using an isolated browser context.
(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(process.env.INTERACTION_TEST_URL || "http://localhost:3001");
    await page.locator(".welcome-screen").waitFor({ state: "hidden", timeout: 12000 });
    const main = page.locator("main");
    await page.waitForFunction(() => document.querySelector("main")?.inert === false);

    // Actual wheel input must scroll the screen after the welcome lock clears.
    await page.mouse.move(195, 520);
    await page.mouse.wheel(0, 550);
    await page.waitForFunction(() => document.querySelector(".reference-home").scrollTop > 100);
    await page.mouse.wheel(0, -1500);
    await page.waitForFunction(() => document.querySelector(".reference-home").scrollTop === 0);

    // A modal should lock the background, then release it on every dismissal.
    for (let i = 0; i < 2; i++) {
      await page.getByRole("button", { name: "Add money", exact: true }).click();
      await page.getByRole("dialog", { name: "Add money", exact: true }).waitFor();
      assert.equal(await main.evaluate((node) => node.inert), true);
      await page.getByRole("button", { name: "Close add money", exact: true }).click();
      await page.getByRole("dialog", { name: "Add money", exact: true }).waitFor({ state: "hidden" });
      await page.waitForFunction(() => document.querySelector("main").inert === false);
    }

    const navigation = page.getByRole("navigation", { name: "Main navigation" });
    const tabs = await navigation.getByRole("button").all();
    for (const tab of tabs.slice(1)) {
      await tab.click();
      await page.waitForFunction(() => {
        const scenes = [...document.querySelectorAll("[data-tab-scene]")];
        return scenes.every((node) => node.inert === (node.dataset.active !== "true"));
      });
    }
    await tabs[0].click();
    await page.getByRole("button", { name: "Add money", exact: true }).click();
    await page.getByRole("dialog", { name: "Add money", exact: true }).waitFor();
    assert.deepEqual(errors, [], "No runtime errors during interaction cycles");
    console.log("PASS: welcome unlock, scrolling, repeated modal dismissal, tab locks and returning home");
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
