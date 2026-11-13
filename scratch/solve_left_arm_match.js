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

// Setup gun
const gun = new THREE.Group();
gun.scale.setScalar(100);
gun.position.set(0.5, 9.5, 3.2);
gun.rotation.set(-0.62, 1.32, -0.62);

const handguard = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.075, 0.24));
handguard.position.set(0, 0.048, 0.28);
gun.add(handguard);
bones.RightHand.add(gun);

// Set right arm
bones.RightArm.rotation.set(1.0, -0.4, 0.0);
bones.RightForeArm.rotation.set(0, 0, -1.6);
bones.RightHand.rotation.set(0, -0.2, 0);

cloned.updateMatrixWorld(true);

const hgPos = new THREE.Vector3();
handguard.getWorldPosition(hgPos);
console.log('Target Handguard Pos:', hgPos);

let bestDist = Infinity;
let bestLeft = null;

const handPos = new THREE.Vector3();
for (let lx = 0.2; lx <= 1.5; lx += 0.05) {
  for (let ly = -0.8; ly <= 0.8; ly += 0.05) {
    for (let lz = -0.8; lz <= 0.8; lz += 0.05) {
      for (let fz = 0.5; fz <= 2.2; fz += 0.05) {
        bones.LeftArm.rotation.set(lx, ly, lz);
        bones.LeftForeArm.rotation.set(0, 0, fz);
        cloned.updateMatrixWorld(true);
        bones.LeftHand.getWorldPosition(handPos);
        const d = handPos.distanceTo(hgPos);
        if (d < bestDist) {
          bestDist = d;
          bestLeft = {
            arm: [Number(lx.toFixed(2)), Number(ly.toFixed(2)), Number(lz.toFixed(2))],
            fore: [0, 0, Number(fz.toFixed(2))],
            handPos: [Number(handPos.x.toFixed(1)), Number(handPos.y.toFixed(1)), Number(handPos.z.toFixed(1))],
            dist: Number(d.toFixed(2))
          };
        }
      }
    }
  }
}

console.log('Best Left Arm:', bestLeft);

