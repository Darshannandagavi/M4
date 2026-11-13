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
const joints = cloned.getObjectByName('Beta_Joints');

console.log('Surface skeleton bones:');
surface.skeleton.bones.slice(0, 15).forEach(b => console.log(' ', b.name, 'parent:', b.parent?.name));

console.log('Joints skeleton bones:');
joints.skeleton.bones.slice(0, 15).forEach(b => console.log(' ', b.name, 'parent:', b.parent?.name));

