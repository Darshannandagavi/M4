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
  <title>Punch Pose Preview</title>
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
camera.position.set(1.1, 1.35, 1.8);
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

  // Test Punch Pose:
  await page.evaluate(() => {
    const bones = window.__bones;
    const char = window.__char;

    // Spine lean into punch
    if (bones.Spine) {
      bones.Spine.rotation.set(0.12, -0.15, 0);
    }
    if (bones.Spine1) {
      bones.Spine1.rotation.set(0.08, -0.1, 0);
    }

    // Right Arm: Straight Jab Punch forward!
    bones.RightArm.rotation.set(0.8, -0.3, -0.4);
    bones.RightForeArm.rotation.set(0, 0, -0.35);
    bones.RightHand.rotation.set(0, 0.45, 0.1);

    // Left Arm: Guard position covering face
    bones.LeftArm.rotation.set(0.85, 0.35, 0.5);
    bones.LeftForeArm.rotation.set(0, 0, 1.4);
    bones.LeftHand.rotation.set(0.2, 0.2, 0);

    char.updateMatrixWorld(true);
    window.renderFrame();
  });

  await page.screenshot({ path: path.join(__dirname, 'punch_pose_angle.png') });
  console.log('Saved punch_pose_angle.png');

  await page.evaluate(() => {
    window.__camera.position.set(0, 1.35, 2.0);
    window.__camera.lookAt(0, 1.25, 0);
    window.renderFrame();
  });
  await page.screenshot({ path: path.join(__dirname, 'punch_pose_front.png') });
  console.log('Saved punch_pose_front.png');

  await browser.close();
  server.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
