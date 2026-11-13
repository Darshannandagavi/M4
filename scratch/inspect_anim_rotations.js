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

function testAnim(animName) {
  const data = fs.readFileSync(path.join(__dirname, `../client/src/assets/models/Characters/${animName}.fbx`));
  const anim = loader.parse(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength), '');
  const cloned = clone(char);
  const mixer = new THREE.AnimationMixer(cloned);
  const action = mixer.clipAction(anim.animations[0]);
  action.play();
  mixer.update(0.1);

  const surface = cloned.getObjectByName('Beta_Surface');
  const bones = {};
  surface.skeleton.bones.forEach(b => {
    const cleanKey = b.name.replace(/^mixamorig:?/i, '');
    if (!bones[cleanKey]) bones[cleanKey] = b;
  });

  cloned.updateMatrixWorld(true);

  console.log(`=== ${animName} ===`);
  ['RightArm', 'RightForeArm', 'RightHand', 'LeftArm', 'LeftForeArm', 'LeftHand'].forEach(name => {
    const b = bones[name];
    const e = b.rotation;
    const pos = new THREE.Vector3();
    b.getWorldPosition(pos);
    console.log(`  ${name}: rot Euler=[${e.x.toFixed(3)}, ${e.y.toFixed(3)}, ${e.z.toFixed(3)}], worldPos=[${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)}]`);
  });
}

testAnim('idle');
testAnim('running');

