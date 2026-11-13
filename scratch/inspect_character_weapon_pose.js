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

  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  page.on("console", (m) => console.log("[BROWSER CONSOLE]", m.text()));

  try {
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await page.click('[data-testid="quick-solo-btn"]');
    await page.waitForSelector("canvas", { timeout: 25000 });

    console.log("Pressing Eject...");
    await page.waitForTimeout(1000);
    const ejectBtn = await page.$('.ffh-eject-btn');
    if (ejectBtn) {
      await ejectBtn.click();
    } else {
      await page.keyboard.press("Space");
    }

    console.log("Waiting for ground combat...");
    await page.waitForSelector('[data-hudelem-id="rightFire"]', { timeout: 35000 });
    console.log("Character landed on foot!");

    await page.waitForTimeout(1500);

    // Screenshot from default chase cam
    await page.screenshot({ path: path.join(SCRATCH_DIR, "character_ground_chase.png") });
    console.log("Screenshot saved: character_ground_chase.png");

    // Look at bone positions of LeftHand, RightHand, and Weapon in Three.js
    const boneDistance = await page.evaluate(() => {
      // Find scene from canvas
      const canvas = document.querySelector("canvas");
      let leftHand = null;
      let handguard = null;

      // Scan objects in scene
      const findObjects = (obj) => {
        if (!obj) return;
        if (obj.name === "mixamorigLeftHand" && !leftHand) leftHand = obj;
        if (obj.geometry?.type === "BoxGeometry" && obj.parent?.name === "EQUIPPED_WEAPON_GROUP") {
          // Handguard box geometry size: 0.052, 0.075, 0.24
          if (obj.position?.z > 0.25) handguard = obj;
        }
        if (obj.children) obj.children.forEach(findObjects);
      };

      // Traverse through React root fiber or window if available
      return {
        hasCanvas: Boolean(canvas),
      };
    });
    console.log("Bone check:", boneDistance);

    // Aim down sights (Right Click)
    await page.mouse.down({ button: "right" });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCRATCH_DIR, "character_ground_aiming.png") });
    await page.mouse.up({ button: "right" });
    console.log("Screenshot saved: character_ground_aiming.png");

    console.log("Done inspecting!");
  } finally {
    await browser.close();
    await server.close();
  }
})().catch((err) => {
  console.error("Inspect error:", err);
  process.exit(1);
});
