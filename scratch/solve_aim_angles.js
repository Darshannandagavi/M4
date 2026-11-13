const path = require('path');
const fs = require('fs');
const http = require('http');
const { execSync } = require('child_process');

(async () => {
  const npmRoot = execSync('npm root -g').toString().trim();
  const pw = require(path.join(npmRoot, 'playwright'));

  const exeCandidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  const executablePath = exeCandidates.find((p) => fs.existsSync(p));

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Aim Optimizer</title>
  <script type="importmap">
  {
    "imports": {
      "three": "/node_modules/three/build/three.module.js",
      "three/examples/jsm/loaders/FBXLoader.js": "/node_modules/three/examples/jsm/loaders/FBXLoader.js",
      "three/examples/jsm/utils/SkeletonUtils.js": "/node_modules/three/examples/jsm/utils/SkeletonUtils.js"
    }
  }
  </script>
</head>
<body>
<script type="module">
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

window.THREE = THREE;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a202c);

const camera = new THREE.PerspectiveCamera(45, 1280 / 720, 0.1, 100);
camera.position.set(1.4, 1.35, 1.6);
camera.lookAt(0, 1.25, 0);
window.__camera = camera;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(1280, 720);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild(renderer.domElement);

const amb = new THREE.AmbientLight(0xffffff, 1.4);
scene.add(amb);

const dir = new THREE.DirectionalLight(0xffffff, 2.5);
dir.position.set(3, 8, 4);
scene.add(dir);

const fill = new THREE.DirectionalLight(0x7090ff, 1.0);
fill.position.set(-3, 2, -2);
scene.add(fill);

const grid = new THREE.GridHelper(10, 20, 0x334466, 0x223344);
scene.add(grid);

const loader = new FBXLoader();
loader.load('/src/assets/models/Characters/X Bot.fbx', (charFbx) => {
  const cloned = clone(charFbx);
  cloned.scale.setScalar(0.01);
  scene.add(cloned);
  window.__char = cloned;

  const surface = cloned.getObjectByName('Beta_Surface');
  const bones = {};
  surface.skeleton.bones.forEach(b => {
    const cleanKey = b.name.replace(/^mixamorig:?/i, '');
    if (!bones[cleanKey]) bones[cleanKey] = b;
  });
  window.__bones = bones;

  const gunGroup = new THREE.Group();
  gunGroup.name = "EQUIPPED_WEAPON_GROUP";
  gunGroup.scale.setScalar(100);
  gunGroup.position.set(0.5, 9.5, 3.2);
  gunGroup.rotation.set(-0.62, 1.32, -0.62);

  const darkMetal = new THREE.MeshStandardMaterial({ color: "#161c26", metalness: 0.88, roughness: 0.24 });
  const darkPolymer = new THREE.MeshStandardMaterial({ color: "#0a0e16", roughness: 0.72, metalness: 0.15 });
  const accentMat = new THREE.MeshStandardMaterial({ color: "#2d79ff", metalness: 0.75, roughness: 0.25 });

  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.13, 0.046), darkPolymer);
  grip.position.set(0, -0.04, -0.02);
  grip.rotation.x = -0.28;
  gunGroup.add(grip);

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.088, 0.32), darkMetal);
  body.position.set(0, 0.048, 0.04);
  gunGroup.add(body);

  const stock = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.11, 0.22), darkPolymer);
  stock.position.set(0, 0.03, -0.22);
  gunGroup.add(stock);

  const mag = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.18, 0.065), accentMat);
  mag.position.set(0, -0.065, 0.12);
  mag.rotation.x = 0.22;
  gunGroup.add(mag);

  const handguard = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.075, 0.24), darkPolymer);
  handguard.position.set(0, 0.048, 0.28);
  gunGroup.add(handguard);

  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.32, 8), darkMetal);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 0.048, 0.44);
  gunGroup.add(barrel);

  bones.RightHand.add(gunGroup);
  window.__handguard = handguard;
  window.__gunGroup = gunGroup;

  window.__ready = true;
  renderer.render(scene, camera);
});

window.renderFrame = () => {
  renderer.render(scene, camera);
};
</script>
</body>
</html>
  `;

  const server = http.createServer((req, res) => {
    const rawUrl = req.url.split('?')[0];
    const parsedUrl = decodeURIComponent(rawUrl);
    if (parsedUrl === '/' || parsedUrl === '/preview.html') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
      return;
    }
    const filePath = path.join(__dirname, '../client', parsedUrl);
    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end('Not found: ' + filePath);
      return;
    }
    const stat = fs.statSync(filePath);
    let contentType = 'application/octet-stream';
    if (filePath.endsWith('.js')) contentType = 'application/javascript';
    if (filePath.endsWith('.fbx')) contentType = 'application/octet-stream';
    res.writeHead(200, { 'Content-Length': stat.size, 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });

  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;

  const browser = await pw.chromium.launch({
    headless: true,
    executablePath,
    args: [
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--no-sandbox',
    ],
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(`http://127.0.0.1:${port}/preview.html`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__ready === true, { timeout: 30000 });

  // Now, let's find the exact Aiming / Shooting pose where gun points forward!
  const results = await page.evaluate(() => {
    const bones = window.__bones;
    const gun = window.__gunGroup;
    const hg = window.__handguard;
    const char = window.__char;

    // In Three.js:
    // If we want gun's forward vector (+Z of gun) to point along world +Z (0, 0, 1):
    // What right arm rotations achieve this?
    // Let's test a fine search:
    const targetFwd = new THREE.Vector3(0, 0, 1);
    const gunQuat = new THREE.Quaternion();
    const gunFwd = new THREE.Vector3();
    const hgPos = new THREE.Vector3();
    const rHandPos = new THREE.Vector3();

    let bestAimErr = Infinity;
    let bestAim = null;

    // Search across RightArm, ForeArm, and Hand:
    for (let ax = -0.5; ax <= 0.8; ax += 0.1) {
      for (let ay = -0.6; ay <= 0.4; ay += 0.1) {
        for (let az = -0.8; az <= 0.4; az += 0.1) {
          for (let fz = -1.8; fz <= -0.4; fz += 0.1) {
            for (let hy = -0.6; hy <= 0.4; hy += 0.2) {
              bones.RightArm.rotation.set(ax, ay, az);
              bones.RightForeArm.rotation.set(0, 0, fz);
              bones.RightHand.rotation.set(0, hy, 0);

              char.updateMatrixWorld(true);

              gun.getWorldQuaternion(gunQuat);
              gunFwd.set(0, 0, 1).applyQuaternion(gunQuat);

              // We want gunFwd close to (0, 0, 1)
              const angle = gunFwd.angleTo(targetFwd);
              hg.getWorldPosition(hgPos);
              bones.RightHand.getWorldPosition(rHandPos);

              // Handguard should be in front of chest:
              // y in [1.2, 1.45], z in [0.2, 0.55], x in [-0.25, 0.05]
              if (hgPos.y >= 1.2 && hgPos.y <= 1.45 && hgPos.z >= 0.2 && hgPos.z <= 0.55 && hgPos.x >= -0.25 && hgPos.x <= 0.05) {
                const err = angle + Math.abs(hgPos.x + 0.08) * 0.1;
                if (err < bestAimErr) {
                  bestAimErr = err;
                  bestAim = {
                    arm: [Number(ax.toFixed(2)), Number(ay.toFixed(2)), Number(az.toFixed(2))],
                    fore: [0, 0, Number(fz.toFixed(2))],
                    hand: [0, Number(hy.toFixed(2)), 0],
                    gunFwd: [Number(gunFwd.x.toFixed(3)), Number(gunFwd.y.toFixed(3)), Number(gunFwd.z.toFixed(3))],
                    hgPos: [Number(hgPos.x.toFixed(3)), Number(hgPos.y.toFixed(3)), Number(hgPos.z.toFixed(3))],
                    angleDeg: Number((angle * 180 / Math.PI).toFixed(1))
                  };
                }
              }
            }
          }
        }
      }
    }

    return bestAim;
  });

  console.log('Best Forward Aim Angles:', results);

  // Now apply the best forward aim angles, solve LeftArm IK, and render!
  await page.evaluate((aim) => {
    const bones = window.__bones;
    const hg = window.__handguard;
    const char = window.__char;

    bones.RightArm.rotation.set(...aim.arm);
    bones.RightForeArm.rotation.set(...aim.fore);
    bones.RightHand.rotation.set(...aim.hand);

    char.updateMatrixWorld(true);

    const hgPos = new THREE.Vector3();
    hg.getWorldPosition(hgPos);

    // Left Arm CCD IK
    const lArm = bones.LeftArm;
    const lFore = bones.LeftForeArm;
    const lHand = bones.LeftHand;

    lArm.rotation.set(1.2, 0.4, 0.6);
    lFore.rotation.set(0, 0, 1.3);
    lHand.rotation.set(0.2, 0.3, -0.3);

    for (let iter = 0; iter < 20; iter++) {
      char.updateMatrixWorld(true);
      const elbowPos = new THREE.Vector3();
      const handPos = new THREE.Vector3();
      lFore.getWorldPosition(elbowPos);
      lHand.getWorldPosition(handPos);

      const v1 = handPos.clone().sub(elbowPos).normalize();
      const v2 = hgPos.clone().sub(elbowPos).normalize();
      const q1 = new THREE.Quaternion().setFromUnitVectors(v1, v2);

      const parentForeQ = new THREE.Quaternion();
      lFore.parent.getWorldQuaternion(parentForeQ);
      const curForeQ = new THREE.Quaternion();
      lFore.getWorldQuaternion(curForeQ);
      lFore.quaternion.copy(parentForeQ.invert().multiply(q1.multiply(curForeQ)));

      char.updateMatrixWorld(true);
      const shoulderPos = new THREE.Vector3();
      lArm.getWorldPosition(shoulderPos);
      lHand.getWorldPosition(handPos);

      const v3 = handPos.clone().sub(shoulderPos).normalize();
      const v4 = hgPos.clone().sub(shoulderPos).normalize();
      const q2 = new THREE.Quaternion().setFromUnitVectors(v3, v4);

      const parentArmQ = new THREE.Quaternion();
      lArm.parent.getWorldQuaternion(parentArmQ);
      const curArmQ = new THREE.Quaternion();
      lArm.getWorldQuaternion(curArmQ);
      lArm.quaternion.copy(parentArmQ.invert().multiply(q2.multiply(curArmQ)));
    }

    char.updateMatrixWorld(true);
    window.renderFrame();
  }, results);

  // Take screenshot from 3 angles
  await page.screenshot({ path: path.join(__dirname, 'aim_solve_angle.png') });
  console.log('Saved aim_solve_angle.png');

  await page.evaluate(() => {
    window.__camera.position.set(0, 1.35, 2.0);
    window.__camera.lookAt(0, 1.25, 0);
    window.renderFrame();
  });
  await page.screenshot({ path: path.join(__dirname, 'aim_solve_front.png') });
  console.log('Saved aim_solve_front.png');

  await page.evaluate(() => {
    window.__camera.position.set(0.35, 1.45, -1.8);
    window.__camera.lookAt(0, 1.3, 1.0);
    window.renderFrame();
  });
  await page.screenshot({ path: path.join(__dirname, 'aim_solve_chase.png') });
  console.log('Saved aim_solve_chase.png');

  await browser.close();
  server.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});

