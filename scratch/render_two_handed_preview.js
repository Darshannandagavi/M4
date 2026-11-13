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
  <title>Preview Two-Handed Hold</title>
  <style>body { margin: 0; background: #1a1a24; overflow: hidden; }</style>
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
camera.position.set(0, 1.35, 2.4);
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

  // Build Gun
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
}, undefined, (err) => {
  console.error('FBX Load error:', err);
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
      console.error('File not found:', filePath);
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
  page.on('console', m => console.log('[BROWSER]', m.text()));
  page.on('pageerror', err => console.error('[PAGE ERROR]', err));

  await page.goto(`http://127.0.0.1:${port}/preview.html`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__ready === true, { timeout: 30000 });

  // Apply the two-handed pose!
  const poseRes = await page.evaluate(() => {
    const bones = window.__bones;
    const hg = window.__handguard;
    const char = window.__char;

    // Apply Low-Ready Two-Handed Hold:
    // Right hand holds grip & trigger across chest
    bones.RightArm.rotation.set(1.0, -0.4, 0.0);
    bones.RightForeArm.rotation.set(0, 0, -1.6);
    bones.RightHand.rotation.set(0, -0.2, 0);

    // Left hand cradles handguard from underneath
    bones.LeftArm.rotation.set(1.45, 0.6, 0.65);
    bones.LeftForeArm.rotation.set(0, 0, 1.35);
    bones.LeftHand.rotation.set(0.2, 0.3, -0.4);

    char.updateMatrixWorld(true);

    const hgPos = new THREE.Vector3();
    hg.getWorldPosition(hgPos);
    const lHandPos = new THREE.Vector3();
    bones.LeftHand.getWorldPosition(lHandPos);
    const rHandPos = new THREE.Vector3();
    bones.RightHand.getWorldPosition(rHandPos);

    window.renderFrame();

    return {
      handguard: [hgPos.x, hgPos.y, hgPos.z],
      leftHand: [lHandPos.x, lHandPos.y, lHandPos.z],
      rightHand: [rHandPos.x, rHandPos.y, rHandPos.z],
      dist: lHandPos.distanceTo(hgPos)
    };
  });

  console.log('Pose Evaluation:', poseRes);

  // Take screenshot 1: Front View (standing right in front of character)
  await page.screenshot({ path: path.join(__dirname, 'preview_two_hand_front.png') });
  console.log('Saved preview_two_hand_front.png');

  // Change camera to 3/4 perspective view
  await page.evaluate(() => {
    window.__camera.position.set(1.3, 1.35, 1.6);
    window.__camera.lookAt(0, 1.25, 0);
    window.renderFrame();
  });
  await page.screenshot({ path: path.join(__dirname, 'preview_two_hand_angle.png') });
  console.log('Saved preview_two_hand_angle.png');

  // Change camera to Chase View (behind player)
  await page.evaluate(() => {
    window.__camera.position.set(0.4, 1.45, -2.0);
    window.__camera.lookAt(0, 1.25, 1.0);
    window.renderFrame();
  });
  await page.screenshot({ path: path.join(__dirname, 'preview_two_hand_chase.png') });
  console.log('Saved preview_two_hand_chase.png');

  await browser.close();
  server.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
