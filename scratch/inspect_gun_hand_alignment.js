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

// Let's inspect RightHand's local axes in rest pose:
cloned.updateMatrixWorld(true);
const rHand = bones.RightHand;
const m = rHand.matrixWorld;
const xAxis = new THREE.Vector3(m.elements[0], m.elements[1], m.elements[2]).normalize();
const yAxis = new THREE.Vector3(m.elements[4], m.elements[5], m.elements[6]).normalize();
const zAxis = new THREE.Vector3(m.elements[8], m.elements[9], m.elements[10]).normalize();

console.log('RightHand World Axes in Rest Pose:');
console.log('X (red):', xAxis);
console.log('Y (green):', yAxis);
console.log('Z (blue):', zAxis);

// When a person holds a pistol grip:
// - The fingers curl around the grip.
// - The barrel extends perpendicular to the forearm along the knuckles/thumb direction.
// What axis of RightHand does the barrel point along when the gun is added as a child of RightHand?
// If gun.rotation is (rx, ry, rz), what local direction in RightHand space does (0, 0, 1) map to?
const gun = new THREE.Group();
gun.rotation.set(-0.62, 1.32, -0.62);
const gunFwdInHand = new THREE.Vector3(0, 0, 1).applyEuler(gun.rotation);
console.log('Gun forward in RightHand local space with current rot [-0.62, 1.32, -0.62]:', gunFwdInHand);

