const path = require('path');
const THREE = require(path.join(__dirname, '../client/node_modules/three'));
const fs = require('fs');
const { FBXLoader } = require(path.join(__dirname, '../client/node_modules/three-stdlib'));
global.window = global;
global.document = {
  createElementNS: () => ({}),
  createElement: () => ({}),
};

const loader = new FBXLoader();
const fbxData = fs.readFileSync('f:/BMW-M4/client/src/assets/models/Characters/X Bot.fbx');
const fbxArrayBuffer = fbxData.buffer.slice(fbxData.byteOffset, fbxData.byteOffset + fbxData.byteLength);

const object = loader.parse(fbxArrayBuffer, '');

console.log("Parsed X Bot successfully!");
const bones = {};
object.traverse((n) => {
  if (n.isBone) {
    const clean = n.name.replace(/^mixamorig:?/i, '');
    bones[clean] = n;
  }
});

console.log("Total bones found:", Object.keys(bones).length);
['RightArm', 'RightForeArm', 'RightHand', 'LeftArm', 'LeftForeArm', 'LeftHand', 'Spine', 'Spine1', 'Spine2'].forEach((b) => {
  const bone = bones[b];
  if (bone) {
    console.log(`${b}: pos=(${bone.position.x.toFixed(2)}, ${bone.position.y.toFixed(2)}, ${bone.position.z.toFixed(2)}) rot=(${bone.rotation.x.toFixed(2)}, ${bone.rotation.y.toFixed(2)}, ${bone.rotation.z.toFixed(2)})`);
  }
});
