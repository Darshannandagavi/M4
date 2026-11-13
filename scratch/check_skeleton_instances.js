const path = require('path');
const THREE = require(path.join(__dirname, '../client/node_modules/three'));
const fs = require('fs');
const { FBXLoader } = require(path.join(__dirname, '../client/node_modules/three-stdlib'));
global.window = global;
global.document = { createElementNS: () => ({}), createElement: () => ({}) };

const loader = new FBXLoader();
const fbxData = fs.readFileSync('f:/BMW-M4/client/src/assets/models/Characters/X Bot.fbx');
const char = loader.parse(fbxData.buffer.slice(fbxData.byteOffset, fbxData.byteOffset + fbxData.byteLength), '');

const surface = char.getObjectByName('Beta_Surface');
const joints = char.getObjectByName('Beta_Joints');

const sHips = surface.skeleton.bones[0];
const jHips = joints.skeleton.bones[0];

console.log("surface hips === joints hips?", sHips === jHips);

const traversedBones = [];
char.traverse(n => { if (n.isBone) traversedBones.push(n); });
console.log("traversedBones[0] === sHips?", traversedBones[0] === sHips);
console.log("traversedBones includes sHips?", traversedBones.includes(sHips));
console.log("traversedBones includes jHips?", traversedBones.includes(jHips));

// Find RightArm in surface skeleton
const sRightArm = surface.skeleton.bones.find(b => b.name === 'mixamorigRightArm');
const jRightArm = joints.skeleton.bones.find(b => b.name === 'mixamorigRightArm');
console.log("sRightArm === jRightArm?", sRightArm === jRightArm);

// Check what CharacterModel.jsx did:
const bonesRef = {};
char.traverse((node) => {
  if (node.isBone) {
    const cleanKey = node.name.replace(/^mixamorig:?/i, "");
    bonesRef[cleanKey] = node;
  }
});

console.log("bonesRef.RightArm === sRightArm?", bonesRef.RightArm === sRightArm);
console.log("bonesRef.RightArm === jRightArm?", bonesRef.RightArm === jRightArm);

