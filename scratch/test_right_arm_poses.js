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

// Build gun
const gun = new THREE.Group();
gun.scale.setScalar(100);
gun.position.set(0.5, 9.5, 3.2);
gun.rotation.set(-0.62, 1.32, -0.62);

const handguard = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.075, 0.24));
handguard.position.set(0, 0.048, 0.28);
gun.add(handguard);
bones.RightHand.add(gun);

// Let's test posing RightArm and RightForeArm forward and across chest
// In Mixamo coordinate system:
// RightArm rest position is pointing along -X.
// Let's test rotating RightArm forward:
// Rotations around X, Y, Z:
console.log('Testing Right Arm Poses...');

function testPose(rArmRot, rForeArmRot, rHandRot) {
  bones.RightArm.rotation.set(...rArmRot);
  bones.RightForeArm.rotation.set(...rForeArmRot);
  bones.RightHand.rotation.set(...rHandRot);
  cloned.updateMatrixWorld(true);

  const handguardPos = new THREE.Vector3();
  handguard.getWorldPosition(handguardPos);

  const leftShoulderPos = new THREE.Vector3();
  bones.LeftArm.getWorldPosition(leftShoulderPos);

  const distToLeftShoulder = handguardPos.distanceTo(leftShoulderPos);
  console.log(`RightArm: [${rArmRot}], ForeArm: [${rForeArmRot}] -> handguard: [${handguardPos.x.toFixed(1)}, ${handguardPos.y.toFixed(1)}, ${handguardPos.z.toFixed(1)}], dist to LeftShoulder: ${distToLeftShoulder.toFixed(1)} cm`);
  return { distToLeftShoulder, handguardPos };
}

// Let's test a few combinations:
testPose([-0.7, -0.4, 0.8], [0.8, 0.2, -0.4], [-0.2, 0.2, 0.1]);
testPose([-1.1, -0.3, 0.7], [0.9, 0.1, -0.5], [-0.3, 0.2, -0.1]);
testPose([1.2, 0.3, -0.4], [0.8, -0.2, 0.3], [0, 0, 0]);
testPose([0.9, -0.6, -0.3], [0.8, 0.4, 0.2], [0, 0, 0]);
testPose([-0.9, 0.4, 1.1], [1.1, -0.3, -0.4], [-0.2, 0.3, 0]);

