const path = require('path');
const THREE = require(path.join(__dirname, '../client/node_modules/three'));
const fs = require('fs');
const { FBXLoader } = require(path.join(__dirname, '../client/node_modules/three-stdlib'));
global.window = global;
global.document = { createElementNS: () => ({}), createElement: () => ({}) };

const loader = new FBXLoader();
const idleData = fs.readFileSync('f:/BMW-M4/client/src/assets/models/Characters/idle.fbx');
const idleObj = loader.parse(idleData.buffer.slice(idleData.byteOffset, idleData.byteOffset + idleData.byteLength), '');
const anim = idleObj.animations[0];

const rArm = anim.tracks.find(t => t.name.includes('RightArm.quaternion'));
const lArm = anim.tracks.find(t => t.name.includes('LeftArm.quaternion'));
const rForeArm = anim.tracks.find(t => t.name.includes('RightForeArm.quaternion'));
const lForeArm = anim.tracks.find(t => t.name.includes('LeftForeArm.quaternion'));

console.log('rArm quat values t=0:', rArm?.values.slice(0, 4));
console.log('lArm quat values t=0:', lArm?.values.slice(0, 4));

const euler = new THREE.Euler();
if (rArm) {
  const q = new THREE.Quaternion().fromArray(rArm.values.slice(0, 4));
  euler.setFromQuaternion(q);
  console.log('rArm Euler (deg):', (euler.x * 180 / Math.PI).toFixed(1), (euler.y * 180 / Math.PI).toFixed(1), (euler.z * 180 / Math.PI).toFixed(1));
}
if (lArm) {
  const q = new THREE.Quaternion().fromArray(lArm.values.slice(0, 4));
  euler.setFromQuaternion(q);
  console.log('lArm Euler (deg):', (euler.x * 180 / Math.PI).toFixed(1), (euler.y * 180 / Math.PI).toFixed(1), (euler.z * 180 / Math.PI).toFixed(1));
}
if (rForeArm) {
  const q = new THREE.Quaternion().fromArray(rForeArm.values.slice(0, 4));
  euler.setFromQuaternion(q);
  console.log('rForeArm Euler (deg):', (euler.x * 180 / Math.PI).toFixed(1), (euler.y * 180 / Math.PI).toFixed(1), (euler.z * 180 / Math.PI).toFixed(1));
}
if (lForeArm) {
  const q = new THREE.Quaternion().fromArray(lForeArm.values.slice(0, 4));
  euler.setFromQuaternion(q);
  console.log('lForeArm Euler (deg):', (euler.x * 180 / Math.PI).toFixed(1), (euler.y * 180 / Math.PI).toFixed(1), (euler.z * 180 / Math.PI).toFixed(1));
}

