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

const bones = [];
cloned.traverse(n => { if (n.isBone) bones.push(n); });
console.log('Total bones in cloned:', bones.length);

const meshes = [];
cloned.traverse(n => { if (n.isSkinnedMesh) meshes.push(n); });
console.log('SkinnedMeshes:', meshes.map(m => m.name));
meshes.forEach(m => {
  console.log(m.name, 'skeleton bones count:', m.skeleton.bones.length);
  console.log(m.name, 'first bone:', m.skeleton.bones[0].name, 'uuid:', m.skeleton.bones[0].uuid);
});

// Check if both meshes share the same bones or if each mesh has separate bones
const surfaceArm = meshes[0].skeleton.bones.find(b => b.name === 'mixamorigRightArm');
const jointsArm = meshes[1].skeleton.bones.find(b => b.name === 'mixamorigRightArm');
console.log('surfaceArm === jointsArm?', surfaceArm === jointsArm);

// Check if all bones in both meshes can be updated together
console.log('surfaceArm uuid:', surfaceArm?.uuid);
console.log('jointsArm uuid:', jointsArm?.uuid);

