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

// Fast IK solver for left arm to snap leftHand to target position
function solveLeftArmTo(targetPos) {
  const lArm = bones.LeftArm;
  const lFore = bones.LeftForeArm;
  const lHand = bones.LeftHand;

  // Analytical 2-bone IK:
  // Root: lArm, Mid: lFore, End: lHand
  cloned.updateMatrixWorld(true);

  for (let iter = 0; iter < 10; iter++) {
    cloned.updateMatrixWorld(true);
    const elbowPos = new THREE.Vector3();
    const handPos = new THREE.Vector3();
    lFore.getWorldPosition(elbowPos);
    lHand.getWorldPosition(handPos);

    // 1. Rotate elbow to aim towards target
    const v1 = handPos.clone().sub(elbowPos).normalize();
    const v2 = targetPos.clone().sub(elbowPos).normalize();
    const q1 = new THREE.Quaternion().setFromUnitVectors(v1, v2);

    const parentForeQ = new THREE.Quaternion();
    lFore.parent.getWorldQuaternion(parentForeQ);
    const curForeQ = new THREE.Quaternion();
    lFore.getWorldQuaternion(curForeQ);
    lFore.quaternion.copy(parentForeQ.invert().multiply(q1.multiply(curForeQ)));

    // 2. Rotate shoulder to aim hand towards target
    cloned.updateMatrixWorld(true);
    const shoulderPos = new THREE.Vector3();
    lArm.getWorldPosition(shoulderPos);
    lHand.getWorldPosition(handPos);

    const v3 = handPos.clone().sub(shoulderPos).normalize();
    const v4 = targetPos.clone().sub(shoulderPos).normalize();
    const q2 = new THREE.Quaternion().setFromUnitVectors(v3, v4);

    const parentArmQ = new THREE.Quaternion();
    lArm.parent.getWorldQuaternion(parentArmQ);
    const curArmQ = new THREE.Quaternion();
    lArm.getWorldQuaternion(curArmQ);
    lArm.quaternion.copy(parentArmQ.invert().multiply(q2.multiply(curArmQ)));
  }

  cloned.updateMatrixWorld(true);
  const finalHandPos = new THREE.Vector3();
  lHand.getWorldPosition(finalHandPos);
  return finalHandPos.distanceTo(targetPos);
}

// Let's test aiming:
// In aiming, we want gunForward = [0, 0, 1]
// Handguard is target for left arm
console.log('Testing aim alignment...');

const gunQuat = new THREE.Quaternion();
const gunForward = new THREE.Vector3();
const hgPos = new THREE.Vector3();

// Let's search for right arm angles where gun points directly forward (+Z):
let bestScore = Infinity;
let bestPose = null;

for (let rx = -1.6; rx <= 1.6; rx += 0.2) {
  for (let ry = -1.6; ry <= 1.6; ry += 0.2) {
    for (let rz = -1.6; rz <= 1.6; rz += 0.2) {
      for (let fx = -1.6; fx <= 1.6; fx += 0.4) {
        for (let fz = -2.2; fz <= 0.0; fz += 0.4) {
          bones.RightArm.rotation.set(rx, ry, rz);
          bones.RightForeArm.rotation.set(fx, 0, fz);
          bones.RightHand.rotation.set(0, 0, 0);

          cloned.updateMatrixWorld(true);
          gun.getWorldQuaternion(gunQuat);
          gunForward.set(0, 0, 1).applyQuaternion(gunQuat);

          // We want gunForward: x near 0, y near 0, z near 1
          const dirError = Math.abs(gunForward.x) + Math.abs(gunForward.y) + (1 - gunForward.z);
          if (dirError > 0.4) continue;

          handguard.getWorldPosition(hgPos);
          // Check if handguard is in front of chest (y between 120 and 145, z between 25 and 45, x between -15 and 5)
          if (hgPos.y < 120 || hgPos.y > 145 || hgPos.z < 25 || hgPos.z > 50 || hgPos.x < -20 || hgPos.x > 10) continue;

          const distToLeftShoulder = hgPos.distanceTo(bones.LeftArm.getWorldPosition(new THREE.Vector3()));
          if (distToLeftShoulder > 50) continue;

          const score = dirError + Math.abs(hgPos.x + 5) * 0.01;
          if (score < bestScore) {
            bestScore = score;
            bestPose = {
              rArm: [rx, ry, rz],
              rFore: [fx, 0, fz],
              gunFwd: [Number(gunForward.x.toFixed(3)), Number(gunForward.y.toFixed(3)), Number(gunForward.z.toFixed(3))],
              hg: [Number(hgPos.x.toFixed(1)), Number(hgPos.y.toFixed(1)), Number(hgPos.z.toFixed(1))],
              distToLShoulder: Number(distToLeftShoulder.toFixed(1))
            };
          }
        }
      }
    }
  }
}

console.log('Best Aim Pose:', bestPose);

if (bestPose) {
  bones.RightArm.rotation.set(...bestPose.rArm);
  bones.RightForeArm.rotation.set(...bestPose.rFore);
  bones.RightHand.rotation.set(0, 0, 0);
  handguard.getWorldPosition(hgPos);

  // Set LeftArm initial guess pointing forward-across
  bones.LeftArm.rotation.set(1.0, 0.4, 0.6);
  bones.LeftForeArm.rotation.set(0, 0, 1.2);

  const ikDist = solveLeftArmTo(hgPos);
  console.log('IK final distance to handguard:', ikDist.toFixed(2), 'cm');
  console.log('LeftArm final rot:', bones.LeftArm.rotation);
  console.log('LeftForeArm final rot:', bones.LeftForeArm.rotation);
}

