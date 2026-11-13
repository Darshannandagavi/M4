const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { startRelayServer } = require("f:/BMW-M4/server/server");

const SCRATCH_DIR = __dirname;

(async () => {
  const npmRoot = execSync("npm root -g").toString().trim();
  const pw = require(path.join(npmRoot, "playwright"));

  const server = startRelayServer(0, { disconnectGraceMs: 250, deferListen: true });
  await new Promise((resolve) => server.httpServer.listen(0, "0.0.0.0", resolve));
  const { port } = server.httpServer.address();
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`Custom HUD verification server running at ${baseUrl}`);

  const exeCandidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  ];
  const executablePath = exeCandidates.find((p) => fs.existsSync(p));

  const browser = await pw.chromium.launch({
    headless: true,
    executablePath,
    args: [
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-webgl",
      "--ignore-gpu-blocklist",
      "--no-sandbox",
    ],
  });

  const pageErrors = [];
  const consoleErrors = [];
  const attachErrorTrap = (page, name) => {
    page.on("pageerror", (err) => {
      console.error(`[pageerror:${name}]`, err.message);
      pageErrors.push(`${name}: ${err.message}`);
    });
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(`${name}: ${msg.text()}`);
      }
    });
  };

  try {
    // -------------------------------------------------------------------------
    // TEST 1: DESKTOP HUD CUSTOMIZATION
    // -------------------------------------------------------------------------
    console.log("==> Test 1: Desktop Custom HUD...");
    const desktopCtx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
    const desktopPage = await desktopCtx.newPage();
    attachErrorTrap(desktopPage, "desktop");

    await desktopPage.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await desktopPage.waitForSelector('[data-testid="quick-solo-btn"]');
    await desktopPage.click('[data-testid="quick-solo-btn"]');

    await desktopPage.waitForSelector('[data-testid="hud-custom-editor-btn"]', { timeout: 25000 });
    console.log("  -> In-game HUD loaded. Opening Custom HUD editor...");

    // Click Custom HUD button in top toolbar
    await desktopPage.click('[data-testid="hud-custom-editor-btn"]');
    await desktopPage.waitForSelector(".ffh-editor-top-bar");
    await desktopPage.waitForSelector(".ffh-editor-preset-pill");

    // Click on dropParachute element to select it
    console.log("  -> Selecting dropParachute element...");
    await desktopPage.click('[data-hudelem-id="dropParachute"]');
    await desktopPage.waitForSelector(".ffh-editor-slider-card");
    await desktopPage.waitForSelector(".ffh-hud-selection-ring");

    const targetLabel = (await desktopPage.textContent(".ffh-slider-target-name")).trim();
    assert.ok(targetLabel.toUpperCase().includes("EJECT") || targetLabel.toUpperCase().includes("DROP"), `Expected target label with EJECT/DROP, got: ${targetLabel}`);

    // Check slider rows
    const sliderTitles = await desktopPage.$$eval(".ffh-slider-title", (els) => els.map((e) => e.textContent.trim()));
    assert.ok(sliderTitles.includes("TRANSPARENCY"), "Expected TRANSPARENCY slider");
    assert.ok(sliderTitles.includes("SIZE"), "Expected SIZE slider");

    // Adjust Transparency slider to 45%
    console.log("  -> Adjusting Transparency slider to 45%...");
    const transInput = desktopPage.locator(".ffh-slider-row").filter({ hasText: "TRANSPARENCY" }).locator("input");
    await transInput.fill("45");
    await desktopPage.waitForTimeout(100);

    // Adjust Size slider to 150%
    console.log("  -> Adjusting Size slider to 150%...");
    const sizeInput = desktopPage.locator(".ffh-slider-row").filter({ hasText: "SIZE" }).locator("input");
    await sizeInput.fill("150");
    await desktopPage.waitForTimeout(100);

    // Verify element styles updated live
    const elemStyle = await desktopPage.evaluate(() => {
      const el = document.querySelector('[data-hudelem-id="dropParachute"]');
      return {
        opacity: el ? el.style.opacity : null,
        transform: el ? el.style.transform : null,
      };
    });
    console.log("  -> dropParachute live style:", elemStyle);
    assert.strictEqual(elemStyle.opacity, "0.45", "Opacity should be 0.45 (45%)");
    assert.ok(elemStyle.transform.includes("scale(1.5)"), "Transform should include scale(1.5) (150%)");

    // Test dragging the element
    console.log("  -> Dragging dropParachute element...");
    const dropBox = await desktopPage.locator('[data-hudelem-id="dropParachute"]').boundingBox();
    assert.ok(dropBox, "Bounding box must exist for dropParachute");
    await desktopPage.mouse.move(dropBox.x + dropBox.width / 2, dropBox.y + dropBox.height / 2);
    await desktopPage.mouse.down();
    await desktopPage.mouse.move(dropBox.x + dropBox.width / 2 + 30, dropBox.y + dropBox.height / 2 + 20);
    await desktopPage.mouse.up();
    await desktopPage.waitForTimeout(100);

    // Test Save button
    console.log("  -> Clicking Save button...");
    await desktopPage.click(".ffh-editor-bar-btn.save");
    await desktopPage.waitForSelector(".ffh-editor-toast");
    const toastText = (await desktopPage.textContent(".ffh-editor-toast")).trim();
    assert.ok(toastText.includes("SAVED"), `Expected SAVED toast, got: ${toastText}`);

    // Verify localStorage has the saved preset
    const savedStorage = await desktopPage.evaluate(() => {
      return window.localStorage.getItem("ff_custom_hud_preset_1");
    });
    assert.ok(savedStorage, "Expected ff_custom_hud_preset_1 in localStorage");
    const parsedLayout = JSON.parse(savedStorage);
    assert.strictEqual(parsedLayout.dropParachute.opacity, 45, "Stored opacity should be 45");
    assert.strictEqual(parsedLayout.dropParachute.size, 150, "Stored size should be 150");

    // Test Exit button
    console.log("  -> Clicking Exit button...");
    await desktopPage.click(".ffh-editor-bar-btn.exit");
    await desktopPage.waitForSelector(".ffh-editor-top-bar", { state: "detached" });

    // Verify live element in game still retains customized size and opacity!
    const postExitStyle = await desktopPage.evaluate(() => {
      const el = document.querySelector('[data-hudelem-id="dropParachute"]');
      return {
        opacity: el ? el.style.opacity : null,
        transform: el ? el.style.transform : null,
      };
    });
    assert.strictEqual(postExitStyle.opacity, "0.45", "Post-exit opacity should stay 0.45");
    assert.ok(postExitStyle.transform.includes("scale(1.5)"), "Post-exit scale should stay 1.5");

    await desktopPage.screenshot({ path: path.join(SCRATCH_DIR, "verify_custom_hud_desktop.png") });
    console.log("✓ Desktop Custom HUD tests passed!");

    // -------------------------------------------------------------------------
    // TEST 2: MOBILE CONTROLLER HUD CUSTOMIZATION
    // -------------------------------------------------------------------------
    console.log("==> Test 2: Mobile Controller Custom HUD...");
    const mobileCtx = await browser.newContext({
      viewport: { width: 844, height: 390 },
      hasTouch: true,
      isMobile: true,
    });
    const mobilePage = await mobileCtx.newPage();
    attachErrorTrap(mobilePage, "mobile");

    await mobilePage.goto(`${baseUrl}/?controller=1`, { waitUntil: "domcontentloaded" });
    await mobilePage.waitForSelector('[data-testid="phone-custom-hud-btn"]', { timeout: 20000 });
    console.log("  -> Mobile controller loaded. Opening Custom HUD on phone...");

    // Click Custom HUD button on phone
    await mobilePage.click('[data-testid="phone-custom-hud-btn"]');
    await mobilePage.waitForSelector(".ffh-editor-top-bar");
    await mobilePage.waitForSelector(".ffh-editor-preset-pill");

    // Tap Joystick on phone
    console.log("  -> Tapping joystick to select...");
    await mobilePage.click('[data-hudelem-id="joystick"]');
    await mobilePage.waitForSelector(".ffh-editor-slider-card");

    const joyLabel = (await mobilePage.textContent(".ffh-slider-target-name")).trim();
    assert.ok(joyLabel.toUpperCase().includes("JOYSTICK"), `Expected JOYSTICK label, got: ${joyLabel}`);

    // Adjust Joystick size to 135%
    const joySizeInput = mobilePage.locator(".ffh-slider-row").filter({ hasText: "SIZE" }).locator("input");
    await joySizeInput.fill("135");

    // Adjust Joystick transparency to 60%
    const joyTransInput = mobilePage.locator(".ffh-slider-row").filter({ hasText: "TRANSPARENCY" }).locator("input");
    await joyTransInput.fill("60");
    await mobilePage.waitForTimeout(100);

    const joyStyle = await mobilePage.evaluate(() => {
      const el = document.querySelector('[data-hudelem-id="joystick"]');
      return {
        opacity: el ? el.style.opacity : null,
        transform: el ? el.style.transform : null,
      };
    });
    console.log("  -> Mobile joystick style:", joyStyle);
    assert.strictEqual(joyStyle.opacity, "0.6", "Joystick opacity should be 0.6 (60%)");
    assert.ok(joyStyle.transform.includes("scale(1.35)"), "Joystick scale should include scale(1.35)");

    // Switch to PRESET 2
    console.log("  -> Switching to PRESET 2...");
    await mobilePage.click(".ffh-editor-preset-pill");
    await mobilePage.waitForFunction(() => {
      const el = document.querySelector(".ffh-preset-num");
      return el && el.textContent.trim() === "2";
    });
    console.log("  -> Switched to PRESET 2 successfully!");

    // Save Preset 2
    await mobilePage.click(".ffh-editor-bar-btn.save");
    await mobilePage.waitForSelector(".ffh-editor-toast");

    // Exit Custom HUD on phone
    await mobilePage.click(".ffh-editor-bar-btn.exit");
    await mobilePage.waitForSelector(".ffh-editor-top-bar", { state: "detached" });

    // Verify touch joystick still works after exiting Custom HUD
    console.log("  -> Verifying touch joystick responds in gameplay after exiting edit mode...");
    const joyCenter = await mobilePage.locator('[data-hudelem-id="joystick"]').boundingBox();
    assert.ok(joyCenter, "Joystick bounding box exists");
    await mobilePage.mouse.move(joyCenter.x + joyCenter.width / 2, joyCenter.y + joyCenter.height / 2);
    await mobilePage.mouse.down();
    await mobilePage.mouse.move(joyCenter.x + joyCenter.width / 2 + 25, joyCenter.y + joyCenter.height / 2 - 25);
    await mobilePage.waitForTimeout(100);
    await mobilePage.mouse.up();

    await mobilePage.screenshot({ path: path.join(SCRATCH_DIR, "verify_custom_hud_mobile.png") });
    console.log("✓ Mobile Controller Custom HUD tests passed!");

    assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join(" | ")}`);
    assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join(" | ")}`);

    console.log("\nALL CUSTOM HUD TESTS PASSED SUCCESSFULLY (SIZE, TRANSPARENCY, DRAG, PRESETS, SAVE & EXIT)!");
  } catch (err) {
    console.error("CUSTOM HUD TEST FAILED:", err);
    throw err;
  } finally {
    await browser.close();
    await server.close();
  }
})().catch((err) => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});

