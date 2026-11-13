const path = require('path');
const THREE = require(path.join(__dirname, '../client/node_modules/three'));
const fs = require('fs');
const { FBXLoader } = require(path.join(__dirname, '../client/node_modules/three-stdlib'));
global.window = global;
global.document = { createElementNS: () => ({}), createElement: () => ({}) };

const loader = new FBXLoader();
const fbxData = fs.readFileSync('f:/BMW-M4/client/src/assets/models/Characters/X Bot.fbx');
const char = loader.parse(fbxData.buffer.slice(fbxData.byteOffset, fbxData.byteOffset + fbxData.byteLength), '');

console.log("Top-level children:", char.children.map(c => ({ name: c.name, type: c.type })));

char.traverse(n => {
  if (n.isSkinnedMesh) {
    console.log("SkinnedMesh:", n.name, "Bones count in skeleton:", n.skeleton.bones.length);
    console.log("Root bone of skeleton:", n.skeleton.bones[0]?.name);
  }
});

