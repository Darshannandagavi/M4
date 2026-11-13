const path = require('path');
const fs = require('fs');
const THREE = require(path.join(__dirname, '../client/node_modules/three'));
const { FBXLoader } = require(path.join(__dirname, '../client/node_modules/three-stdlib'));
const { clone } = require(path.join(__dirname, '../client/node_modules/three/examples/jsm/utils/SkeletonUtils.js'));

global.window = global;
global.document = { createElementNS: () => ({}), createElement: () => ({}) };

const loader = new FBXLoader();
const fbxData = fs.readFileSync(path.join(__dirname, '../client/src/assets/models/Characters/X Bot.fbx'));
const char = loader.parse(fbxData.buffer.slice(fbxData.byteOffset, fbxData.byteOffset + fbxData.byteLength), '');
const cloned = clone(char);

const surface = cloned.getObjectByName('Beta_Surface');
const bones = {};
surface.skeleton.bones.forEach(b => {
  const cleanKey = b.name.replace(/^mixamorig:?/i, '');
  if (!bones[cleanKey]) bones[cleanKey] = b;
});

// Setup gun
const gun = new THREE.Group();
gun.scale.setScalar(100);
gun.position.set(0.5, 9.5, 3.2);
gun.rotation.set(-0.62, 1.32, -0.62);

const handguard = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.075, 0.24));
handguard.position.set(0, 0.048, 0.28);
gun.add(handguard);

const stock = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.11, 0.22));
stock.position.set(0, 0.03, -0.22);
gun.add(stock);

bones.RightHand.add(gun);

// Let's test right arm angles so that:
// 1. Stock is near right shoulder ([ -15, 135, 5 ])
// 2. Handguard is in front of chest ([ -5 to 0, 125 to 135, 35 to 42 ])
// 3. Gun points forward along +Z (or slightly angled for low ready)

function evalPose(rArm, rFore, rHand) {
  bones.RightArm.rotation.set(...rArm);
  bones.RightForeArm.rotation.set(...rFore);
  bones.RightHand.rotation.set(...rHand);
  cloned.updateMatrixWorld(true);

  const stockPos = new THREE.Vector3();
  stock.getWorldPosition(stockPos);

  const hgPos = new THREE.Vector3();
  handguard.getWorldPosition(hgPos);

  const rHandPos = new THREE.Vector3();
  bones.RightHand.getWorldPosition(rHandPos);

  const lShoulder = new THREE.Vector3();
  bones.LeftArm.getWorldPosition(lShoulder);

  const distToLShoulder = hgPos.distanceTo(lShoulder);

  return { stockPos, hgPos, rHandPos, distToLShoulder };
}

// In Mixamo rest pose:
// RightArm: X is world +Z, Y is world -X, Z is world -Y.
// Let's test bending elbow tightly (RightForeArm rot.z around -1.6 to -2.2):
for (let armX of [0.8, 1.0, 1.2]) {
  for (let armY of [-0.4, -0.2, 0.0, 0.2]) {
    for (let armZ of [-0.6, -0.4, -0.2, 0.0]) {
      for (let foreZ of [-1.6, -1.8, -2.0, -2.2]) {
        for (let handY of [-0.4, -0.2, 0.0, 0.2]) {
          const res = evalPose([armX, armY, armZ], [0, 0, foreZ], [0, handY, 0]);
          // We want hgPos.z between 25 and 45, and distToLShoulder < 48
          if (res.hgPos.z >= 25 && res.hgPos.z <= 45 && res.distToLShoulder <= 45 && res.hgPos.y >= 100 && res.hgPos.y <= 140) {
            console.log(`Match: Arm[${armX}, ${armY}, ${armZ}] Fore[0,0,${foreZ}] Hand[0,${handY},0] => hg:[${res.hgPos.x.toFixed(1)}, ${res.hgPos.y.toFixed(1)}, ${res.hgPos.z.toFixed(1)}], distToLShoulder:${res.distToLShoulder.toFixed(1)} cm`);
          }
        }
      }
    }
  }
}

