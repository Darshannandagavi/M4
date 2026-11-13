const path = require('path');
const THREE = require(path.join(__dirname, '../client/node_modules/three'));

const obj = new THREE.Object3D();
console.log("Initial quat:", obj.quaternion.toArray());

// Simulate mixer updating quaternion
obj.quaternion.set(0.5, 0.2, 0.1, 0.8).normalize();
console.log("After mixer quat:", obj.quaternion.toArray());
console.log("Rot after mixer:", obj.rotation.toArray());

// Now our useFrame calls obj.rotation.set(...)
obj.rotation.set(1.2, 0.3, -0.4);
console.log("After rotation.set quat:", obj.quaternion.toArray());
console.log("After rotation.set rot:", obj.rotation.toArray());

