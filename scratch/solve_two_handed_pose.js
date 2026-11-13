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

// Build gun group
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

function getHandguardWorldPos() {
  cloned.updateMatrixWorld(true);
  const v = new THREE.Vector3();
  handguard.getWorldPosition(v);
  return v;
}

function getLeftHandWorldPos() {
  cloned.updateMatrixWorld(true);
  const v = new THREE.Vector3();
  bones.LeftHand.getWorldPosition(v);
  return v;
}

console.log('--- Initial idle pose ---');
console.log('Handguard world pos:', getHandguardWorldPos());
console.log('LeftHand world pos:', getLeftHandWorldPos());
console.log('Initial distance:', getLeftHandWorldPos().distanceTo(getHandguardWorldPos()).toFixed(2), 'cm');

