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
const idleData = fs.readFileSync(path.join(__dirname, '../client/src/assets/models/Characters/idle.fbx'));
const idleAnim = loader.parse(idleData.buffer.slice(idleData.byteOffset, idleData.byteOffset + idleData.byteLength), '');

const cloned = clone(char);
const surface = cloned.getObjectByName('Beta_Surface');
const bones = {};
surface.skeleton.bones.forEach(b => {
  const cleanKey = b.name.replace(/^mixamorig:?/i, '');
  if (!bones[cleanKey]) bones[cleanKey] = b;
});

// Build gun
const gun = new THREE.Group();
gun.scale.setScalar(100);
gun.position.set(0.5, 9.5, 3.2);
gun.rotation.set(-0.62, 1.32, -0.62);

const handguard = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.075, 0.24));
handguard.position.set(0, 0.048, 0.28);
gun.add(handguard);
bones.RightHand.add(gun);

const mixer = new THREE.AnimationMixer(cloned);
const action = mixer.clipAction(idleAnim.animations[0]);
action.play();
mixer.update(0.1);

// Let's test two-bone IK for Left Arm to reach handguard target
function solveLeftArmIK(targetWorldPos) {
  cloned.updateMatrixWorld(true);

  const leftShoulder = bones.LeftShoulder;
  const leftArm = bones.LeftArm;
  const leftForeArm = bones.LeftForeArm;
  const leftHand = bones.LeftHand;

  // Simple, robust cyclic coordinate descent (CCD) or analytical solver
  // Let's see current distance:
  const handPos = new THREE.Vector3();
  leftHand.getWorldPosition(handPos);
  
  // Test CCD iterations:
  for (let iter = 0; iter < 15; iter++) {
    // 1. Rotate LeftForeArm to point LeftHand towards target
    cloned.updateMatrixWorld(true);
    const elbowPos = new THREE.Vector3();
    leftForeArm.getWorldPosition(elbowPos);
    leftHand.getWorldPosition(handPos);

    const vForeToHand = handPos.clone().sub(elbowPos).normalize();
    const vForeToTarget = targetWorldPos.clone().sub(elbowPos).normalize();
    const qFore = new THREE.Quaternion().setFromUnitVectors(vForeToHand, vForeToTarget);

    // Apply rotation in world space to leftForeArm
    const parentForeWorldQuat = new THREE.Quaternion();
    leftForeArm.parent.getWorldQuaternion(parentForeWorldQuat);
    const parentForeWorldQuatInv = parentForeWorldQuat.clone().invert();

    const currentForeWorldQuat = new THREE.Quaternion();
    leftForeArm.getWorldQuaternion(currentForeWorldQuat);
    const newForeWorldQuat = qFore.multiply(currentForeWorldQuat);
    leftForeArm.quaternion.copy(parentForeWorldQuatInv.multiply(newForeWorldQuat));

    // 2. Rotate LeftArm to point LeftHand towards target
    cloned.updateMatrixWorld(true);
    const shoulderPos = new THREE.Vector3();
    leftArm.getWorldPosition(shoulderPos);
    leftHand.getWorldPosition(handPos);

    const vArmToHand = handPos.clone().sub(shoulderPos).normalize();
    const vArmToTarget = targetWorldPos.clone().sub(shoulderPos).normalize();
    const qArm = new THREE.Quaternion().setFromUnitVectors(vArmToHand, vArmToTarget);

    const parentArmWorldQuat = new THREE.Quaternion();
    leftArm.parent.getWorldQuaternion(parentArmWorldQuat);
    const parentArmWorldQuatInv = parentArmWorldQuat.clone().invert();

    const currentArmWorldQuat = new THREE.Quaternion();
    leftArm.getWorldQuaternion(currentArmWorldQuat);
    const newArmWorldQuat = qArm.multiply(currentArmWorldQuat);
    leftArm.quaternion.copy(parentArmWorldQuatInv.multiply(newArmWorldQuat));
  }

  cloned.updateMatrixWorld(true);
  leftHand.getWorldPosition(handPos);
  return handPos.distanceTo(targetWorldPos);
}

cloned.updateMatrixWorld(true);
const target = new THREE.Vector3();
handguard.getWorldPosition(target);

console.log('Distance from LeftArm (shoulder) to handguard target:',
  bones.LeftArm.getWorldPosition(new THREE.Vector3()).distanceTo(target).toFixed(2), 'cm'
);

const finalDist = solveLeftArmIK(target);
console.log('Distance after Left Arm IK:', finalDist.toFixed(2), 'cm');
console.log('LeftArm rotation:', bones.LeftArm.rotation);
console.log('LeftForeArm rotation:', bones.LeftForeArm.rotation);

