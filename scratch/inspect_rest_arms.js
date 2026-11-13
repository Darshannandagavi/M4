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

cloned.updateMatrixWorld(true);

function getPos(obj) {
  const v = new THREE.Vector3();
  obj.getWorldPosition(v);
  return v;
}

console.log('Rest pose positions:');
console.log('Hips:', getPos(bones.Hips));
console.log('Spine2:', getPos(bones.Spine2));
console.log('RightArm:', getPos(bones.RightArm));
console.log('RightForeArm:', getPos(bones.RightForeArm));
console.log('RightHand:', getPos(bones.RightHand));
console.log('LeftArm:', getPos(bones.LeftArm));
console.log('LeftForeArm:', getPos(bones.LeftForeArm));
console.log('LeftHand:', getPos(bones.LeftHand));

// Check bone lengths:
const rArmLen = getPos(bones.RightArm).distanceTo(getPos(bones.RightForeArm));
const rForeArmLen = getPos(bones.RightForeArm).distanceTo(getPos(bones.RightHand));
const lArmLen = getPos(bones.LeftArm).distanceTo(getPos(bones.LeftForeArm));
const lForeArmLen = getPos(bones.LeftForeArm).distanceTo(getPos(bones.LeftHand));

console.log('Lengths:');
console.log('Right upper arm len:', rArmLen.toFixed(2));
console.log('Right forearm len:', rForeArmLen.toFixed(2));
console.log('Left upper arm len:', lArmLen.toFixed(2));
console.log('Left forearm len:', lForeArmLen.toFixed(2));

