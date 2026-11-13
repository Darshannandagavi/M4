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

const mixer = new THREE.AnimationMixer(cloned);
const action = mixer.clipAction(idleAnim.animations[0]);
action.play();

mixer.update(0.1);
console.log('RightArm quat after mixer update:', bones.RightArm.quaternion);

// Apply custom rotation
bones.RightArm.rotation.set(1.2, 0.5, -0.3);
console.log('RightArm quat after custom rotation:', bones.RightArm.quaternion);

// If mixer updates again:
mixer.update(0.1);
console.log('RightArm quat after second mixer update (overwritten):', bones.RightArm.quaternion);

