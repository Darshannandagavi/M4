const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const { startRelayServer } = require("f:/BMW-M4/server/server");

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
    args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-webgl", "--no-sandbox"],
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const logs = [];
  page.on("console", (m) => logs.push(m.text()));

  try {
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await page.click('[data-testid="quick-solo-btn"]');
    await page.waitForSelector("canvas", { timeout: 25000 });
    await page.waitForTimeout(2000);
    await page.keyboard.press("Space");
    await page.waitForSelector('[data-hudelem-id="rightFire"]', { timeout: 35000 });

    // Inspect Three.js fiber tree or scene
    const dump = await page.evaluate(() => {
      // Find all meshes and bones
      const canvas = document.querySelector("canvas");
      // Access R3F internal state via canvas __r3f or fiber
      const r3fKey = Object.keys(canvas).find((k) => k.startsWith("__r3f"));
      if (!r3fKey) return { error: "No __r3f key found on canvas" };
      const r3f = canvas[r3fKey];
      const scene = r3f?.root?.store?.getState()?.scene;
      if (!scene) return { error: "No scene found" };

      const bonesFound = [];
      let gunFound = null;
      scene.traverse((node) => {
        if (node.isBone) {
          bonesFound.push({
            name: node.name,
            rot: { x: node.rotation.x, y: node.rotation.y, z: node.rotation.z },
            quat: { x: node.quaternion.x, y: node.quaternion.y, z: node.quaternion.z, w: node.quaternion.w },
          });
        }
        if (node.name === "EQUIPPED_WEAPON_GROUP") {
          gunFound = {
            visible: node.visible,
            parent: node.parent?.name,
            pos: node.position,
            rot: node.rotation,
          };
        }
      });
      return {
        boneCount: bonesFound.length,
        gunFound,
        bonesSample: bonesFound.slice(0, 15),
        rightArm: bonesFound.find((b) => b.name.includes("RightArm")),
        leftArm: bonesFound.find((b) => b.name.includes("LeftArm")),
        rightForeArm: bonesFound.find((b) => b.name.includes("RightForeArm")),
        leftForeArm: bonesFound.find((b) => b.name.includes("LeftForeArm")),
      };
    });

    console.log("Scene Dump:", JSON.stringify(dump, null, 2));
  } finally {
    await browser.close();
    await server.close();
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

