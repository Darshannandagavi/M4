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

const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.32, 8));
barrel.rotation.x = Math.PI / 2;
barrel.position.set(0, 0.048, 0.44);
gun.add(barrel);

const handguard = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.075, 0.24));
handguard.position.set(0, 0.048, 0.28);
gun.add(handguard);

bones.RightHand.add(gun);

bones.RightArm.rotation.set(1.0, -0.4, 0.0);
bones.RightForeArm.rotation.set(0, 0, -1.6);
bones.RightHand.rotation.set(0, -0.2, 0);

cloned.updateMatrixWorld(true);

const gunQuat = new THREE.Quaternion();
gun.getWorldQuaternion(gunQuat);

const gunForward = new THREE.Vector3(0, 0, 1).applyQuaternion(gunQuat);
console.log('Gun forward vector in Ready stance:', gunForward);

// Now let's test aiming pose where gun points forward (gunForward.z > 0.9, y near 0)
// We want gunForward: [0, 0, 1] (or slightly tilted by aimPitch)
console.log('--- Solving Aiming (ADS) Pose ---');

let bestAimDiff = Infinity;
let bestAimAngles = null;

const targetDir = new THREE.Vector3(0, 0, 1);

for (let rx of [0.6, 0.8, 1.0, 1.2]) {
  for (let ry of [-0.6, -0.4, -0.2, 0.0]) {
    for (let rz of [-0.6, -0.4, -0.2, 0.0]) {
      for (let fx of [-0.4, -0.2, 0.0, 0.2]) {
        for (let fz of [-1.2, -1.5, -1.8, -2.1]) {
          for (let hx of [-0.4, -0.2, 0.0, 0.2, 0.4]) {
            for (let hy of [-0.6, -0.4, -0.2, 0.0, 0.2]) {
              for (let hz of [-0.4, -0.2, 0.0, 0.2, 0.4]) {
                bones.RightArm.rotation.set(rx, ry, rz);
                bones.RightForeArm.rotation.set(fx, 0, fz);
                bones.RightHand.rotation.set(hx, hy, hz);
                cloned.updateMatrixWorld(true);

                gun.getWorldQuaternion(gunQuat);
                gunForward.set(0, 0, 1).applyQuaternion(gunQuat);

                const angleDiff = gunForward.angleTo(targetDir);
                const hg = new THREE.Vector3();
                handguard.getWorldPosition(hg);

                // Gun should be at chest/eye height (125-145) and stock near shoulder
                if (hg.y >= 125 && hg.y <= 145 && hg.x >= -25 && hg.x <= 10 && hg.z >= 25 && hg.z <= 48) {
                  const score = angleDiff + Math.abs(hg.x + 5) * 0.02;
                  if (score < bestAimDiff) {
                    bestAimDiff = score;
                    bestAimAngles = {
                      rightArm: [rx, ry, rz],
                      rightFore: [fx, 0, fz],
                      rightHand: [hx, hy, hz],
                      gunForward: [Number(gunForward.x.toFixed(2)), Number(gunForward.y.toFixed(2)), Number(gunForward.z.toFixed(2))],
                      handguard: [Number(hg.x.toFixed(1)), Number(hg.y.toFixed(1)), Number(hg.z.toFixed(1))],
                      angleRad: Number(angleDiff.toFixed(3))
                    };
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

console.log('Best ADS Right Arm Aiming Angles:', bestAimAngles);

