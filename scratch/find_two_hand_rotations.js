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
bones.RightHand.add(gun);

// Test ADS / Aiming Stance
// In ADS:
// Right arm: upper arm rotates forward and bends elbow so gun is at shoulder
// Let's optimize LeftArm and LeftForeArm to touch handguard
function optimizeLeftArm(targetWorldPos, initialLeftRot = [0.8, 0, 0]) {
  bones.LeftArm.rotation.set(...initialLeftRot);
  bones.LeftForeArm.rotation.set(0, 0, 0.8);
  bones.LeftHand.rotation.set(0, 0, 0);

  // Use gradient descent / coordinate search on LeftArm (x,y,z) and LeftForeArm (z)
  let bestDist = Infinity;
  let bestAngles = null;

  const leftArm = bones.LeftArm;
  const leftFore = bones.LeftForeArm;
  const leftHand = bones.LeftHand;

  // Analytical 2-bone IK:
  cloned.updateMatrixWorld(true);

  // Target in LeftArm's parent space
  const shoulder = leftArm;
  const elbow = leftFore;
  const hand = leftHand;

  const shoulderPos = new THREE.Vector3();
  const elbowPos = new THREE.Vector3();
  const handPos = new THREE.Vector3();

  // Fine-tune with grid search around plausible natural arm values
  for (let ax = 0.2; ax <= 1.4; ax += 0.1) {
    for (let ay = -0.6; ay <= 0.6; ay += 0.1) {
      for (let az = -0.8; az <= 0.8; az += 0.1) {
        for (let fz = 0.2; fz <= 2.0; fz += 0.1) {
          leftArm.rotation.set(ax, ay, az);
          leftFore.rotation.set(0, 0, fz);
          cloned.updateMatrixWorld(true);
          hand.getWorldPosition(handPos);
          const d = handPos.distanceTo(targetWorldPos);
          if (d < bestDist) {
            bestDist = d;
            bestAngles = {
              arm: [Number(ax.toFixed(3)), Number(ay.toFixed(3)), Number(az.toFixed(3))],
              fore: [0, 0, Number(fz.toFixed(3))],
              dist: Number(d.toFixed(2))
            };
          }
        }
      }
    }
  }

  return bestAngles;
}

// 1. Aiming / ADS Stance:
console.log('Testing ADS Stance...');
// When aiming: Right arm brings gun forward and up
bones.RightArm.rotation.set(0.65, -0.3, -0.4);
bones.RightForeArm.rotation.set(0.1, 0, -1.2);
bones.RightHand.rotation.set(-0.1, -0.2, 0.3);
cloned.updateMatrixWorld(true);

const targetAim = new THREE.Vector3();
handguard.getWorldPosition(targetAim);
console.log('Target Handguard in ADS:', targetAim);

const bestAim = optimizeLeftArm(targetAim);
console.log('Best Left Arm for ADS:', bestAim);

