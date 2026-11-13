const THREE = require('./client/node_modules/three');
const fs = require('fs');

// Create mock DOM for three/examples loaders
global.window = global;
global.document = {
  createElementNS: () => ({}),
  createElement: () => ({}),
};

console.log("Analyzing Mixamo bone hierarchy and coordinate frames...");

// Build the rifle group exactly as in CharacterModel.jsx
const _gunGeoms = {
  grip: new THREE.BoxGeometry(0.038, 0.13, 0.046),
  body: new THREE.BoxGeometry(0.048, 0.088, 0.32),
  handguard: new THREE.BoxGeometry(0.052, 0.075, 0.24),
  barrel: new THREE.CylinderGeometry(0.014, 0.014, 0.32, 8),
};
const mat = new THREE.MeshBasicMaterial();

function buildGun() {
  const group = new THREE.Group();
  group.name = "EQUIPPED_WEAPON_GROUP";
  group.scale.setScalar(100);
  group.position.set(0.5, 9.5, 3.2);
  group.rotation.set(-0.62, 1.32, -0.62);

  const grip = new THREE.Mesh(_gunGeoms.grip, mat);
  grip.position.set(0, -0.04, -0.02);
  group.add(grip);

  const handguard = new THREE.Mesh(_gunGeoms.handguard, mat);
  handguard.position.set(0, 0.048, 0.28);
  handguard.name = "HANDGUARD";
  group.add(handguard);

  return { group, handguard };
}

const { group: gun, handguard } = buildGun();
console.log("Gun structure created.");

// Test local handguard position relative to gun
const hgWorld = new THREE.Vector3();
handguard.getWorldPosition(hgWorld);
console.log("Handguard local in gun group:", handguard.position);

