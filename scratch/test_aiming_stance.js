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

// Build gun
const gun = new THREE.Group();
gun.scale.setScalar(100);
gun.position.set(0.5, 9.5, 3.2);
gun.rotation.set(-0.62, 1.32, -0.62);

const handguard = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.075, 0.24));
handguard.position.set(0, 0.048, 0.28);
gun.add(handguard);
bones.RightHand.add(gun);

// Let's test two stances:
// 1. AIMING / ADS STANCE:
// Right arm brought up to shoulder/chest, aiming forward (+Z).
// Let's test combinations of (rArm, rForeArm, rHand):
console.log('--- Testing Aiming Stance ---');
bones.RightArm.rotation.set(0.35, -0.25, -0.55);
bones.RightForeArm.rotation.set(-0.25, -0.15, -1.35);
bones.RightHand.rotation.set(-0.15, -0.4, 0.35);

cloned.updateMatrixWorld(true);

const hgPos = new THREE.Vector3();
handguard.getWorldPosition(hgPos);
const rHandPos = new THREE.Vector3();
bones.RightHand.getWorldPosition(rHandPos);

console.log('RightHand pos:', rHandPos);
console.log('Handguard pos:', hgPos);

// Gun forward direction (along local Z of gun):
const gunDir = new THREE.Vector3(0, 0, 1).applyQuaternion(handguard.getWorldQuaternion(new THREE.Quaternion())).normalize();
console.log('Gun forward direction:', gunDir);

