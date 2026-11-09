import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { MeshBVH, CENTER, acceleratedRaycast } from "three-mesh-bvh";
import mapUrl from "../../assets/models/gt_racing_2_-_mount_rainier.glb";

const SKY_NAME = /sky|cloud|dome|horizon|atmos/i;

// Sky domes are usually huge BackSide spheres. They must never be collidable.
function isSkyLike(mesh) {
  for (let node = mesh; node; node = node.parent) {
    if (SKY_NAME.test(node.name)) return true;
  }
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  return mats.some((m) => m && m.side === THREE.BackSide);
}

/**
 * GT Racing 2 - Cote d'Azur map from Sketchfab.
 * The map uses Y as its vertical axis, so it is not rotated.
 * Its X/Z center is shifted to the world origin while authored elevations
 * are preserved.
 *
 * Every mesh also gets a BVH so the car can raycast against the map cheaply.
 * Meshes are registered in `collidersRef` in small time slices so entering
 * Drive mode doesn't freeze the page.
 */
export default function OpenWorldMap({ collidersRef }) {
  const { scene } = useGLTF(mapUrl);
  const groupRef = useRef(null);

  const mapData = useMemo(() => {
    const mapScene = scene.clone(true);
    mapScene.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(mapScene);
    const center = bounds.getCenter(new THREE.Vector3());

    mapScene.traverse((object) => {
      if (!object.isMesh) return;
      object.castShadow = false;
      object.receiveShadow = false;
      object.frustumCulled = true;
    });

    console.info("[OpenWorldMap] Loaded map", {
      meshCount: (() => {
        let count = 0;
        mapScene.traverse((object) => {
          if (object.isMesh) count += 1;
        });
        return count;
      })(),
      size: bounds.getSize(new THREE.Vector3()).toArray(),
      center: center.toArray(),
    });

    return {
      scene: mapScene,
      position: [-center.x, 0, -center.z],
    };
  }, [scene]);

  useEffect(() => {
    const group = groupRef.current;
    if (!group || !collidersRef) return undefined;

    // Include the group's offset in every world matrix / box below.
    group.updateWorldMatrix(true, true);

    const meshes = [];
    group.traverse((object) => {
      if (object.isMesh && !object.isInstancedMesh && !object.isSkinnedMesh) {
        meshes.push(object);
      }
    });

    const colliders = [];
    collidersRef.current = colliders;

    let index = 0;
    let timer = 0;
    let cancelled = false;

    const buildSlice = () => {
      if (cancelled) return;
      const start = performance.now();

      while (index < meshes.length && performance.now() - start < 12) {
        const mesh = meshes[index++];

        if (isSkyLike(mesh)) {
          console.info("[OpenWorldMap] Skipping sky-like mesh:", mesh.name);
          continue;
        }

        try {
          const geometry = mesh.geometry;
          if (!geometry.boundsTree) {
            geometry.boundsTree = new MeshBVH(geometry, { strategy: CENTER });
          }
          mesh.raycast = acceleratedRaycast;
          colliders.push({ mesh, box: new THREE.Box3().setFromObject(mesh) });
        } catch (error) {
          console.warn(
            "[OpenWorldMap] Collision skipped for",
            mesh.name,
            error,
          );
        }
      }

      if (index < meshes.length) {
        timer = window.setTimeout(buildSlice, 0);
      } else {
        colliders.ready = true;
        console.info(
          `[OpenWorldMap] Collision ready: ${colliders.length} meshes`,
        );
        // Diagnostic: the highest collidable meshes. If the car still spawns
        // too high, one of these is the culprit.
        console.table(
          [...colliders]
            .sort((a, b) => b.box.max.y - a.box.max.y)
            .slice(0, 8)
            .map(({ mesh, box }) => ({
              name: mesh.name,
              minY: +box.min.y.toFixed(1),
              maxY: +box.max.y.toFixed(1),
            })),
        );
      }
    };

    buildSlice();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      collidersRef.current = [];
    };
  }, [mapData, collidersRef]);

  return (
    <group ref={groupRef} position={mapData.position}>
      <primitive object={mapData.scene} />
    </group>
  );
}

useGLTF.preload(mapUrl);
