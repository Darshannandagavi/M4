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

// Apply current CharacterModel.jsx aiming rotations:
// rightArm: -1.22, -0.28, 0.32
// rightForeArm: 0.78, 0.16, -0.44
// rightHand: -0.32, 0.22, -0.12
// leftArm: -1.02, 0.42, -0.34
// leftForeArm: -0.64, -0.26, 0.62
// leftHand: 0.32, 0.18, -0.22
bones.RightArm.rotation.set(-1.22, -0.28, 0.32);
bones.RightForeArm.rotation.set(0.78, 0.16, -0.44);
bones.RightHand.rotation.set(-0.32, 0.22, -0.12);

bones.LeftArm.rotation.set(-1.02, 0.42, -0.34);
bones.LeftForeArm.rotation.set(-0.64, -0.26, 0.62);
bones.LeftHand.rotation.set(0.32, 0.18, -0.22);

char.updateMatrixWorld(true);

const rHandWorld = new THREE.Vector3();
bones.RightHand.getWorldPosition(rHandWorld);

const lHandWorld = new THREE.Vector3();
bones.LeftHand.getWorldPosition(lHandWorld);

const hgWorld = new THREE.Vector3();
handguard.getWorldPosition(hgWorld);

console.log("Aiming - RightHand:", rHandWorld);
console.log("Aiming - LeftHand:", lHandWorld);
console.log("Aiming - Handguard:", hgWorld);
console.log("Aiming - Distance between LeftHand and Handguard:", lHandWorld.distanceTo(hgWorld).toFixed(2));

