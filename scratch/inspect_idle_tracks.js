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
const idleData = fs.readFileSync('f:/BMW-M4/client/src/assets/models/Characters/idle.fbx');
const idleObj = loader.parse(idleData.buffer.slice(idleData.byteOffset, idleData.byteOffset + idleData.byteLength), '');

const anim = idleObj.animations?.[0];
console.log("Idle clip name:", anim?.name, "Duration:", anim?.duration, "Tracks:", anim?.tracks.length);

const armTracks = anim?.tracks.filter(t => /arm|hand|shoulder/i.test(t.name));
console.log("Arm/Hand tracks in idle.fbx:", armTracks.map(t => t.name));

