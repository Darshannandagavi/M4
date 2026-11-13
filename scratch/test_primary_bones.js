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

// Let's create primaryBones map from surface.skeleton.bones
const bones = {};
surface.skeleton.bones.forEach(b => {
  const cleanKey = b.name.replace(/^mixamorig:?/i, '');
  bones[cleanKey] = b;
});

console.log('Found main bones:', Object.keys(bones).length);
console.log('RightArm:', bones.RightArm?.name, 'uuid:', bones.RightArm?.uuid);
console.log('RightForeArm:', bones.RightForeArm?.name, 'uuid:', bones.RightForeArm?.uuid);
console.log('RightHand:', bones.RightHand?.name, 'uuid:', bones.RightHand?.uuid);
console.log('LeftArm:', bones.LeftArm?.name, 'uuid:', bones.LeftArm?.uuid);
console.log('LeftForeArm:', bones.LeftForeArm?.name, 'uuid:', bones.LeftForeArm?.uuid);
console.log('LeftHand:', bones.LeftHand?.name, 'uuid:', bones.LeftHand?.uuid);

// Check if child joint bones move along when main bone moves:
const sArm = bones.RightArm;
const jArm = cloned.getObjectByName('Beta_Joints').skeleton.bones.find(b => b.name === 'mixamorigRightArm');
console.log('jArm.parent === sArm?', jArm.parent === sArm);

