import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { MeshBVH, CENTER, acceleratedRaycast } from "three-mesh-bvh";

import rainierUrl from "../../assets/models/gt_racing_2_-_mount_rainier.glb";
import bermudaUrl from "../../assets/models/bermuda_remastered__free_fire.glb";
import coteUrl from "../../assets/models/gt_racing_2_-_cote_d_azur.glb";

const MAP_URLS = {
  bermuda: bermudaUrl,
  rainier: rainierUrl,
  cotedazur: coteUrl,
};

const SKY_NAME = /sky|cloud|dome|horizon|atmos/i;

function isSkyLike(mesh) {
  for (let node = mesh; node; node = node.parent) {
    if (SKY_NAME.test(node.name)) return true;
  }
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  return mats.some((m) => m && m.side === THREE.BackSide);
}

export default function OpenWorldMap({ collidersRef, mapKey = "bermuda", onCollidersReady }) {
  const activeUrl = MAP_URLS[mapKey] || MAP_URLS.rainier;
  const { scene } = useGLTF(activeUrl);
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

    return {
      scene: mapScene,
      position: [-center.x, 0, -center.z],
    };
  }, [scene]);

  const onReadyRef = useRef(onCollidersReady);
  onReadyRef.current = onCollidersReady;

  useEffect(() => {
    const group = groupRef.current;
    if (!group || !collidersRef) return undefined;

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

        if (isSkyLike(mesh)) continue;

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
        colliders.meshes = colliders.map((c) => c.mesh);
        colliders.ready = true;
        onReadyRef.current?.();
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

useGLTF.preload(bermudaUrl);
useGLTF.preload(rainierUrl);
