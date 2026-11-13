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
const mixer = new THREE.AnimationMixer(cloned);
const action = mixer.clipAction(idleAnim.animations[0]);
action.play();

// Update mixer
mixer.update(0.1);

const surface = cloned.getObjectByName('Beta_Surface');
const joints = cloned.getObjectByName('Beta_Joints');

const sArm = surface.skeleton.bones.find(b => b.name === 'mixamorigRightArm');
const jArm = joints.skeleton.bones.find(b => b.name === 'mixamorigRightArm');

console.log('sArm quaternion after mixer.update:', sArm.quaternion);
console.log('jArm quaternion after mixer.update:', jArm.quaternion);

// Now see if rotating sArm rotates Beta_Surface vertices or jArm
console.log('sArm parent:', sArm.parent.name, sArm.parent.uuid);
console.log('jArm parent:', jArm.parent.name, jArm.parent.uuid);

