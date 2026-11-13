const path = require('path');
const THREE = require(path.join(__dirname, '../client/node_modules/three'));
const fs = require('fs');
const { FBXLoader } = require(path.join(__dirname, '../client/node_modules/three-stdlib'));
global.window = global;
global.document = { createElementNS: () => ({}), createElement: () => ({}) };

const loader = new FBXLoader();
const fbxData = fs.readFileSync('f:/BMW-M4/client/src/assets/models/Characters/X Bot.fbx');
const char = loader.parse(fbxData.buffer.slice(fbxData.byteOffset, fbxData.byteOffset + fbxData.byteLength), '');

const bones = {};
char.traverse((n) => {
  if (n.isBone) bones[n.name.replace(/^mixamorig:?/i, '')] = n;
});

// Build gun group
const gun = new THREE.Group();
gun.scale.setScalar(100);
gun.position.set(0.5, 9.5, 3.2);
gun.rotation.set(-0.62, 1.32, -0.62);

const handguard = new THREE.Object3D();
handguard.position.set(0, 0.048, 0.28);
gun.add(handguard);

bones.RightHand.add(gun);

// Apply current CharacterModel.jsx rotations:
// rightArm: -0.76, -0.34, 0.38
// rightForeArm: 0.86, 0.18, -0.36
// rightHand: -0.26, 0.2, 0.08
// leftArm: -0.66, 0.46, -0.36
// leftForeArm: -0.76, -0.18, 0.64
// leftHand: 0.26, 0.14, -0.16
bones.RightArm.rotation.set(-0.76, -0.34, 0.38);
bones.RightForeArm.rotation.set(0.86, 0.18, -0.36);
bones.RightHand.rotation.set(-0.26, 0.2, 0.08);

bones.LeftArm.rotation.set(-0.66, 0.46, -0.36);
bones.LeftForeArm.rotation.set(-0.76, -0.18, 0.64);
bones.LeftHand.rotation.set(0.26, 0.14, -0.16);

char.updateMatrixWorld(true);

const rHandWorld = new THREE.Vector3();
bones.RightHand.getWorldPosition(rHandWorld);

const lHandWorld = new THREE.Vector3();
bones.LeftHand.getWorldPosition(lHandWorld);

const hgWorld = new THREE.Vector3();
handguard.getWorldPosition(hgWorld);

console.log("RightHand world pos:", rHandWorld);
console.log("LeftHand world pos:", lHandWorld);
console.log("Handguard world pos:", hgWorld);
console.log("Distance between LeftHand and Handguard:", lHandWorld.distanceTo(hgWorld).toFixed(2));

