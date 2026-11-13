const path = require('path');
const THREE = require(path.join(__dirname, '../client/node_modules/three'));
const fs = require('fs');
const { FBXLoader } = require(path.join(__dirname, '../client/node_modules/three-stdlib'));
global.window = global;
global.document = { createElementNS: () => ({}), createElement: () => ({}) };

const loader = new FBXLoader();
const fbxData = fs.readFileSync('f:/BMW-M4/client/src/assets/models/Characters/X Bot.fbx');
const char = loader.parse(fbxData.buffer.slice(fbxData.byteOffset, fbxData.byteOffset + fbxData.byteLength), '');

const rArm = char.getObjectByName('mixamorig:RightArm');
console.log('rArm matrixAutoUpdate:', rArm.matrixAutoUpdate);
console.log('rArm rot before:', rArm.rotation.toArray());
console.log('rArm quat before:', rArm.quaternion.toArray());

rArm.rotation.set(1.5, 0.5, 0.2);
console.log('rArm rot after set:', rArm.rotation.toArray());
console.log('rArm quat after set:', rArm.quaternion.toArray());

rArm.updateMatrix();
console.log('rArm matrix elements 12,13,14:', rArm.matrix.elements.slice(12, 15));

