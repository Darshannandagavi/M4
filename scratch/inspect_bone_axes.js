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

function inspectAxes(boneName) {
  const b = bones[boneName];
  const m = b.matrixWorld;
  const xAxis = new THREE.Vector3(m.elements[0], m.elements[1], m.elements[2]).normalize();
  const yAxis = new THREE.Vector3(m.elements[4], m.elements[5], m.elements[6]).normalize();
  const zAxis = new THREE.Vector3(m.elements[8], m.elements[9], m.elements[10]).normalize();
  console.log(`${boneName}:`);
  console.log(`  X axis (red):   [${xAxis.x.toFixed(3)}, ${xAxis.y.toFixed(3)}, ${xAxis.z.toFixed(3)}]`);
  console.log(`  Y axis (green): [${yAxis.x.toFixed(3)}, ${yAxis.y.toFixed(3)}, ${yAxis.z.toFixed(3)}]`);
  console.log(`  Z axis (blue):  [${zAxis.x.toFixed(3)}, ${zAxis.y.toFixed(3)}, ${zAxis.z.toFixed(3)}]`);
}

inspectAxes('RightArm');
inspectAxes('RightForeArm');
inspectAxes('RightHand');
inspectAxes('LeftArm');
inspectAxes('LeftForeArm');
inspectAxes('LeftHand');

