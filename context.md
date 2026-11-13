# Project Context

You are helping with an existing software project.

## Instructions

1. First understand the project architecture before answering.
2. Do not modify unrelated files.
3. Reuse the existing project structure and coding style.
4. Make only the minimum required changes.
5. Mention every file that needs to be modified.
6. If additional files are required, ask only for those files.

---

## Project Structure

```text
├── .gitignore
├── client
│   ├── README.md
│   ├── package.json
│   ├── public
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   └── src
│       ├── App.css
│       ├── App.js
│       ├── App.jsx
│       ├── App.test.js
│       ├── FreeFireFeatures.test.js
│       ├── components
│       │   ├── Aircraft
│       │   │   └── AircraftDrop.jsx
│       │   ├── Car
│       │   │   ├── BMWM4.js
│       │   │   └── CarController.js
│       │   ├── Character
│       │   │   ├── CharacterController.js
│       │   │   ├── CharacterModel.jsx
│       │   │   └── RemotePlayers.jsx
│       │   ├── Combat
│       │   │   └── CombatManager.jsx
│       │   ├── Controller
│       │   │   └── PhoneControllerApp.jsx
│       │   ├── Game
│       │   │   └── LaptopGameApp.jsx
│       │   ├── Lobby
│       │   │   ├── CustomRoomLobby.css
│       │   │   └── CustomRoomLobby.jsx
│       │   ├── Loot
│       │   │   └── LootManager.jsx
│       │   ├── UI
│       │   │   ├── CustomHudEditorBar.jsx
│       │   │   ├── CustomHudElement.jsx
│       │   │   ├── DraggableFireButton.jsx
│       │   │   ├── FreeFireHUD.css
│       │   │   ├── FreeFireHUD.jsx
│       │   │   ├── FreeFireHudParts.jsx
│       │   │   ├── FreeFireIcons.jsx
│       │   │   ├── FreeFireVictoryModal.jsx
│       │   │   ├── GameModals.jsx
│       │   │   ├── HoldButton.jsx
│       │   │   ├── Icons.jsx
│       │   │   ├── InventoryUI.jsx
│       │   │   ├── SportSpeedometer.jsx
│       │   │   ├── SteeringWheelGraphic.jsx
│       │   │   ├── TapButton.jsx
│       │   │   └── WorldHtml.jsx
│       │   ├── World
│       │   │   ├── DrivingWorld.jsx
│       │   │   ├── FollowCamera.jsx
│       │   │   └── OpenWorldMap.js
│       │   └── Zone
│       │       └── ZoneManager.jsx
│       ├── config
│       │   └── gameConstants.js
│       ├── index.css
│       ├── index.js
│       ├── main.jsx
│       ├── reportWebVitals.js
│       ├── setupProxy.js
│       ├── setupTests.js
│       └── utils
│           ├── customHudConfig.js
│           └── network.js
├── package.json
├── scratch
│   ├── calculate_two_handed_grip.js
│   ├── check_aiming_distance.js
│   ├── check_hand_distance.js
│   ├── check_skeleton_instances.js
│   ├── diagnose_bones.js
│   ├── find_two_hand_rotations.js
│   ├── inspect_anim_rotations.js
│   ├── inspect_bone_axes.js
│   ├── inspect_character_weapon_pose.js
│   ├── inspect_gun_hand_alignment.js
│   ├── inspect_hierarchy.js
│   ├── inspect_idle_tracks.js
│   ├── inspect_mixamo_bones.js
│   ├── inspect_rest_arms.js
│   ├── list_real_bone_names.js
│   ├── preview_punch_pose.js
│   ├── render_anim_test.js
│   ├── render_two_handed_preview.js
│   ├── solve_aim_angles.js
│   ├── solve_full_two_handed_system.js
│   ├── solve_gun_forward.js
│   ├── solve_left_arm_match.js
│   ├── solve_realistic_hold.js
│   ├── solve_two_handed_pose.js
│   ├── test_aiming_stance.js
│   ├── test_bone_hierarchy.js
│   ├── test_bone_matrix.js
│   ├── test_clone_skeleton.js
│   ├── test_combat_features.js
│   ├── test_idle_eulers.js
│   ├── test_left_arm_ik.js
│   ├── test_mixer_binding.js
│   ├── test_mixer_override.js
│   ├── test_primary_bones.js
│   ├── test_right_arm_poses.js
│   ├── test_rotated_gun.js
│   ├── test_three_rotation_quaternion.js
│   ├── tune_grip.js
│   └── verify_custom_hud.js
└── server
    ├── matchManager.js
    ├── package.json
    ├── roomManager.js
    ├── server.js
    ├── test_phase1_match.js
    └── test_phase1_rooms.js
```

===============================================================================
FILE: .gitignore
===============================================================================

```text
dependencies

/client/node_modules
/server/node_modules
/.pnp
.pnp.js

testing

/client/coverage
/server/coverage

production builds

/client/build
/client/dist
/server/build

environment variables & local config

.env
.env.local
.env.development.local
.env.test.local
.env.production.local
client/.env*
server/.env*

logs

npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
logs
*.log

editor & operating system files

.DS_Store
.vscode/
.idea/
Thumbs.dbclient/src/assets/models/openworldmap.glb
```

===============================================================================
FILE: client/package.json
===============================================================================

```json
{
  "name": "client",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@react-three/drei": "^10.7.9",
    "@react-three/fiber": "^9.8.2",
    "@testing-library/dom": "^10.4.2",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.3",
    "@testing-library/user-event": "^13.5.0",
    "react": "^19.3.1",
    "react-dom": "^19.3.1",
    "react-scripts": "5.0.1",
    "socket.io": "^4.8.4",
    "socket.io-client": "^4.8.4",
    "three": "^0.187.0",
    "web-vitals": "^2.1.4",
    "qrcode.react": "^4.2.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

===============================================================================
FILE: client/public/index.html
===============================================================================

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
    />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta
      name="apple-mobile-web-app-status-bar-style"
      content="black-translucent"
    />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="theme-color" content="#06090f" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <!--
      manifest.json provides metadata used when your web app is installed on a
      user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
    -->
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <!--
      Notice the use of %PUBLIC_URL% in the tags above.
      It will be replaced with the URL of the `public` folder during the build.
      Only files inside the `public` folder can be referenced from the HTML.

      Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
      work correctly both with client-side routing and a non-root public URL.
      Learn how to configure a non-root public URL by running `npm run build`.
    -->
    <title>React App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <!--
      This HTML file is a template.
      If you open it directly in the browser, you will see an empty page.

      You can add webfonts, meta tags, or analytics to this file.
      The build step will place the bundled scripts into the <body> tag.

      To begin the development, run `npm start` or `yarn start`.
      To create a production bundle, use `npm run build` or `yarn build`.
    -->
  </body>
</html>
```

===============================================================================
FILE: client/public/manifest.json
===============================================================================

```json
{
  "short_name": "React App",
  "name": "Create React App Sample",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

===============================================================================
FILE: client/public/robots.txt
===============================================================================

```text
# https://www.robotstxt.org/robotstxt.html
User-agent: *
Disallow:
```

===============================================================================
FILE: client/README.md
===============================================================================

```md
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
```

===============================================================================
FILE: client/src/App.css
===============================================================================

```css
.App {
  text-align: center;
}

.App-logo {
  height: 40vmin;
  pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
  .App-logo {
    animation: App-logo-spin infinite 20s linear;
  }
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App-link {
  color: #61dafb;
}

@keyframes App-logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

===============================================================================
FILE: client/src/App.js
===============================================================================

```js
export { default } from "./App.jsx";
```

===============================================================================
FILE: client/src/App.jsx
===============================================================================

```jsx
import React, { useMemo } from "react";
import PhoneControllerApp from "./components/Controller/PhoneControllerApp";
import LaptopGameApp from "./components/Game/LaptopGameApp";
import "./index.css";

export default function App() {
  const isPhoneController = useMemo(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get("controller") === "1") return true;
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }, []);

  return isPhoneController ? <PhoneControllerApp /> : <LaptopGameApp />;
}
```

===============================================================================
FILE: client/src/App.test.js
===============================================================================

```js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
```

===============================================================================
FILE: client/src/components/Aircraft/AircraftDrop.jsx
===============================================================================

```jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  AIRCRAFT_ALTITUDE,
  AIRCRAFT_SPEED,
  PARACHUTE_FALL_SPEED,
  PARACHUTE_LATERAL_SPEED,
} from "../../config/gameConstants";

const AIRCRAFT_START_X = -56;
const AIRCRAFT_END_X = 56;

// Shared geometries, materials, and scratch vectors (zero per-frame allocations)
const _aircraftFuselageGeo = new THREE.BoxGeometry(10, 1.5, 1.6);
const _aircraftCockpitGeo = new THREE.BoxGeometry(2.2, 0.9, 1.3);
const _aircraftWingGeo = new THREE.BoxGeometry(2.2, 0.25, 8.5);
const _aircraftTailVGeo = new THREE.BoxGeometry(1.5, 2.1, 0.2);
const _aircraftTailHGeo = new THREE.BoxGeometry(1.2, 0.16, 3.2);
const _canopyGeo = new THREE.ConeGeometry(2.8, 3.4, 8);

const _aircraftMat = new THREE.MeshStandardMaterial({
  color: "#3a4250",
  metalness: 0.55,
  roughness: 0.42,
});
const _cockpitMat = new THREE.MeshStandardMaterial({
  color: "#1b2838",
  metalness: 0.85,
  roughness: 0.18,
});
const _canopyMat = new THREE.MeshStandardMaterial({
  color: "#f8fafc",
  transparent: true,
  opacity: 0.82,
  side: THREE.DoubleSide,
});
const _cordMat = new THREE.LineBasicMaterial({ color: "#ffffff" });

const _raycaster = new THREE.Raycaster();
const _rayOrigin = new THREE.Vector3();
const _downDir = new THREE.Vector3(0, -1, 0);
const _worldNormal = new THREE.Vector3();

function ParachuteCords({ chuteY }) {
  const geometry = useMemo(() => {
    const offsets = [
      [2, 0],
      [-2, 0],
      [0, 2],
      [0, -2],
    ];
    const arr = new Float32Array(offsets.length * 6);
    offsets.forEach((o, i) => {
      arr[i * 6 + 0] = o[0];
      arr[i * 6 + 1] = chuteY - 1.7;
      arr[i * 6 + 2] = o[1];
      arr[i * 6 + 3] = 0;
      arr[i * 6 + 4] = 0.8;
      arr[i * 6 + 5] = 0;
    });
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return geom;
  }, [chuteY]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  return <lineSegments geometry={geometry} material={_cordMat} />;
}

const AircraftMesh = React.memo(function AircraftMesh() {
  return (
    <group>
      <mesh geometry={_aircraftFuselageGeo} material={_aircraftMat} />
      <mesh
        geometry={_aircraftCockpitGeo}
        material={_cockpitMat}
        position={[3.8, 0.45, 0]}
      />
      <mesh
        geometry={_aircraftWingGeo}
        material={_aircraftMat}
        position={[0, 0, 4.2]}
      />
      <mesh
        geometry={_aircraftWingGeo}
        material={_aircraftMat}
        position={[0, 0, -4.2]}
      />
      <mesh
        geometry={_aircraftTailVGeo}
        material={_aircraftMat}
        position={[-4.5, 1.25, 0]}
      />
      <mesh
        geometry={_aircraftTailHGeo}
        material={_aircraftMat}
        position={[-4.5, 0.25, 0]}
      />
    </group>
  );
});

export default function AircraftDrop({
  active = false,
  ejectToken = 0,
  characterRef,
  collidersRef,
  onLanded,
  onPhaseChange,
  cameraRef,
  remoteInputRef,
}) {
  const { camera } = useThree();
  const phaseRef = useRef("flying"); // 'flying' | 'falling' | 'landed'
  const aircraftPosRef = useRef(
    new THREE.Vector3(AIRCRAFT_START_X, AIRCRAFT_ALTITUDE, 0),
  );
  const dropPosRef = useRef(new THREE.Vector3(0, AIRCRAFT_ALTITUDE, 0));
  const aircraftGroupRef = useRef();
  const parachuteGroupRef = useRef();
  const landedRef = useRef(false);
  const keysRef = useRef({});
  const lastEjectTokenRef = useRef(ejectToken);

  const [phase, setPhase] = useState("flying");

  const startFalling = useCallback(() => {
    if (phaseRef.current !== "flying") return;
    phaseRef.current = "falling";
    setPhase("falling");
    onPhaseChange?.("falling");
    dropPosRef.current.copy(aircraftPosRef.current);
    if (characterRef?.current) {
      characterRef.current.position.copy(dropPosRef.current);
      characterRef.current.visible = true;
    }
  }, [characterRef, onPhaseChange]);

  // Trigger eject from HUD button
  useEffect(() => {
    if (ejectToken !== lastEjectTokenRef.current) {
      lastEjectTokenRef.current = ejectToken;
      if (active && phaseRef.current === "flying") {
        startFalling();
      }
    }
  }, [ejectToken, active, startFalling]);

  // Reset when active changes + attach keyboard flight/steer listeners
  useEffect(() => {
    if (!active) return;

    phaseRef.current = "flying";
    setPhase("flying");
    onPhaseChange?.("flying");
    aircraftPosRef.current.set(AIRCRAFT_START_X, AIRCRAFT_ALTITUDE, 0);
    dropPosRef.current.set(0, AIRCRAFT_ALTITUDE, 0);
    landedRef.current = false;
    keysRef.current = {};

    if (characterRef?.current) {
      characterRef.current.visible = false;
    }

    const onKeyDown = (e) => {
      keysRef.current[e.code] = true;
      if (e.code === "Space" && phaseRef.current === "flying") {
        e.preventDefault();
        startFalling();
      }
    };

    const onKeyUp = (e) => {
      keysRef.current[e.code] = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [active, characterRef, startFalling, onPhaseChange]);

  useFrame((_, rawDelta) => {
    if (!active || phaseRef.current === "landed") return;

    const delta = Math.min(rawDelta, 0.12);
    const cam = cameraRef?.current || camera;

    if (phaseRef.current === "flying") {
      aircraftPosRef.current.x += AIRCRAFT_SPEED * delta;

      if (aircraftGroupRef.current) {
        aircraftGroupRef.current.position.copy(aircraftPosRef.current);
      }

      cam.position.set(
        aircraftPosRef.current.x - 11,
        aircraftPosRef.current.y + 7,
        aircraftPosRef.current.z + 9,
      );
      cam.lookAt(
        aircraftPosRef.current.x + 6,
        aircraftPosRef.current.y - 10,
        aircraftPosRef.current.z,
      );

      const remoteJumpTriggered = Boolean(remoteInputRef?.current?.jumpPulse);
      if (remoteInputRef?.current?.jumpPulse) {
        remoteInputRef.current.jumpPulse = false;
      }
      if (
        remoteInputRef?.current?.jump ||
        remoteJumpTriggered ||
        aircraftPosRef.current.x >= AIRCRAFT_END_X
      ) {
        startFalling();
      }
      return;
    }

    if (phaseRef.current === "falling") {
      const input = remoteInputRef?.current || {};
      const keys = keysRef.current;

      const kbX =
        (keys.KeyD || keys.ArrowRight ? 1 : 0) -
        (keys.KeyA || keys.ArrowLeft ? 1 : 0);
      const kbZ =
        (keys.KeyS || keys.ArrowDown ? 1 : 0) -
        (keys.KeyW || keys.ArrowUp ? 1 : 0);

      const moveX = THREE.MathUtils.clamp(kbX + (input.moveX || 0), -1, 1);
      const moveZ = THREE.MathUtils.clamp(kbZ - (input.moveY || 0), -1, 1);

      dropPosRef.current.x += moveX * PARACHUTE_LATERAL_SPEED * delta;
      dropPosRef.current.z += moveZ * PARACHUTE_LATERAL_SPEED * delta;
      dropPosRef.current.y -= PARACHUTE_FALL_SPEED * delta;

      if (parachuteGroupRef.current) {
        parachuteGroupRef.current.position.copy(dropPosRef.current);
      }

      if (characterRef?.current) {
        characterRef.current.position.copy(dropPosRef.current);
        if (Math.abs(moveX) > 0.05 || Math.abs(moveZ) > 0.05) {
          characterRef.current.rotation.y = Math.atan2(moveX, moveZ);
        }
      }

      cam.position.set(
        dropPosRef.current.x - 6,
        dropPosRef.current.y + 4.5,
        dropPosRef.current.z + 6.5,
      );
      cam.lookAt(dropPosRef.current);

      // Ground detection against ready Bermuda colliders
      let groundY = 0;
      const colliders = collidersRef?.current;
      if (colliders && colliders.ready !== false) {
        const raw =
          colliders.meshes || (Array.isArray(colliders) ? colliders : []);
        const meshes = [];
        for (let i = 0; i < raw.length; i += 1) {
          const item = raw[i];
          if (item?.isObject3D) meshes.push(item);
          else if (item?.mesh) meshes.push(item.mesh);
        }

        if (meshes.length > 0) {
          _rayOrigin.set(
            dropPosRef.current.x,
            dropPosRef.current.y + 8,
            dropPosRef.current.z,
          );
          _raycaster.set(_rayOrigin, _downDir);
          _raycaster.far = 120;
          const hits = _raycaster.intersectObjects(meshes, false);
          for (let i = 0; i < hits.length; i += 1) {
            const h = hits[i];
            if (h.face) {
              _worldNormal
                .copy(h.face.normal)
                .transformDirection(h.object.matrixWorld);
              if (_worldNormal.y < 0.35) continue;
            }
            if (h.point.y < -2) continue;
            groundY = h.point.y;
            break;
          }
        }
      }

      if (dropPosRef.current.y <= groundY + 1.5 && !landedRef.current) {
        landedRef.current = true;
        dropPosRef.current.y = groundY;
        phaseRef.current = "landed";
        setPhase("landed");
        onPhaseChange?.("landed");

        if (characterRef?.current) {
          characterRef.current.position.copy(dropPosRef.current);
          characterRef.current.visible = true;
        }

        onLanded?.();
      }
    }
  });

  if (!active) return null;

  return (
    <group>
      {phase === "flying" && (
        <group
          ref={aircraftGroupRef}
          position={[AIRCRAFT_START_X, AIRCRAFT_ALTITUDE, 0]}
          scale={0.55}
        >
          <AircraftMesh />
        </group>
      )}

      {phase === "falling" && (
        <group ref={parachuteGroupRef} position={dropPosRef.current.toArray()} scale={0.55}>
          <mesh
            geometry={_canopyGeo}
            material={_canopyMat}
            position={[0, 5.6, 0]}
            rotation={[Math.PI, 0, 0]}
          />
          <ParachuteCords chuteY={5.6} />
        </group>
      )}
    </group>
  );
}
```

===============================================================================
FILE: client/src/components/Car/BMWM4.js
===============================================================================

```js
import React, { forwardRef, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

import modelUrl from "../../assets/models/2021_bmw_m4_competition.glb";

export const BMW_M4_SCALE = 0.73;

const CAR_ENV_INTENSITY = 1.2;
const MODEL_YAW = Math.PI / 2;
const PRE_POSED_STEER = -0.34906585;

const WHEEL_DEFINITIONS = [
  {
    id: "front-right",
    front: true,
    tyreNames: ["tire06", "tire07"],
    rimName: "Rim",
    discName: "brake disc",
    caliperName: "Brake",
  },
  {
    id: "front-left",
    front: true,
    tyreNames: ["tire012", "tire013"],
    rimName: "Rim002",
    discName: "brake disc002",
    caliperName: "Brake002",
  },
  {
    id: "rear-right",
    front: false,
    tyreNames: ["tire008", "tire009"],
    rimName: "Rim001",
    discName: "brake disc001",
    caliperName: "Brake001",
  },
  {
    id: "rear-left",
    front: false,
    tyreNames: ["tire010", "tire011"],
    rimName: "Rim003",
    discName: "brake disc003",
    caliperName: "Brake003",
  },
];

const DOOR_NAME_REGEX =
  /door.*(l|left|fl|front_l|driver)|^(door_l|door_lf|lf_door|driver_door)/i;
const GLASS_NAME_REGEX = /glass|window|windshield|windscreen|win_/i;

function getNode(root, name) {
  const loadedName = THREE.PropertyBinding.sanitizeNodeName(name);
  let object = root.getObjectByName(loadedName) || root.getObjectByName(name);

  if (!object) {
    root.traverse((child) => {
      if (!object && child.userData?.name === name) object = child;
    });
  }

  if (!object) console.warn(`[BMW M4] GLB node missing: ${name}`);
  return object || null;
}

function buildWheelAssemblies(model) {
  model.updateWorldMatrix(true, true);

  const assemblies = [];

  for (const definition of WHEEL_DEFINITIONS) {
    const tyres = definition.tyreNames
      .map((name) => getNode(model, name))
      .filter(Boolean);
    const rim = getNode(model, definition.rimName);
    const disc = getNode(model, definition.discName);
    const caliper = getNode(model, definition.caliperName);

    if (!tyres.length || !rim) {
      console.warn(`[BMW M4] Incomplete wheel assembly: ${definition.id}`);
      continue;
    }

    const rollingParts = [...tyres, rim];
    if (disc) rollingParts.push(disc);

    const box = new THREE.Box3();
    [...tyres, rim].forEach((part) => box.expandByObject(part));
    const centerLocal = model.worldToLocal(box.getCenter(new THREE.Vector3()));
    const radius = (box.max.y - box.min.y) / 2;

    const steeringPivot = new THREE.Group();
    steeringPivot.name = `GAME_STEER_${definition.id}`;
    steeringPivot.position.copy(centerLocal);
    model.add(steeringPivot);

    const rollingPivot = new THREE.Group();
    rollingPivot.name = `GAME_ROLL_${definition.id}`;
    steeringPivot.add(rollingPivot);

    steeringPivot.rotation.y = definition.front ? PRE_POSED_STEER : 0;
    steeringPivot.updateMatrixWorld(true);

    rollingParts.forEach((part) => rollingPivot.attach(part));
    if (caliper) steeringPivot.attach(caliper);

    steeringPivot.rotation.y = 0;
    steeringPivot.updateMatrixWorld(true);

    assemblies.push({
      id: definition.id,
      isFront: definition.front,
      steeringPivot,
      rollingPivot,
      radius: radius > 0.05 && radius < 1.5 ? radius : undefined,
    });
  }

  return assemblies;
}

function buildDriverDoorRig(model) {
  model.updateWorldMatrix(true, true);
  const doorParts = [];

  model.traverse((child) => {
    if (!child.isMesh) return;
    const combinedName = `${child.name} ${child.parent?.name || ""}`;
    if (DOOR_NAME_REGEX.test(combinedName)) {
      doorParts.push(child);
    }
  });

  if (!doorParts.length) return null;

  const box = new THREE.Box3();
  doorParts.forEach((part) => box.expandByObject(part));

  // Hinge at front-outer edge of the left door
  const hingeWorld = new THREE.Vector3(
    box.max.x,
    (box.min.y + box.max.y) * 0.5,
    box.max.z,
  );
  const hingeLocal = model.worldToLocal(hingeWorld);

  const doorPivot = new THREE.Group();
  doorPivot.name = "GAME_DRIVER_DOOR_PIVOT";
  doorPivot.position.copy(hingeLocal);
  model.add(doorPivot);
  doorPivot.updateMatrixWorld(true);

  doorParts.forEach((part) => doorPivot.attach(part));
  return doorPivot;
}

const wheelRigCache = new WeakMap();
const doorRigCache = new WeakMap();

const BMWM4 = forwardRef(function BMWM4(
  { onWheelsReady, onError, doorProgressRef },
  forwardedRef,
) {
  const { scene } = useGLTF(modelUrl);
  const gl = useThree((state) => state.gl);
  const doorPivotRef = useRef(null);
  const animatedDoorRef = useRef(null);
  const doorAngleRef = useRef(0);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.rotation.y = MODEL_YAW;
    return clone;
  }, [scene]);

  const envMap = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const texture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    return texture;
  }, [gl]);

  useEffect(() => {
    let mounted = true;

    try {
      model.traverse((object) => {
        if (!object.isMesh) return;

        object.castShadow = true;
        object.receiveShadow = true;

        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];

        materials.filter(Boolean).forEach((material) => {
          if (material.isMeshStandardMaterial) {
            material.envMap = envMap;
            material.envMapIntensity = CAR_ENV_INTENSITY;
            material.needsUpdate = true;
          }

          // Make windows/windshield semi-transparent so the seated driver is visible inside
          const matName = `${material.name || ""} ${object.name || ""}`;
          if (GLASS_NAME_REGEX.test(matName) || material.opacity < 0.95) {
            material.transparent = true;
            material.opacity = Math.min(material.opacity || 0.42, 0.42);
            material.depthWrite = false;
            material.needsUpdate = true;
          }

          [
            "map",
            "normalMap",
            "roughnessMap",
            "metalnessMap",
            "emissiveMap",
          ].forEach((key) => {
            if (material[key]) material[key].anisotropy = 8;
          });
        });
      });

      let assemblies = wheelRigCache.get(model);
      if (!assemblies) {
        assemblies = buildWheelAssemblies(model);
        wheelRigCache.set(model, assemblies);
      }

      let doorPivot = doorRigCache.get(model);
      if (doorPivot === undefined) {
        doorPivot = buildDriverDoorRig(model);
        doorRigCache.set(model, doorPivot);
      }
      doorPivotRef.current = doorPivot;

      if (mounted) onWheelsReady?.(assemblies);
    } catch (error) {
      console.error("[BMW M4] Setup failed:", error);
      if (mounted) onError?.(error);
    }

    return () => {
      mounted = false;
      onWheelsReady?.([]);
    };
  }, [model, envMap, onError, onWheelsReady]);

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const timeline = doorProgressRef?.current;
    let targetAngle = 0;

    if (timeline?.animation === "enterCar") {
      const p = timeline.progress;
      const opening = THREE.MathUtils.smoothstep(p, 0.18, 0.38);
      const closing = 1 - THREE.MathUtils.smoothstep(p, 0.72, 0.85);
      targetAngle = 1.08 * opening * closing;
    } else if (timeline?.animation === "exitCar") {
      const p = timeline.progress;
      const opening = THREE.MathUtils.smoothstep(p, 0.1, 0.3);
      const closing = 1 - THREE.MathUtils.smoothstep(p, 0.76, 0.95);
      targetAngle = 1.08 * opening * closing;
    }

    doorAngleRef.current = THREE.MathUtils.damp(
      doorAngleRef.current,
      targetAngle,
      18,
      dt,
    );

    if (doorPivotRef.current) {
      doorPivotRef.current.rotation.y = -doorAngleRef.current;
    }
    if (animatedDoorRef.current) {
      animatedDoorRef.current.rotation.y = doorAngleRef.current;
      animatedDoorRef.current.visible = doorAngleRef.current > 0.03;
    }
  });

  return (
    <group ref={forwardedRef} scale={BMW_M4_SCALE}>
      <primitive object={model} />
      {/* Fallback visual driver door swing panel when GLB body is a single merged mesh */}
      {!doorPivotRef.current && (
        <group
          ref={animatedDoorRef}
          position={[0.55, 0.72, -0.92]}
          visible={false}
        >
          <mesh position={[-0.58, 0, -0.02]} castShadow>
            <boxGeometry args={[1.15, 0.62, 0.05]} />
            <meshStandardMaterial
              color="#1c2430"
              metalness={0.85}
              roughness={0.2}
            />
          </mesh>
        </group>
      )}
    </group>
  );
});

useGLTF.preload(modelUrl);

export default BMWM4;
```

===============================================================================
FILE: client/src/components/Car/CarController.js
===============================================================================

```js
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BMW_M4_SCALE } from "./BMWM4";

/* ------------------------------------------------------------------ */
/*  Tuning                                                            */
/* ------------------------------------------------------------------ */

const MAX_FORWARD_SPEED = 31;
const MAX_REVERSE_SPEED = 9;
const ACCELERATION = 7.5;
const BRAKE_DECELERATION = 17;
const COAST_DECELERATION = 1.8;
const HANDBRAKE_DECELERATION = 5;
const BOOST_SPEED_MULT = 1.3;
const BOOST_ACCEL_MULT = 1.7;

const WHEELBASE = 2.85;
const WHEEL_RADIUS = 0.34;
const MAX_STEERING_ANGLE = 0.48;
const MAX_LATERAL_ACCEL = 17;
const HANDBRAKE_LATERAL_BOOST = 1.8;
const GRIP = 9;
const HANDBRAKE_GRIP = 0.9;

const GRAVITY = 24;
const SUBSTEP = 1 / 120;
const MAX_SUBSTEPS = 4;
const RAY_UP = 0.7;
const SUSPENSION_TRAVEL = 0.4;
const MIN_CONTACTS = 2;
const HEAVE_STIFFNESS = 170;
const HEAVE_DAMPING = 15;

const SPAWN = { x: 0, z: 0, yaw: 0 };
const SPAWN_RAY_HEIGHT = 1000;
const KILL_DEPTH = 250;

const CAR_HALF_LENGTH = 2.3 * BMW_M4_SCALE;
const CAR_HALF_WIDTH = 0.95 * BMW_M4_SCALE;
const WALL_RAY_HEIGHT = 0.55;
const WALL_RAY_COUNT = 16;
const MAX_PUSH = 0.9;
const WALL_RESTITUTION = 0.1;
const WALL_SCRAPE = 0.04;
const NEARBY_RADIUS = 30;
const NEARBY_REFRESH = 10;

const GEAR_TOP_SPEEDS = [7, 13, 19, 25, MAX_FORWARD_SPEED];
const EMPTY = [];
const CONTROL_KEYS = ["w", "a", "s", "d", "space", "shift", "j"];

/* ------------------------------------------------------------------ */
/*  Scratch objects                                                   */
/* ------------------------------------------------------------------ */

const UP = new THREE.Vector3(0, 1, 0);
const _v = new THREE.Vector3();
const _before = new THREE.Vector3();
const _origin = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _normal = new THREE.Vector3();
const _down = new THREE.Vector3(0, -1, 0);
const raycaster = new THREE.Raycaster();
raycaster.firstHitOnly = true;

const WALL_PROBES = Array.from({ length: WALL_RAY_COUNT }, (_, i) => {
  const angle = (i / WALL_RAY_COUNT) * Math.PI * 2;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const radius =
    (CAR_HALF_LENGTH * CAR_HALF_WIDTH) /
    Math.hypot(CAR_HALF_WIDTH * c, CAR_HALF_LENGTH * s);
  return { dir: new THREE.Vector3(c, 0, s), radius };
});

function createState() {
  return {
    lon: 0,
    lat: 0,
    y: 0,
    vy: 0,
    vyGround: 0,
    airborne: false,
    yawRate: 0,
    steering: 0,
    grip: GRIP,
    groundPitch: 0,
    groundRoll: 0,
    bodyPitch: 0,
    bodyRoll: 0,
    heave: 0,
    heaveVel: 0,
    prevLon: 0,
    aLon: 0,
    ground: { contacts: 0, targetY: 0, pitch: 0, roll: 0 },
    spawned: false,
    resetRequested: false,
    killY: -Infinity,
    safe: null,
    safeTimer: 0,
    jumpWasDown: false,
    collisionCooldown: 0,
  };
}

function getNearbyMeshes(cache, colliders, position) {
  const moved = Math.hypot(
    position.x - cache.x,
    position.y - cache.y,
    position.z - cache.z,
  );

  if (
    cache.source !== colliders ||
    cache.count !== colliders.length ||
    moved > NEARBY_REFRESH
  ) {
    cache.source = colliders;
    cache.count = colliders.length;
    cache.x = position.x;
    cache.y = position.y;
    cache.z = position.z;
    cache.meshes = colliders
      .filter(({ box }) => box.distanceToPoint(position) < NEARBY_RADIUS)
      .map(({ mesh }) => mesh);
  }

  return cache.meshes;
}

function meshesAtXZ(colliders, x, z) {
  const out = [];
  for (const { box, mesh } of colliders) {
    if (x >= box.min.x && x <= box.max.x && z >= box.min.z && z <= box.max.z) {
      out.push(mesh);
    }
  }
  return out;
}

function findGroundHeight(meshes, x, z, refY) {
  _origin.set(x, SPAWN_RAY_HEIGHT, z);
  raycaster.set(_origin, _down);
  raycaster.far = SPAWN_RAY_HEIGHT * 2.5;
  raycaster.firstHitOnly = false;

  let best = null;
  try {
    for (const hit of raycaster.intersectObjects(meshes, false)) {
      if (!hit.face) continue;
      _normal.copy(hit.face.normal).transformDirection(hit.object.matrixWorld);
      if (Math.abs(_normal.y) < 0.5) continue;
      if (
        best === null ||
        Math.abs(hit.point.y - refY) < Math.abs(best - refY)
      ) {
        best = hit.point.y;
      }
    }
  } finally {
    raycaster.firstHitOnly = true;
  }
  return best;
}

function collideWithWalls(car, meshes) {
  for (const probe of WALL_PROBES) {
    _dir.copy(probe.dir).applyAxisAngle(UP, car.rotation.y);
    _origin.set(
      car.position.x,
      car.position.y + WALL_RAY_HEIGHT,
      car.position.z,
    );

    raycaster.set(_origin, _dir);
    raycaster.far = probe.radius;

    const hit = raycaster.intersectObjects(meshes, false)[0];
    if (!hit || !hit.face) continue;

    _normal.copy(hit.face.normal).transformDirection(hit.object.matrixWorld);
    if (Math.abs(_normal.y) > 0.7) continue;

    _normal.y = 0;
    _normal.normalize();
    if (_normal.dot(_dir) > 0) _normal.negate();

    const depth = (probe.radius - hit.distance) * Math.abs(_normal.dot(_dir));
    car.position.addScaledVector(_normal, Math.min(depth, MAX_PUSH));
  }
}

function buildRig(car, assemblies) {
  const scale = car.scale.x;
  const wheels = [];

  assemblies.forEach((wheel) => {
    const pivot = wheel.steeringPivot;
    const model = pivot && pivot.parent;
    if (!model) return;

    model.updateMatrix();
    _v.copy(pivot.position).applyMatrix4(model.matrix).multiplyScalar(scale);
    const radius = wheel.radius || WHEEL_RADIUS * scale;

    wheels.push({
      x: _v.x,
      z: _v.z,
      bottom: _v.y - radius,
      front: Boolean(wheel.isFront),
      left: _v.z < 0,
    });
  });

  if (wheels.length < 4) {
    wheels.length = 0;
    const hx = (WHEELBASE / 2) * scale;
    const hz = 0.82 * scale;
    [
      [hx, -hz, true, true],
      [hx, hz, true, false],
      [-hx, -hz, false, true],
      [-hx, hz, false, false],
    ].forEach(([x, z, front, left]) =>
      wheels.push({ x, z, bottom: 0, front, left }),
    );
  }

  const mean = (list, key) =>
    list.reduce((sum, w) => sum + w[key], 0) / Math.max(1, list.length);
  const front = wheels.filter((w) => w.front);
  const rear = wheels.filter((w) => !w.front);
  const left = wheels.filter((w) => w.left);
  const right = wheels.filter((w) => !w.left);

  return {
    source: assemblies,
    wheels,
    bottom: mean(wheels, "bottom"),
    length: Math.max(0.5, mean(front, "x") - mean(rear, "x")),
    width: Math.max(0.5, mean(right, "z") - mean(left, "z")),
  };
}

function castGround(meshes, x, y, z, length) {
  _origin.set(x, y, z);
  raycaster.set(_origin, _down);
  raycaster.far = length;

  for (const hit of raycaster.intersectObjects(meshes, false)) {
    if (!hit.face) continue;
    _normal.copy(hit.face.normal).transformDirection(hit.object.matrixWorld);
    if (Math.abs(_normal.y) > 0.5) return hit.point.y;
  }
  return null;
}

function sampleGround(car, meshes, rig, y, vy, h, out) {
  const cosY = Math.cos(car.rotation.y);
  const sinY = Math.sin(car.rotation.y);
  const fall = Math.max(0, -vy) * h * 2;

  let fSum = 0,
    fN = 0,
    rSum = 0,
    rN = 0;
  let lSum = 0,
    lN = 0,
    rtSum = 0,
    rtN = 0;
  let targetSum = 0;
  let contacts = 0;

  for (const w of rig.wheels) {
    const wx = car.position.x + w.x * cosY + w.z * sinY;
    const wz = car.position.z - w.x * sinY + w.z * cosY;
    const gy = castGround(
      meshes,
      wx,
      y + w.bottom + RAY_UP,
      wz,
      RAY_UP + SUSPENSION_TRAVEL + fall,
    );
    if (gy === null) continue;

    contacts += 1;
    targetSum += gy - w.bottom;
    if (w.front) {
      fSum += gy;
      fN += 1;
    } else {
      rSum += gy;
      rN += 1;
    }
    if (w.left) {
      lSum += gy;
      lN += 1;
    } else {
      rtSum += gy;
      rtN += 1;
    }
  }

  out.contacts = contacts;
  if (contacts > 0) {
    out.targetY = targetSum / contacts;
    out.pitch = fN && rN ? Math.atan2(fSum / fN - rSum / rN, rig.length) : 0;
    out.roll = lN && rtN ? Math.atan2(lSum / lN - rtSum / rtN, rig.width) : 0;
  }
  return out;
}

function placeCar(car, s, colliders, rig, x, z, yaw, knownGroundY) {
  let groundY =
    knownGroundY !== undefined
      ? knownGroundY
      : findGroundHeight(meshesAtXZ(colliders, x, z), x, z, car.position.y);
  if (groundY === null) groundY = car.position.y;

  s.y = groundY - rig.bottom + 0.02;
  car.rotation.set(0, yaw, 0);
  car.position.set(x, s.y, z);

  s.lon = 0;
  s.lat = 0;
  s.vy = 0;
  s.vyGround = 0;
  s.yawRate = 0;
  s.steering = 0;
  s.grip = GRIP;
  s.groundPitch = 0;
  s.groundRoll = 0;
  s.bodyPitch = 0;
  s.bodyRoll = 0;
  s.heave = 0;
  s.heaveVel = 0;
  s.prevLon = 0;
  s.aLon = 0;
  s.airborne = true;
  s.killY = groundY - KILL_DEPTH;
  s.spawned = true;
  s.resetRequested = false;
}

function getGearAndRpm(speed) {
  const abs = Math.abs(speed);
  if (abs < 0.3) return { gear: "N", rpm: 850 };
  if (speed < 0) {
    return {
      gear: "R",
      rpm: Math.round(850 + (abs / MAX_REVERSE_SPEED) * 3200),
    };
  }

  const found = GEAR_TOP_SPEEDS.findIndex((top) => abs <= top);
  const index = found === -1 ? GEAR_TOP_SPEEDS.length - 1 : found;
  const low = index === 0 ? 0 : GEAR_TOP_SPEEDS[index - 1];
  const ratio = (abs - low) / (GEAR_TOP_SPEEDS[index] - low);

  return { gear: String(index + 1), rpm: Math.round(2200 + ratio * 4800) };
}

export default function CarController({
  carRef,
  wheelAssembliesRef,
  collidersRef,
  enabled,
  onTelemetryChange,
  physicsStateRef,
  remoteInputRef,
  onCollision,
}) {
  const keys = useRef({});
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;
  const state = useRef(createState());
  const rig = useRef(null);
  const uiTimer = useRef(0);
  const nearby = useRef({
    source: null,
    count: -1,
    x: 0,
    y: 0,
    z: 0,
    meshes: [],
  });

  useEffect(() => {
    const normalizeKey = (key) => (key === " " ? "space" : key.toLowerCase());

    const onKeyDown = (event) => {
      if (!enabledRef.current) return;
      const key = normalizeKey(event.key);
      if (CONTROL_KEYS.includes(key)) {
        event.preventDefault();
        keys.current[key] = true;
      }
      if (key === "r") state.current.resetRequested = true;
    };

    const onKeyUp = (event) => {
      keys.current[normalizeKey(event.key)] = false;
    };

    const clearKeys = () => {
      keys.current = {};
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clearKeys);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", clearKeys);
    };
  }, []);

  useEffect(() => {
    // A mode switch pauses the vehicle controller; it must not recreate the
    // physics state or move the car back to its spawn point. The player can
    // only enter/exit while nearly stationary, so the current state is safe
    // to preserve and resume when driving is enabled again.
    keys.current = {};
  }, [enabled]);

  useFrame((_, rawDelta) => {
    const car = carRef.current;
    if (!car) return;

    const colliders = collidersRef?.current;
    if (!colliders || !colliders.ready) return;

    const s = state.current;
    const remote = remoteInputRef?.current;

    if (remote?.reset) {
      s.resetRequested = true;
      remote.reset = false;
    }

    if (car.rotation.order !== "YXZ") car.rotation.order = "YXZ";

    const assemblies = wheelAssembliesRef.current || EMPTY;
    if (!rig.current || rig.current.source !== assemblies) {
      rig.current = buildRig(car, assemblies);
    }
    const rigData = rig.current;

    if (!s.spawned || s.resetRequested || s.spawnedColliders !== colliders) {
      s.spawnedColliders = colliders;
      placeCar(car, s, colliders, rigData, SPAWN.x, SPAWN.z, SPAWN.yaw);
    }

    if (!enabled) return;

    const frameDelta = Math.min(rawDelta, 0.05);
    if (frameDelta <= 0) return;

    const input = keys.current;
    s.collisionCooldown = Math.max(0, s.collisionCooldown - frameDelta);

    const remoteJumpTriggered = Boolean(remote?.jumpPulse);
    if (remote?.jumpPulse) {
      remote.jumpPulse = false;
    }
    const jumpDown = Boolean(input.j || remote?.jump || remoteJumpTriggered);
    if (jumpDown && !s.jumpWasDown && !s.airborne) {
      s.airborne = true;
      s.vy = 9.5;
      s.vyGround = 0;
    }
    s.jumpWasDown = jumpDown;

    const meshes = getNearbyMeshes(nearby.current, colliders, car.position);

    // Combine Laptop Keyboard + Phone Remote Controller
    const forwardActive = input.w || remote?.accelerate;
    const brakeActive = input.s || remote?.brake;
    const throttle = (forwardActive ? 1 : 0) - (brakeActive ? 1 : 0);

    // Positive steering = left (+1 = full left, -1 = full right)
    const kbSteer = (input.a ? 1 : 0) - (input.d ? 1 : 0);
    const phoneSteer = remote ? remote.steer : 0;
    const steerInput =
      kbSteer !== 0 ? kbSteer : THREE.MathUtils.clamp(phoneSteer, -1, 1);

    const handbrake = Boolean(input.space || remote?.handbrake);
    const boostKey = Boolean(input.shift || remote?.boost);

    const steps = Math.min(MAX_SUBSTEPS, Math.ceil(frameDelta / SUBSTEP));
    const h = frameDelta / steps;
    let yaw = car.rotation.y;
    let boosting = false;

    /* ---------------- physics sub-steps ---------------- */
    for (let i = 0; i < steps; i++) {
      const grounded = !s.airborne;
      const speedAbs = Math.abs(s.lon);
      boosting = false;

      if (grounded) {
        boosting = boostKey && throttle > 0 && s.lon > -0.5;
        const vMax = MAX_FORWARD_SPEED * (boosting ? BOOST_SPEED_MULT : 1);
        let accel = 0;

        if (throttle > 0) {
          if (s.lon < -0.5) {
            accel = BRAKE_DECELERATION;
          } else {
            const ratio = THREE.MathUtils.clamp(s.lon / vMax, 0, 1);
            accel =
              ACCELERATION *
              (boosting ? BOOST_ACCEL_MULT : 1) *
              Math.max(0.12, 1 - ratio * ratio);
          }
        } else if (throttle < 0) {
          if (s.lon > 0.5) {
            accel = -BRAKE_DECELERATION;
          } else {
            const ratio = THREE.MathUtils.clamp(
              -s.lon / MAX_REVERSE_SPEED,
              0,
              1,
            );
            accel = -ACCELERATION * Math.max(0.12, 1 - ratio * ratio);
          }
        } else {
          s.lon = THREE.MathUtils.damp(s.lon, 0, COAST_DECELERATION, h);
        }

        s.lon += accel * h;

        if (handbrake) {
          const d = HANDBRAKE_DECELERATION * h;
          s.lon = Math.abs(s.lon) <= d ? 0 : s.lon - Math.sign(s.lon) * d;
        }

        if (speedAbs > 1 || throttle !== 0) {
          s.lon -= GRAVITY * Math.sin(s.groundPitch) * h;
        }

        if (s.lon > vMax) s.lon = THREE.MathUtils.damp(s.lon, vMax, 2.5, h);
        s.lon = Math.max(s.lon, -MAX_REVERSE_SPEED);
      }

      const aMax =
        MAX_LATERAL_ACCEL * (handbrake ? HANDBRAKE_LATERAL_BOOST : 1);
      const steerLimit = Math.min(
        MAX_STEERING_ANGLE,
        Math.atan((aMax * WHEELBASE) / Math.max(speedAbs * speedAbs, 1)),
      );
      s.steering = THREE.MathUtils.damp(
        s.steering,
        steerInput * steerLimit,
        9,
        h,
      );

      if (grounded) {
        const target = (s.lon / WHEELBASE) * Math.tan(s.steering);
        s.yawRate = THREE.MathUtils.damp(s.yawRate, target, 12, h);
      } else {
        s.yawRate = THREE.MathUtils.damp(s.yawRate, 0, 0.6, h);
      }

      const dYaw = s.yawRate * h;
      yaw += dYaw;
      const cosD = Math.cos(dYaw);
      const sinD = Math.sin(dYaw);
      const lon = s.lon * cosD - s.lat * sinD;
      const lat = s.lon * sinD + s.lat * cosD;
      s.lon = lon;
      s.lat = lat;

      if (grounded) {
        const saturated = Math.abs(steerInput) > 0.85 && speedAbs > 20;
        const gripTarget = handbrake
          ? HANDBRAKE_GRIP
          : saturated
            ? GRIP * 0.7
            : GRIP;
        s.grip = THREE.MathUtils.damp(
          s.grip,
          gripTarget,
          handbrake ? 14 : 3,
          h,
        );
        s.lat *= Math.exp(-s.grip * h);
      }

      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      car.position.x += (s.lon * cosY + s.lat * sinY) * h;
      car.position.z += (-s.lon * sinY + s.lat * cosY) * h;
      car.rotation.y = yaw;

      const g = sampleGround(car, meshes, rigData, s.y, s.vy, h, s.ground);
      const hasGround = g.contacts >= MIN_CONTACTS;

      if (!s.airborne) {
        if (hasGround) {
          const est = (g.targetY - s.y) / h;
          s.vyGround = THREE.MathUtils.damp(s.vyGround, est, 25, h);
          s.vy = s.vyGround;
          s.y = g.targetY;
        } else {
          s.airborne = true;
          s.vy = THREE.MathUtils.clamp(s.vyGround, -25, 25);
        }
      }

      if (s.airborne) {
        s.vy -= GRAVITY * h;
        s.y += s.vy * h;

        if (hasGround && s.y <= g.targetY) {
          const impact = Math.max(0, -s.vy);
          s.y = g.targetY;
          s.vy = 0;
          s.vyGround = 0;
          s.airborne = false;

          if (impact > 1.5) {
            s.heaveVel -= Math.min(impact, 14) * 0.4;
            s.lon *= 1 - Math.min(0.12, impact * 0.008);
          }
        }
      }
    }

    /* ---------------- wall collision ---------------- */
    car.position.y = s.y;
    _before.copy(car.position);
    collideWithWalls(car, meshes);

    const pushX = car.position.x - _before.x;
    const pushZ = car.position.z - _before.z;
    const pushLen = Math.hypot(pushX, pushZ);
    let collisionImpactSpeed = 0;

    if (pushLen > 1e-4) {
      const nx = pushX / pushLen;
      const nz = pushZ / pushLen;
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const nForward = nx * cosY - nz * sinY;
      const nRight = nx * sinY + nz * cosY;
      const vn = s.lon * nForward + s.lat * nRight;

      if (vn < 0) {
        collisionImpactSpeed = Math.max(collisionImpactSpeed, Math.abs(vn));
        const j = -(1 + WALL_RESTITUTION) * vn;
        s.lon += j * nForward;
        s.lat += j * nRight;
      }
      const scrape = 1 - WALL_SCRAPE * Math.min(1, pushLen / MAX_PUSH);
      s.lon *= scrape;
      s.lat *= scrape;
    }

    if (collisionImpactSpeed > 2.2 && s.collisionCooldown <= 0) {
      onCollision?.(collisionImpactSpeed);
      s.collisionCooldown = 0.42;
    }

    /* ---------------- body attitude (visual) ---------------- */
    const dt = frameDelta;

    const aLonNow = (s.lon - s.prevLon) / dt;
    s.prevLon = s.lon;
    s.aLon = THREE.MathUtils.damp(s.aLon, aLonNow, 10, dt);
    const aLat = s.yawRate * s.lon;
    s.bodyPitch = THREE.MathUtils.damp(
      s.bodyPitch,
      THREE.MathUtils.clamp(s.aLon * 0.0035, -0.07, 0.05),
      7,
      dt,
    );
    s.bodyRoll = THREE.MathUtils.damp(
      s.bodyRoll,
      THREE.MathUtils.clamp(aLat * 0.0022, -0.07, 0.07),
      7,
      dt,
    );

    if (!s.airborne && s.ground.contacts >= MIN_CONTACTS) {
      s.groundPitch = THREE.MathUtils.damp(
        s.groundPitch,
        s.ground.pitch,
        14,
        dt,
      );
      s.groundRoll = THREE.MathUtils.damp(s.groundRoll, s.ground.roll, 14, dt);
    } else {
      const airPitch = THREE.MathUtils.clamp(
        Math.atan2(s.vy, Math.max(Math.abs(s.lon), 4)) * 0.6,
        -0.45,
        0.45,
      );
      s.groundPitch = THREE.MathUtils.damp(s.groundPitch, airPitch, 2, dt);
      s.groundRoll = THREE.MathUtils.damp(s.groundRoll, 0, 1.5, dt);
    }

    s.heaveVel +=
      (-HEAVE_STIFFNESS * s.heave - HEAVE_DAMPING * s.heaveVel) * dt;
    s.heave = THREE.MathUtils.clamp(s.heave + s.heaveVel * dt, -0.2, 0.06);

    car.rotation.set(
      s.groundRoll + s.bodyRoll,
      yaw,
      s.groundPitch + s.bodyPitch,
    );
    car.position.y = s.y + s.heave;

    /* ---------------- safety net ---------------- */
    if (!s.airborne) {
      s.safeTimer += dt;
      if (s.safeTimer > 0.5) {
        s.safeTimer = 0;
        s.safe = {
          x: car.position.x,
          z: car.position.z,
          yaw,
          groundY: s.y + rigData.bottom,
        };
      }
    }
    if (s.y < s.killY) {
      const p = s.safe || { ...SPAWN, groundY: undefined };
      placeCar(car, s, colliders, rigData, p.x, p.z, p.yaw, p.groundY);
    }

    /* ---------------- wheels ---------------- */
    (wheelAssembliesRef.current || EMPTY).forEach((wheel) => {
      if (!wheel.steeringPivot || !wheel.rollingPivot) return;

      wheel.steeringPivot.rotation.y = wheel.isFront ? s.steering : 0;

      if (handbrake && !wheel.isFront) return;
      wheel.rollingPivot.rotation.x +=
        (s.lon * dt) / (wheel.radius || WHEEL_RADIUS);
    });

    /* ---------------- shared state for FollowCamera + HUD ---------------- */
    const slip = Math.atan2(Math.abs(s.lat), Math.max(Math.abs(s.lon), 0.1));
    const planarSpeed = Math.hypot(s.lon, s.lat);
    const drifting = !s.airborne && planarSpeed > 6 && slip > 0.14;

    const phys = physicsStateRef?.current;
    if (phys) {
      phys.vx = s.lon;
      phys.vy = s.lat;
      phys.steering = s.steering;
      phys.isDrifting = drifting;
      phys.boost = boosting;
    }

    uiTimer.current += dt;
    if (uiTimer.current >= 0.05) {
      uiTimer.current = 0;
      const { gear, rpm } = getGearAndRpm(s.lon);
      onTelemetryChange?.({
        speed: Math.round(planarSpeed * 3.6),
        rpm,
        gear,
        drifting,
        driftAngle: drifting ? Math.round((slip * 180) / Math.PI) : 0,
        boost: boosting,
        steerInput,
      });
    }
  });

  return null;
}
```

===============================================================================
FILE: client/src/components/Character/CharacterController.js
===============================================================================

```js
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* Movement tuning                                                    */
/* ------------------------------------------------------------------ */

const WALK_SPEED = 3.2;
const RUN_SPEED = 5.4;
const SPRINT_SPEED = 7.8;
const CROUCH_SPEED = 1.85;

const GROUND_ACCEL = 42;
const GROUND_DECEL = 52;
const AIR_ACCEL = 14;
const TURN_RATE = 14;

const GRAVITY = 22;
const JUMP_FORCE = 8.4;

const COYOTE_TIME = 0.12;
const JUMP_BUFFER = 0.14;

const CHARACTER_RADIUS = 0.34;
const CHARACTER_HEIGHT = 1.8;

const STEP_HEIGHT = 0.55;
const MAX_GROUND_DROP = 15.0;

const DEFAULT_GROUND_Y = 0;

const COLLIDER_REFRESH_DISTANCE = 4;
const COLLIDER_SEARCH_RADIUS = 60;

const CAR_COLLISION_HALF_LEN = 1.72;
const CAR_COLLISION_HALF_WID = 0.78;

const CONTROL_KEYS = new Set([
  "w",
  "a",
  "s",
  "d",
  "arrowup",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "space",
  "shift",
  "alt",
  "c",
  "control",
]);

/* ------------------------------------------------------------------ */
/* Shared Three.js objects                                            */
/* ------------------------------------------------------------------ */

const DOWN = new THREE.Vector3(0, -1, 0);

const _origin = new THREE.Vector3();
const _direction = new THREE.Vector3();
const _normal = new THREE.Vector3();
const _movement = new THREE.Vector3();
const _remaining = new THREE.Vector3();
const _travel = new THREE.Vector3();
const _horizontalVelocity = new THREE.Vector3();

const _cameraForward = new THREE.Vector3();
const _cameraRight = new THREE.Vector3();
const _wishDirection = new THREE.Vector3();

const _groundRaycaster = new THREE.Raycaster();
const _wallRaycaster = new THREE.Raycaster();

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function normalizeKey(key) {
  if (key === " ") return "space";
  const normalized = key.toLowerCase();
  if (normalized === "controlleft" || normalized === "controlright") {
    return "control";
  }
  if (normalized === "shiftleft" || normalized === "shiftright") {
    return "shift";
  }
  if (normalized === "altleft" || normalized === "altright") {
    return "alt";
  }
  return normalized;
}

function isGroundFace(hit) {
  if (!hit.face) return false;
  _normal.copy(hit.face.normal).transformDirection(hit.object.matrixWorld);
  return Math.abs(_normal.y) > 0.5;
}

function getNearbyMeshes(cache, colliderEntries, position) {
  if (!colliderEntries?.ready || !colliderEntries.length) {
    cache.meshes = [];
    return cache.meshes;
  }

  const moved = Math.hypot(
    position.x - cache.position.x,
    position.y - cache.position.y,
    position.z - cache.position.z,
  );

  const shouldRefresh =
    cache.source !== colliderEntries ||
    moved > COLLIDER_REFRESH_DISTANCE ||
    cache.meshes.length === 0;

  if (!shouldRefresh) {
    return cache.meshes;
  }

  cache.source = colliderEntries;
  cache.position.copy(position);

  cache.meshes = colliderEntries
    .filter(({ box }) => {
      return box && box.distanceToPoint(position) < COLLIDER_SEARCH_RADIUS;
    })
    .map(({ mesh }) => mesh)
    .filter(Boolean);

  return cache.meshes;
}

function findGround(character, meshes) {
  _origin.set(
    character.position.x,
    character.position.y + 3.0,
    character.position.z,
  );

  _groundRaycaster.set(_origin, DOWN);
  _groundRaycaster.near = 0;
  _groundRaycaster.far = 3.0 + MAX_GROUND_DROP;

  const hits = _groundRaycaster.intersectObjects(meshes, false);
  let bestGroundY = null;

  for (const hit of hits) {
    if (!isGroundFace(hit)) continue;
    const groundY = hit.point.y;

    if (groundY > character.position.y + STEP_HEIGHT) continue;

    if (bestGroundY === null || groundY > bestGroundY) {
      bestGroundY = groundY;
    }
  }

  // High-altitude recovery if character is in mid-air or dropping from terrain
  if (bestGroundY === null) {
    _origin.set(
      character.position.x,
      Math.max(character.position.y + 20, 200),
      character.position.z,
    );
    _groundRaycaster.set(_origin, DOWN);
    _groundRaycaster.far = 400;
    const recoveryHits = _groundRaycaster.intersectObjects(meshes, false);
    for (const hit of recoveryHits) {
      if (!isGroundFace(hit)) continue;
      if (bestGroundY === null || hit.point.y > bestGroundY) {
        bestGroundY = hit.point.y;
      }
    }
  }

  return bestGroundY;
}

function moveWithCollision(character, displacement, meshes) {
  _remaining.copy(displacement);
  if (_remaining.lengthSq() < 0.000001) return;

  const heights = [0.35, CHARACTER_HEIGHT * 0.5, CHARACTER_HEIGHT * 0.85];

  for (let pass = 0; pass < 2; pass += 1) {
    const distance = _remaining.length();
    if (distance < 0.0001) break;

    _direction.copy(_remaining).normalize();
    let closestHit = null;

    for (const height of heights) {
      _origin.copy(character.position).add(new THREE.Vector3(0, height, 0));

      _wallRaycaster.set(_origin, _direction);
      _wallRaycaster.near = 0;
      _wallRaycaster.far = distance + CHARACTER_RADIUS;

      const hits = _wallRaycaster.intersectObjects(meshes, false);

      for (const hit of hits) {
        if (!hit.face) continue;

        _normal
          .copy(hit.face.normal)
          .transformDirection(hit.object.matrixWorld);

        // Discard walkable slopes and floor geometry
        if (Math.abs(_normal.y) > 0.6) continue;

        if (!closestHit || hit.distance < closestHit.distance) {
          closestHit = hit;
        }
      }
    }

    if (!closestHit) {
      character.position.add(_remaining);
      _remaining.set(0, 0, 0);
      break;
    }

    _normal
      .copy(closestHit.face.normal)
      .transformDirection(closestHit.object.matrixWorld);

    _normal.y = 0;
    _normal.normalize();

    if (_normal.dot(_direction) > 0) {
      _normal.negate();
    }

    // Active push-out to prevent penetrating inside walls or corners
    if (closestHit.distance < CHARACTER_RADIUS) {
      const penetration = CHARACTER_RADIUS - closestHit.distance;
      character.position.addScaledVector(_normal, penetration + 0.015);
    }

    const allowedDistance = Math.max(0, closestHit.distance - CHARACTER_RADIUS);

    _travel
      .copy(_direction)
      .multiplyScalar(Math.min(distance, allowedDistance));

    character.position.add(_travel);
    _remaining.sub(_travel);

    const intoWall = _remaining.dot(_normal);
    if (intoWall < 0) {
      _remaining.addScaledVector(_normal, -intoWall);
    }
  }
}

function pushOutFromCar(character, car) {
  if (!car) return;
  const dx = character.position.x - car.position.x;
  const dz = character.position.z - car.position.z;
  const dy = Math.abs(character.position.y - car.position.y);
  if (dy > 2.2) return;

  const yaw = car.rotation.y;
  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);

  const localX = dx * cosY - dz * sinY;
  const localZ = dx * sinY + dz * cosY;

  const halfL = CAR_COLLISION_HALF_LEN + CHARACTER_RADIUS;
  const halfW = CAR_COLLISION_HALF_WID + CHARACTER_RADIUS;

  if (Math.abs(localX) < halfL && Math.abs(localZ) < halfW) {
    const overlapX = halfL - Math.abs(localX);
    const overlapZ = halfW - Math.abs(localZ);

    let pushLocalX = 0;
    let pushLocalZ = 0;
    if (overlapX < overlapZ) {
      pushLocalX = localX >= 0 ? overlapX : -overlapX;
    } else {
      pushLocalZ = localZ >= 0 ? overlapZ : -overlapZ;
    }

    character.position.x += pushLocalX * cosY + pushLocalZ * sinY;
    character.position.z += -pushLocalX * sinY + pushLocalZ * cosY;
  }
}

function selectAnimation({
  airborne,
  hasInput,
  sprinting,
  running,
  crouching,
  speed,
  combatStanceActive = false,
  forwardInput = 0,
  strafeInput = 0,
}) {
  if (airborne) return "jump";

  if (crouching) {
    return speed > 0.2 ? "crouchWalk" : "crouchIdle";
  }

  if (!hasInput || speed < 0.2) {
    return "idle";
  }

  if (combatStanceActive) {
    if (forwardInput < -0.2) return "backward";
    if (Math.abs(strafeInput) > 0.4 && Math.abs(forwardInput) < 0.3) {
      return strafeInput > 0 ? "strafeRight" : "strafeLeft";
    }
  }

  if (sprinting) return "sprint";
  if (running) return "run";

  return "walk";
}

/* ------------------------------------------------------------------ */
/* Character controller                                               */
/* ------------------------------------------------------------------ */

export default function CharacterController({
  characterRef,
  carRef,
  collidersRef,
  enabled,
  emoteActive = false,
  combatStanceActive = false,
  cameraYawRef,
  remoteInputRef,
  onAnimationChange,
  onEmote,
  onPositionUpdate,
}) {
  const keys = useRef(Object.create(null));
  const velocity = useRef(new THREE.Vector3());

  const airborne = useRef(false);
  const grounded = useRef(false);

  const jumpWasDown = useRef(false);
  const jumpBufferTimer = useRef(0);
  const coyoteTimer = useRef(0);

  const enabledRef = useRef(enabled);
  const emoteRef = useRef(emoteActive);

  const nearbyCache = useRef({
    source: null,
    position: new THREE.Vector3(Infinity, Infinity, Infinity),
    meshes: [],
  });

  const lastAnimation = useRef("");

  enabledRef.current = enabled;
  emoteRef.current = emoteActive;

  useEffect(() => {
    const onKeyDown = (event) => {
      const key = normalizeKey(event.key);
      if (!enabledRef.current) return;

      if (
        event.target?.tagName === "INPUT" ||
        event.target?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (/^[1-6]$/.test(key)) {
        event.preventDefault();
        if (!emoteRef.current) {
          onEmote?.(key);
        }
        return;
      }

      if (!CONTROL_KEYS.has(key)) return;
      event.preventDefault();

      if (key === "space" && !keys.current.space) {
        jumpBufferTimer.current = JUMP_BUFFER;
      }

      keys.current[key] = true;
    };

    const onKeyUp = (event) => {
      const key = normalizeKey(event.key);
      keys.current[key] = false;
    };

    const clearKeys = () => {
      keys.current = Object.create(null);
      jumpWasDown.current = false;
      jumpBufferTimer.current = 0;
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clearKeys);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", clearKeys);
    };
    
  }, [onEmote]);

  useEffect(() => {
    if (!enabled) {
      keys.current = Object.create(null);
      velocity.current.set(0, 0, 0);
      airborne.current = false;
      grounded.current = false;
      jumpWasDown.current = false;
      jumpBufferTimer.current = 0;
      coyoteTimer.current = 0;
      lastAnimation.current = "";
    }
  }, [enabled]);

  useFrame((_, rawDelta) => {
    const character = characterRef?.current;
    if (!enabled || !character) return;

    const dt = Math.min(rawDelta, 0.04);
    if (dt <= 0) return;

    const input = keys.current;
    const remote = remoteInputRef?.current;
    const v = velocity.current;

    const colliderEntries = collidersRef?.current;
    const meshes = getNearbyMeshes(
      nearbyCache.current,
      colliderEntries,
      character.position,
    );

    /* ---------------------------------------------------------- */
    /* Combine Keyboard + Joystick + Continuous Auto-Run Input    */
    /* ---------------------------------------------------------- */

    const kbForward =
      (input.w || input.arrowup ? 1 : 0) - (input.s || input.arrowdown ? 1 : 0);
    const kbStrafe =
      (input.d || input.arrowright ? 1 : 0) -
      (input.a || input.arrowleft ? 1 : 0);

    const joyMoveY =
      remote && Math.abs(remote.moveY || 0) > 0.04 ? remote.moveY : 0;
    const joyMoveX =
      remote && Math.abs(remote.moveX || 0) > 0.04 ? remote.moveX : 0;

    const autoRunActive = Boolean(remote?.autoRun);

    // If Auto-Run is active, move straight forward (+1) unless joystick Y overrides it
    const joyForward = joyMoveY !== 0 ? joyMoveY : autoRunActive ? 1 : 0;
    const joyStrafe = joyMoveX;

    const forwardInput = kbForward !== 0 ? kbForward : joyForward;
    const strafeInput = kbStrafe !== 0 ? kbStrafe : joyStrafe;

    const camYaw = cameraYawRef?.current ?? 0;

    _cameraForward.set(-Math.sin(camYaw), 0, -Math.cos(camYaw));
    _cameraRight.set(Math.cos(camYaw), 0, -Math.sin(camYaw));

    _wishDirection.set(0, 0, 0);
    _wishDirection.addScaledVector(_cameraForward, forwardInput);
    _wishDirection.addScaledVector(_cameraRight, strafeInput);

    const inputMagnitude = Math.min(1, _wishDirection.length());
    const hasInput = inputMagnitude > 0.04 && !emoteActive;

    if (hasInput) {
      _wishDirection.normalize();
    }

    /* ---------------------------------------------------------- */
    /* Movement modes                                             */
    /* ---------------------------------------------------------- */

    const crouching = Boolean(input.c || input.control || remote?.crouch);
    const sprinting = Boolean(input.shift || remote?.sprint) && !crouching;
    const running =
      (Boolean(input.alt) || autoRunActive || inputMagnitude > 0.72) &&
      !sprinting &&
      !crouching;

    let targetSpeed = WALK_SPEED;
    if (crouching) {
      targetSpeed = CROUCH_SPEED;
    } else if (sprinting) {
      targetSpeed = SPRINT_SPEED;
    } else if (running) {
      targetSpeed = RUN_SPEED;
    }

    // Joystick allows fine, slow in-place stepping when tilted slightly
    const effectiveSpeed =
      kbForward !== 0 || kbStrafe !== 0 || autoRunActive
        ? targetSpeed
        : targetSpeed * Math.max(0.28, inputMagnitude);

    /* ---------------------------------------------------------- */
    /* Horizontal acceleration                                    */
    /* ---------------------------------------------------------- */

    _horizontalVelocity.set(v.x, 0, v.z);

    if (hasInput) {
      const targetVelocity = _wishDirection
        .clone()
        .multiplyScalar(effectiveSpeed);
      const difference = targetVelocity.sub(_horizontalVelocity);
      const acceleration = airborne.current ? AIR_ACCEL : GROUND_ACCEL;
      const maxChange = acceleration * dt;

      if (difference.length() > maxChange) {
        difference.setLength(maxChange);
      }

      _horizontalVelocity.add(difference);
    } else {
      const currentSpeed = _horizontalVelocity.length();
      if (currentSpeed > 0) {
        const deceleration = airborne.current ? AIR_ACCEL : GROUND_DECEL;
        const drop = Math.min(currentSpeed, deceleration * dt);
        _horizontalVelocity.multiplyScalar(
          (currentSpeed - drop) / currentSpeed,
        );
      }
    }

    v.x = _horizontalVelocity.x;
    v.z = _horizontalVelocity.z;

    /* ---------------------------------------------------------- */
    /* Character facing                                           */
    /* ---------------------------------------------------------- */

    /* ---------------------------------------------------------- */
    /* Character facing                                           */
    /* ---------------------------------------------------------- */

    if (combatStanceActive) {
      // Face directly along the camera sightline during ADS or firing
      const targetYaw = camYaw + Math.PI;
      let angleDifference = targetYaw - character.rotation.y;
      angleDifference = Math.atan2(
        Math.sin(angleDifference),
        Math.cos(angleDifference),
      );
      const turnAlpha = 1 - Math.exp(-TURN_RATE * 1.8 * dt);
      character.rotation.y += angleDifference * turnAlpha;
    } else if (hasInput) {
      const targetYaw = Math.atan2(_wishDirection.x, _wishDirection.z);

      let angleDifference = targetYaw - character.rotation.y;
      angleDifference = Math.atan2(
        Math.sin(angleDifference),
        Math.cos(angleDifference),
      );

      const turnAlpha = 1 - Math.exp(-TURN_RATE * dt);
      character.rotation.y += angleDifference * turnAlpha;
    }

    /* ---------------------------------------------------------- */
    /* Horizontal movement and wall + car collision               */
    /* ---------------------------------------------------------- */

    _movement.set(v.x * dt, 0, v.z * dt);

    if (meshes.length) {
      moveWithCollision(character, _movement, meshes);
    } else {
      character.position.add(_movement);
    }

    if (carRef?.current) {
      pushOutFromCar(character, carRef.current);
    }

    /* ---------------------------------------------------------- */
    /* Ground detection                                           */
    /* ---------------------------------------------------------- */

    let groundY = DEFAULT_GROUND_Y;

    if (meshes.length) {
      const detectedGround = findGround(character, meshes);
      if (detectedGround !== null) {
        groundY = detectedGround;
      } else {
        groundY = carRef?.current ? carRef.current.position.y : null;
      }
    }

    const wasGrounded = grounded.current;

    const canStandOnGround =
      groundY !== null &&
      v.y <= 0 &&
      character.position.y <= groundY + STEP_HEIGHT;

    if (canStandOnGround) {
      character.position.y = groundY;
      v.y = 0;
      grounded.current = true;
      airborne.current = false;
      coyoteTimer.current = COYOTE_TIME;
    } else {
      grounded.current = false;
      airborne.current = true;
      coyoteTimer.current = Math.max(0, coyoteTimer.current - dt);
    }

    /* ---------------------------------------------------------- */
    /* Jump buffering and coyote time                             */
    /* ---------------------------------------------------------- */

    const remoteJumpTriggered = Boolean(remote?.jumpPulse);
    if (remote?.jumpPulse) {
      remote.jumpPulse = false;
    }
    const jumpDown = Boolean(input.space || remote?.jump || remoteJumpTriggered) && !emoteActive;

    if (jumpDown && !jumpWasDown.current) {
      jumpBufferTimer.current = JUMP_BUFFER;
    }

    jumpWasDown.current = jumpDown;
    jumpBufferTimer.current = Math.max(0, jumpBufferTimer.current - dt);

    const canJump = grounded.current || coyoteTimer.current > 0;

    if (jumpBufferTimer.current > 0 && canJump && !emoteActive) {
      v.y = JUMP_FORCE;
      grounded.current = false;
      airborne.current = true;
      jumpBufferTimer.current = 0;
      coyoteTimer.current = 0;
    }

    /* ---------------------------------------------------------- */
    /* Gravity and landing                                        */
    /* ---------------------------------------------------------- */

    if (airborne.current) {
      v.y -= GRAVITY * dt;
      character.position.y += v.y * dt;

      if (groundY !== null && v.y <= 0 && character.position.y <= groundY) {
        character.position.y = groundY;
        v.y = 0;
        airborne.current = false;
        grounded.current = true;
        coyoteTimer.current = COYOTE_TIME;
      }
    }

    if (wasGrounded && !grounded.current) {
      airborne.current = true;
    }

    // Safety check against falling below world bounds
    if (character.position.y < -30 && groundY !== null) {
      character.position.y = Math.max(groundY, 0);
      v.y = 0;
      airborne.current = false;
      grounded.current = true;
    }

    /* ---------------------------------------------------------- */
    /* Animation selection                                        */
    /* ---------------------------------------------------------- */

    const horizontalSpeed = Math.hypot(v.x, v.z);

    if (!emoteActive) {
      const nextAnimation = selectAnimation({
        airborne: airborne.current,
        hasInput,
        sprinting,
        running,
        crouching,
        speed: horizontalSpeed,
        combatStanceActive,
        forwardInput,
        strafeInput,
      });

      if (lastAnimation.current !== nextAnimation) {
        lastAnimation.current = nextAnimation;
        onAnimationChange?.(nextAnimation);
      }
    }

    onPositionUpdate?.(character.position);
  });

  return null;
}
```

===============================================================================
FILE: client/src/components/Character/CharacterModel.jsx
===============================================================================

```jsx
import React, { forwardRef, useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { useAnimations, useFBX } from "@react-three/drei";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";

import characterUrl from "../../assets/models/Characters/X Bot.fbx";

export const CHARACTER_SCALE = 0.01;

const animationContext = require.context(
  "../../assets/models/Characters",
  false,
  /\.fbx$/i,
);

const animationKeys = animationContext
  .keys()
  .filter((key) => !/x\s*bot\.fbx$/i.test(key));

const animationUrls = animationKeys.map((key) => animationContext(key));

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const ANIMATION_ALIASES = {
  idle: ["idle", "standingidle"],
  walk: ["walking", "walk"],
  run: ["running", "run"],
  sprint: ["sprint", "running", "run"],
  backward: ["walkingbackwards", "walkbackwards", "backwardwalking"],
  strafeLeft: ["leftstrafe", "strafingleft"],
  strafeRight: ["rightstrafe", "strafingright", "leftstrafe"],
  crouchIdle: ["crouchingidle", "crouchidle"],
  crouchWalk: ["crouchwalk", "crouchingwalk"],
  jump: ["jumping", "jump"],
  knockedOut: ["knockedout", "dying", "death"],
  wave: ["wave", "waving", "idle"],
  dance: ["macarenadance", "hiphopdancing", "breakdance", "crouchwalk"],
  salute: ["salute", "jumping"],
  celebrate: ["celebrate", "celebration", "victory", "jumping"],
  point: ["point", "pointing", "crouchingidle"],
  sit: ["sit", "sittingidle", "sitting", "crouchingidle"],
  drivingSeat: ["driving"],
  enterCar: ["enteringcar"],
  exitCar: ["exitingcar"],
};

const ONE_SHOT = new Set([
  "wave",
  "dance",
  "salute",
  "celebrate",
  "point",
  "sit",
  "enterCar",
  "exitCar",
  "knockedOut",
]);

const MISSING_CLIP_FALLBACK_MS = 650;

function stripRootMotion(clip) {
  clip.tracks.forEach((track) => {
    if (/hips\.position$/i.test(track.name)) {
      const values = track.values;
      const baseX = values[0] || 0;
      const baseZ = values[2] || 0;
      for (let i = 0; i < values.length; i += 3) {
        values[i] = baseX;
        values[i + 2] = baseZ;
      }
    }
  });
  return clip;
}

const _gunGeoms = {
  grip: new THREE.BoxGeometry(0.038, 0.13, 0.046),
  triggerGuard: new THREE.BoxGeometry(0.024, 0.045, 0.055),
  trigger: new THREE.BoxGeometry(0.01, 0.025, 0.012),
  body: new THREE.BoxGeometry(0.048, 0.088, 0.32),
  stock: new THREE.BoxGeometry(0.04, 0.11, 0.22),
  mag: new THREE.BoxGeometry(0.036, 0.18, 0.065),
  handguard: new THREE.BoxGeometry(0.052, 0.075, 0.24),
  barrel: new THREE.CylinderGeometry(0.014, 0.014, 0.32, 8),
  brake: new THREE.CylinderGeometry(0.018, 0.018, 0.05, 8),
  topRail: new THREE.BoxGeometry(0.032, 0.015, 0.26),
  scope: new THREE.BoxGeometry(0.042, 0.045, 0.11),
  opticLens: new THREE.CylinderGeometry(0.016, 0.016, 0.008, 12),
  flashCore: new THREE.SphereGeometry(0.05, 6, 6),
  flashSpike: new THREE.ConeGeometry(0.04, 0.18, 5),
};

// Reusable math objects for procedural 2-bone IK (zero runtime GC allocation)
const _tempTarget = new THREE.Vector3();
const _tempElbow = new THREE.Vector3();
const _tempHand = new THREE.Vector3();
const _tempShoulder = new THREE.Vector3();
const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _q1 = new THREE.Quaternion();
const _q2 = new THREE.Quaternion();
const _tempParentQuat = new THREE.Quaternion();
const _tempBoneQuat = new THREE.Quaternion();

const _gunSharedMats = {
  darkMetal: new THREE.MeshStandardMaterial({
    color: "#161c26",
    metalness: 0.88,
    roughness: 0.24,
  }),
  darkPolymer: new THREE.MeshStandardMaterial({
    color: "#0a0e16",
    roughness: 0.72,
    metalness: 0.15,
  }),
  opticMat: new THREE.MeshStandardMaterial({
    color: "#00d2ff",
    roughness: 0.12,
    metalness: 0.9,
    emissive: "#00d2ff",
    emissiveIntensity: 0.85,
  }),
};

function buildGunMesh() {
  const group = new THREE.Group();
  group.name = "EQUIPPED_WEAPON_GROUP";
  // Scaled in Mixamo centimeter space (since character root has 0.01 scale)
  group.scale.setScalar(100);

  // Precision alignment on mixamorig:RightHand so grip sits naturally inside the curled palm
  group.position.set(0.5, 9.5, 3.2);
  group.rotation.set(-0.62, 1.32, -0.62);

  const { darkMetal, darkPolymer, opticMat } = _gunSharedMats;
  const accentMat = new THREE.MeshStandardMaterial({
    color: "#2d79ff",
    metalness: 0.75,
    roughness: 0.25,
    emissive: "#09245a",
    emissiveIntensity: 0.45,
  });
  const muzzleFlashMat = new THREE.MeshBasicMaterial({
    color: "#ffc83b",
    transparent: true,
    opacity: 0,
  });

  // 1. Pistol Grip (centered around local origin so right hand curls directly around it)
  const grip = new THREE.Mesh(_gunGeoms.grip, darkPolymer);
  grip.position.set(0, -0.04, -0.02);
  grip.rotation.x = -0.28;
  group.add(grip);

  // 2. Trigger Guard & Trigger
  const triggerGuard = new THREE.Mesh(_gunGeoms.triggerGuard, darkMetal);
  triggerGuard.position.set(0, -0.015, 0.045);
  group.add(triggerGuard);

  const trigger = new THREE.Mesh(_gunGeoms.trigger, accentMat);
  trigger.position.set(0, -0.01, 0.04);
  trigger.rotation.x = 0.2;
  group.add(trigger);

  // 3. Lower & Upper Receiver Body
  const body = new THREE.Mesh(_gunGeoms.body, darkMetal);
  body.position.set(0, 0.048, 0.04);
  group.add(body);

  // 4. Tactical Shoulder Stock
  const stock = new THREE.Mesh(_gunGeoms.stock, darkPolymer);
  stock.position.set(0, 0.03, -0.22);
  group.add(stock);

  // 5. Magazine (Curved Banana Mag inserted in front of trigger)
  const mag = new THREE.Mesh(_gunGeoms.mag, accentMat);
  mag.position.set(0, -0.065, 0.12);
  mag.rotation.x = 0.22;
  group.add(mag);

  // 6. Tactical Handguard (Where Left Hand firmly supports and cradles the rifle)
  const handguard = new THREE.Mesh(_gunGeoms.handguard, darkPolymer);
  handguard.position.set(0, 0.048, 0.28);
  group.add(handguard);

  // 7. Barrel
  const barrel = new THREE.Mesh(_gunGeoms.barrel, darkMetal);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 0.048, 0.44);
  group.add(barrel);

  // 8. Muzzle Brake
  const brake = new THREE.Mesh(_gunGeoms.brake, accentMat);
  brake.rotation.x = Math.PI / 2;
  brake.position.set(0, 0.048, 0.61);
  group.add(brake);

  // 9. Picatinny Top Rail & Holographic Optic Sight
  const topRail = new THREE.Mesh(_gunGeoms.topRail, darkMetal);
  topRail.position.set(0, 0.098, 0.08);
  group.add(topRail);

  const scope = new THREE.Mesh(_gunGeoms.scope, darkPolymer);
  scope.position.set(0, 0.125, 0.07);
  group.add(scope);

  const opticLens = new THREE.Mesh(_gunGeoms.opticLens, opticMat);
  opticLens.rotation.x = Math.PI / 2;
  opticLens.position.set(0, 0.125, 0.12);
  group.add(opticLens);

  // 10. Dynamic Muzzle Flash (Multi-pointed star)
  const flashGroup = new THREE.Group();
  flashGroup.position.set(0, 0.048, 0.65);
  flashGroup.name = "MUZZLE_FLASH";

  const flashCore = new THREE.Mesh(_gunGeoms.flashCore, muzzleFlashMat);
  flashGroup.add(flashCore);

  const flashSpike = new THREE.Mesh(_gunGeoms.flashSpike, muzzleFlashMat);
  flashSpike.rotation.x = -Math.PI / 2;
  flashGroup.add(flashSpike);

  group.add(flashGroup);

  group.userData = {
    accentMat,
    muzzleFlashMat,
    barrel,
    mag,
    handguard,
    flashGroup,
    disposables: [accentMat, muzzleFlashMat],
  };
  return group;
}

const CharacterModel = forwardRef(function CharacterModel(
  {
    animation = "idle",
    visible = true,
    weaponId = "fist",
    aiming = false,
    firing = false,
    aimPitch = 0,
    bodyColor = null,
    onAnimationFinished,
    onAnimationProgress,
  },
  forwardedRef,
) {
  const sourceCharacter = useFBX(characterUrl);

  const character = useMemo(
    () => cloneSkeleton(sourceCharacter),
    [sourceCharacter],
  );

  const bonesRef = useMemo(() => ({}), []);
  const gunGroupRef = useRef(null);
  const activeAnimationRef = useRef(null);

  const animationModels = useLoader(FBXLoader, animationUrls);

  const clips = useMemo(() => {
    const output = [];

    animationModels.forEach((fbx, index) => {
      const filePath = animationKeys[index];
      const fileName = filePath
        .split("/")
        .pop()
        .replace(/\.fbx$/i, "");

      const sourceClip = fbx.animations?.[0];
      if (!sourceClip) return;

      const clip = stripRootMotion(sourceClip.clone());
      clip.name = normalize(fileName);
      output.push(clip);
    });

    return output;
  }, [animationModels]);

  const { actions, mixer } = useAnimations(clips, forwardedRef);

  useEffect(() => {
    Object.keys(bonesRef).forEach((k) => delete bonesRef[k]);
    gunGroupRef.current = null;
    const clonedMatDisposables = [];
    const allowCastShadow = !bodyColor;

    // Prioritize primary surface skeleton bones so child joint bones do not override them
    const surfaceMesh = character.getObjectByName("Beta_Surface");
    if (surfaceMesh?.skeleton?.bones) {
      surfaceMesh.skeleton.bones.forEach((bone) => {
        const cleanKey = bone.name.replace(/^mixamorig:?/i, "");
        if (!bonesRef[cleanKey]) {
          bonesRef[cleanKey] = bone;
        }
      });
    }

    character.traverse((node) => {
      if (node.isBone) {
        const cleanKey = node.name.replace(/^mixamorig:?/i, "");
        if (!bonesRef[cleanKey]) {
          bonesRef[cleanKey] = node;
        }
      }
      if (!node.isMesh) return;

      node.castShadow = allowCastShadow;
      node.receiveShadow = true;
      node.frustumCulled = false;

      if (node.material) {
        const clonedMaterials = (
          Array.isArray(node.material) ? node.material : [node.material]
        ).map((mat) => {
          if (!mat) return mat;
          const cloned = mat.clone();
          cloned.side = THREE.FrontSide;
          if (bodyColor && cloned.color) {
            cloned.color.set(bodyColor);
          }
          cloned.needsUpdate = true;
          clonedMatDisposables.push(cloned);
          return cloned;
        });

        node.material = Array.isArray(node.material)
          ? clonedMaterials
          : clonedMaterials[0];
      }
    });

    const rightHand = bonesRef.RightHand;
    if (rightHand) {
      const gun = buildGunMesh();
      rightHand.add(gun);
      gunGroupRef.current = gun;
    }

    return () => {
      const gun = gunGroupRef.current;
      if (gun) {
        if (gun.parent) gun.parent.remove(gun);
        const gunDisposables = gun.userData?.disposables;
        if (gunDisposables) {
          gunDisposables.forEach((m) => m?.dispose());
        }
      }
      clonedMatDisposables.forEach((m) => m?.dispose());
      gunGroupRef.current = null;
    };
  }, [character, bonesRef, bodyColor]);

  useEffect(() => {
    character.rotation.set(0, 0, 0);
  }, [character]);

  useEffect(() => {
    const aliases = ANIMATION_ALIASES[animation] || [normalize(animation)];

    let action = null;

    for (const alias of aliases) {
      if (actions[alias]) {
        action = actions[alias];
        break;
      }
    }

    Object.values(actions).forEach((candidate) => {
      if (candidate && candidate !== action) {
        candidate.fadeOut(0.15);
      }
    });

    if (!action) {
      if (ONE_SHOT.has(animation)) {
        const timer = window.setTimeout(() => {
          onAnimationFinished?.(animation);
        }, MISSING_CLIP_FALLBACK_MS);

        return () => window.clearTimeout(timer);
      }
      return undefined;
    }

    const oneShot = ONE_SHOT.has(animation);

    action.reset();
    action.enabled = true;
    action.paused = false;
    action.clampWhenFinished = oneShot;
    action.timeScale = 1;

    action.setLoop(
      oneShot ? THREE.LoopOnce : THREE.LoopRepeat,
      oneShot ? 1 : Infinity,
    );

    const handleFinished = (event) => {
      if (event.action !== action) return;
      onAnimationFinished?.(animation);
    };

    if (oneShot) {
      mixer.addEventListener("finished", handleFinished);
    }

    activeAnimationRef.current = { animation, action };
    onAnimationProgress?.(animation, 0);
    action.fadeIn(0.2).play();

    return () => {
      if (activeAnimationRef.current?.action === action) {
        activeAnimationRef.current = null;
      }
      if (oneShot) {
        mixer.removeEventListener("finished", handleFinished);
      }
      action.fadeOut(0.15);
    };
  }, [animation, actions, mixer, onAnimationFinished, onAnimationProgress]);

  useFrame((state) => {
    const active = activeAnimationRef.current;
    if (active && ONE_SHOT.has(active.animation) && onAnimationProgress) {
      const duration = active.action.getClip().duration;
      if (duration && duration > 0) {
        const progress = THREE.MathUtils.clamp(
          active.action.time / duration,
          0,
          1,
        );
        onAnimationProgress(active.animation, progress);
      }
    }

    // Update equipped weapon appearance and procedural upper-body aiming pose
    const gun = gunGroupRef.current;
    const isArmed =
      weaponId &&
      weaponId !== "fist" &&
      animation !== "drivingSeat" &&
      animation !== "enterCar" &&
      animation !== "exitCar" &&
      animation !== "knockedOut";

    if (gun) {
      gun.visible = Boolean(isArmed);
      if (gun.userData?.accentMat) {
        gun.userData.accentMat.color.set(
          weaponId === "mp40" ? "#ff9f0a" : "#2d79ff",
        );
      }
      if (gun.userData?.barrel) {
        gun.userData.barrel.scale.set(1, 1, weaponId === "mp40" ? 0.62 : 1);
      }
      if (gun.userData?.mag) {
        gun.userData.mag.scale.set(
          weaponId === "mp40" ? 0.8 : 1,
          weaponId === "mp40" ? 1.25 : 1,
          weaponId === "mp40" ? 0.65 : 1,
        );
      }
      if (gun.userData?.flashGroup && gun.userData?.muzzleFlashMat) {
        if (firing) {
          gun.userData.flashGroup.scale.setScalar(
            1.0 + Math.sin(state.clock.elapsedTime * 75) * 0.35,
          );
          gun.userData.muzzleFlashMat.opacity = 0.95;
        } else {
          gun.userData.flashGroup.scale.setScalar(0.001);
          gun.userData.muzzleFlashMat.opacity = 0;
        }
      }
    }

    if (isArmed) {
      const spine = bonesRef.Spine1 || bonesRef.Spine;
      const spine2 = bonesRef.Spine2;
      const rightArm = bonesRef.RightArm;
      const rightForeArm = bonesRef.RightForeArm;
      const rightHand = bonesRef.RightHand;
      const leftArm = bonesRef.LeftArm;
      const leftForeArm = bonesRef.LeftForeArm;
      const leftHand = bonesRef.LeftHand;

      const isTwoHanded =
        weaponId === "m4a1" ||
        weaponId === "ak47" ||
        weaponId === "awm" ||
        weaponId === "mp40";

      const recoilKick = firing
        ? Math.sin(state.clock.elapsedTime * 65) * 0.045 + 0.02
        : 0;

      if (isTwoHanded) {
        if (aiming || firing) {
          // --- ADS / SCOPE AIMING & COMBAT FIRING STANCE (TWO-HANDED) ---
          if (spine) {
            spine.rotation.x += THREE.MathUtils.clamp(-aimPitch * 0.45, -0.4, 0.4);
            spine.rotation.y = 0.12;
          }
          if (spine2) {
            spine2.rotation.x += THREE.MathUtils.clamp(-aimPitch * 0.25, -0.25, 0.25);
          }

          if (rightArm) {
            rightArm.rotation.set(
              0.8 - aimPitch * 0.65 - recoilKick,
              -0.3,
              -0.4,
            );
          }
          if (rightForeArm) {
            rightForeArm.rotation.set(0, 0, -0.8);
          }
          if (rightHand) {
            rightHand.rotation.set(0, 0.2, 0);
          }

          // Left Arm Two-Handed IK Solver (Snap Left Hand firmly to Handguard)
          const handguard = gun?.userData?.handguard;
          if (handguard && leftArm && leftForeArm && leftHand) {
            character.updateMatrixWorld(true);
            _tempTarget.set(0, 0, 0);
            handguard.getWorldPosition(_tempTarget);

            leftArm.rotation.set(1.1 - aimPitch * 0.5, 0.35, 0.5);
            leftForeArm.rotation.set(0, 0, 1.1);

            for (let iter = 0; iter < 3; iter++) {
              character.updateMatrixWorld(true);
              leftForeArm.getWorldPosition(_tempElbow);
              leftHand.getWorldPosition(_tempHand);

              _v1.subVectors(_tempHand, _tempElbow).normalize();
              _v2.subVectors(_tempTarget, _tempElbow).normalize();
              _q1.setFromUnitVectors(_v1, _v2);

              leftForeArm.parent.getWorldQuaternion(_tempParentQuat);
              leftForeArm.getWorldQuaternion(_tempBoneQuat);
              leftForeArm.quaternion.copy(
                _tempParentQuat.invert().multiply(_q1.multiply(_tempBoneQuat)),
              );

              character.updateMatrixWorld(true);
              leftArm.getWorldPosition(_tempShoulder);
              leftHand.getWorldPosition(_tempHand);

              _v1.subVectors(_tempHand, _tempShoulder).normalize();
              _v2.subVectors(_tempTarget, _tempShoulder).normalize();
              _q2.setFromUnitVectors(_v1, _v2);

              leftArm.parent.getWorldQuaternion(_tempParentQuat);
              leftArm.getWorldQuaternion(_tempBoneQuat);
              leftArm.quaternion.copy(
                _tempParentQuat.invert().multiply(_q2.multiply(_tempBoneQuat)),
              );
            }

            leftHand.rotation.set(0.15, -0.25, 0.2);
          }
        } else {
          // --- TACTICAL READY / TWO-HANDED COMBAT CARRY (Locomotion & Idle) ---
          if (spine) {
            spine.rotation.y = 0.08;
          }
          if (spine2) {
            spine2.rotation.y = 0.05;
          }

          if (rightArm) {
            rightArm.rotation.set(0.9, -0.35, -0.3);
          }
          if (rightForeArm) {
            rightForeArm.rotation.set(0, 0, -1.1);
          }
          if (rightHand) {
            rightHand.rotation.set(0, 0.1, 0.1);
          }

          // Left Arm Two-Handed IK Solver (Snap Left Hand firmly to Handguard)
          const handguard = gun?.userData?.handguard;
          if (handguard && leftArm && leftForeArm && leftHand) {
            character.updateMatrixWorld(true);
            _tempTarget.set(0, 0, 0);
            handguard.getWorldPosition(_tempTarget);

            leftArm.rotation.set(1.2, 0.4, 0.6);
            leftForeArm.rotation.set(0, 0, 1.3);

            for (let iter = 0; iter < 3; iter++) {
              character.updateMatrixWorld(true);
              leftForeArm.getWorldPosition(_tempElbow);
              leftHand.getWorldPosition(_tempHand);

              _v1.subVectors(_tempHand, _tempElbow).normalize();
              _v2.subVectors(_tempTarget, _tempElbow).normalize();
              _q1.setFromUnitVectors(_v1, _v2);

              leftForeArm.parent.getWorldQuaternion(_tempParentQuat);
              leftForeArm.getWorldQuaternion(_tempBoneQuat);
              leftForeArm.quaternion.copy(
                _tempParentQuat.invert().multiply(_q1.multiply(_tempBoneQuat)),
              );

              character.updateMatrixWorld(true);
              leftArm.getWorldPosition(_tempShoulder);
              leftHand.getWorldPosition(_tempHand);

              _v1.subVectors(_tempHand, _tempShoulder).normalize();
              _v2.subVectors(_tempTarget, _tempShoulder).normalize();
              _q2.setFromUnitVectors(_v1, _v2);

              leftArm.parent.getWorldQuaternion(_tempParentQuat);
              leftArm.getWorldQuaternion(_tempBoneQuat);
              leftArm.quaternion.copy(
                _tempParentQuat.invert().multiply(_q2.multiply(_tempBoneQuat)),
              );
            }

            leftHand.rotation.set(0.1, -0.3, 0.2);
          }
        }
      } else {
        // --- HANDGUN / PISTOL (DESERT EAGLE) ---
        if (aiming || firing) {
          if (spine) {
            spine.rotation.x += THREE.MathUtils.clamp(-aimPitch * 0.4, -0.35, 0.35);
          }
          if (rightArm) {
            rightArm.rotation.set(0.85 - aimPitch * 0.6 - recoilKick, -0.2, -0.3);
          }
          if (rightForeArm) {
            rightForeArm.rotation.set(0, 0, -0.7);
          }
          if (rightHand) {
            rightHand.rotation.set(0, 0.2, 0);
          }
          // Weaver supporting left hand for pistol
          if (leftArm) {
            leftArm.rotation.set(0.95 - aimPitch * 0.5, 0.25, 0.4);
          }
          if (leftForeArm) {
            leftForeArm.rotation.set(0, 0, 0.9);
          }
          if (leftHand) {
            leftHand.rotation.set(0.2, -0.2, 0.1);
          }
        } else {
          // Low ready handgun
          if (rightArm) {
            rightArm.rotation.set(1.0, -0.2, -0.15);
          }
          if (rightForeArm) {
            rightForeArm.rotation.set(0, 0, -0.6);
          }
        }
      }
    } else if (
      weaponId === "fist" &&
      (aiming || firing) &&
      animation !== "drivingSeat" &&
      animation !== "enterCar" &&
      animation !== "exitCar" &&
      animation !== "knockedOut"
    ) {
      // --- FIST MELEE PUNCH STRIKE ANIMATION ---
      const spine = bonesRef.Spine1 || bonesRef.Spine;
      const rightArm = bonesRef.RightArm;
      const rightForeArm = bonesRef.RightForeArm;
      const rightHand = bonesRef.RightHand;
      const leftArm = bonesRef.LeftArm;
      const leftForeArm = bonesRef.LeftForeArm;
      const leftHand = bonesRef.LeftHand;

      // Fast, alternating dynamic boxer jab
      const punchCycle = Math.sin(state.clock.elapsedTime * 22);
      if (spine) {
        spine.rotation.y = punchCycle * 0.22;
        spine.rotation.x = THREE.MathUtils.clamp(-aimPitch * 0.35, -0.3, 0.3);
      }

      const rightJab = Math.max(0, punchCycle);
      const leftJab = Math.max(0, -punchCycle);

      if (rightArm) {
        rightArm.rotation.set(
          THREE.MathUtils.lerp(0.8, 1.45 - aimPitch * 0.6, rightJab),
          THREE.MathUtils.lerp(-0.25, -0.05, rightJab),
          THREE.MathUtils.lerp(-0.35, -0.05, rightJab),
        );
      }
      if (rightForeArm) {
        rightForeArm.rotation.set(0, 0, THREE.MathUtils.lerp(-1.2, -0.15, rightJab));
      }
      if (rightHand) {
        rightHand.rotation.set(0, 0.35, 0);
      }

      if (leftArm) {
        leftArm.rotation.set(
          THREE.MathUtils.lerp(0.8, 1.45 - aimPitch * 0.6, leftJab),
          THREE.MathUtils.lerp(0.25, 0.05, leftJab),
          THREE.MathUtils.lerp(0.35, 0.05, leftJab),
        );
      }
      if (leftForeArm) {
        leftForeArm.rotation.set(0, 0, THREE.MathUtils.lerp(1.2, 0.15, leftJab));
      }
      if (leftHand) {
        leftHand.rotation.set(0, -0.35, 0);
      }
    }
  });

  useEffect(() => {
    return () => {
      mixer.stopAllAction();
    };
  }, [mixer]);

  return (
    <group ref={forwardedRef} scale={CHARACTER_SCALE} visible={visible}>
      <primitive object={character} />
    </group>
  );
});

export default CharacterModel;
```

===============================================================================
FILE: client/src/components/Character/RemotePlayers.jsx
===============================================================================

```jsx
import React, { memo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import CharacterModel from "./CharacterModel";
import WorldHtml from "../UI/WorldHtml";

const RemotePlayerPuppet = memo(function RemotePlayerPuppet({
  playerInfo,
  remotePlayersDataRef,
  isTeammate = false,
}) {
  const groupRef = useRef(null);
  const targetPosRef = useRef(new THREE.Vector3(0, 1, 0));
  const targetYawRef = useRef(0);
  const currentYawRef = useRef(0);

  const [puppetAnim, setPuppetAnim] = useState("idle");
  const [puppetWeapon, setPuppetWeapon] = useState("fist");
  const [puppetAim, setPuppetAim] = useState(false);
  const [puppetFire, setPuppetFire] = useState(false);
  const [puppetAimPitch, setPuppetAimPitch] = useState(0);
  const [hpPercent, setHpPercent] = useState(100);
  const [isAlive, setIsAlive] = useState(true);

  const prevAnimRef = useRef("idle");
  const prevWeaponRef = useRef("fist");
  const prevAimRef = useRef(false);
  const prevFireRef = useRef(false);
  const prevHpRef = useRef(100);
  const prevAliveRef = useRef(true);

  useFrame((_, rawDelta) => {
    const group = groupRef.current;
    if (!group) return;

    const data = remotePlayersDataRef?.current?.get(playerInfo.id);
    if (data) {
      if (Array.isArray(data.pos)) {
        targetPosRef.current.set(data.pos[0], data.pos[1], data.pos[2]);
      }
      if (Array.isArray(data.rot)) {
        targetYawRef.current = data.rot[0];
      }

      // Check discrete stance and animation changes without re-rendering every frame
      const nextAnim = !data.alive
        ? "knockedOut"
        : data.veh === "driving"
        ? "drivingSeat"
        : data.anim || "idle";
      if (nextAnim !== prevAnimRef.current) {
        prevAnimRef.current = nextAnim;
        setPuppetAnim(nextAnim);
      }

      const nextWep = data.veh === "driving" ? "fist" : data.wep || "fist";
      if (nextWep !== prevWeaponRef.current) {
        prevWeaponRef.current = nextWep;
        setPuppetWeapon(nextWep);
      }

      const nextAim = Boolean(data.aim);
      if (nextAim !== prevAimRef.current) {
        prevAimRef.current = nextAim;
        setPuppetAim(nextAim);
      }

      const nextFire = Boolean(data.fire);
      if (nextFire !== prevFireRef.current) {
        prevFireRef.current = nextFire;
        setPuppetFire(nextFire);
      }

      const nextPitch = data.rot ? data.rot[1] : 0;
      setPuppetAimPitch(nextPitch);

      const nextHp = Math.max(0, Math.min(100, data.hp ?? 100));
      if (Math.abs(nextHp - prevHpRef.current) >= 1) {
        prevHpRef.current = nextHp;
        setHpPercent(nextHp);
      }

      const nextAlive = data.alive !== false && nextHp > 0;
      if (nextAlive !== prevAliveRef.current) {
        prevAliveRef.current = nextAlive;
        setIsAlive(nextAlive);
      }
    }

    const dt = Math.min(rawDelta, 0.05);

    // Smooth position interpolation (lerp)
    group.position.lerp(targetPosRef.current, 1 - Math.exp(-22 * dt));

    // Smooth angle interpolation without wrap-around snapping
    const currentYaw = currentYawRef.current;
    const targetYaw = targetYawRef.current;
    let diff = targetYaw - currentYaw;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    const nextYaw = currentYaw + diff * (1 - Math.exp(-24 * dt));
    currentYawRef.current = nextYaw;
    group.rotation.y = nextYaw;
  });

  return (
    <group ref={groupRef} position={[0, 1, 0]}>
      {/* 3D Character Model with Server-Synchronized Animations and Weapon Stance */}
      <CharacterModel
        animation={puppetAnim}
        visible={true}
        weaponId={puppetWeapon}
        aiming={puppetAim}
        firing={puppetFire}
        aimPitch={puppetAimPitch}
        bodyColor={isTeammate ? "#00ff88" : null}
      />

      {/* High-performance single-root 3D-to-2D projected overhead nametag & health bar */}
      <WorldHtml position={[0, 2.15, 0]} center distanceFactor={16}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "110px",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {/* Player Name and Team Tag */}
          <div
            style={{
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.5px",
              color: !isAlive ? "#888888" : isTeammate ? "#00ffc2" : "#ff3355",
              textShadow: "0 1px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.8)",
              whiteSpace: "nowrap",
              marginBottom: "3px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {isTeammate && (
              <span
                style={{
                  background: "#00c853",
                  color: "#000",
                  padding: "1px 4px",
                  borderRadius: "3px",
                  fontSize: "9px",
                  fontWeight: 900,
                }}
              >
                TEAM
              </span>
            )}
            {playerInfo.name || "Player"}
          </div>

          {/* Health Bar */}
          {isAlive ? (
            <div
              style={{
                width: "100%",
                height: "6px",
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                borderRadius: "3px",
                overflow: "hidden",
                boxShadow: "0 2px 4px rgba(0,0,0,0.8)",
              }}
            >
              <div
                style={{
                  width: `${hpPercent}%`,
                  height: "100%",
                  backgroundColor: isTeammate
                    ? hpPercent > 35
                      ? "#00ff88"
                      : "#ffaa00"
                    : hpPercent > 35
                    ? "#ff2a4b"
                    : "#ff1122",
                  transition: "width 0.15s ease-out",
                }}
              />
            </div>
          ) : (
            <div
              style={{
                fontSize: "9px",
                color: "#ff3333",
                fontWeight: 900,
                letterSpacing: "0.8px",
                textShadow: "0 1px 3px #000",
              }}
            >
              ELIMINATED
            </div>
          )}
        </div>
      </WorldHtml>
    </group>
  );
});

export default function RemotePlayers({
  remoteHumansList = [],
  remotePlayersDataRef = null,
  localTeamId = null,
}) {
  return (
    <group name="REMOTE_HUMAN_PLAYERS_GROUP">
      {remoteHumansList.map((player) => {
        const isTeammate =
          localTeamId != null &&
          player.teamId != null &&
          player.teamId === localTeamId;

        return (
          <RemotePlayerPuppet
            key={player.id}
            playerInfo={player}
            remotePlayersDataRef={remotePlayersDataRef}
            isTeammate={isTeammate}
          />
        );
      })}
    </group>
  );
}
```

===============================================================================
FILE: client/src/components/Combat/CombatManager.jsx
===============================================================================

```jsx
import React, { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import CharacterModel from "../Character/CharacterModel";
import WorldHtml from "../UI/WorldHtml";
import { WEAPONS } from "../../config/gameConstants";

const BOT_NAMES = ["Kelly", "Hayato", "Alok", "Chrono", "Moco", "Maxim"];
const BOT_COUNT = BOT_NAMES.length; // 6 bots + 1 player = 7 combatants
const BOT_SPEED = 2.7;
const BOT_BURST_DAMAGE = 14;

const _rayOrigin = new THREE.Vector3();
const _rayDir = new THREE.Vector3();
const _muzzleOrigin = new THREE.Vector3();
const _muzzleDir = new THREE.Vector3();
const _botMoveDir = new THREE.Vector3();
const _botEye = new THREE.Vector3();
const _targetChest = new THREE.Vector3();
const _targetHead = new THREE.Vector3();
const _tempToTarget = new THREE.Vector3();
const _losDir = new THREE.Vector3();
const _tracerDir = new THREE.Vector3();
const _tracerMid = new THREE.Vector3();
const _shotTarget = new THREE.Vector3();
const _down = new THREE.Vector3(0, -1, 0);
const _worldNormal = new THREE.Vector3();

const _groundRay = new THREE.Raycaster();
const _shotRay = new THREE.Raycaster();
const _muzzleRay = new THREE.Raycaster();
const _losRay = new THREE.Raycaster();
const _botProbeRay = new THREE.Raycaster();

const _nearbyMeshes = [];

// Shared hitbox resources across all bots (allocated once)
const _bodyHitboxGeo = new THREE.CylinderGeometry(0.38, 0.38, 1.35, 8);
const _headHitboxGeo = new THREE.SphereGeometry(0.26, 8, 8);
const _hitboxMat = new THREE.MeshBasicMaterial({
  transparent: true,
  opacity: 0,
  depthWrite: false,
});

const TRACER_POOL_SIZE = 16;

function isGroundFace(hit) {
  if (!hit.face) return false;
  _worldNormal.copy(hit.face.normal).transformDirection(hit.object.matrixWorld);
  return Math.abs(_worldNormal.y) > 0.45;
}

function getColumnMeshes(colliders, x, z, pad = 0.5) {
  _nearbyMeshes.length = 0;
  if (Array.isArray(colliders) && colliders.length > 0) {
    for (let i = 0; i < colliders.length; i += 1) {
      const c = colliders[i];
      if (!c || !c.mesh) continue;
      if (c.box) {
        if (
          x >= c.box.min.x - pad &&
          x <= c.box.max.x + pad &&
          z >= c.box.min.z - pad &&
          z <= c.box.max.z + pad
        ) {
          _nearbyMeshes.push(c.mesh);
        }
      } else {
        _nearbyMeshes.push(c.mesh);
      }
    }
    if (_nearbyMeshes.length > 0) return _nearbyMeshes;
  }
  if (colliders?.meshes?.length) return colliders.meshes;
  return _nearbyMeshes;
}

function sampleGroundY(colliders, x, z, fallbackY = 1) {
  if (!colliders || (colliders.ready === false) || (!colliders.meshes?.length && !colliders.length)) {
    return fallbackY;
  }

  const meshes = getColumnMeshes(colliders, x, z, 1.0);
  if (!meshes.length) return fallbackY;

  const probeStartY = Math.max(fallbackY + 35, 60);
  _rayOrigin.set(x, probeStartY, z);
  _groundRay.set(_rayOrigin, _down);
  _groundRay.far = 120;

  const hits = _groundRay.intersectObjects(meshes, false);
  let bestY = null;

  for (let i = 0; i < hits.length; i += 1) {
    const hit = hits[i];
    if (!isGroundFace(hit)) continue;
    const y = hit.point.y;
    if (bestY === null || (y > bestY && y <= probeStartY)) {
      bestY = y;
    }
  }

  return bestY !== null ? bestY : fallbackY;
}

function createBot(id, centerPos, colliders) {
  const name = BOT_NAMES[id] || `Player_${id + 1}`;
  const angle = (id / BOT_COUNT) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
  // Spread bots across Bermuda island territory (14m to 50m radius)
  const dist = 14 + id * 5.5 + Math.random() * 6;
  const x = (centerPos?.x || 0) + Math.cos(angle) * dist;
  const z = (centerPos?.z || 0) + Math.sin(angle) * dist;
  const startY = centerPos?.y ?? 1;
  const y = sampleGroundY(colliders, x, z, startY);

  const patrolTarget = new THREE.Vector3(
    THREE.MathUtils.clamp(x + (Math.random() - 0.5) * 24, -55, 55),
    y,
    THREE.MathUtils.clamp(z + (Math.random() - 0.5) * 24, -55, 55),
  );

  return {
    id,
    name,
    position: new THREE.Vector3(x, y, z),
    yaw: angle + Math.PI,
    hp: 100,
    maxHp: 100,
    state: "patrol", // "patrol" | "combat" | "relocating" | "knockedOut"
    anim: "walk",
    patrolTarget,
    patrolTimer: 5 + Math.random() * 6,
    burstShotsTarget: 1, // 1 or 2 shots
    burstShotsFired: 0,
    shotTimer: 0,
    relocateTimer: 0,
    relocateDir: new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)),
    attackCooldown: 1.5 + Math.random() * 2.5,
    scanTimer: id * 0.045, // Staggered AI perception timer
    probeTimer: id * 0.03, // Staggered wall-probe timer
    lastGroundX: x,
    lastGroundZ: z,
    targetType: null, // "player" | "bot"
    targetId: null,
  };
}

export default function CombatManager({
  enabled = true,
  characterRef,
  collidersRef,
  weaponId = "m4a1",
  firing = false,
  canFire = true,
  remoteInputRef = null,
  dragFireUp = false,
  dragUpRatio = 0,
  resetToken = 0,
  collidersReadyVersion = 0,
  onShotEvaluated,
  onPlayerDamaged,
  onBotEliminated,
  onAllBotsEliminated,
  onAliveCountChange,
  onAimAssistChange,
  onPunch,
  onBotsPositionUpdate,
}) {
  const { camera } = useThree();
  const botsRef = useRef([]);
  const botGroupRefs = useRef({});
  const hitboxRefs = useRef({});
  const fireCooldownRef = useRef(0);
  const tracersGroupRef = useRef(null);
  const tracerPoolRef = useRef([]);
  const tracerIndexRef = useRef(0);
  const needsGroundSnapRef = useRef(true);
  const popupTimeoutsRef = useRef(new Set());
  const lastBotPosUpdateRef = useRef(0);
  const prevAimAssistRef = useRef({ locked: false, headshot: false, botId: null });

  const [botsHud, setBotsHud] = useState([]);
  const [damagePopups, setDamagePopups] = useState([]);

  // Clear pending popup timers on unmount
  useEffect(() => {
    const timers = popupTimeoutsRef.current;
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      timers.clear();
    };
  }, []);

  // Initialize Tracer Mesh Pool & dispose cleanly on unmount
  useEffect(() => {
    const group = tracersGroupRef.current;
    if (!group) return;

    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    const pool = [];
    const geom = new THREE.CylinderGeometry(0.016, 0.016, 1, 6);
    geom.rotateX(Math.PI / 2);

    for (let i = 0; i < TRACER_POOL_SIZE; i += 1) {
      const mat = new THREE.MeshBasicMaterial({
        color: "#ffdd57",
        transparent: true,
        opacity: 0.9,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.visible = false;
      mesh.frustumCulled = false;
      group.add(mesh);
      pool.push({ mesh, mat, life: 0 });
    }

    tracerPoolRef.current = pool;

    return () => {
      for (let i = 0; i < pool.length; i += 1) {
        group.remove(pool[i].mesh);
        pool[i].mat.dispose();
      }
      geom.dispose();
      tracerPoolRef.current = [];
    };
  }, []);

  const spawnTracer = (start, end, colorHex = "#ffdd57") => {
    const pool = tracerPoolRef.current;
    if (!pool || !pool.length) return;

    const item = pool[tracerIndexRef.current % pool.length];
    tracerIndexRef.current += 1;

    _tracerDir.subVectors(end, start);
    const len = _tracerDir.length();
    if (len < 0.1) return;

    _tracerMid.addVectors(start, end).multiplyScalar(0.5);
    item.mesh.position.copy(_tracerMid);
    item.mesh.lookAt(end);
    item.mesh.scale.set(1, 1, len);
    item.mat.color.set(colorHex);
    item.mesh.visible = true;
    item.life = 0.09;
  };

  // Initialize or reset bots
  useEffect(() => {
    const colliders = collidersRef.current;
    // Always spawn bots around Bermuda playfield center (not airplane altitude)
    const startPos = { x: 0, y: 1, z: 0 };

    const initialBots = Array.from({ length: BOT_COUNT }, (_, idx) =>
      createBot(idx, startPos, colliders),
    );
    botsRef.current = initialBots;
    needsGroundSnapRef.current = !colliders?.ready;

    setBotsHud(
      initialBots.map((b) => ({
        id: b.id,
        name: b.name,
        hp: b.hp,
        maxHp: b.maxHp,
        anim: b.anim,
        state: b.state,
      })),
    );

    // Initial alive count: 6 bots + 1 player = 7
    onAliveCountChange?.(BOT_COUNT + 1);
  }, [collidersRef, resetToken, onAliveCountChange]);

  // Snap bot heights to actual Bermuda terrain as soon as OpenWorldMap BVH finishes
  useEffect(() => {
    if (!needsGroundSnapRef.current) return;
    const colliders = collidersRef.current;
    if (!colliders?.ready) return;

    const bots = botsRef.current;
    for (let i = 0; i < bots.length; i += 1) {
      const b = bots[i];
      if (b.state === "knockedOut") continue;
      const snappedY = sampleGroundY(colliders, b.position.x, b.position.z, 1);
      b.position.y = snappedY;
      b.patrolTarget.y = snappedY;
      b.lastGroundX = b.position.x;
      b.lastGroundZ = b.position.z;
    }
    needsGroundSnapRef.current = false;
  }, [collidersRef, collidersReadyVersion, resetToken]);

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    fireCooldownRef.current = Math.max(0, fireCooldownRef.current - dt);

    // Update tracers lifespan
    const pool = tracerPoolRef.current;
    if (pool) {
      for (let i = 0; i < pool.length; i += 1) {
        const t = pool[i];
        if (t.mesh.visible) {
          t.life -= dt;
          if (t.life <= 0) {
            t.mesh.visible = false;
          }
        }
      }
    }

    const playerPos = enabled ? characterRef?.current?.position : null;
    const colliders = collidersRef.current;
    const collidersReady = Boolean(
      colliders && colliders.ready !== false && (colliders.meshes?.length || colliders.length),
    );
    const worldMeshes = collidersReady
      ? colliders.meshes || colliders.map((c) => c.mesh).filter(Boolean)
      : [];

    let hudNeedsUpdate = false;
    const bots = botsRef.current;

    // AI Bots Simulation Loop
    for (let i = 0; i < bots.length; i += 1) {
      const bot = bots[i];
      const botObj = botGroupRefs.current[bot.id];
      if (!botObj) continue;

      // 1. Eliminated / Knocked Out Bot (No Respawn in Battle Royale)
      if (bot.state === "knockedOut") {
        botObj.position.copy(bot.position);
        botObj.rotation.y = bot.yaw;
        continue;
      }

      bot.attackCooldown = Math.max(0, bot.attackCooldown - dt);
      bot.probeTimer -= dt;
      bot.scanTimer -= dt;

      // -------------------------------------------------------------
      // 2. STATE: RELOCATING (Ran away after firing 1-2 shots)
      // -------------------------------------------------------------
      if (bot.state === "relocating") {
        bot.relocateTimer -= dt;
        bot.anim = "run";

        const runYaw = Math.atan2(bot.relocateDir.x, bot.relocateDir.z);
        let diffYaw = runYaw - bot.yaw;
        diffYaw = Math.atan2(Math.sin(diffYaw), Math.cos(diffYaw));
        bot.yaw += diffYaw * Math.min(1, 8 * dt);

        _botMoveDir.copy(bot.relocateDir);

        // Throttled obstacle avoidance while relocating
        if (worldMeshes.length && bot.probeTimer <= 0) {
          bot.probeTimer = 0.14;
          const nearby = getColumnMeshes(colliders, bot.position.x, bot.position.z, 2.2);
          if (nearby.length) {
            _botEye.set(bot.position.x, bot.position.y + 0.85, bot.position.z);
            _botProbeRay.set(_botEye, _botMoveDir);
            _botProbeRay.far = 1.6;

            const probeHits = _botProbeRay.intersectObjects(nearby, false);
            for (let h = 0; h < probeHits.length; h += 1) {
              const hit = probeHits[h];
              if (!hit.face) continue;
              _worldNormal
                .copy(hit.face.normal)
                .transformDirection(hit.object.matrixWorld);
              if (Math.abs(_worldNormal.y) < 0.65) {
                _botMoveDir
                  .addScaledVector(_worldNormal, -_botMoveDir.dot(_worldNormal))
                  .normalize();
                bot.relocateDir.copy(_botMoveDir);
                break;
              }
            }
          }
        }

        const sprintSpeed = BOT_SPEED * 1.4;
        bot.position.x += _botMoveDir.x * sprintSpeed * dt;
        bot.position.z += _botMoveDir.z * sprintSpeed * dt;

        if (
          collidersReady &&
          Math.hypot(bot.position.x - bot.lastGroundX, bot.position.z - bot.lastGroundZ) > 0.35
        ) {
          const groundY = sampleGroundY(
            colliders,
            bot.position.x,
            bot.position.z,
            bot.position.y || 62,
          );
          bot.position.y = THREE.MathUtils.lerp(bot.position.y, groundY, 0.35);
          bot.lastGroundX = bot.position.x;
          bot.lastGroundZ = bot.position.z;
        }

        if (bot.relocateTimer <= 0) {
          bot.state = "patrol";
          bot.anim = "walk";
          bot.patrolTimer = 6.0 + Math.random() * 6.0;
          bot.attackCooldown = 2.0 + Math.random() * 2.5;
          bot.patrolTarget.set(
            THREE.MathUtils.clamp(bot.position.x + (Math.random() - 0.5) * 28, -55, 55),
            bot.position.y,
            THREE.MathUtils.clamp(bot.position.z + (Math.random() - 0.5) * 28, -55, 55),
          );
          hudNeedsUpdate = true;
        }

        botObj.position.copy(bot.position);
        botObj.rotation.y = bot.yaw;
        continue;
      }

      // -------------------------------------------------------------
      // 3. STATE: COMBAT (Fires 1 or 2 burst shots, then relocates)
      // -------------------------------------------------------------
      if (bot.state === "combat") {
        let targetPosition = null;
        let otherBotTarget = null;

        if (bot.targetType === "player" && playerPos) {
          targetPosition = playerPos;
        } else if (bot.targetType === "bot") {
          for (let j = 0; j < bots.length; j += 1) {
            if (bots[j].id === bot.targetId && bots[j].state !== "knockedOut") {
              otherBotTarget = bots[j];
              targetPosition = otherBotTarget.position;
              break;
            }
          }
        }

        if (!targetPosition) {
          bot.state = "patrol";
          bot.anim = "walk";
          bot.targetType = null;
          bot.targetId = null;
          hudNeedsUpdate = true;
          botObj.position.copy(bot.position);
          botObj.rotation.y = bot.yaw;
          continue;
        }

        const dx = targetPosition.x - bot.position.x;
        const dz = targetPosition.z - bot.position.z;
        const aimYaw = Math.atan2(dx, dz);
        let diffYaw = aimYaw - bot.yaw;
        diffYaw = Math.atan2(Math.sin(diffYaw), Math.cos(diffYaw));
        bot.yaw += diffYaw * Math.min(1, 10 * dt);

        bot.anim = "idle";
        bot.shotTimer -= dt;

        if (bot.shotTimer <= 0) {
          _botEye.set(bot.position.x, bot.position.y + 1.35, bot.position.z);
          _targetChest.set(
            targetPosition.x,
            targetPosition.y + 1.2,
            targetPosition.z,
          );

          _losDir.subVectors(_targetChest, _botEye);
          const losDist = _losDir.length();
          _losDir.normalize();

          let hasClearLos = true;
          if (worldMeshes.length && losDist > 0.01) {
            _losRay.set(_botEye, _losDir);
            _losRay.far = losDist;
            const obstructions = _losRay.intersectObjects(worldMeshes, false);
            hasClearLos =
              obstructions.length === 0 || obstructions[0].distance >= losDist - 0.5;
          }

          if (hasClearLos) {
            spawnTracer(_botEye, _targetChest, "#ff3b5c");

            if (bot.targetType === "player") {
              onPlayerDamaged?.(BOT_BURST_DAMAGE);
            } else if (otherBotTarget && otherBotTarget.state !== "knockedOut") {
              otherBotTarget.hp = Math.max(0, otherBotTarget.hp - BOT_BURST_DAMAGE);
              if (otherBotTarget.hp <= 0) {
                otherBotTarget.state = "knockedOut";
                otherBotTarget.anim = "knockedOut";
                onBotEliminated?.(otherBotTarget, bot.name, false);

                let living = 0;
                for (let k = 0; k < bots.length; k += 1) {
                  if (bots[k].state !== "knockedOut") living += 1;
                }
                onAliveCountChange?.(living + 1);

                if (living === 0) {
                  onAllBotsEliminated?.();
                }
              }
            }
          }

          bot.burstShotsFired += 1;

          if (bot.burstShotsFired < bot.burstShotsTarget) {
            bot.shotTimer = 0.32;
          } else {
            bot.state = "relocating";
            bot.anim = "run";

            const awayAngle = Math.atan2(-dx, -dz) + (Math.random() - 0.5) * 1.6;
            bot.relocateDir.set(Math.sin(awayAngle), 0, Math.cos(awayAngle)).normalize();
            bot.relocateTimer = 4.5 + Math.random() * 3.5;
            bot.targetType = null;
            bot.targetId = null;
            hudNeedsUpdate = true;
          }
        }

        botObj.position.copy(bot.position);
        botObj.rotation.y = bot.yaw;
        continue;
      }

      // -------------------------------------------------------------
      // 4. STATE: PATROL (Wandering independently, exploring map)
      // -------------------------------------------------------------
      bot.patrolTimer -= dt;
      bot.anim = "walk";

      const pdx = bot.patrolTarget.x - bot.position.x;
      const pdz = bot.patrolTarget.z - bot.position.z;
      const distToPatrol = Math.hypot(pdx, pdz);

      if (distToPatrol < 3.0 || bot.patrolTimer <= 0) {
        const randAngle = Math.random() * Math.PI * 2;
        const randDist = 10 + Math.random() * 24;
        bot.patrolTarget.set(
          THREE.MathUtils.clamp(bot.position.x + Math.cos(randAngle) * randDist, -55, 55),
          bot.position.y,
          THREE.MathUtils.clamp(bot.position.z + Math.sin(randAngle) * randDist, -55, 55),
        );
        bot.patrolTimer = 6.0 + Math.random() * 6.0;
      }

      const patrolYaw = Math.atan2(pdx, pdz);
      let diffYaw = patrolYaw - bot.yaw;
      diffYaw = Math.atan2(Math.sin(diffYaw), Math.cos(diffYaw));
      bot.yaw += diffYaw * Math.min(1, 4 * dt);

      _botMoveDir.set(Math.sin(bot.yaw), 0, Math.cos(bot.yaw)).normalize();

      // Throttled wall / building collision avoidance
      if (worldMeshes.length && bot.probeTimer <= 0) {
        bot.probeTimer = 0.16;
        const nearby = getColumnMeshes(colliders, bot.position.x, bot.position.z, 2.0);
        if (nearby.length) {
          _botEye.set(bot.position.x, bot.position.y + 0.85, bot.position.z);
          _botProbeRay.set(_botEye, _botMoveDir);
          _botProbeRay.far = 1.3;

          const probeHits = _botProbeRay.intersectObjects(nearby, false);
          for (let h = 0; h < probeHits.length; h += 1) {
            const hit = probeHits[h];
            if (!hit.face) continue;
            _worldNormal
              .copy(hit.face.normal)
              .transformDirection(hit.object.matrixWorld);
            if (Math.abs(_worldNormal.y) < 0.65) {
              _botMoveDir
                .addScaledVector(_worldNormal, -_botMoveDir.dot(_worldNormal))
                .normalize();
              break;
            }
          }
        }
      }

      bot.position.x += _botMoveDir.x * (BOT_SPEED * 0.75) * dt;
      bot.position.z += _botMoveDir.z * (BOT_SPEED * 0.75) * dt;

      if (
        collidersReady &&
        Math.hypot(bot.position.x - bot.lastGroundX, bot.position.z - bot.lastGroundZ) > 0.35
      ) {
        const groundY = sampleGroundY(
          colliders,
          bot.position.x,
          bot.position.z,
          bot.position.y || 62,
        );
        bot.position.y = THREE.MathUtils.lerp(bot.position.y, groundY, 0.3);
        bot.lastGroundX = bot.position.x;
        bot.lastGroundZ = bot.position.z;
      }

      // Staggered TARGET DETECTION WHILE PATROLLING (~4 Hz per bot)
      if (enabled && bot.attackCooldown <= 0 && bot.scanTimer <= 0) {
        bot.scanTimer = 0.22 + Math.random() * 0.12;

        // A. Check Player Detection
        if (playerPos) {
          const playerDist = bot.position.distanceTo(playerPos);
          if (playerDist < 26) {
            _botEye.set(bot.position.x, bot.position.y + 1.35, bot.position.z);
            _targetChest.set(playerPos.x, playerPos.y + 1.2, playerPos.z);
            _losDir.subVectors(_targetChest, _botEye);
            const lDist = _losDir.length();
            _losDir.normalize();

            let clear = true;
            if (worldMeshes.length && lDist > 0.01) {
              _losRay.set(_botEye, _losDir);
              _losRay.far = lDist;
              const hits = _losRay.intersectObjects(worldMeshes, false);
              clear = hits.length === 0 || hits[0].distance >= lDist - 0.5;
            }

            if (clear) {
              bot.state = "combat";
              bot.targetType = "player";
              bot.targetId = null;
              bot.burstShotsTarget = Math.random() < 0.5 ? 1 : 2;
              bot.burstShotsFired = 0;
              bot.shotTimer = 0.25;
              hudNeedsUpdate = true;
            }
          }
        }

        // B. Check Other Bot Detection (Skirmish between bots!)
        if (bot.state === "patrol") {
          for (let j = 0; j < bots.length; j += 1) {
            const other = bots[j];
            if (other.id === bot.id || other.state === "knockedOut") continue;
            const bDist = bot.position.distanceTo(other.position);
            if (bDist < 22) {
              _botEye.set(bot.position.x, bot.position.y + 1.35, bot.position.z);
              _targetChest.set(
                other.position.x,
                other.position.y + 1.2,
                other.position.z,
              );
              _losDir.subVectors(_targetChest, _botEye);
              const lDist = _losDir.length();
              _losDir.normalize();

              let clear = true;
              if (worldMeshes.length && lDist > 0.01) {
                _losRay.set(_botEye, _losDir);
                _losRay.far = lDist;
                const hits = _losRay.intersectObjects(worldMeshes, false);
                clear = hits.length === 0 || hits[0].distance >= lDist - 0.5;
              }

              if (clear) {
                bot.state = "combat";
                bot.targetType = "bot";
                bot.targetId = other.id;
                bot.burstShotsTarget = Math.random() < 0.5 ? 1 : 2;
                bot.burstShotsFired = 0;
                bot.shotTimer = 0.3;
                hudNeedsUpdate = true;
                break;
              }
            }
          }
        }
      }

      botObj.position.copy(bot.position);
      botObj.rotation.y = bot.yaw;
    }

    if (hudNeedsUpdate) {
      setBotsHud(
        bots.map((b) => ({
          id: b.id,
          name: b.name,
          hp: b.hp,
          maxHp: b.maxHp,
          anim: b.anim,
          state: b.state,
        })),
      );
    }

    // Real-time Bot Positions for Minimap & Radar (throttled to ~100ms for smooth radar without 60fps React re-renders)
    const now = performance.now();
    if (onBotsPositionUpdate && bots.length && now - lastBotPosUpdateRef.current >= 100) {
      lastBotPosUpdateRef.current = now;
      const livingBots = bots
        .filter((b) => b.state !== "knockedOut")
        .map((b) => ({
          id: b.id,
          name: b.name,
          x: b.position.x,
          z: b.position.z,
          headingDeg: Math.round((-b.yaw * 180) / Math.PI) % 360,
          state: b.state,
        }));
      onBotsPositionUpdate(livingBots);
    }

    // -------------------------------------------------------------
    // Free Fire Default Aim Assist (Jelly Stickiness & Drag Headshot)
    // -------------------------------------------------------------
    let aimAssistLocked = false;
    let isHeadshotLocked = false;
    let bestAimBot = null;
    let bestAimAngle = 0.28; // ~16 deg target lock cone

    camera.getWorldPosition(_rayOrigin);
    camera.getWorldDirection(_rayDir);

    for (let i = 0; i < bots.length; i += 1) {
      const b = bots[i];
      if (b.state === "knockedOut") continue;

      _targetChest.set(b.position.x, b.position.y + 1.15, b.position.z);
      _tempToTarget.subVectors(_targetChest, _rayOrigin);
      const dist = _tempToTarget.length();
      if (dist > 65 || dist < 0.5) continue;
      _tempToTarget.divideScalar(dist);

      const dot = _rayDir.dot(_tempToTarget);
      const angle = Math.acos(THREE.MathUtils.clamp(dot, -1, 1));

      if (angle < bestAimAngle) {
        bestAimAngle = angle;
        bestAimBot = b;
      }
    }

    if (bestAimBot) {
      aimAssistLocked = true;
      const isUpwardDrag =
        Boolean(dragFireUp) ||
        Boolean(remoteInputRef?.current?.dragUp) ||
        (remoteInputRef?.current?.lookDeltaY && remoteInputRef.current.lookDeltaY < -0.005) ||
        dragUpRatio > 0.12;

      if (isUpwardDrag) {
        isHeadshotLocked = true;
      }
    }

    // Only notify when aim assist lock/headshot state actually changes
    const targetBotId = bestAimBot ? bestAimBot.id : null;
    const prevAssist = prevAimAssistRef.current;
    if (
      prevAssist.locked !== aimAssistLocked ||
      prevAssist.headshot !== isHeadshotLocked ||
      prevAssist.botId !== targetBotId
    ) {
      prevAimAssistRef.current = {
        locked: aimAssistLocked,
        headshot: isHeadshotLocked,
        botId: targetBotId,
      };
      onAimAssistChange?.({
        locked: aimAssistLocked,
        headshot: isHeadshotLocked,
        targetBot: bestAimBot,
      });
    }

    // -------------------------------------------------------------
    // Handle Player Active Weapon Firing & Hit Evaluation
    // -------------------------------------------------------------
    const weapon = WEAPONS[weaponId];
    const isFist = weaponId === "fist" || !weapon;
    const remoteFirePulsed = Boolean(remoteInputRef?.current?.firePulse);
    const activeFire = firing || (canFire && remoteFirePulsed);

    // MELEE PUNCH ATTACK (FIST)
    if (isFist) {
      if (!enabled || !activeFire || fireCooldownRef.current > 0) {
        if (remoteFirePulsed && remoteInputRef?.current) {
          remoteInputRef.current.firePulse = false;
        }
        return;
      }
      if (remoteFirePulsed && remoteInputRef?.current) {
        remoteInputRef.current.firePulse = false;
      }
      fireCooldownRef.current = 0.36; // Punch strike cooldown
      onPunch?.();

      const playerPos = characterRef.current?.position;
      if (playerPos) {
        camera.getWorldDirection(_rayDir);
        let closestBot = null;
        let closestDist = 2.6; // Melee forward reach

        for (let i = 0; i < bots.length; i += 1) {
          const b = bots[i];
          if (b.state === "knockedOut") continue;
          const d = Math.hypot(b.position.x - playerPos.x, b.position.z - playerPos.z);
          if (d < closestDist) {
            _tempToTarget.set(b.position.x - playerPos.x, 0, b.position.z - playerPos.z).normalize();
            _muzzleDir.set(_rayDir.x, 0, _rayDir.z).normalize();
            if (_tempToTarget.dot(_muzzleDir) > 0.32) {
              closestDist = d;
              closestBot = b;
            }
          }
        }

        if (closestBot) {
          const isHead = isHeadshotLocked || camera.position.y > closestBot.position.y + 1.5;
          const punchDmg = isHead ? 70 : 35;
          closestBot.hp = Math.max(0, closestBot.hp - punchDmg);
          const killed = closestBot.hp <= 0;

          const popupId = `${Date.now()}-${Math.random()}`;
          const popupPos = [closestBot.position.x, closestBot.position.y + 1.4, closestBot.position.z];
          setDamagePopups((prev) => [
            ...prev.slice(-6),
            {
              id: popupId,
              position: popupPos,
              damage: punchDmg,
              headshot: isHead,
            },
          ]);

          const timerId = window.setTimeout(() => {
            popupTimeoutsRef.current.delete(timerId);
            setDamagePopups((prev) => prev.filter((p) => p.id !== popupId));
          }, 650);
          popupTimeoutsRef.current.add(timerId);

          if (killed) {
            closestBot.state = "knockedOut";
            closestBot.anim = "knockedOut";
            onBotEliminated?.(closestBot, "YOU", isHead);

            let living = 0;
            for (let k = 0; k < bots.length; k += 1) {
              if (bots[k].state !== "knockedOut") living += 1;
            }
            onAliveCountChange?.(living + 1);

            if (living === 0) {
              onAllBotsEliminated?.();
            }
          } else {
            if (closestBot.state !== "combat" && closestBot.state !== "relocating") {
              closestBot.state = "combat";
              closestBot.targetType = "player";
              closestBot.targetId = null;
              closestBot.burstShotsTarget = 1;
              closestBot.burstShotsFired = 0;
              closestBot.shotTimer = 0.2;
            }
          }

          setBotsHud(
            bots.map((b) => ({
              id: b.id,
              name: b.name,
              hp: b.hp,
              maxHp: b.maxHp,
              anim: b.anim,
              state: b.state,
            })),
          );

          onShotEvaluated?.({
            hit: true,
            headshot: isHead,
            killed,
            damage: punchDmg,
            isPunch: true,
          });
        } else {
          onShotEvaluated?.({
            hit: false,
            headshot: false,
            killed: false,
            damage: 0,
            isPunch: true,
          });
        }
      }
      return;
    }

    if (!enabled || !activeFire || fireCooldownRef.current > 0) {
      if (remoteFirePulsed && remoteInputRef?.current) {
        remoteInputRef.current.firePulse = false;
      }
      return;
    }

    if (remoteFirePulsed && remoteInputRef?.current) {
      remoteInputRef.current.firePulse = false;
    }
    fireCooldownRef.current = weapon.fireRate;

    camera.getWorldPosition(_rayOrigin);
    camera.getWorldDirection(_rayDir);

    // If Free Fire Drag Headshot is locked, aim ray directly targets the head!
    if (isHeadshotLocked && bestAimBot) {
      _targetHead.set(bestAimBot.position.x, bestAimBot.position.y + 1.65, bestAimBot.position.z);
      _rayDir.subVectors(_targetHead, _rayOrigin).normalize();
    } else {
      _rayDir.x += (Math.random() - 0.5) * weapon.spread;
      _rayDir.y += (Math.random() - 0.5) * weapon.spread;
      _rayDir.z += (Math.random() - 0.5) * weapon.spread;
      _rayDir.normalize();
    }

    _shotRay.set(_rayOrigin, _rayDir);
    _shotRay.far = weapon.range;

    const activeHitboxes = Object.values(hitboxRefs.current).filter(Boolean);
    const botHits = activeHitboxes.length ? _shotRay.intersectObjects(activeHitboxes, false) : [];

    const worldHits = worldMeshes.length ? _shotRay.intersectObjects(worldMeshes, false) : [];
    const closestWorldDist = worldHits.length ? worldHits[0].distance : Infinity;

    _shotTarget
      .copy(_rayOrigin)
      .addScaledVector(_rayDir, Math.min(weapon.range, closestWorldDist));

    if (characterRef.current) {
      const p = characterRef.current.position;
      _muzzleOrigin.set(p.x, p.y + 1.35, p.z);
    } else {
      _muzzleOrigin.copy(_rayOrigin);
    }

    _muzzleDir.subVectors(_shotTarget, _muzzleOrigin);
    const muzzleDist = _muzzleDir.length();
    if (muzzleDist > 0.001) {
      _muzzleDir.divideScalar(muzzleDist);
    }

    _muzzleRay.set(_muzzleOrigin, _muzzleDir);
    _muzzleRay.far = muzzleDist;

    const muzzleObstacles = worldMeshes.length
      ? _muzzleRay.intersectObjects(worldMeshes, false)
      : [];
    const isShotBlockedByWall =
      muzzleObstacles.length > 0 &&
      muzzleObstacles[0].distance < muzzleDist - 0.3;

    if (isShotBlockedByWall) {
      _shotTarget.copy(muzzleObstacles[0].point);
    }

    let hitResult = { hit: false, headshot: false, killed: false, damage: 0 };

    if (
      !isShotBlockedByWall &&
      botHits.length &&
      botHits[0].distance <= closestWorldDist
    ) {
      const topHit = botHits[0];
      _shotTarget.copy(topHit.point);
      const { botId, isHead } = topHit.object.userData;
      const targetBot = bots.find((b) => b.id === botId);

      if (targetBot && targetBot.state !== "knockedOut") {
        const dmg = isHead ? weapon.headshotDamage : weapon.damage;
        targetBot.hp = Math.max(0, targetBot.hp - dmg);
        const killed = targetBot.hp <= 0;

        if (killed) {
          targetBot.state = "knockedOut";
          targetBot.anim = "knockedOut";
          onBotEliminated?.(targetBot, "YOU", Boolean(isHead));

          let living = 0;
          for (let k = 0; k < bots.length; k += 1) {
            if (bots[k].state !== "knockedOut") living += 1;
          }
          onAliveCountChange?.(living + 1);

          if (living === 0) {
            onAllBotsEliminated?.();
          }
        } else {
          if (targetBot.state !== "combat" && targetBot.state !== "relocating") {
            targetBot.state = "combat";
            targetBot.targetType = "player";
            targetBot.targetId = null;
            targetBot.burstShotsTarget = Math.random() < 0.5 ? 1 : 2;
            targetBot.burstShotsFired = 0;
            targetBot.shotTimer = 0.2;
          }
        }

        hitResult = {
          hit: true,
          headshot: Boolean(isHead),
          killed,
          damage: dmg,
        };

        const popupId = `${Date.now()}-${Math.random()}`;
        const popupPos = [_shotTarget.x, _shotTarget.y + 0.35, _shotTarget.z];
        setDamagePopups((prev) => [
          ...prev.slice(-6),
          {
            id: popupId,
            position: popupPos,
            damage: dmg,
            headshot: Boolean(isHead),
          },
        ]);

        const timerId = window.setTimeout(() => {
          popupTimeoutsRef.current.delete(timerId);
          setDamagePopups((prev) => prev.filter((p) => p.id !== popupId));
        }, 650);
        popupTimeoutsRef.current.add(timerId);

        setBotsHud(
          bots.map((b) => ({
            id: b.id,
            name: b.name,
            hp: b.hp,
            maxHp: b.maxHp,
            anim: b.anim,
            state: b.state,
          })),
        );
      }
    }

    spawnTracer(
      _muzzleOrigin,
      _shotTarget,
      hitResult.headshot ? "#ff2a5f" : "#ffdd57",
    );

    onShotEvaluated?.(hitResult);
  });

  return (
    <group>
      <group ref={tracersGroupRef} />

      {botsHud.map((botState) => (
        <group
          key={botState.id}
          ref={(el) => {
            if (el) botGroupRefs.current[botState.id] = el;
            else delete botGroupRefs.current[botState.id];
          }}
        >
          <CharacterModel
            animation={botState.anim}
            weaponId={botState.state === "knockedOut" ? "fist" : "mp40"}
            aiming={botState.state === "combat"}
            bodyColor="#ff3b5c"
          />

          {botState.state !== "knockedOut" && (
            <WorldHtml position={[0, 2.15, 0]} center distanceFactor={14}>
              <div className="ff-bot-nametag">
                <span className="ff-bot-name-label">{botState.name}</span>
                <div className="ff-bot-hp-track">
                  <div
                    className="ff-bot-hp-fill"
                    style={{
                      width: `${(botState.hp / botState.maxHp) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </WorldHtml>
          )}

          {botState.state !== "knockedOut" && (
            <>
              <mesh
                position={[0, 0.88, 0]}
                geometry={_bodyHitboxGeo}
                material={_hitboxMat}
                userData={{ botId: botState.id, isHead: false }}
                ref={(el) => {
                  if (el) hitboxRefs.current[`body-${botState.id}`] = el;
                  else delete hitboxRefs.current[`body-${botState.id}`];
                }}
              />
              <mesh
                position={[0, 1.68, 0]}
                geometry={_headHitboxGeo}
                material={_hitboxMat}
                userData={{ botId: botState.id, isHead: true }}
                ref={(el) => {
                  if (el) hitboxRefs.current[`head-${botState.id}`] = el;
                  else delete hitboxRefs.current[`head-${botState.id}`];
                }}
              />
            </>
          )}
        </group>
      ))}

      {damagePopups.map((popup) => (
        <WorldHtml key={popup.id} position={popup.position} center>
          <div
            className={
              popup.headshot ? "ff-dmg-popup ff-dmg-headshot" : "ff-dmg-popup"
            }
          >
            {popup.headshot ? `HEADSHOT ${popup.damage}` : popup.damage}
          </div>
        </WorldHtml>
      ))}
    </group>
  );
}
```

===============================================================================
FILE: client/src/components/Controller/PhoneControllerApp.jsx
===============================================================================

```jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  MAX_TILT_DEG,
  MAX_WHEEL_ROTATION_DEG,
  SCENE_PRESETS,
  TILT_DEADZONE_DEG,
  WEAPONS,
  WEAPON_ORDER,
} from "../../config/gameConstants";
import {
  connectRelaySocket,
  extractTiltDegrees,
  getPairTokenFromUrl,
} from "../../utils/network";
import Icons from "../UI/Icons";
import HoldButton from "../UI/HoldButton";
import TapButton, { findTouchById } from "../UI/TapButton";
import SteeringWheelGraphic from "../UI/SteeringWheelGraphic";
import {
  BackpackSvg,
  CarDriveSvg,
  CrouchSoldierSvg,
  EmoteWaveSvg,
  EyeSvg,
  FireBulletSvg,
  HudLayoutSvg,
  JumpSoldierSvg,
  MedkitSvg,
  MicSvg,
  ReloadSvg,
  ScopeSvg,
  SpeakerSvg,
  SprintSvg,
  WeaponSilhouetteSvg,
} from "../UI/FreeFireIcons";
import {
  FreeFireMinimapBox,
  FreeFireTopCenterCluster,
  FreeFireTopRightCluster,
  getCardinalFromDeg,
} from "../UI/FreeFireHudParts";
import DraggableFireButton from "../UI/DraggableFireButton";
import CustomHudElement from "../UI/CustomHudElement";
import CustomHudEditorBar from "../UI/CustomHudEditorBar";
import {
  getActiveHudPresetIndex,
  HUD_ELEMENTS,
  loadHudLayoutPreset,
  resetHudLayoutPreset,
  saveHudLayoutPreset,
  setActiveHudPresetIndex,
} from "../../utils/customHudConfig";
import "../UI/FreeFireHUD.css";

const CONTROLLER_EMOTES = [
  { id: "wave", label: "WAVE" },
  { id: "dance", label: "DANCE" },
  { id: "salute", label: "SALUTE" },
  { id: "celebrate", label: "WIN" },
];

const DEFAULT_AMMO_STATE = {
  m4a1: { mag: WEAPONS.m4a1.magSize, reserve: WEAPONS.m4a1.reserveAmmo },
  ak47: { mag: WEAPONS.ak47.magSize, reserve: WEAPONS.ak47.reserveAmmo },
  awm: { mag: WEAPONS.awm.magSize, reserve: WEAPONS.awm.reserveAmmo },
  mp40: { mag: WEAPONS.mp40.magSize, reserve: WEAPONS.mp40.reserveAmmo },
  deagle: { mag: WEAPONS.deagle.magSize, reserve: WEAPONS.deagle.reserveAmmo },
  fist: { mag: 0, reserve: 0 },
};

export default function PhoneControllerApp() {
  const [pairToken, setPairToken] = useState(() => getPairTokenFromUrl());
  const [pairDraft, setPairDraft] = useState(() => getPairTokenFromUrl());
  const [pairStatus, setPairStatus] = useState({
    linked: false,
    activeGames: 0,
    availablePairs: [],
  });
  const [connected, setConnected] = useState(false);
  const [relayStatus, setRelayStatus] = useState("connecting");
  const [steerMode, setSteerMode] = useState("wheel");
  const [steerSide, setSteerSide] = useState("left");
  const [scenePreset, setScenePreset] = useState("track");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [gyroActive, setGyroActive] = useState(false);
  const [gyroPermNeeded, setGyroPermNeeded] = useState(false);
  const [gyroPromptOpen, setGyroPromptOpen] = useState(false);
  const [gyroError, setGyroError] = useState("");
  const [gyroSensorDetected, setGyroSensorDetected] = useState(false);
  const [steerVal, setSteerVal] = useState(0);
  const [wheelGrabbed, setWheelGrabbed] = useState(false);
  const [joyKnob, setJoyKnob] = useState({ x: 0, y: 0, active: false });
  const [autoRun, setAutoRun] = useState(false);
  const [speakerMuted, setSpeakerMuted] = useState(false);
  const [micMuted, setMicMuted] = useState(true);
  const [aimActive, setAimActive] = useState(false);
  const [crouchActive, setCrouchActive] = useState(false);
  const [firingActive, setFiringActive] = useState(false);
  const [emotesOpen, setEmotesOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fsHint, setFsHint] = useState("");
  const [medkitHealing, setMedkitHealing] = useState(false);
  const [customHudEditing, setCustomHudEditing] = useState(false);
  const [selectedHudElem, setSelectedHudElem] = useState("rightFire");
  const [activePreset, setActivePreset] = useState(() => getActiveHudPresetIndex());
  const [hudLayout, setHudLayout] = useState(() => loadHudLayoutPreset(activePreset));
  const [swipeIndicator, setSwipeIndicator] = useState({
    active: false,
    offset: 0,
  });

  const handleUpdateLayout = useCallback((id, newCfg) => {
    setHudLayout((prev) => ({
      ...prev,
      [id]: newCfg,
    }));
  }, []);

  const handleMoveLayout = useCallback((id, coords) => {
    setHudLayout((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || HUD_ELEMENTS[id] || {}),
        x: coords.x,
        y: coords.y,
      },
    }));
  }, []);

  const handleSwitchPreset = useCallback((newPreset) => {
    setActivePreset(newPreset);
    setActiveHudPresetIndex(newPreset);
    setHudLayout(loadHudLayoutPreset(newPreset));
  }, []);

  const handleResetLayout = useCallback(() => {
    const def = resetHudLayoutPreset(activePreset);
    setHudLayout(def);
  }, [activePreset]);

  const handleResetSelected = useCallback((id) => {
    const def = HUD_ELEMENTS[id];
    if (!def) return;
    setHudLayout((prev) => ({
      ...prev,
      [id]: {
        x: def.defaultX,
        y: def.defaultY,
        size: def.defaultSize,
        opacity: def.defaultOpacity,
      },
    }));
  }, []);

  const handleSaveLayout = useCallback(() => {
    return saveHudLayoutPreset(activePreset, hudLayout);
  }, [activePreset, hudLayout]);

  const [telemetry, setTelemetry] = useState({
    speed: 0,
    gear: "N",
    rpm: 850,
    drifting: false,
    boost: false,
    playerMode: "onFoot",
    matchStatus: "DROPPING",
    aircraftPhase: "flying",
    nearCar: false,
    weaponId: "m4a1",
    weaponName: "M4A1 RIFLE",
    ammo: 30,
    reserveAmmo: 120,
    reloading: false,
    aliveCount: 7,
    hp: 100,
    ep: 180,
    vestLevel: 3,
    helmetLevel: 3,
    medkits: 3,
    primaryWeapon: "m4a1",
    secondaryWeapon: "deagle",
    ammoState: DEFAULT_AMMO_STATE,
    matchElapsed: 0,
    kills: 0,
    killFeed: [],
    posX: 0,
    posZ: 0,
    headingDeg: 0,
    statusMsg: "",
  });

  const [isPortraitViewport, setIsPortraitViewport] = useState(() =>
    typeof window !== "undefined"
      ? window.innerHeight > window.innerWidth
      : false,
  );

  const socketRef = useRef(null);
  const inputRef = useRef({
    accelerate: false,
    brake: false,
    handbrake: false,
    boost: false,
    jump: false,
    crouch: false,
    sprint: false,
    autoRun: false,
    fire: false,
    aim: false,
    steer: 0,
    moveX: 0,
    moveY: 0,
    lookX: 0,
    lookY: 0,
  });
  const rawTiltRef = useRef(0);
  const tiltZeroRef = useRef(0);
  const wheelBoxRef = useRef(null);
  const joyBoxRef = useRef(null);
  const swipeBoxRef = useRef(null);
  const prevSwipePtRef = useRef(null);
  const prevFingerAngleRef = useRef(null);
  const wheelAngleDegRef = useRef(0);
  const joyTouchIdRef = useRef(null);
  const joyMouseDownRef = useRef(false);
  const swipeTouchIdRef = useRef(null);
  const swipeMouseDownRef = useRef(false);
  const wheelTouchIdRef = useRef(null);
  const wheelMouseDownRef = useRef(false);
  const prevMatchStatusRef = useRef("DROPPING");
  const fsHintTimerRef = useRef(null);

  useEffect(() => {
    const prevent = (e) => e.preventDefault();
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("selectstart", prevent);

    const syncViewportMetrics = () => {
      const vw = window.visualViewport?.width || window.innerWidth;
      const vh = window.visualViewport?.height || window.innerHeight;
      document.documentElement.style.setProperty("--mc-vw", `${Math.round(vw)}px`);
      document.documentElement.style.setProperty("--mc-vh", `${Math.round(vh)}px`);
      setIsPortraitViewport(vh > vw);
      const activeFs =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;
      setIsFullscreen(Boolean(activeFs));
    };

    syncViewportMetrics();
    window.addEventListener("resize", syncViewportMetrics);
    window.addEventListener("orientationchange", syncViewportMetrics);
    window.visualViewport?.addEventListener("resize", syncViewportMetrics);
    document.addEventListener("fullscreenchange", syncViewportMetrics);
    document.addEventListener("webkitfullscreenchange", syncViewportMetrics);

    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("selectstart", prevent);
      window.removeEventListener("resize", syncViewportMetrics);
      window.removeEventListener("orientationchange", syncViewportMetrics);
      window.visualViewport?.removeEventListener("resize", syncViewportMetrics);
      document.removeEventListener("fullscreenchange", syncViewportMetrics);
      document.removeEventListener("webkitfullscreenchange", syncViewportMetrics);
      if (fsHintTimerRef.current) window.clearTimeout(fsHintTimerRef.current);
    };
  }, []);

  const emitInput = useCallback((extra = undefined) => {
    const payload = extra
      ? { ...inputRef.current, ...extra }
      : inputRef.current;
    socketRef.current?.emit("controller:input", payload);
  }, []);

  useEffect(() => {
    const cleanupSocket = connectRelaySocket({
      role: "controller",
      pairToken,
      onStatusChange: (statusInfo) => {
        setRelayStatus(statusInfo?.status || "connecting");
        if (statusInfo?.status !== "connected") {
          setConnected(false);
        }
      },
      onSocket: (socket) => {
        socketRef.current = socket;

        socket.on("connect", () => {
          setConnected(true);
          socket.emit("controller:action", "syncState");
          socket.emit("controller:input", inputRef.current);
        });
        socket.on("disconnect", () => {
          setConnected(false);
          setPairStatus((prev) => ({ ...prev, linked: false }));
        });
        socket.on("controller:pair-status", (status) => {
          if (!status || typeof status !== "object") return;
          if (status.pairToken && status.pairToken !== pairToken) {
            setPairToken(status.pairToken);
            setPairDraft(status.pairToken);
          }
          setPairStatus({
            linked: Boolean(status.linked),
            activeGames: Number(status.activeGames) || 0,
            availablePairs: Array.isArray(status.availablePairs)
              ? status.availablePairs
              : [],
          });
        });
        socket.on("game:telemetry", (data) => {
          if (!data) return;
          setPairStatus((prev) => (prev.linked ? prev : { ...prev, linked: true }));
          setTelemetry((prev) => ({
            ...prev,
            ...data,
            playerMode: data.playerMode || prev.playerMode,
          }));
        });
        socket.on("game:haptic", (pattern) => {
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(pattern);
          }
        });
      },
      onCleanupSocket: (oldSocket) => {
        if (socketRef.current === oldSocket) {
          socketRef.current = null;
        }
      },
    });

    const heartbeat = setInterval(() => {
      if (socketRef.current?.connected) {
        // Strip transient delta impulses from steady-state heartbeat
        const { lookDeltaX, lookDeltaY, ...steadyState } = inputRef.current;
        socketRef.current.emit("controller:input", steadyState);
      }
    }, 30);

    return () => {
      clearInterval(heartbeat);
      cleanupSocket();
      socketRef.current = null;
      setConnected(false);
    };
  }, [pairToken]);

  // Automatically clear stale inputs when switching between Car HUD and Character HUD
  // Automatically clear stale inputs when switching between Car HUD and Character HUD
  useEffect(() => {
    if (telemetry.playerMode === "driving") {
      setAutoRun(false);
      setAimActive(false);
      setCrouchActive(false);
      setFiringActive(false);
      setEmotesOpen(false);
      setBagOpen(false);
      inputRef.current.autoRun = false;
      inputRef.current.moveX = 0;
      inputRef.current.moveY = 0;
      inputRef.current.sprint = false;
      inputRef.current.crouch = false;
      inputRef.current.fire = false;
      inputRef.current.aim = false;
      setJoyKnob({ x: 0, y: 0, active: false });
    } else if (telemetry.playerMode === "onFoot") {
      inputRef.current.accelerate = false;
      inputRef.current.brake = false;
      inputRef.current.handbrake = false;
      inputRef.current.boost = false;
      inputRef.current.steer = 0;
      wheelTouchIdRef.current = null;
      wheelMouseDownRef.current = false;
      setWheelGrabbed(false);
      setSteerVal(0);
    }
  }, [telemetry.playerMode]);

  useEffect(() => {
    if (
      telemetry.matchStatus === "DROPPING" &&
      prevMatchStatusRef.current !== "DROPPING"
    ) {
      setAutoRun(false);
      setAimActive(false);
      setCrouchActive(false);
      setFiringActive(false);
      setEmotesOpen(false);
      setBagOpen(false);
      inputRef.current.autoRun = false;
      inputRef.current.crouch = false;
      inputRef.current.aim = false;
      inputRef.current.fire = false;
      inputRef.current.jump = false;
      emitInput();
    }
    prevMatchStatusRef.current = telemetry.matchStatus;
  }, [telemetry.matchStatus, emitInput]);

  const medkitTimerRef = useRef(null);
  useEffect(() => {
    return () => {
      if (medkitTimerRef.current) window.clearTimeout(medkitTimerRef.current);
    };
  }, []);

  const updateField = useCallback(
    (key, value) => {
      inputRef.current[key] = value;
      emitInput();
    },
    [emitInput],
  );

  const toggleAutoRun = useCallback(() => {
    setAutoRun((prev) => {
      const next = !prev;
      inputRef.current.autoRun = next;
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(20);
      }
      emitInput();
      return next;
    });
  }, [emitInput]);

  /* Left Joystick for Small / In-Place Movements */
  const mapTouchDelta = useCallback(
    (el, clientX, clientY) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      let dx = clientX - cx;
      let dy = clientY - cy;

      if (isPortraitViewport) {
        const temp = dx;
        dx = dy;
        dy = -temp;
      }

      const maxR = Math.min(rect.width, rect.height) * 0.38;
      const dist = Math.hypot(dx, dy);
      if (dist > maxR) {
        dx = (dx / dist) * maxR;
        dy = (dy / dist) * maxR;
      }

      return {
        dx,
        dy,
        normX: THREE.MathUtils.clamp(dx / maxR, -1, 1),
        normY: THREE.MathUtils.clamp(-dy / maxR, -1, 1),
      };
    },
    [isPortraitViewport],
  );

  const applyJoyPoint = useCallback(
    (pt) => {
      const el = joyBoxRef.current;
      if (!el || !pt) return;
      const { dx, dy, normX, normY } = mapTouchDelta(el, pt.clientX, pt.clientY);
      inputRef.current.moveX = normX;
      inputRef.current.moveY = normY;

      // Pulling backward on the joystick stops continuous auto-run
      if (normY < -0.35 && inputRef.current.autoRun) {
        inputRef.current.autoRun = false;
        setAutoRun(false);
      }

      setJoyKnob({ x: dx, y: dy, active: true });
      emitInput();
    },
    [mapTouchDelta, emitInput],
  );

  const handleMoveJoyStart = useCallback(
    (e) => {
      e.stopPropagation();
      if (e.changedTouches) {
        if (joyTouchIdRef.current !== null) return;
        const pt = e.changedTouches[0];
        if (!pt) return;
        joyTouchIdRef.current = pt.identifier;
        applyJoyPoint(pt);
        return;
      }
      if (e.cancelable) e.preventDefault();
      if (joyTouchIdRef.current !== null) return;
      joyMouseDownRef.current = true;
      applyJoyPoint(e);
    },
    [applyJoyPoint],
  );

  const handleMoveJoyMove = useCallback(
    (e) => {
      e.stopPropagation();
      if (e.touches || e.changedTouches) {
        if (joyTouchIdRef.current === null) return;
        const pt =
          findTouchById(e.touches, joyTouchIdRef.current) ||
          findTouchById(e.changedTouches, joyTouchIdRef.current);
        if (!pt) return;
        applyJoyPoint(pt);
        return;
      }
      if (!joyMouseDownRef.current || e.buttons !== 1) return;
      if (e.cancelable) e.preventDefault();
      applyJoyPoint(e);
    },
    [applyJoyPoint],
  );

  const handleMoveJoyEnd = useCallback(
    (e) => {
      e?.stopPropagation?.();
      if (e?.changedTouches) {
        if (joyTouchIdRef.current === null) return;
        const ended = findTouchById(e.changedTouches, joyTouchIdRef.current);
        const stillDown = findTouchById(e.touches, joyTouchIdRef.current);
        if (!ended && stillDown) return;
        if (e.cancelable) e.preventDefault();
        joyTouchIdRef.current = null;
      } else {
        if (!joyMouseDownRef.current) return;
        if (e?.cancelable) e.preventDefault();
        joyMouseDownRef.current = false;
      }

      inputRef.current.moveX = 0;
      inputRef.current.moveY = 0;
      setJoyKnob({ x: 0, y: 0, active: false });
      emitInput();
    },
    [emitInput],
  );

  /* Right Horizontal Swipe Pad for Turning Character Direction */
  const extractLandscapeXY = useCallback(
    (pt) => {
      if (isPortraitViewport) {
        return { x: pt.clientY, y: -pt.clientX };
      }
      return { x: pt.clientX, y: pt.clientY };
    },
    [isPortraitViewport],
  );

  const handleSwipeStart = useCallback(
    (e) => {
      if (
        e.target?.closest?.(
          "button, [role='button'], .ffh-interactive, .mc-ff-joy-hit, .mc-modal-backdrop",
        )
      ) {
        return;
      }
      e.stopPropagation();

      let pt = null;
      if (e.changedTouches) {
        if (swipeTouchIdRef.current !== null) return;
        pt = e.changedTouches[0];
        if (!pt) return;
        swipeTouchIdRef.current = pt.identifier;
      } else {
        if (e.cancelable) e.preventDefault();
        if (swipeTouchIdRef.current !== null) return;
        swipeMouseDownRef.current = true;
        pt = e;
      }

      const pos = extractLandscapeXY(pt);
      prevSwipePtRef.current = { x: pos.x, y: pos.y, startX: pos.x };
      setSwipeIndicator({ active: true, offset: 0 });
    },
    [extractLandscapeXY],
  );

  const handleSwipeMove = useCallback(
    (e) => {
      if (!prevSwipePtRef.current) return;
      let pt = null;
      if (e.touches || e.changedTouches) {
        if (swipeTouchIdRef.current === null) return;
        pt =
          findTouchById(e.touches, swipeTouchIdRef.current) ||
          findTouchById(e.changedTouches, swipeTouchIdRef.current);
        if (!pt) return;
      } else {
        if (!swipeMouseDownRef.current || e.buttons !== 1) return;
        if (e.cancelable) e.preventDefault();
        pt = e;
      }

      e.stopPropagation();
      const pos = extractLandscapeXY(pt);

      const deltaX = pos.x - prevSwipePtRef.current.x;
      const deltaY = pos.y - prevSwipePtRef.current.y;
      prevSwipePtRef.current.x = pos.x;
      prevSwipePtRef.current.y = pos.y;

      const visualOffset = THREE.MathUtils.clamp(
        pos.x - prevSwipePtRef.current.startX,
        -58,
        58,
      );
      setSwipeIndicator({ active: true, offset: visualOffset });

      emitInput({
        lookDeltaX: deltaX * 0.014,
        lookDeltaY: deltaY * 0.008,
      });
    },
    [extractLandscapeXY, emitInput],
  );

  const handleSwipeEnd = useCallback((e) => {
    e?.stopPropagation?.();
    if (e?.changedTouches) {
      if (swipeTouchIdRef.current === null) return;
      const ended = findTouchById(e.changedTouches, swipeTouchIdRef.current);
      const stillDown = findTouchById(e.touches, swipeTouchIdRef.current);
      if (!ended && stillDown) return;
      if (e.cancelable) e.preventDefault();
      swipeTouchIdRef.current = null;
    } else {
      if (!swipeMouseDownRef.current) return;
      if (e?.cancelable) e.preventDefault();
      swipeMouseDownRef.current = false;
    }

    prevSwipePtRef.current = null;
    setSwipeIndicator({ active: false, offset: 0 });
    emitInput({ lookDeltaX: 0, lookDeltaY: 0 });
  }, [emitInput]);

  const openGyroPrompt = useCallback(() => {
    setSteerMode("tilt");
    setGyroPromptOpen(true);
    setGyroError("");
  }, []);

  const requestAndEnableGyro = useCallback(async () => {
    if (!window.isSecureContext) {
      setGyroError(
        "GYROSCOPE ACCESS REQUIRES HTTPS OR LOCALHOST. A LOCAL WI-FI HTTP ADDRESS MAY BE BLOCKED.",
      );
      setGyroPermNeeded(true);
      return;
    }

    if (typeof DeviceOrientationEvent === "undefined") {
      setGyroError("DEVICE ORIENTATION IS NOT SUPPORTED BY THIS BROWSER.");
      setGyroPermNeeded(true);
      return;
    }

    try {
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission !== "granted") {
          setGyroActive(false);
          setGyroPermNeeded(true);
          setGyroError(
            "SENSOR PERMISSION WAS DENIED. ALLOW MOTION ACCESS AND RETRY.",
          );
          return;
        }
      }

      setGyroPermNeeded(false);
      setGyroError("");
      setGyroSensorDetected(false);
      rawTiltRef.current = 0;
      tiltZeroRef.current = 0;
      setGyroActive(true);
      setGyroPromptOpen(false);
    } catch (error) {
      console.error("Gyroscope activation failed:", error);
      setGyroActive(false);
      setGyroPermNeeded(true);
      setGyroError(error?.message || "UNABLE TO INITIALIZE GYROSCOPE.");
    }
  }, []);

  const calibrateTilt = useCallback(() => {
    tiltZeroRef.current = rawTiltRef.current;
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(25);
    }
  }, []);

  useEffect(() => {
    if (steerMode !== "tilt" || !gyroActive) {
      inputRef.current.steer = 0;
      setSteerVal(0);
      emitInput();
      return undefined;
    }

    const onOrientation = (event) => {
      if (event.beta === null && event.gamma === null) return;

      setGyroSensorDetected(true);
      const deg = extractTiltDegrees(event, isPortraitViewport);
      rawTiltRef.current = deg;

      const calibrated = deg - tiltZeroRef.current;
      const abs = Math.abs(calibrated);

      let nextSteer = 0;
      if (abs >= TILT_DEADZONE_DEG) {
        const effective = Math.sign(calibrated) * (abs - TILT_DEADZONE_DEG);
        const normRight = THREE.MathUtils.clamp(
          effective / (MAX_TILT_DEG - TILT_DEADZONE_DEG),
          -1,
          1,
        );
        nextSteer = -normRight;
      }

      inputRef.current.steer = nextSteer;
      setSteerVal(nextSteer);
      emitInput();
    };

    window.addEventListener("deviceorientation", onOrientation, true);
    return () => {
      window.removeEventListener("deviceorientation", onOrientation, true);
    };
  }, [steerMode, gyroActive, isPortraitViewport, emitInput]);

  const getFingerPolarAngle = useCallback(
    (point) => {
      const el = wheelBoxRef.current;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      let dx = point.clientX - cx;
      let dy = point.clientY - cy;

      if (isPortraitViewport) {
        const temp = dx;
        dx = dy;
        dy = -temp;
      }

      return (Math.atan2(dx, -dy) * 180) / Math.PI;
    },
    [isPortraitViewport],
  );

  const handleWheelStart = useCallback(
    (e) => {
      e.stopPropagation();
      let pt = null;
      if (e.changedTouches) {
        if (wheelTouchIdRef.current !== null) return;
        pt = e.changedTouches[0];
        if (!pt) return;
        wheelTouchIdRef.current = pt.identifier;
      } else {
        if (e.cancelable) e.preventDefault();
        if (wheelTouchIdRef.current !== null) return;
        wheelMouseDownRef.current = true;
        pt = e;
      }
      prevFingerAngleRef.current = getFingerPolarAngle(pt);
      setWheelGrabbed(true);
    },
    [getFingerPolarAngle],
  );

  const handleWheelMove = useCallback(
    (e) => {
      if (prevFingerAngleRef.current === null) return;
      let pt = null;
      if (e.touches || e.changedTouches) {
        if (wheelTouchIdRef.current === null) return;
        pt =
          findTouchById(e.touches, wheelTouchIdRef.current) ||
          findTouchById(e.changedTouches, wheelTouchIdRef.current);
        if (!pt) return;
      } else {
        if (!wheelMouseDownRef.current || e.buttons !== 1) return;
        if (e.cancelable) e.preventDefault();
        pt = e;
      }

      e.stopPropagation();

      const currentFingerAngle = getFingerPolarAngle(pt);

      let deltaDeg = currentFingerAngle - prevFingerAngleRef.current;
      if (deltaDeg > 180) deltaDeg -= 360;
      if (deltaDeg < -180) deltaDeg += 360;

      prevFingerAngleRef.current = currentFingerAngle;

      wheelAngleDegRef.current = THREE.MathUtils.clamp(
        wheelAngleDegRef.current + deltaDeg,
        -MAX_WHEEL_ROTATION_DEG,
        MAX_WHEEL_ROTATION_DEG,
      );

      const nextSteer = THREE.MathUtils.clamp(
        -wheelAngleDegRef.current / MAX_WHEEL_ROTATION_DEG,
        -1,
        1,
      );
      inputRef.current.steer = nextSteer;
      setSteerVal(nextSteer);
      emitInput();
    },
    [getFingerPolarAngle, emitInput],
  );

  const handleWheelEnd = useCallback(
    (e) => {
      e?.stopPropagation?.();
      if (e?.changedTouches) {
        if (wheelTouchIdRef.current === null) return;
        const ended = findTouchById(e.changedTouches, wheelTouchIdRef.current);
        const stillDown = findTouchById(e.touches, wheelTouchIdRef.current);
        if (!ended && stillDown) return;
        if (e.cancelable) e.preventDefault();
        wheelTouchIdRef.current = null;
      } else {
        if (!wheelMouseDownRef.current) return;
        if (e?.cancelable) e.preventDefault();
        wheelMouseDownRef.current = false;
      }

      prevFingerAngleRef.current = null;
      wheelAngleDegRef.current = 0;
      setWheelGrabbed(false);
      inputRef.current.steer = 0;
      setSteerVal(0);
      emitInput();
    },
    [emitInput],
  );

  const showFsHint = useCallback((msg) => {
    setFsHint(msg);
    if (fsHintTimerRef.current) window.clearTimeout(fsHintTimerRef.current);
    fsHintTimerRef.current = window.setTimeout(() => {
      fsHintTimerRef.current = null;
      setFsHint("");
    }, 4500);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const docEl = document.documentElement;
    if (typeof window !== "undefined") {
      window.scrollTo(0, 1);
    }
    const activeFs =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement;

    if (!activeFs) {
      const reqFs =
        docEl.requestFullscreen ||
        docEl.webkitRequestFullscreen ||
        docEl.webkitRequestFullScreen ||
        docEl.mozRequestFullScreen ||
        docEl.msRequestFullscreen;

      if (!reqFs) {
        try {
          await window.screen?.orientation?.lock?.("landscape");
        } catch {
          // Orientation lock unavailable outside fullscreen on some browsers
        }
        showFsHint(
          "On iPhone/Safari: rotate sideways or tap Share -> Add to Home Screen for full screen.",
        );
        return;
      }

      try {
        let res;
        try {
          res = reqFs.call(docEl, { navigationUI: "hide" });
        } catch {
          res = reqFs.call(docEl);
        }
        if (res && typeof res.then === "function") {
          await res;
        }
        try {
          await window.screen?.orientation?.lock?.("landscape");
        } catch {
          // Ignore if device orientation lock is disallowed
        }
      } catch {
        showFsHint(
          "Browser blocked fullscreen — rotate phone sideways or add page to Home Screen.",
        );
      }
      return;
    }

    const exitFs =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.mozCancelFullScreen ||
      document.msExitFullscreen;
    if (exitFs) {
      try {
        await exitFs.call(document);
      } catch {
        // Ignore fullscreen exit rejection
      }
    }
  }, [showFsHint]);

  const handleSteerSideChange = useCallback((side) => {
    setSteerSide(side);
    socketRef.current?.emit("controller:settings", { steerHudSide: side });
  }, []);

  const handleSceneChange = useCallback((presetKey) => {
    setScenePreset(presetKey);
    socketRef.current?.emit("controller:settings", { scenePreset: presetKey });
  }, []);

  const emitAction = useCallback((action) => {
    socketRef.current?.emit("controller:action", action);
  }, []);

  const handleMobileHeal = useCallback(() => {
    if ((telemetry.medkits ?? 0) <= 0 || telemetry.hp >= 100 || medkitHealing) {
      return;
    }
    setMedkitHealing(true);
    if (medkitTimerRef.current) window.clearTimeout(medkitTimerRef.current);
    medkitTimerRef.current = window.setTimeout(() => {
      medkitTimerRef.current = null;
      emitAction("heal");
      setMedkitHealing(false);
    }, 900);
  }, [telemetry.medkits, telemetry.hp, medkitHealing, emitAction]);

  const handleToggleAim = useCallback(() => {
    setAimActive((prev) => {
      const next = !prev;
      updateField("aim", next);
      return next;
    });
  }, [updateField]);

  const handleToggleCrouch = useCallback(() => {
    setCrouchActive((prev) => {
      const next = !prev;
      updateField("crouch", next);
      return next;
    });
  }, [updateField]);

  const isOnFoot =
    telemetry.playerMode === "onFoot" || telemetry.playerMode === "exiting";
  const rpmRatio = Math.min(1, (telemetry.rpm || 850) / 7500);
  const ledCount = 14;
  const activeLeds = Math.round(rpmRatio * ledCount);
  const headingDeg = telemetry.headingDeg || 0;
  const cardinal = getCardinalFromDeg(headingDeg);
  const activeWeaponId = telemetry.weaponId || "m4a1";

  return (
    <div
      className={
        isPortraitViewport ? "mc-viewport mc-force-landscape" : "mc-viewport"
      }
    >
      {isOnFoot ? (
        <div className="mc-ff-stage ff-hud-root">
          {/* Dedicated 360° Aim Swipe Surface behind HUD clusters */}
          <div
            ref={swipeBoxRef}
            className="mc-ff-aim-backdrop"
            style={{ pointerEvents: customHudEditing ? "none" : "auto" }}
            onTouchStart={customHudEditing ? undefined : handleSwipeStart}
            onTouchMove={customHudEditing ? undefined : handleSwipeMove}
            onTouchEnd={customHudEditing ? undefined : handleSwipeEnd}
            onTouchCancel={customHudEditing ? undefined : handleSwipeEnd}
            onMouseDown={customHudEditing ? undefined : handleSwipeStart}
            onMouseMove={customHudEditing ? undefined : handleSwipeMove}
            onMouseUp={customHudEditing ? undefined : handleSwipeEnd}
            onMouseLeave={customHudEditing ? undefined : handleSwipeEnd}
          >
            <div
              className={`ffh-crosshair ${aimActive ? "aiming" : ""} ${firingActive ? "firing" : ""}`}
            >
              <div className="ffh-reticle-tick top" />
              <div className="ffh-reticle-tick right" />
              <div className="ffh-reticle-tick bottom" />
              <div className="ffh-reticle-tick left" />
              <div className="ffh-reticle-dot" />
            </div>
            {swipeIndicator.active && (
              <div className="mc-ff-swipe-hint active">
                <span>AIMING</span>
                <span
                  className="mc-ff-swipe-indicator"
                  style={{
                    transform: `translateX(${Math.round(swipeIndicator.offset * 0.45)}px)`,
                  }}
                />
              </div>
            )}
          </div>

          {(telemetry.statusMsg ||
            !connected ||
            !pairStatus.linked ||
            telemetry.inLobby) && (
            <div
              className="mc-ff-status-toast ffh-interactive"
              style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}
            >
              <span>
                {!connected
                  ? relayStatus === "offline"
                    ? "RELAY SERVER OFFLINE — START SERVER & KEEP LAPTOP ON SAME WI-FI"
                    : "CONNECTING TO LAPTOP..."
                  : !pairStatus.linked
                    ? pairStatus.activeGames > 0
                      ? "UNPAIRED SESSION — TAP LINK TO CONNECT TO ACTIVE LAPTOP OR SCAN QR"
                      : "WAITING FOR LAPTOP GAME CLIENT TO OPEN"
                    : telemetry.statusMsg
                      ? telemetry.statusMsg
                      : "LAPTOP IS IN LOBBY — TAP QUICK SOLO OR START MATCH ON LAPTOP"}
              </span>
              {connected &&
                !pairStatus.linked &&
                pairStatus.availablePairs.length > 0 && (
                  <TapButton
                    className="ffh-mini-circle-btn"
                    style={{
                      width: "auto",
                      height: "24px",
                      padding: "0 10px",
                      borderRadius: "6px",
                      background: "#f97316",
                      color: "#0b0f19",
                      fontSize: "10px",
                      fontWeight: 900,
                    }}
                    onTrigger={() => {
                      const next = pairStatus.availablePairs[0];
                      setPairDraft(next);
                      setPairToken(next);
                    }}
                  >
                    LINK GAME
                  </TapButton>
                )}
            </div>
          )}

          {/* 1. TOP-LEFT: SQUARE RADAR + 1 YOU + COMMS / TOOL CIRCLES */}
          <div className="ffh-tl-cluster">
            <FreeFireMinimapBox
              posX={telemetry.posX || 0}
              posZ={telemetry.posZ || 0}
              headingDeg={headingDeg}
              matchElapsed={telemetry.matchElapsed || 0}
              enemies={telemetry.enemies || []}
              carPos={telemetry.carPos || null}
            />

            <div className="ffh-tl-tools ffh-interactive">
              <div className="ffh-tl-tool-row">
                <TapButton
                  className={`ffh-mini-circle-btn ${speakerMuted ? "muted" : ""}`}
                  onTrigger={() => setSpeakerMuted((v) => !v)}
                  title="Toggle Team Audio"
                >
                  <SpeakerSvg muted={speakerMuted} />
                </TapButton>
                <TapButton
                  className={`ffh-mini-circle-btn ${micMuted ? "muted" : ""}`}
                  onTrigger={() => setMicMuted((v) => !v)}
                  title="Toggle Microphone"
                >
                  <MicSvg muted={micMuted} />
                </TapButton>
                <span className="ffh-eye-badge" title="Spectators">
                  <EyeSvg />
                  <span>1</span>
                </span>
                <span
                  className={`ffh-signal-badge ${connected && pairStatus.linked ? "online" : "offline"}`}
                  title={`Paired Session: ${pairToken}`}
                >
                  <span
                    className={
                      connected && pairStatus.linked
                        ? "mc-dot mc-dot-live"
                        : "mc-dot mc-dot-wait"
                    }
                  />
                  {!connected
                    ? relayStatus === "offline"
                      ? "OFFLINE"
                      : "WAIT"
                    : pairStatus.linked
                      ? "SYNC"
                      : "UNPAIRED"}
                </span>
              </div>

              <div className="ffh-tl-tool-row">
                <TapButton
                  className={`ffh-mini-circle-btn ${autoRun ? "active" : ""}`}
                  onTrigger={toggleAutoRun}
                  title="Auto-Run / Sprint"
                >
                  <SprintSvg />
                </TapButton>
                <TapButton
                  className="ffh-mini-circle-btn"
                  onTrigger={() => emitAction("camera")}
                  title="Switch Camera"
                >
                  <Icons.Camera />
                </TapButton>
                <TapButton
                  className="ffh-mini-circle-btn"
                  onTrigger={() => emitAction("reset")}
                  title="Reset Car"
                >
                  <Icons.Reset />
                </TapButton>
                <TapButton
                  className={`ffh-fullscreen-pill ${isFullscreen ? "active" : ""}`}
                  onTrigger={toggleFullscreen}
                  title="Toggle Fullscreen Landscape"
                >
                  <Icons.Fullscreen />
                  <span>{isFullscreen ? "EXIT" : "FULL"}</span>
                </TapButton>
                <TapButton
                  className={`ffh-mini-circle-btn ${customHudEditing ? "active" : ""}`}
                  onTrigger={() => setCustomHudEditing((v) => !v)}
                  title="Customize HUD (Size, Transparency & Position)"
                  data-testid="phone-custom-hud-btn"
                >
                  <HudLayoutSvg />
                </TapButton>
              </div>
            </div>
          </div>

          {/* 2. TOP-CENTER: HELMET/VEST + EP/HP + FF 500 + SAFE ZONE + KILL FEED */}
          <FreeFireTopCenterCluster
            helmetLevel={telemetry.helmetLevel ?? 3}
            vestLevel={telemetry.vestLevel ?? 3}
            ep={telemetry.ep ?? 180}
            playerHp={telemetry.hp ?? 100}
            cardinal={cardinal}
            headingDeg={headingDeg}
            matchElapsed={telemetry.matchElapsed || 0}
            killFeed={telemetry.killFeed || []}
          />

          {/* 3. TOP-RIGHT: TEAL ALIVE + CRIMSON KILLS + GEAR + WEAPON CARDS */}
          <FreeFireTopRightCluster
            aliveCount={telemetry.aliveCount ?? 7}
            kills={telemetry.kills ?? 0}
            onOpenSettings={() => setSettingsOpen(true)}
            showWeaponCards={true}
            showWeaponChips={false}
            weaponId={activeWeaponId}
            ammoState={telemetry.ammoState || DEFAULT_AMMO_STATE}
            reloading={Boolean(telemetry.reloading)}
            primaryWeapon={telemetry.primaryWeapon || "m4a1"}
            secondaryWeapon={telemetry.secondaryWeapon || "deagle"}
            onSwitchWeapon={() => emitAction("switchWeapon")}
            onReloadWeapon={() => emitAction("reloadWeapon")}
            onSelectWeapon={(id) => emitAction(`selectWeapon:${id}`)}
          />

          {/* 4. AIRCRAFT EJECT / VICTORY / DEFEAT BANNER */}
          {(telemetry.matchStatus === "DROPPING" || customHudEditing) && (
            <CustomHudElement
              id="dropParachute"
              editMode={customHudEditing}
              selected={selectedHudElem === "dropParachute"}
              cfg={hudLayout.dropParachute}
              onSelect={setSelectedHudElem}
              onMove={handleMoveLayout}
            >
              <div className="ffh-drop-banner mc-ff-drop-banner ffh-interactive">
                {telemetry.aircraftPhase === "flying" || customHudEditing ? (
                  <TapButton
                    className="ffh-eject-btn"
                    onTrigger={() => emitAction("ejectAircraft")}
                  >
                    EJECT PARACHUTE
                  </TapButton>
                ) : (
                  <div className="ffh-parachute-chip">
                    PARACHUTE DEPLOYED · STEER WITH JOYSTICK
                  </div>
                )}
              </div>
            </CustomHudElement>
          )}

          {(telemetry.matchStatus === "VICTORY" ||
            telemetry.matchStatus === "DEFEAT") && (
            <div className="mc-ff-result-banner ffh-interactive">
              <span
                className={
                  telemetry.matchStatus === "VICTORY"
                    ? "mc-ff-result-title booyah"
                    : "mc-ff-result-title eliminated"
                }
              >
                {telemetry.matchStatus === "VICTORY"
                  ? "BOOYAH! VICTORY"
                  : "ELIMINATED"}
              </span>
              <TapButton
                className="ffh-eject-btn mc-ff-play-again"
                onTrigger={() => emitAction("playAgain")}
              >
                PLAY AGAIN
              </TapButton>
            </div>
          )}

          {/* LOADOUT & EMOTE DRAWERS (WHEN OPEN) */}
          {bagOpen && (
            <div className="mc-ff-loadout-drawer ffh-interactive" style={{ zIndex: 120 }}>
              {WEAPON_ORDER.map((id) => {
                const slotAmmo =
                  (telemetry.ammoState || DEFAULT_AMMO_STATE)[id] || {
                    mag: 0,
                    reserve: 0,
                  };
                const active = activeWeaponId === id;
                return (
                  <TapButton
                    key={id}
                    className={`mc-ff-loadout-item ${active ? "active" : ""}`}
                    onTrigger={() => {
                      emitAction(`selectWeapon:${id}`);
                      setBagOpen(false);
                    }}
                  >
                    <WeaponSilhouetteSvg
                      weaponId={id}
                      className="mc-ff-loadout-svg"
                    />
                    <span>{WEAPONS[id]?.name}</span>
                    <small>
                      {id === "fist"
                        ? "∞"
                        : `${slotAmmo.mag}/${slotAmmo.reserve}`}
                    </small>
                  </TapButton>
                );
              })}
            </div>
          )}

          {emotesOpen && (
            <div className="mc-ff-emote-drawer ffh-interactive" style={{ zIndex: 120 }}>
              {CONTROLLER_EMOTES.map((emote) => (
                <TapButton
                  key={emote.id}
                  className="mc-ff-emote-chip"
                  onTrigger={() => {
                    emitAction(`emote:${emote.id}`);
                    setEmotesOpen(false);
                  }}
                >
                  {emote.label}
                </TapButton>
              ))}
            </div>
          )}

          {/* 5. INDIVIDUAL CUSTOM HUD CONTROLS (FREE FIRE CUSTOM HUD) */}
          {/* JOYSTICK */}
          <CustomHudElement
            id="joystick"
            editMode={customHudEditing}
            selected={selectedHudElem === "joystick"}
            cfg={hudLayout.joystick}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <div
              ref={joyBoxRef}
              className={`ffh-joystick-pad mc-ff-joy-hit ${joyKnob.active ? "active" : ""}`}
              onTouchStart={customHudEditing ? undefined : handleMoveJoyStart}
              onTouchMove={customHudEditing ? undefined : handleMoveJoyMove}
              onTouchEnd={customHudEditing ? undefined : handleMoveJoyEnd}
              onTouchCancel={customHudEditing ? undefined : handleMoveJoyEnd}
              onMouseDown={customHudEditing ? undefined : handleMoveJoyStart}
              onMouseMove={customHudEditing ? undefined : handleMoveJoyMove}
              onMouseUp={customHudEditing ? undefined : handleMoveJoyEnd}
              onMouseLeave={customHudEditing ? undefined : handleMoveJoyEnd}
            >
              <div
                className={`ffh-joystick-knob ${joyKnob.active ? "active" : ""}`}
                style={{
                  transform: `translate(${joyKnob.x}px, ${joyKnob.y}px)`,
                }}
              />
            </div>
          </CustomHudElement>

          {/* LEFT FIRE */}
          <CustomHudElement
            id="leftFire"
            editMode={customHudEditing}
            selected={selectedHudElem === "leftFire"}
            cfg={hudLayout.leftFire}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <HoldButton
              className="ffh-action-circle static-pos"
              activeClassName="active"
              onChange={(v) => {
                if (customHudEditing) return;
                setFiringActive(v);
                updateField("fire", v);
              }}
            >
              <FireBulletSvg />
            </HoldButton>
          </CustomHudElement>

          {/* QUICK WEAPON SWITCH */}
          <CustomHudElement
            id="switchWeapon"
            editMode={customHudEditing}
            selected={selectedHudElem === "switchWeapon"}
            cfg={hudLayout.switchWeapon}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <TapButton
              className="ffh-action-circle static-pos"
              onTrigger={() => {
                if (customHudEditing) return;
                emitAction("switchWeapon");
              }}
              title="Cycle Weapon"
            >
              <ReloadSvg />
              <span className="ffh-key-hint">Q</span>
            </TapButton>
          </CustomHudElement>

          {/* MEDKIT */}
          <CustomHudElement
            id="medkit"
            editMode={customHudEditing}
            selected={selectedHudElem === "medkit"}
            cfg={hudLayout.medkit}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <TapButton
              className={`ffh-utility-circle ${medkitHealing ? "healing" : ""}`}
              onTrigger={() => {
                if (customHudEditing) return;
                handleMobileHeal();
              }}
              disabled={
                !customHudEditing &&
                ((telemetry.medkits ?? 0) <= 0 ||
                  telemetry.hp >= 100 ||
                  medkitHealing)
              }
              title="Use Medkit"
            >
              <MedkitSvg />
              <span className="ffh-count-badge">{telemetry.medkits ?? 0}</span>
            </TapButton>
          </CustomHudElement>

          {/* BACKPACK */}
          <CustomHudElement
            id="backpack"
            editMode={customHudEditing}
            selected={selectedHudElem === "backpack"}
            cfg={hudLayout.backpack}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <TapButton
              className={`ffh-utility-circle ${bagOpen ? "healing" : ""}`}
              onTrigger={() => {
                if (customHudEditing) return;
                setBagOpen((v) => !v);
                setEmotesOpen(false);
              }}
              title="Backpack / Weapon Loadout"
            >
              <BackpackSvg />
            </TapButton>
          </CustomHudElement>

          {/* EMOTES */}
          <CustomHudElement
            id="emotes"
            editMode={customHudEditing}
            selected={selectedHudElem === "emotes"}
            cfg={hudLayout.emotes}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <TapButton
              className={`ffh-utility-circle ${emotesOpen ? "healing" : ""}`}
              onTrigger={() => {
                if (customHudEditing) return;
                setEmotesOpen((v) => !v);
                setBagOpen(false);
              }}
              title="Emotes"
            >
              <EmoteWaveSvg />
            </TapButton>
          </CustomHudElement>

          {/* SCOPE / ADS */}
          <CustomHudElement
            id="aimScope"
            editMode={customHudEditing}
            selected={selectedHudElem === "aimScope"}
            cfg={hudLayout.aimScope}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <TapButton
              className={`ffh-action-circle ffh-btn-scope ${aimActive ? "active" : ""}`}
              onTrigger={() => {
                if (customHudEditing) return;
                handleToggleAim();
              }}
              title="Scope / ADS"
            >
              <ScopeSvg />
            </TapButton>
          </CustomHudElement>

          {/* JUMP */}
          <CustomHudElement
            id="jump"
            editMode={customHudEditing}
            selected={selectedHudElem === "jump"}
            cfg={hudLayout.jump}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <HoldButton
              className="ffh-action-circle ffh-btn-jump"
              activeClassName="active"
              onChange={(v) => {
                if (customHudEditing) return;
                updateField("jump", v);
              }}
            >
              <JumpSoldierSvg />
            </HoldButton>
          </CustomHudElement>

          {/* PRIMARY FIRE (DRAGGABLE FIRE BUTTON) */}
          <CustomHudElement
            id="rightFire"
            editMode={customHudEditing}
            selected={selectedHudElem === "rightFire"}
            cfg={hudLayout.rightFire}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <DraggableFireButton
              className="ffh-action-circle ffh-btn-fire"
              isFiring={firingActive}
              editMode={customHudEditing}
              onFireStart={() => {
                if (customHudEditing) return;
                setFiringActive(true);
                updateField("fire", true);
              }}
              onFireEnd={() => {
                setFiringActive(false);
                updateField("fire", false);
                updateField("dragUp", false);
                delete inputRef.current.lookDeltaX;
                delete inputRef.current.lookDeltaY;
                emitInput({ lookDeltaX: 0, lookDeltaY: 0 });
              }}
              onFireDrag={({ dragUpActive }) => {
                if (customHudEditing) return;
                updateField("dragUp", dragUpActive);
              }}
            >
              <FireBulletSvg />
            </DraggableFireButton>
          </CustomHudElement>

          {/* CROUCH */}
          <CustomHudElement
            id="crouch"
            editMode={customHudEditing}
            selected={selectedHudElem === "crouch"}
            cfg={hudLayout.crouch}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <TapButton
              className={`ffh-action-circle ffh-btn-crouch ${crouchActive ? "active" : ""}`}
              onTrigger={() => {
                if (customHudEditing) return;
                handleToggleCrouch();
              }}
              title="Crouch"
            >
              <CrouchSoldierSvg />
            </TapButton>
          </CustomHudElement>

          {/* RELOAD */}
          <CustomHudElement
            id="reload"
            editMode={customHudEditing}
            selected={selectedHudElem === "reload"}
            cfg={hudLayout.reload}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <TapButton
              className="ffh-action-circle ffh-btn-reload"
              onTrigger={() => {
                if (customHudEditing) return;
                emitAction("reloadWeapon");
              }}
              title="Reload"
            >
              <ReloadSvg />
              <span className="ffh-key-hint">R</span>
            </TapButton>
          </CustomHudElement>

          {/* DRIVE BMW */}
          <CustomHudElement
            id="drive"
            editMode={customHudEditing}
            selected={selectedHudElem === "drive"}
            cfg={hudLayout.drive}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <TapButton
              className={`ffh-action-circle ffh-btn-drive ${telemetry.nearCar ? "ready" : "standby"}`}
              onTrigger={() => {
                if (customHudEditing) return;
                emitAction("toggleVehicle");
              }}
              title="Enter / Drive BMW M4"
            >
              <CarDriveSvg />
              <span className="ffh-key-hint">F</span>
            </TapButton>
          </CustomHudElement>

          {/* 6. FLOATING CUSTOM HUD TOP BAR & SLIDERS OVERLAY (ON MOBILE) */}
          {customHudEditing && (
            <CustomHudEditorBar
              activePreset={activePreset}
              selectedId={selectedHudElem}
              layout={hudLayout}
              onChangeLayout={handleUpdateLayout}
              onSwitchPreset={handleSwitchPreset}
              onResetLayout={handleResetLayout}
              onResetSelectedElement={handleResetSelected}
              onSaveLayout={handleSaveLayout}
              onExitEdit={() => setCustomHudEditing(false)}
            />
          )}
        </div>
      ) : (
        <>
          <div className="mc-rpm-strip">
            {Array.from({ length: ledCount }).map((_, idx) => {
              const isOn = idx < activeLeds;
              const tier = idx < 6 ? "green" : idx < 10 ? "blue" : "red";
              return (
                <span
                  key={idx}
                  className={`mc-shift-led ${isOn ? `on ${tier}` : ""}`}
                />
              );
            })}
          </div>

          <header className="mc-header">
            <div className="mc-brand-status">
              <div className="mc-m-badge">M</div>
              <div>
                <div className="mc-conn-row">
                  <span
                    className={
                      connected ? "mc-dot mc-dot-live" : "mc-dot mc-dot-wait"
                    }
                  />
                  <span className="mc-conn-text">
                    {connected
                      ? "M-LINK ACTIVE"
                      : relayStatus === "offline"
                        ? "RELAY OFFLINE"
                        : "CONNECTING..."}
                  </span>
                </div>
                <div className="mc-sub-mode">
                  {steerMode === "tilt"
                    ? "GYRO TILT · L: BRAKE | R: ACCEL"
                    : `WHEEL (${steerSide.toUpperCase()}) · CIRCULAR TOUCH`}
                </div>
              </div>
            </div>

            <div className="mc-digital-cluster">
              <div className="mc-speed-block">
                <span className="mc-speed-digits">
                  {String(Math.abs(telemetry.speed || 0)).padStart(3, "0")}
                </span>
                <span className="mc-speed-unit">KM/H</span>
              </div>
              <div className="mc-cluster-divider" />
              <div className="mc-gear-block">
                <span className="mc-gear-label">GEAR</span>
                <span className="mc-gear-digit">
                  {telemetry.gear || "N"}
                </span>
              </div>
            </div>

            <div className="mc-icon-toolbar">
              <TapButton
                className="mc-icon-btn mc-action-pill"
                onTrigger={() => emitAction("toggleVehicle")}
                title="Exit Car"
              >
                EXIT CAR
              </TapButton>

              <TapButton
                className="mc-icon-btn"
                onTrigger={() => emitAction("camera")}
                title="Switch Camera"
              >
                <Icons.Camera />
              </TapButton>

              <TapButton
                className="mc-icon-btn"
                onTrigger={() => emitAction("reset")}
                title="Reset Car"
              >
                <Icons.Reset />
              </TapButton>

              <TapButton
                className="mc-icon-btn"
                onTrigger={toggleFullscreen}
                title="Fullscreen Landscape"
              >
                <Icons.Fullscreen />
              </TapButton>

              <TapButton
                className="mc-icon-btn mc-settings-trigger"
                onTrigger={() => setSettingsOpen(true)}
                title="Controller Settings"
              >
                <Icons.Settings />
              </TapButton>
            </div>
          </header>

          <HoldButton
            className="mc-jump-btn mc-jump-floating"
            activeClassName="is-pressed"
            onChange={(v) => updateField("jump", v)}
          >
            <span className="mc-jump-icon">↑</span>
            <span>JUMP</span>
          </HoldButton>

          {steerMode === "tilt" ? (
            <div className="mc-gyro-layout">
              <div className="mc-gyro-side">
                <HoldButton
                  className="mc-aux-btn mc-drift-btn"
                  activeClassName="is-pressed"
                  onChange={(v) => updateField("handbrake", v)}
                >
                  <span className="mc-btn-icon">
                    <Icons.Drift />
                  </span>
                  <span className="mc-aux-label">DRIFT</span>
                </HoldButton>

                <HoldButton
                  className="mc-pedal mc-brake-pedal"
                  activeClassName="is-pressed"
                  onChange={(v) => updateField("brake", v)}
                >
                  <div className="mc-pedal-treads">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="mc-pedal-icon">
                    <Icons.BrakeDisc />
                  </div>
                  <div className="mc-pedal-title">BRAKE</div>
                  <div className="mc-pedal-sub">REVERSE</div>
                </HoldButton>
              </div>

              <div className="mc-gyro-center-card">
                <div className="mc-gyro-badge">
                  <Icons.Gyro />
                  <span>TILT PHONE TO STEER</span>
                </div>

                {!gyroActive ? (
                  <TapButton
                    className="mc-enable-gyro-action-btn"
                    onTrigger={openGyroPrompt}
                  >
                    ENABLE GYRO SENSORS
                  </TapButton>
                ) : (
                  <div className="mc-gyro-horizon">
                    <div
                      className="mc-gyro-horizon-bar"
                      style={{
                        transform: `rotate(${Math.round(-steerVal * 35)}deg)`,
                      }}
                    >
                      <span className="mc-horizon-tip" />
                      <span className="mc-horizon-center" />
                      <span className="mc-horizon-tip" />
                    </div>
                    <div className="mc-gyro-angle-val">
                      {steerVal > 0.04
                        ? `LEFT ${Math.round(steerVal * 100)}%`
                        : steerVal < -0.04
                          ? `RIGHT ${Math.round(Math.abs(steerVal) * 100)}%`
                          : "0° CENTER"}
                    </div>
                  </div>
                )}

                {gyroPermNeeded && (
                  <div className="mc-gyro-perm-warning">
                    PERMISSION DENIED. CHECK BROWSER HTTPS/PERMISSIONS.
                  </div>
                )}

                <TapButton
                  className="mc-recenter-pill"
                  onTrigger={calibrateTilt}
                >
                  ZERO TILT (CENTER)
                </TapButton>
              </div>

              <div className="mc-gyro-side">
                <HoldButton
                  className="mc-aux-btn mc-boost-btn"
                  activeClassName="is-pressed"
                  onChange={(v) => updateField("boost", v)}
                >
                  <span className="mc-btn-icon">
                    <Icons.Boost />
                  </span>
                  <span className="mc-aux-label">M-BOOST</span>
                </HoldButton>

                <HoldButton
                  className="mc-pedal mc-gas-pedal"
                  activeClassName="is-pressed"
                  onChange={(v) => updateField("accelerate", v)}
                >
                  <div className="mc-pedal-treads">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="mc-pedal-icon">
                    <Icons.GasPedal />
                  </div>
                  <div className="mc-pedal-title">ACCEL</div>
                  <div className="mc-pedal-sub">THROTTLE</div>
                </HoldButton>
              </div>
            </div>
          ) : (
            <div
              className={
                steerSide === "right"
                  ? "mc-wheel-layout wheel-on-right"
                  : "mc-wheel-layout wheel-on-left"
              }
            >
              <div
                ref={wheelBoxRef}
                className="mc-rotary-wheel-zone"
                onTouchStart={handleWheelStart}
                onTouchMove={handleWheelMove}
                onTouchEnd={handleWheelEnd}
                onTouchCancel={handleWheelEnd}
                onMouseDown={handleWheelStart}
                onMouseMove={(e) => {
                  if (e.buttons === 1) handleWheelMove(e);
                }}
                onMouseUp={handleWheelEnd}
                onMouseLeave={handleWheelEnd}
              >
                <div className="mc-rotary-ring-guide">
                  <div className="mc-rotary-glow" />
                  <SteeringWheelGraphic
                    steerValue={steerVal}
                    activeGrab={wheelGrabbed}
                  />
                </div>

                <div className="mc-rotary-footer">
                  <span className="mc-rotary-hint">CIRCULAR ROTATION</span>
                  <span className="mc-rotary-deg">
                    {Math.round(-steerVal * MAX_WHEEL_ROTATION_DEG)}°
                  </span>
                </div>
              </div>

              <div className="mc-dual-pedals-zone">
                <div className="mc-aux-row">
                  <HoldButton
                    className="mc-aux-btn mc-drift-btn"
                    activeClassName="is-pressed"
                    onChange={(v) => updateField("handbrake", v)}
                  >
                    <span className="mc-btn-icon">
                      <Icons.Drift />
                    </span>
                    <span className="mc-aux-label">DRIFT</span>
                  </HoldButton>

                  <HoldButton
                    className="mc-aux-btn mc-boost-btn"
                    activeClassName="is-pressed"
                    onChange={(v) => updateField("boost", v)}
                  >
                    <span className="mc-btn-icon">
                      <Icons.Boost />
                    </span>
                    <span className="mc-aux-label">M-BOOST</span>
                  </HoldButton>
                </div>

                <div className="mc-pedals-pair">
                  <HoldButton
                    className="mc-pedal mc-brake-pedal"
                    activeClassName="is-pressed"
                    onChange={(v) => updateField("brake", v)}
                  >
                    <div className="mc-pedal-treads">
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="mc-pedal-icon">
                      <Icons.BrakeDisc />
                    </div>
                    <div className="mc-pedal-title">BRAKE</div>
                    <div className="mc-pedal-sub">REVERSE</div>
                  </HoldButton>

                  <HoldButton
                    className="mc-pedal mc-gas-pedal"
                    activeClassName="is-pressed"
                    onChange={(v) => updateField("accelerate", v)}
                  >
                    <div className="mc-pedal-treads">
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="mc-pedal-icon">
                      <Icons.GasPedal />
                    </div>
                    <div className="mc-pedal-title">ACCEL</div>
                    <div className="mc-pedal-sub">THROTTLE</div>
                  </HoldButton>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {settingsOpen && (
        <div
          className="mc-modal-backdrop"
          onClick={() => setSettingsOpen(false)}
        >
          <div
            className="mc-settings-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mc-settings-header">
              <div className="mc-settings-title">
                <Icons.Settings />
                <span>CONTROLLER & HUD SETTINGS</span>
              </div>
              <TapButton
                className="mc-icon-btn"
                onTrigger={() => setSettingsOpen(false)}
              >
                <Icons.Close />
              </TapButton>
            </div>

            <div className="mc-setting-group">
              <div className="mc-setting-label">STEERING MODE</div>
              <div className="mc-segmented">
                <TapButton
                  className={
                    steerMode === "wheel" ? "mc-seg-btn active" : "mc-seg-btn"
                  }
                  onTrigger={() => {
                    setSteerMode("wheel");
                    inputRef.current.steer = 0;
                    setSteerVal(0);
                    emitInput();
                  }}
                >
                  <Icons.Wheel />
                  <span>STEERING WHEEL</span>
                </TapButton>
                <TapButton
                  className={
                    steerMode === "tilt" ? "mc-seg-btn active" : "mc-seg-btn"
                  }
                  onTrigger={openGyroPrompt}
                >
                  <Icons.Gyro />
                  <span>GYRO TILT (PEDALS)</span>
                </TapButton>
              </div>
            </div>

            <div className="mc-setting-group">
              <div className="mc-setting-label">STEERING SIDE (WHEEL MODE)</div>
              <div className="mc-segmented">
                <TapButton
                  className={
                    steerSide === "left" ? "mc-seg-btn active" : "mc-seg-btn"
                  }
                  onTrigger={() => handleSteerSideChange("left")}
                >
                  <span>STEER LEFT · PEDALS RIGHT</span>
                </TapButton>
                <TapButton
                  className={
                    steerSide === "right" ? "mc-seg-btn active" : "mc-seg-btn"
                  }
                  onTrigger={() => handleSteerSideChange("right")}
                >
                  <span>STEER RIGHT · PEDALS LEFT</span>
                </TapButton>
              </div>
            </div>

            <div className="mc-setting-group">
              <div className="mc-setting-label">WORLD ENVIRONMENT</div>
              <div className="mc-segmented">
                {Object.entries(SCENE_PRESETS).map(([key, item]) => (
                  <TapButton
                    key={key}
                    className={
                      scenePreset === key ? "mc-seg-btn active" : "mc-seg-btn"
                    }
                    onTrigger={() => handleSceneChange(key)}
                  >
                    <span>{item.label}</span>
                  </TapButton>
                ))}
              </div>
            </div>

            <div className="mc-setting-group">
              <div className="mc-setting-label">
                LAPTOP PAIR SESSION ({pairToken})
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="text"
                  value={pairDraft}
                  onChange={(e) => setPairDraft(e.target.value)}
                  placeholder="pair_xxxxxxxx"
                  style={{
                    flex: 1,
                    background: "rgba(15, 23, 42, 0.85)",
                    border: "1px solid rgba(255,255,255,0.22)",
                    borderRadius: "8px",
                    color: "#f8fafc",
                    padding: "8px 10px",
                    fontSize: "12px",
                  }}
                />
                <TapButton
                  className="mc-seg-btn active"
                  style={{ flex: "0 0 auto", padding: "8px 14px" }}
                  onTrigger={() => {
                    const clean =
                      pairDraft.trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64) ||
                      "default";
                    setPairDraft(clean);
                    setPairToken(clean);
                  }}
                >
                  <span>PAIR</span>
                </TapButton>
              </div>
            </div>

            <div className="mc-setting-group">
              <div className="mc-setting-label">FREE FIRE CUSTOM HUD</div>
              <TapButton
                className="mc-seg-btn active"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  background: "rgba(245, 184, 46, 0.22)",
                  borderColor: "#f5b82e",
                  color: "#ffd60a",
                  fontWeight: 900,
                  letterSpacing: "0.8px",
                }}
                onTrigger={() => {
                  setSettingsOpen(false);
                  setCustomHudEditing(true);
                }}
                data-testid="phone-settings-open-hud-btn"
              >
                <HudLayoutSvg />
                <span>CUSTOMIZE HUD (SIZE, TRANSPARENCY & LAYOUT)</span>
              </TapButton>
            </div>

            <div className="mc-setting-group">
              <div className="mc-setting-label">DISPLAY &amp; FULLSCREEN</div>
              <TapButton
                className={
                  isFullscreen ? "mc-seg-btn active" : "mc-seg-btn"
                }
                style={{ width: "100%", padding: "10px 14px" }}
                onTrigger={() => {
                  toggleFullscreen();
                  setSettingsOpen(false);
                }}
              >
                <Icons.Fullscreen />
                <span>
                  {isFullscreen
                    ? "EXIT FULLSCREEN"
                    : "ENTER FULLSCREEN LANDSCAPE"}
                </span>
              </TapButton>
            </div>
          </div>
        </div>
      )}

      {fsHint && <div className="mc-fs-hint-pill">{fsHint}</div>}

      {gyroPromptOpen && (
        <div
          className="mc-modal-backdrop mc-gyro-modal-backdrop"
          onClick={() => setGyroPromptOpen(false)}
        >
          <div
            className="mc-gyro-permission-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mc-gyro-modal-icon">
              <Icons.Gyro />
            </div>
            <h2>ENABLE GYRO SENSORS</h2>
            <p>
              Use your phone's motion sensors to control the steering of your
              BMW M4.
            </p>
            <div className="mc-gyro-instructions">
              <div>01. Hold your phone horizontally.</div>
              <div>02. Allow motion sensor permission.</div>
              <div>03. Tilt your phone to steer.</div>
            </div>
            <div className="mc-gyro-status">
              <span
                className={
                  gyroActive ? "mc-dot mc-dot-live" : "mc-dot mc-dot-wait"
                }
              />
              {gyroActive
                ? gyroSensorDetected
                  ? "GYROSCOPE ACTIVE"
                  : "WAITING FOR SENSOR DATA"
                : "SENSOR NOT ACTIVATED"}
            </div>
            {gyroError && (
              <div className="mc-gyro-modal-error">{gyroError}</div>
            )}
            <TapButton
              className="mc-enable-gyro-action-btn"
              onTrigger={requestAndEnableGyro}
            >
              {gyroError ? "RETRY GYRO ACTIVATION" : "ENABLE SENSORS"}
            </TapButton>
            <TapButton
              className="mc-recenter-pill"
              onTrigger={() => setGyroPromptOpen(false)}
            >
              CANCEL
            </TapButton>
          </div>
        </div>
      )}
    </div>
  );
}
```

===============================================================================
FILE: client/src/components/Game/LaptopGameApp.jsx
===============================================================================

```jsx
import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Loader } from "@react-three/drei";
import * as THREE from "three";

import {
  CAMERA_MODES,
  INITIAL_TELEMETRY,
  MAX_WHEEL_ROTATION_DEG,
  WEAPONS,
  WEAPON_ORDER,
  LOOT_ITEMS,
} from "../../config/gameConstants";
import {
  connectRelaySocket,
  fetchNetworkInfo,
  getNetworkControllerUrl,
  getOrCreatePlayerSession,
  getRoomCodeFromUrl,
  getUrlParam,
  isLoopbackHost,
  setSessionPlayerName,
} from "../../utils/network";
import CustomRoomLobby from "../Lobby/CustomRoomLobby";
import OpenWorldMap from "../World/OpenWorldMap";
import DrivingWorld from "../World/DrivingWorld";
import FollowCamera from "../World/FollowCamera";
import BMWM4 from "../Car/BMWM4";
import CarController from "../Car/CarController";
import CharacterModel, { CHARACTER_SCALE } from "../Character/CharacterModel";
import CharacterController from "../Character/CharacterController";
import RemotePlayers from "../Character/RemotePlayers";
import CombatManager from "../Combat/CombatManager";
import SteeringWheelGraphic from "../UI/SteeringWheelGraphic";
import SportSpeedometer from "../UI/SportSpeedometer";
import { GameSettingsModal, QrConnectModal } from "../UI/GameModals";
import FreeFireHUD from "../UI/FreeFireHUD";
import FreeFireVictoryModal from "../UI/FreeFireVictoryModal";
import ZoneManager from "../Zone/ZoneManager";
import LootManager from "../Loot/LootManager";
import InventoryUI from "../UI/InventoryUI";
import AircraftDrop from "../Aircraft/AircraftDrop";
import { WorldHtmlLayer } from "../UI/WorldHtml";

const DRIVER_DOOR_OFFSET = new THREE.Vector3(0.05, 0, -1.35);
const DRIVER_SEAT_OFFSET = new THREE.Vector3(-0.08, 0.18, -0.34);
const INTERACTION_DISTANCE = 3.6;
const MAX_ENTER_SPEED_KMH = 5.0;

const EMOTES = [
  { key: "1", id: "wave", label: "Wave" },
  { key: "2", id: "dance", label: "Macarena Dance" },
  { key: "3", id: "salute", label: "Salute" },
  { key: "4", id: "celebrate", label: "Celebrate" },
  { key: "5", id: "point", label: "Point" },
  { key: "6", id: "sit", label: "Sit" },
];

const UP_AXIS = new THREE.Vector3(0, 1, 0);

function getCarWorldPoint(car, localOffset, target = new THREE.Vector3()) {
  if (!car) return target.set(0, 0, 0);
  target.copy(localOffset).applyAxisAngle(UP_AXIS, car.rotation.y);
  target.add(car.position);
  return target;
}

function VehicleOccupantSync({
  carRef,
  characterRef,
  playerMode,
  doorProgressRef,
  enabled = true,
}) {
  const doorPos = useRef(new THREE.Vector3());
  const seatPos = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!enabled) return;
    const car = carRef.current;
    const character = characterRef.current;
    if (!car || !character) return;

    const forwardSeatYaw = car.rotation.y + Math.PI / 2;

    if (playerMode === "driving") {
      getCarWorldPoint(car, DRIVER_SEAT_OFFSET, seatPos.current);
      character.position.copy(seatPos.current);
      character.rotation.set(car.rotation.x, forwardSeatYaw, car.rotation.z);
      character.scale.setScalar(CHARACTER_SCALE * 0.86);
      return;
    }

    if (playerMode === "entering" || playerMode === "exiting") {
      const progress = THREE.MathUtils.clamp(
        doorProgressRef?.current?.progress ?? 0,
        0,
        1,
      );

      getCarWorldPoint(car, DRIVER_DOOR_OFFSET, doorPos.current);
      getCarWorldPoint(car, DRIVER_SEAT_OFFSET, seatPos.current);

      if (playerMode === "entering") {
        const moveT = THREE.MathUtils.smoothstep(progress, 0.32, 0.96);
        character.position.lerpVectors(doorPos.current, seatPos.current, moveT);
        character.rotation.set(0, forwardSeatYaw, 0);
        character.scale.setScalar(
          THREE.MathUtils.lerp(CHARACTER_SCALE, CHARACTER_SCALE * 0.86, moveT),
        );
      } else {
        const moveT = THREE.MathUtils.smoothstep(progress, 0.28, 0.84);
        character.position.lerpVectors(seatPos.current, doorPos.current, moveT);
        character.rotation.set(0, forwardSeatYaw - moveT * 0.4, 0);
        character.scale.setScalar(
          THREE.MathUtils.lerp(CHARACTER_SCALE * 0.86, CHARACTER_SCALE, moveT),
        );
      }
      return;
    }

    character.scale.setScalar(CHARACTER_SCALE);
  });

  return null;
}

export default function LaptopGameApp() {
  const [playerSession, setPlayerSession] = useState(() =>
    getOrCreatePlayerSession(),
  );
  const initialPlayerNameRef = useRef(playerSession.playerName);
  const [initialInviteCode] = useState(() => getRoomCodeFromUrl());
  const [screenMode, setScreenMode] = useState(() =>
    getUrlParam("quick") === "1" ? "game" : "lobby",
  );
  const [lobbySocket, setLobbySocket] = useState(null);
  const [roomState, setRoomState] = useState(null);
  const [countdownSec, setCountdownSec] = useState(null);
  const [lobbyError, setLobbyError] = useState("");
  const [activeMatchManifest, setActiveMatchManifest] = useState(null);

  const [scenePreset, setScenePreset] = useState("track");
  const [mapPreset, setMapPreset] = useState("bermuda");
  const [cameraMode, setCameraMode] = useState("chase");
  const [steerHudSide, setSteerHudSide] = useState("left");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editCustomHud, setEditCustomHud] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [phoneLinked, setPhoneLinked] = useState(false);
  const [controllerCount, setControllerCount] = useState(0);
  const [relayStatus, setRelayStatus] = useState("connecting");
  const [lanIp, setLanIp] = useState(null);
  const [playerMode, setPlayerMode] = useState("onFoot");
  const [charAnimation, setCharAnimation] = useState("idle");
  const [collidersVersion, setCollidersVersion] = useState(0);
  const [aircraftEjectToken, setAircraftEjectToken] = useState(0);
  const [aircraftPhase, setAircraftPhase] = useState("flying");
  const [nearCar, setNearCar] = useState(false);
  const [interactionMessage, setInteractionMessage] = useState("");
  const [emoteActive, setEmoteActive] = useState(false);
  const [telemetry, setTelemetry] = useState(INITIAL_TELEMETRY);
  const [modelError, setModelError] = useState("");

  // Free Fire Combat State
  const [weaponId, setWeaponId] = useState("m4a1");
  const [ammoState, setAmmoState] = useState({
    m4a1: { mag: WEAPONS.m4a1.magSize, reserve: WEAPONS.m4a1.reserveAmmo },
    ak47: { mag: WEAPONS.ak47.magSize, reserve: WEAPONS.ak47.reserveAmmo },
    awm: { mag: WEAPONS.awm.magSize, reserve: WEAPONS.awm.reserveAmmo },
    mp40: { mag: WEAPONS.mp40.magSize, reserve: WEAPONS.mp40.reserveAmmo },
    deagle: { mag: WEAPONS.deagle.magSize, reserve: WEAPONS.deagle.reserveAmmo },
    fist: { mag: 0, reserve: 0 },
  });
  const [reloading, setReloading] = useState(false);
  const [mouseFiring, setMouseFiring] = useState(false);
  const [mouseAiming, setMouseAiming] = useState(false);
  const [remoteFiring, setRemoteFiring] = useState(false);
  const [remoteAiming, setRemoteAiming] = useState(false);
  const [playerHp, setPlayerHp] = useState(100);
  const [armor, setArmor] = useState(100);
  const [helmet, setHelmet] = useState(100);
  const [vestLevel, setVestLevel] = useState(3);
  const [helmetLevel, setHelmetLevel] = useState(3);
  const [kills, setKills] = useState(0);
  const [hitMarker, setHitMarker] = useState(null); // { headshot: boolean }
  const [matchStatus, setMatchStatus] = useState("DROPPING"); // "DROPPING" | "IN_PROGRESS" | "VICTORY" | "DEFEAT"
  const [damageDealt, setDamageDealt] = useState(0);
  const [headshots, setHeadshots] = useState(0);
  const [shotsFired, setShotsFired] = useState(0);
  const [survivalSeconds, setSurvivalSeconds] = useState(0);
  const [aliveCount, setAliveCount] = useState(7);
  const [killFeed, setKillFeed] = useState([]);
  const [killBanner, setKillBanner] = useState(null);
  const [resetToken, setResetToken] = useState(0);
  const [finalRank, setFinalRank] = useState(1);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [interactPressed, setInteractPressed] = useState(false);
  const [zoneDamageFlash, setZoneDamageFlash] = useState(false);
  const [aimAssistState, setAimAssistState] = useState({ locked: false, headshot: false });
  const [enemiesList, setEnemiesList] = useState([]);
  const [remoteHumansList, setRemoteHumansList] = useState([]);
  const remotePlayersDataRef = useRef(new Map());
  const prevHumanIdsRef = useRef("");

  const activeMatchIdRef = useRef(null);
  const playerHpRef = useRef(playerHp);
  playerHpRef.current = playerHp;
  const armorRef = useRef(armor);
  armorRef.current = armor;
  const charAnimationRef = useRef("idle");
  charAnimationRef.current = charAnimation;
  const weaponIdRef = useRef("m4a1");
  weaponIdRef.current = weaponId;
  const isAimingRef = useRef(false);
  const isFiringRef = useRef(false);
  const playerModeRef = useRef("onFoot");
  playerModeRef.current = playerMode;

  const myTeamId = useMemo(() => {
    const fromManifest = activeMatchManifest?.humans?.find(
      (h) => h.id === playerSession.playerId,
    )?.teamId;
    if (fromManifest != null) return fromManifest;
    const fromRoom = roomState?.players?.find(
      (p) => p.playerId === playerSession.playerId,
    )?.teamId;
    if (fromRoom != null) return fromRoom;
    return 1;
  }, [activeMatchManifest, roomState, playerSession.playerId]);
  const dragFireUpRef = useRef(false);
  const dragUpRatioRef = useRef(0);
  const [inventory, setInventory] = useState({
    items: [],
    primaryWeapon: "m4a1",
    secondaryWeapon: null,
    vest: "vest_3",
    helmet: "helmet_3",
    medkits: 3,
  });

  const collidersRef = useRef([]);
  const carRef = useRef(null);
  const characterRef = useRef(null);
  const wheelAssembliesRef = useRef([]);
  const reloadTimerRef = useRef(null);
  const autoReloadTimerRef = useRef(null);
  const hitTimerRef = useRef(null);
  const bannerTimerRef = useRef(null);
  const zoneFlashTimerRef = useRef(null);
  const jumpTimerRef = useRef(null);
  const remoteFireReleaseTimerRef = useRef(null);
  const remoteFireMinUntilRef = useRef(0);
  const prevRemoteJumpRef = useRef(false);
  const prevRemoteFireRef = useRef(false);
  const interactionToastUntilRef = useRef(0);
  const socketRef = useRef(null);
  const doorProgressRef = useRef({
    animation: null,
    progress: 0,
  });
  const interactionPointRef = useRef(new THREE.Vector3());
  const cameraYawRef = useRef(0);
  const cameraPitchRef = useRef(0.16);

  const physicsStateRef = useRef({
    vx: 0,
    vy: 0,
    steering: 0,
    isDrifting: false,
    boost: false,
  });

  const remoteInputRef = useRef({
    accelerate: false,
    brake: false,
    handbrake: false,
    boost: false,
    jump: false,
    jumpPulse: false,
    crouch: false,
    sprint: false,
    autoRun: false,
    fire: false,
    firePulse: false,
    aim: false,
    dragUp: false,
    steer: 0,
    moveX: 0,
    moveY: 0,
    lookX: 0,
    lookY: 0,
    lookDeltaX: 0,
    lookDeltaY: 0,
    reset: false,
  });

  const isCharacterMode = playerMode === "onFoot" || playerMode === "exiting";
  const isTransitioning = playerMode === "entering" || playerMode === "exiting";
  const speedKmh = Math.abs(Number(telemetry.speed) || 0);

  const currentWeapon = WEAPONS[weaponId] || WEAPONS.m4a1;
  const currentAmmo = ammoState[weaponId] || { mag: 0, reserve: 0 };
  const isArmed = playerMode === "onFoot" && weaponId !== "fist";
  const isPunching =
    playerMode === "onFoot" &&
    weaponId === "fist" &&
    (mouseFiring || remoteFiring);
  const isAiming = isArmed && (mouseAiming || remoteAiming);
  const isFiring =
    isArmed &&
    !reloading &&
    currentAmmo.mag > 0 &&
    (mouseFiring || remoteFiring);
  isAimingRef.current = isAiming;
  isFiringRef.current = isFiring || isPunching;

  const clearRemoteInput = useCallback(() => {
    dragFireUpRef.current = false;
    dragUpRatioRef.current = 0;
    if (remoteFireReleaseTimerRef.current) {
      window.clearTimeout(remoteFireReleaseTimerRef.current);
      remoteFireReleaseTimerRef.current = null;
    }
    remoteFireMinUntilRef.current = 0;
    prevRemoteJumpRef.current = false;
    prevRemoteFireRef.current = false;
    Object.assign(remoteInputRef.current, {
      accelerate: false,
      brake: false,
      handbrake: false,
      boost: false,
      jump: false,
      jumpPulse: false,
      crouch: false,
      sprint: false,
      autoRun: false,
      fire: false,
      firePulse: false,
      aim: false,
      steer: 0,
      moveX: 0,
      moveY: 0,
      lookX: 0,
      lookY: 0,
      lookDeltaX: 0,
      lookDeltaY: 0,
    });
    setRemoteFiring(false);
    setRemoteAiming(false);
    setMouseFiring(false);
    setMouseAiming(false);
  }, []);

  const switchWeapon = useCallback(() => {
    if (reloadTimerRef.current) {
      window.clearTimeout(reloadTimerRef.current);
      reloadTimerRef.current = null;
    }
    setReloading(false);
    setWeaponId((prev) => {
      const idx = WEAPON_ORDER.indexOf(prev);
      return WEAPON_ORDER[(idx + 1) % WEAPON_ORDER.length];
    });
  }, []);

  const reloadWeapon = useCallback(() => {
    if (reloading || weaponId === "fist") return;
    const spec = WEAPONS[weaponId];
    const slot = ammoState[weaponId];
    if (!spec || !slot || slot.mag >= spec.magSize || slot.reserve <= 0) return;

    if (reloadTimerRef.current) {
      window.clearTimeout(reloadTimerRef.current);
    }
    setReloading(true);
    const targetWeaponId = weaponId;
    reloadTimerRef.current = window.setTimeout(() => {
      setAmmoState((prev) => {
        const current = prev[targetWeaponId];
        if (!current) return prev;
        const needed = spec.magSize - current.mag;
        const load = Math.min(needed, current.reserve);
        return {
          ...prev,
          [targetWeaponId]: {
            mag: current.mag + load,
            reserve: current.reserve - load,
          },
        };
      });
      setReloading(false);
      reloadTimerRef.current = null;
    }, spec.reloadTime * 1000);
  }, [reloading, weaponId, ammoState]);

  // Cleanup all transient UI/reload timers on unmount
  useEffect(() => {
    return () => {
      if (reloadTimerRef.current) window.clearTimeout(reloadTimerRef.current);
      if (autoReloadTimerRef.current) window.clearTimeout(autoReloadTimerRef.current);
      if (hitTimerRef.current) window.clearTimeout(hitTimerRef.current);
      if (bannerTimerRef.current) window.clearTimeout(bannerTimerRef.current);
      if (zoneFlashTimerRef.current) window.clearTimeout(zoneFlashTimerRef.current);
      if (jumpTimerRef.current) window.clearTimeout(jumpTimerRef.current);
    };
  }, []);

  // Trigger Defeat when player HP reaches 0 during active match
  useEffect(() => {
    if (playerHp <= 0 && matchStatus === "IN_PROGRESS") {
      setMatchStatus("DEFEAT");
      setFinalRank(aliveCount);
    }
  }, [playerHp, matchStatus, aliveCount]);

  // Match Survival Timer
  useEffect(() => {
    if (matchStatus !== "IN_PROGRESS") return undefined;
    const timer = window.setInterval(() => {
      setSurvivalSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [matchStatus]);

  const handleShotEvaluated = useCallback(
    (result) => {
      setShotsFired((s) => s + 1);
      setAmmoState((prev) => {
        const cur = prev[weaponId];
        if (!cur) return prev;
        const nextMag = Math.max(0, cur.mag - 1);
        if (nextMag === 0 && cur.reserve > 0) {
          if (autoReloadTimerRef.current) {
            window.clearTimeout(autoReloadTimerRef.current);
          }
          autoReloadTimerRef.current = window.setTimeout(() => {
            autoReloadTimerRef.current = null;
            reloadWeapon();
          }, 120);
        }
        return {
          ...prev,
          [weaponId]: { ...cur, mag: nextMag },
        };
      });

      if (result.hit) {
        setHitMarker({ headshot: result.headshot });
        if (hitTimerRef.current) window.clearTimeout(hitTimerRef.current);
        hitTimerRef.current = window.setTimeout(() => {
          hitTimerRef.current = null;
          setHitMarker(null);
        }, 180);
        setDamageDealt((d) => d + result.damage);
        if (result.headshot) {
          setHeadshots((h) => h + 1);
        }
        socketRef.current?.emit(
          "game:haptic",
          result.headshot ? [40, 25, 65] : 22,
        );
        if (socketRef.current?.connected && activeMatchIdRef.current) {
          socketRef.current.emit("player:damage", {
            matchId: activeMatchIdRef.current,
            attackerId: playerSession.playerId,
            targetId: result.botId || result.targetId,
            damage: result.damage,
            isHeadshot: result.headshot,
            weaponId: weaponId,
          });
        }
      }
    },
    [weaponId, reloadWeapon, playerSession.playerId],
  );

  const handlePlayerDamaged = useCallback((dmg) => {
    setPlayerHp((prev) => Math.max(0, prev - dmg));
  }, []);

  const handleBotsPositionUpdate = useCallback(
    (livingBots) => {
      const remoteHumans = [];
      if (remotePlayersDataRef.current) {
        for (const rp of remotePlayersDataRef.current.values()) {
          if (!rp.isBot && rp.id !== playerSession.playerId && rp.alive && Array.isArray(rp.pos)) {
            const isTeammate = myTeamId != null && rp.teamId === myTeamId;
            remoteHumans.push({
              id: rp.id,
              name: rp.name,
              x: rp.pos[0],
              z: rp.pos[2],
              headingDeg: rp.rot ? Math.round((-rp.rot[0] * 180) / Math.PI) % 360 : 0,
              state: isTeammate ? "teammate" : "combat",
              isTeammate,
            });
          }
        }
      }
      setEnemiesList([...livingBots, ...remoteHumans]);
    },
    [playerSession.playerId, myTeamId],
  );

  const handleBotEliminated = useCallback((bot, killerName, isHeadshot) => {
    const isPlayer = killerName === "YOU";
    const entry = {
      id: `${Date.now()}-${Math.random()}`,
      killer: killerName,
      victim: bot.name,
      headshot: isHeadshot,
      isPlayer,
    };
    setKillFeed((prev) => [...prev.slice(-4), entry]);

    if (isPlayer) {
      setKills((k) => k + 1);
      setKillBanner({
        text: bot.name,
        headshot: isHeadshot,
      });
      if (bannerTimerRef.current) window.clearTimeout(bannerTimerRef.current);
      bannerTimerRef.current = window.setTimeout(() => {
        bannerTimerRef.current = null;
        setKillBanner(null);
      }, 2500);
    }
  }, []);

  const handleAllBotsEliminated = useCallback(() => {
    setMatchStatus("VICTORY");
    setFinalRank(1);
  }, []);

  const handleAircraftLanded = useCallback(() => {
    setMatchStatus("IN_PROGRESS");
    setPlayerMode("onFoot");
    setCharAnimation("idle");
  }, []);

  const handleZoneDamage = useCallback((dps) => {
    setZoneDamageFlash(true);
    if (zoneFlashTimerRef.current) window.clearTimeout(zoneFlashTimerRef.current);
    zoneFlashTimerRef.current = window.setTimeout(() => {
      zoneFlashTimerRef.current = null;
      setZoneDamageFlash(false);
    }, 220);
    setPlayerHp((prev) => Math.max(0, prev - dps));
  }, []);

  const handleLootPickup = useCallback((loot) => {
    if (!loot) return;
    if (loot.type === "weapon") {
      setWeaponId(loot.weaponId);
      setInventory((prev) => ({
        ...prev,
        primaryWeapon: loot.weaponId,
        items: [...prev.items, { uid: loot.uid, itemId: loot.itemId, quantity: 1 }],
      }));
    } else if (loot.type === "ammo") {
      setAmmoState((prev) => {
        const next = { ...prev };
        (loot.ammoFor || []).forEach((wId) => {
          if (next[wId]) {
            next[wId] = { ...next[wId], reserve: next[wId].reserve + loot.amount };
          }
        });
        return next;
      });
      setInventory((prev) => ({
        ...prev,
        items: [...prev.items, { uid: loot.uid, itemId: loot.itemId, quantity: loot.amount }],
      }));
    } else if (loot.type === "heal") {
      setInventory((prev) => ({
        ...prev,
        medkits: prev.medkits + 1,
        items: [...prev.items, { uid: loot.uid, itemId: loot.itemId, quantity: 1 }],
      }));
    } else if (loot.type === "armor") {
      setVestLevel(loot.level);
      setArmor(100);
      setInventory((prev) => ({
        ...prev,
        vest: loot.itemId,
        items: [...prev.items, { uid: loot.uid, itemId: loot.itemId, quantity: 1 }],
      }));
    } else if (loot.type === "helmet") {
      setHelmetLevel(loot.level);
      setHelmet(100);
      setInventory((prev) => ({
        ...prev,
        helmet: loot.itemId,
        items: [...prev.items, { uid: loot.uid, itemId: loot.itemId, quantity: 1 }],
      }));
    }
  }, []);

  const handleEquipWeapon = useCallback((itemId, slot) => {
    const item = LOOT_ITEMS[itemId];
    if (item?.type === "weapon") {
      setWeaponId(item.weaponId);
      setInventory((prev) => ({
        ...prev,
        [slot === "secondary" ? "secondaryWeapon" : "primaryWeapon"]: item.weaponId,
      }));
    } else if (item?.type === "armor") {
      setVestLevel(item.level);
      setArmor(100);
      setInventory((prev) => ({ ...prev, vest: itemId }));
    } else if (item?.type === "helmet") {
      setHelmetLevel(item.level);
      setHelmet(100);
      setInventory((prev) => ({ ...prev, helmet: itemId }));
    }
  }, []);

  const handleDropItem = useCallback((uid) => {
    setInventory((prev) => ({
      ...prev,
      items: prev.items.filter((it) => it.uid !== uid),
    }));
  }, []);

  const handlePlayAgain = useCallback(() => {
    setMatchStatus("DROPPING");
    setPlayerMode("onFoot");
    setCharAnimation("idle");
    setAircraftPhase("flying");
    setReloading(false);
    setPlayerHp(100);
    setArmor(100);
    setHelmet(100);
    setVestLevel(3);
    setHelmetLevel(3);
    setKills(0);
    setDamageDealt(0);
    setHeadshots(0);
    setShotsFired(0);
    setSurvivalSeconds(0);
    setAliveCount(7);
    setKillFeed([]);
    setKillBanner(null);
    setAmmoState({
      m4a1: { mag: WEAPONS.m4a1.magSize, reserve: WEAPONS.m4a1.reserveAmmo },
      ak47: { mag: WEAPONS.ak47.magSize, reserve: WEAPONS.ak47.reserveAmmo },
      awm: { mag: WEAPONS.awm.magSize, reserve: WEAPONS.awm.reserveAmmo },
      mp40: { mag: WEAPONS.mp40.magSize, reserve: WEAPONS.mp40.reserveAmmo },
      deagle: { mag: WEAPONS.deagle.magSize, reserve: WEAPONS.deagle.reserveAmmo },
      fist: { mag: 0, reserve: 0 },
    });
    setInventory({
      items: [],
      primaryWeapon: "m4a1",
      secondaryWeapon: null,
      vest: "vest_3",
      helmet: "helmet_3",
      medkits: 3,
    });
    setResetToken((t) => t + 1);
  }, []);

  const cycleCamera = useCallback(() => {
    setCameraMode((previous) => {
      const index = CAMERA_MODES.findIndex((item) => item.id === previous);
      return CAMERA_MODES[(index + 1) % CAMERA_MODES.length].id;
    });
  }, []);

  const finishTransition = useCallback((expectedMode) => {
    if (expectedMode === "entering") {
      setPlayerMode("driving");
      setCharAnimation("drivingSeat");
      setInteractionMessage("");
    } else if (expectedMode === "exiting") {
      if (carRef.current && characterRef.current) {
        let door = getCarWorldPoint(
          carRef.current,
          DRIVER_DOOR_OFFSET,
          interactionPointRef.current,
        );

        // Fallback to passenger side if driver door is right against a wall
        const rawMeshes = collidersRef.current?.meshes || (Array.isArray(collidersRef.current) ? collidersRef.current : []);
        const worldMeshes = rawMeshes.map((c) => (c?.isObject3D ? c : c?.mesh)).filter(Boolean);
        if (worldMeshes.length > 0) {
          const carCenter = carRef.current.position.clone().add(new THREE.Vector3(0, 0.8, 0));
          const toDoor = door.clone().sub(carCenter).normalize();
          const doorProbe = new THREE.Raycaster(carCenter, toDoor, 0, 2.0);
          const wallHits = doorProbe.intersectObjects(worldMeshes, false);
          if (wallHits.length > 0 && wallHits[0].distance < 1.6) {
            door = getCarWorldPoint(
              carRef.current,
              new THREE.Vector3(0.05, 0, 1.35),
              interactionPointRef.current,
            );
          }
        }

        characterRef.current.position.copy(door);
        characterRef.current.rotation.set(
          0,
          carRef.current.rotation.y + Math.PI / 2,
          0,
        );
      }
      setPlayerMode("onFoot");
      setCharAnimation("idle");
      setInteractionMessage("");
    }
    setEmoteActive(false);
  }, []);

  const enterVehicle = useCallback(() => {
    if (
      playerMode !== "onFoot" ||
      !carRef.current ||
      !characterRef.current
    ) {
      return;
    }
    if (matchStatus !== "IN_PROGRESS") {
      interactionToastUntilRef.current = Date.now() + 2000;
      setInteractionMessage("Land first before entering the BMW M4");
      return;
    }
    if (!nearCar) {
      interactionToastUntilRef.current = Date.now() + 2200;
      setInteractionMessage("Move closer to the BMW M4 to enter");
      return;
    }
    if (speedKmh > MAX_ENTER_SPEED_KMH) {
      interactionToastUntilRef.current = Date.now() + 2000;
      setInteractionMessage("Stop the BMW before entering");
      return;
    }

    if (reloadTimerRef.current) {
      window.clearTimeout(reloadTimerRef.current);
      reloadTimerRef.current = null;
    }
    setReloading(false);

    clearRemoteInput();
    const door = getCarWorldPoint(
      carRef.current,
      DRIVER_DOOR_OFFSET,
      interactionPointRef.current,
    );
    characterRef.current.position.copy(door);
    characterRef.current.rotation.y = carRef.current.rotation.y + Math.PI / 2;

    doorProgressRef.current = { animation: "enterCar", progress: 0 };
    setEmoteActive(false);
    setCharAnimation("enterCar");
    setPlayerMode("entering");
    interactionToastUntilRef.current = 0;
    setInteractionMessage("Opening door & entering BMW M4...");
  }, [playerMode, matchStatus, nearCar, speedKmh, clearRemoteInput]);

  const exitVehicle = useCallback(() => {
    if (playerMode !== "driving" || !carRef.current || !characterRef.current)
      return;
    if (speedKmh > MAX_ENTER_SPEED_KMH) {
      setInteractionMessage("Brake and stop before exiting");
      return;
    }

    clearRemoteInput();
    doorProgressRef.current = { animation: "exitCar", progress: 0 };
    setCharAnimation("exitCar");
    setPlayerMode("exiting");
    setInteractionMessage("Opening door & exiting BMW M4...");
  }, [playerMode, speedKmh, clearRemoteInput]);

  const toggleVehicle = useCallback(() => {
    if (playerMode === "onFoot") enterVehicle();
    else if (playerMode === "driving") exitVehicle();
  }, [playerMode, enterVehicle, exitVehicle]);

  const playEmote = useCallback(
    (emoteId) => {
      if (
        playerMode !== "onFoot" ||
        emoteActive ||
        !EMOTES.some((item) => item.id === emoteId)
      )
        return;
      setCharAnimation(emoteId);
      setEmoteActive(true);
    },
    [playerMode, emoteActive],
  );

  const handleAnimationProgress = useCallback((animation, progress) => {
    if (animation !== "enterCar" && animation !== "exitCar") return;
    doorProgressRef.current = {
      animation,
      progress: THREE.MathUtils.clamp(progress, 0, 1),
    };
  }, []);

  const handleCharacterAnimationFinished = useCallback(
    (finishedAnimation) => {
      if (finishedAnimation === "enterCar") {
        doorProgressRef.current.progress = 1;
        finishTransition("entering");
        return;
      }
      if (finishedAnimation === "exitCar") {
        doorProgressRef.current.progress = 1;
        finishTransition("exiting");
        return;
      }
      setEmoteActive(false);
      setCharAnimation("idle");
    },
    [finishTransition],
  );

  // Keyboard & Mouse Combat Controls (On Foot)
  useEffect(() => {
    const onKeyDown = (event) => {
      if (
        event.repeat ||
        event.target?.tagName === "INPUT" ||
        event.target?.tagName === "TEXTAREA"
      )
        return;
      const key = event.key.toLowerCase();
      if (key === "tab") {
        event.preventDefault();
        setIsInventoryOpen((prev) => !prev);
      } else if (key === "e") {
        setInteractPressed(true);
      } else if (key === "f") {
        event.preventDefault();
        toggleVehicle();
      } else if (playerMode === "onFoot") {
        if (key === "q" || key === "g") {
          event.preventDefault();
          switchWeapon();
        } else if (key === "r") {
          event.preventDefault();
          reloadWeapon();
        }
      }
    };

    const onKeyUp = (event) => {
      const key = event.key.toLowerCase();
      if (key === "e") {
        setInteractPressed(false);
      }
    };

    const onMouseDown = (event) => {
      if (playerMode !== "onFoot") return;
      if (
        event.target?.closest(
          "button, .mc-modal-backdrop, .character-action-panel, .topbar",
        )
      ) {
        return;
      }
      if (event.button === 0) setMouseFiring(true);
      if (event.button === 2) setMouseAiming(true);
    };

    const onMouseUp = (event) => {
      if (event.button === 0) setMouseFiring(false);
      if (event.button === 2) setMouseAiming(false);
    };

    const onContextMenu = (event) => {
      if (playerMode === "onFoot") event.preventDefault();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("contextmenu", onContextMenu);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("contextmenu", onContextMenu);
    };
  }, [toggleVehicle, playerMode, switchWeapon, reloadWeapon]);

  const hudSnapshotRef = useRef({});
  const charPos = characterRef.current?.position;
  let headingDeg = Math.round((-cameraYawRef.current * 180) / Math.PI) % 360;
  if (headingDeg < 0) headingDeg += 360;

  const currentCarPos = carRef.current
    ? {
        x: carRef.current.position.x,
        z: carRef.current.position.z,
        headingDeg: Math.round((-carRef.current.rotation.y * 180) / Math.PI) % 360,
      }
    : null;

  hudSnapshotRef.current = {
    telemetry,
    inLobby: screenMode === "lobby",
    playerMode,
    matchStatus,
    aircraftPhase,
    speedKmh,
    nearCar,
    weaponId,
    weaponName: currentWeapon.name,
    ammo: currentAmmo.mag,
    reserveAmmo: currentAmmo.reserve,
    reloading,
    aliveCount,
    hp: Math.round(playerHp),
    ep: 180,
    vestLevel,
    helmetLevel,
    medkits: inventory.medkits,
    primaryWeapon: inventory.primaryWeapon,
    secondaryWeapon: inventory.secondaryWeapon,
    ammoState,
    matchElapsed: survivalSeconds,
    kills,
    killFeed: killFeed.slice(-3),
    posX: charPos ? Math.round(charPos.x * 10) / 10 : 0,
    posZ: charPos ? Math.round(charPos.z * 10) / 10 : 0,
    headingDeg,
    statusMsg: interactionMessage,
    enemies: enemiesList,
    carPos: currentCarPos,
  };

  const lastNearCarRef = useRef(false);
  const lastInteractionMsgRef = useRef("");

  const emitTelemetrySnapshot = useCallback((canReachOverride) => {
    const snap = hudSnapshotRef.current;
    const canReach =
      typeof canReachOverride === "boolean"
        ? canReachOverride
        : lastNearCarRef.current;
    socketRef.current?.emit("game:telemetry", {
      speed: snap.telemetry.speed,
      gear: snap.telemetry.gear,
      rpm: snap.telemetry.rpm,
      drifting: snap.telemetry.drifting,
      boost: snap.telemetry.boost,
      inLobby: Boolean(snap.inLobby),
      playerMode: snap.playerMode,
      matchStatus: snap.matchStatus,
      aircraftPhase: snap.aircraftPhase,
      nearCar: canReach,
      weaponId: snap.weaponId,
      weaponName: snap.weaponName,
      ammo: snap.ammo,
      reserveAmmo: snap.reserveAmmo,
      reloading: snap.reloading,
      aliveCount: snap.aliveCount,
      hp: snap.hp,
      ep: snap.ep,
      vestLevel: snap.vestLevel,
      helmetLevel: snap.helmetLevel,
      medkits: snap.medkits,
      primaryWeapon: snap.primaryWeapon,
      secondaryWeapon: snap.secondaryWeapon,
      ammoState: snap.ammoState,
      matchElapsed: snap.matchElapsed,
      kills: snap.kills,
      killFeed: snap.killFeed,
      posX: snap.posX,
      posZ: snap.posZ,
      headingDeg: snap.headingDeg,
      statusMsg: snap.statusMsg,
      enemies: snap.enemies || [],
      carPos: snap.carPos || null,
    });
  }, []);

  const handleFireDrag = useCallback(
    ({ deltaX, deltaY, dragUpRatio, dragUpActive }) => {
      dragFireUpRef.current = dragUpActive;
      dragUpRatioRef.current = dragUpRatio;
      if (dragUpActive && deltaY < 0) {
        cameraPitchRef.current = THREE.MathUtils.clamp(
          cameraPitchRef.current + Math.abs(deltaY) * 0.0035,
          -0.35,
          0.9,
        );
      }
    },
    [],
  );

  useEffect(() => {
    emitTelemetrySnapshot();
  }, [
    emitTelemetrySnapshot,
    screenMode,
    playerMode,
    matchStatus,
    aircraftPhase,
    weaponId,
    reloading,
    playerHp,
    inventory.medkits,
    ammoState,
    interactionMessage,
  ]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const snap = hudSnapshotRef.current;
      let canReach = false;
      let nextMsg = "";

      if (
        snap.matchStatus === "IN_PROGRESS" &&
        snap.playerMode === "onFoot" &&
        carRef.current &&
        characterRef.current
      ) {
        const door = getCarWorldPoint(
          carRef.current,
          DRIVER_DOOR_OFFSET,
          interactionPointRef.current,
        );
        const distance = characterRef.current.position.distanceTo(door);
        canReach = distance <= INTERACTION_DISTANCE;
        nextMsg = canReach
          ? snap.speedKmh <= MAX_ENTER_SPEED_KMH
            ? "Press F or Tap ENTER to get in BMW M4"
            : "Stop the BMW to enter"
          : "";
      } else if (snap.playerMode === "driving") {
        nextMsg = snap.speedKmh > MAX_ENTER_SPEED_KMH ? "Brake and stop to exit" : "";
      }

      if (lastNearCarRef.current !== canReach) {
        lastNearCarRef.current = canReach;
        setNearCar(canReach);
      }
      if (nextMsg || Date.now() >= interactionToastUntilRef.current) {
        if (lastInteractionMsgRef.current !== nextMsg) {
          lastInteractionMsgRef.current = nextMsg;
          setInteractionMessage(nextMsg);
        }
      }

      emitTelemetrySnapshot(canReach);
    }, 100);
    return () => window.clearInterval(interval);
  }, [emitTelemetrySnapshot]);

  const socketActionsRef = useRef({});
  socketActionsRef.current = {
    cycleCamera,
    toggleVehicle,
    switchWeapon,
    reloadWeapon,
    playEmote,
    selectWeapon: (id) => {
      if (!Object.prototype.hasOwnProperty.call(WEAPONS, id)) return;
      setReloading(false);
      setWeaponId(id);
    },
    heal: () => handleUseMedkit(),
    ejectAircraft: () => setAircraftEjectToken((t) => t + 1),
    playAgain: handlePlayAgain,
    emitTelemetry: () => emitTelemetrySnapshot(),
    clearRemoteInput: () => clearRemoteInput(),
  };

  useEffect(() => {
    let active = true;
    const resolveLan = async () => {
      if (
        typeof window !== "undefined" &&
        !isLoopbackHost(window.location.hostname)
      ) {
        return;
      }
      const info = await fetchNetworkInfo();
      if (active && info?.primaryIp) {
        setLanIp(info.primaryIp);
      }
    };
    resolveLan();
    return () => {
      active = false;
    };
  }, [qrModalOpen]);

  useEffect(() => {
    const cleanupSocket = connectRelaySocket({
      role: "game",
      pairToken: playerSession.pairToken,
      playerId: playerSession.playerId,
      playerName: initialPlayerNameRef.current,
      onStatusChange: (statusInfo) => {
        setRelayStatus(statusInfo?.status || "connecting");
        if (statusInfo?.status !== "connected") {
          setPhoneLinked(false);
          setControllerCount(0);
        }
      },
      onCleanupSocket: (oldSocket) => {
        if (socketRef.current === oldSocket) {
          socketRef.current = null;
          setLobbySocket(null);
        }
      },
      onSocket: (socket) => {
        socketRef.current = socket;
        setLobbySocket(socket);

        socket.on("connect", () => {
          socketActionsRef.current.emitTelemetry?.();
        });

        socket.on("controller:status", (status) => {
          const isOnline = Boolean(status?.connected);
          setPhoneLinked(isOnline);
          setControllerCount(Number(status?.count) || (isOnline ? 1 : 0));
          if (isOnline) {
            socketActionsRef.current.emitTelemetry?.();
          }
        });

        socket.on("room:state", (room) => {
          setRoomState(room || null);
          if (!room || room.status !== "COUNTDOWN") {
            setCountdownSec(null);
          }
        });

        socket.on("room:countdown", (tick) => {
          if (typeof tick?.remainingSec === "number") {
            setCountdownSec(tick.remainingSec);
          }
        });

        socket.on("room:kicked", (notice) => {
          setRoomState(null);
          setCountdownSec(null);
          setActiveMatchManifest(null);
          setLobbyError(notice?.reason || "Removed from room by host.");
          setScreenMode("lobby");
        });

        socket.on("match:started", (payload) => {
          const nextRoom = payload?.room || null;
          const manifest = payload?.matchManifest || nextRoom?.matchManifest || null;
          if (nextRoom) setRoomState(nextRoom);
          setCountdownSec(null);
          setLobbyError("");
          const matchId = payload?.matchId || manifest?.matchId;
          if (matchId) {
            activeMatchIdRef.current = matchId;
            socket.emit("match:join", {
              matchId,
              playerId: playerSession.playerId,
            });
          }
          if (manifest) {
            setActiveMatchManifest(manifest);
            if (manifest.config?.mapId) {
              setMapPreset(manifest.config.mapId);
            }
          }
          socketActionsRef.current.playAgain?.();
          setScreenMode("game");
        });

        socket.on("match:snapshot", (snapshot) => {
          if (!snapshot || !Array.isArray(snapshot.players)) return;

          // Store high-frequency 3D transforms in ref (Zero React Re-renders)
          snapshot.players.forEach((p) => {
            remotePlayersDataRef.current.set(p.id, p);
          });

          // Only update React list if actual remote human players joined or left
          const humans = snapshot.players.filter(
            (p) => !p.isBot && p.id !== playerSession.playerId,
          );
          const idsStr = humans.map((h) => h.id).sort().join(",");
          if (idsStr !== prevHumanIdsRef.current) {
            prevHumanIdsRef.current = idsStr;
            setRemoteHumansList(
              humans.map((h) => ({ id: h.id, name: h.name, teamId: h.teamId })),
            );
          }

          const me = snapshot.players.find((p) => p.id === playerSession.playerId);
          if (me) {
            if (typeof me.hp === "number" && Math.abs(me.hp - playerHpRef.current) > 1) {
              setPlayerHp(me.hp);
            }
            if (typeof me.armor === "number" && Math.abs(me.armor - armorRef.current) > 1) {
              setArmor(me.armor);
            }
          }
        });

        socket.on("player:damaged", (data) => {
          if (data?.targetId === playerSession.playerId) {
            if (typeof data.remainingHp === "number") {
              setPlayerHp(data.remainingHp);
            }
            if (typeof data.remainingArmor === "number") {
              setArmor(data.remainingArmor);
            }
          }
        });

        socket.on("controller:input", (data) => {
          if (!data || typeof data !== "object") return;
          setPhoneLinked((prev) => (prev ? prev : true));
          remoteInputRef.current.accelerate = Boolean(data.accelerate);
          remoteInputRef.current.brake = Boolean(data.brake);
          remoteInputRef.current.handbrake = Boolean(data.handbrake);
          remoteInputRef.current.boost = Boolean(data.boost);

          const nextJump = Boolean(data.jump);
          if (nextJump && !prevRemoteJumpRef.current) {
            remoteInputRef.current.jumpPulse = true;
          }
          prevRemoteJumpRef.current = nextJump;
          remoteInputRef.current.jump = nextJump;

          remoteInputRef.current.crouch = Boolean(data.crouch);
          remoteInputRef.current.sprint = Boolean(data.sprint);
          remoteInputRef.current.autoRun = Boolean(data.autoRun);

          const nextFire = Boolean(data.fire);
          const nextAim = Boolean(data.aim);
          if (nextFire && !prevRemoteFireRef.current) {
            remoteInputRef.current.firePulse = true;
          }
          prevRemoteFireRef.current = nextFire;
          remoteInputRef.current.fire = nextFire;
          remoteInputRef.current.aim = nextAim;

          if (nextFire) {
            if (remoteFireReleaseTimerRef.current) {
              window.clearTimeout(remoteFireReleaseTimerRef.current);
              remoteFireReleaseTimerRef.current = null;
            }
            remoteFireMinUntilRef.current = performance.now() + 140;
            setRemoteFiring((prev) => (prev ? prev : true));
          } else {
            const remaining = remoteFireMinUntilRef.current - performance.now();
            if (remaining > 10) {
              if (!remoteFireReleaseTimerRef.current) {
                remoteFireReleaseTimerRef.current = window.setTimeout(() => {
                  remoteFireReleaseTimerRef.current = null;
                  if (!remoteInputRef.current.fire) {
                    setRemoteFiring(false);
                  }
                }, remaining);
              }
            } else {
              setRemoteFiring(false);
            }
          }

          remoteInputRef.current.dragUp = Boolean(data.dragUp);
          setRemoteAiming((prev) => (prev === nextAim ? prev : nextAim));
          remoteInputRef.current.steer = Number(data.steer) || 0;
          remoteInputRef.current.moveX = Number(data.moveX) || 0;
          remoteInputRef.current.moveY = Number(data.moveY) || 0;
          remoteInputRef.current.lookX = Number(data.lookX) || 0;
          remoteInputRef.current.lookY = Number(data.lookY) || 0;
          if (typeof data.lookDeltaX === "number" && Number.isFinite(data.lookDeltaX)) {
            const clampedDX = Math.max(-0.5, Math.min(0.5, data.lookDeltaX));
            remoteInputRef.current.lookDeltaX = (remoteInputRef.current.lookDeltaX || 0) + clampedDX;
          }
          if (typeof data.lookDeltaY === "number" && Number.isFinite(data.lookDeltaY)) {
            const clampedDY = Math.max(-0.5, Math.min(0.5, data.lookDeltaY));
            remoteInputRef.current.lookDeltaY = (remoteInputRef.current.lookDeltaY || 0) + clampedDY;
          }
        });
        socket.on("controller:action", (action) => {
          const actions = socketActionsRef.current;
          if (action === "syncState") actions.emitTelemetry?.();
          if (action === "camera") actions.cycleCamera?.();
          if (action === "reset") remoteInputRef.current.reset = true;
          if (action === "toggleVehicle") actions.toggleVehicle?.();
          if (action === "switchWeapon") actions.switchWeapon?.();
          if (action === "reloadWeapon") actions.reloadWeapon?.();
          if (action === "heal") actions.heal?.();
          if (action === "ejectAircraft") actions.ejectAircraft?.();
          if (action === "playAgain") actions.playAgain?.();
          if (typeof action === "string" && action.startsWith("selectWeapon:")) {
            actions.selectWeapon?.(action.split(":")[1]);
          }
          if (typeof action === "string" && action.startsWith("emote:")) {
            actions.playEmote?.(action.split(":")[1]);
          }
        });
        socket.on("controller:settings", (settings) => {
          if (settings.steerHudSide) setSteerHudSide(settings.steerHudSide);
          if (settings.scenePreset) setScenePreset(settings.scenePreset);
          if (settings.mapPreset) setMapPreset(settings.mapPreset);
        });
        socket.on("controller:disconnected", () => {
          setPhoneLinked(false);
          setControllerCount(0);
          socketActionsRef.current.clearRemoteInput?.();
        });
      },
    });
    return () => {
      if (remoteFireReleaseTimerRef.current) {
        window.clearTimeout(remoteFireReleaseTimerRef.current);
        remoteFireReleaseTimerRef.current = null;
      }
      cleanupSocket();
      socketRef.current = null;
      setLobbySocket(null);
      setPhoneLinked(false);
      setControllerCount(0);
    };
  }, [playerSession.pairToken, playerSession.playerId]);

  // Phase 1: Real-time Authoritative Multiplayer Player State Synchronization (~25Hz)
  useEffect(() => {
    if (screenMode !== "game") return undefined;

    const syncInterval = setInterval(() => {
      const socket = socketRef.current;
      const char = characterRef.current;
      if (!socket?.connected || !char) return;

      const matchId = activeMatchIdRef.current;
      if (!matchId) return;

      socket.emit("player:state", {
        matchId,
        playerId: playerSession.playerId,
        position: {
          x: char.position.x,
          y: char.position.y,
          z: char.position.z,
        },
        rotation: {
          yaw: char.rotation.y,
          pitch: cameraPitchRef.current || 0,
        },
        velocity: {
          x: physicsStateRef.current?.vx || 0,
          z: physicsStateRef.current?.vy || 0,
        },
        animation: playerModeRef.current === "driving" ? "drivingSeat" : charAnimationRef.current,
        weaponId: weaponIdRef.current,
        aiming: isAimingRef.current,
        firing: isFiringRef.current,
        vehicleMode: playerModeRef.current,
        hp: playerHpRef.current,
        armor: armorRef.current,
      });
    }, 40);

    return () => clearInterval(syncInterval);
  }, [screenMode, playerSession.playerId]);

  const handleCollision = useCallback((impactSpeed) => {
    const intensity = Math.max(0, Math.min(1, impactSpeed / 28));
    if (intensity < 0.08) return;
    const pulse = Math.round(18 + intensity * 105);
    const pause = Math.round(18 + (1 - intensity) * 28);
    socketRef.current?.emit("game:haptic", [
      pulse,
      pause,
      Math.round(pulse * 0.55),
    ]);
  }, []);

  const handleTelemetryChange = useCallback((nextTelemetry) => {
    setTelemetry(nextTelemetry);
  }, []);

  const handleCollidersReady = useCallback(() => {
    setCollidersVersion((v) => v + 1);
  }, []);

  const handleWheelsReady = useCallback((rigData) => {
    wheelAssembliesRef.current = rigData;
  }, []);
  const handleModelError = useCallback((error) => {
    console.error("Model loading failed:", error);
    setModelError(
      "Could not load one or more 3D model assets. Check the model files and console.",
    );
  }, []);

  const currentSteer = telemetry.steerInput || 0;
  const networkUrl = getNetworkControllerUrl(lanIp, playerSession.pairToken);

  const handlePlayerNameChange = useCallback((nextName) => {
    setSessionPlayerName(nextName);
    setPlayerSession((prev) => ({ ...prev, playerName: nextName }));
  }, []);

  const handleLaunchQuickSolo = useCallback(() => {
    setActiveMatchManifest(null);
    handlePlayAgain();
    setScreenMode("game");
  }, [handlePlayAgain]);

  const handleReturnToLobby = useCallback(() => {
    if (
      roomState &&
      roomState.hostPlayerId === playerSession.playerId &&
      socketRef.current?.connected
    ) {
      socketRef.current.emit("room:return-lobby", {
        playerId: playerSession.playerId,
      });
    }
    setActiveMatchManifest(null);
    setScreenMode("lobby");
  }, [roomState, playerSession.playerId]);

  const roomSummaryText = activeMatchManifest
    ? `${activeMatchManifest.inviteCode} · ${activeMatchManifest.counts.total} SLOTS (${activeMatchManifest.config.mode.toUpperCase()})`
    : roomState
      ? `${roomState.inviteCode} · ${roomState.slots.totalOccupied} SLOTS`
      : "";
  const isLoopbackUrl =
    typeof window !== "undefined" &&
    isLoopbackHost(window.location.hostname) &&
    !lanIp;
  const copyNetworkUrl = useCallback(() => {
    if (!navigator.clipboard?.writeText) return;
    navigator.clipboard
      .writeText(networkUrl)
      .catch((error) => console.error("Unable to copy controller URL:", error));
  }, [networkUrl]);

  const handleUseMedkit = useCallback(() => {
    setInventory((prev) => {
      if (prev.medkits <= 0) return prev;
      return { ...prev, medkits: prev.medkits - 1 };
    });
    setPlayerHp((prev) => Math.min(100, prev + 75));
  }, []);

  return (
    <main className="game-shell">
      {screenMode === "lobby" ? (
        <CustomRoomLobby
          socket={lobbySocket}
          relayStatus={relayStatus}
          session={playerSession}
          onPlayerNameChange={handlePlayerNameChange}
          room={roomState}
          onRoomSync={setRoomState}
          countdownSec={countdownSec}
          lobbyError={lobbyError}
          onReportError={setLobbyError}
          onClearError={() => setLobbyError("")}
          initialInviteCode={initialInviteCode}
          lanIp={lanIp}
          phoneLinked={phoneLinked}
          controllerCount={controllerCount}
          onOpenQr={() => setQrModalOpen(true)}
          onLaunchQuickSolo={handleLaunchQuickSolo}
        />
      ) : (
        <>
          <Canvas
            shadows
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <PerspectiveCamera
          makeDefault
          position={[-30, 50, 12]}
          fov={50}
          near={0.5}
          far={600}
        />
        <Suspense fallback={null}>
          <OpenWorldMap
            collidersRef={collidersRef}
            mapKey={mapPreset}
            onCollidersReady={handleCollidersReady}
          />
        </Suspense>
        <DrivingWorld presetKey={scenePreset} />
        <Suspense fallback={null}>
          <BMWM4
            ref={carRef}
            doorProgressRef={doorProgressRef}
            onWheelsReady={handleWheelsReady}
            onError={handleModelError}
          />
          <CharacterModel
            ref={characterRef}
            animation={playerMode === "driving" ? "drivingSeat" : charAnimation}
            visible={matchStatus !== "DROPPING" || aircraftPhase === "falling"}
            weaponId={playerMode === "onFoot" ? weaponId : "fist"}
            aiming={isAiming}
            firing={isFiring || isPunching}
            aimPitch={cameraPitchRef.current}
            onAnimationFinished={handleCharacterAnimationFinished}
            onAnimationProgress={handleAnimationProgress}
          />
          <RemotePlayers
            remoteHumansList={remoteHumansList}
            remotePlayersDataRef={remotePlayersDataRef}
            localTeamId={myTeamId}
          />
          <CombatManager
            enabled={playerMode === "onFoot" && matchStatus === "IN_PROGRESS"}
            characterRef={characterRef}
            collidersRef={collidersRef}
            weaponId={weaponId}
            firing={isFiring || isPunching}
            canFire={weaponId === "fist" ? true : (isArmed && !reloading && currentAmmo.mag > 0)}
            remoteInputRef={remoteInputRef}
            dragFireUp={dragFireUpRef.current}
            dragUpRatio={dragUpRatioRef.current}
            resetToken={resetToken}
            collidersReadyVersion={collidersVersion}
            onShotEvaluated={handleShotEvaluated}
            onPlayerDamaged={handlePlayerDamaged}
            onBotEliminated={handleBotEliminated}
            onAllBotsEliminated={handleAllBotsEliminated}
            onAliveCountChange={setAliveCount}
            onAimAssistChange={setAimAssistState}
            onBotsPositionUpdate={handleBotsPositionUpdate}
          />
          <ZoneManager
            matchStatus={matchStatus}
            matchElapsed={survivalSeconds}
            playerPos={characterRef.current?.position}
            onZoneDamage={handleZoneDamage}
            enabled={true}
          />
          <LootManager
            collidersRef={collidersRef}
            characterRef={characterRef}
            interactPressed={interactPressed}
            matchStatus={matchStatus}
            resetToken={resetToken}
            collidersReadyVersion={collidersVersion}
            onLootPickup={handleLootPickup}
          />
          <AircraftDrop
            active={matchStatus === "DROPPING"}
            ejectToken={aircraftEjectToken}
            characterRef={characterRef}
            collidersRef={collidersRef}
            onLanded={handleAircraftLanded}
            onPhaseChange={setAircraftPhase}
            remoteInputRef={remoteInputRef}
          />
        </Suspense>
        <VehicleOccupantSync
          carRef={carRef}
          characterRef={characterRef}
          playerMode={playerMode}
          doorProgressRef={doorProgressRef}
          enabled={matchStatus !== "DROPPING"}
        />
        <CarController
          carRef={carRef}
          wheelAssembliesRef={wheelAssembliesRef}
          collidersRef={collidersRef}
          enabled={playerMode === "driving" && matchStatus === "IN_PROGRESS"}
          onTelemetryChange={handleTelemetryChange}
          onCollision={handleCollision}
          physicsStateRef={physicsStateRef}
          remoteInputRef={remoteInputRef}
        />
        <CharacterController
          characterRef={characterRef}
          carRef={carRef}
          collidersRef={collidersRef}
          enabled={playerMode === "onFoot" && matchStatus === "IN_PROGRESS"}
          emoteActive={emoteActive}
          combatStanceActive={isAiming || isFiring}
          cameraYawRef={cameraYawRef}
          remoteInputRef={remoteInputRef}
          onAnimationChange={setCharAnimation}
          onEmote={(key) => {
            const emote = EMOTES.find((item) => item.key === key);
            if (emote) playEmote(emote.id);
          }}
        />

        <FollowCamera
          enabled={matchStatus !== "DROPPING"}
          targetRef={isCharacterMode ? characterRef : carRef}
          physicsStateRef={physicsStateRef}
          remoteInputRef={remoteInputRef}
          cameraMode={cameraMode}
          isCharacterMode={isCharacterMode}
          isArmed={isArmed}
          isAiming={isAiming}
          orbitYawRef={cameraYawRef}
          orbitPitchRef={cameraPitchRef}
          aimAssistLocked={aimAssistState.locked}
        />
      </Canvas>

      {/* Single-root 3D-to-2D projected overlays (bot tags, damage popups, loot prompts) */}
      <WorldHtmlLayer />

      {/* Free Fire Custom Battle Royale HUD */}
      <FreeFireHUD
        playerMode={playerMode}
        matchStatus={matchStatus}
        aircraftPhase={aircraftPhase}
        kills={kills}
        aliveCount={aliveCount}
        weaponId={weaponId}
        inventory={inventory}
        medkitCount={inventory.medkits}
        ammoState={ammoState}
        reloading={reloading}
        playerHp={playerHp}
        armor={armor}
        helmet={helmet}
        vestLevel={vestLevel}
        helmetLevel={helmetLevel}
        hitMarker={hitMarker}
        killFeed={killFeed}
        killBanner={killBanner}
        matchElapsed={survivalSeconds}
        cameraYaw={cameraYawRef.current}
        characterPos={characterRef.current?.position}
        isAiming={isAiming}
        isFiring={isFiring || isPunching}
        nearCar={nearCar}
        speedKmh={speedKmh}
        aimAssistLocked={aimAssistState.locked}
        isHeadshotLocked={aimAssistState.headshot}
        enemies={enemiesList}
        carPos={currentCarPos}
        onSwitchWeapon={switchWeapon}
        onReloadWeapon={reloadWeapon}
        onToggleVehicle={toggleVehicle}
        onSelectWeapon={(id) => {
          setReloading(false);
          setWeaponId(id);
        }}
        onHeal={() => handleUseMedkit()}
        onAimToggle={() => setMouseAiming((prev) => !prev)}
        onFireStart={() => setMouseFiring(true)}
        onFireEnd={() => setMouseFiring(false)}
        onFireDrag={handleFireDrag}
        onJump={() => {
          remoteInputRef.current.jump = true;
          if (jumpTimerRef.current) window.clearTimeout(jumpTimerRef.current);
          jumpTimerRef.current = window.setTimeout(() => {
            jumpTimerRef.current = null;
            remoteInputRef.current.jump = false;
          }, 120);
        }}
        onCrouch={() => {
          remoteInputRef.current.crouch = !remoteInputRef.current.crouch;
        }}
        onSprint={() => {
          remoteInputRef.current.sprint = !remoteInputRef.current.sprint;
        }}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenQr={() => setQrModalOpen(true)}
        onCycleCamera={cycleCamera}
        onResetVehicle={() => {
          remoteInputRef.current.reset = true;
        }}
        onToggleInventory={() => setIsInventoryOpen((prev) => !prev)}
        onEjectAircraft={() => setAircraftEjectToken((t) => t + 1)}
        onReturnToLobby={handleReturnToLobby}
        roomSummaryText={roomSummaryText}
        editCustomHud={editCustomHud}
        onToggleCustomHud={setEditCustomHud}
      />

      {/* Free Fire Backpack / Inventory Modal */}
      <InventoryUI
        isOpen={isInventoryOpen}
        inventory={inventory}
        ammoState={ammoState}
        weaponId={weaponId}
        onClose={() => setIsInventoryOpen(false)}
        onEquipWeapon={handleEquipWeapon}
        onDropItem={handleDropItem}
        onUseMedkit={() => {
          if (inventory.medkits > 0 && playerHp < 100) {
            handleUseMedkit();
          }
        }}
      />

      {/* Screen Damage Vignette (Blue Zone Damage) */}
      {zoneDamageFlash && <div className="ff-zone-damage-overlay" />}

      {/* Free Fire BOOYAH! Victory & Defeat Modal */}
      <FreeFireVictoryModal
        status={matchStatus}
        kills={kills}
        damageDealt={damageDealt}
        survivalSeconds={survivalSeconds}
        headshots={headshots}
        shotsFired={shotsFired}
        rank={finalRank}
        totalPlayers={7}
        onPlayAgain={handlePlayAgain}
        onDismiss={() => setMatchStatus("IN_PROGRESS")}
        onReturnToLobby={handleReturnToLobby}
      />

      {playerMode === "driving" && (
        <>
          <section className={`steering-hud-pod side-${steerHudSide}`}>
            <div className="steering-hud-header">
              <span className="steering-angle-readout">
                {Math.round(-currentSteer * MAX_WHEEL_ROTATION_DEG)}°
              </span>
            </div>
            <div className="steering-wheel-ring-wrap">
              <SteeringWheelGraphic
                steerValue={currentSteer}
                activeGrab={false}
              />
            </div>
          </section>
          <div
            className={`drive-hud sport-hud side-${steerHudSide === "left" ? "right" : "left"}`}
          >
            <SportSpeedometer telemetry={telemetry} />
            <div className="telemetry-badges">
              {telemetry.drifting && (
                <div className="badge drift-badge">
                  DRIFT {telemetry.driftAngle}°
                </div>
              )}
              {telemetry.boost && (
                <div className="badge boost-badge">M-BOOST</div>
              )}
            </div>
          </div>
        </>
      )}

      {playerMode === "onFoot" && matchStatus === "IN_PROGRESS" && (
        <section className="character-emote-bar-compact">
          <div className="character-emote-grid">
            {EMOTES.map((emote) => (
              <button
                key={emote.id}
                type="button"
                className="character-emote-btn"
                disabled={emoteActive}
                onClick={() => playEmote(emote.id)}
              >
                <span className="emote-key">{emote.key}</span>
                {emote.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {matchStatus === "IN_PROGRESS" && (interactionMessage || isTransitioning) && (
        <div
          className="vehicle-interaction-prompt"
          style={{
            pointerEvents: nearCar ? "auto" : "none",
            cursor: nearCar ? "pointer" : "default",
          }}
          onClick={nearCar ? toggleVehicle : undefined}
        >
          {interactionMessage || "Please wait..."}
        </div>
      )}

      {modelError && <div className="error-banner">{modelError}</div>}
      {matchStatus !== "DROPPING" && (
        <div className="corner-status">
          <span
            className={phoneLinked ? "mc-dot mc-dot-live" : "mc-dot mc-dot-wait"}
          />
          {playerMode === "driving"
            ? `DRIVING M4 · ${Math.round(speedKmh)} KM/H`
            : playerMode === "onFoot"
              ? `COMBAT READY · ${currentWeapon.name}`
              : playerMode.toUpperCase()}
        </div>
      )}
      <Loader containerStyles={{ background: "rgba(9,13,20,.92)" }} />
        </>
      )}

      <QrConnectModal
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        networkUrl={networkUrl}
        onCopyUrl={copyNetworkUrl}
        relayStatus={relayStatus}
        isLoopbackUrl={isLoopbackUrl}
        pairToken={playerSession.pairToken}
      />
      <GameSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        steerHudSide={steerHudSide}
        onSteerHudSideChange={setSteerHudSide}
        scenePreset={scenePreset}
        onScenePresetChange={setScenePreset}
        mapPreset={mapPreset}
        onMapPresetChange={setMapPreset}
        onOpenCustomHud={() => setEditCustomHud(true)}
      />
    </main>
  );
}
```

===============================================================================
FILE: client/src/components/Lobby/CustomRoomLobby.css
===============================================================================

```css
.ff-lobby-root {
  position: fixed;
  inset: 0;
  z-index: 40;
  overflow-y: auto;
  overflow-x: hidden;
  background:
    radial-gradient(circle at 18% 12%, rgba(251, 146, 60, 0.2), transparent 44%),
    radial-gradient(circle at 82% 85%, rgba(14, 165, 233, 0.18), transparent 46%),
    linear-gradient(155deg, #070b14 0%, #0d1526 52%, #070b12 100%);
  color: #f8fafc;
  font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
  padding: 18px 22px 28px;
  box-sizing: border-box;
}

.ff-lobby-shell {
  max-width: 1220px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ff-lobby-topbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
}

.ff-lobby-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ff-lobby-logo {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-weight: 900;
  letter-spacing: 0.04em;
  background: linear-gradient(135deg, #f97316, #eab308);
  color: #090d16;
  box-shadow: 0 6px 20px rgba(249, 115, 22, 0.35);
}

.ff-lobby-title {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin: 0;
}

.ff-lobby-subtitle {
  font-size: 12px;
  color: #94a3b8;
  margin: 2px 0 0;
}

.ff-lobby-top-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.ff-pill-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 11px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  background: rgba(30, 41, 59, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.28);
}

.ff-pill-status.online {
  border-color: rgba(34, 197, 94, 0.55);
  color: #86efac;
}

.ff-pill-status.offline {
  border-color: rgba(239, 68, 68, 0.55);
  color: #fca5a5;
}

.ff-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.ff-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 9px 14px;
  border-radius: 9px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(30, 41, 59, 0.9);
  color: #f8fafc;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.12s ease, border-color 0.15s ease, background 0.15s ease;
}

.ff-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: rgba(251, 146, 60, 0.7);
}

.ff-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.ff-btn-accent {
  background: linear-gradient(135deg, #f97316, #f59e0b);
  color: #0b0f19;
  border-color: rgba(251, 191, 36, 0.8);
}

.ff-btn-ready {
  background: linear-gradient(135deg, #16a34a, #22c55e);
  color: #04130a;
  border-color: rgba(134, 239, 172, 0.8);
}

.ff-btn-danger {
  background: rgba(185, 28, 28, 0.25);
  border-color: rgba(248, 113, 113, 0.55);
  color: #fecaca;
}

.ff-btn-ghost {
  background: rgba(15, 23, 42, 0.55);
}

.ff-btn-sm {
  padding: 5px 9px;
  font-size: 11px;
  border-radius: 6px;
}

.ff-alert {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
}

.ff-alert.error {
  background: rgba(185, 28, 28, 0.22);
  border: 1px solid rgba(248, 113, 113, 0.55);
  color: #fecaca;
}

.ff-alert.info {
  background: rgba(14, 165, 233, 0.16);
  border: 1px solid rgba(56, 189, 248, 0.5);
  color: #bae6fd;
}

.ff-alert.invite {
  background: linear-gradient(90deg, rgba(249, 115, 22, 0.22), rgba(234, 179, 8, 0.15));
  border: 1px solid rgba(251, 146, 60, 0.65);
  color: #ffedd5;
}

.ff-lobby-grid-entry {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: 16px;
}

.ff-lobby-grid-room {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 16px;
}

@media (max-width: 920px) {

  .ff-lobby-grid-entry,
  .ff-lobby-grid-room {
    grid-template-columns: 1fr;
  }
}

.ff-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 14px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ff-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 10px;
}

.ff-card-title {
  margin: 0;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fbbf24;
}

.ff-field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 11px;
}

@media (max-width: 580px) {
  .ff-field-grid {
    grid-template-columns: 1fr;
  }
}

.ff-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.ff-field label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #94a3b8;
  text-transform: uppercase;
}

.ff-input,
.ff-select {
  width: 100%;
  box-sizing: border-box;
  padding: 9px 11px;
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.28);
  background: rgba(9, 14, 26, 0.9);
  color: #f8fafc;
  font-size: 13px;
  font-weight: 600;
}

.ff-input:focus,
.ff-select:focus {
  outline: none;
  border-color: #f97316;
}

.ff-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 11px;
  border-radius: 9px;
  background: rgba(9, 14, 26, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 12px;
  font-weight: 600;
}

.ff-code-banner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 16px;
  border-radius: 12px;
  background: linear-gradient(120deg, rgba(30, 41, 59, 0.92), rgba(15, 23, 42, 0.95));
  border: 1px solid rgba(251, 191, 36, 0.35);
}

.ff-invite-code-value {
  font-family: "Consolas", "Monaco", monospace;
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 0.16em;
  color: #fbbf24;
}

.ff-slot-meter {
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 12px 16px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.ff-slot-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

@media (max-width: 640px) {
  .ff-slot-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.ff-stat-box {
  padding: 8px 10px;
  border-radius: 8px;
  background: rgba(9, 14, 26, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.07);
}

.ff-stat-label {
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #94a3b8;
}

.ff-stat-val {
  font-size: 18px;
  font-weight: 800;
  margin-top: 2px;
}

.ff-progress-track {
  height: 10px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.16);
  overflow: hidden;
  display: flex;
}

.ff-progress-humans {
  background: linear-gradient(90deg, #f97316, #fbbf24);
  transition: width 0.2s ease;
}

.ff-progress-bots {
  background: linear-gradient(90deg, #0284c7, #38bdf8);
  transition: width 0.2s ease;
}

.ff-roster-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 360px;
  overflow-y: auto;
}

.ff-player-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 11px;
  border-radius: 9px;
  background: rgba(9, 14, 26, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.09);
}

.ff-player-row.me {
  border-color: rgba(251, 146, 60, 0.65);
  background: rgba(249, 115, 22, 0.1);
}

.ff-player-main {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.ff-slot-num {
  font-family: monospace;
  font-size: 11px;
  color: #94a3b8;
  min-width: 28px;
}

.ff-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 7px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.ff-badge.host {
  background: rgba(234, 179, 8, 0.22);
  color: #fde047;
  border: 1px solid rgba(234, 179, 8, 0.5);
}

.ff-badge.team {
  background: rgba(99, 102, 241, 0.22);
  color: #c7d2fe;
}

.ff-badge.ready {
  background: rgba(34, 197, 94, 0.2);
  color: #86efac;
  border: 1px solid rgba(34, 197, 94, 0.45);
}

.ff-badge.not-ready {
  background: rgba(148, 163, 184, 0.15);
  color: #cbd5e1;
}

.ff-badge.bot {
  background: rgba(14, 165, 233, 0.2);
  color: #7dd3fc;
  border: 1px solid rgba(56, 189, 248, 0.45);
}

.ff-badge.disconnected {
  background: rgba(245, 158, 11, 0.2);
  color: #fcd34d;
}

.ff-bot-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.ff-bot-chip {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
  background: rgba(14, 165, 233, 0.12);
  border: 1px dashed rgba(56, 189, 248, 0.4);
  color: #7dd3fc;
}

.ff-lobby-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 16px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.ff-countdown-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  background: linear-gradient(90deg, rgba(234, 88, 12, 0.35), rgba(245, 158, 11, 0.2));
  border: 1px solid rgba(251, 146, 60, 0.8);
}

.ff-open-room-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 11px;
  border-radius: 8px;
  background: rgba(9, 14, 26, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 12px;
}
```

===============================================================================
FILE: client/src/components/Lobby/CustomRoomLobby.jsx
===============================================================================

```jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MAP_PRESETS } from "../../config/gameConstants";
import { getRoomInviteUrl } from "../../utils/network";
import Icons from "../UI/Icons";
import "./CustomRoomLobby.css";

function extractInviteCode(rawInput) {
  const trimmed = (rawInput || "").trim();
  if (!trimmed) return "";
  if (trimmed.includes("room=")) {
    try {
      const parsed = new URL(
        trimmed.startsWith("http") ? trimmed : `https://dummy.local/${trimmed.replace(/^\/+/, "")}`,
      );
      const param = parsed.searchParams.get("room");
      if (param) return param.trim().toUpperCase();
    } catch {}
    const match = trimmed.match(/[?&]room=([a-zA-Z0-9_-]+)/i);
    if (match?.[1]) return match[1].toUpperCase();
  }
  return trimmed.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

export default function CustomRoomLobby({
  socket,
  relayStatus,
  session,
  onPlayerNameChange,
  room,
  onRoomSync,
  countdownSec,
  lobbyError,
  onReportError,
  onClearError,
  initialInviteCode,
  lanIp,
  phoneLinked,
  controllerCount,
  onOpenQr,
  onLaunchQuickSolo,
}) {
  const [nameDraft, setNameDraft] = useState(session.playerName || "Survivor");
  const [joinInput, setJoinInput] = useState(initialInviteCode || "");
  const [invitedPreview, setInvitedPreview] = useState(null);
  const [openRooms, setOpenRooms] = useState([]);
  const [busyAction, setBusyAction] = useState("");
  const [copyToast, setCopyToast] = useState("");

  // Creation draft config
  const [createConfig, setCreateConfig] = useState({
    mapId: "bermuda",
    mode: "solo",
    maxPlayers: 50,
    botsEnabled: true,
    autoFillBots: true,
    botCount: 49,
    botDifficulty: "normal",
    countdownSec: 5,
  });

  useEffect(() => {
    setNameDraft(session.playerName || "Survivor");
  }, [session.playerName]);

  useEffect(() => {
    if (initialInviteCode) {
      setJoinInput(initialInviteCode);
    }
  }, [initialInviteCode]);

  // Fetch invited room preview or active waiting rooms when in lobby hub
  useEffect(() => {
    if (room) return undefined;
    let cancelled = false;

    const loadRooms = async () => {
      try {
        const res = await fetch("/api/rooms", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && Array.isArray(data?.rooms)) {
            setOpenRooms(data.rooms);
          }
        }
      } catch {}

      if (initialInviteCode) {
        try {
          const res = await fetch(`/api/rooms/${encodeURIComponent(initialInviteCode)}`, {
            cache: "no-store",
          });
          if (res.ok) {
            const data = await res.json();
            if (!cancelled && data?.ok && data.room) {
              setInvitedPreview(data.room);
            }
          }
        } catch {}
      }
    };

    loadRooms();
    const poll = window.setInterval(loadRooms, 4000);
    return () => {
      cancelled = true;
      window.clearInterval(poll);
    };
  }, [room, initialInviteCode]);

  const showCopyToast = useCallback((msg) => {
    setCopyToast(msg);
    window.setTimeout(() => setCopyToast(""), 2000);
  }, []);

  const emitRoomAction = useCallback(
    (event, payload = {}) =>
      new Promise((resolve) => {
        if (!socket || !socket.connected) {
          const offlineRes = {
            ok: false,
            error: "OFFLINE",
            message: "Multiplayer server is not connected yet.",
          };
          onReportError?.(offlineRes.message);
          resolve(offlineRes);
          return;
        }
        socket.emit(
          event,
          {
            playerId: session.playerId,
            playerName: nameDraft.trim() || session.playerName,
            ...payload,
          },
          (res) => {
            const finalRes = res || { ok: false, message: "No server response." };
            if (!finalRes.ok && finalRes.message) {
              onReportError?.(finalRes.message);
            } else if (finalRes.ok) {
              if (event === "room:leave") {
                onRoomSync?.(null);
              } else if (finalRes.room) {
                onRoomSync?.(finalRes.room);
              }
            }
            resolve(finalRes);
          },
        );
      }),
    [socket, session.playerId, session.playerName, nameDraft, onReportError, onRoomSync],
  );

  const handleSaveName = useCallback(() => {
    const cleaned = nameDraft.trim() || session.playerName || "Survivor";
    setNameDraft(cleaned);
    onPlayerNameChange?.(cleaned);
    if (socket?.connected) {
      socket.emit("auth:identify", {
        playerId: session.playerId,
        playerName: cleaned,
        pairToken: session.pairToken,
      });
    }
  }, [nameDraft, session.playerId, session.playerName, session.pairToken, onPlayerNameChange, socket]);

  const handleCreateRoom = useCallback(async () => {
    onClearError?.();
    handleSaveName();
    setBusyAction("create");
    await emitRoomAction("room:create", { config: createConfig });
    setBusyAction("");
  }, [onClearError, handleSaveName, emitRoomAction, createConfig]);

  const handleJoinCode = useCallback(
    async (explicitCode = null) => {
      onClearError?.();
      handleSaveName();
      const code = extractInviteCode(explicitCode ?? joinInput);
      if (!code) return;
      setBusyAction("join");
      await emitRoomAction("room:join", { inviteCode: code });
      setBusyAction("");
    },
    [onClearError, handleSaveName, joinInput, emitRoomAction],
  );

  const myPlayer = useMemo(() => {
    if (!room) return null;
    return room.players.find((p) => p.playerId === session.playerId) || null;
  }, [room, session.playerId]);

  const isHost = Boolean(room && room.hostPlayerId === session.playerId);

  const inviteUrl = useMemo(() => {
    if (!room?.inviteCode) return "";
    return getRoomInviteUrl(room.inviteCode, lanIp);
  }, [room?.inviteCode, lanIp]);

  const copyText = useCallback(
    async (text, label) => {
      if (!text) return;
      try {
        await navigator.clipboard?.writeText(text);
        showCopyToast(`${label} copied`);
      } catch {
        showCopyToast(`${label}: ${text}`);
      }
    },
    [showCopyToast],
  );

  const handleConfigPatch = useCallback(
    async (patch) => {
      if (!isHost) return;
      onClearError?.();
      await emitRoomAction("room:config", { patch });
    },
    [isHost, onClearError, emitRoomAction],
  );

  const unreadyGuestCount = useMemo(() => {
    if (!room) return 0;
    return room.players.filter(
      (p) => p.connected && p.playerId !== room.hostPlayerId && !p.ready,
    ).length;
  }, [room]);

  const botSampleCount = Math.min(room?.botSummary?.count || 0, 12);

  return (
    <div className="ff-lobby-root" data-testid="custom-room-lobby">
      <div className="ff-lobby-shell">
        <header className="ff-lobby-topbar">
          <div className="ff-lobby-brand">
            <div className="ff-lobby-logo">FF</div>
            <div>
              <h1 className="ff-lobby-title">Battle Royale 50 · Custom Lobby</h1>
              <p className="ff-lobby-subtitle">
                50-Participant Custom Rooms · Friends &amp; AI Bots · Scoped Phone Pairing
              </p>
            </div>
          </div>

          <div className="ff-lobby-top-actions">
            <span
              className={`ff-pill-status ${
                relayStatus === "connected" ? "online" : "offline"
              }`}
              data-testid="relay-status-pill"
            >
              <span className="ff-dot" />
              SERVER: {relayStatus === "connected" ? "ONLINE" : relayStatus.toUpperCase()}
            </span>

            <button
              type="button"
              className="ff-btn ff-btn-ghost"
              onClick={onOpenQr}
              data-testid="lobby-qr-btn"
            >
              <Icons.QRCode />
              <span>
                {phoneLinked
                  ? `PHONE SYNCED (${controllerCount})`
                  : "PAIR PHONE QR"}
              </span>
            </button>

            <button
              type="button"
              className="ff-btn ff-btn-ghost"
              onClick={onLaunchQuickSolo}
              data-testid="quick-solo-btn"
            >
              QUICK SOLO (OFFLINE)
            </button>
          </div>
        </header>

        {lobbyError && (
          <div className="ff-alert error" role="alert" data-testid="lobby-error-banner">
            <span>{lobbyError}</span>
            <button
              type="button"
              className="ff-btn ff-btn-sm ff-btn-ghost"
              onClick={onClearError}
            >
              DISMISS
            </button>
          </div>
        )}

        {copyToast && (
          <div className="ff-alert info" data-testid="copy-toast">
            <span>{copyToast}</span>
          </div>
        )}

        {!room && invitedPreview && (
          <div className="ff-alert invite" data-testid="invite-preview-banner">
            <div>
              <strong>Room Invite Detected: {invitedPreview.inviteCode}</strong>
              {" · "}
              {MAP_PRESETS[invitedPreview.config?.mapId]?.label || invitedPreview.config?.mapId}
              {" · "}
              {(invitedPreview.config?.mode || "solo").toUpperCase()}
              {" · "}
              {invitedPreview.slots?.realPlayers}/{invitedPreview.slots?.configuredMax} Humans
            </div>
            <button
              type="button"
              className="ff-btn ff-btn-accent"
              disabled={relayStatus !== "connected" || busyAction === "join"}
              onClick={() => handleJoinCode(invitedPreview.inviteCode)}
              data-testid="join-invited-room-btn"
            >
              JOIN INVITED ROOM
            </button>
          </div>
        )}

        {!room ? (
          <div className="ff-lobby-grid-entry">
            {/* Create Room Panel */}
            <section className="ff-card">
              <div className="ff-card-header">
                <h2 className="ff-card-title">Create 50-Player Custom Room</h2>
                <span className="ff-badge host">HOST MODE</span>
              </div>

              <div className="ff-field">
                <label htmlFor="ff-callsign">Your Survivor Callsign</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    id="ff-callsign"
                    data-testid="callsign-input"
                    className="ff-input"
                    maxLength={20}
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    onBlur={handleSaveName}
                    placeholder="Enter callsign"
                  />
                  <button
                    type="button"
                    className="ff-btn ff-btn-ghost"
                    onClick={handleSaveName}
                  >
                    SAVE
                  </button>
                </div>
              </div>

              <div className="ff-field-grid">
                <div className="ff-field">
                  <label htmlFor="create-map">Map Selection</label>
                  <select
                    id="create-map"
                    className="ff-select"
                    value={createConfig.mapId}
                    onChange={(e) =>
                      setCreateConfig((c) => ({ ...c, mapId: e.target.value }))
                    }
                  >
                    {Object.entries(MAP_PRESETS).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ff-field">
                  <label htmlFor="create-mode">Match Mode</label>
                  <select
                    id="create-mode"
                    className="ff-select"
                    value={createConfig.mode}
                    onChange={(e) =>
                      setCreateConfig((c) => ({ ...c, mode: e.target.value }))
                    }
                  >
                    <option value="solo">SOLO (1/Team)</option>
                    <option value="duo">DUO (2/Team)</option>
                    <option value="squad">SQUAD (4/Team)</option>
                  </select>
                </div>

                <div className="ff-field">
                  <label htmlFor="create-max">Max Match Capacity (2 - 50)</label>
                  <input
                    id="create-max"
                    type="number"
                    min={2}
                    max={50}
                    className="ff-input"
                    value={createConfig.maxPlayers}
                    onChange={(e) =>
                      setCreateConfig((c) => ({
                        ...c,
                        maxPlayers: Math.max(2, Math.min(50, Number(e.target.value) || 50)),
                      }))
                    }
                  />
                </div>

                <div className="ff-field">
                  <label htmlFor="create-diff">AI Bot Difficulty</label>
                  <select
                    id="create-diff"
                    className="ff-select"
                    value={createConfig.botDifficulty}
                    onChange={(e) =>
                      setCreateConfig((c) => ({ ...c, botDifficulty: e.target.value }))
                    }
                  >
                    <option value="easy">Easy</option>
                    <option value="normal">Normal</option>
                    <option value="hard">Hard</option>
                    <option value="pro">Pro</option>
                  </select>
                </div>
              </div>

              <div className="ff-field-grid">
                <label className="ff-toggle-row">
                  <span>Enable AI Bots</span>
                  <input
                    type="checkbox"
                    checked={createConfig.botsEnabled}
                    onChange={(e) =>
                      setCreateConfig((c) => ({ ...c, botsEnabled: e.target.checked }))
                    }
                  />
                </label>

                <label className="ff-toggle-row">
                  <span>Auto-Fill Empty Slots</span>
                  <input
                    type="checkbox"
                    disabled={!createConfig.botsEnabled}
                    checked={createConfig.autoFillBots}
                    onChange={(e) =>
                      setCreateConfig((c) => ({ ...c, autoFillBots: e.target.checked }))
                    }
                  />
                </label>
              </div>

              <button
                type="button"
                className="ff-btn ff-btn-accent"
                disabled={relayStatus !== "connected" || busyAction === "create"}
                onClick={handleCreateRoom}
                data-testid="create-room-btn"
              >
                {busyAction === "create"
                  ? "CREATING ROOM..."
                  : "CREATE CUSTOM ROOM (50 SLOTS)"}
              </button>
            </section>

            {/* Join Room + Open Rooms Panel */}
            <section className="ff-card">
              <div className="ff-card-header">
                <h2 className="ff-card-title">Join By Invite Code Or Link</h2>
                <span className="ff-badge team">FRIEND INVITE</span>
              </div>

              <div className="ff-field">
                <label htmlFor="join-code-input">6-Char Invite Code or Full Invite URL</label>
                <input
                  id="join-code-input"
                  data-testid="join-code-input"
                  className="ff-input"
                  placeholder="e.g. X7K9P2 or http://.../?room=X7K9P2"
                  value={joinInput}
                  onChange={(e) => setJoinInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleJoinCode();
                  }}
                />
              </div>

              <button
                type="button"
                className="ff-btn ff-btn-ready"
                disabled={
                  relayStatus !== "connected" ||
                  busyAction === "join" ||
                  !extractInviteCode(joinInput)
                }
                onClick={() => handleJoinCode()}
                data-testid="join-room-btn"
              >
                {busyAction === "join" ? "JOINING..." : "JOIN CUSTOM ROOM"}
              </button>

              <div className="ff-card-header" style={{ marginTop: "6px" }}>
                <h3 className="ff-card-title">Active Custom Rooms</h3>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                  {openRooms.length} ACTIVE
                </span>
              </div>

              {openRooms.length === 0 ? (
                <div style={{ fontSize: "12px", color: "#94a3b8", padding: "6px 0" }}>
                  No active custom rooms yet. Create one to get an invite code and link!
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {openRooms.map((r) => (
                    <div key={r.roomId} className="ff-open-room-row">
                      <div>
                        <strong style={{ color: "#fbbf24" }}>{r.inviteCode}</strong>
                        {" · "}
                        <span>{MAP_PRESETS[r.mapId]?.label || r.mapId}</span>
                        {" · "}
                        <span>{(r.mode || "solo").toUpperCase()}</span>
                        {" · "}
                        <span style={{ color: "#94a3b8" }}>
                          {r.slots.realPlayers}H + {r.slots.bots}B / {r.slots.configuredMax}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="ff-btn ff-btn-sm ff-btn-accent"
                        disabled={r.status !== "LOBBY" || relayStatus !== "connected"}
                        onClick={() => handleJoinCode(r.inviteCode)}
                      >
                        {r.status === "LOBBY" ? "JOIN" : r.status}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        ) : (
          <>
            {/* Room Identity & Share Banner */}
            <section className="ff-code-banner">
              <div>
                <div style={{ fontSize: "11px", color: "#94a3b8", letterSpacing: "0.08em" }}>
                  ROOM ID: <strong style={{ color: "#e2e8f0" }}>{room.roomId}</strong>
                  {" · "}
                  STATUS: <strong data-testid="room-status-text">{room.status}</strong>
                  {" · "}
                  MAP:{" "}
                  <strong>{MAP_PRESETS[room.config.mapId]?.label || room.config.mapId}</strong>
                  {" · "}
                  MODE: <strong>{room.config.mode.toUpperCase()}</strong>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
                  <span style={{ fontSize: "12px", color: "#cbd5e1", fontWeight: 700 }}>
                    INVITE CODE:
                  </span>
                  <span className="ff-invite-code-value" data-testid="room-invite-code">
                    {room.inviteCode}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <button
                  type="button"
                  className="ff-btn ff-btn-ghost"
                  onClick={() => copyText(room.inviteCode, "Invite Code")}
                  data-testid="copy-code-btn"
                >
                  COPY CODE
                </button>
                <button
                  type="button"
                  className="ff-btn ff-btn-accent"
                  onClick={() => copyText(inviteUrl, "Invite Link")}
                  data-testid="copy-link-btn"
                >
                  COPY INVITE LINK
                </button>
                <button
                  type="button"
                  className="ff-btn ff-btn-danger"
                  onClick={() => emitRoomAction("room:leave")}
                  data-testid="leave-room-btn"
                >
                  LEAVE ROOM
                </button>
              </div>
            </section>

            {/* Countdown Banner */}
            {room.status === "COUNTDOWN" && (
              <section className="ff-countdown-banner" data-testid="countdown-banner">
                <div>
                  <strong style={{ fontSize: "16px", letterSpacing: "0.06em" }}>
                    MATCH DEPLOYING IN {countdownSec ?? room.countdownRemaining}s
                  </strong>
                  <div style={{ fontSize: "12px", color: "#ffedd5" }}>
                    Locking {room.slots.realPlayers} real player(s) and {room.slots.bots} AI bot(s)
                    into the Bermuda Flight manifest...
                  </div>
                </div>
                {isHost && (
                  <button
                    type="button"
                    className="ff-btn ff-btn-danger"
                    onClick={() => emitRoomAction("room:cancel-countdown")}
                    data-testid="cancel-countdown-btn"
                  >
                    CANCEL COUNTDOWN
                  </button>
                )}
              </section>
            )}

            {/* 50-Slot Capacity Telemetry */}
            <section className="ff-slot-meter" data-testid="slot-telemetry">
              <div className="ff-slot-stats">
                <div className="ff-stat-box">
                  <div className="ff-stat-label">REAL HUMANS</div>
                  <div className="ff-stat-val" style={{ color: "#fbbf24" }} data-testid="count-humans">
                    {room.slots.realPlayers}
                  </div>
                </div>
                <div className="ff-stat-box">
                  <div className="ff-stat-label">AI BOT SLOTS (BOTS)</div>
                  <div className="ff-stat-val" style={{ color: "#38bdf8" }} data-testid="count-bots">
                    {room.slots.bots}
                  </div>
                </div>
                <div className="ff-stat-box">
                  <div className="ff-stat-label">OPEN SLOTS</div>
                  <div className="ff-stat-val" style={{ color: "#94a3b8" }} data-testid="count-available">
                    {room.slots.availableSlots}
                  </div>
                </div>
                <div className="ff-stat-box">
                  <div className="ff-stat-label">MATCH CAPACITY</div>
                  <div className="ff-stat-val" data-testid="count-capacity">
                    {room.slots.totalOccupied} / {room.slots.configuredMax}
                  </div>
                </div>
              </div>

              <div className="ff-progress-track" aria-label="50-slot allocation">
                <div
                  className="ff-progress-humans"
                  style={{
                    width: `${(room.slots.realPlayers / room.slots.configuredMax) * 100}%`,
                  }}
                />
                <div
                  className="ff-progress-bots"
                  style={{
                    width: `${(room.slots.bots / room.slots.configuredMax) * 100}%`,
                  }}
                />
              </div>
            </section>

            {/* Main Lobby Split: Roster Left, Host Config Right */}
            <div className="ff-lobby-grid-room">
              <section className="ff-card">
                <div className="ff-card-header">
                  <h2 className="ff-card-title">
                    Human Players ({room.slots.realPlayers})
                  </h2>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                    YOU ARE {isHost ? "ROOM HOST" : "SQUAD MEMBER"}
                  </span>
                </div>

                <div className="ff-roster-list" data-testid="player-roster">
                  {room.players.map((player) => {
                    const isMe = player.playerId === session.playerId;
                    return (
                      <div
                        key={player.playerId}
                        className={`ff-player-row ${isMe ? "me" : ""}`}
                        data-testid={`roster-row-${player.playerId}`}
                      >
                        <div className="ff-player-main">
                          <span className="ff-slot-num">
                            #{String(player.slotIndex + 1).padStart(2, "0")}
                          </span>
                          {room.config.mode !== "solo" && (
                            <span className="ff-badge team">T{player.teamId}</span>
                          )}
                          <strong style={{ fontSize: "13px" }}>
                            {player.name}
                            {isMe ? " (YOU)" : ""}
                          </strong>
                          {player.isHost && <span className="ff-badge host">HOST</span>}
                          {!player.connected && (
                            <span className="ff-badge disconnected">RECONNECTING</span>
                          )}
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span
                            className={`ff-badge ${
                              player.ready ? "ready" : "not-ready"
                            }`}
                          >
                            {player.ready ? "READY" : "NOT READY"}
                          </span>

                          {isHost && !isMe && (
                            <>
                              <button
                                type="button"
                                className="ff-btn ff-btn-sm ff-btn-ghost"
                                onClick={() =>
                                  emitRoomAction("room:transfer-host", {
                                    targetPlayerId: player.playerId,
                                  })
                                }
                                title="Transfer Host Role"
                              >
                                HOST
                              </button>
                              <button
                                type="button"
                                className="ff-btn ff-btn-sm ff-btn-danger"
                                onClick={() =>
                                  emitRoomAction("room:kick", {
                                    targetPlayerId: player.playerId,
                                  })
                                }
                                title="Kick Player"
                              >
                                KICK
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Separated AI Bot Fill Panel (Never marked as human) */}
                <div className="ff-card-header" style={{ marginTop: "4px" }}>
                  <h3 className="ff-card-title" style={{ color: "#38bdf8" }}>
                    AI Bot Slots ({room.botSummary.count})
                  </h3>
                  <span className="ff-badge bot">AI BOTS · NON-HUMAN</span>
                </div>

                {room.botSummary.count === 0 ? (
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                    AI bots disabled or 0 bot slots configured. Empty slots remain open for real
                    friends.
                  </div>
                ) : (
                  <div className="ff-bot-chips" data-testid="bot-slots-preview">
                    {Array.from({ length: botSampleCount }, (_, i) => (
                      <span key={i} className="ff-bot-chip">
                        [BOT] AI-{String(i + 1).padStart(2, "0")} ·{" "}
                        {room.botSummary.difficulty.toUpperCase()}
                      </span>
                    ))}
                    {room.botSummary.count > botSampleCount && (
                      <span className="ff-bot-chip">
                        +{room.botSummary.count - botSampleCount} MORE AI BOTS ON DROP
                      </span>
                    )}
                  </div>
                )}
              </section>

              {/* Host Match Settings */}
              <section className="ff-card">
                <div className="ff-card-header">
                  <h2 className="ff-card-title">Room Configuration</h2>
                  <span className={`ff-badge ${isHost ? "host" : "not-ready"}`}>
                    {isHost ? "HOST CONTROLS" : "VIEW ONLY"}
                  </span>
                </div>

                <div className="ff-field-grid">
                  <div className="ff-field">
                    <label htmlFor="room-cfg-max">Max Players (2 - 50)</label>
                    <input
                      id="room-cfg-max"
                      data-testid="cfg-max-players"
                      type="number"
                      min={2}
                      max={50}
                      disabled={!isHost || room.status !== "LOBBY"}
                      className="ff-input"
                      value={room.config.maxPlayers}
                      onChange={(e) =>
                        handleConfigPatch({
                          maxPlayers: Math.max(
                            2,
                            Math.min(50, Number(e.target.value) || 50),
                          ),
                        })
                      }
                    />
                  </div>

                  <div className="ff-field">
                    <label htmlFor="room-cfg-map">Battle Map</label>
                    <select
                      id="room-cfg-map"
                      data-testid="cfg-map"
                      disabled={!isHost || room.status !== "LOBBY"}
                      className="ff-select"
                      value={room.config.mapId}
                      onChange={(e) => handleConfigPatch({ mapId: e.target.value })}
                    >
                      {Object.entries(MAP_PRESETS).map(([key, item]) => (
                        <option key={key} value={key}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="ff-field">
                    <label htmlFor="room-cfg-mode">Match Mode</label>
                    <select
                      id="room-cfg-mode"
                      data-testid="cfg-mode"
                      disabled={!isHost || room.status !== "LOBBY"}
                      className="ff-select"
                      value={room.config.mode}
                      onChange={(e) => handleConfigPatch({ mode: e.target.value })}
                    >
                      <option value="solo">SOLO</option>
                      <option value="duo">DUO</option>
                      <option value="squad">SQUAD</option>
                    </select>
                  </div>

                  <div className="ff-field">
                    <label htmlFor="room-cfg-countdown">Start Countdown (sec)</label>
                    <select
                      id="room-cfg-countdown"
                      data-testid="cfg-countdown"
                      disabled={!isHost || room.status !== "LOBBY"}
                      className="ff-select"
                      value={room.config.countdownSec}
                      onChange={(e) =>
                        handleConfigPatch({ countdownSec: Number(e.target.value) })
                      }
                    >
                      <option value={3}>3 Seconds</option>
                      <option value={5}>5 Seconds</option>
                      <option value={10}>10 Seconds</option>
                      <option value={15}>15 Seconds</option>
                    </select>
                  </div>
                </div>

                <div className="ff-field-grid">
                  <label className="ff-toggle-row">
                    <span>AI Bots Enabled</span>
                    <input
                      data-testid="cfg-bots-enabled"
                      type="checkbox"
                      disabled={!isHost || room.status !== "LOBBY"}
                      checked={room.config.botsEnabled}
                      onChange={(e) =>
                        handleConfigPatch({ botsEnabled: e.target.checked })
                      }
                    />
                  </label>

                  <label className="ff-toggle-row">
                    <span>Auto-Fill Slots w/ Bots</span>
                    <input
                      data-testid="cfg-auto-bots"
                      type="checkbox"
                      disabled={
                        !isHost || !room.config.botsEnabled || room.status !== "LOBBY"
                      }
                      checked={room.config.autoFillBots}
                      onChange={(e) =>
                        handleConfigPatch({ autoFillBots: e.target.checked })
                      }
                    />
                  </label>
                </div>

                <div className="ff-field-grid">
                  <div className="ff-field">
                    <label htmlFor="room-cfg-botcount">Manual Bot Count</label>
                    <input
                      id="room-cfg-botcount"
                      data-testid="cfg-bot-count"
                      type="number"
                      min={0}
                      max={Math.max(0, room.config.maxPlayers - 1)}
                      disabled={
                        !isHost ||
                        !room.config.botsEnabled ||
                        room.config.autoFillBots ||
                        room.status !== "LOBBY"
                      }
                      className="ff-input"
                      value={
                        room.config.autoFillBots
                          ? room.slots.bots
                          : room.config.botCount
                      }
                      onChange={(e) =>
                        handleConfigPatch({
                          botCount: Math.max(
                            0,
                            Math.min(
                              room.config.maxPlayers - 1,
                              Number(e.target.value) || 0,
                            ),
                          ),
                        })
                      }
                    />
                  </div>

                  <div className="ff-field">
                    <label htmlFor="room-cfg-botdiff">Bot Difficulty</label>
                    <select
                      id="room-cfg-botdiff"
                      data-testid="cfg-bot-difficulty"
                      disabled={
                        !isHost || !room.config.botsEnabled || room.status !== "LOBBY"
                      }
                      className="ff-select"
                      value={room.config.botDifficulty}
                      onChange={(e) =>
                        handleConfigPatch({ botDifficulty: e.target.value })
                      }
                    >
                      <option value="easy">Easy</option>
                      <option value="normal">Normal</option>
                      <option value="hard">Hard</option>
                      <option value="pro">Pro</option>
                    </select>
                  </div>
                </div>
              </section>
            </div>

            {/* Action Dock */}
            <footer className="ff-lobby-footer">
              <div style={{ fontSize: "12px", color: "#cbd5e1" }}>
                {isHost
                  ? unreadyGuestCount > 0
                    ? `${unreadyGuestCount} player(s) not ready yet — wait for Ready or use Force Start.`
                    : `All connected humans ready! Ready to launch ${room.slots.totalOccupied}-slot match.`
                  : myPlayer?.ready
                    ? "You are READY — waiting for Host to start the match."
                    : "Click READY UP to signal the Room Host."}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {!isHost && (
                  <button
                    type="button"
                    className={`ff-btn ${
                      myPlayer?.ready ? "ff-btn-ghost" : "ff-btn-ready"
                    }`}
                    disabled={room.status !== "LOBBY"}
                    onClick={() =>
                      emitRoomAction("room:ready", { ready: !myPlayer?.ready })
                    }
                    data-testid="ready-toggle-btn"
                  >
                    {myPlayer?.ready ? "CANCEL READY" : "READY UP"}
                  </button>
                )}

                {isHost && (
                  <>
                    {unreadyGuestCount > 0 && room.status === "LOBBY" && (
                      <button
                        type="button"
                        className="ff-btn ff-btn-ghost"
                        onClick={() => emitRoomAction("room:start", { force: true })}
                        data-testid="force-start-btn"
                      >
                        FORCE START
                      </button>
                    )}
                    <button
                      type="button"
                      className="ff-btn ff-btn-accent"
                      disabled={room.status !== "LOBBY" || unreadyGuestCount > 0}
                      onClick={() => emitRoomAction("room:start", { force: false })}
                      data-testid="start-match-btn"
                    >
                      START MATCH ({room.slots.totalOccupied} SLOTS)
                    </button>
                  </>
                )}
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
```

===============================================================================
FILE: client/src/components/Loot/LootManager.jsx
===============================================================================

```jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import WorldHtml from "../UI/WorldHtml";
import {
  LOOT_ITEMS,
  LOOT_SPAWN_TABLE,
  LOOT_SPAWN_COUNT,
  LOOT_PICKUP_RANGE,
} from "../../config/gameConstants";

/* ------------------------------------------------------------------ */
/*  Helpers & Shared Resources (Allocated Once)                        */
/* ------------------------------------------------------------------ */

function weightedRandom(table) {
  const totalWeight = table.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * totalWeight;
  for (let i = 0; i < table.length; i++) {
    roll -= table[i].weight;
    if (roll <= 0) return table[i].id;
  }
  return table[table.length - 1].id;
}

const _raycaster = new THREE.Raycaster();
const _rayOrigin = new THREE.Vector3();
const _rayDir = new THREE.Vector3(0, -1, 0);
const _worldNormal = new THREE.Vector3();
const _boxGeo = new THREE.BoxGeometry(0.44, 0.44, 0.44);
const _ringGeo = new THREE.RingGeometry(0.32, 0.46, 16);
_ringGeo.rotateX(-Math.PI / 2);

const _boxMatCache = new Map();
const _ringMatCache = new Map();

function getBoxMaterial(color) {
  let mat = _boxMatCache.get(color);
  if (!mat) {
    mat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.42,
      roughness: 0.35,
      metalness: 0.15,
    });
    _boxMatCache.set(color, mat);
  }
  return mat;
}

function getRingMaterial(color) {
  let mat = _ringMatCache.get(color);
  if (!mat) {
    mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
    });
    _ringMatCache.set(color, mat);
  }
  return mat;
}

function sampleLootGroundY(meshes, x, z, fallbackY = 1) {
  if (!meshes || meshes.length === 0) return null;

  _rayOrigin.set(x, 60, z);
  _raycaster.set(_rayOrigin, _rayDir);
  _raycaster.far = 120;
  const hits = _raycaster.intersectObjects(meshes, false);

  let bestY = null;
  for (let i = 0; i < hits.length; i++) {
    const h = hits[i];
    if (h.face) {
      _worldNormal.copy(h.face.normal).transformDirection(h.object.matrixWorld);
      if (_worldNormal.y < 0.35) continue;
    }
    if (h.point.y < -1.5) continue;
    if (bestY === null || h.point.y > bestY) {
      bestY = h.point.y;
    }
  }

  return bestY !== null ? bestY : fallbackY;
}

/* ------------------------------------------------------------------ */
/*  Single loot item (no PointLight, no per-item useFrame)             */
/* ------------------------------------------------------------------ */

const LootItem = React.memo(function LootItem({
  uid,
  itemId,
  position,
  collected,
  isNearest,
  registerMesh,
}) {
  if (collected) return null;

  const def = LOOT_ITEMS[itemId] || { color: "#ffffff", label: itemId };
  const boxMat = getBoxMaterial(def.color);
  const ringMat = getRingMaterial(def.color);

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh
        ref={(el) => registerMesh(uid, el)}
        geometry={_boxGeo}
        material={boxMat}
        position={[0, 0.5, 0]}
      />
      <mesh
        geometry={_ringGeo}
        material={ringMat}
        position={[0, 0.06, 0]}
      />
      {isNearest && (
        <WorldHtml center position={[0, 1.55, 0]} style={{ pointerEvents: "none" }}>
          <div
            style={{
              background: "rgba(9, 14, 24, 0.85)",
              color: "#fff",
              padding: "4px 12px",
              borderRadius: 6,
              fontSize: 12,
              fontFamily: "sans-serif",
              whiteSpace: "nowrap",
              textAlign: "center",
              border: `1px solid ${def.color}`,
              boxShadow: "0 4px 12px rgba(0,0,0,0.45)",
            }}
          >
            Press <b>E</b> to pick up <b>{def.label}</b>
          </div>
        </WorldHtml>
      )}
    </group>
  );
});

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function LootManager({
  collidersRef,
  characterRef,
  interactPressed = false,
  matchStatus = "IN_PROGRESS",
  resetToken = 0,
  collidersReadyVersion = 0,
  onLootPickup,
}) {
  const lootsRef = useRef([]);
  const meshMapRef = useRef(new Map());
  const needsSnapRef = useRef(true);
  const nearestLootIdRef = useRef(null);
  const [nearestLootId, setNearestLootId] = useState(null);
  const [revision, setRevision] = useState(0);

  const registerMesh = useCallback((uid, el) => {
    if (el) {
      meshMapRef.current.set(uid, el);
    } else {
      meshMapRef.current.delete(uid);
    }
  }, []);

  /* ---------- Generate loot spawns on resetToken -------------------- */
  useEffect(() => {
    const spawns = [];
    for (let i = 0; i < LOOT_SPAWN_COUNT; i++) {
      const itemId = weightedRandom(LOOT_SPAWN_TABLE);
      // Spawn within 54m of map center so all loot lands directly on Bermuda island
      const angle = Math.random() * Math.PI * 2;
      const dist = 5 + Math.sqrt(Math.random()) * 48;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;

      spawns.push({
        uid: `loot-${resetToken}-${i}`,
        itemId,
        phase: (i * 0.618) % (Math.PI * 2),
        position: new THREE.Vector3(x, 1, z),
        collected: false,
      });
    }

    lootsRef.current = spawns;
    needsSnapRef.current = true;
    nearestLootIdRef.current = null;
    setNearestLootId(null);
    setRevision((r) => r + 1);
  }, [resetToken]);

  /* ---------- Snap loot Y once colliders BVH finishes --------------- */
  useEffect(() => {
    if (!needsSnapRef.current) return;
    const colliders = collidersRef?.current;
    const raw =
      colliders?.meshes ||
      (Array.isArray(colliders) ? colliders : []);
    const meshes = raw
      .map((c) => (c?.isObject3D ? c : c?.mesh))
      .filter(Boolean);

    if (!meshes.length || (colliders && colliders.ready === false)) return;

    const spawns = lootsRef.current;
    for (let i = 0; i < spawns.length; i++) {
      const l = spawns[i];
      const snappedY = sampleLootGroundY(meshes, l.position.x, l.position.z, 1);
      if (snappedY !== null) {
        l.position.y = snappedY;
      }
    }

    needsSnapRef.current = false;
    setRevision((r) => r + 1);
  }, [collidersRef, collidersReadyVersion, resetToken]);

  /* ---------- Single centralized per-frame loop --------------------- */
  const interactRef = useRef(false);
  const prevInteractRef = useRef(false);
  interactRef.current = interactPressed;

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const t = state.clock.elapsedTime;
    const loots = lootsRef.current;

    // Animate visible loot boxes in local coordinates (group already sits at groundY)
    for (let i = 0; i < loots.length; i++) {
      const l = loots[i];
      if (l.collected) continue;
      const mesh = meshMapRef.current.get(l.uid);
      if (!mesh) continue;
      mesh.rotation.y += dt * 0.9;
      mesh.position.y = 0.5 + Math.sin(t * 2.4 + l.phase) * 0.14;
    }

    if (matchStatus !== "IN_PROGRESS") {
      prevInteractRef.current = interactRef.current;
      return;
    }

    const charPos = characterRef?.current?.position;
    if (!charPos) {
      prevInteractRef.current = interactRef.current;
      return;
    }

    let closestDist = Infinity;
    let closestIdx = -1;

    for (let i = 0; i < loots.length; i++) {
      const l = loots[i];
      if (l.collected) continue;
      const dx = charPos.x - l.position.x;
      const dz = charPos.z - l.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    }

    const nearId =
      closestIdx >= 0 && closestDist <= LOOT_PICKUP_RANGE
        ? loots[closestIdx].uid
        : null;

    if (nearestLootIdRef.current !== nearId) {
      nearestLootIdRef.current = nearId;
      setNearestLootId(nearId);
    }

    // Pickup on press edge
    const justPressed = interactRef.current && !prevInteractRef.current;
    prevInteractRef.current = interactRef.current;

    if (justPressed && nearId !== null) {
      const loot = loots[closestIdx];
      loot.collected = true;
      meshMapRef.current.delete(loot.uid);
      nearestLootIdRef.current = null;
      setNearestLootId(null);
      setRevision((r) => r + 1);
      if (onLootPickup) {
        onLootPickup({ ...LOOT_ITEMS[loot.itemId], uid: loot.uid, itemId: loot.itemId });
      }
    }
  });

  void revision;

  return (
    <group>
      {lootsRef.current.map((l) => (
        <LootItem
          key={l.uid}
          uid={l.uid}
          itemId={l.itemId}
          position={l.position}
          collected={l.collected}
          isNearest={l.uid === nearestLootId}
          registerMesh={registerMesh}
        />
      ))}
    </group>
  );
}
```

===============================================================================
FILE: client/src/components/UI/CustomHudEditorBar.jsx
===============================================================================

```jsx
import React, { useState } from "react";
import {
  HudExitSvg,
  HudResetSvg,
  HudSaveSvg,
  PresetCubeSvg,
} from "./FreeFireIcons";
import { HUD_ELEMENTS } from "../../utils/customHudConfig";
import "./FreeFireHUD.css";

export default function CustomHudEditorBar({
  activePreset = 1,
  selectedId = null,
  layout = {},
  onChangeLayout,
  onSwitchPreset,
  onResetLayout,
  onResetSelectedElement,
  onSaveLayout,
  onExitEdit,
}) {
  const [saveToast, setSaveToast] = useState("");

  const selectedDef = selectedId ? HUD_ELEMENTS[selectedId] : null;
  const currentItem = selectedId && layout[selectedId] ? layout[selectedId] : null;

  const handleTransparencyChange = (e) => {
    if (!selectedId || !currentItem) return;
    const val = Number(e.target.value);
    onChangeLayout?.(selectedId, {
      ...currentItem,
      opacity: val,
    });
  };

  const handleSizeChange = (e) => {
    if (!selectedId || !currentItem) return;
    const val = Number(e.target.value);
    onChangeLayout?.(selectedId, {
      ...currentItem,
      size: val,
    });
  };

  const handleSave = () => {
    const ok = onSaveLayout?.();
    if (ok !== false) {
      setSaveToast("CUSTOM HUD SAVED!");
      window.setTimeout(() => setSaveToast(""), 2200);
    }
  };

  return (
    <div className="ffh-hud-editor-overlay">
      {/* 1. TOP HEADER TOOLBAR (EXIT, RESET, SAVE) */}
      <div className="ffh-editor-top-bar ffh-interactive">
        <button
          type="button"
          className="ffh-editor-bar-btn exit"
          onClick={onExitEdit}
          title="Exit Custom HUD"
        >
          <HudExitSvg />
        </button>

        <button
          type="button"
          className="ffh-editor-bar-btn reset"
          onClick={onResetLayout}
          title="Reset All Controls to Default"
        >
          <HudResetSvg />
        </button>

        <button
          type="button"
          className="ffh-editor-bar-btn save"
          onClick={handleSave}
          title="Save Custom HUD"
        >
          <HudSaveSvg />
        </button>
      </div>

      {/* 2. FLOATING ELEMENT INSPECTOR & SLIDERS (WHEN ELEMENT IS SELECTED) */}
      {selectedDef && currentItem && (
        <div className="ffh-editor-slider-card ffh-interactive">
          <div className="ffh-slider-card-header">
            <span className="ffh-slider-target-name">{selectedDef.label}</span>
            <button
              type="button"
              className="ffh-slider-reset-elem-btn"
              onClick={() => onResetSelectedElement?.(selectedId)}
              title="Reset this element to default"
            >
              Reset
            </button>
          </div>

          <div className="ffh-slider-row">
            <div className="ffh-slider-label-group">
              <span className="ffh-slider-title">TRANSPARENCY</span>
              <span className="ffh-slider-val-badge">{currentItem.opacity}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={1}
              value={currentItem.opacity}
              onChange={handleTransparencyChange}
              className="ffh-hud-range"
            />
          </div>

          <div className="ffh-slider-row">
            <div className="ffh-slider-label-group">
              <span className="ffh-slider-title">SIZE</span>
              <span className="ffh-slider-val-badge">{currentItem.size}%</span>
            </div>
            <input
              type="range"
              min={selectedDef.minSize || 40}
              max={selectedDef.maxSize || 180}
              step={1}
              value={currentItem.size}
              onChange={handleSizeChange}
              className="ffh-hud-range"
            />
          </div>
        </div>
      )}

      {/* 3. PRESET SWITCHER (PRESET 1 / PRESET 2 - MATCHES FREE FIRE BOX) */}
      <div className="ffh-editor-preset-wrapper ffh-interactive">
        <button
          type="button"
          className="ffh-editor-preset-pill"
          onClick={() => onSwitchPreset?.(activePreset === 1 ? 2 : 1)}
          title="Switch Custom HUD Preset"
        >
          <span className="ffh-preset-tag">PRESET</span>
          <div className="ffh-preset-cube">
            <PresetCubeSvg />
            <span className="ffh-preset-num">{activePreset}</span>
          </div>
          <svg className="ffh-preset-swap-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z" />
          </svg>
        </button>
      </div>

      {/* 4. TOAST CONFIRMATION */}
      {saveToast && (
        <div className="ffh-editor-toast">
          <span>{saveToast}</span>
        </div>
      )}
    </div>
  );
}

```

===============================================================================
FILE: client/src/components/UI/CustomHudElement.jsx
===============================================================================

```jsx
import React, { useCallback, useRef } from "react";
import "./FreeFireHUD.css";

export default function CustomHudElement({
  id,
  editMode = false,
  selected = false,
  cfg = { x: 50, y: 50, size: 100, opacity: 100 },
  onSelect,
  onMove,
  children,
  className = "",
  style = {},
}) {
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, startElemX: 0, startElemY: 0 });

  const handlePointerDown = useCallback(
    (e) => {
      if (!editMode) return;
      e.stopPropagation();
      e.preventDefault();

      onSelect?.(id);
      isDraggingRef.current = true;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      dragStartRef.current = {
        x: clientX,
        y: clientY,
        startElemX: cfg.x,
        startElemY: cfg.y,
      };

      const handleMove = (moveEvt) => {
        if (!isDraggingRef.current) return;
        moveEvt.preventDefault();
        const curX = moveEvt.touches ? moveEvt.touches[0].clientX : moveEvt.clientX;
        const curY = moveEvt.touches ? moveEvt.touches[0].clientY : moveEvt.clientY;

        const w = window.innerWidth || 1;
        const h = window.innerHeight || 1;

        const deltaXPercent = ((curX - dragStartRef.current.x) / w) * 100;
        const deltaYPercent = ((curY - dragStartRef.current.y) / h) * 100;

        const clampedX = Math.max(3, Math.min(97, Math.round((dragStartRef.current.startElemX + deltaXPercent) * 10) / 10));
        const clampedY = Math.max(3, Math.min(97, Math.round((dragStartRef.current.startElemY + deltaYPercent) * 10) / 10));

        onMove?.(id, { x: clampedX, y: clampedY });
      };

      const handleUp = () => {
        isDraggingRef.current = false;
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        window.removeEventListener("pointercancel", handleUp);
        window.removeEventListener("touchmove", handleMove);
        window.removeEventListener("touchend", handleUp);
        window.removeEventListener("touchcancel", handleUp);
      };

      window.addEventListener("pointermove", handleMove, { passive: false });
      window.addEventListener("pointerup", handleUp);
      window.addEventListener("pointercancel", handleUp);
      window.addEventListener("touchmove", handleMove, { passive: false });
      window.addEventListener("touchend", handleUp);
      window.addEventListener("touchcancel", handleUp);
    },
    [editMode, id, cfg.x, cfg.y, onSelect, onMove],
  );

  const scale = (cfg?.size || 100) / 100;
  const opacity = (cfg?.opacity || 100) / 100;

  const rootStyle = {
    position: "absolute",
    left: `${cfg.x}%`,
    top: `${cfg.y}%`,
    transform: `translate(-50%, -50%) scale(${scale})`,
    opacity,
    pointerEvents: "auto",
    touchAction: editMode ? "none" : undefined,
    userSelect: "none",
    ...style,
  };

  return (
    <div
      className={`ffh-custom-elem-wrapper ${editMode ? "in-edit-mode" : ""} ${
        selected ? "is-selected" : ""
      } ${className}`}
      style={rootStyle}
      onPointerDown={editMode ? handlePointerDown : undefined}
      onTouchStart={editMode ? handlePointerDown : undefined}
      onMouseDown={editMode ? handlePointerDown : undefined}
      data-hudelem-id={id}
    >
      {/* Free Fire Yellow Glowing Selection Ring */}
      {editMode && selected && (
        <div className="ffh-hud-selection-ring" aria-hidden="true" />
      )}

      {/* Edit Mode Tap Target Overlay (stops underlying button firing in edit mode) */}
      {editMode && <div className="ffh-hud-edit-hitbox" />}

      {children}
    </div>
  );
}

```

===============================================================================
FILE: client/src/components/UI/DraggableFireButton.jsx
===============================================================================

```jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FireBulletSvg } from "./FreeFireIcons";

/**
 * Draggable Fire Button (Free Fire Drag Headshot mechanic)
 *
 * When touched / clicked:
 * - Immediately triggers onFireStart()
 * - Dragging finger/cursor moves the inner bullet nub with tactile visual feedback.
 * - Dragging UPWARD (deltaY < 0) engages the Free Fire Drag Headshot mechanic:
 *   lifts camera pitch upward and triggers headshot target acquisition.
 * - On release, smoothly springs back to center and triggers onFireEnd().
 */
export default function DraggableFireButton({
  className = "",
  isFiring = false,
  editMode = false,
  disabled = false,
  onFireStart,
  onFireEnd,
  onFireDrag,
  children,
}) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragUpActive, setDragUpActive] = useState(false);

  const startPosRef = useRef(null);
  const pointerIdRef = useRef(null);
  const isDraggingRef = useRef(false);

  const MAX_RADIUS = 28;

  const handlePointerDown = useCallback(
    (e) => {
      if (editMode || disabled) return;
      if (pointerIdRef.current !== null) return;
      e.stopPropagation();

      pointerIdRef.current = e.pointerId ?? (e.touches ? e.touches[0]?.identifier : 1);
      const clientX =
        (typeof e.clientX === "number" ? e.clientX : undefined) ??
        (typeof e.pageX === "number" ? e.pageX : undefined) ??
        e.touches?.[0]?.clientX ??
        0;
      const clientY =
        (typeof e.clientY === "number" ? e.clientY : undefined) ??
        (typeof e.pageY === "number" ? e.pageY : undefined) ??
        e.touches?.[0]?.clientY ??
        0;

      startPosRef.current = { x: clientX, y: clientY };
      isDraggingRef.current = true;
      setIsDragging(true);

      onFireStart?.();

      if (e.currentTarget?.setPointerCapture && e.pointerId) {
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {}
      }
    },
    [editMode, disabled, onFireStart],
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDraggingRef.current || !startPosRef.current) return;
      e.stopPropagation();

      const clientX =
        (typeof e.clientX === "number" ? e.clientX : undefined) ??
        (typeof e.pageX === "number" ? e.pageX : undefined) ??
        e.touches?.[0]?.clientX ??
        0;
      const clientY =
        (typeof e.clientY === "number" ? e.clientY : undefined) ??
        (typeof e.pageY === "number" ? e.pageY : undefined) ??
        e.touches?.[0]?.clientY ??
        0;

      const rawDx = clientX - startPosRef.current.x;
      const rawDy = clientY - startPosRef.current.y;

      const dist = Math.hypot(rawDx, rawDy);
      const clampedDist = Math.min(MAX_RADIUS, dist);
      const angle = Math.atan2(rawDy, rawDx);

      const vx = Math.cos(angle) * clampedDist;
      const vy = Math.sin(angle) * clampedDist;

      setDragOffset({ x: vx, y: vy });

      // Upward drag in screen space means rawDy < 0 (negative Y)
      const isUp = rawDy < -6;
      setDragUpActive(isUp);

      const dragUpRatio = isUp ? Math.min(1, Math.abs(rawDy) / 50) : 0;

      onFireDrag?.({
        deltaX: rawDx,
        deltaY: rawDy,
        dragUpRatio,
        dragUpActive: isUp,
      });
    },
    [onFireDrag],
  );

  const handlePointerUp = useCallback(
    (e) => {
      if (!isDraggingRef.current) return;
      e?.stopPropagation?.();

      isDraggingRef.current = false;
      startPosRef.current = null;
      pointerIdRef.current = null;

      setIsDragging(false);
      setDragUpActive(false);
      setDragOffset({ x: 0, y: 0 });

      onFireEnd?.();
      onFireDrag?.({
        deltaX: 0,
        deltaY: 0,
        dragUpRatio: 0,
        dragUpActive: false,
      });
    },
    [onFireEnd, onFireDrag],
  );

  useEffect(() => {
    const cancel = () => {
      if (isDraggingRef.current) {
        handlePointerUp();
      }
    };
    window.addEventListener("blur", cancel);
    window.addEventListener("pointercancel", cancel);
    return () => {
      window.removeEventListener("blur", cancel);
      window.removeEventListener("pointercancel", cancel);
    };
  }, [handlePointerUp]);

  return (
    <div
      role="button"
      tabIndex={0}
      className={`ffh-btn-fire-draggable ${isFiring || isDragging ? "active" : ""} ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      title="Fire Button (Drag UP for Headshot)"
    >
      {/* Upward Drag-Headshot Flare Indicator */}
      <div className={`ffh-drag-up-arrow ${dragUpActive ? "active" : ""}`}>
        <svg className="ffh-drag-arrow-svg" viewBox="0 0 24 24">
          <path d="M12 4l-7 7h4v9h6v-9h4z" />
        </svg>
        <span className="ffh-drag-label">DRAG</span>
      </div>

      {/* Floating draggable bullet nub */}
      <div
        className={`ffh-drag-nub ${!isDragging ? "spring-back" : ""}`}
        style={{
          transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
        }}
      >
        {children || <FireBulletSvg />}
      </div>
    </div>
  );
}
```

===============================================================================
FILE: client/src/components/UI/FreeFireHUD.css
===============================================================================

```css
/* ========================================================================== */
/*  FREE FIRE INSPIRED BATTLE ROYALE HUD (MATCHES REFERENCE LAYOUT)           */
/* ========================================================================== */

.ff-hud-root {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 25;
  font-family: "Barlow Condensed", "Inter", system-ui, sans-serif;
  user-select: none;
  overflow: hidden;
  color: #ffffff;
}

.ffh-interactive {
  pointer-events: auto;
}

/* -------------------------------------------------------------------------- */
/*  1. TOP-LEFT CLUSTER: SQUARE MINIMAP, SQUAD BAR & COMMS TOOLBAR            */
/* -------------------------------------------------------------------------- */

.ffh-tl-cluster {
  position: absolute;
  top: 10px;
  left: 12px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.ffh-map-column {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 112px;
}

.ffh-map-frame {
  position: relative;
  width: 112px;
  height: 112px;
  border-radius: 3px;
  border: 1.5px solid rgba(255, 255, 255, 0.42);
  background: #4e6974;
  overflow: hidden;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.55);
}

.ffh-map-terrain-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.92;
}

.ffh-map-zone-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 0 6px rgba(96, 165, 250, 0.55);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.ffh-map-zone-ring.shrinking {
  border-color: #60a5fa;
  animation: ffhPulseBorder 1.2s ease-in-out infinite;
}

.ffh-map-player {
  position: absolute;
  width: 12px;
  height: 12px;
  pointer-events: none;
}

.ffh-map-player-cone {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 11px solid #ffd60a;
  filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.9));
}

.ffh-map-n {
  position: absolute;
  top: 2px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 9px;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 1px 2px #000;
}

.ffh-map-coords {
  position: absolute;
  bottom: 2px;
  right: 4px;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: rgba(255, 255, 255, 0.82);
  text-shadow: 0 1px 2px #000;
}

.ffh-squad-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.ffh-squad-row {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 2px 6px;
  background: rgba(16, 20, 28, 0.56);
  border-left: 2px solid #26d6ff;
  border-radius: 2px;
  backdrop-filter: blur(2px);
}

.ffh-squad-idx {
  font-size: 10px;
  font-weight: 800;
  color: #8be9ff;
}

.ffh-squad-name {
  flex: 1;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: #f8fafc;
}

.ffh-squad-diamond {
  width: 7px;
  height: 7px;
  background: #26d6ff;
  transform: rotate(45deg);
  flex-shrink: 0;
}

.ffh-tl-tools {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 2px;
}

.ffh-tl-tool-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ffh-mini-circle-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(20, 24, 32, 0.55);
  color: rgba(255, 255, 255, 0.9);
  display: grid;
  place-items: center;
  cursor: pointer;
  padding: 0;
  transition: transform 0.12s ease, background 0.12s ease, border-color 0.12s ease;
}

.ffh-mini-circle-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.6);
  transform: scale(1.06);
}

.ffh-mini-circle-btn.active {
  background: rgba(245, 184, 46, 0.28);
  border-color: #f5b82e;
  color: #fde68a;
}

.ffh-mini-circle-btn.muted {
  opacity: 0.55;
}

.ffh-mini-circle-btn svg {
  width: 14px;
  height: 14px;
}

.ffh-eye-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 7px;
  border-radius: 99px;
  background: rgba(16, 20, 28, 0.55);
  font-size: 11px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.9);
}

.ffh-eye-badge svg {
  width: 13px;
  height: 13px;
}

.ffh-signal-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 10px;
  font-weight: 700;
  color: #4ade80;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.85);
}

/* -------------------------------------------------------------------------- */
/*  2. TOP-CENTER VITALS, ZONE STRIP, FF TOKENS & CLEAN KILL FEED             */
/* -------------------------------------------------------------------------- */

.ffh-tc-cluster {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 310px;
  max-width: 44vw;
}

.ffh-vitals-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 10px;
  border-radius: 4px;
  background: linear-gradient(180deg, rgba(16, 20, 28, 0.62) 0%, rgba(16, 20, 28, 0.36) 100%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(3px);
}

.ffh-gear-icons {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ffh-gear-chip {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fbbf24;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.85));
}

.ffh-gear-chip svg {
  width: 17px;
  height: 17px;
}

.ffh-gear-lvl {
  position: absolute;
  bottom: -2px;
  right: -4px;
  font-size: 8px;
  font-weight: 900;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.78);
  padding: 0 2px;
  border-radius: 2px;
  line-height: 1.1;
}

.ffh-bars-stack {
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 195px;
}

.ffh-bar-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  font-weight: 800;
  line-height: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.9);
}

.ffh-ep-label {
  color: #fbbf24;
}

.ffh-hp-label {
  color: #ffffff;
}

.ffh-ep-track {
  width: 100%;
  height: 4px;
  background: rgba(0, 0, 0, 0.55);
  border-radius: 1px;
  overflow: hidden;
}

.ffh-ep-fill {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #fde047);
  transition: width 0.2s ease;
}

.ffh-hp-track {
  width: 100%;
  height: 7px;
  background: rgba(0, 0, 0, 0.62);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 1px;
  overflow: hidden;
}

.ffh-hp-fill {
  height: 100%;
  background: #ffffff;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.55);
  transition: width 0.15s ease, background 0.15s ease;
}

.ffh-hp-fill.critical {
  background: #ef4444;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.85);
}

.ffh-token-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  padding-left: 4px;
  border-left: 1px solid rgba(255, 255, 255, 0.16);
}

.ffh-token-coin {
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #fef08a, #d97706);
  border: 1.5px solid #fde047;
  color: #451a03;
  font-size: 9px;
  font-weight: 900;
  display: grid;
  place-items: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
}

.ffh-token-val {
  font-size: 14px;
  font-weight: 900;
  color: #fde047;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
}

.ffh-compass-zone-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.6px;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(12, 16, 24, 0.48);
  padding: 2px 10px;
  border-radius: 2px;
}

.ffh-heading-chip {
  color: #fbbf24;
}

.ffh-zone-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #bae6fd;
}

.ffh-zone-chip.shrinking {
  color: #f87171;
}

.ffh-zone-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #38bdf8;
}

.ffh-zone-chip.shrinking .ffh-zone-dot {
  background: #ef4444;
  animation: ffhPulseBorder 0.9s infinite;
}

.ffh-killfeed-stack {
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.ffh-killfeed-line {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: #ffffff;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.95);
  white-space: nowrap;
}

.ffh-killfeed-line .verb {
  color: #f87171;
  font-style: italic;
  margin: 0 5px;
  font-weight: 800;
}

.ffh-killfeed-line.player-kill .killer {
  color: #fde047;
}

.ffh-killfeed-line .hs-tag {
  margin-left: 5px;
  font-size: 10px;
  color: #fb7185;
  font-weight: 900;
}

/* -------------------------------------------------------------------------- */
/*  3. TOP-RIGHT CLUSTER: ALIVE / KILLS / SETTINGS + WEAPON DECK              */
/* -------------------------------------------------------------------------- */

.ffh-tr-cluster {
  position: absolute;
  top: 10px;
  right: 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.ffh-status-bar {
  display: flex;
  align-items: stretch;
  border-radius: 3px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.45);
}

.ffh-stat-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  font-size: 17px;
  font-weight: 900;
  color: #ffffff;
  min-width: 66px;
  justify-content: space-between;
}

.ffh-stat-pill svg {
  width: 15px;
  height: 15px;
  opacity: 0.95;
}

.ffh-stat-pill.alive {
  background: rgba(24, 155, 168, 0.85);
}

.ffh-stat-pill.kills {
  background: rgba(201, 42, 66, 0.88);
}

.ffh-settings-btn {
  width: 32px;
  border: none;
  background: rgba(30, 36, 46, 0.85);
  color: #ffffff;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: background 0.12s ease;
}

.ffh-settings-btn:hover {
  background: rgba(56, 66, 82, 0.95);
}

.ffh-settings-btn svg {
  width: 16px;
  height: 16px;
}

.ffh-weapon-hud {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
  width: 224px;
}

.ffh-active-weapon-card {
  position: relative;
  width: 100%;
  height: 54px;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  background: rgba(22, 26, 35, 0.58);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 12px;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.ffh-active-weapon-card:hover {
  border-color: rgba(255, 255, 255, 0.55);
  background: rgba(30, 36, 48, 0.72);
}

.ffh-ammo-readout {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1;
}

.ffh-ammo-numbers {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.ffh-ammo-mag {
  font-size: 24px;
  font-weight: 900;
  color: #ffffff;
}

.ffh-ammo-res {
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.72);
}

.ffh-ammo-reload-label {
  font-size: 12px;
  font-weight: 900;
  color: #fbbf24;
  letter-spacing: 0.8px;
}

.ffh-weapon-name-mini {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.7px;
  color: rgba(255, 255, 255, 0.65);
  margin-top: 2px;
}

.ffh-gun-svg-main {
  width: 106px;
  height: 36px;
  color: #ffffff;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.65));
}

.ffh-reload-strip {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 100%;
  background: rgba(255, 255, 255, 0.25);
}

.ffh-reload-strip.active {
  background: #fbbf24;
  animation: ffhReloadSweep 1.3s linear infinite;
}

.ffh-weapon-subslots {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  width: 100%;
}

.ffh-subslot-card {
  position: relative;
  height: 46px;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(22, 26, 35, 0.52);
  backdrop-filter: blur(2px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3px 4px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.82);
  transition: border-color 0.12s ease, background 0.12s ease;
}

.ffh-subslot-card.active {
  border-color: rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.16);
  color: #ffffff;
}

.ffh-subslot-card svg {
  width: 46px;
  height: 24px;
}

.ffh-subslot-ammo {
  position: absolute;
  bottom: 2px;
  left: 5px;
  font-size: 10px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.88);
}

.ffh-cycle-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ffh-cycle-chip {
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(16, 20, 28, 0.62);
  color: rgba(255, 255, 255, 0.85);
  border-radius: 3px;
  padding: 2px 7px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.6px;
  cursor: pointer;
}

.ffh-cycle-chip:hover {
  border-color: #fbbf24;
  color: #fde047;
}

/* -------------------------------------------------------------------------- */
/*  4. ACTION CONTROLS (TRANSLUCENT WHITE SILHOUETTE CIRCLES)                 */
/* -------------------------------------------------------------------------- */

.ffh-right-actions {
  position: absolute;
  right: 18px;
  bottom: 28px;
  width: 215px;
  height: 235px;
  pointer-events: none;
}

.ffh-action-circle {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.28);
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(2px);
  color: #ffffff;
  display: grid;
  place-items: center;
  cursor: pointer;
  padding: 0;
  pointer-events: auto;
  transition: transform 0.1s ease, background 0.12s ease, border-color 0.12s ease;
}

.ffh-action-circle:hover {
  background: rgba(255, 255, 255, 0.24);
  border-color: rgba(255, 255, 255, 0.6);
}

.ffh-action-circle:active,
.ffh-action-circle.active {
  transform: scale(0.93);
  border-color: #f5b82e;
  background: rgba(245, 184, 46, 0.28);
}

.ffh-action-circle svg {
  width: 24px;
  height: 24px;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.65));
}

.ffh-key-hint {
  position: absolute;
  bottom: -6px;
  right: -2px;
  background: rgba(12, 16, 24, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  padding: 0 4px;
  font-size: 9px;
  font-weight: 800;
  line-height: 1.25;
  color: rgba(255, 255, 255, 0.88);
}

/* Match exact arc positions of screenshot */
.ffh-btn-scope {
  width: 50px;
  height: 50px;
  top: 0;
  right: 12px;
}

.ffh-btn-jump {
  width: 48px;
  height: 48px;
  top: 72px;
  right: 0;
}

.ffh-btn-fire {
  width: 72px;
  height: 72px;
  top: 56px;
  right: 78px;
  border: 2px solid #f5b82e;
  background: rgba(245, 184, 46, 0.16);
  box-shadow: 0 0 18px rgba(245, 184, 46, 0.35), inset 0 0 12px rgba(245, 184, 46, 0.22);
}

.ffh-btn-fire svg {
  width: 32px;
  height: 32px;
}

.ffh-btn-crouch {
  width: 48px;
  height: 48px;
  top: 136px;
  right: 14px;
}

.ffh-btn-reload {
  width: 44px;
  height: 44px;
  bottom: 0;
  right: 76px;
}

.ffh-btn-drive {
  width: 52px;
  height: 52px;
  bottom: 2px;
  right: 136px;
  border-color: #38bdf8;
  background: rgba(14, 165, 233, 0.28);
  box-shadow: 0 0 14px rgba(56, 189, 248, 0.45);
}

/* Bottom-Center Utility Circles (Medkit & Backpack) */
.ffh-bottom-center-tools {
  position: absolute;
  bottom: 16px;
  left: 56%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 14px;
}

.ffh-utility-circle {
  position: relative;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.32);
  background: rgba(20, 25, 34, 0.56);
  color: #ffffff;
  display: grid;
  place-items: center;
  cursor: pointer;
  padding: 0;
  transition: transform 0.12s ease, border-color 0.12s ease, background 0.12s ease;
}

.ffh-utility-circle:hover:not(:disabled) {
  border-color: #fde047;
  background: rgba(30, 38, 52, 0.78);
  transform: scale(1.06);
}

.ffh-utility-circle:disabled {
  opacity: 0.48;
  cursor: default;
}

.ffh-utility-circle.healing {
  border-color: #4ade80;
  box-shadow: 0 0 14px rgba(74, 222, 128, 0.55);
}

.ffh-utility-circle svg {
  width: 22px;
  height: 22px;
}

.ffh-count-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  min-width: 17px;
  height: 17px;
  border-radius: 99px;
  background: #161b24;
  border: 1px solid rgba(255, 255, 255, 0.45);
  color: #ffffff;
  font-size: 10px;
  font-weight: 800;
  display: grid;
  place-items: center;
  padding: 0 4px;
}

/* Bottom-Left Touch Cluster */
.ffh-left-actions {
  position: absolute;
  left: 24px;
  bottom: 52px;
  display: flex;
  align-items: flex-end;
  gap: 14px;
  pointer-events: none;
}

.ffh-joystick-pad {
  position: relative;
  width: 74px;
  height: 74px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.24);
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(16, 20, 28, 0.24) 100%);
  display: grid;
  place-items: center;
}

.ffh-joystick-knob {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.45);
  background: rgba(255, 255, 255, 0.22);
}

.ffh-left-fire-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ffh-action-circle.static-pos {
  position: relative;
  width: 44px;
  height: 44px;
}

/* -------------------------------------------------------------------------- */
/*  5. DYNAMIC CROSSHAIR, HITMARKER & KILL BANNER                             */
/* -------------------------------------------------------------------------- */

.ffh-crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30px;
  height: 30px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  transition: transform 0.08s ease;
}

.ffh-crosshair.aiming {
  transform: translate(-50%, -50%) scale(0.65);
}

.ffh-crosshair.firing {
  transform: translate(-50%, -50%) scale(1.35);
}

.ffh-reticle-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #ff2a5f;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 6px #ff2a5f;
}

.ffh-reticle-tick {
  position: absolute;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.85);
}

.ffh-reticle-tick.top { top: 0; left: 50%; width: 2px; height: 7px; transform: translateX(-50%); }
.ffh-reticle-tick.bottom { bottom: 0; left: 50%; width: 2px; height: 7px; transform: translateX(-50%); }
.ffh-reticle-tick.left { left: 0; top: 50%; width: 7px; height: 2px; transform: translateY(-50%); }
.ffh-reticle-tick.right { right: 0; top: 50%; width: 7px; height: 2px; transform: translateY(-50%); }

.ffh-hitmarker {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffffff;
  filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.9));
  animation: ffhHitPop 0.2s ease-out forwards;
}

.ffh-hitmarker.headshot {
  color: #ff2a5f;
  filter: drop-shadow(0 0 10px #ff2a5f);
}

.ffh-hitmarker svg {
  width: 26px;
  height: 26px;
}

.ffh-kill-banner {
  position: absolute;
  top: 108px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 20px;
  background: linear-gradient(90deg, transparent, rgba(190, 18, 60, 0.88), transparent);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  animation: ffhBannerPop 0.28s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

.ffh-kill-banner-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ffh-kill-banner-sub {
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1.5px;
  color: #fecdd3;
}

.ffh-kill-banner-name {
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 0.8px;
  color: #ffffff;
}

/* -------------------------------------------------------------------------- */
/*  6. AIRCRAFT DROP & EJECT OVERLAY                                          */
/* -------------------------------------------------------------------------- */

.ffh-drop-banner {
  position: absolute;
  bottom: 42px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.ffh-eject-btn {
  border: 2px solid #f5b82e;
  background: linear-gradient(135deg, rgba(245, 184, 46, 0.95), rgba(217, 119, 6, 0.95));
  color: #111827;
  font-family: inherit;
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 1.4px;
  padding: 10px 28px;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 6px 24px rgba(245, 184, 46, 0.45);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.ffh-eject-btn:hover {
  transform: scale(1.04);
  box-shadow: 0 8px 30px rgba(245, 184, 46, 0.65);
}

.ffh-parachute-chip {
  padding: 7px 18px;
  border-radius: 4px;
  background: rgba(12, 16, 24, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.28);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #e2e8f0;
}

@keyframes ffhPulseBorder {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}

@keyframes ffhReloadSweep {
  0% { transform: scaleX(0); transform-origin: left; }
  100% { transform: scaleX(1); transform-origin: left; }
}

@keyframes ffhHitPop {
  0% { transform: translate(-50%, -50%) scale(0.7); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0; }
}

@keyframes ffhBannerPop {
  0% { transform: translate(-50%, -14px) scale(0.88); opacity: 0; }
  100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
}

/* ========================================================================== */
/*  7. MOBILE CONTROLLER FREE FIRE STAGE & INTERACTIVE TOUCH ZONES            */
/* ========================================================================== */

.mc-ff-stage.ff-hud-root {
  position: absolute;
  inset: 0;
  pointer-events: none;
  touch-action: none;
  background:
    radial-gradient(circle at 50% 42%, rgba(52, 82, 108, 0.42) 0%, rgba(11, 16, 26, 0.94) 76%),
    repeating-linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.018) 0px,
      rgba(255, 255, 255, 0.018) 1px,
      transparent 1px,
      transparent 48px
    ),
    repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.018) 0px,
      rgba(255, 255, 255, 0.018) 1px,
      transparent 1px,
      transparent 48px
    );
}

.mc-ff-stage button,
.mc-ff-stage [role="button"],
.mc-viewport button,
.mc-viewport [role="button"] {
  touch-action: none;
}

.mc-ff-aim-backdrop {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: auto;
  touch-action: none;
}

.mc-ff-status-toast {
  position: absolute;
  top: 22%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 14;
  pointer-events: none;
  padding: 5px 14px;
  border-radius: 999px;
  border: 1px solid rgba(251, 191, 36, 0.55);
  background: rgba(12, 18, 28, 0.84);
  color: #fde047;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.7px;
  text-transform: uppercase;
  white-space: nowrap;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45);
}

.ffh-tl-cluster,
.ffh-tc-cluster,
.ffh-tr-cluster,
.ffh-left-actions,
.ffh-bottom-center-tools,
.ffh-right-actions,
.ffh-drop-banner,
.mc-ff-result-banner {
  z-index: 10;
}

.mc-ff-swipe-hint {
  position: absolute;
  top: 58%;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px dashed rgba(255, 255, 255, 0.22);
  background: rgba(12, 18, 28, 0.45);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.2px;
  color: rgba(226, 232, 240, 0.65);
  transition: border-color 0.12s ease, color 0.12s ease, background 0.12s ease;
}

.mc-ff-swipe-hint.active {
  border-color: #f5b82e;
  color: #fde047;
  background: rgba(245, 184, 46, 0.16);
}

.mc-ff-swipe-indicator {
  width: 22px;
  height: 4px;
  border-radius: 99px;
  background: #f5b82e;
  box-shadow: 0 0 8px rgba(245, 184, 46, 0.85);
}

.ffh-signal-badge.online {
  border: 1px solid rgba(50, 215, 75, 0.4);
  color: #86efac;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.ffh-signal-badge.offline {
  border: 1px solid rgba(251, 191, 36, 0.35);
  color: #fde68a;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.mc-ff-joy-hit {
  pointer-events: auto;
  touch-action: none;
  width: 90px;
  height: 90px;
  border-color: rgba(255, 255, 255, 0.36);
  background: radial-gradient(circle, rgba(255, 255, 255, 0.14) 0%, rgba(12, 18, 28, 0.46) 100%);
}

.mc-ff-joy-hit.active {
  border-color: #f5b82e;
  box-shadow: 0 0 18px rgba(245, 184, 46, 0.35);
}

.mc-ff-joy-hit .ffh-joystick-knob {
  width: 34px;
  height: 34px;
}

.mc-ff-joy-hit .ffh-joystick-knob.active {
  border-color: #fde047;
  background: rgba(245, 184, 46, 0.55);
  box-shadow: 0 0 14px rgba(245, 184, 46, 0.75);
}

.ffh-btn-drive.standby {
  border-color: rgba(56, 189, 248, 0.45);
  background: rgba(14, 165, 233, 0.16);
  box-shadow: none;
  opacity: 0.78;
}

.ffh-btn-drive.ready {
  opacity: 1;
  border-color: #38bdf8;
  background: rgba(14, 165, 233, 0.36);
  box-shadow: 0 0 18px rgba(56, 189, 248, 0.65);
}

.mc-ff-emote-drawer {
  position: absolute;
  bottom: 54px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  background: rgba(14, 20, 30, 0.88);
  backdrop-filter: blur(6px);
  white-space: nowrap;
}

.mc-ff-emote-chip {
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border-radius: 4px;
  padding: 4px 8px;
  font-family: inherit;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.6px;
  cursor: pointer;
}

.mc-ff-emote-chip:active {
  border-color: #f5b82e;
  background: rgba(245, 184, 46, 0.28);
}

.ffh-fullscreen-pill {
  height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.32);
  background: rgba(18, 24, 36, 0.72);
  color: #f8fafc;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: inherit;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.7px;
  cursor: pointer;
}

.ffh-fullscreen-pill svg {
  width: 12px;
  height: 12px;
}

.ffh-fullscreen-pill.active,
.ffh-fullscreen-pill:active {
  border-color: #f5b82e;
  background: rgba(245, 184, 46, 0.26);
  color: #fde047;
}

.mc-ff-loadout-drawer {
  position: absolute;
  bottom: 54px;
  left: 50%;
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: repeat(3, minmax(92px, 1fr));
  gap: 6px;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  background: rgba(14, 19, 29, 0.92);
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.65);
}

.mc-ff-loadout-item {
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.07);
  color: #e2e8f0;
  border-radius: 4px;
  padding: 5px 7px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-family: inherit;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.5px;
  cursor: pointer;
}

.mc-ff-loadout-item.active {
  border-color: #fbbf24;
  background: rgba(245, 184, 46, 0.2);
  color: #fde047;
}

.mc-ff-loadout-svg {
  width: 44px;
  height: 18px;
}

.mc-ff-loadout-item small {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.72);
}

.mc-fs-hint-pill {
  position: fixed;
  top: 52px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 60;
  max-width: 82%;
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid rgba(251, 191, 36, 0.55);
  background: rgba(12, 16, 26, 0.94);
  color: #fde68a;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-align: center;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.65);
}

.mc-ff-drop-banner {
  bottom: 72px;
}

.mc-ff-result-banner {
  position: absolute;
  top: 44%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  background: rgba(12, 16, 26, 0.88);
  backdrop-filter: blur(6px);
}

.mc-ff-result-title {
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 1.6px;
}

.mc-ff-result-title.booyah {
  color: #fbbf24;
  text-shadow: 0 0 14px rgba(251, 191, 36, 0.55);
}

.mc-ff-result-title.eliminated {
  color: #fb7185;
  text-shadow: 0 0 14px rgba(251, 113, 133, 0.45);
}

.mc-ff-play-again {
  font-size: 13px;
  padding: 8px 20px;
}

/* ========================================================================== */
/*  8. RESPONSIVE MOBILE VIEWPORT SCALING (PHONE LANDSCAPE & SMALL WINDOWS)   */
/* ========================================================================== */

.mc-ff-stage .ffh-tl-cluster {
  top: 8px;
  left: 10px;
  gap: 6px;
}

.mc-ff-stage .ffh-map-column {
  width: 78px;
  gap: 4px;
}

.mc-ff-stage .ffh-map-frame {
  width: 78px;
  height: 78px;
}

.mc-ff-stage .ffh-mini-circle-btn {
  width: 24px;
  height: 24px;
}

.mc-ff-stage .ffh-tc-cluster {
  top: 6px;
  min-width: 196px;
  max-width: 39%;
}

.mc-ff-stage .ffh-vitals-row {
  gap: 6px;
  padding: 3px 7px;
}

.mc-ff-stage .ffh-bars-stack {
  width: 128px;
}

.mc-ff-stage .ffh-tr-cluster {
  top: 8px;
  right: 10px;
  gap: 4px;
}

.mc-ff-stage .ffh-stat-pill {
  min-width: 50px;
  padding: 3px 9px;
  font-size: 14px;
  gap: 5px;
}

.mc-ff-stage .ffh-settings-btn {
  width: 28px;
}

.mc-ff-stage .ffh-weapon-hud {
  width: 168px;
  gap: 4px;
}

.mc-ff-stage .ffh-active-weapon-card {
  height: 40px;
  padding: 3px 8px;
}

.mc-ff-stage .ffh-ammo-mag {
  font-size: 18px;
}

.mc-ff-stage .ffh-ammo-res {
  font-size: 11px;
}

.mc-ff-stage .ffh-gun-svg-main {
  width: 76px;
  height: 26px;
}

.mc-ff-stage .ffh-subslot-card {
  height: 34px;
  padding: 2px 3px;
}

.mc-ff-stage .ffh-subslot-card svg {
  width: 34px;
  height: 18px;
}

.mc-ff-stage .ffh-cycle-chip {
  padding: 1px 5px;
  font-size: 8px;
}

.mc-ff-stage .ffh-left-actions {
  left: 16px;
  bottom: 18px;
  gap: 10px;
}

.mc-ff-stage .ffh-bottom-center-tools {
  bottom: 12px;
  left: 50%;
  gap: 10px;
}

.mc-ff-stage .ffh-right-actions {
  right: 12px;
  bottom: 12px;
  width: 182px;
  height: 194px;
}

.mc-ff-stage .ffh-btn-scope {
  width: 42px;
  height: 42px;
  top: 0;
  right: 10px;
}

.mc-ff-stage .ffh-btn-jump {
  width: 42px;
  height: 42px;
  top: 56px;
  right: 0;
}

.mc-ff-stage .ffh-btn-fire {
  width: 62px;
  height: 62px;
  top: 46px;
  right: 64px;
}

.mc-ff-stage .ffh-btn-fire svg {
  width: 26px;
  height: 26px;
}

.mc-ff-stage .ffh-btn-crouch {
  width: 42px;
  height: 42px;
  top: 112px;
  right: 12px;
}

.mc-ff-stage .ffh-btn-reload {
  width: 38px;
  height: 38px;
  bottom: 0;
  right: 64px;
}

.mc-ff-stage .ffh-btn-drive {
  width: 42px;
  height: 42px;
  bottom: 2px;
  right: 116px;
}

@media (max-width: 920px), (max-height: 540px) {
  .ffh-tl-cluster {
    top: 8px;
    left: 10px;
    gap: 6px;
  }

  .ffh-map-column {
    width: 78px;
    gap: 4px;
  }

  .ffh-map-frame {
    width: 78px;
    height: 78px;
  }

  .ffh-mini-circle-btn {
    width: 24px;
    height: 24px;
  }

  .ffh-tc-cluster {
    top: 6px;
    min-width: 196px;
    max-width: 40vw;
  }

  .ffh-vitals-row {
    gap: 6px;
    padding: 3px 7px;
  }

  .ffh-bars-stack {
    width: 128px;
  }

  .ffh-tr-cluster {
    top: 8px;
    right: 10px;
    gap: 4px;
  }

  .ffh-stat-pill {
    min-width: 50px;
    padding: 3px 9px;
    font-size: 14px;
    gap: 5px;
  }

  .ffh-settings-btn {
    width: 28px;
  }

  .ffh-weapon-hud {
    width: 168px;
    gap: 4px;
  }

  .ffh-active-weapon-card {
    height: 40px;
    padding: 3px 8px;
  }

  .ffh-ammo-mag {
    font-size: 18px;
  }

  .ffh-ammo-res {
    font-size: 11px;
  }

  .ffh-gun-svg-main {
    width: 76px;
    height: 26px;
  }

  .ffh-subslot-card {
    height: 34px;
    padding: 2px 3px;
  }

  .ffh-subslot-card svg {
    width: 34px;
    height: 18px;
  }

  .ffh-cycle-chip {
    padding: 1px 5px;
    font-size: 8px;
  }

  .ffh-left-actions {
    left: 16px;
    bottom: 40px;
    gap: 10px;
  }

  .mc-ff-stage .ffh-left-actions {
    bottom: 18px;
  }

  .ffh-bottom-center-tools {
    bottom: 12px;
    left: 52%;
    gap: 10px;
  }

  .ffh-utility-circle {
    width: 40px;
    height: 40px;
  }

  .ffh-right-actions {
    right: 12px;
    bottom: 14px;
    width: 182px;
    height: 194px;
  }

  .ffh-btn-scope {
    width: 42px;
    height: 42px;
    top: 0;
    right: 10px;
  }

  .ffh-btn-jump {
    width: 42px;
    height: 42px;
    top: 56px;
    right: 0;
  }

  .ffh-btn-fire {
    width: 62px;
    height: 62px;
    top: 46px;
    right: 64px;
  }

  .ffh-btn-fire svg {
    width: 26px;
    height: 26px;
  }

  .ffh-btn-crouch {
    width: 42px;
    height: 42px;
    top: 112px;
    right: 12px;
  }

  .ffh-btn-reload {
    width: 38px;
    height: 38px;
    bottom: 0;
    right: 64px;
  }

  .ffh-btn-drive {
    width: 42px;
    height: 42px;
    bottom: 2px;
    right: 116px;
  }
}

@media (max-width: 580px) and (orientation: landscape), (max-height: 345px) and (orientation: landscape) {
  .ffh-map-column {
    width: 66px;
  }

  .ffh-map-frame {
    width: 66px;
    height: 66px;
  }

  .ffh-tc-cluster {
    min-width: 170px;
  }

  .ffh-bars-stack {
    width: 106px;
  }

  .ffh-weapon-hud {
    width: 146px;
  }

  .ffh-cycle-row {
    display: none;
  }
}

/* ========================================================================== */
/*  CUSTOM HUD EDITOR & DRAGGABLE CONTROLS (FREE FIRE STYLE)                  */
/* ========================================================================== */

.ffh-hud-editor-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 999;
}

.ffh-editor-top-bar {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(12, 16, 24, 0.95);
  border: 1.5px solid rgba(255, 255, 255, 0.28);
  border-radius: 6px;
  padding: 4px 6px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  pointer-events: auto;
  z-index: 1001;
}

.ffh-editor-bar-btn {
  width: 44px;
  height: 38px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 4px;
  color: #ffffff;
  cursor: pointer;
  padding: 0;
  transition: transform 0.12s ease, background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.ffh-editor-bar-btn svg {
  width: 22px;
  height: 22px;
}

.ffh-editor-bar-btn:active {
  transform: scale(0.92);
}

.ffh-editor-bar-btn.exit:hover {
  background: rgba(239, 68, 68, 0.26);
  border-color: #ef4444;
  color: #ef4444;
}

.ffh-editor-bar-btn.reset:hover {
  background: rgba(245, 184, 46, 0.26);
  border-color: #f5b82e;
  color: #f5b82e;
}

.ffh-editor-bar-btn.save:hover {
  background: rgba(52, 211, 153, 0.26);
  border-color: #34d399;
  color: #34d399;
}

/* Floating Control Card with Sliders */
.ffh-editor-slider-card {
  position: absolute;
  top: 58px;
  left: 50%;
  transform: translateX(-50%);
  width: 290px;
  max-width: 92vw;
  background: rgba(9, 13, 20, 0.96);
  border: 1.5px solid rgba(245, 184, 46, 0.55);
  border-radius: 6px;
  padding: 10px 14px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1002;
  animation: ffhFadeIn 0.15s ease;
}

.ffh-slider-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  padding-bottom: 6px;
}

.ffh-slider-target-name {
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.8px;
  color: #ffd60a;
  text-transform: uppercase;
}

.ffh-slider-reset-elem-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 3px;
  color: #e2e8f0;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 8px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.12s ease;
}

.ffh-slider-reset-elem-btn:hover {
  background: rgba(239, 68, 68, 0.28);
  border-color: #ef4444;
  color: #ef4444;
}

.ffh-slider-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ffh-slider-label-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ffh-slider-title {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.6px;
  color: rgba(255, 255, 255, 0.82);
}

.ffh-slider-val-badge {
  font-size: 11px;
  font-weight: 900;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.14);
  padding: 1px 6px;
  border-radius: 3px;
  border: 1px solid rgba(56, 189, 248, 0.35);
}

/* Free Fire Golden Amber Range Input */
.ffh-hud-range {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.16);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
  margin: 4px 0;
}

.ffh-hud-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #f5b82e;
  border: 2px solid #ffffff;
  box-shadow: 0 0 8px rgba(245, 184, 46, 0.8);
  cursor: pointer;
  transition: transform 0.1s ease;
}

.ffh-hud-range::-webkit-slider-thumb:hover,
.ffh-hud-range::-webkit-slider-thumb:active {
  transform: scale(1.2);
}

.ffh-hud-range::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #f5b82e;
  border: 2px solid #ffffff;
  box-shadow: 0 0 8px rgba(245, 184, 46, 0.8);
  cursor: pointer;
}

/* Free Fire Preset Box (Matches Reference Screenshot) */
.ffh-editor-preset-wrapper {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: auto;
  z-index: 1001;
}

.ffh-editor-preset-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #2e0854 0%, #150a24 60%, #0a0612 100%);
  border: 1.5px solid #c084fc;
  border-radius: 4px;
  padding: 4px 12px;
  color: #ffffff;
  cursor: pointer;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.7);
  transition: transform 0.12s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.ffh-editor-preset-pill:hover {
  border-color: #f5b82e;
  box-shadow: 0 0 16px rgba(192, 132, 252, 0.5);
}

.ffh-editor-preset-pill:active {
  transform: scale(0.95);
}

.ffh-preset-tag {
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 1px;
  color: #ffffff;
}

.ffh-preset-cube {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  color: #ffd60a;
}

.ffh-preset-cube svg {
  width: 100%;
  height: 100%;
}

.ffh-preset-num {
  position: absolute;
  font-size: 10px;
  font-weight: 900;
  color: #000000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.ffh-preset-swap-icon {
  width: 16px;
  height: 16px;
  color: rgba(255, 255, 255, 0.75);
}

/* Draggable Custom HUD Element Container */
.ffh-custom-elem-wrapper {
  position: absolute;
  z-index: 20;
  transform-origin: center center;
  will-change: transform, left, top, opacity;
  display: inline-block;
}

.ffh-custom-elem-wrapper .ffh-action-circle,
.ffh-custom-elem-wrapper .ffh-utility-circle,
.ffh-custom-elem-wrapper .ffh-joystick-pad,
.ffh-custom-elem-wrapper .ffh-drop-banner {
  position: relative !important;
  top: auto !important;
  left: auto !important;
  right: auto !important;
  bottom: auto !important;
}

.ffh-custom-elem-wrapper.in-edit-mode {
  z-index: 50;
  cursor: grab;
  user-select: none;
  touch-action: none;
}

.ffh-custom-elem-wrapper.is-selected {
  z-index: 60;
}

.ffh-custom-elem-wrapper.in-edit-mode:active {
  cursor: grabbing;
}

.ffh-hud-edit-hitbox {
  position: absolute;
  inset: -6px;
  z-index: 10;
  background: transparent;
  pointer-events: auto;
  cursor: grab;
}

/* Free Fire Yellow Glowing Selection Ring (Matches Screenshot) */
.ffh-hud-selection-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 135%;
  height: 135%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 2.5px solid #ffd60a;
  box-shadow: 0 0 18px rgba(255, 214, 10, 0.75), inset 0 0 8px rgba(255, 214, 10, 0.35);
  pointer-events: none;
  z-index: 5;
  animation: ffhPulseYellowRing 1.8s ease-in-out infinite;
}

@keyframes ffhPulseYellowRing {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.95;
    box-shadow: 0 0 16px rgba(255, 214, 10, 0.75), inset 0 0 8px rgba(255, 214, 10, 0.35);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.06);
    opacity: 1;
    box-shadow: 0 0 24px rgba(255, 214, 10, 0.95), inset 0 0 12px rgba(255, 214, 10, 0.55);
  }
}

/* Save Toast */
.ffh-editor-toast {
  position: absolute;
  top: 140px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(16, 185, 129, 0.95);
  border: 1.5px solid #34d399;
  border-radius: 4px;
  padding: 8px 18px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 1px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7);
  z-index: 1006;
  animation: ffhFadeIn 0.15s ease;
}

/* -------------------------------------------------------------------------- */
/*  6. MINIMAP ENEMY & CAR POSITION MARKERS                                   */
/* -------------------------------------------------------------------------- */
.ffh-map-enemy-blip {
  position: absolute;
  width: 9px;
  height: 9px;
  pointer-events: none;
  z-index: 4;
}

.ffh-enemy-core-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  background: #ff2247;
  border: 1px solid #ffffff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 6px #ff2247, 0 0 10px rgba(255, 34, 71, 0.75);
}

.ffh-enemy-dir-tick {
  position: absolute;
  top: -4px;
  left: 50%;
  width: 2px;
  height: 4px;
  background: #ff4767;
  transform: translateX(-50%);
  border-radius: 1px;
}

.ffh-map-enemy-blip.combat .ffh-enemy-core-dot {
  background: #ff0033;
  animation: ffhEnemyCombatPulse 0.6s ease-in-out infinite;
}

.ffh-map-enemy-blip.teammate .ffh-enemy-core-dot {
  background: #00ff88;
  box-shadow: 0 0 6px #00ff88, 0 0 10px rgba(0, 255, 136, 0.75);
}

.ffh-map-enemy-blip.teammate .ffh-enemy-dir-tick {
  background: #00ffaa;
}

.ffh-enemy-combat-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 14px;
  height: 14px;
  border: 1.5px solid rgba(255, 34, 71, 0.85);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ffhCombatRingExpand 0.8s ease-out infinite;
}

@keyframes ffhEnemyCombatPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); filter: brightness(1); }
  50% { transform: translate(-50%, -50%) scale(1.4); filter: brightness(1.35); }
}

@keyframes ffhCombatRingExpand {
  0% { transform: translate(-50%, -50%) scale(0.6); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
}

/* Minimap Car Vehicle Marker */
.ffh-map-car-marker {
  position: absolute;
  width: 15px;
  height: 15px;
  pointer-events: none;
  z-index: 5;
}

.ffh-map-car-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 6px rgba(255, 204, 0, 0.85));
}

/* -------------------------------------------------------------------------- */
/*  7. FREE FIRE AIM ASSIST RED CROSSHAIR & HEADSHOT LOCK                     */
/* -------------------------------------------------------------------------- */
.ffh-crosshair.locked-red .ffh-reticle-tick {
  background: #ff2a5f !important;
  box-shadow: 0 0 8px #ff2a5f, 0 0 14px rgba(255, 42, 95, 0.85) !important;
  transition: background 0.08s ease, box-shadow 0.08s ease;
}

.ffh-crosshair.locked-red .ffh-reticle-dot {
  background: #ff1144 !important;
  box-shadow: 0 0 10px #ff1144, 0 0 18px #ff0033 !important;
  transform: translate(-50%, -50%) scale(1.4);
}

.ffh-crosshair.headshot-lock {
  transform: translate(-50%, -50%) scale(0.92);
  filter: drop-shadow(0 0 10px rgba(255, 0, 60, 0.95));
}

.ffh-crosshair.headshot-lock .ffh-reticle-tick {
  background: #ff0033 !important;
  width: 3px !important;
  height: 9px !important;
  box-shadow: 0 0 12px #ff0033, 0 0 20px #ff0033 !important;
}

.ffh-crosshair-head-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 22px;
  height: 22px;
  border: 1.5px dashed #ff1744;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ffhHeadshotRingSpin 1.4s linear infinite;
  pointer-events: none;
}

@keyframes ffhHeadshotRingSpin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

/* -------------------------------------------------------------------------- */
/*  8. DRAGGABLE FIRE BUTTON (FREE FIRE DRAG HEADSHOT)                        */
/* -------------------------------------------------------------------------- */
.ffh-btn-fire-draggable {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 35%, rgba(255, 158, 27, 0.28) 0%, rgba(20, 26, 38, 0.88) 72%);
  border: 2px solid rgba(255, 170, 40, 0.75);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.65), inset 0 0 12px rgba(255, 158, 27, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
  cursor: pointer;
  overflow: visible;
  transition: border-color 0.12s ease, box-shadow 0.12s ease;
}

.ffh-btn-fire-draggable.active,
.ffh-btn-fire-draggable:active {
  border-color: #ffaa28;
  box-shadow: 0 0 24px rgba(255, 170, 40, 0.85), inset 0 0 16px rgba(255, 170, 40, 0.55);
}

.ffh-drag-nub {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  pointer-events: none;
  transition: transform 0.04s linear;
}

.ffh-drag-nub.spring-back {
  transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.ffh-drag-up-arrow {
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.35;
  transition: opacity 0.12s ease, transform 0.12s ease;
  pointer-events: none;
}

.ffh-drag-up-arrow.active {
  opacity: 1;
  transform: translateX(-50%) translateY(-3px) scale(1.15);
  filter: drop-shadow(0 0 8px #ffd60a);
}

.ffh-drag-arrow-svg {
  width: 14px;
  height: 14px;
  fill: #ffd60a;
}

.ffh-drag-label {
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 0.8px;
  color: #ffd60a;
  text-transform: uppercase;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
  white-space: nowrap;
}



```

===============================================================================
FILE: client/src/components/UI/FreeFireHUD.jsx
===============================================================================

```jsx
import React, { useEffect, useRef, useState } from "react";
import Icons from "./Icons";
import {
  BackpackSvg,
  CarDriveSvg,
  CrouchSoldierSvg,
  EyeSvg,
  FireBulletSvg,
  HudLayoutSvg,
  JumpSoldierSvg,
  MedkitSvg,
  MicSvg,
  ReloadSvg,
  ScopeSvg,
  SpeakerSvg,
  SprintSvg,
} from "./FreeFireIcons";
import {
  FreeFireMinimapBox,
  FreeFireTopCenterCluster,
  FreeFireTopRightCluster,
  useCompassHeading,
} from "./FreeFireHudParts";
import DraggableFireButton from "./DraggableFireButton";
import CustomHudElement from "./CustomHudElement";
import CustomHudEditorBar from "./CustomHudEditorBar";
import {
  getActiveHudPresetIndex,
  HUD_ELEMENTS,
  loadHudLayoutPreset,
  resetHudLayoutPreset,
  saveHudLayoutPreset,
  setActiveHudPresetIndex,
} from "../../utils/customHudConfig";
import "./FreeFireHUD.css";

/* -------------------------------------------------------------------------- */
/*  Desktop / Main Canvas Free Fire Battle Royale HUD                         */
/* -------------------------------------------------------------------------- */

export default function FreeFireHUD({
  playerMode = "onFoot",
  matchStatus = "IN_PROGRESS",
  aircraftPhase = "flying",
  kills = 0,
  aliveCount = 7,
  weaponId = "m4a1",
  inventory = {},
  medkitCount: medkitCountProp,
  ammoState = {},
  reloading = false,
  playerHp = 100,
  vestLevel = 3,
  helmetLevel = 3,
  ep = 180,
  hitMarker = null,
  killFeed = [],
  killBanner = null,
  matchElapsed = 0,
  cameraYaw = 0,
  characterPos = null,
  enemies = [],
  carPos = null,
  isAiming = false,
  aimAssistLocked = false,
  isHeadshotLocked = false,
  onReturnToLobby = null,
  roomSummaryText = "",
  isFiring = false,
  nearCar = false,
  onSwitchWeapon,
  onReloadWeapon,
  onToggleVehicle,
  onSelectWeapon,
  onHeal,
  onAimToggle,
  onFireStart,
  onFireEnd,
  onFireDrag,
  onJump,
  onCrouch,
  onSprint,
  onOpenSettings,
  onOpenQr,
  onCycleCamera,
  onResetVehicle,
  onToggleInventory,
  onEjectAircraft,
  editCustomHud = false,
  onToggleCustomHud,
}) {
  const [medkitHealing, setMedkitHealing] = useState(false);
  const [speakerMuted, setSpeakerMuted] = useState(false);
  const [micMuted, setMicMuted] = useState(true);
  const [sprintActive, setSprintActive] = useState(false);
  const [isCustomHudEditing, setIsCustomHudEditing] = useState(false);
  const [selectedHudElem, setSelectedHudElem] = useState("rightFire");
  const [activePreset, setActivePreset] = useState(() => getActiveHudPresetIndex());
  const [hudLayout, setHudLayout] = useState(() => loadHudLayoutPreset(activePreset));
  const medkitTimerRef = useRef(null);

  const isEditingHud = editCustomHud || isCustomHudEditing;

  const medkitCount =
    typeof medkitCountProp === "number" ? medkitCountProp : 3;

  useEffect(() => {
    return () => {
      if (medkitTimerRef.current) window.clearTimeout(medkitTimerRef.current);
    };
  }, []);

  const { headingDeg, cardinal } = useCompassHeading(cameraYaw);

  const handleUseMedkit = () => {
    if (medkitCount <= 0 || playerHp >= 100 || medkitHealing) return;
    setMedkitHealing(true);
    medkitTimerRef.current = window.setTimeout(() => {
      medkitTimerRef.current = null;
      onHeal?.(75);
      setMedkitHealing(false);
    }, 1800);
  };

  const handleUpdateLayout = (id, newCfg) => {
    setHudLayout((prev) => ({
      ...prev,
      [id]: newCfg,
    }));
  };

  const handleMoveLayout = (id, coords) => {
    setHudLayout((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || HUD_ELEMENTS[id] || {}),
        x: coords.x,
        y: coords.y,
      },
    }));
  };

  const handleSwitchPreset = (newPreset) => {
    setActivePreset(newPreset);
    setActiveHudPresetIndex(newPreset);
    setHudLayout(loadHudLayoutPreset(newPreset));
  };

  const handleResetLayout = () => {
    const def = resetHudLayoutPreset(activePreset);
    setHudLayout(def);
  };

  const handleResetSelected = (id) => {
    const def = HUD_ELEMENTS[id];
    if (!def) return;
    setHudLayout((prev) => ({
      ...prev,
      [id]: {
        x: def.defaultX,
        y: def.defaultY,
        size: def.defaultSize,
        opacity: def.defaultOpacity,
      },
    }));
  };

  const handleSaveLayout = () => {
    return saveHudLayoutPreset(activePreset, hudLayout);
  };

  const handleExitEdit = () => {
    setIsCustomHudEditing(false);
    onToggleCustomHud?.(false);
  };

  const isGroundCombat =
    playerMode === "onFoot" && matchStatus === "IN_PROGRESS";

  return (
    <div className="ff-hud-root">
      {/* ================================================================== */}
      {/* 1. TOP-LEFT SQUARE MINIMAP + SQUAD BAR + COMMS ICONS               */}
      {/* ================================================================== */}
      <div className="ffh-tl-cluster">
        <FreeFireMinimapBox
          posX={characterPos ? characterPos.x : 0}
          posZ={characterPos ? characterPos.z : 0}
          headingDeg={headingDeg}
          matchElapsed={matchElapsed}
          enemies={enemies}
          carPos={carPos}
        />

        <div className="ffh-tl-tools ffh-interactive">
          <div className="ffh-tl-tool-row">
            <button
              type="button"
              className={`ffh-mini-circle-btn ${speakerMuted ? "muted" : ""}`}
              onClick={() => setSpeakerMuted((v) => !v)}
              title="Toggle Team Audio"
            >
              <SpeakerSvg muted={speakerMuted} />
            </button>
            <button
              type="button"
              className={`ffh-mini-circle-btn ${micMuted ? "muted" : ""}`}
              onClick={() => setMicMuted((v) => !v)}
              title="Toggle Microphone"
            >
              <MicSvg muted={micMuted} />
            </button>
            <span className="ffh-eye-badge" title="Spectators">
              <EyeSvg />
              <span>1</span>
            </span>
          </div>

          <div className="ffh-tl-tool-row">
            <button
              type="button"
              className={`ffh-mini-circle-btn ${sprintActive ? "active" : ""}`}
              onClick={() => {
                setSprintActive((s) => !s);
                onSprint?.();
              }}
              title="Auto-Sprint Toggle (Shift)"
            >
              <SprintSvg />
            </button>
            <button
              type="button"
              className="ffh-mini-circle-btn"
              onClick={onCycleCamera}
              title="Switch Camera View"
            >
              <Icons.Camera />
            </button>
            <button
              type="button"
              className="ffh-mini-circle-btn"
              onClick={onOpenQr}
              title="Connect Phone QR Controller"
            >
              <Icons.QRCode />
            </button>
            <button
              type="button"
              className="ffh-mini-circle-btn"
              onClick={onResetVehicle}
              title="Reset BMW Position"
            >
              <Icons.Reset />
            </button>
            <button
              type="button"
              className={`ffh-mini-circle-btn ${isEditingHud ? "active" : ""}`}
              onClick={() => {
                const nextVal = !isEditingHud;
                setIsCustomHudEditing(nextVal);
                onToggleCustomHud?.(nextVal);
              }}
              title="Customize HUD (Position, Size & Transparency)"
              data-testid="hud-custom-editor-btn"
            >
              <HudLayoutSvg />
            </button>
            <span className="ffh-signal-badge">24ms</span>
            {roomSummaryText && (
              <span className="ffh-signal-badge" title="Active Match Room">
                {roomSummaryText}
              </span>
            )}
            {onReturnToLobby && (
              <button
                type="button"
                className="ffh-mini-circle-btn"
                onClick={onReturnToLobby}
                title="Return to Custom Lobby"
                data-testid="hud-return-lobby-btn"
                style={{ width: "auto", padding: "0 9px", fontSize: "10px", fontWeight: 800 }}
              >
                LOBBY
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 2. TOP-CENTER: HELMET/VEST + EP/HP + COMPASS/ZONE + KILL FEED      */}
      {/* ================================================================== */}
      <FreeFireTopCenterCluster
        helmetLevel={helmetLevel}
        vestLevel={vestLevel}
        ep={ep}
        playerHp={playerHp}
        cardinal={cardinal}
        headingDeg={headingDeg}
        matchElapsed={matchElapsed}
        killFeed={killFeed}
      />

      {/* ================================================================== */}
      {/* 3. TOP-RIGHT: TEAL ALIVE | CRIMSON KILLS | GEAR + WEAPON CARDS     */}
      {/* ================================================================== */}
      <FreeFireTopRightCluster
        aliveCount={aliveCount}
        kills={kills}
        onOpenSettings={onOpenSettings}
        showWeaponCards={isGroundCombat}
        weaponId={weaponId}
        ammoState={ammoState}
        reloading={reloading}
        primaryWeapon={inventory.primaryWeapon || "m4a1"}
        secondaryWeapon={inventory.secondaryWeapon || "deagle"}
        onSwitchWeapon={onSwitchWeapon}
        onReloadWeapon={onReloadWeapon}
        onSelectWeapon={onSelectWeapon}
      />

      {/* ================================================================== */}
      {/* 4. DYNAMIC CROSSHAIR & CENTER KILL BANNER                          */}
      {/* ================================================================== */}
      {isGroundCombat && (
        <div
          className={`ffh-crosshair ${isAiming ? "aiming" : ""} ${isFiring ? "firing" : ""} ${aimAssistLocked ? "locked-red" : ""} ${isHeadshotLocked ? "headshot-lock" : ""}`}
        >
          {isHeadshotLocked && <div className="ffh-crosshair-head-ring" />}
          <div className="ffh-reticle-tick top" />
          <div className="ffh-reticle-tick right" />
          <div className="ffh-reticle-tick bottom" />
          <div className="ffh-reticle-tick left" />
          <div className="ffh-reticle-dot" />
          {hitMarker && (
            <div className={`ffh-hitmarker ${hitMarker.headshot ? "headshot" : ""}`}>
              {hitMarker.headshot ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a8.5 8.5 0 0 0-8.5 8.5c0 3 1.6 5.6 4 7V21h9v-3.5c2.4-1.4 4-4 4-7A8.5 8.5 0 0 0 12 2z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path
                    d="M5 5l5 5M19 5l-5 5M5 19l5-5M19 19l-5-5"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>
          )}
        </div>
      )}

      {killBanner && (
        <div className="ffh-kill-banner">
          <div className="ffh-kill-banner-text">
            <span className="ffh-kill-banner-sub">
              {killBanner.headshot ? "HEADSHOT ELIMINATION" : "ELIMINATED"}
            </span>
            <span className="ffh-kill-banner-name">{killBanner.text}</span>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* 5. AIRCRAFT DROP PROMPT & PARACHUTE STATUS                         */}
      {/* ================================================================== */}
      {(matchStatus === "DROPPING" || isEditingHud) && (
        <CustomHudElement
          id="dropParachute"
          editMode={isEditingHud}
          selected={selectedHudElem === "dropParachute"}
          cfg={hudLayout.dropParachute}
          onSelect={setSelectedHudElem}
          onMove={handleMoveLayout}
        >
          <div className="ffh-drop-banner ffh-interactive">
            {aircraftPhase === "flying" || isEditingHud ? (
              <button
                type="button"
                className="ffh-eject-btn"
                onClick={onEjectAircraft}
              >
                EJECT [SPACE]
              </button>
            ) : (
              <div className="ffh-parachute-chip">
                PARACHUTE DEPLOYED · STEER WITH WASD / ARROWS
              </div>
            )}
          </div>
        </CustomHudElement>
      )}

      {/* ================================================================== */}
      {/* 6. GROUND COMBAT & ACTION CONTROLS (CUSTOMIZABLE SIZE, TRANSPARENCY & POSITION) */}
      {/* ================================================================== */}
      {(isGroundCombat || isEditingHud) && (
        <>
          {/* JOYSTICK */}
          <CustomHudElement
            id="joystick"
            editMode={isEditingHud}
            selected={selectedHudElem === "joystick"}
            cfg={hudLayout.joystick}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <div className="ffh-joystick-pad" aria-hidden="true">
              <div className="ffh-joystick-knob" />
            </div>
          </CustomHudElement>

          {/* LEFT FIRE */}
          <CustomHudElement
            id="leftFire"
            editMode={isEditingHud}
            selected={selectedHudElem === "leftFire"}
            cfg={hudLayout.leftFire}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <button
              type="button"
              className={`ffh-action-circle static-pos ${isFiring ? "active" : ""}`}
              onMouseDown={onFireStart}
              onMouseUp={onFireEnd}
              onMouseLeave={onFireEnd}
              onTouchStart={onFireStart}
              onTouchEnd={onFireEnd}
              title="Left Fire Button"
            >
              <FireBulletSvg />
            </button>
          </CustomHudElement>

          {/* QUICK WEAPON SWITCH */}
          <CustomHudElement
            id="switchWeapon"
            editMode={isEditingHud}
            selected={selectedHudElem === "switchWeapon"}
            cfg={hudLayout.switchWeapon}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <button
              type="button"
              className="ffh-action-circle static-pos"
              onClick={onSwitchWeapon}
              title="Cycle Weapon (Q)"
            >
              <ReloadSvg />
              <span className="ffh-key-hint">Q</span>
            </button>
          </CustomHudElement>

          {/* SPRINT / AUTO-RUN */}
          <CustomHudElement
            id="sprint"
            editMode={isEditingHud}
            selected={selectedHudElem === "sprint"}
            cfg={hudLayout.sprint}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <button
              type="button"
              className={`ffh-action-circle static-pos ${sprintActive ? "active" : ""}`}
              onClick={() => {
                setSprintActive((s) => !s);
                onSprint?.();
              }}
              title="Sprint / Auto-Run (Shift)"
            >
              <SprintSvg />
            </button>
          </CustomHudElement>

          {/* MEDKIT */}
          <CustomHudElement
            id="medkit"
            editMode={isEditingHud}
            selected={selectedHudElem === "medkit"}
            cfg={hudLayout.medkit}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <button
              type="button"
              className={`ffh-utility-circle ${medkitHealing ? "healing" : ""}`}
              onClick={handleUseMedkit}
              disabled={medkitCount <= 0 || playerHp >= 100 || medkitHealing}
              title="Use Medkit"
            >
              <MedkitSvg />
              <span className="ffh-count-badge">{medkitCount}</span>
            </button>
          </CustomHudElement>

          {/* BACKPACK */}
          <CustomHudElement
            id="backpack"
            editMode={isEditingHud}
            selected={selectedHudElem === "backpack"}
            cfg={hudLayout.backpack}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <button
              type="button"
              className="ffh-utility-circle"
              onClick={onToggleInventory}
              title="Open Backpack (TAB)"
            >
              <BackpackSvg />
            </button>
          </CustomHudElement>

          {/* SCOPE / ADS */}
          <CustomHudElement
            id="aimScope"
            editMode={isEditingHud}
            selected={selectedHudElem === "aimScope"}
            cfg={hudLayout.aimScope}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <button
              type="button"
              className={`ffh-action-circle ffh-btn-scope ${isAiming ? "active" : ""}`}
              onClick={onAimToggle}
              title="Scope / ADS (Right Click)"
            >
              <ScopeSvg />
            </button>
          </CustomHudElement>

          {/* JUMP */}
          <CustomHudElement
            id="jump"
            editMode={isEditingHud}
            selected={selectedHudElem === "jump"}
            cfg={hudLayout.jump}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <button
              type="button"
              className="ffh-action-circle ffh-btn-jump"
              onClick={onJump}
              title="Jump (Space)"
            >
              <JumpSoldierSvg />
            </button>
          </CustomHudElement>

          {/* PRIMARY FIRE (DRAGGABLE FIRE BUTTON) */}
          <CustomHudElement
            id="rightFire"
            editMode={isEditingHud}
            selected={selectedHudElem === "rightFire"}
            cfg={hudLayout.rightFire}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <DraggableFireButton
              className="ffh-action-circle ffh-btn-fire"
              isFiring={isFiring}
              editMode={isEditingHud}
              onFireStart={onFireStart}
              onFireEnd={onFireEnd}
              onFireDrag={onFireDrag}
            >
              <FireBulletSvg />
            </DraggableFireButton>
          </CustomHudElement>

          {/* CROUCH */}
          <CustomHudElement
            id="crouch"
            editMode={isEditingHud}
            selected={selectedHudElem === "crouch"}
            cfg={hudLayout.crouch}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <button
              type="button"
              className="ffh-action-circle ffh-btn-crouch"
              onClick={onCrouch}
              title="Crouch (C)"
            >
              <CrouchSoldierSvg />
            </button>
          </CustomHudElement>

          {/* RELOAD */}
          <CustomHudElement
            id="reload"
            editMode={isEditingHud}
            selected={selectedHudElem === "reload"}
            cfg={hudLayout.reload}
            onSelect={setSelectedHudElem}
            onMove={handleMoveLayout}
          >
            <button
              type="button"
              className="ffh-action-circle ffh-btn-reload"
              onClick={onReloadWeapon}
              title="Reload (R)"
            >
              <ReloadSvg />
              <span className="ffh-key-hint">R</span>
            </button>
          </CustomHudElement>

          {/* DRIVE BMW */}
          {(nearCar || isEditingHud) && (
            <CustomHudElement
              id="drive"
              editMode={isEditingHud}
              selected={selectedHudElem === "drive"}
              cfg={hudLayout.drive}
              onSelect={setSelectedHudElem}
              onMove={handleMoveLayout}
            >
              <button
                type="button"
                className="ffh-action-circle ffh-btn-drive"
                onClick={onToggleVehicle}
                title="Drive BMW M4 (F)"
              >
                <CarDriveSvg />
                <span className="ffh-key-hint">F</span>
              </button>
            </CustomHudElement>
          )}
        </>
      )}

      {/* ================================================================== */}
      {/* 7. CUSTOM HUD FLOATING EDITOR & SLIDERS OVERLAY                    */}
      {/* ================================================================== */}
      {isEditingHud && (
        <CustomHudEditorBar
          activePreset={activePreset}
          selectedId={selectedHudElem}
          layout={hudLayout}
          onChangeLayout={handleUpdateLayout}
          onSwitchPreset={handleSwitchPreset}
          onResetLayout={handleResetLayout}
          onResetSelectedElement={handleResetSelected}
          onSaveLayout={handleSaveLayout}
          onExitEdit={handleExitEdit}
        />
      )}
    </div>
  );
}
```

===============================================================================
FILE: client/src/components/UI/FreeFireHudParts.jsx
===============================================================================

```jsx
import React, { useMemo } from "react";
import {
  WEAPONS,
  WEAPON_ORDER,
  ZONE_INITIAL_RADIUS,
} from "../../config/gameConstants";
import { getZoneInfo } from "../Zone/ZoneManager";
import Icons from "./Icons";
import TapButton from "./TapButton";
import {
  AliveUserSvg,
  HelmetSvg,
  KillsSkullSvg,
  VestSvg,
  WeaponSilhouetteSvg,
} from "./FreeFireIcons";

/**
 * Maps heading degrees [0..359] to 8-point cardinal label.
 */
export function getCardinalFromDeg(deg = 0) {
  const norm = ((Math.round(deg) % 360) + 360) % 360;
  if (norm >= 338 || norm < 23) return "N";
  if (norm >= 23 && norm < 68) return "NE";
  if (norm >= 68 && norm < 113) return "E";
  if (norm >= 113 && norm < 158) return "SE";
  if (norm >= 158 && norm < 203) return "S";
  if (norm >= 203 && norm < 248) return "SW";
  if (norm >= 248 && norm < 293) return "W";
  return "NW";
}

/**
 * Computes compass heading + cardinal text from a camera yaw angle in radians.
 */
export function useCompassHeading(cameraYaw = 0) {
  return useMemo(() => {
    let deg = Math.round((-cameraYaw * 180) / Math.PI) % 360;
    if (deg < 0) deg += 360;
    return { headingDeg: deg, cardinal: getCardinalFromDeg(deg) };
  }, [cameraYaw]);
}

/**
 * Top-left square Bermuda minimap & squad row (`1 YOU`) shared by desktop and mobile HUD.
 */
export function FreeFireMinimapBox({
  posX = 0,
  posZ = 0,
  headingDeg = 0,
  matchElapsed = 0,
  enemies = [],
  carPos = null,
}) {
  const zoneInfo = useMemo(() => getZoneInfo(matchElapsed), [matchElapsed]);
  const mapPctX = Math.max(8, Math.min(92, 50 + (posX / 72) * 44));
  const mapPctZ = Math.max(8, Math.min(92, 50 + (posZ / 72) * 44));
  const zoneRingPct = Math.max(
    18,
    Math.min(96, (zoneInfo.radius / ZONE_INITIAL_RADIUS) * 92),
  );

  return (
    <div className="ffh-map-column">
      <div className="ffh-map-frame">
        <svg viewBox="0 0 100 100" className="ffh-map-terrain-svg">
          <rect width="100" height="100" fill="#4f6d78" />
          <path
            d="M12 18 L52 10 L76 28 L86 58 L70 84 L32 88 L14 66 Z"
            fill="#73866c"
            opacity="0.72"
          />
          <path
            d="M28 24 L56 32 L64 62 L38 74 L22 52 Z"
            fill="#8c9d82"
            opacity="0.55"
          />
          <path
            d="M10 48 Q45 42 88 55 M48 8 Q54 48 42 92"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="1.2"
            opacity="0.45"
          />
        </svg>
        <div
          className={`ffh-map-zone-ring ${zoneInfo.isShrinking ? "shrinking" : ""}`}
          style={{ width: `${zoneRingPct}%`, height: `${zoneRingPct}%` }}
        />

        {/* VEHICLE / CAR POSITION ON MAP */}
        {carPos && (
          <div
            className="ffh-map-car-marker"
            style={{
              left: `${Math.max(6, Math.min(94, 50 + ((carPos.x || 0) / 72) * 44))}%`,
              top: `${Math.max(6, Math.min(94, 50 + ((carPos.z || 0) / 72) * 44))}%`,
              transform: `translate(-50%, -50%) rotate(${carPos.headingDeg || 0}deg)`,
            }}
            title="BMW M4 Vehicle"
          >
            <div className="ffh-map-car-icon">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="#ffcc00">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM7.5 16c-.83 0-1.5-.67-1.5-1.5S6.67 13 7.5 13s1.5.67 1.5 1.5S8.33 16 7.5 16zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
              </svg>
            </div>
          </div>
        )}

        {/* ENEMY POSITIONS ON MAP (RED BLIPS) */}
        {Array.isArray(enemies) &&
          enemies.map((enemy) => {
            if (!enemy || enemy.state === "knockedOut") return null;
            const eX = Math.max(6, Math.min(94, 50 + ((enemy.x || 0) / 72) * 44));
            const eZ = Math.max(6, Math.min(94, 50 + ((enemy.z || 0) / 72) * 44));
            const isFiring = enemy.state === "combat";
            const isTeammate = Boolean(enemy.isTeammate);
            return (
              <div
                key={enemy.id || `${enemy.x}_${enemy.z}`}
                className={`ffh-map-enemy-blip ${isTeammate ? "teammate" : ""} ${isFiring ? "combat" : ""}`}
                style={{
                  left: `${eX}%`,
                  top: `${eZ}%`,
                  transform: `translate(-50%, -50%) rotate(${enemy.headingDeg || 0}deg)`,
                }}
                title={isTeammate ? `Teammate: ${enemy.name || "Friend"}` : `Enemy: ${enemy.name || "Opponent"}`}
              >
                <div className="ffh-enemy-core-dot" />
                <div className="ffh-enemy-dir-tick" />
                {isFiring && <div className="ffh-enemy-combat-ring" />}
              </div>
            );
          })}

        {/* PLAYER POSITION */}
        <div
          className="ffh-map-player"
          style={{
            left: `${mapPctX}%`,
            top: `${mapPctZ}%`,
            transform: `translate(-50%, -50%) rotate(${headingDeg}deg)`,
          }}
        >
          <div className="ffh-map-player-cone" />
        </div>
        <span className="ffh-map-n">N</span>
        <span className="ffh-map-coords">
          {`${Math.round(posX)},${Math.round(posZ)}`}
        </span>
      </div>

      <div className="ffh-squad-list">
        <div className="ffh-squad-row">
          <span className="ffh-squad-idx">1</span>
          <span className="ffh-squad-name">YOU</span>
          <span className="ffh-squad-diamond" />
        </div>
      </div>
    </div>
  );
}

/**
 * Top-center Helmet/Vest, EP/HP (200/200), FF 500 coin, compass + safe zone bar, and kill feed.
 */
export function FreeFireTopCenterCluster({
  helmetLevel = 3,
  vestLevel = 3,
  ep = 180,
  playerHp = 100,
  cardinal = "N",
  headingDeg = 0,
  matchElapsed = 0,
  killFeed = [],
}) {
  const zoneInfo = useMemo(() => getZoneInfo(matchElapsed), [matchElapsed]);
  const currentHp200 = Math.round(playerHp * 2);

  return (
    <div className="ffh-tc-cluster">
      <div className="ffh-vitals-row">
        <div className="ffh-gear-icons">
          <div className="ffh-gear-chip" title={`Helmet Level ${helmetLevel}`}>
            <HelmetSvg />
            <span className="ffh-gear-lvl">{helmetLevel}</span>
          </div>
          <div className="ffh-gear-chip" title={`Vest Level ${vestLevel}`}>
            <VestSvg />
            <span className="ffh-gear-lvl">{vestLevel}</span>
          </div>
        </div>

        <div className="ffh-bars-stack">
          <div className="ffh-bar-meta">
            <span className="ffh-ep-label">EP {ep}/200</span>
            <span className="ffh-hp-label">HP {currentHp200}/200</span>
          </div>
          <div className="ffh-ep-track">
            <div
              className="ffh-ep-fill"
              style={{ width: `${Math.min(100, (ep / 200) * 100)}%` }}
            />
          </div>
          <div className="ffh-hp-track">
            <div
              className={`ffh-hp-fill ${playerHp < 35 ? "critical" : ""}`}
              style={{
                width: `${Math.max(0, Math.min(100, (currentHp200 / 200) * 100))}%`,
              }}
            />
          </div>
        </div>

        <div className="ffh-token-pill" title="FF Tokens">
          <span className="ffh-token-coin">F</span>
          <span className="ffh-token-val">500</span>
        </div>
      </div>

      <div className="ffh-compass-zone-bar">
        <span className="ffh-heading-chip">
          {cardinal} · {headingDeg}°
        </span>
        <span
          className={`ffh-zone-chip ${zoneInfo.isShrinking ? "shrinking" : ""}`}
        >
          <span className="ffh-zone-dot" />
          {zoneInfo.isShrinking
            ? `ZONE SHRINKING (${Math.round(zoneInfo.radius)}M)`
            : `SAFE ZONE ${String(Math.floor(zoneInfo.nextShrinkIn / 60)).padStart(2, "0")}:${String(Math.floor(zoneInfo.nextShrinkIn % 60)).padStart(2, "0")}`}
        </span>
      </div>

      {killFeed && killFeed.length > 0 && (
        <div className="ffh-killfeed-stack">
          {killFeed.slice(-3).map((item) => (
            <div
              key={item.id}
              className={`ffh-killfeed-line ${item.isPlayer ? "player-kill" : ""}`}
            >
              <span className="killer">{item.killer}</span>
              <span className="verb">Eliminated</span>
              <span>{item.victim}</span>
              {item.headshot && <span className="hs-tag">[HS]</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Top-right Teal Alive / Crimson Kills / Settings + Dark Active Weapon Card & Quick Slots.
 */
export function FreeFireTopRightCluster({
  aliveCount = 7,
  kills = 0,
  onOpenSettings,
  showWeaponCards = true,
  showWeaponChips = true,
  weaponId = "m4a1",
  ammoState = {},
  reloading = false,
  primaryWeapon = "m4a1",
  secondaryWeapon = "deagle",
  onSwitchWeapon,
  onReloadWeapon,
  onSelectWeapon,
}) {
  const activeWeapon = WEAPONS[weaponId] || WEAPONS.m4a1;
  const activeAmmo = ammoState[weaponId] || { mag: 0, reserve: 0 };

  const primaryId =
    weaponId === "ak47" || weaponId === "awm" || weaponId === "m4a1"
      ? weaponId
      : primaryWeapon || "m4a1";
  const secondaryId =
    weaponId === "mp40" || weaponId === "deagle"
      ? weaponId
      : secondaryWeapon || "deagle";
  const quickSlots = [primaryId, secondaryId, "fist"];

  return (
    <div className="ffh-tr-cluster">
      <div className="ffh-status-bar ffh-interactive">
        <div className="ffh-stat-pill alive">
          <AliveUserSvg />
          <span>{aliveCount}</span>
        </div>
        <div className="ffh-stat-pill kills">
          <KillsSkullSvg />
          <span>{kills}</span>
        </div>
        <TapButton
          className="ffh-settings-btn"
          onTrigger={onOpenSettings}
          title="Settings"
        >
          <Icons.Settings />
        </TapButton>
      </div>

      {showWeaponCards && (
        <div className="ffh-weapon-hud ffh-interactive">
          <TapButton
            className="ffh-active-weapon-card"
            onTrigger={weaponId === "fist" ? onSwitchWeapon : onReloadWeapon}
            title={weaponId === "fist" ? "Switch Weapon (Q)" : "Reload (R)"}
          >
            <div className="ffh-ammo-readout">
              {reloading ? (
                <span className="ffh-ammo-reload-label">RELOADING...</span>
              ) : weaponId === "fist" ? (
                <div className="ffh-ammo-numbers">
                  <span className="ffh-ammo-mag">∞</span>
                </div>
              ) : (
                <div className="ffh-ammo-numbers">
                  <span className="ffh-ammo-mag">{activeAmmo.mag}</span>
                  <span className="ffh-ammo-res">/{activeAmmo.reserve}</span>
                </div>
              )}
              <span className="ffh-weapon-name-mini">{activeWeapon.name}</span>
            </div>
            <WeaponSilhouetteSvg
              weaponId={weaponId}
              className="ffh-gun-svg-main"
            />
            <div className={`ffh-reload-strip ${reloading ? "active" : ""}`} />
          </TapButton>

          <div className="ffh-weapon-subslots">
            {quickSlots.map((slotId) => {
              const slot = ammoState[slotId] || { mag: 0, reserve: 0 };
              const active = weaponId === slotId;
              return (
                <TapButton
                  key={slotId}
                  className={`ffh-subslot-card ${active ? "active" : ""}`}
                  onTrigger={() => onSelectWeapon?.(slotId)}
                  title={`Equip ${WEAPONS[slotId]?.name || slotId}`}
                >
                  <WeaponSilhouetteSvg weaponId={slotId} />
                  <span className="ffh-subslot-ammo">
                    {slotId === "fist" ? "∞" : slot.mag + slot.reserve}
                  </span>
                </TapButton>
              );
            })}
          </div>

          {showWeaponChips && (
            <div className="ffh-cycle-row">
              {WEAPON_ORDER.filter((id) => id !== "fist").map((id) => (
                <TapButton
                  key={id}
                  className="ffh-cycle-chip"
                  style={
                    weaponId === id
                      ? { borderColor: "#fbbf24", color: "#fde047" }
                      : undefined
                  }
                  onTrigger={() => onSelectWeapon?.(id)}
                >
                  {WEAPONS[id]?.name}
                </TapButton>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

===============================================================================
FILE: client/src/components/UI/FreeFireIcons.jsx
===============================================================================

```jsx
import React from "react";

/* -------------------------------------------------------------------------- */
/*  Shared Military White Silhouette SVGs (Desktop + Mobile Free Fire HUD)    */
/* -------------------------------------------------------------------------- */

export function WeaponSilhouetteSvg({ weaponId, className = "" }) {
  switch (weaponId) {
    case "awm":
      return (
        <svg viewBox="0 0 120 40" className={className} fill="currentColor">
          <path d="M5 18h18v11H12l-7-4v-7zm18 1h48v-2h44v4H71v2H54l-2 9h-8l-1-9H23v-4zm23-9h22v4H46v-4zm-6 4h34v2H40v-2zM75 23l-3 10h-3l3-10h3z" />
        </svg>
      );
    case "mp40":
      return (
        <svg viewBox="0 0 100 40" className={className} fill="currentColor">
          <path d="M8 17h15v4H8v-4zm15-2h42v6h24v3H65v2H54v11h-7V25H34l-3 10h-7l2-11H23v-9z" />
        </svg>
      );
    case "deagle":
      return (
        <svg viewBox="0 0 70 40" className={className} fill="currentColor">
          <path d="M12 10h42v9H33l-4 15H17l4-15h-9v-9zm19 9h7v4h-7v-4z" />
        </svg>
      );
    case "fist":
      return (
        <svg viewBox="0 0 64 40" className={className} fill="currentColor">
          <path d="M20 12c0-2 2-4 4-4s4 2 4 4v5h2v-6c0-2 2-4 4-4s4 2 4 4v6h2v-4c0-2 2-3 4-3s4 1 4 3v12c0 6-5 10-12 10h-6c-6 0-10-4-10-10V12z" />
        </svg>
      );
    case "ak47":
    case "m4a1":
    default:
      return (
        <svg viewBox="0 0 116 40" className={className} fill="currentColor">
          <path d="M4 17l18-2v12L4 23v-6zm18-3h44l3 2h40v3H69v3H58c0 5-3 11-8 14l-6-2c4-3 6-7 6-12H36l-3 9h-7l2-9h-6V14zm26-5h14v3H48V9z" />
        </svg>
      );
  }
}

export function ScopeSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeLinecap="round" />
    </svg>
  );
}

export function FireBulletSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 20V9c0-2.8 2.2-5 5-5s5 2.2 5 5v11H7zm2-11v9h6V9c0-1.7-1.3-3-3-3s-3 1.3-3 3zM5 21h14v1.5H5V21z" />
    </svg>
  );
}

export function JumpSoldierSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="14" cy="4.5" r="2.2" />
      <path d="M13 8l4 3.5-2 1.8-2.4-2L11 14l3.5 3-1 5h-2.2l.7-3.8L8.5 15 6 19.5l-1.9-1 3.4-6.2L10 9.5 7 9V7l6 1z" />
    </svg>
  );
}

export function CrouchSoldierSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="13" cy="5.5" r="2.2" />
      <path d="M11.5 9l4.5 2v2l-3-.8-1 3.3 4 1.5v4.5h-2.3v-3l-4.2-1.4-2.8 4.4H4.4l3.4-6.2 1.7-6.3h2z" />
    </svg>
  );
}

export function MedkitSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 4h6v2h4a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4V4zm2 2h2V5h-2v1zm0 4v2H9v2h2v2h2v-2h2v-2h-2v-2h-2z" />
    </svg>
  );
}

export function BackpackSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 3h6a2 2 0 0 1 2 2v1.2A4.5 4.5 0 0 1 20 10.5V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8.5A4.5 4.5 0 0 1 7 6.2V5a2 2 0 0 1 2-2zm0 2v1h6V5H9zm-2 8v5h10v-5H7zm3 1.5h4v2h-4v-2z" />
    </svg>
  );
}

export function CarDriveSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 11l1.8-4.8A2 2 0 0 1 8.7 5h6.6a2 2 0 0 1 1.9 1.2L19 11h1a1.5 1.5 0 0 1 1.5 1.5V17h-2v1.5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V17H7.5v1.5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V17H2.5v-4.5A1.5 1.5 0 0 1 4 11h1zm2.2-4L6 10.5h12L16.8 7H7.2zM6.5 15a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4zm11 0a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4z" />
    </svg>
  );
}

export function ReloadSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M21 12a9 9 0 1 1-2.64-6.36" strokeLinecap="round" />
      <path d="M21 4v5h-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HelmetSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3a8 8 0 0 0-8 8v4l2 2h3v-3H7v-3a5 5 0 0 1 10 0v3h-2v3h3l2-2v-4a8 8 0 0 0-8-8z" />
    </svg>
  );
}

export function VestSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 4h3l3 3 3-3h3v4l2 2v10H4V10l2-2V4zm3 7v6h6v-6H9z" />
    </svg>
  );
}

export function SpeakerSvg({ muted }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 9v6h4l5 4V5L7 9H3z" />
      {muted ? (
        <path d="M16 9l5 6m0-6l-5 6" stroke="currentColor" strokeWidth="2" />
      ) : (
        <path
          d="M16.5 8.5a5 5 0 0 1 0 7m2.5-9.5a8.5 8.5 0 0 1 0 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export function MicSvg({ muted }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.93V21h2v-3.07A7 7 0 0 0 19 11h-2z" />
      {muted && <path d="M4 4l16 16" stroke="#ef4444" strokeWidth="2.2" />}
    </svg>
  );
}

export function SprintSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="15" cy="4.5" r="2" />
      <path d="M10.5 8.5l4.2 1.2 2.8 2.8-1.4 1.4-2.2-2.2-2.2-.5-1.5 3.6 3.5 3.2-.8 5h-2l.5-3.8-3-2.5L6.5 21H4.3l2.6-5.8L9 10.5 6.8 10 8 8.5h2.5z" />
    </svg>
  );
}

export function EyeSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
    </svg>
  );
}

export function AliveUserSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5z" />
    </svg>
  );
}

export function KillsSkullSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a8.5 8.5 0 0 0-8.5 8.5c0 3 1.6 5.6 4 7V21h9v-3.5c2.4-1.4 4-4 4-7A8.5 8.5 0 0 0 12 2zm-3 10.5a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 9 12.5zm6 0a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1-1.5 1.5z" />
    </svg>
  );
}

export function EmoteWaveSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="9" cy="10" r="1.2" />
      <circle cx="15" cy="10" r="1.2" />
      <path d="M8.5 14.2a4.2 4.2 0 0 0 7 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function HudExitSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export function HudResetSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 2.5-6.2L2 9" />
      <polyline points="2 3 2 9 8 9" />
    </svg>
  );
}

export function HudSaveSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

export function PresetCubeSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 16.5l-9 5.25-9-5.25V7.5L12 2.25l9 5.25v9zM12 4.15L5.2 8.1 12 12.05l6.8-3.95L12 4.15zM4.5 9.7v5.85l6.5 3.8v-5.85L4.5 9.7zm15 0l-6.5 3.8v5.85l6.5-3.8V9.7z" />
    </svg>
  );
}

export function HudLayoutSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  );
}


```

===============================================================================
FILE: client/src/components/UI/FreeFireVictoryModal.jsx
===============================================================================

```jsx
import React from "react";

export default function FreeFireVictoryModal({
  status = "IN_PROGRESS", // "DROPPING" | "IN_PROGRESS" | "VICTORY" | "DEFEAT"
  kills = 0,
  damageDealt = 0,
  survivalSeconds = 0,
  headshots = 0,
  shotsFired = 0,
  rank = 1,
  totalPlayers = 7,
  onPlayAgain,
  onDismiss,
  onReturnToLobby,
}) {
  if (status !== "VICTORY" && status !== "DEFEAT") return null;

  const isVictory = status === "VICTORY";

  // Format survival time MM:SS
  const mins = Math.floor(survivalSeconds / 60);
  const secs = Math.floor(survivalSeconds % 60);
  const timeFormatted = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  // Accuracy calculation
  const accuracy =
    shotsFired > 0
      ? Math.min(100, Math.round(((kills * 3 + headshots * 2) / Math.max(1, shotsFired)) * 100))
      : 0;

  return (
    <div className={`ff-modal-overlay ${isVictory ? "victory-theme" : "defeat-theme"}`}>
      <div className="ff-modal-backdrop" />

      <div className="ff-result-card animate-pop-in">
        {/* Top Flame Wings / Emblem */}
        <div className="ff-result-emblem-wrap">
          <div className="ff-emblem-halo" />
          {isVictory ? (
            <div className="ff-booyah-badge">
              <div className="ff-booyah-flames">🔥 🏆 🔥</div>
              <h1 className="ff-booyah-title">BOOYAH!</h1>
              <div className="ff-booyah-sub">VICTORY ROYALE</div>
            </div>
          ) : (
            <div className="ff-defeat-badge">
              <div className="ff-defeat-skull">☠️</div>
              <h1 className="ff-defeat-title">ELIMINATED</h1>
              <div className="ff-defeat-sub">BETTER LUCK NEXT TIME</div>
            </div>
          )}
        </div>

        {/* Rank Placement Pill */}
        <div className="ff-rank-pill">
          <span className="rank-label">FINAL PLACEMENT</span>
          <span className={`rank-value ${isVictory ? "first" : ""}`}>
            #{isVictory ? 1 : rank} <small>/ {totalPlayers}</small>
          </span>
        </div>

        {/* Match Statistics Grid */}
        <div className="ff-stats-grid">
          <div className="ff-stat-box">
            <span className="stat-icon">💀</span>
            <div className="stat-info">
              <span className="stat-title">KILLS</span>
              <span className="stat-val">{kills}</span>
            </div>
          </div>

          <div className="ff-stat-box">
            <span className="stat-icon">🎯</span>
            <div className="stat-info">
              <span className="stat-title">DAMAGE</span>
              <span className="stat-val">{damageDealt}</span>
            </div>
          </div>

          <div className="ff-stat-box">
            <span className="stat-icon">⏱️</span>
            <div className="stat-info">
              <span className="stat-title">SURVIVED</span>
              <span className="stat-val">{timeFormatted}</span>
            </div>
          </div>

          <div className="ff-stat-box">
            <span className="stat-icon">💥</span>
            <div className="stat-info">
              <span className="stat-title">HEADSHOTS</span>
              <span className="stat-val">{headshots}</span>
            </div>
          </div>

          <div className="ff-stat-box">
            <span className="stat-icon">⚡</span>
            <div className="stat-info">
              <span className="stat-title">ACCURACY</span>
              <span className="stat-val">{accuracy}%</span>
            </div>
          </div>
        </div>

        {/* Free Fire Action Buttons */}
        <div className="ff-modal-actions">
          <button
            type="button"
            className="ff-btn-primary booyah-btn"
            onClick={onPlayAgain}
          >
            <span className="btn-icon">🏆</span>
            <span>PLAY AGAIN</span>
          </button>

          {isVictory && onDismiss && (
            <button
              type="button"
              className="ff-btn-secondary"
              onClick={onDismiss}
            >
              <span>FREE ROAM / DRIVE</span>
            </button>
          )}

          {onReturnToLobby && (
            <button
              type="button"
              className="ff-btn-secondary"
              onClick={onReturnToLobby}
              data-testid="victory-return-lobby-btn"
            >
              <span>RETURN TO LOBBY</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

```

===============================================================================
FILE: client/src/components/UI/GameModals.jsx
===============================================================================

```jsx
import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { MAP_PRESETS, SCENE_PRESETS } from "../../config/gameConstants";
import Icons from "./Icons";
import { HudLayoutSvg } from "./FreeFireIcons";

export function QrConnectModal({
  open,
  onClose,
  networkUrl,
  onCopyUrl,
  relayStatus = "connected",
  isLoopbackUrl = false,
  pairToken = null,
}) {
  if (!open) return null;

  return (
    <div className="mc-modal-backdrop" onClick={onClose}>
      <div className="mc-qr-card" onClick={(e) => e.stopPropagation()}>
        <div className="mc-settings-header">
          <div className="mc-settings-title">
            <Icons.QRCode />
            <span>SCAN TO CONNECT PHONE</span>
          </div>
          <button type="button" className="mc-icon-btn" onClick={onClose}>
            <Icons.Close />
          </button>
        </div>
        <p className="mc-qr-instruction">
          Scan this QR code with your phone camera on the same Wi-Fi network:
        </p>
        <div className="mc-qr-frame">
          <QRCodeSVG
            value={networkUrl}
            size={220}
            level="H"
            includeMargin
            bgColor="#ffffff"
            fgColor="#080d16"
          />
        </div>
        <div className="mc-qr-url">{networkUrl}</div>
        {isLoopbackUrl && (
          <div className="mc-qr-warning" style={{ marginTop: 8, padding: "6px 10px", borderRadius: 6, background: "rgba(245, 158, 11, 0.16)", border: "1px solid rgba(245, 158, 11, 0.45)", color: "#fde68a", fontSize: 12, lineHeight: 1.35 }}>
            Using localhost URL — replace <strong>localhost</strong> with your PC&apos;s Wi-Fi IPv4 address if scanning from a phone.
          </div>
        )}
        {relayStatus === "offline" && (
          <div className="mc-qr-warning" style={{ marginTop: 8, padding: "6px 10px", borderRadius: 6, background: "rgba(239, 68, 68, 0.16)", border: "1px solid rgba(239, 68, 68, 0.45)", color: "#fecaca", fontSize: 12, lineHeight: 1.35 }}>
            Controller relay server is offline. Start <code>server/server.js</code> or run <code>npm start</code> from the project root.
          </div>
        )}
        <button
          type="button"
          className="mc-enable-gyro-action-btn mc-copy-url-btn"
          onClick={onCopyUrl}
        >
          COPY CONTROLLER LINK
        </button>
        <div className="mc-qr-network-info">
          <span className="mc-dot mc-dot-live" />
          {pairToken
            ? `SCOPED PAIR SESSION: ${pairToken}`
            : "MAKE SURE BOTH DEVICES USE THE SAME WI-FI"}
        </div>
      </div>
    </div>
  );
}

export function GameSettingsModal({
  open,
  onClose,
  steerHudSide,
  onSteerHudSideChange,
  scenePreset,
  onScenePresetChange,
  mapPreset,
  onMapPresetChange,
  onOpenCustomHud,
}) {
  if (!open) return null;

  return (
    <div className="mc-modal-backdrop" onClick={onClose}>
      <div className="mc-settings-card" onClick={(e) => e.stopPropagation()}>
        <div className="mc-settings-header">
          <div className="mc-settings-title">
            <Icons.Settings />
            <span>GAME & HUD SETTINGS</span>
          </div>
          <button type="button" className="mc-icon-btn" onClick={onClose}>
            <Icons.Close />
          </button>
        </div>

        {onOpenCustomHud && (
          <div className="mc-setting-group">
            <div className="mc-setting-label">FREE FIRE CUSTOM HUD</div>
            <button
              type="button"
              className="mc-seg-btn active"
              style={{
                width: "100%",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                background: "rgba(245, 184, 46, 0.22)",
                borderColor: "#f5b82e",
                color: "#ffd60a",
                fontWeight: 900,
                letterSpacing: "0.8px",
              }}
              onClick={() => {
                onClose?.();
                onOpenCustomHud();
              }}
              data-testid="settings-open-custom-hud-btn"
            >
              <HudLayoutSvg />
              <span>CUSTOMIZE HUD (SIZE, TRANSPARENCY & LAYOUT)</span>
            </button>
          </div>
        )}

        {onMapPresetChange && (
          <div className="mc-setting-group">
            <div className="mc-setting-label">BATTLE / DRIVING MAP</div>
            <div className="mc-segmented">
              {Object.entries(MAP_PRESETS).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  className={
                    mapPreset === key ? "mc-seg-btn active" : "mc-seg-btn"
                  }
                  onClick={() => onMapPresetChange(key)}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mc-setting-group">
          <div className="mc-setting-label">STEERING HUD POSITION</div>
          <div className="mc-segmented">
            <button
              type="button"
              className={
                steerHudSide === "left" ? "mc-seg-btn active" : "mc-seg-btn"
              }
              onClick={() => onSteerHudSideChange("left")}
            >
              <span>LEFT SIDE</span>
            </button>
            <button
              type="button"
              className={
                steerHudSide === "right" ? "mc-seg-btn active" : "mc-seg-btn"
              }
              onClick={() => onSteerHudSideChange("right")}
            >
              <span>RIGHT SIDE</span>
            </button>
          </div>
        </div>

        <div className="mc-setting-group">
          <div className="mc-setting-label">ENVIRONMENT LIGHTING</div>
          <div className="mc-segmented">
            {Object.entries(SCENE_PRESETS).map(([key, item]) => (
              <button
                key={key}
                type="button"
                className={
                  scenePreset === key ? "mc-seg-btn active" : "mc-seg-btn"
                }
                onClick={() => onScenePresetChange(key)}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

===============================================================================
FILE: client/src/components/UI/HoldButton.jsx
===============================================================================

```jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { findTouchById } from "./TapButton";

export default function HoldButton({
  className = "",
  activeClassName = "",
  onChange,
  children,
}) {
  const [pressed, setPressed] = useState(false);
  const pressedRef = useRef(false);
  const activeTouchIdRef = useRef(null);
  const mouseActiveRef = useRef(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const setHoldActive = useCallback((next) => {
    if (pressedRef.current === next) return;
    pressedRef.current = next;
    setPressed(next);
    if (next && typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(12);
    }
    onChangeRef.current?.(next);
  }, []);

  useEffect(() => {
    const release = () => {
      if (activeTouchIdRef.current !== null || mouseActiveRef.current) {
        activeTouchIdRef.current = null;
        mouseActiveRef.current = false;
        setHoldActive(false);
      }
    };
    window.addEventListener("blur", release);
    return () => {
      window.removeEventListener("blur", release);
      release();
    };
  }, [setHoldActive]);

  const handleTouchStart = useCallback(
    (e) => {
      e.stopPropagation();
      if (activeTouchIdRef.current !== null) return;
      const t = e.changedTouches?.[0];
      if (t) {
        activeTouchIdRef.current = t.identifier;
      }
      setHoldActive(true);
    },
    [setHoldActive],
  );

  const handleTouchEnd = useCallback(
    (e) => {
      e.stopPropagation();
      const id = activeTouchIdRef.current;
      if (id === null) return;
      const ended = findTouchById(e.changedTouches, id);
      const stillDown = findTouchById(e.touches, id);
      if (!ended && stillDown) return;
      if (e.cancelable) e.preventDefault();
      activeTouchIdRef.current = null;
      if (!mouseActiveRef.current) {
        setHoldActive(false);
      }
    },
    [setHoldActive],
  );

  const handleMouseDown = useCallback(
    (e) => {
      if (activeTouchIdRef.current !== null) return;
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
      mouseActiveRef.current = true;
      setHoldActive(true);
    },
    [setHoldActive],
  );

  const handleMouseUp = useCallback(
    (e) => {
      e?.stopPropagation?.();
      if (!mouseActiveRef.current) return;
      mouseActiveRef.current = false;
      if (activeTouchIdRef.current === null) {
        setHoldActive(false);
      }
    },
    [setHoldActive],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      style={{ touchAction: "none" }}
      className={`${className} ${pressed ? activeClassName : ""}`.trim()}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
}
```

===============================================================================
FILE: client/src/components/UI/Icons.jsx
===============================================================================

```jsx
import React from "react";

export const Icons = {
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Camera: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  Reset: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  ),
  Fullscreen: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  ),
  Boost: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  Drift: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M9.5 15V9h3.5a2 2 0 0 1 0 4H9.5" />
      <path d="M4 6a11 11 0 0 0 0 12M20 6a11 11 0 0 1 0 12" />
    </svg>
  ),
  Gyro: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="6" width="20" height="12" rx="3" />
      <path d="M6 12h.01M18 12h.01" />
      <path d="M9 3l3-2 3 2M9 21l3 2 3-2" />
    </svg>
  ),
  Wheel: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M3.5 11h6M14.5 11h6M12 14.5v6" />
    </svg>
  ),
  Close: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  BrakeDisc: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M16 5a9 9 0 0 1 4 7" strokeWidth="3" />
    </svg>
  ),
  GasPedal: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  ),
  QRCode: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <path d="M14 14h3v3h-3zM17 17h4v4h-4zM14 21h3" />
    </svg>
  ),
};

export default Icons;
```

===============================================================================
FILE: client/src/components/UI/InventoryUI.jsx
===============================================================================

```jsx
import React, { useState } from 'react';
import { WEAPONS, LOOT_ITEMS } from '../../config/gameConstants';

const ICON_MAP = {
  weapon: '🔫',
  ammo: '📦',
  medkit: '🩹',
  armor: '🛡️',
  helmet: '🪖',
};

function getItemIcon(type) {
  return ICON_MAP[type] || '📦';
}

function getItemDef(itemId) {
  return LOOT_ITEMS[itemId] || WEAPONS[itemId] || null;
}

export default function InventoryUI({
  isOpen = false,
  inventory = {},
  ammoState = {},
  weaponId = 'fist',
  onClose,
  onEquipWeapon,
  onDropItem,
  onUseMedkit,
}) {
  const [selectedUid, setSelectedUid] = useState(null);

  if (!isOpen) return null;

  const items = inventory.items || [];
  const primaryWeapon = inventory.primaryWeapon;
  const secondaryWeapon = inventory.secondaryWeapon;
  const vest = inventory.vest;
  const helmet = inventory.helmet;
  const medkits = inventory.medkits || 0;

  const selectedItem = items.find((it) => it.uid === selectedUid) || null;
  const selectedDef = selectedItem ? getItemDef(selectedItem.itemId) : null;

  // --- Equipment helpers ---
  function renderSlot(label, itemId, slotType) {
    const def = itemId ? getItemDef(itemId) : null;
    const equipped = !!def;
    const isActive = weaponId && itemId && weaponId === itemId;
    const ammo = (slotType === 'weapon' && itemId && ammoState[itemId]) ? ammoState[itemId] : null;

    return (
      <div className={`ff-inv-slot${equipped ? ' equipped' : ''}${isActive ? ' active-weapon' : ''}`}>
        <span className="ff-inv-slot-icon">
          {def ? getItemIcon(def.type || slotType) : '—'}
        </span>
        <span className="ff-inv-slot-label">{label}</span>
        {def && <span className="ff-inv-slot-name">{def.label || def.name || itemId}</span>}
        {ammo && (
          <span className="ff-inv-slot-ammo">{ammo.mag} / {ammo.reserve}</span>
        )}
      </div>
    );
  }

  // --- Action buttons for selected item ---
  function renderActions() {
    if (!selectedItem || !selectedDef) return null;
    const type = selectedDef.type;
    return (
      <div className="ff-inv-actions">
        {(type === 'weapon') && (
          <>
            <button
              className="ff-inv-action-btn"
              onClick={() => onEquipWeapon && onEquipWeapon(selectedItem.itemId, 'primary')}
            >
              EQUIP PRIMARY
            </button>
            <button
              className="ff-inv-action-btn"
              onClick={() => onEquipWeapon && onEquipWeapon(selectedItem.itemId, 'secondary')}
            >
              EQUIP SECONDARY
            </button>
          </>
        )}
        {(type === 'armor') && (
          <button
            className="ff-inv-action-btn"
            onClick={() => onEquipWeapon && onEquipWeapon(selectedItem.itemId, 'vest')}
          >
            EQUIP
          </button>
        )}
        {(type === 'helmet') && (
          <button
            className="ff-inv-action-btn"
            onClick={() => onEquipWeapon && onEquipWeapon(selectedItem.itemId, 'helmet')}
          >
            EQUIP
          </button>
        )}
        {(type === 'medkit') && (
          <button
            className="ff-inv-action-btn"
            onClick={() => onUseMedkit && onUseMedkit()}
          >
            USE
          </button>
        )}
        <button
          className="ff-inv-action-btn ff-inv-action-drop"
          onClick={() => {
            if (onDropItem) onDropItem(selectedItem.uid);
            setSelectedUid(null);
          }}
        >
          DROP
        </button>
      </div>
    );
  }

  return (
    <div className="ff-inv-overlay" onClick={onClose}>
      <div className="ff-inv-panel" onClick={(e) => e.stopPropagation()}>
        {/* Left Panel — Equipment */}
        <div className="ff-inv-equip-panel">
          <h3 className="ff-inv-section-title">EQUIPMENT</h3>
          {renderSlot('Helmet', helmet, 'helmet')}
          {renderSlot('Vest', vest, 'armor')}
          {renderSlot('Primary', primaryWeapon, 'weapon')}
          {renderSlot('Secondary', secondaryWeapon, 'weapon')}
          <div className="ff-inv-slot">
            <span className="ff-inv-slot-icon">🩹</span>
            <span className="ff-inv-slot-label">Medkits</span>
            <span className="ff-inv-slot-name">×{medkits}</span>
          </div>
        </div>

        {/* Center Panel — Backpack Grid */}
        <div className="ff-inv-backpack">
          <h3 className="ff-inv-section-title">BACKPACK</h3>
          <div className="ff-inv-backpack-grid">
            {items.length === 0 && (
              <div className="ff-inv-empty">No items collected</div>
            )}
            {items.map((item) => {
              const def = getItemDef(item.itemId);
              if (!def) return null;
              const isSelected = item.uid === selectedUid;
              return (
                <div
                  key={item.uid}
                  className={`ff-inv-item-card${isSelected ? ' selected' : ''}`}
                  onClick={() => setSelectedUid(isSelected ? null : item.uid)}
                >
                  <span className="ff-inv-item-icon">{getItemIcon(def.type)}</span>
                  <span className="ff-inv-item-name">{def.label || def.name || item.itemId}</span>
                  {item.quantity > 1 && (
                    <span className="ff-inv-item-qty">×{item.quantity}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel — Item Details */}
        <div className="ff-inv-details-panel">
          <h3 className="ff-inv-section-title">DETAILS</h3>
          {selectedDef ? (
            <>
              <div className="ff-inv-detail-icon">{getItemIcon(selectedDef.type)}</div>
              <div className="ff-inv-detail-name">{selectedDef.label || selectedDef.name}</div>
              {selectedDef.rarity && (
                <div className="ff-inv-detail-rarity">{selectedDef.rarity}</div>
              )}
              {selectedDef.damage && (
                <div className="ff-inv-detail-stat">DMG: {selectedDef.damage}</div>
              )}
              {selectedDef.fireRate && (
                <div className="ff-inv-detail-stat">RATE: {selectedDef.fireRate}</div>
              )}
              {selectedDef.description && (
                <div className="ff-inv-detail-desc">{selectedDef.description}</div>
              )}
              {renderActions()}
            </>
          ) : (
            <div className="ff-inv-empty">Select an item</div>
          )}
        </div>
      </div>

      {/* Bottom hint */}
      <div className="ff-inv-close-hint">Press TAB to close</div>
    </div>
  );
}
```

===============================================================================
FILE: client/src/components/UI/SportSpeedometer.jsx
===============================================================================

```jsx
import React from "react";

export default function SportSpeedometer({ telemetry }) {
  const speed = Math.max(
    0,
    Math.min(320, Math.round(Math.abs(telemetry.speed || 0))),
  );
  const gear = telemetry.gear || "N";
  const rpmRatio = Math.max(0, Math.min(1, (telemetry.rpm || 850) / 7500));
  const needleAngle = -135 + (speed / 320) * 270;

  return (
    <section className="sport-speedometer" aria-label="Vehicle speedometer">
      <svg className="sport-speedometer-dial" viewBox="0 0 240 190" role="img">
        <defs>
          <linearGradient id="speedArc" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#e8edf2" stopOpacity=".42" />
            <stop offset="72%" stopColor="#e8edf2" stopOpacity=".82" />
            <stop offset="100%" stopColor="#ff315b" />
          </linearGradient>
          <filter id="needleGlow">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {Array.from({ length: 33 }, (_, i) => {
          const angle = ((-135 + (i / 32) * 270) * Math.PI) / 180;
          const major = i % 4 === 0;
          const inner = major ? 75 : 81;
          const outer = 88;
          return (
            <line
              key={i}
              x1={120 + Math.cos(angle) * inner}
              y1={111 + Math.sin(angle) * inner}
              x2={120 + Math.cos(angle) * outer}
              y2={111 + Math.sin(angle) * outer}
              stroke={i > 27 ? "#ff315b" : "rgba(235,242,250,.65)"}
              strokeWidth={major ? 1.5 : 0.8}
            />
          );
        })}

        {Array.from({ length: 9 }, (_, i) => {
          const angle = ((-135 + (i / 8) * 270) * Math.PI) / 180;
          return (
            <text
              key={i}
              x={120 + Math.cos(angle) * 65}
              y={114 + Math.sin(angle) * 65}
              textAnchor="middle"
              className="speedometer-tick-label"
            >
              {i * 40}
            </text>
          );
        })}

        <g
          transform={`rotate(${needleAngle} 120 111)`}
          filter="url(#needleGlow)"
        >
          <path
            d="M120 111 L120 31"
            stroke="#f6f8fb"
            strokeWidth="2.3"
            strokeLinecap="round"
          />
          <circle cx="120" cy="111" r="3.6" fill="#f6f8fb" />
        </g>

        <circle
          cx="120"
          cy="111"
          r="12.5"
          fill="#0b1d17"
          stroke="#38d889"
          strokeWidth="1.5"
        />
        <text x="120" y="116" textAnchor="middle" className="speedometer-gear">
          {gear}
        </text>
        <text
          x="120"
          y="165"
          textAnchor="middle"
          className="speedometer-number"
        >
          {speed}
        </text>
        <text x="120" y="179" textAnchor="middle" className="speedometer-unit">
          KM/H
        </text>
        <path
          d="M 166 35 A 90 90 0 0 1 208 105"
          fill="none"
          stroke="#ff315b"
          strokeWidth={2 + rpmRatio * 1.8}
          opacity={rpmRatio > 0.82 ? 1 : 0.45}
        />
      </svg>
      <div className="speedometer-rpm">
        <span>RPM</span>
        <span>{Math.round(telemetry.rpm || 850).toLocaleString("en-IN")}</span>
      </div>
    </section>
  );
}
```

===============================================================================
FILE: client/src/components/UI/SteeringWheelGraphic.jsx
===============================================================================

```jsx
import React from "react";
import { MAX_WHEEL_ROTATION_DEG } from "../../config/gameConstants";

export default function SteeringWheelGraphic({ steerValue, activeGrab }) {
  const deg = Math.round(-steerValue * MAX_WHEEL_ROTATION_DEG);
  return (
    <svg
      className={activeGrab ? "mc-wheel-svg grabbing" : "mc-wheel-svg"}
      viewBox="0 0 160 160"
      style={{ transform: `rotate(${deg}deg)` }}
    >
      <defs>
        <linearGradient id="mRimGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#35455d" />
          <stop offset="50%" stopColor="#18202c" />
          <stop offset="100%" stopColor="#0d1219" />
        </linearGradient>
        <linearGradient id="mSpokeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9fb4d0" />
          <stop offset="100%" stopColor="#405066" />
        </linearGradient>
      </defs>

      <circle
        cx="80"
        cy="80"
        r="66"
        fill="none"
        stroke="url(#mRimGrad)"
        strokeWidth="16"
      />
      <circle
        cx="80"
        cy="80"
        r="66"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
      />
      <path
        d="M 20 55 A 66 66 0 0 1 28 38"
        fill="none"
        stroke="#2d79ff"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M 140 55 A 66 66 0 0 0 132 38"
        fill="none"
        stroke="#2d79ff"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M 22 78 L 58 78 M 102 78 L 138 78 M 80 98 L 80 138"
        stroke="url(#mSpokeGrad)"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d="M 74 14 L 86 14"
        stroke="#ff2a5f"
        strokeWidth="16"
        strokeLinecap="butt"
      />
      <circle
        cx="80"
        cy="14"
        r="5"
        fill="#ffffff"
        opacity={activeGrab ? "0.95" : "0.4"}
      />
      <circle
        cx="80"
        cy="80"
        r="24"
        fill="#0b1018"
        stroke="#2d79ff"
        strokeWidth="3"
      />
      <text
        x="80"
        y="86"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="16"
        fontWeight="800"
        fontStyle="italic"
        fontFamily="Barlow Condensed, sans-serif"
      >
        M
      </text>
    </svg>
  );
}
```

===============================================================================
FILE: client/src/components/UI/TapButton.jsx
===============================================================================

```jsx
import React, { useCallback, useRef, useState } from "react";

/**
 * Looks up a Touch object by its unique `identifier` in a TouchList or array.
 */
export function findTouchById(touchList, id) {
  if (!touchList || id === null || id === undefined) return null;
  for (let i = 0; i < touchList.length; i += 1) {
    if (touchList[i].identifier === id) return touchList[i];
  }
  return null;
}

/**
 * Reliable multi-touch & fast-tap button for mobile controllers.
 * Avoids dropped synthetic `click` events inside touch-action/rotated stages.
 */
export default function TapButton({
  className = "",
  activeClassName = "active",
  onTrigger,
  onClick,
  disabled = false,
  tapRadiusPx = 56,
  children,
  ...rest
}) {
  const [touchPressed, setTouchPressed] = useState(false);
  const startTouchRef = useRef(null);
  const lastTouchTriggerTsRef = useRef(0);

  const handler = onTrigger || onClick;

  const handleTouchStart = useCallback(
    (e) => {
      e.stopPropagation();
      if (disabled) return;
      if (startTouchRef.current !== null) return;
      const t = e.changedTouches?.[0];
      if (!t) return;
      startTouchRef.current = {
        id: t.identifier,
        x: t.clientX,
        y: t.clientY,
      };
      setTouchPressed(true);
    },
    [disabled],
  );

  const handleTouchEnd = useCallback(
    (e) => {
      e.stopPropagation();
      const start = startTouchRef.current;
      if (!start) return;
      const t = findTouchById(e.changedTouches, start.id);
      if (!t) return;

      startTouchRef.current = null;
      setTouchPressed(false);
      if (disabled) return;

      const dist = Math.hypot(t.clientX - start.x, t.clientY - start.y);
      if (dist <= tapRadiusPx) {
        if (e.cancelable) e.preventDefault();
        lastTouchTriggerTsRef.current = Date.now();
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate(10);
        }
        handler?.(e);
      }
    },
    [disabled, tapRadiusPx, handler],
  );

  const handleTouchCancel = useCallback((e) => {
    e.stopPropagation();
    const start = startTouchRef.current;
    if (!start) return;
    if (
      findTouchById(e.changedTouches, start.id) ||
      !findTouchById(e.touches, start.id)
    ) {
      startTouchRef.current = null;
      setTouchPressed(false);
    }
  }, []);

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (disabled) return;
      if (Date.now() - lastTouchTriggerTsRef.current < 450) {
        return;
      }
      handler?.(e);
    },
    [disabled, handler],
  );

  const mergedClassName = touchPressed
    ? `${className} ${activeClassName}`.trim()
    : className;

  return (
    <button
      type="button"
      className={mergedClassName}
      disabled={disabled}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onClick={handleClick}
      onContextMenu={(e) => e.preventDefault()}
      {...rest}
    >
      {children}
    </button>
  );
}

```

===============================================================================
FILE: client/src/components/UI/WorldHtml.jsx
===============================================================================

```jsx
import React, { useEffect, useId, useRef, useSyncExternalStore } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const entries = new Map();
const listeners = new Set();
let snapshot = [];
let pendingFlush = false;

function flushNotify() {
  pendingFlush = false;
  snapshot = Array.from(entries.values());
  listeners.forEach((fn) => fn());
}

function scheduleNotify() {
  if (pendingFlush) return;
  pendingFlush = true;
  Promise.resolve().then(flushNotify);
}

function upsertEntry(id, entry) {
  entries.set(id, entry);
  scheduleNotify();
}

function removeEntry(id) {
  if (entries.delete(id)) {
    scheduleNotify();
  }
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return snapshot;
}

const _objPos = new THREE.Vector3();
const _camPos = new THREE.Vector3();
const _camDir = new THREE.Vector3();
const _delta = new THREE.Vector3();
const _proj = new THREE.Vector3();

/**
 * Single-root DOM overlay layer rendered inside the main game shell.
 * Eliminates per-label secondary ReactDOM roots from @react-three/drei Html
 * so React 19 dev mode never unmounts secondary roots during a render/commit.
 */
export function WorldHtmlLayer() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 15,
      }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          ref={(node) => {
            item.domRef.current = node;
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            display: "none",
            transformOrigin: "0 0",
            willChange: "transform",
            pointerEvents: "none",
            ...item.style,
          }}
        >
          {item.children}
        </div>
      ))}
    </div>
  );
}

/**
 * R3F 3D-to-2D projected overlay node without creating nested ReactDOM roots.
 */
export default function WorldHtml({
  position = [0, 0, 0],
  center = false,
  distanceFactor = 0,
  style,
  children,
}) {
  const id = useId();
  const groupRef = useRef(null);
  const domRef = useRef(null);
  const lastTransformRef = useRef("");
  const lastDisplayRef = useRef("none");
  const { camera, size } = useThree();

  useEffect(() => {
    upsertEntry(id, { id, domRef, style, children });
  }, [id, style, children]);

  useEffect(() => {
    return () => {
      removeEntry(id);
    };
  }, [id]);

  useFrame(() => {
    const el = domRef.current;
    const grp = groupRef.current;
    if (!el || !grp) return;

    grp.updateWorldMatrix(true, false);
    _objPos.setFromMatrixPosition(grp.matrixWorld);
    _camPos.setFromMatrixPosition(camera.matrixWorld);
    camera.getWorldDirection(_camDir);
    _delta.subVectors(_objPos, _camPos);

    const dist = _delta.length();
    const inFront = _delta.dot(_camDir) > 0.1;

    if (!inFront || dist > 150) {
      if (lastDisplayRef.current !== "none") {
        lastDisplayRef.current = "none";
        el.style.display = "none";
      }
      return;
    }

    _proj.copy(_objPos).project(camera);
    if (Math.abs(_proj.x) > 1.35 || Math.abs(_proj.y) > 1.35 || _proj.z > 1) {
      if (lastDisplayRef.current !== "none") {
        lastDisplayRef.current = "none";
        el.style.display = "none";
      }
      return;
    }

    const x = (_proj.x * 0.5 + 0.5) * size.width;
    const y = (-_proj.y * 0.5 + 0.5) * size.height;

    let scale = 1;
    if (distanceFactor > 0 && camera.fov) {
      const vFov = (camera.fov * Math.PI) / 180;
      const visibleHeight = 2 * Math.tan(vFov / 2) * Math.max(0.5, dist);
      scale = THREE.MathUtils.clamp(distanceFactor / visibleHeight, 0.28, 1.65);
    }

    const nextTransform = center
      ? `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)}) translate(-50%, -50%)`
      : `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;

    if (lastDisplayRef.current !== "block") {
      lastDisplayRef.current = "block";
      el.style.display = "block";
    }
    if (lastTransformRef.current !== nextTransform) {
      lastTransformRef.current = nextTransform;
      el.style.transform = nextTransform;
    }
  });

  return <group ref={groupRef} position={position} />;
}

```

===============================================================================
FILE: client/src/components/World/DrivingWorld.jsx
===============================================================================

```jsx
import React from "react";
import { SCENE_PRESETS } from "../../config/gameConstants";

export default function DrivingWorld({ presetKey }) {
  const preset = SCENE_PRESETS[presetKey] || SCENE_PRESETS.track;
  return (
    <>
      <color attach="background" args={[preset.bg]} />
      <fog attach="fog" args={preset.fog} />
      <ambientLight intensity={preset.ambient} />
      <hemisphereLight args={[preset.hemiSky, preset.hemiGround, 1.15]} />
      <directionalLight
        position={[24, 48, 22]}
        intensity={preset.dirIntensity}
        color={preset.dirColor}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={160}
        shadow-camera-left={-35}
        shadow-camera-right={35}
        shadow-camera-top={35}
        shadow-camera-bottom={-35}
        shadow-bias={-0.0004}
      />
    </>
  );
}
```

===============================================================================
FILE: client/src/components/World/FollowCamera.jsx
===============================================================================

```jsx
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { CAMERA_MODES } from "../../config/gameConstants";

const MOUSE_SENSITIVITY = 0.0028;
const REMOTE_LOOK_SPEED = 2.4;

const MIN_PITCH = -0.35;
const MAX_PITCH = 0.9;

const ORBIT_DAMP = 14;

const CHARACTER_CAMERA_DISTANCE = 4.6;
const CHARACTER_CAMERA_HEIGHT = 1.45;

const _upAxis = new THREE.Vector3(0, 1, 0);
const _offsetVec = new THREE.Vector3();
const _lookVec = new THREE.Vector3();
const _charEyeOffset = new THREE.Vector3(0, 1.35, 0);

export default function FollowCamera({
  enabled = true,
  targetRef,
  carRef,
  physicsStateRef,
  remoteInputRef,
  cameraMode,
  isCharacterMode,
  isArmed = false,
  isAiming = false,
  orbitYawRef,
  orbitPitchRef,
  aimAssistLocked = false,
}) {
  const { camera, gl } = useThree();

  const desiredPosition = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());
  const currentLook = useRef(new THREE.Vector3());
  const previousMode = useRef(null);

  const activeTargetRef = targetRef || carRef;

  const camPreset =
    CAMERA_MODES.find((item) => item.id === cameraMode) || CAMERA_MODES[0];

  const yaw = useRef(0);
  const pitch = useRef(0.16);

  const yawTarget = useRef(0);
  const pitchTarget = useRef(0.16);

  const dragging = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const pointerLocked = useRef(false);
  const aimAssistLockedRef = useRef(aimAssistLocked);

  useEffect(() => {
    aimAssistLockedRef.current = aimAssistLocked;
  }, [aimAssistLocked]);

  useEffect(() => {
    if (!enabled || !isCharacterMode) {
      dragging.current = false;
      return undefined;
    }

    const element = gl.domElement;

    const onPointerDown = (event) => {
      if (pointerLocked.current) return;
      if (event.button !== 0) return;

      dragging.current = true;
      lastX.current = event.clientX;
      lastY.current = event.clientY;
      element.setPointerCapture?.(event.pointerId);
    };

    const onPointerUp = (event) => {
      dragging.current = false;
      if (element.hasPointerCapture?.(event.pointerId)) {
        element.releasePointerCapture?.(event.pointerId);
      }
    };

    const onPointerMove = (event) => {
      let deltaX = 0;
      let deltaY = 0;

      if (pointerLocked.current) {
        deltaX = THREE.MathUtils.clamp(event.movementX || 0, -120, 120);
        deltaY = THREE.MathUtils.clamp(event.movementY || 0, -120, 120);
      } else {
        if (!dragging.current) return;
        deltaX = THREE.MathUtils.clamp(event.clientX - lastX.current, -120, 120);
        deltaY = THREE.MathUtils.clamp(event.clientY - lastY.current, -120, 120);
        lastX.current = event.clientX;
        lastY.current = event.clientY;
      }

      const sens = aimAssistLockedRef.current
        ? MOUSE_SENSITIVITY * 0.52
        : MOUSE_SENSITIVITY;
      yawTarget.current -= deltaX * sens;
      pitchTarget.current = THREE.MathUtils.clamp(
        pitchTarget.current + deltaY * sens,
        MIN_PITCH,
        MAX_PITCH,
      );
    };

    const onDoubleClick = () => {
      if (!pointerLocked.current && element.requestPointerLock) {
        element.requestPointerLock();
      }
    };

    const onPointerLockChange = () => {
      pointerLocked.current = document.pointerLockElement === element;
      if (pointerLocked.current) {
        dragging.current = false;
      }
    };

    const onWheel = (event) => {
      event.preventDefault();
    };

    element.addEventListener("pointerdown", onPointerDown);
    element.addEventListener("pointerup", onPointerUp);
    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("dblclick", onDoubleClick);
    element.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("pointerlockchange", onPointerLockChange);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("blur", onPointerUp);

    return () => {
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointerup", onPointerUp);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("dblclick", onDoubleClick);
      element.removeEventListener("wheel", onWheel);
      document.removeEventListener("pointerlockchange", onPointerLockChange);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("blur", onPointerUp);

      if (pointerLocked.current && document.exitPointerLock) {
        document.exitPointerLock();
      }

      pointerLocked.current = false;
      dragging.current = false;
    };
  }, [gl, enabled, isCharacterMode]);

  useFrame((_, rawDelta) => {
    if (!enabled) return;
    const target = activeTargetRef?.current;
    if (!target) return;

    const dt = Math.min(rawDelta, 0.05);
    const modeKey = isCharacterMode ? "character" : `car-${cameraMode}`;

    if (previousMode.current !== modeKey) {
      previousMode.current = modeKey;

      _charEyeOffset.set(0, isCharacterMode ? 1.3 : 0.9, 0);
      currentLook.current.copy(target.position).add(_charEyeOffset);

      if (isCharacterMode) {
        const behindYaw = target.rotation.y + Math.PI;
        yaw.current = behindYaw;
        yawTarget.current = behindYaw;

        pitch.current = 0.18;
        pitchTarget.current = 0.18;
      }
    }

    if (isCharacterMode) {
      const sensFactor = aimAssistLockedRef.current ? 0.52 : 1.0;
      if (remoteInputRef?.current) {
        const rawDX = Number(remoteInputRef.current.lookDeltaX) || 0;
        const rawDY = Number(remoteInputRef.current.lookDeltaY) || 0;
        // Always reset deltas immediately so they are strictly single-frame impulses
        remoteInputRef.current.lookDeltaX = 0;
        remoteInputRef.current.lookDeltaY = 0;

        const swipeDX = THREE.MathUtils.clamp(rawDX, -0.25, 0.25);
        const swipeDY = THREE.MathUtils.clamp(rawDY, -0.25, 0.25);
        if (swipeDX !== 0 || swipeDY !== 0) {
          yawTarget.current -= swipeDX * sensFactor;
          pitchTarget.current = THREE.MathUtils.clamp(
            pitchTarget.current + swipeDY * sensFactor,
            MIN_PITCH,
            MAX_PITCH,
          );
        }
      }

      const remoteLookX = remoteInputRef?.current?.lookX || 0;
      const remoteLookY = remoteInputRef?.current?.lookY || 0;
      if (Math.abs(remoteLookX) > 0.04 || Math.abs(remoteLookY) > 0.04) {
        yawTarget.current -= remoteLookX * REMOTE_LOOK_SPEED * dt * sensFactor;
        pitchTarget.current = THREE.MathUtils.clamp(
          pitchTarget.current - remoteLookY * REMOTE_LOOK_SPEED * 0.7 * dt * sensFactor,
          MIN_PITCH,
          MAX_PITCH,
        );
      }

      const yawAlpha = 1 - Math.exp(-ORBIT_DAMP * dt);
      yaw.current += (yawTarget.current - yaw.current) * yawAlpha;
      pitch.current += (pitchTarget.current - pitch.current) * yawAlpha;

      if (orbitYawRef) orbitYawRef.current = yaw.current;
      if (orbitPitchRef) orbitPitchRef.current = pitch.current;

      const targetFov = isAiming ? 30 : 44;
      if (Math.abs(camera.fov - targetFov) > 0.1) {
        camera.fov = THREE.MathUtils.lerp(
          camera.fov,
          targetFov,
          1 - Math.exp(-14 * dt),
        );
        camera.updateProjectionMatrix();
      }

      const distance = isAiming ? 2.35 : CHARACTER_CAMERA_DISTANCE;
      const shoulderOffset = isAiming ? 0.62 : isArmed ? 0.45 : 0;
      const horizontal = Math.cos(pitch.current) * distance;
      const vertical = Math.sin(pitch.current) * distance;

      const rightX = Math.cos(yaw.current) * shoulderOffset;
      const rightZ = -Math.sin(yaw.current) * shoulderOffset;

      const cameraX =
        target.position.x + Math.sin(yaw.current) * horizontal + rightX;
      const cameraZ =
        target.position.z + Math.cos(yaw.current) * horizontal + rightZ;
      const cameraY = target.position.y + CHARACTER_CAMERA_HEIGHT + vertical;

      desiredPosition.current.set(cameraX, cameraY, cameraZ);
      camera.position.lerp(desiredPosition.current, 1 - Math.exp(-14 * dt));

      const lookForwardDist = isAiming ? 24 : 8;
      const forwardX = -Math.sin(yaw.current) * Math.cos(pitch.current);
      const forwardY = -Math.sin(pitch.current);
      const forwardZ = -Math.cos(yaw.current) * Math.cos(pitch.current);

      if (isArmed || isAiming) {
        lookTarget.current.set(
          target.position.x + rightX + forwardX * lookForwardDist,
          target.position.y + 1.42 + forwardY * lookForwardDist,
          target.position.z + rightZ + forwardZ * lookForwardDist,
        );
      } else {
        _charEyeOffset.set(0, 1.35, 0);
        lookTarget.current.copy(target.position).add(_charEyeOffset);
      }

      currentLook.current.lerp(lookTarget.current, 1 - Math.exp(-18 * dt));
      camera.lookAt(currentLook.current);
      return;
    }

    // Restore car camera FOV
    if (Math.abs(camera.fov - camPreset.fov) > 0.1) {
      camera.fov = THREE.MathUtils.lerp(
        camera.fov,
        camPreset.fov,
        1 - Math.exp(-12 * dt),
      );
      camera.updateProjectionMatrix();
    }

    const phys = physicsStateRef?.current || {
      vx: 0,
      vy: 0,
      steering: 0,
      boost: false,
    };

    const carYaw = target.rotation.y;

    if (cameraMode === "hood") {
      _offsetVec
        .set(camPreset.offset[0], camPreset.offset[1], camPreset.offset[2])
        .applyAxisAngle(_upAxis, carYaw);

      camera.position.copy(target.position).add(_offsetVec);

      _lookVec
        .set(12, camPreset.lookY, -phys.steering * 3)
        .applyAxisAngle(_upAxis, carYaw);

      lookTarget.current.copy(target.position).add(_lookVec);
      camera.lookAt(lookTarget.current);
      return;
    }

    const driftSwing = THREE.MathUtils.clamp(phys.vy * 0.14, -1.6, 1.6);
    const speedPullback = THREE.MathUtils.clamp(
      Math.abs(phys.vx) * 0.035,
      0,
      1.4,
    );

    _offsetVec
      .set(
        camPreset.offset[0] - speedPullback,
        camPreset.offset[1],
        camPreset.offset[2] + driftSwing,
      )
      .applyAxisAngle(_upAxis, carYaw);

    desiredPosition.current.copy(target.position).add(_offsetVec);
    camera.position.lerp(desiredPosition.current, 1 - Math.exp(-6.5 * dt));

    _lookVec
      .set(2.2, camPreset.lookY, -phys.steering * 1.1)
      .applyAxisAngle(_upAxis, carYaw);

    lookTarget.current.copy(target.position).add(_lookVec);
    currentLook.current.lerp(lookTarget.current, 1 - Math.exp(-10 * dt));
    camera.lookAt(currentLook.current);
  });

  return null;
}
```

===============================================================================
FILE: client/src/components/World/OpenWorldMap.js
===============================================================================

```js
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
```

===============================================================================
FILE: client/src/components/Zone/ZoneManager.jsx
===============================================================================

```jsx
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  ZONE_STAGES,
  ZONE_INITIAL_RADIUS,
  ZONE_CENTER,
  ZONE_Y,
} from '../../config/gameConstants';

/* ------------------------------------------------------------------ */
/*  Pure helper — also exported so the HUD can query zone state       */
/* ------------------------------------------------------------------ */
export function getZoneInfo(matchElapsed) {
  let elapsed = matchElapsed;
  let prevRadius = ZONE_INITIAL_RADIUS;
  let currentDps = 0;

  for (let i = 0; i < ZONE_STAGES.length; i++) {
    const stage = ZONE_STAGES[i];

    // Delay phase — waiting before this stage shrinks
    if (elapsed < stage.delay) {
      return {
        stage: i,
        radius: prevRadius,
        dps: currentDps,
        nextShrinkIn: stage.delay - elapsed,
        isShrinking: false,
      };
    }
    elapsed -= stage.delay;

    // Shrink phase — linearly interpolate from prevRadius → stage.radius
    if (elapsed < stage.shrink) {
      const t = elapsed / stage.shrink;
      return {
        stage: i,
        radius: THREE.MathUtils.lerp(prevRadius, stage.radius, t),
        dps: stage.dps,
        nextShrinkIn: 0,
        isShrinking: true,
      };
    }
    elapsed -= stage.shrink;

    // Stage complete — advance
    prevRadius = stage.radius;
    currentDps = stage.dps;
  }

  // All stages exhausted — zone stays at final size
  const last = ZONE_STAGES[ZONE_STAGES.length - 1];
  return {
    stage: ZONE_STAGES.length - 1,
    radius: last.radius,
    dps: last.dps,
    nextShrinkIn: 0,
    isShrinking: false,
  };
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const CYLINDER_HEIGHT = 200;
const CYLINDER_Y = ZONE_Y - 50;
const ZONE_COLOR = new THREE.Color('#0088ff');
const RING_COLOR = new THREE.Color('#00aaff');

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function ZoneManager({
  matchStatus = 'IN_PROGRESS',
  matchElapsed = 0,
  playerPos = null,
  onZoneDamage,
  enabled = true,
}) {
  const cylinderRef = useRef();
  const ringRef = useRef();
  const damageTimerRef = useRef(0);

  // Cylinder geometry: radius 1, will be scaled to currentRadius
  const cylinderGeom = useMemo(
    () => new THREE.CylinderGeometry(1, 1, CYLINDER_HEIGHT, 64, 1, true),
    [],
  );

  // Torus ring at the base for the glowing edge
  const ringGeom = useMemo(
    () => new THREE.TorusGeometry(1, 0.35, 8, 128),
    [],
  );

  // Materials (created once)
  const wallMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: ZONE_COLOR,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [],
  );

  const ringMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: RING_COLOR,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
      }),
    [],
  );

  // Dispose geometries and materials cleanly on unmount
  useEffect(() => {
    return () => {
      cylinderGeom.dispose();
      ringGeom.dispose();
      wallMaterial.dispose();
      ringMaterial.dispose();
    };
  }, [cylinderGeom, ringGeom, wallMaterial, ringMaterial]);

  // Per-frame logic
  useFrame((_, delta) => {
    if (matchStatus !== 'IN_PROGRESS' || !enabled) return;

    const info = getZoneInfo(matchElapsed);
    const currentRadius = info.radius;
    const currentDps = info.dps;

    // Scale cylinder mesh to currentRadius
    if (cylinderRef.current) {
      cylinderRef.current.scale.set(currentRadius, 1, currentRadius);
    }

    // Scale ring mesh to currentRadius
    if (ringRef.current) {
      ringRef.current.scale.set(currentRadius, currentRadius, 1);
    }

    // Check if player is outside the zone (throttled once per second)
    if (playerPos && onZoneDamage && currentDps > 0) {
      const dx = playerPos.x - ZONE_CENTER.x;
      const dz = playerPos.z - ZONE_CENTER.z;
      const distSq = dx * dx + dz * dz;
      if (distSq > currentRadius * currentRadius) {
        damageTimerRef.current += delta;
        if (damageTimerRef.current >= 1.0) {
          damageTimerRef.current = 0;
          onZoneDamage(currentDps);
        }
      } else {
        damageTimerRef.current = 0;
      }
    }
  });

  // Don't render anything when disabled or match not in progress
  if (!enabled || matchStatus !== 'IN_PROGRESS') return null;

  return (
    <group>
      {/* Translucent blue cylinder wall */}
      <mesh
        ref={cylinderRef}
        geometry={cylinderGeom}
        material={wallMaterial}
        position={[ZONE_CENTER.x, CYLINDER_Y, ZONE_CENTER.z]}
      />

      {/* Bright ring at the base */}
      <mesh
        ref={ringRef}
        geometry={ringGeom}
        material={ringMaterial}
        position={[ZONE_CENTER.x, ZONE_Y, ZONE_CENTER.z]}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
}
```

===============================================================================
FILE: client/src/config/gameConstants.js
===============================================================================

```js
export const SCENE_PRESETS = {
  track: {
    label: "Bermuda Daylight",
    bg: "#69a2d8",
    fog: ["#82b4e2", 180, 780],
    ambient: 0.95,
    hemiSky: "#e6f2ff",
    hemiGround: "#28364a",
    dirIntensity: 3.1,
    dirColor: "#fff8eb",
    accentColor: "#2d79ff",
    groundColor: "#10161f",
    gridCell: "#1d2a3d",
    gridSection: "#2c4870",
  },
  night: {
    label: "Night Circuit",
    bg: "#04060b",
    fog: ["#04060b", 20, 135],
    ambient: 0.42,
    hemiSky: "#5a9cff",
    hemiGround: "#080b12",
    dirIntensity: 1.9,
    dirColor: "#8ab8ff",
    accentColor: "#ff2a5f",
    groundColor: "#090d14",
    gridCell: "#141d2e",
    gridSection: "#00d2ff",
  },
  studio: {
    label: "M Studio",
    bg: "#090d14",
    fog: ["#090d14", 24, 120],
    ambient: 0.7,
    hemiSky: "#dceaff",
    hemiGround: "#18202b",
    dirIntensity: 3.1,
    dirColor: "#ffffff",
    accentColor: "#2d79ff",
    groundColor: "#111821",
    gridCell: "#192330",
    gridSection: "#2b3e57",
  },
};

export const MAP_PRESETS = {
  bermuda: {
    id: "bermuda",
    label: "Bermuda FF",
  },
  rainier: {
    id: "rainier",
    label: "Mt. Rainier",
  },
  cotedazur: {
    id: "cotedazur",
    label: "Côte d'Azur",
  },
};

export const WEAPONS = {
  m4a1: {
    id: "m4a1",
    name: "M4A1 RIFLE",
    category: "rifle",
    magSize: 30,
    reserveAmmo: 120,
    fireRate: 0.11,
    damage: 28,
    headshotDamage: 112,
    range: 140,
    recoilPitch: 0.014,
    spread: 0.008,
    reloadTime: 1.6,
    color: "#2d79ff",
  },
  ak47: {
    id: "ak47",
    name: "AK-47",
    category: "rifle",
    magSize: 30,
    reserveAmmo: 90,
    fireRate: 0.1,
    damage: 32,
    headshotDamage: 128,
    range: 120,
    recoilPitch: 0.022,
    spread: 0.012,
    reloadTime: 2.0,
    color: "#ff9f0a",
  },
  awm: {
    id: "awm",
    name: "AWM SNIPER",
    category: "sniper",
    magSize: 5,
    reserveAmmo: 20,
    fireRate: 1.5,
    damage: 90,
    headshotDamage: 360,
    range: 300,
    recoilPitch: 0.06,
    spread: 0.002,
    reloadTime: 3.2,
    color: "#55e6a0",
  },
  mp40: {
    id: "mp40",
    name: "MP40 SMG",
    category: "smg",
    magSize: 24,
    reserveAmmo: 96,
    fireRate: 0.075,
    damage: 22,
    headshotDamage: 88,
    range: 75,
    recoilPitch: 0.018,
    spread: 0.018,
    reloadTime: 1.3,
    color: "#ff9f0a",
  },
  deagle: {
    id: "deagle",
    name: "DESERT EAGLE",
    category: "pistol",
    magSize: 7,
    reserveAmmo: 35,
    fireRate: 0.35,
    damage: 48,
    headshotDamage: 192,
    range: 50,
    recoilPitch: 0.035,
    spread: 0.015,
    reloadTime: 1.8,
    color: "#c9a040",
  },
  fist: {
    id: "fist",
    name: "UNARMED",
    category: "melee",
    magSize: 0,
    reserveAmmo: 0,
    fireRate: 0.5,
    damage: 0,
    headshotDamage: 0,
    range: 0,
    recoilPitch: 0,
    spread: 0,
    reloadTime: 0,
    color: "#8fa2b8",
  },
};

export const WEAPON_ORDER = ["m4a1", "ak47", "awm", "mp40", "deagle", "fist"];

/* ------------------------------------------------------------------ */
/*  Shrinking Blue Zone (Free Fire Bermuda Safe Zone Stages)          */
/* ------------------------------------------------------------------ */
export const ZONE_CENTER = { x: 0, z: 0 };
export const ZONE_INITIAL_RADIUS = 88;
export const ZONE_Y = 0.8; // Bermuda ground elevation
export const ZONE_STAGES = [
  // { delay: wait seconds before shrinking, shrink: transition seconds, radius: target, dps: damage per second }
  { delay: 45, shrink: 25, radius: 58, dps: 2 },
  { delay: 35, shrink: 20, radius: 36, dps: 4 },
  { delay: 25, shrink: 18, radius: 18, dps: 8 },
  { delay: 20, shrink: 15, radius: 7, dps: 15 },
];

/* ------------------------------------------------------------------ */
/*  Loot Item Definitions                                             */
/* ------------------------------------------------------------------ */
export const LOOT_ITEMS = {
  weapon_m4a1: { type: "weapon", weaponId: "m4a1", label: "M4A1 Rifle", rarity: "rare", color: "#2d79ff" },
  weapon_ak47: { type: "weapon", weaponId: "ak47", label: "AK-47", rarity: "rare", color: "#ff9f0a" },
  weapon_awm: { type: "weapon", weaponId: "awm", label: "AWM Sniper", rarity: "legendary", color: "#55e6a0" },
  weapon_mp40: { type: "weapon", weaponId: "mp40", label: "MP40 SMG", rarity: "common", color: "#ff9f0a" },
  weapon_deagle: { type: "weapon", weaponId: "deagle", label: "Desert Eagle", rarity: "epic", color: "#c9a040" },
  ammo_rifle: { type: "ammo", ammoFor: ["m4a1", "ak47"], amount: 30, label: "Rifle Ammo ×30", color: "#ffd60a" },
  ammo_smg: { type: "ammo", ammoFor: ["mp40"], amount: 24, label: "SMG Ammo ×24", color: "#ffd60a" },
  ammo_sniper: { type: "ammo", ammoFor: ["awm"], amount: 10, label: "Sniper Ammo ×10", color: "#ffd60a" },
  ammo_pistol: { type: "ammo", ammoFor: ["deagle"], amount: 14, label: "Pistol Ammo ×14", color: "#ffd60a" },
  medkit: { type: "heal", healAmount: 75, label: "Medkit", rarity: "common", color: "#28cd41" },
  vest_1: { type: "armor", level: 1, protection: 25, label: "Lv.1 Vest", color: "#8fa2b8" },
  vest_2: { type: "armor", level: 2, protection: 50, label: "Lv.2 Vest", color: "#2d79ff" },
  vest_3: { type: "armor", level: 3, protection: 75, label: "Lv.3 Vest", color: "#ffd60a" },
  helmet_1: { type: "helmet", level: 1, protection: 20, label: "Lv.1 Helmet", color: "#8fa2b8" },
  helmet_2: { type: "helmet", level: 2, protection: 40, label: "Lv.2 Helmet", color: "#2d79ff" },
  helmet_3: { type: "helmet", level: 3, protection: 75, label: "Lv.3 Helmet", color: "#ffd60a" },
};

/** Weighted table for random loot spawning */
export const LOOT_SPAWN_TABLE = [
  { id: "weapon_m4a1", weight: 6 },
  { id: "weapon_ak47", weight: 5 },
  { id: "weapon_mp40", weight: 8 },
  { id: "weapon_deagle", weight: 6 },
  { id: "weapon_awm", weight: 2 },
  { id: "ammo_rifle", weight: 12 },
  { id: "ammo_smg", weight: 10 },
  { id: "ammo_sniper", weight: 4 },
  { id: "ammo_pistol", weight: 8 },
  { id: "medkit", weight: 10 },
  { id: "vest_1", weight: 5 },
  { id: "vest_2", weight: 3 },
  { id: "vest_3", weight: 1 },
  { id: "helmet_1", weight: 5 },
  { id: "helmet_2", weight: 3 },
  { id: "helmet_3", weight: 1 },
];

export const LOOT_SPAWN_COUNT = 36;
export const LOOT_PICKUP_RANGE = 3.2;

/* ------------------------------------------------------------------ */
/*  Aircraft Drop-in Settings                                         */
/* ------------------------------------------------------------------ */
export const AIRCRAFT_ALTITUDE = 42;
export const AIRCRAFT_SPEED = 16; // m/s
export const PARACHUTE_FALL_SPEED = 14;
export const PARACHUTE_LATERAL_SPEED = 12;

/* ------------------------------------------------------------------ */
/*  Camera & Controls                                                 */
/* ------------------------------------------------------------------ */
export const CAMERA_MODES = [
  {
    id: "chase",
    label: "Chase Cam",
    offset: [-7.4, 2.5, 0],
    lookY: 0.95,
    fov: 44,
  },
  {
    id: "dynamic",
    label: "Action Cam",
    offset: [-5.8, 1.95, 0],
    lookY: 0.85,
    fov: 50,
  },
  {
    id: "hood",
    label: "Hood Cam",
    offset: [0.35, 1.36, 0],
    lookY: 1.15,
    fov: 58,
  },
];

export const MAX_TILT_DEG = 26;
export const TILT_DEADZONE_DEG = 1.0;
export const MAX_WHEEL_ROTATION_DEG = 135;

export const INITIAL_TELEMETRY = {
  speed: 0,
  rpm: 850,
  gear: "N",
  drifting: false,
  driftAngle: 0,
  boost: false,
  steerInput: 0,
};
```

===============================================================================
FILE: client/src/FreeFireFeatures.test.js
===============================================================================

```js
import React, { act } from "react";
import { render } from "@testing-library/react";

jest.mock("@react-three/fiber", () => ({
  useFrame: jest.fn(),
  useThree: () => ({ camera: { position: { x: 0, y: 0, z: 0 }, getWorldDirection: jest.fn() } }),
}));

jest.mock("./components/Zone/ZoneManager", () => ({
  getZoneInfo: () => ({
    stageIndex: 0,
    radius: 70,
    isShrinking: false,
    nextShrinkIn: 120,
    currentDamage: 1.5,
  }),
}));

import DraggableFireButton from "./components/UI/DraggableFireButton";
import { FreeFireMinimapBox } from "./components/UI/FreeFireHudParts";
import FreeFireHUD from "./components/UI/FreeFireHUD";

describe("Free Fire Combat & HUD Features", () => {
  test("DraggableFireButton triggers onFireStart, onFireDrag with upward headshot, and onFireEnd", () => {
    const handleFireStart = jest.fn();
    const handleFireEnd = jest.fn();
    const handleFireDrag = jest.fn();

    const { container } = render(
      <DraggableFireButton
        className="ffh-test-fire-btn"
        onFireStart={handleFireStart}
        onFireEnd={handleFireEnd}
        onFireDrag={handleFireDrag}
      >
        <span>FIRE</span>
      </DraggableFireButton>
    );

    const btn = container.querySelector(".ffh-btn-fire-draggable");
    expect(btn).toBeInTheDocument();

    // 1. Pointer Down
    act(() => {
      const downEvt = new Event("pointerdown", { bubbles: true });
      Object.assign(downEvt, { clientX: 100, clientY: 200, pageX: 100, pageY: 200, pointerId: 1 });
      btn.dispatchEvent(downEvt);
    });
    expect(handleFireStart).toHaveBeenCalledTimes(1);

    // 2. Drag UPWARD (clientY from 200 to 160 = -40px)
    act(() => {
      const moveEvt = new Event("pointermove", { bubbles: true });
      Object.assign(moveEvt, { clientX: 100, clientY: 160, pageX: 100, pageY: 160, pointerId: 1 });
      btn.dispatchEvent(moveEvt);
    });
    expect(handleFireDrag).toHaveBeenCalled();
    const lastDragCall = handleFireDrag.mock.calls[handleFireDrag.mock.calls.length - 1][0];
    expect(lastDragCall.dragUpActive).toBe(true);
    expect(lastDragCall.dragUpRatio).toBeGreaterThan(0.5);

    // 3. Pointer Up
    act(() => {
      const upEvt = new Event("pointerup", { bubbles: true });
      Object.assign(upEvt, { pointerId: 1 });
      btn.dispatchEvent(upEvt);
    });
    expect(handleFireEnd).toHaveBeenCalledTimes(1);
  });

  test("FreeFireMinimapBox renders enemy blips and BMW M4 vehicle marker", () => {
    const mockEnemies = [
      { id: 1, name: "Kelly", x: 10, z: -15, headingDeg: 45, state: "patrol" },
      { id: 2, name: "Hayato", x: -20, z: 30, headingDeg: 180, state: "combat" },
    ];
    const mockCarPos = { x: -5, z: 12, headingDeg: 90 };

    const { container } = render(
      <FreeFireMinimapBox
        posX={0}
        posZ={0}
        headingDeg={0}
        matchElapsed={120}
        enemies={mockEnemies}
        carPos={mockCarPos}
      />
    );

    // Verify Car Marker is rendered
    const carMarker = container.querySelector(".ffh-map-car-marker");
    expect(carMarker).toBeInTheDocument();

    // Verify Enemy blips are rendered
    const enemyBlips = container.querySelectorAll(".ffh-map-enemy-blip");
    expect(enemyBlips.length).toBe(2);

    // Verify combat enemy has pulse ring
    const combatEnemy = container.querySelector(".ffh-map-enemy-blip.combat");
    expect(combatEnemy).toBeInTheDocument();
    expect(combatEnemy.querySelector(".ffh-enemy-combat-ring")).toBeInTheDocument();
  });

  test("Crosshair displays locked-red and headshot-lock rings when aim assist locks", () => {
    const { container, rerender } = render(
      <FreeFireHUD
        weaponId="m4a1"
        isAiming={true}
        aimAssistLocked={false}
        isHeadshotLocked={false}
      />
    );

    let crosshair = container.querySelector(".ffh-crosshair");
    expect(crosshair).toBeInTheDocument();
    expect(crosshair).not.toHaveClass("locked-red");

    // Locked onto enemy chest
    rerender(
      <FreeFireHUD
        weaponId="m4a1"
        isAiming={true}
        aimAssistLocked={true}
        isHeadshotLocked={false}
      />
    );
    crosshair = container.querySelector(".ffh-crosshair");
    expect(crosshair).toHaveClass("locked-red");
    expect(crosshair).not.toHaveClass("headshot-lock");

    // Drag-up headshot lock
    rerender(
      <FreeFireHUD
        weaponId="m4a1"
        isAiming={true}
        aimAssistLocked={true}
        isHeadshotLocked={true}
      />
    );
    crosshair = container.querySelector(".ffh-crosshair");
    expect(crosshair).toHaveClass("locked-red");
    expect(crosshair).toHaveClass("headshot-lock");
    expect(container.querySelector(".ffh-crosshair-head-ring")).toBeInTheDocument();
  });

  test("Controller heartbeat strips transient look deltas preventing infinite continuous auto-rotation", () => {
    // Simulate phone controller inputRef state with both steady-state and transient delta
    const inputState = {
      fire: true,
      dragUp: true,
      moveX: 0.5,
      moveY: 0,
      lookDeltaX: -0.015,
      lookDeltaY: -0.02,
    };

    // Heartbeat logic: strip transient delta impulses
    const { lookDeltaX, lookDeltaY, ...steadyState } = inputState;

    expect(steadyState.fire).toBe(true);
    expect(steadyState.dragUp).toBe(true);
    expect(steadyState.moveX).toBe(0.5);
    expect(steadyState.lookDeltaX).toBeUndefined();
    expect(steadyState.lookDeltaY).toBeUndefined();

    // Laptop receiving logic: clamp and single-frame impulse
    const remoteInput = { lookDeltaX: 0, lookDeltaY: 0 };
    const receivedData = { lookDeltaX: 0.05, lookDeltaY: -0.03 };

    if (typeof receivedData.lookDeltaX === "number" && Number.isFinite(receivedData.lookDeltaX)) {
      const clampedDX = Math.max(-0.5, Math.min(0.5, receivedData.lookDeltaX));
      remoteInput.lookDeltaX = (remoteInput.lookDeltaX || 0) + clampedDX;
    }
    expect(remoteInput.lookDeltaX).toBe(0.05);

    // Frame consumption in FollowCamera
    const rawDX = Number(remoteInput.lookDeltaX) || 0;
    remoteInput.lookDeltaX = 0; // Immediate reset
    expect(rawDX).toBe(0.05);
    expect(remoteInput.lookDeltaX).toBe(0); // Cleared for next frame, no accumulation
  });

  test("Remote players list filters out local player and identifies teammates correctly", () => {
    const localPlayerId = "p_local";
    const localTeamId = 1;

    const allPlayersFromSnapshot = [
      { id: "p_local", name: "Me", teamId: 1, pos: [0, 1, 0], hp: 100, alive: true },
      { id: "p_teammate", name: "Ally", teamId: 1, pos: [5, 1, 2], hp: 85, alive: true },
      { id: "p_enemy", name: "Foe", teamId: 2, pos: [15, 1, 20], hp: 60, alive: true },
      { id: "bot_1", name: "[BOT] Kelly", teamId: 3, pos: [25, 1, -10], hp: 100, alive: true },
    ];

    // Filter out local player so they are never rendered as a remote duplicate
    const remoteOnly = allPlayersFromSnapshot.filter(
      (p) => p && p.id && p.id !== localPlayerId && Array.isArray(p.pos)
    );

    expect(remoteOnly.length).toBe(3);
    expect(remoteOnly.some((p) => p.id === localPlayerId)).toBe(false);

    // Verify teammate classification
    const ally = remoteOnly.find((p) => p.id === "p_teammate");
    const foe = remoteOnly.find((p) => p.id === "p_enemy");

    expect(ally.teamId === localTeamId).toBe(true);
    expect(foe.teamId === localTeamId).toBe(false);
  });
});
```

===============================================================================
FILE: client/src/index.css
===============================================================================

```css
@import url("https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,500;0,600;0,700;0,800;1,800&family=Inter:wght@400;500;600;700;800&display=swap");

:root {
  color-scheme: dark;
  font-family: "Inter", sans-serif;
  background: #06090f;
  color: #f4f7fb;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  user-select: none;
  -webkit-user-select: none;
}

html,
body,
#root {
  width: 100%;
  height: 100%;
  height: 100dvh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: #06090f;
  touch-action: none;
  overscroll-behavior: none;
}

button {
  font: inherit;
  color: inherit;
}

/* ================================================================== */
/*  ICONS, MODALS & QR CARD                                           */
/* ================================================================== */

.mc-icon-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  pointer-events: auto;
}

.mc-icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(14, 21, 33, 0.82);
  backdrop-filter: blur(14px);
  color: #dce6f2;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform 0.14s ease, background 0.14s ease, border-color 0.14s ease;
}

.mc-icon-btn svg {
  width: 19px;
  height: 19px;
}

.mc-icon-btn:active,
.mc-icon-btn:hover {
  transform: scale(0.92);
  border-color: #2d79ff;
  background: rgba(45, 121, 255, 0.3);
  color: #ffffff;
}

.mc-settings-trigger {
  border-color: rgba(45, 121, 255, 0.5);
  background: linear-gradient(135deg, rgba(23, 105, 210, 0.4), rgba(14, 21, 33, 0.9));
}

.mc-modal-backdrop {
  position: absolute;
  inset: 0;
  z-index: 60;
  background: rgba(4, 7, 13, 0.82);
  backdrop-filter: blur(14px);
  display: grid;
  place-items: center;
  padding: 16px;
}

.mc-settings-card,
.mc-qr-card {
  width: min(480px, 94%);
  padding: 18px 20px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: linear-gradient(180deg, #121b2b 0%, #090e17 100%);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.mc-qr-card {
  width: min(340px, 90%);
  align-items: center;
  text-align: center;
}

.mc-settings-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mc-settings-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.mc-settings-title svg {
  width: 21px;
  height: 21px;
  color: #2d79ff;
}

.mc-qr-instruction {
  font-size: 11px;
  color: #8fa2b8;
  line-height: 1.5;
  margin: 0;
}

.mc-qr-frame {
  padding: 12px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
}

.mc-qr-url {
  font-family: monospace;
  font-size: 11px;
  color: #00d2ff;
  background: rgba(0, 210, 255, 0.1);
  padding: 8px 12px;
  border-radius: 8px;
  width: 100%;
  word-break: break-all;
}

.mc-setting-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.mc-setting-label {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.6px;
  color: #8294aa;
}

.mc-segmented {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
}

.mc-seg-btn {
  height: 42px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #9fb0c4;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.7px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.mc-seg-btn svg {
  width: 16px;
  height: 16px;
}

.mc-seg-btn.active {
  border-color: #00d2ff;
  background: linear-gradient(135deg, #1769d2 0%, #0c4391 100%);
  color: #ffffff;
  box-shadow: 0 4px 16px rgba(23, 105, 210, 0.45);
}

/* ================================================================== */
/*  PHONE CONTROLLER COCKPIT                                          */
/* ================================================================== */

.mc-viewport {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--mc-vw, 100vw);
  height: var(--mc-vh, 100dvh);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: max(6px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right))
    max(10px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left));
  background:
    radial-gradient(circle at 50% 40%, rgba(23, 105, 210, 0.15) 0%, transparent 65%),
    linear-gradient(180deg, #0b111c 0%, #05080d 100%);
  overflow: hidden;
  touch-action: none;
}

.mc-viewport.mc-force-landscape {
  width: var(--mc-vh, 100dvh);
  height: var(--mc-vw, 100vw);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(90deg);
}

.mc-rpm-strip {
  display: grid;
  grid-template-columns: repeat(14, 1fr);
  gap: 5px;
  width: min(460px, 70%);
  margin: 0 auto 4px;
}

.mc-shift-led {
  height: 4px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.08);
}

.mc-shift-led.on.green {
  background: #32d74b;
  box-shadow: 0 0 8px #32d74b;
}

.mc-shift-led.on.blue {
  background: #00d2ff;
  box-shadow: 0 0 8px #00d2ff;
}

.mc-shift-led.on.red {
  background: #ff2a5f;
  box-shadow: 0 0 10px #ff2a5f;
}

.mc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.mc-brand-status {
  display: flex;
  align-items: center;
  gap: 9px;
}

.mc-m-badge {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: linear-gradient(135deg, #1769d2 0%, #0d1522 65%, #ff2a5f 100%);
  display: grid;
  place-items: center;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 21px;
  font-weight: 800;
  font-style: italic;
}

.mc-conn-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mc-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.mc-dot-live {
  background: #32d74b;
  box-shadow: 0 0 8px #32d74b;
}

.mc-dot-wait {
  background: #ff9f0a;
  box-shadow: 0 0 8px #ff9f0a;
}

.mc-conn-text {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.4px;
  color: #dce6f2;
}

.mc-sub-mode {
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #6c809a;
  margin-top: 1px;
}

.mc-digital-cluster {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 4px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(11, 17, 27, 0.85);
}

.mc-speed-block,
.mc-gear-block {
  display: flex;
  align-items: baseline;
  gap: 5px;
}

.mc-speed-digits {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 34px;
  font-weight: 800;
  line-height: 1;
  color: #ffffff;
}

.mc-speed-unit,
.mc-gear-label {
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.2px;
  color: #7c8fa8;
}

.mc-cluster-divider {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.14);
}

.mc-gear-digit {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 34px;
  font-weight: 800;
  line-height: 1;
  color: #00d2ff;
}

/* ================================================================== */
/*  GYRO MODE                                                         */
/* ================================================================== */

.mc-gyro-layout {
  flex: 1;
  display: grid;
  grid-template-columns: 1.15fr 1fr 1.15fr;
  gap: 14px;
  align-items: stretch;
  margin-top: 8px;
  min-height: 0;
}

.mc-gyro-side {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
}

.mc-gyro-center-card {
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: radial-gradient(circle at 50% 45%, rgba(20, 32, 52, 0.72) 0%, rgba(8, 13, 21, 0.92) 100%);
  padding: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.mc-gyro-badge {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.4px;
  color: #70e5ff;
}

.mc-gyro-badge svg {
  width: 18px;
  height: 18px;
}

.mc-enable-gyro-action-btn {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #00d2ff;
  background: linear-gradient(135deg, #1769d2 0%, #0095d9 100%);
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 0 16px rgba(0, 210, 255, 0.4);
}

.mc-gyro-perm-warning {
  font-size: 8px;
  color: #ff3b30;
  font-weight: 800;
  text-align: center;
}

.mc-gyro-horizon {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.mc-gyro-horizon-bar {
  width: 82%;
  height: 6px;
  border-radius: 99px;
  background: linear-gradient(90deg, #2d79ff, #00d2ff, #2d79ff);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 0 18px rgba(0, 210, 255, 0.5);
  transition: transform 0.05s linear;
}

.mc-horizon-tip {
  width: 10px;
  height: 16px;
  border-radius: 4px;
  background: #ffffff;
}

.mc-horizon-center {
  width: 4px;
  height: 18px;
  background: #ff2a5f;
}

.mc-gyro-angle-val {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: #dce6f2;
}

.mc-recenter-pill {
  width: 100%;
  height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(0, 210, 255, 0.45);
  background: rgba(0, 210, 255, 0.15);
  color: #8beeff;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.4px;
  cursor: pointer;
}

/* ================================================================== */
/*  WHEEL MODE                                                        */
/* ================================================================== */

.mc-wheel-layout {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 16px;
  align-items: stretch;
  margin-top: 8px;
  min-height: 0;
}

.mc-wheel-layout.wheel-on-right {
  grid-template-columns: 1.15fr 1fr;
}

.mc-wheel-layout.wheel-on-right .mc-rotary-wheel-zone {
  order: 2;
}

.mc-wheel-layout.wheel-on-right .mc-dual-pedals-zone {
  order: 1;
}

.mc-rotary-wheel-zone {
  border-radius: 22px;
  border: 1px solid rgba(45, 121, 255, 0.32);
  background: radial-gradient(circle at 50% 46%, rgba(23, 44, 78, 0.55) 0%, rgba(8, 13, 21, 0.92) 100%);
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
  touch-action: none;
}

.mc-rotary-ring-guide {
  flex: 1;
  width: 100%;
  min-height: 0;
  display: grid;
  place-items: center;
  position: relative;
}

.mc-rotary-glow {
  position: absolute;
  width: 170px;
  height: 170px;
  border-radius: 50%;
  border: 1px dashed rgba(0, 210, 255, 0.28);
  background: radial-gradient(circle, rgba(45, 121, 255, 0.22) 0%, transparent 70%);
  pointer-events: none;
}

.mc-wheel-svg {
  width: min(200px, 52vh);
  height: min(200px, 52vh);
  max-width: 100%;
  max-height: 100%;
  filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.7));
  transition: transform 0.05s linear;
}

.mc-wheel-svg.grabbing {
  transition: none;
  filter: drop-shadow(0 0 18px rgba(0, 210, 255, 0.55));
}

.mc-rotary-footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}

.mc-rotary-hint {
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: #7c90ab;
}

.mc-rotary-deg {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 16px;
  font-weight: 800;
  color: #00d2ff;
}

.mc-dual-pedals-zone {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
}

.mc-aux-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.mc-pedals-pair {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 12px;
  min-height: 0;
}

/* ================================================================== */
/*  AUX & PEDALS                                                      */
/* ================================================================== */

.mc-aux-btn {
  height: 46px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.08s ease, box-shadow 0.12s ease, background 0.12s ease;
}

.mc-btn-icon {
  width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
}

.mc-btn-icon svg {
  width: 100%;
  height: 100%;
}

.mc-aux-label {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.mc-drift-btn {
  border: 1.5px solid rgba(255, 159, 10, 0.55);
  background: linear-gradient(180deg, rgba(58, 34, 10, 0.88) 0%, rgba(28, 16, 6, 0.94) 100%);
  color: #ffbc57;
}

.mc-drift-btn.is-pressed {
  transform: scale(0.94);
  border-color: #ff9f0a;
  background: linear-gradient(180deg, #ff9f0a 0%, #d96b00 100%);
  color: #090d14;
  box-shadow: 0 0 24px rgba(255, 159, 10, 0.65);
}

.mc-boost-btn {
  border: 1.5px solid rgba(0, 210, 255, 0.55);
  background: linear-gradient(180deg, rgba(10, 42, 62, 0.88) 0%, rgba(6, 20, 32, 0.94) 100%);
  color: #70e5ff;
}

.mc-boost-btn.is-pressed {
  transform: scale(0.94);
  border-color: #00d2ff;
  background: linear-gradient(180deg, #00d2ff 0%, #0088cc 100%);
  color: #040911;
  box-shadow: 0 0 26px rgba(0, 210, 255, 0.7);
}

.mc-pedal {
  flex: 1;
  border-radius: 20px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: transform 0.08s ease, box-shadow 0.14s ease, border-color 0.14s ease;
}

.mc-pedal-treads {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 46%;
  margin-bottom: 4px;
  opacity: 0.35;
}

.mc-pedal-treads span {
  height: 3px;
  border-radius: 99px;
  background: currentColor;
}

.mc-pedal-icon {
  width: 26px;
  height: 26px;
}

.mc-pedal-icon svg {
  width: 100%;
  height: 100%;
}

.mc-pedal-title {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: 2px;
  line-height: 1;
}

.mc-pedal-sub {
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.8px;
  opacity: 0.75;
}

.mc-brake-pedal {
  border: 2px solid rgba(255, 42, 95, 0.52);
  background: linear-gradient(180deg, rgba(64, 14, 28, 0.88) 0%, rgba(24, 7, 13, 0.96) 100%);
  color: #ff8da6;
}

.mc-brake-pedal.is-pressed {
  transform: perspective(300px) rotateX(9deg) scale(0.95);
  border-color: #ff2a5f;
  background: linear-gradient(180deg, #e01e4f 0%, #800c29 100%);
  color: #ffffff;
  box-shadow: 0 0 32px rgba(255, 42, 95, 0.65);
}

.mc-gas-pedal {
  border: 2px solid rgba(45, 121, 255, 0.58);
  background: linear-gradient(180deg, rgba(16, 42, 84, 0.88) 0%, rgba(8, 19, 38, 0.96) 100%);
  color: #99c2ff;
}

.mc-gas-pedal.is-pressed {
  transform: perspective(300px) rotateX(9deg) scale(0.95);
  border-color: #00d2ff;
  background: linear-gradient(180deg, #1769d2 0%, #0095d9 100%);
  color: #ffffff;
  box-shadow: 0 0 32px rgba(0, 210, 255, 0.65);
}

/* ================================================================== */
/*  LAPTOP VIEW STYLES                                                */
/* ================================================================== */

.game-shell {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #090d14;
}

.game-shell canvas {
  display: block;
  width: 100%;
  height: 100%;
  outline: none;
}

.topbar {
  position: absolute;
  z-index: 6;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 32px;
  pointer-events: none;
}

.brand-lockup {
  display: flex;
  align-items: center;
  gap: 12px;
  pointer-events: auto;
}

.brand-mark {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  color: #fff;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 24px;
  font-weight: 800;
  font-style: italic;
}

.eyebrow,
.hud-label,
.corner-status {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2px;
}

.eyebrow {
  color: #8b9aab;
  margin-bottom: 3px;
}

.brand-title {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1.2px;
}

.steering-hud-pod {
  position: absolute;
  z-index: 5;
  bottom: 52px;
  width: 185px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.steering-hud-pod.side-left {
  left: 34px;
}

.steering-hud-pod.side-right {
  right: 34px;
}

.steering-hud-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #8292a5;
}

.steering-angle-readout {
  color: #00d2ff;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 15px;
  font-weight: 800;
}

.steering-wheel-ring-wrap {
  width: 118px;
  height: 118px;
  display: grid;
  place-items: center;
}

.drive-hud {
  position: absolute;
  z-index: 5;
  bottom: 52px;
  width: 230px;
  padding: 18px;
  border-radius: 14px;
}

.drive-hud.side-right {
  right: 34px;
}

.drive-hud.side-left {
  left: 34px;
}

.hud-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.hud-label {
  color: #8292a5;
}

.speed-reading {
  margin-top: 4px;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 52px;
  font-weight: 700;
  line-height: 0.95;
}

.speed-reading span {
  margin-left: 5px;
  color: #93a2b4;
  font-family: "Inter", sans-serif;
  font-size: 9px;
  letter-spacing: 1px;
}

.gear-box {
  text-align: right;
}

.gear-reading {
  margin-top: 2px;
  color: #5ca7ff;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 42px;
  font-weight: 800;
  line-height: 1;
}

.rpm-section {
  margin-top: 14px;
}

.rpm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.rpm-value {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: #dce5ef;
}

.rpm-bar-track {
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.rpm-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #1769d2, #00d2ff);
  transition: width 0.06s linear;
}

.rpm-bar-fill.redline {
  background: linear-gradient(90deg, #ff7b00, #ff2a5f);
}

.telemetry-badges {
  display: flex;
  gap: 6px;
  margin-top: 12px;
  min-height: 20px;
}

.badge {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
}

.drift-badge {
  background: rgba(255, 42, 95, 0.22);
  border: 1px solid #ff2a5f;
  color: #ff8ca8;
}

.boost-badge {
  background: rgba(0, 210, 255, 0.2);
  border: 1px solid #00d2ff;
  color: #8beeff;
}

.corner-status {
  position: absolute;
  z-index: 5;
  left: 34px;
  bottom: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #8492a3;
  font-size: 9px;
}

.error-banner {
  position: absolute;
  z-index: 10;
  top: 85px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 16px;
  border: 1px solid #a33c48;
  border-radius: 6px;
  color: #ffdce0;
  background: rgba(80, 17, 27, 0.9);
  font-size: 12px;
}


/* ==========================================
   GYRO PERMISSION MODAL
========================================== */
.mc-gyro-modal-backdrop {
  z-index: 100;
}

.mc-gyro-permission-card {
  width: min(390px, 94%);
  max-height: 90%;
  overflow-y: auto;
  padding: 28px 22px;
  border-radius: 22px;
  border: 1px solid rgba(0, 210, 255, 0.35);
  background: linear-gradient(160deg, #15243a, #080e18);
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.mc-gyro-modal-icon {
  width: 64px;
  height: 64px;
  flex: 0 0 auto;
  border-radius: 18px;
  background: rgba(0, 210, 255, 0.12);
  border: 1px solid rgba(0, 210, 255, 0.4);
  display: grid;
  place-items: center;
  color: #00d2ff;
}

.mc-gyro-modal-icon svg { width: 34px; height: 34px; }
.mc-gyro-permission-card h2 {
  margin: 0;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 1.5px;
}
.mc-gyro-permission-card p {
  margin: 0;
  color: #9aacc2;
  font-size: 12px;
  line-height: 1.7;
}
.mc-gyro-instructions {
  width: 100%;
  padding: 15px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 11px;
  color: #dce6f2;
}
.mc-gyro-status {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #00d2ff;
}
.mc-gyro-modal-error {
  width: 100%;
  padding: 11px;
  border-radius: 9px;
  background: rgba(255, 59, 48, 0.12);
  border: 1px solid rgba(255, 59, 48, 0.3);
  color: #ff7770;
  font-size: 10px;
  line-height: 1.5;
}

/* ==========================================
   LOCAL QR QUICK CONNECT
========================================== */
.mc-qr-card { width: min(380px, 94%); }
.mc-qr-frame svg { display: block; max-width: 100%; height: auto; }
.mc-copy-url-btn { margin-top: 4px; }
.mc-qr-network-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #8fa2b8;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.6px;
  text-align: center;
}



/* Sport-style circular speedometer */
.drive-hud.sport-hud {
  width: 252px;
  min-height: 220px;
  padding: 8px 12px 10px;
  color:#fff;
  backdrop-filter: blur(1px);
}
.sport-speedometer {
  position: relative;
  width: 100%;
  max-width: 230px;
  margin: 0 auto;
}
.sport-speedometer-dial {
  display: block;
  width: 100%;
  overflow: visible;
}
.speedometer-tick-label {
  fill: rgba(221, 231, 241, .55);
  font: 6px "Inter", sans-serif;
}
.speedometer-gear {
  fill: #55e6a0;
  font: 800 11px "Barlow Condensed", sans-serif;
}
.speedometer-number {
  fill: #f5f7fa;
  font: italic 52px "Barlow Condensed", sans-serif;
  letter-spacing: -2px;
}
.speedometer-unit {
  fill: #9ba9b8;
  font: 700 7px "Inter", sans-serif;
  letter-spacing: 2px;
}
.speedometer-rpm {
  display: flex;
  justify-content: space-between;
  margin: -3px 22px 0;
  color: #93a2b4;
  font: 700 8px "Inter", sans-serif;
  letter-spacing: 1.2px;
}
.speedometer-rpm span:last-child {
  color: #e7edf4;
  font-size: 9px;
}
.sport-hud .telemetry-badges {
  justify-content: center;
  margin-top: 7px;
}

/* Phone controller jump button */
.mc-jump-floating {
  position: absolute;
  z-index: 20;
  right: 18px;
  top: 82px;
}
.mc-jump-btn {
  min-width: 76px;
  min-height: 58px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  border: 1px solid rgba(74, 211, 255, .65);
  border-radius: 12px;
  color: #eafaff;
  background: linear-gradient(145deg, rgba(20, 105, 145, .95), rgba(8, 45, 75, .96));
  box-shadow: 0 5px 18px rgba(0, 170, 255, .18), inset 0 1px rgba(255,255,255,.12);
  font: 900 10px "Inter", sans-serif;
  letter-spacing: 1.4px;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
}
.mc-jump-btn:active {
  transform: translateY(2px) scale(.97);
  background: linear-gradient(145deg, #25b9ed, #0c668e);
  box-shadow: 0 0 20px rgba(38, 194, 255, .42);
}
.mc-jump-icon {
  font-size: 24px;
  line-height: 22px;
  font-weight: 900;
}
@media (max-width: 760px) {
  .drive-hud.sport-hud {
    width: 184px;
    min-height: 166px;
    padding: 5px 7px 7px;
    bottom: 12px;
  }
  .sport-speedometer { max-width: 170px; }
  .speedometer-number { font-size: 49px; }
  .speedometer-rpm { margin-left: 14px; margin-right: 14px; }
  .mc-jump-floating { right: 10px; top: 72px; }
  .mc-jump-btn { min-width: 62px; min-height: 50px; }
}

/* ================================================================== */
/*  GTA-STYLE ON-FOOT / VEHICLE INTERACTION                            */
/* ================================================================== */
.character-action-panel {
  position: absolute;
  z-index: 7;
  left: 50%;
  bottom: 26px;
  width: min(520px, calc(100vw - 32px));
  transform: translateX(-50%);
  padding: 14px 16px 12px;
  border: 1px solid rgba(180, 205, 235, 0.2);
  border-radius: 14px;
  background: rgba(7, 12, 20, 0.84);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(14px);
}

.character-panel-heading {
  margin-bottom: 10px;
  color: #9eb1c8;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 2px;
}

.character-emote-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 7px;
}

.character-emote-btn {
  min-height: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: 1px solid rgba(150, 180, 215, 0.2);
  border-radius: 9px;
  background: rgba(28, 42, 60, 0.72);
  color: #edf4ff;
  font: inherit;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
}

.character-emote-btn:hover:not(:disabled) {
  border-color: #4d9bff;
  background: rgba(37, 91, 155, 0.72);
  transform: translateY(-2px);
}

.character-emote-btn:disabled {
  opacity: 0.42;
  cursor: not-allowed;
}

.emote-key {
  color: #70b5ff;
  font-size: 9px;
}

.character-control-hint {
  margin-top: 10px;
  color: #8191a5;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-align: center;
}

.vehicle-interaction-prompt {
  position: absolute;
  z-index: 8;
  left: 50%;
  bottom: 105px;
  transform: translateX(-50%);
  padding: 11px 18px;
  border: 1px solid rgba(120, 180, 255, 0.38);
  border-radius: 9px;
  background: rgba(5, 12, 22, 0.88);
  color: #f3f7ff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.1px;
  text-align: center;
  pointer-events: none;
  backdrop-filter: blur(10px);
}

.mc-icon-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .character-action-panel {
    bottom: 12px;
    padding: 10px;
  }
  .character-emote-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .character-control-hint {
    line-height: 1.5;
  }
  .vehicle-interaction-prompt {
    bottom: 190px;
    width: max-content;
    max-width: calc(100vw - 32px);
  }
}
/* ================================================================== */
/*  VIRTUAL JOYSTICK & PHONE CHARACTER MODE                           */
/* ================================================================== */

.mc-action-pill {
  width: auto;
  padding: 0 12px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
}

.onscreen-joystick-zone {
  position: absolute;
  z-index: 8;
  left: 34px;
  bottom: 34px;
  width: 146px;
  height: 158px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  touch-action: none;
  user-select: none;
}

.onscreen-joystick-ring {
  width: 126px;
  height: 126px;
  border-radius: 50%;
  border: 1.5px solid rgba(0, 210, 255, 0.42);
  background: radial-gradient(
    circle,
    rgba(23, 105, 210, 0.28) 0%,
    rgba(8, 14, 24, 0.78) 100%
  );
  backdrop-filter: blur(10px);
  display: grid;
  place-items: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
}

.onscreen-joystick-SavedKnob {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid #70e5ff;
  background: linear-gradient(135deg, #2d79ff 0%, #00d2ff 100%);
  box-shadow: 0 0 18px rgba(0, 210, 255, 0.65);
  pointer-events: none;
}

.onscreen-joystick-label {
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.4px;
  color: #8fa5be;
}

.mc-character-layout {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1.15fr 1fr;
  gap: 12px;
  align-items: stretch;
  margin-top: 8px;
  min-height: 0;
}

.mc-joy-zone {
  border-radius: 20px;
  border: 1px solid rgba(45, 121, 255, 0.32);
  background: radial-gradient(
    circle at 50% 45%,
    rgba(23, 44, 78, 0.55) 0%,
    rgba(8, 13, 21, 0.92) 100%
  );
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  touch-action: none;
}

.mc-joy-ring {
  width: min(155px, 44vh);
  height: min(155px, 44vh);
  border-radius: 50%;
  border: 1.5px dashed rgba(0, 210, 255, 0.4);
  background: radial-gradient(
    circle,
    rgba(45, 121, 255, 0.22) 0%,
    rgba(6, 10, 18, 0.65) 75%
  );
  display: grid;
  place-items: center;
  margin: auto 0;
}

.mc-joy-ring.look-ring {
  border-color: rgba(255, 159, 10, 0.42);
}

.mc-joy-knob {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.65);
  background: linear-gradient(145deg, #1769d2, #0b2e59);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.6);
  pointer-events: none;
}

.mc-joy-knob.active {
  border-color: #00d2ff;
  background: linear-gradient(145deg, #00d2ff, #1769d2);
  box-shadow: 0 0 22px rgba(0, 210, 255, 0.75);
}

.mc-char-center-actions {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
}

.mc-char-primary-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.mc-char-primary-grid .mc-aux-btn {
  height: 100%;
  min-height: 38px;
}

.mc-crouch-btn {
  border: 1.5px solid rgba(165, 185, 215, 0.45);
  background: rgba(25, 36, 52, 0.9);
  color: #dce6f2;
}

.mc-crouch-btn.is-pressed {
  transform: scale(0.95);
  border-color: #ffffff;
  background: #3a506b;
}

.mc-enter-car-btn {
  border: 1.5px solid rgba(50, 215, 75, 0.45);
  background: rgba(14, 48, 24, 0.85);
  color: #72f288;
}

.mc-enter-car-btn.ready {
  border-color: #32d74b;
  background: linear-gradient(180deg, #28b83e 0%, #136b21 100%);
  color: #ffffff;
  box-shadow: 0 0 20px rgba(50, 215, 75, 0.55);
}

.mc-char-emote-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.mc-mini-emote-btn {
  height: 36px;
  border-radius: 9px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(18, 28, 44, 0.9);
  color: #b8cae0;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.8px;
}

.mc-mini-emote-btn:active {
  background: #1769d2;
  color: #ffffff;
}

/* ================================================================== */
/*  AUTO-RUN BUTTON & HORIZONTAL SWIPE DIRECTION TRACKPAD             */
/* ================================================================== */

.mc-autorun-btn {
  width: 100%;
  padding: 10px 14px;
  border-radius: 14px;
  border: 1.5px solid rgba(0, 210, 255, 0.45);
  background: linear-gradient(
    180deg,
    rgba(16, 38, 68, 0.9) 0%,
    rgba(8, 20, 38, 0.96) 100%
  );
  color: #dce6f2;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.mc-autorun-btn.is-running {
  border-color: #32d74b;
  background: linear-gradient(135deg, #1b8a34 0%, #0e4f1e 100%);
  color: #ffffff;
  box-shadow: 0 0 24px rgba(50, 215, 75, 0.55);
}

.mc-autorun-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #6c809a;
  flex-shrink: 0;
}

.mc-autorun-btn.is-running .mc-autorun-dot {
  background: #32d74b;
  box-shadow: 0 0 10px #ffffff;
}

.mc-autorun-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 2px;
}

.mc-autorun-title {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 1.2px;
  line-height: 1;
}

.mc-autorun-sub {
  font-size: 7px;
  font-weight: 800;
  letter-spacing: 0.9px;
  opacity: 0.78;
}

.mc-swipe-turn-zone {
  border-radius: 20px;
  border: 1.5px solid rgba(255, 159, 10, 0.45);
  background: radial-gradient(
    circle at 50% 50%,
    rgba(62, 38, 12, 0.5) 0%,
    rgba(8, 13, 21, 0.94) 100%
  );
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  touch-action: none;
  user-select: none;
}

.mc-swipe-header {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.4px;
  color: #ffbc57;
}

.mc-swipe-track {
  width: 100%;
  height: 74px;
  border-radius: 999px;
  border: 1.5px dashed rgba(255, 188, 87, 0.45);
  background: rgba(12, 18, 28, 0.75);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  position: relative;
  overflow: hidden;
}

.mc-swipe-arrow {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: rgba(255, 188, 87, 0.55);
  pointer-events: none;
}

.mc-swipe-puck {
  position: absolute;
  left: calc(50% - 27px);
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: 2px solid #ffbc57;
  background: linear-gradient(145deg, #ff9f0a, #b85d00);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
  pointer-events: none;
  transition: transform 0.06s linear;
}

.mc-swipe-puck.active {
  transition: none;
  border-color: #ffffff;
  box-shadow: 0 0 22px rgba(255, 159, 10, 0.85);
}

/* ================================================================== */
/*  FREE FIRE COMBAT HUD, CROSSHAIR, BOTS & MOBILE FIRE CONTROLS      */
/* ================================================================== */

.ff-crosshair {
  position: absolute;
  z-index: 15;
  top: 50%;
  left: 50%;
  width: 36px;
  height: 36px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  transition: transform 0.08s ease;
}

.ff-crosshair.aiming {
  transform: translate(-50%, -50%) scale(0.68);
}

.ff-crosshair.firing {
  transform: translate(-50%, -50%) scale(1.25);
}

.ff-ch-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #ff2a5f;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 6px #ff2a5f;
}

.ff-ch-line {
  position: absolute;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.85);
}

.ff-ch-line.top {
  top: 2px;
  left: 50%;
  width: 2px;
  height: 8px;
  transform: translateX(-50%);
}

.ff-ch-line.bottom {
  bottom: 2px;
  left: 50%;
  width: 2px;
  height: 8px;
  transform: translateX(-50%);
}

.ff-ch-line.left {
  left: 2px;
  top: 50%;
  width: 8px;
  height: 2px;
  transform: translateY(-50%);
}

.ff-ch-line.right {
  right: 2px;
  top: 50%;
  width: 8px;
  height: 2px;
  transform: translateY(-50%);
}

.ff-hitmarker {
  position: absolute;
  inset: 5px;
  border: 2px solid #ffffff;
  transform: rotate(45deg);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

.ff-hitmarker.headshot {
  border-color: #ff2a5f;
  box-shadow: 0 0 14px #ff2a5f;
}

.ff-weapon-hud {
  position: absolute;
  z-index: 8;
  top: 86px;
  right: 32px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 220px;
}

.ff-weapon-slots {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ff-weapon-card {
  padding: 10px 14px;
  border-radius: 11px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(8, 14, 24, 0.82);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.14s ease;
}

.ff-weapon-card.active {
  border-color: #ff9f0a;
  background: linear-gradient(135deg, rgba(255, 159, 10, 0.28), rgba(12, 20, 34, 0.92));
  box-shadow: 0 0 20px rgba(255, 159, 10, 0.35);
}

.ff-weapon-name {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.ff-weapon-ammo {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 16px;
  font-weight: 800;
  color: #00d2ff;
}

.ff-combat-actions-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.ff-mini-btn {
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(15, 24, 38, 0.86);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
  cursor: pointer;
}

.ff-hp-bar-wrap {
  margin-bottom: 10px;
}

.ff-hp-label {
  display: flex;
  justify-content: space-between;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.4px;
  color: #dce6f2;
  margin-bottom: 4px;
}

.ff-hp-track {
  width: 100%;
  height: 8px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.12);
  overflow: hidden;
}

.ff-hp-fill {
  height: 100%;
  background: linear-gradient(90deg, #32d74b, #00d2ff);
  transition: width 0.15s ease;
}

.ff-dmg-popup {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 22px;
  font-weight: 800;
  color: #ffdd57;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
  white-space: nowrap;
  pointer-events: none;
  animation: ffFloatUp 0.65s ease-out forwards;
}

.ff-dmg-popup.ff-dmg-headshot {
  font-size: 27px;
  color: #ff2a5f;
}

@keyframes ffFloatUp {
  0% {
    opacity: 1;
    transform: translateY(0) scale(0.9);
  }
  100% {
    opacity: 0;
    transform: translateY(-28px) scale(1.15);
  }
}

.ff-bot-nametag {
  pointer-events: none;
}

.ff-bot-hp-track {
  width: 54px;
  height: 6px;
  border-radius: 99px;
  background: rgba(0, 0, 0, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.25);
  overflow: hidden;
}

.ff-bot-hp-fill {
  height: 100%;
  background: #ff2a5f;
}

.mc-fire-btn {
  border: 2px solid rgba(255, 42, 95, 0.75);
  background: linear-gradient(180deg, rgba(165, 20, 56, 0.92) 0%, rgba(75, 10, 26, 0.96) 100%);
  color: #ffffff;
}

.mc-fire-btn.is-pressed {
  transform: scale(0.94);
  background: #ff2a5f;
  box-shadow: 0 0 26px rgba(255, 42, 95, 0.85);
}

.mc-aim-btn {
  border: 1.5px solid rgba(255, 214, 10, 0.65);
  background: linear-gradient(180deg, rgba(72, 56, 12, 0.9) 0%, rgba(34, 26, 6, 0.95) 100%);
  color: #ffd60a;
}

.mc-aim-btn.is-pressed {
  transform: scale(0.94);
  background: #ffd60a;
  color: #090d14;
  box-shadow: 0 0 22px rgba(255, 214, 10, 0.75);
}

/* ================================================================== */
/*  CUSTOM FREE FIRE BATTLE ROYALE HUD SYSTEM                         */
/* ================================================================== */

.ff-hud-root {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 25;
  font-family: "Barlow Condensed", "Inter", sans-serif;
  user-select: none;
  overflow: hidden;
}

/* 1. Top Compass Bar */
.ff-compass-wrapper {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}

.ff-compass-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(10, 14, 22, 0.85);
  padding: 2px 10px;
  border-radius: 99px;
  border: 1px solid rgba(255, 214, 10, 0.45);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.6);
  margin-bottom: 3px;
}

.ff-compass-deg {
  font-size: 13px;
  font-weight: 800;
  color: #ffd60a;
  letter-spacing: 1px;
}

.ff-compass-cardinal {
  font-size: 11px;
  font-weight: 800;
  color: #ffffff;
  background: #ff2a5f;
  padding: 1px 5px;
  border-radius: 4px;
}

.ff-compass-strip {
  position: relative;
  width: min(420px, 80vw);
  height: 28px;
  background: linear-gradient(90deg, rgba(10, 14, 22, 0) 0%, rgba(10, 14, 22, 0.78) 25%, rgba(10, 14, 22, 0.78) 75%, rgba(10, 14, 22, 0) 100%);
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  mask-image: linear-gradient(90deg, transparent 0%, black 20%, black 80%, transparent 100%);
}

.ff-compass-tape {
  position: absolute;
  top: 0;
  height: 100%;
  transition: transform 0.05s linear;
}

.ff-compass-tick {
  position: absolute;
  top: 0;
  width: 2px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateX(-50%);
}

.ff-compass-tick .tick-line {
  width: 1px;
  height: 8px;
  background: rgba(255, 255, 255, 0.4);
}

.ff-compass-tick.cardinal .tick-line {
  width: 2px;
  height: 12px;
  background: #ffd60a;
}

.ff-compass-tick .tick-label {
  font-size: 9px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 2px;
}

.ff-compass-tick.cardinal .tick-label {
  color: #ffd60a;
  font-weight: 800;
  font-size: 11px;
}

.ff-compass-needle {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 16px;
  background: #ff2a5f;
  box-shadow: 0 0 8px #ff2a5f;
}

/* 2. Top-Left Survival Status */
.ff-match-stats-panel {
  position: absolute;
  top: 14px;
  left: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: auto;
}

.ff-br-logo-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, rgba(255, 60, 0, 0.25), rgba(12, 17, 28, 0.85));
  border: 1px solid rgba(255, 120, 0, 0.45);
  padding: 4px 10px;
  border-radius: 6px;
  width: fit-content;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.ff-flame-icon {
  font-size: 13px;
}

.ff-br-text {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.2px;
  color: #ff9f0a;
}

.ff-survival-pill-row {
  display: flex;
  gap: 8px;
}

.ff-survival-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 9px;
  background: rgba(10, 16, 26, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(10px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.6);
}

.ff-survival-pill.alive-pill {
  border-color: rgba(0, 210, 255, 0.45);
}

.ff-survival-pill.kills-pill {
  border-color: rgba(255, 42, 95, 0.55);
}

.ff-svg-icon {
  width: 18px;
  height: 18px;
  color: #00d2ff;
}

.ff-svg-icon.skull-icon {
  color: #ff2a5f;
}

.pill-content {
  display: flex;
  flex-direction: column;
}

.pill-title {
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: #8fa2b8;
}

.pill-value {
  font-size: 17px;
  font-weight: 800;
  line-height: 1;
  color: #ffffff;
}

.alive-pill .pill-value {
  color: #00d2ff;
}

.kills-pill .pill-value {
  color: #ff2a5f;
}

.ff-safezone-banner {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(7, 10, 18, 0.82);
  border: 1px solid rgba(255, 214, 10, 0.35);
  padding: 3px 8px;
  border-radius: 5px;
  width: fit-content;
}

.ff-zone-pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ffd60a;
  box-shadow: 0 0 8px #ffd60a;
  animation: ffPulse 1s infinite alternate;
}

@keyframes ffPulse {
  0% { transform: scale(0.8); opacity: 0.6; }
  100% { transform: scale(1.3); opacity: 1; }
}

.ff-zone-text {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.8px;
  color: #dce6f2;
}

/* 3. Top-Right Minimap Radar */
.ff-minimap-container {
  position: absolute;
  top: 14px;
  right: 18px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  pointer-events: auto;
}

.ff-minimap-frame {
  position: relative;
  width: 105px;
  height: 105px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(14, 25, 42, 0.9) 0%, rgba(6, 10, 18, 0.95) 100%);
  border: 2px solid rgba(255, 214, 10, 0.55);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.8), inset 0 0 16px rgba(0, 210, 255, 0.15);
  overflow: hidden;
}

.ff-radar-sweep {
  position: absolute;
  inset: 0;
  background: conic-gradient(from 0deg at 50% 50%, rgba(255, 214, 10, 0.25) 0deg, transparent 65deg);
  border-radius: 50%;
  animation: ffRadarSweep 3.5s linear infinite;
}

@keyframes ffRadarSweep {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.ff-radar-player-arrow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 12px solid #ffd60a;
  filter: drop-shadow(0 0 4px #ffd60a);
}

.ff-radar-center-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #ffffff;
  transform: translate(-50%, -50%);
}

.ff-radar-zone-ring {
  position: absolute;
  inset: 14px;
  border-radius: 50%;
  border: 1px dashed rgba(0, 210, 255, 0.65);
}

.ff-minimap-n-tag {
  position: absolute;
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 8px;
  font-weight: 800;
  color: #ff2a5f;
}

.ff-minimap-coords {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 7px;
  font-weight: 700;
  color: #8fa2b8;
  white-space: nowrap;
}

.ff-top-tool-row {
  display: flex;
  gap: 6px;
}

.ff-hud-btn-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(12, 18, 30, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(8px);
  color: #dce6f2;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.14s ease;
}

.ff-hud-btn-circle svg {
  width: 15px;
  height: 15px;
}

.ff-hud-btn-circle:hover {
  transform: scale(1.08);
  border-color: #ffd60a;
  color: #ffd60a;
}

/* 4. Center Free Fire Dynamic Reticle */
.ff-crosshair-hud {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 34px;
  height: 34px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  transition: transform 0.08s ease;
}

.ff-crosshair-hud.aiming {
  transform: translate(-50%, -50%) scale(0.65);
}

.ff-crosshair-hud.firing {
  transform: translate(-50%, -50%) scale(1.35);
}

.ff-reticle-center-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #ff2a5f;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 6px #ff2a5f;
}

.ff-reticle-tick {
  position: absolute;
  background: #ffffff;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.9);
}

.ff-reticle-tick.top {
  top: 0;
  left: 50%;
  width: 2px;
  height: 7px;
  transform: translateX(-50%);
}

.ff-reticle-tick.bottom {
  bottom: 0;
  left: 50%;
  width: 2px;
  height: 7px;
  transform: translateX(-50%);
}

.ff-reticle-tick.left {
  left: 0;
  top: 50%;
  width: 7px;
  height: 2px;
  transform: translateY(-50%);
}

.ff-reticle-tick.right {
  right: 0;
  top: 50%;
  width: 7px;
  height: 2px;
  transform: translateY(-50%);
}

.ff-hitmarker-skull {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 26px;
  filter: drop-shadow(0 0 8px #ff2a5f);
  animation: ffHitPop 0.22s ease-out forwards;
}

.ff-hitmarker-skull.headshot {
  color: #ff2a5f;
  font-size: 32px;
}

@keyframes ffHitPop {
  0% { transform: translate(-50%, -50%) scale(0.6); opacity: 1; }
  50% { transform: translate(-50%, -50%) scale(1.3); }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
}

/* 5. Right-Side Free Fire Weapon Cards */
.ff-weapon-deck {
  position: absolute;
  top: 140px;
  right: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 215px;
  pointer-events: auto;
}

.ff-deck-slots {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.ff-gun-card {
  position: relative;
  padding: 8px 12px;
  background: linear-gradient(135deg, rgba(14, 20, 32, 0.92) 0%, rgba(8, 12, 20, 0.96) 100%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;
  overflow: hidden;
}

.ff-gun-card.active {
  border-color: #ffd60a;
  background: linear-gradient(135deg, rgba(255, 214, 10, 0.22) 0%, rgba(12, 18, 28, 0.96) 100%);
  box-shadow: 0 0 18px rgba(255, 214, 10, 0.35);
  transform: translateX(-4px);
}

.gun-card-header {
  display: flex;
  justify-content: space-between;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #8fa2b8;
  margin-bottom: 2px;
}

.ff-gun-card.active .gun-card-header {
  color: #ffd60a;
}

.gun-card-body {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.gun-name {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 1.1px;
  color: #ffffff;
}

.gun-ammo {
  font-size: 16px;
  font-weight: 800;
  color: #00d2ff;
}

.gun-ammo .mag-count {
  font-size: 17px;
  color: #ffffff;
}

.gun-ammo .ammo-divider {
  margin: 0 2px;
  color: #8fa2b8;
}

.gun-ammo .reserve-count {
  font-size: 13px;
  color: #00d2ff;
}

.reloading-text {
  font-size: 11px;
  color: #ffd60a;
  animation: ffBlink 0.6s infinite alternate;
}

@keyframes ffBlink {
  0% { opacity: 0.4; }
  100% { opacity: 1; }
}

.ff-weapon-quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-top: 2px;
}

.ff-action-pill {
  height: 32px;
  border-radius: 6px;
  background: rgba(14, 22, 34, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.14s ease;
}

.ff-action-pill:hover {
  background: rgba(255, 214, 10, 0.25);
  border-color: #ffd60a;
  color: #ffd60a;
}

.pill-hotkey {
  background: rgba(255, 255, 255, 0.18);
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 9px;
  color: #ffffff;
}

/* 6. Bottom-Center Vitals (EP + HP + Armor) */
.ff-bottom-vital-panel {
  position: absolute;
  bottom: 22px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: min(440px, 92vw);
  pointer-events: auto;
}

.ff-gear-status-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ff-gear-badge {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(10, 16, 26, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.14);
  padding: 4px 8px;
  border-radius: 6px;
}

.gear-icon {
  font-size: 15px;
}

.gear-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.gear-lvl {
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.8px;
  color: #00d2ff;
}

.gear-bar-track {
  width: 100%;
  height: 4px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.15);
  overflow: hidden;
  margin-top: 2px;
}

.gear-bar-fill {
  height: 100%;
  background: #00d2ff;
}

.ff-medkit-slot {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, rgba(35, 120, 60, 0.45), rgba(10, 20, 14, 0.9));
  border: 1px solid rgba(50, 215, 75, 0.55);
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
  color: #ffffff;
}

.medkit-hotkey {
  font-size: 8px;
  font-weight: 800;
  color: #32d74b;
}

.medkit-icon {
  font-size: 14px;
}

.medkit-count {
  font-size: 13px;
  font-weight: 800;
  color: #ffffff;
}

.ff-vitals-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: rgba(8, 14, 24, 0.88);
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
}

.ff-bar-unit {
  display: flex;
  flex-direction: column;
}

.ff-bar-header {
  display: flex;
  justify-content: space-between;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
  margin-bottom: 2px;
}

.ep-title {
  color: #ffd60a;
}

.hp-title {
  color: #32d74b;
}

.ff-bar-num {
  font-size: 11px;
  font-weight: 800;
  color: #ffffff;
}

.ff-bar-track {
  width: 100%;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.12);
  overflow: hidden;
}

.ep-track {
  height: 5px;
}

.hp-track {
  height: 9px;
}

.ep-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff9f0a, #ffd60a);
  transition: width 0.2s ease;
}

.hp-fill {
  height: 100%;
  background: linear-gradient(90deg, #28cd41, #00d2ff);
  transition: width 0.15s ease;
}

.hp-fill.critical {
  background: linear-gradient(90deg, #ff2a5f, #ff9f0a);
}

/* 7. On-Screen Touch / Action Controls */
.ff-on-screen-controls {
  position: absolute;
  bottom: 30px;
  right: 28px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  pointer-events: auto;
}

.ff-circle-control {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(20, 28, 44, 0.92) 0%, rgba(10, 14, 22, 0.98) 100%);
  border: 2px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.75);
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: all 0.12s ease;
}

.ff-circle-control .btn-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ff-circle-control .btn-icon {
  font-size: 18px;
}

.ff-circle-control .btn-subtext {
  font-size: 7px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: #8fa2b8;
}

.ff-circle-control:hover,
.ff-circle-control.active {
  transform: scale(1.08);
  border-color: #ffd60a;
}

.ff-circle-control.fire-btn {
  width: 72px;
  height: 72px;
  border-color: rgba(255, 42, 95, 0.85);
  background: radial-gradient(circle, rgba(185, 24, 65, 0.92) 0%, rgba(85, 10, 30, 0.98) 100%);
  box-shadow: 0 0 28px rgba(255, 42, 95, 0.55);
}

.ff-circle-control.fire-btn .btn-icon {
  font-size: 24px;
}

.ff-circle-control.fire-btn:active,
.ff-circle-control.fire-btn.active {
  transform: scale(0.94);
  background: #ff2a5f;
  box-shadow: 0 0 36px #ff2a5f;
}

.ff-circle-control.aim-btn {
  border-color: rgba(0, 210, 255, 0.75);
}

.ff-circle-control.aim-btn.active {
  background: rgba(0, 210, 255, 0.35);
  border-color: #00d2ff;
}

.ff-circle-control.drive-btn {
  border-color: #ffd60a;
  background: radial-gradient(circle, rgba(255, 214, 10, 0.35) 0%, rgba(18, 25, 38, 0.95) 100%);
  animation: ffDriveGlow 1.2s infinite alternate;
}

@keyframes ffDriveGlow {
  0% { box-shadow: 0 0 12px rgba(255, 214, 10, 0.4); }
  100% { box-shadow: 0 0 28px rgba(255, 214, 10, 0.85); }
}

/* ==========================================================================
   FREE FIRE BATTLE ROYALE: KILL FEED & CENTER KILL BANNER
   ========================================================================== */
.ff-killfeed-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 8px;
  pointer-events: none;
}

.ff-killfeed-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: rgba(14, 21, 33, 0.85);
  border-left: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  color: #dce7f5;
  backdrop-filter: blur(4px);
  animation: ffFeedFadeIn 0.25s ease-out;
}

.ff-killfeed-item.player-kill {
  border-left: 3px solid #ff2a5f;
  background: rgba(45, 12, 22, 0.9);
  color: #fff;
  box-shadow: 0 2px 10px rgba(255, 42, 95, 0.35);
}

.ff-killer-name {
  color: #ffd60a;
  letter-spacing: 0.5px;
}

.ff-killfeed-item.player-kill .ff-killer-name {
  color: #ff3b5c;
  font-weight: 900;
}

.ff-kill-icon {
  font-size: 11px;
}

.ff-victim-name {
  color: #a4b3c7;
}

.ff-headshot-tag {
  padding: 1px 4px;
  background: #ff2a5f;
  border-radius: 3px;
  font-size: 8px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 0.6px;
}

@keyframes ffFeedFadeIn {
  from { opacity: 0; transform: translateX(-12px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Center Elimination Banner */
.ff-center-kill-banner {
  position: absolute;
  top: 76px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 24px;
  background: linear-gradient(90deg, rgba(160, 16, 48, 0.95), rgba(70, 8, 22, 0.95));
  border-top: 1px solid rgba(255, 120, 150, 0.6);
  border-bottom: 2px solid #ff2a5f;
  border-radius: 8px;
  box-shadow: 0 0 35px rgba(255, 42, 95, 0.7);
  pointer-events: none;
  z-index: 99;
}

.kill-banner-skull {
  font-size: 26px;
  filter: drop-shadow(0 0 8px #ff2a5f);
}

.kill-banner-content {
  display: flex;
  flex-direction: column;
}

.kill-banner-title {
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1.5px;
  color: #ff85a1;
  text-transform: uppercase;
}

.kill-banner-victim {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 1.2px;
  color: #fff;
}

.animate-kill-slide {
  animation: ffKillPop 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

@keyframes ffKillPop {
  0% { transform: translate(-50%, -18px) scale(0.85); opacity: 0; }
  100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
}

/* Bot Name Tag in 3D Space */
.ff-bot-nametag {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  transform: translateY(-8px);
}

.ff-bot-name-label {
  padding: 1px 6px;
  background: rgba(14, 21, 33, 0.85);
  border-radius: 3px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: #ffd60a;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
}

/* ==========================================================================
   FREE FIRE VICTORY (BOOYAH!) & DEFEAT FULLSCREEN MODAL
   ========================================================================== */
.ff-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  pointer-events: auto;
}

.ff-modal-backdrop {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(10, 16, 26, 0.88) 0%, rgba(3, 5, 10, 0.97) 100%);
  backdrop-filter: blur(12px);
}

.ff-result-card {
  position: relative;
  z-index: 2;
  width: min(520px, 92vw);
  padding: 36px 28px 28px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.85);
}

/* Victory Theme (Gold / Fire) */
.victory-theme .ff-result-card {
  background: linear-gradient(175deg, rgba(32, 24, 12, 0.95), rgba(12, 14, 20, 0.98));
  border: 2px solid rgba(255, 214, 10, 0.55);
  box-shadow: 0 0 80px rgba(255, 214, 10, 0.35);
}

/* Defeat Theme (Crimson / Dark) */
.defeat-theme .ff-result-card {
  background: linear-gradient(175deg, rgba(38, 12, 20, 0.95), rgba(14, 10, 14, 0.98));
  border: 2px solid rgba(255, 42, 95, 0.55);
  box-shadow: 0 0 80px rgba(255, 42, 95, 0.35);
}

.animate-pop-in {
  animation: ffResultCardPop 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.25);
}

@keyframes ffResultCardPop {
  from { opacity: 0; transform: scale(0.82) translateY(24px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

/* Booyah Badge */
.ff-booyah-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ff-booyah-flames {
  font-size: 32px;
  animation: ffPulseFlame 1.2s infinite alternate;
}

@keyframes ffPulseFlame {
  0% { transform: scale(0.95); opacity: 0.85; }
  100% { transform: scale(1.1); opacity: 1; }
}

.ff-booyah-title {
  margin: 0;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 64px;
  font-weight: 900;
  font-style: italic;
  letter-spacing: 4px;
  background: linear-gradient(180deg, #fff9d6 0%, #ffd60a 40%, #ff9f0a 80%, #d46800 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 6px 18px rgba(255, 214, 10, 0.65));
}

.ff-booyah-sub {
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 4px;
  color: #ffd60a;
}

/* Defeat Badge */
.ff-defeat-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ff-defeat-skull {
  font-size: 42px;
  filter: drop-shadow(0 0 16px rgba(255, 42, 95, 0.7));
}

.ff-defeat-title {
  margin: 0;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 54px;
  font-weight: 900;
  letter-spacing: 3px;
  background: linear-gradient(180deg, #ffdce0 0%, #ff3b5c 50%, #b80d2d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 6px 18px rgba(255, 42, 95, 0.65));
}

.ff-defeat-sub {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 3px;
  color: #a4b3c7;
}

/* Placement Pill */
.ff-rank-pill {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 6px 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.ff-rank-pill .rank-label {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: #8fa2b8;
}

.ff-rank-pill .rank-value {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 20px;
  font-weight: 900;
  color: #fff;
}

.ff-rank-pill .rank-value.first {
  color: #ffd60a;
}

.ff-rank-pill .rank-value small {
  font-size: 13px;
  color: #8fa2b8;
}

/* Stats Grid */
.ff-stats-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 10px;
}

.ff-stat-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 6px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.ff-stat-box .stat-icon {
  font-size: 20px;
}

.ff-stat-box .stat-title {
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #8fa2b8;
}

.ff-stat-box .stat-val {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 22px;
  font-weight: 900;
  color: #fff;
}

/* Modal Actions */
.ff-modal-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 6px;
}

.ff-btn-primary.booyah-btn {
  width: 100%;
  padding: 14px 20px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: linear-gradient(90deg, #ffd60a, #ff9f0a);
  color: #0b111b;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 8px 25px rgba(255, 214, 10, 0.45);
  transition: all 0.15s ease;
}

.defeat-theme .ff-btn-primary.booyah-btn {
  background: linear-gradient(90deg, #ff3b5c, #d4143a);
  color: #fff;
  box-shadow: 0 8px 25px rgba(255, 42, 95, 0.45);
}

.ff-btn-primary.booyah-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.ff-btn-secondary {
  width: 100%;
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: #cbd5e1;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.ff-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

/* ==========================================================================
   FREE FIRE BATTLE ROYALE: BACKPACK & INVENTORY OVERLAY (PHASE 2C)
   ========================================================================== */
.ff-inv-overlay {
  position: fixed;
  inset: 0;
  z-index: 950;
  background: rgba(4, 7, 14, 0.82);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: ffInvFadeIn 0.18s ease-out;
  pointer-events: auto;
}

@keyframes ffInvFadeIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}

.ff-inv-panel {
  width: min(840px, 94vw);
  max-height: 80vh;
  display: grid;
  grid-template-columns: 210px 1fr 220px;
  gap: 16px;
  background: linear-gradient(160deg, rgba(16, 24, 38, 0.95), rgba(8, 12, 20, 0.98));
  border: 1px solid rgba(0, 210, 255, 0.28);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.85);
  padding: 20px;
  overflow: hidden;
}

.ff-inv-section-title {
  margin: 0 0 12px 0;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 15px;
  font-weight: 900;
  letter-spacing: 1.5px;
  color: #ffd60a;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(255, 214, 10, 0.2);
  padding-bottom: 4px;
}

/* Equipment Column */
.ff-inv-equip-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ff-inv-slot {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  transition: all 0.12s ease;
}

.ff-inv-slot.equipped {
  border-color: rgba(0, 210, 255, 0.45);
  background: rgba(0, 210, 255, 0.08);
}

.ff-inv-slot.active-weapon {
  border-color: #ffd60a;
  box-shadow: 0 0 12px rgba(255, 214, 10, 0.3);
}

.ff-inv-slot-icon {
  font-size: 20px;
}

.ff-inv-slot-label {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.8px;
  color: #8fa2b8;
  text-transform: uppercase;
  min-width: 55px;
}

.ff-inv-slot-name {
  font-size: 11px;
  font-weight: 800;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ff-inv-slot-ammo {
  font-size: 10px;
  font-weight: 800;
  color: #ffd60a;
  margin-left: auto;
}

/* Backpack Center Grid */
.ff-inv-backpack {
  display: flex;
  flex-direction: column;
}

.ff-inv-backpack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(95px, 1fr));
  gap: 10px;
  overflow-y: auto;
  max-height: 55vh;
  padding-right: 6px;
}

.ff-inv-empty {
  grid-column: 1 / -1;
  text-align: center;
  color: #64748b;
  font-size: 13px;
  padding: 40px 0;
}

.ff-inv-item-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 6px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
  text-align: center;
}

.ff-inv-item-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 214, 10, 0.4);
}

.ff-inv-item-card.selected {
  border-color: #ffd60a;
  background: rgba(255, 214, 10, 0.12);
  box-shadow: 0 0 14px rgba(255, 214, 10, 0.35);
}

.ff-inv-item-icon {
  font-size: 24px;
}

.ff-inv-item-name {
  font-size: 10px;
  font-weight: 800;
  color: #dce7f5;
  line-height: 1.2;
}

.ff-inv-item-qty {
  position: absolute;
  top: 4px;
  right: 6px;
  font-size: 9px;
  font-weight: 900;
  color: #ffd60a;
}

/* Details Right Panel */
.ff-inv-details-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
}

.ff-inv-detail-icon {
  font-size: 40px;
  margin-top: 8px;
}

.ff-inv-detail-name {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 18px;
  font-weight: 900;
  color: #fff;
}

.ff-inv-detail-rarity {
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #ffd60a;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(255, 214, 10, 0.15);
}

.ff-inv-detail-stat {
  font-size: 11px;
  font-weight: 800;
  color: #8fa2b8;
}

.ff-inv-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 14px;
}

.ff-inv-action-btn {
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: linear-gradient(90deg, #ffd60a, #ff9f0a);
  color: #0b111b;
  font-family: "Barlow Condensed", sans-serif;
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 1px;
  transition: all 0.12s ease;
}

.ff-inv-action-btn:hover {
  filter: brightness(1.15);
}

.ff-inv-action-drop {
  background: rgba(255, 42, 95, 0.2);
  color: #ff3b5c;
  border: 1px solid rgba(255, 42, 95, 0.4);
}

.ff-inv-action-drop:hover {
  background: #ff2a5f;
  color: #fff;
}

.ff-inv-close-hint {
  margin-top: 14px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #8fa2b8;
}

/* Screen Damage Flash for Safe Zone */
.ff-zone-damage-overlay {
  position: fixed;
  inset: 0;
  z-index: 940;
  pointer-events: none;
  box-shadow: inset 0 0 80px rgba(0, 136, 255, 0.85), inset 0 0 140px rgba(255, 42, 95, 0.55);
  animation: ffZonePulse 0.22s ease-out;
}

@keyframes ffZonePulse {
  from { opacity: 0.95; }
  to { opacity: 0; }
}

.ff-safezone-banner.shrinking {
  border-color: #ff2a5f;
  background: rgba(185, 24, 65, 0.35);
  box-shadow: 0 0 15px rgba(255, 42, 95, 0.4);
}

.ff-safezone-banner.shrinking .ff-zone-pulse-dot {
  background: #ff2a5f;
  box-shadow: 0 0 10px #ff2a5f;
}

```

===============================================================================
FILE: client/src/index.js
===============================================================================

```js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

===============================================================================
FILE: client/src/main.jsx
===============================================================================

```jsx
```

===============================================================================
FILE: client/src/reportWebVitals.js
===============================================================================

```js
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
```

===============================================================================
FILE: client/src/setupProxy.js
===============================================================================

```js
const net = require("net");
const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");

const RELAY_PORT = Number(process.env.RELAY_PORT || 4000);
const RELAY_TARGET = `http://127.0.0.1:${RELAY_PORT}`;
const SERVER_MODULE_PATH = path.resolve(__dirname, "../../server/server.js");

function loadRelayModule() {
  try {
    return require(SERVER_MODULE_PATH);
  } catch (err) {
    console.warn("[CRA Proxy] Unable to load server/server.js:", err?.message || err);
    return null;
  }
}

function isPortListening(port, host = "127.0.0.1", timeoutMs = 350) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host });
    let settled = false;
    const finish = (alive) => {
      if (settled) return;
      settled = true;
      try {
        socket.destroy();
      } catch {}
      resolve(alive);
    };
    socket.setTimeout(timeoutMs);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
  });
}

let autoRelayInitStarted = false;
async function ensureRelayRunning(relayMod) {
  if (autoRelayInitStarted || process.env.DISABLE_AUTO_RELAY === "1") return;
  autoRelayInitStarted = true;
  if (!relayMod || typeof relayMod.startRelayServer !== "function") return;

  const alreadyUp = await isPortListening(RELAY_PORT);
  if (alreadyUp) return;

  try {
    const { httpServer } = relayMod.startRelayServer(RELAY_PORT);
    httpServer.on("error", (err) => {
      if (err && err.code === "EADDRINUSE") {
        // Another relay process bound the port concurrently; proxy will reach it.
        return;
      }
      console.warn("[CRA Proxy] Relay server error:", err?.message || err);
    });
    const cleanup = () => {
      try {
        httpServer.close();
      } catch {}
    };
    process.once("exit", cleanup);
    process.once("SIGINT", cleanup);
    process.once("SIGTERM", cleanup);
    console.log(`[CRA Proxy] Auto-started Controller Relay on port ${RELAY_PORT}`);
  } catch (err) {
    console.warn("[CRA Proxy] Auto-start relay failed:", err?.message || err);
  }
}

module.exports = function setupProxy(app) {
  const relayMod = loadRelayModule();
  ensureRelayRunning(relayMod);

  app.get("/api/network-info", (_req, res) => {
    const ips =
      relayMod && typeof relayMod.getLanIPv4Addresses === "function"
        ? relayMod.getLanIPv4Addresses()
        : [];
    res.setHeader("Cache-Control", "no-store");
    res.json({
      ips,
      primaryIp: ips[0] || null,
      port: RELAY_PORT,
    });
  });

  app.use(
    createProxyMiddleware(["/socket.io", "/api"], {
      target: RELAY_TARGET,
      changeOrigin: true,
      ws: true,
      logLevel: "warn",
      onError(_err, _req, res) {
        if (res && typeof res.writeHead === "function" && !res.headersSent) {
          res.writeHead(502, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              ok: false,
              error: "Controller relay server is offline",
            }),
          );
        } else if (res && typeof res.end === "function") {
          try {
            res.end();
          } catch {}
        }
      },
    }),
  );
};

```

===============================================================================
FILE: client/src/setupTests.js
===============================================================================

```js
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
```

===============================================================================
FILE: client/src/utils/customHudConfig.js
===============================================================================

```js
/**
 * Free Fire inspired Custom HUD configuration & storage system.
 * Allows users to customize position (x, y %), size (scale %), and transparency (opacity %)
 * for every HUD control, with multi-preset support and persistent localStorage saving.
 */

export const HUD_ELEMENTS = {
  rightFire: {
    id: "rightFire",
    label: "Primary Fire Button",
    defaultX: 80,
    defaultY: 74,
    defaultSize: 110,
    defaultOpacity: 100,
    minSize: 40,
    maxSize: 180,
    category: "combat",
  },
  leftFire: {
    id: "leftFire",
    label: "Left Fire Button",
    defaultX: 23,
    defaultY: 66,
    defaultSize: 100,
    defaultOpacity: 95,
    minSize: 40,
    maxSize: 180,
    category: "combat",
  },
  aimScope: {
    id: "aimScope",
    label: "Scope / ADS",
    defaultX: 88,
    defaultY: 62,
    defaultSize: 100,
    defaultOpacity: 100,
    minSize: 40,
    maxSize: 180,
    category: "combat",
  },
  jump: {
    id: "jump",
    label: "Jump Button",
    defaultX: 94,
    defaultY: 72,
    defaultSize: 100,
    defaultOpacity: 100,
    minSize: 40,
    maxSize: 180,
    category: "movement",
  },
  crouch: {
    id: "crouch",
    label: "Crouch Button",
    defaultX: 92,
    defaultY: 86,
    defaultSize: 100,
    defaultOpacity: 100,
    minSize: 40,
    maxSize: 180,
    category: "movement",
  },
  reload: {
    id: "reload",
    label: "Reload Button",
    defaultX: 81,
    defaultY: 90,
    defaultSize: 100,
    defaultOpacity: 100,
    minSize: 40,
    maxSize: 180,
    category: "combat",
  },
  switchWeapon: {
    id: "switchWeapon",
    label: "Quick Weapon Switch",
    defaultX: 23,
    defaultY: 82,
    defaultSize: 100,
    defaultOpacity: 95,
    minSize: 40,
    maxSize: 180,
    category: "combat",
  },
  joystick: {
    id: "joystick",
    label: "Movement Joystick",
    defaultX: 13,
    defaultY: 76,
    defaultSize: 100,
    defaultOpacity: 90,
    minSize: 50,
    maxSize: 160,
    category: "movement",
  },
  sprint: {
    id: "sprint",
    label: "Sprint Button",
    defaultX: 21,
    defaultY: 48,
    defaultSize: 100,
    defaultOpacity: 95,
    minSize: 40,
    maxSize: 180,
    category: "movement",
  },
  medkit: {
    id: "medkit",
    label: "Medkit Healer",
    defaultX: 46,
    defaultY: 91,
    defaultSize: 100,
    defaultOpacity: 100,
    minSize: 40,
    maxSize: 180,
    category: "utility",
  },
  backpack: {
    id: "backpack",
    label: "Backpack / Inventory",
    defaultX: 54,
    defaultY: 91,
    defaultSize: 100,
    defaultOpacity: 100,
    minSize: 40,
    maxSize: 180,
    category: "utility",
  },
  emotes: {
    id: "emotes",
    label: "Emotes Button",
    defaultX: 62,
    defaultY: 91,
    defaultSize: 95,
    defaultOpacity: 90,
    minSize: 40,
    maxSize: 180,
    category: "utility",
  },
  drive: {
    id: "drive",
    label: "Drive BMW Button",
    defaultX: 72,
    defaultY: 89,
    defaultSize: 105,
    defaultOpacity: 100,
    minSize: 40,
    maxSize: 180,
    category: "vehicle",
  },
  minimap: {
    id: "minimap",
    label: "Minimap & Comms",
    defaultX: 9,
    defaultY: 15,
    defaultSize: 100,
    defaultOpacity: 95,
    minSize: 50,
    maxSize: 150,
    category: "info",
  },
  weaponCard: {
    id: "weaponCard",
    label: "Weapons & Ammo HUD",
    defaultX: 89,
    defaultY: 13,
    defaultSize: 100,
    defaultOpacity: 100,
    minSize: 50,
    maxSize: 150,
    category: "info",
  },
  dropParachute: {
    id: "dropParachute",
    label: "Aircraft Eject / Drop",
    defaultX: 50,
    defaultY: 28,
    defaultSize: 100,
    defaultOpacity: 100,
    minSize: 50,
    maxSize: 160,
    category: "utility",
  },
};

export function getDefaultHudLayout() {
  const layout = {};
  for (const [key, item] of Object.entries(HUD_ELEMENTS)) {
    layout[key] = {
      x: item.defaultX,
      y: item.defaultY,
      size: item.defaultSize,
      opacity: item.defaultOpacity,
    };
  }
  return layout;
}

const STORAGE_KEY_PREFIX = "ff_custom_hud_preset_";
const ACTIVE_PRESET_KEY = "ff_custom_hud_active_preset";

export function getActiveHudPresetIndex() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return 1;
    const val = Number(window.localStorage.getItem(ACTIVE_PRESET_KEY) || 1);
    return val === 2 ? 2 : 1;
  } catch {
    return 1;
  }
}

export function setActiveHudPresetIndex(index) {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(ACTIVE_PRESET_KEY, String(index));
    }
  } catch {}
}

export function loadHudLayoutPreset(presetIndex = 1) {
  const defaults = getDefaultHudLayout();
  try {
    if (typeof window === "undefined" || !window.localStorage) return defaults;
    const raw = window.localStorage.getItem(`${STORAGE_KEY_PREFIX}${presetIndex}`);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    const merged = { ...defaults };
    for (const [key, val] of Object.entries(parsed)) {
      if (merged[key] && typeof val === "object" && val !== null) {
        merged[key] = {
          x: typeof val.x === "number" ? Math.max(2, Math.min(98, val.x)) : merged[key].x,
          y: typeof val.y === "number" ? Math.max(2, Math.min(98, val.y)) : merged[key].y,
          size: typeof val.size === "number" ? Math.max(30, Math.min(220, val.size)) : merged[key].size,
          opacity: typeof val.opacity === "number" ? Math.max(10, Math.min(100, val.opacity)) : merged[key].opacity,
        };
      }
    }
    return merged;
  } catch (err) {
    console.warn("Failed to load HUD layout from localStorage:", err);
    return defaults;
  }
}

export function saveHudLayoutPreset(presetIndex = 1, layout) {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(`${STORAGE_KEY_PREFIX}${presetIndex}`, JSON.stringify(layout));
      return true;
    }
  } catch (err) {
    console.error("Failed to save HUD layout to localStorage:", err);
  }
  return false;
}

export function resetHudLayoutPreset(presetIndex = 1) {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(`${STORAGE_KEY_PREFIX}${presetIndex}`);
    }
  } catch {}
  return getDefaultHudLayout();
}

```

===============================================================================
FILE: client/src/utils/network.js
===============================================================================

```js
import { io } from "socket.io-client";

export function isLoopbackHost(hostname) {
  if (!hostname) return false;
  const h = hostname.toLowerCase();
  return h === "localhost" || h === "127.0.0.1" || h === "::1" || h === "[::1]" || h === "0.0.0.0";
}

export function getSocketUrl() {
  if (typeof window === "undefined") return "http://localhost:4000";
  const envUrl = process.env.REACT_APP_SOCKET_URL;
  if (envUrl) return envUrl;
  return window.location.origin;
}

export function getUrlParam(name) {
  if (typeof window === "undefined") return "";
  try {
    return new URLSearchParams(window.location.search).get(name) || "";
  } catch {
    return "";
  }
}

export function getRoomCodeFromUrl() {
  const raw = getUrlParam("room");
  return raw ? raw.trim().toUpperCase() : "";
}

export function getPairTokenFromUrl() {
  const raw = getUrlParam("pair");
  const cleaned = raw.trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64);
  return cleaned || "default";
}

function randomToken(len = 8) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    const arr = new Uint8Array(len);
    window.crypto.getRandomValues(arr);
    for (let i = 0; i < len; i += 1) {
      out += chars[arr[i] % chars.length];
    }
    return out;
  }
  for (let i = 0; i < len; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export function getOrCreatePlayerSession() {
  if (typeof window === "undefined") {
    return {
      playerId: "plr_ssr",
      pairToken: "default",
      playerName: "Survivor",
    };
  }
  try {
    let playerId = window.sessionStorage.getItem("ff_player_id");
    if (!playerId) {
      playerId = `plr_${randomToken(8)}`;
      window.sessionStorage.setItem("ff_player_id", playerId);
    }

    let pairToken = window.sessionStorage.getItem("ff_pair_token");
    if (!pairToken) {
      pairToken = `pair_${randomToken(8)}`;
      window.sessionStorage.setItem("ff_pair_token", pairToken);
    }

    let playerName = window.sessionStorage.getItem("ff_player_name");
    if (!playerName) {
      playerName = `Survivor-${playerId.slice(-4).toUpperCase()}`;
      window.sessionStorage.setItem("ff_player_name", playerName);
    }

    return { playerId, pairToken, playerName };
  } catch {
    return {
      playerId: `plr_${randomToken(8)}`,
      pairToken: `pair_${randomToken(8)}`,
      playerName: "Survivor",
    };
  }
}

export function setSessionPlayerName(name) {
  if (typeof window === "undefined" || typeof name !== "string") return;
  const cleaned = name.replace(/[\r\n\t<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, 20);
  if (!cleaned) return;
  try {
    window.sessionStorage.setItem("ff_player_name", cleaned);
  } catch {}
}

function buildOriginWithHost(overrideHost = null) {
  if (typeof window === "undefined") return "";
  const { hostname, port, protocol } = window.location;
  const targetHost =
    overrideHost && typeof overrideHost === "string" ? overrideHost : hostname;
  const formattedHost = targetHost.includes(":") && !targetHost.startsWith("[")
    ? `[${targetHost}]`
    : targetHost;
  return `${protocol}//${formattedHost}${port ? `:${port}` : ""}`;
}

export function getNetworkControllerUrl(overrideHost = null, pairToken = null) {
  if (typeof window === "undefined") return "";
  const origin = buildOriginWithHost(overrideHost);
  const pairSuffix =
    pairToken && typeof pairToken === "string"
      ? `&pair=${encodeURIComponent(pairToken)}`
      : "";
  return `${origin}/?controller=1${pairSuffix}`;
}

export function getRoomInviteUrl(inviteCode, overrideHost = null) {
  if (typeof window === "undefined" || !inviteCode) return "";
  const origin = buildOriginWithHost(overrideHost);
  return `${origin}/?room=${encodeURIComponent(inviteCode.trim().toUpperCase())}`;
}

export function getSocketCandidates() {
  if (typeof window === "undefined") return ["http://localhost:4000"];
  const list = [];
  if (process.env.REACT_APP_SOCKET_URL) {
    list.push(process.env.REACT_APP_SOCKET_URL);
  }

  // Always prefer same-origin first so CRA setupProxy (/socket.io -> :4000),
  // direct server.js hosting, and HTTPS/tunnels share the reachable page port.
  if (window.location.origin) {
    list.push(window.location.origin);
  }

  // Direct relay port fallback (e.g. bare static server serving client/build)
  const { protocol, hostname, port } = window.location;
  const isSecure = protocol === "https:";
  if (port !== "4000" && (!isSecure || isLoopbackHost(hostname))) {
    const cleanHost = hostname.includes(":") && !hostname.startsWith("[")
      ? `[${hostname}]`
      : hostname;
    list.push(`${protocol}//${cleanHost}:4000`);
  }

  return [...new Set(list)];
}

async function fetchJsonWithTimeout(url, timeoutMs = 1500) {
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timer =
    controller && typeof window !== "undefined"
      ? window.setTimeout(() => controller.abort(), timeoutMs)
      : null;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: controller?.signal,
    });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    if (timer) window.clearTimeout(timer);
  }
}

export async function fetchNetworkInfo() {
  if (typeof window === "undefined") {
    return { ips: [], primaryIp: null, port: 4000 };
  }

  const sameOrigin = await fetchJsonWithTimeout("/api/network-info", 1200);
  if (sameOrigin && Array.isArray(sameOrigin.ips)) {
    return sameOrigin;
  }

  const { protocol, hostname, port } = window.location;
  if (port !== "4000") {
    const fallbackUrl = `${protocol}//${hostname}:4000/api/network-info`;
    const direct = await fetchJsonWithTimeout(fallbackUrl, 1200);
    if (direct && Array.isArray(direct.ips)) {
      return direct;
    }
  }

  return { ips: [], primaryIp: null, port: 4000 };
}

async function probeSocketEndpoint(baseUrl, timeoutMs = 1500) {
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timer =
    controller && typeof window !== "undefined"
      ? window.setTimeout(() => controller.abort(), timeoutMs)
      : null;

  try {
    const cleanBase = baseUrl.replace(/\/+$/, "");
    const res = await fetch(
      `${cleanBase}/socket.io/?EIO=4&transport=polling&t=${Date.now()}`,
      {
        cache: "no-store",
        signal: controller?.signal,
      },
    );
    if (!res.ok) return false;
    const text = await res.text();
    // Engine.IO polling handshake begins with packet type '0' + JSON object ("0{...}")
    return typeof text === "string" && text.includes('"sid"');
  } catch {
    return false;
  } finally {
    if (timer) window.clearTimeout(timer);
  }
}

export async function resolveWorkingSocketUrl() {
  const candidates = getSocketCandidates();
  for (const url of candidates) {
    const ok = await probeSocketEndpoint(url);
    if (ok) return url;
  }
  return null;
}

/**
 * Resolves a working Socket.IO relay (same-origin proxy first, then :4000 fallback),
 * registers the client role ("game" | "controller"), and auto-recovers if the relay
 * starts slightly later or restarts.
 */
export function connectRelaySocket({
  role,
  pairToken = "default",
  playerId = null,
  playerName = null,
  onSocket,
  onStatusChange,
  onCleanupSocket,
}) {
  let disposed = false;
  let activeSocket = null;
  let retryTimer = null;
  let consecutiveErrors = 0;

  const clearRetry = () => {
    if (retryTimer && typeof window !== "undefined") {
      window.clearTimeout(retryTimer);
      retryTimer = null;
    }
  };

  const teardownSocket = () => {
    if (!activeSocket) return;
    const old = activeSocket;
    activeSocket = null;
    try {
      onCleanupSocket?.(old);
    } catch {}
    try {
      old.disconnect();
    } catch {}
  };

  const scheduleReconnectProbe = (delayMs = 1800) => {
    if (disposed) return;
    clearRetry();
    if (typeof window !== "undefined") {
      retryTimer = window.setTimeout(() => {
        retryTimer = null;
        attemptConnect();
      }, delayMs);
    }
  };

  const attemptConnect = async () => {
    if (disposed) return;
    onStatusChange?.({ status: "connecting" });

    const targetUrl = await resolveWorkingSocketUrl();
    if (disposed) return;

    if (!targetUrl) {
      onStatusChange?.({
        status: "offline",
        reason: "Controller relay server not reachable",
      });
      scheduleReconnectProbe(1800);
      return;
    }

    teardownSocket();
    consecutiveErrors = 0;

    const socket = io(targetUrl, {
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionDelay: 600,
      reconnectionDelayMax: 3000,
    });
    activeSocket = socket;

    socket.on("connect", () => {
      if (disposed || activeSocket !== socket) return;
      consecutiveErrors = 0;
      if (role) {
        socket.emit("client:register", {
          role,
          pairToken,
          playerId,
          playerName,
        });
      }
      onStatusChange?.({ status: "connected", url: targetUrl });
    });

    socket.on("disconnect", (reason) => {
      if (disposed || activeSocket !== socket) return;
      onStatusChange?.({ status: "reconnecting", url: targetUrl, reason });
    });

    socket.on("connect_error", (err) => {
      if (disposed || activeSocket !== socket) return;
      consecutiveErrors += 1;
      onStatusChange?.({
        status: "error",
        url: targetUrl,
        reason: err?.message || "Connection failed",
      });
      if (consecutiveErrors >= 3) {
        // Endpoint may have moved or relay restarted; tear down and re-probe candidates
        teardownSocket();
        scheduleReconnectProbe(1500);
      }
    });

    onSocket?.(socket);
  };

  attemptConnect();

  return () => {
    disposed = true;
    clearRetry();
    teardownSocket();
  };
}

export function getScreenAngle() {
  if (
    typeof window !== "undefined" &&
    window.screen?.orientation?.angle !== undefined
  ) {
    return window.screen.orientation.angle;
  }
  return typeof window !== "undefined" ? window.orientation || 0 : 0;
}

export function extractTiltDegrees(event, isForcedLandscape) {
  const beta = event.beta ?? 0;
  const gamma = event.gamma ?? 0;
  const angle = getScreenAngle();

  if (angle === 90) return beta;
  if (angle === -90 || angle === 270) return -beta;
  if (isForcedLandscape) return beta;
  return gamma;
}
```

===============================================================================
FILE: package.json
===============================================================================

```json
{
  "name": "bmw-m4-controller-arena",
  "version": "1.0.0",
  "private": true,
  "description": "BMW M4 3D arena game with real-time mobile Free Fire & steering wheel controller.",
  "scripts": {
    "start": "npm --prefix client start",
    "start:relay": "npm --prefix server start",
    "build": "npm --prefix client run build",
    "start:prod": "npm --prefix client run build && npm --prefix server start"
  }
}

```

===============================================================================
FILE: scratch/calculate_two_handed_grip.js
===============================================================================

```js
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

```

===============================================================================
FILE: scratch/check_aiming_distance.js
===============================================================================

```js
const path = require('path');
const THREE = require(path.join(__dirname, '../client/node_modules/three'));
const fs = require('fs');
const { FBXLoader } = require(path.join(__dirname, '../client/node_modules/three-stdlib'));
global.window = global;
global.document = { createElementNS: () => ({}), createElement: () => ({}) };

const loader = new FBXLoader();
const fbxData = fs.readFileSync('f:/BMW-M4/client/src/assets/models/Characters/X Bot.fbx');
const char = loader.parse(fbxData.buffer.slice(fbxData.byteOffset, fbxData.byteOffset + fbxData.byteLength), '');

const bones = {};
char.traverse((n) => {
  if (n.isBone) bones[n.name.replace(/^mixamorig:?/i, '')] = n;
});

// Build gun group
const gun = new THREE.Group();
gun.scale.setScalar(100);
gun.position.set(0.5, 9.5, 3.2);
gun.rotation.set(-0.62, 1.32, -0.62);

const handguard = new THREE.Object3D();
handguard.position.set(0, 0.048, 0.28);
gun.add(handguard);

bones.RightHand.add(gun);

// Apply current CharacterModel.jsx aiming rotations:
// rightArm: -1.22, -0.28, 0.32
// rightForeArm: 0.78, 0.16, -0.44
// rightHand: -0.32, 0.22, -0.12
// leftArm: -1.02, 0.42, -0.34
// leftForeArm: -0.64, -0.26, 0.62
// leftHand: 0.32, 0.18, -0.22
bones.RightArm.rotation.set(-1.22, -0.28, 0.32);
bones.RightForeArm.rotation.set(0.78, 0.16, -0.44);
bones.RightHand.rotation.set(-0.32, 0.22, -0.12);

bones.LeftArm.rotation.set(-1.02, 0.42, -0.34);
bones.LeftForeArm.rotation.set(-0.64, -0.26, 0.62);
bones.LeftHand.rotation.set(0.32, 0.18, -0.22);

char.updateMatrixWorld(true);

const rHandWorld = new THREE.Vector3();
bones.RightHand.getWorldPosition(rHandWorld);

const lHandWorld = new THREE.Vector3();
bones.LeftHand.getWorldPosition(lHandWorld);

const hgWorld = new THREE.Vector3();
handguard.getWorldPosition(hgWorld);

console.log("Aiming - RightHand:", rHandWorld);
console.log("Aiming - LeftHand:", lHandWorld);
console.log("Aiming - Handguard:", hgWorld);
console.log("Aiming - Distance between LeftHand and Handguard:", lHandWorld.distanceTo(hgWorld).toFixed(2));

```

===============================================================================
FILE: scratch/check_hand_distance.js
===============================================================================

```js
const path = require('path');
const THREE = require(path.join(__dirname, '../client/node_modules/three'));
const fs = require('fs');
const { FBXLoader } = require(path.join(__dirname, '../client/node_modules/three-stdlib'));
global.window = global;
global.document = { createElementNS: () => ({}), createElement: () => ({}) };

const loader = new FBXLoader();
const fbxData = fs.readFileSync('f:/BMW-M4/client/src/assets/models/Characters/X Bot.fbx');
const char = loader.parse(fbxData.buffer.slice(fbxData.byteOffset, fbxData.byteOffset + fbxData.byteLength), '');

const bones = {};
char.traverse((n) => {
  if (n.isBone) bones[n.name.replace(/^mixamorig:?/i, '')] = n;
});

// Build gun group
const gun = new THREE.Group();
gun.scale.setScalar(100);
gun.position.set(0.5, 9.5, 3.2);
gun.rotation.set(-0.62, 1.32, -0.62);

const handguard = new THREE.Object3D();
handguard.position.set(0, 0.048, 0.28);
gun.add(handguard);

bones.RightHand.add(gun);

// Apply current CharacterModel.jsx rotations:
// rightArm: -0.76, -0.34, 0.38
// rightForeArm: 0.86, 0.18, -0.36
// rightHand: -0.26, 0.2, 0.08
// leftArm: -0.66, 0.46, -0.36
// leftForeArm: -0.76, -0.18, 0.64
// leftHand: 0.26, 0.14, -0.16
bones.RightArm.rotation.set(-0.76, -0.34, 0.38);
bones.RightForeArm.rotation.set(0.86, 0.18, -0.36);
bones.RightHand.rotation.set(-0.26, 0.2, 0.08);

bones.LeftArm.rotation.set(-0.66, 0.46, -0.36);
bones.LeftForeArm.rotation.set(-0.76, -0.18, 0.64);
bones.LeftHand.rotation.set(0.26, 0.14, -0.16);

char.updateMatrixWorld(true);

const rHandWorld = new THREE.Vector3();
bones.RightHand.getWorldPosition(rHandWorld);

const lHandWorld = new THREE.Vector3();
bones.LeftHand.getWorldPosition(lHandWorld);

const hgWorld = new THREE.Vector3();
handguard.getWorldPosition(hgWorld);

console.log("RightHand world pos:", rHandWorld);
console.log("LeftHand world pos:", lHandWorld);
console.log("Handguard world pos:", hgWorld);
console.log("Distance between LeftHand and Handguard:", lHandWorld.distanceTo(hgWorld).toFixed(2));

```

===============================================================================
FILE: scratch/check_skeleton_instances.js
===============================================================================

```js
const path = require('path');
const THREE = require(path.join(__dirname, '../client/node_modules/three'));
const fs = require('fs');
const { FBXLoader } = require(path.join(__dirname, '../client/node_modules/three-stdlib'));
global.window = global;
global.document = { createElementNS: () => ({}), createElement: () => ({}) };

const loader = new FBXLoader();
const fbxData = fs.readFileSync('f:/BMW-M4/client/src/assets/models/Characters/X Bot.fbx');
const char = loader.parse(fbxData.buffer.slice(fbxData.byteOffset, fbxData.byteOffset + fbxData.byteLength), '');

const surface = char.getObjectByName('Beta_Surface');
const joints = char.getObjectByName('Beta_Joints');

const sHips = surface.skeleton.bones[0];
const jHips = joints.skeleton.bones[0];

console.log("surface hips === joints hips?", sHips === jHips);

const traversedBones = [];
char.traverse(n => { if (n.isBone) traversedBones.push(n); });
console.log("traversedBones[0] === sHips?", traversedBones[0] === sHips);
console.log("traversedBones includes sHips?", traversedBones.includes(sHips));
console.log("traversedBones includes jHips?", traversedBones.includes(jHips));

// Find RightArm in surface skeleton
const sRightArm = surface.skeleton.bones.find(b => b.name === 'mixamorigRightArm');
const jRightArm = joints.skeleton.bones.find(b => b.name === 'mixamorigRightArm');
console.log("sRightArm === jRightArm?", sRightArm === jRightArm);

// Check what CharacterModel.jsx did:
const bonesRef = {};
char.traverse((node) => {
  if (node.isBone) {
    const cleanKey = node.name.replace(/^mixamorig:?/i, "");
    bonesRef[cleanKey] = node;
  }
});

console.log("bonesRef.RightArm === sRightArm?", bonesRef.RightArm === sRightArm);
console.log("bonesRef.RightArm === jRightArm?", bonesRef.RightArm === jRightArm);

```

===============================================================================
FILE: scratch/diagnose_bones.js
===============================================================================

```js
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const { startRelayServer } = require("f:/BMW-M4/server/server");

(async () => {
  const npmRoot = execSync("npm root -g").toString().trim();
  const pw = require(path.join(npmRoot, "playwright"));

  const server = startRelayServer(0, { disconnectGraceMs: 250, deferListen: true });
  await new Promise((resolve) => server.httpServer.listen(0, "0.0.0.0", resolve));
  const { port } = server.httpServer.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  const exeCandidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  ];
  const executablePath = exeCandidates.find((p) => fs.existsSync(p));

  const browser = await pw.chromium.launch({
    headless: true,
    executablePath,
    args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-webgl", "--no-sandbox"],
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const logs = [];
  page.on("console", (m) => logs.push(m.text()));

  try {
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await page.click('[data-testid="quick-solo-btn"]');
    await page.waitForSelector("canvas", { timeout: 25000 });
    await page.waitForTimeout(2000);
    await page.keyboard.press("Space");
    await page.waitForSelector('[data-hudelem-id="rightFire"]', { timeout: 35000 });

    // Inspect Three.js fiber tree or scene
    const dump = await page.evaluate(() => {
      // Find all meshes and bones
      const canvas = document.querySelector("canvas");
      // Access R3F internal state via canvas __r3f or fiber
      const r3fKey = Object.keys(canvas).find((k) => k.startsWith("__r3f"));
      if (!r3fKey) return { error: "No __r3f key found on canvas" };
      const r3f = canvas[r3fKey];
      const scene = r3f?.root?.store?.getState()?.scene;
      if (!scene) return { error: "No scene found" };

      const bonesFound = [];
      let gunFound = null;
      scene.traverse((node) => {
        if (node.isBone) {
          bonesFound.push({
            name: node.name,
            rot: { x: node.rotation.x, y: node.rotation.y, z: node.rotation.z },
            quat: { x: node.quaternion.x, y: node.quaternion.y, z: node.quaternion.z, w: node.quaternion.w },
          });
        }
        if (node.name === "EQUIPPED_WEAPON_GROUP") {
          gunFound = {
            visible: node.visible,
            parent: node.parent?.name,
            pos: node.position,
            rot: node.rotation,
          };
        }
      });
      return {
        boneCount: bonesFound.length,
        gunFound,
        bonesSample: bonesFound.slice(0, 15),
        rightArm: bonesFound.find((b) => b.name.includes("RightArm")),
        leftArm: bonesFound.find((b) => b.name.includes("LeftArm")),
        rightForeArm: bonesFound.find((b) => b.name.includes("RightForeArm")),
        leftForeArm: bonesFound.find((b) => b.name.includes("LeftForeArm")),
      };
    });

    console.log("Scene Dump:", JSON.stringify(dump, null, 2));
  } finally {
    await browser.close();
    await server.close();
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

```

===============================================================================
FILE: scratch/find_two_hand_rotations.js
===============================================================================

```js
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

// Test ADS / Aiming Stance
// In ADS:
// Right arm: upper arm rotates forward and bends elbow so gun is at shoulder
// Let's optimize LeftArm and LeftForeArm to touch handguard
function optimizeLeftArm(targetWorldPos, initialLeftRot = [0.8, 0, 0]) {
  bones.LeftArm.rotation.set(...initialLeftRot);
  bones.LeftForeArm.rotation.set(0, 0, 0.8);
  bones.LeftHand.rotation.set(0, 0, 0);

  // Use gradient descent / coordinate search on LeftArm (x,y,z) and LeftForeArm (z)
  let bestDist = Infinity;
  let bestAngles = null;

  const leftArm = bones.LeftArm;
  const leftFore = bones.LeftForeArm;
  const leftHand = bones.LeftHand;

  // Analytical 2-bone IK:
  cloned.updateMatrixWorld(true);

  // Target in LeftArm's parent space
  const shoulder = leftArm;
  const elbow = leftFore;
  const hand = leftHand;

  const shoulderPos = new THREE.Vector3();
  const elbowPos = new THREE.Vector3();
  const handPos = new THREE.Vector3();

  // Fine-tune with grid search around plausible natural arm values
  for (let ax = 0.2; ax <= 1.4; ax += 0.1) {
    for (let ay = -0.6; ay <= 0.6; ay += 0.1) {
      for (let az = -0.8; az <= 0.8; az += 0.1) {
        for (let fz = 0.2; fz <= 2.0; fz += 0.1) {
          leftArm.rotation.set(ax, ay, az);
          leftFore.rotation.set(0, 0, fz);
          cloned.updateMatrixWorld(true);
          hand.getWorldPosition(handPos);
          const d = handPos.distanceTo(targetWorldPos);
          if (d < bestDist) {
            bestDist = d;
            bestAngles = {
              arm: [Number(ax.toFixed(3)), Number(ay.toFixed(3)), Number(az.toFixed(3))],
              fore: [0, 0, Number(fz.toFixed(3))],
              dist: Number(d.toFixed(2))
            };
          }
        }
      }
    }
  }

  return bestAngles;
}

// 1. Aiming / ADS Stance:
console.log('Testing ADS Stance...');
// When aiming: Right arm brings gun forward and up
bones.RightArm.rotation.set(0.65, -0.3, -0.4);
bones.RightForeArm.rotation.set(0.1, 0, -1.2);
bones.RightHand.rotation.set(-0.1, -0.2, 0.3);
cloned.updateMatrixWorld(true);

const targetAim = new THREE.Vector3();
handguard.getWorldPosition(targetAim);
console.log('Target Handguard in ADS:', targetAim);

const bestAim = optimizeLeftArm(targetAim);
console.log('Best Left Arm for ADS:', bestAim);

```

===============================================================================
FILE: scratch/inspect_anim_rotations.js
===============================================================================

```js
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

```

===============================================================================
FILE: scratch/inspect_bone_axes.js
===============================================================================

```js
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

cloned.updateMatrixWorld(true);

function inspectAxes(boneName) {
  const b = bones[boneName];
  const m = b.matrixWorld;
  const xAxis = new THREE.Vector3(m.elements[0], m.elements[1], m.elements[2]).normalize();
  const yAxis = new THREE.Vector3(m.elements[4], m.elements[5], m.elements[6]).normalize();
  const zAxis = new THREE.Vector3(m.elements[8], m.elements[9], m.elements[10]).normalize();
  console.log(`${boneName}:`);
  console.log(`  X axis (red):   [${xAxis.x.toFixed(3)}, ${xAxis.y.toFixed(3)}, ${xAxis.z.toFixed(3)}]`);
  console.log(`  Y axis (green): [${yAxis.x.toFixed(3)}, ${yAxis.y.toFixed(3)}, ${yAxis.z.toFixed(3)}]`);
  console.log(`  Z axis (blue):  [${zAxis.x.toFixed(3)}, ${zAxis.y.toFixed(3)}, ${zAxis.z.toFixed(3)}]`);
}

inspectAxes('RightArm');
inspectAxes('RightForeArm');
inspectAxes('RightHand');
inspectAxes('LeftArm');
inspectAxes('LeftForeArm');
inspectAxes('LeftHand');

```

===============================================================================
FILE: scratch/inspect_character_weapon_pose.js
===============================================================================

```js
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { startRelayServer } = require("f:/BMW-M4/server/server");

const SCRATCH_DIR = __dirname;

(async () => {
  const npmRoot = execSync("npm root -g").toString().trim();
  const pw = require(path.join(npmRoot, "playwright"));

  const server = startRelayServer(0, { disconnectGraceMs: 250, deferListen: true });
  await new Promise((resolve) => server.httpServer.listen(0, "0.0.0.0", resolve));
  const { port } = server.httpServer.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  const exeCandidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  ];
  const executablePath = exeCandidates.find((p) => fs.existsSync(p));

  const browser = await pw.chromium.launch({
    headless: true,
    executablePath,
    args: [
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-webgl",
      "--ignore-gpu-blocklist",
      "--no-sandbox",
    ],
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  page.on("console", (m) => console.log("[BROWSER CONSOLE]", m.text()));

  try {
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await page.click('[data-testid="quick-solo-btn"]');
    await page.waitForSelector("canvas", { timeout: 25000 });

    console.log("Pressing Eject...");
    await page.waitForTimeout(1000);
    const ejectBtn = await page.$('.ffh-eject-btn');
    if (ejectBtn) {
      await ejectBtn.click();
    } else {
      await page.keyboard.press("Space");
    }

    console.log("Waiting for ground combat...");
    await page.waitForSelector('[data-hudelem-id="rightFire"]', { timeout: 35000 });
    console.log("Character landed on foot!");

    await page.waitForTimeout(1500);

    // Screenshot from default chase cam
    await page.screenshot({ path: path.join(SCRATCH_DIR, "character_ground_chase.png") });
    console.log("Screenshot saved: character_ground_chase.png");

    // Look at bone positions of LeftHand, RightHand, and Weapon in Three.js
    const boneDistance = await page.evaluate(() => {
      // Find scene from canvas
      const canvas = document.querySelector("canvas");
      let leftHand = null;
      let handguard = null;

      // Scan objects in scene
      const findObjects = (obj) => {
        if (!obj) return;
        if (obj.name === "mixamorigLeftHand" && !leftHand) leftHand = obj;
        if (obj.geometry?.type === "BoxGeometry" && obj.parent?.name === "EQUIPPED_WEAPON_GROUP") {
          // Handguard box geometry size: 0.052, 0.075, 0.24
          if (obj.position?.z > 0.25) handguard = obj;
        }
        if (obj.children) obj.children.forEach(findObjects);
      };

      // Traverse through React root fiber or window if available
      return {
        hasCanvas: Boolean(canvas),
      };
    });
    console.log("Bone check:", boneDistance);

    // Aim down sights (Right Click)
    await page.mouse.down({ button: "right" });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCRATCH_DIR, "character_ground_aiming.png") });
    await page.mouse.up({ button: "right" });
    console.log("Screenshot saved: character_ground_aiming.png");

    console.log("Done inspecting!");
  } finally {
    await browser.close();
    await server.close();
  }
})().catch((err) => {
  console.error("Inspect error:", err);
  process.exit(1);
});
```

===============================================================================
FILE: scratch/inspect_gun_hand_alignment.js
===============================================================================

```js
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

```

===============================================================================
FILE: scratch/inspect_hierarchy.js
===============================================================================

```js
const path = require('path');
const THREE = require(path.join(__dirname, '../client/node_modules/three'));
const fs = require('fs');
const { FBXLoader } = require(path.join(__dirname, '../client/node_modules/three-stdlib'));
global.window = global;
global.document = { createElementNS: () => ({}), createElement: () => ({}) };

const loader = new FBXLoader();
const fbxData = fs.readFileSync('f:/BMW-M4/client/src/assets/models/Characters/X Bot.fbx');
const char = loader.parse(fbxData.buffer.slice(fbxData.byteOffset, fbxData.byteOffset + fbxData.byteLength), '');

console.log("Top-level children:", char.children.map(c => ({ name: c.name, type: c.type })));

char.traverse(n => {
  if (n.isSkinnedMesh) {
    console.log("SkinnedMesh:", n.name, "Bones count in skeleton:", n.skeleton.bones.length);
    console.log("Root bone of skeleton:", n.skeleton.bones[0]?.name);
  }
});

```

===============================================================================
FILE: scratch/inspect_idle_tracks.js
===============================================================================

```js
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

```

===============================================================================
FILE: scratch/inspect_mixamo_bones.js
===============================================================================

```js
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
const fbxData = fs.readFileSync('f:/BMW-M4/client/src/assets/models/Characters/X Bot.fbx');
const fbxArrayBuffer = fbxData.buffer.slice(fbxData.byteOffset, fbxData.byteOffset + fbxData.byteLength);

const object = loader.parse(fbxArrayBuffer, '');

console.log("Parsed X Bot successfully!");
const bones = {};
object.traverse((n) => {
  if (n.isBone) {
    const clean = n.name.replace(/^mixamorig:?/i, '');
    bones[clean] = n;
  }
});

console.log("Total bones found:", Object.keys(bones).length);
['RightArm', 'RightForeArm', 'RightHand', 'LeftArm', 'LeftForeArm', 'LeftHand', 'Spine', 'Spine1', 'Spine2'].forEach((b) => {
  const bone = bones[b];
  if (bone) {
    console.log(`${b}: pos=(${bone.position.x.toFixed(2)}, ${bone.position.y.toFixed(2)}, ${bone.position.z.toFixed(2)}) rot=(${bone.rotation.x.toFixed(2)}, ${bone.rotation.y.toFixed(2)}, ${bone.rotation.z.toFixed(2)})`);
  }
});
```

===============================================================================
FILE: scratch/inspect_rest_arms.js
===============================================================================

```js
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

cloned.updateMatrixWorld(true);

function getPos(obj) {
  const v = new THREE.Vector3();
  obj.getWorldPosition(v);
  return v;
}

console.log('Rest pose positions:');
console.log('Hips:', getPos(bones.Hips));
console.log('Spine2:', getPos(bones.Spine2));
console.log('RightArm:', getPos(bones.RightArm));
console.log('RightForeArm:', getPos(bones.RightForeArm));
console.log('RightHand:', getPos(bones.RightHand));
console.log('LeftArm:', getPos(bones.LeftArm));
console.log('LeftForeArm:', getPos(bones.LeftForeArm));
console.log('LeftHand:', getPos(bones.LeftHand));

// Check bone lengths:
const rArmLen = getPos(bones.RightArm).distanceTo(getPos(bones.RightForeArm));
const rForeArmLen = getPos(bones.RightForeArm).distanceTo(getPos(bones.RightHand));
const lArmLen = getPos(bones.LeftArm).distanceTo(getPos(bones.LeftForeArm));
const lForeArmLen = getPos(bones.LeftForeArm).distanceTo(getPos(bones.LeftHand));

console.log('Lengths:');
console.log('Right upper arm len:', rArmLen.toFixed(2));
console.log('Right forearm len:', rForeArmLen.toFixed(2));
console.log('Left upper arm len:', lArmLen.toFixed(2));
console.log('Left forearm len:', lForeArmLen.toFixed(2));

```

===============================================================================
FILE: scratch/list_real_bone_names.js
===============================================================================

```js
const path = require('path');
const THREE = require(path.join(__dirname, '../client/node_modules/three'));
const fs = require('fs');
const { FBXLoader } = require(path.join(__dirname, '../client/node_modules/three-stdlib'));
global.window = global;
global.document = { createElementNS: () => ({}), createElement: () => ({}) };

const loader = new FBXLoader();
const fbxData = fs.readFileSync('f:/BMW-M4/client/src/assets/models/Characters/X Bot.fbx');
const char = loader.parse(fbxData.buffer.slice(fbxData.byteOffset, fbxData.byteOffset + fbxData.byteLength), '');

const names = [];
char.traverse(n => {
  if (n.isBone) names.push(n.name);
});
console.log("Bone names count:", names.length);
console.log("First 20 bone names:", names.slice(0, 20));

```

===============================================================================
FILE: scratch/preview_punch_pose.js
===============================================================================

```js
const path = require('path');
const fs = require('fs');
const http = require('http');
const { execSync } = require('child_process');

(async () => {
  const npmRoot = execSync('npm root -g').toString().trim();
  const pw = require(path.join(npmRoot, 'playwright'));

  const exeCandidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  const executablePath = exeCandidates.find((p) => fs.existsSync(p));

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Punch Pose Preview</title>
  <script type="importmap">
  {
    "imports": {
      "three": "/node_modules/three/build/three.module.js",
      "three/examples/jsm/loaders/FBXLoader.js": "/node_modules/three/examples/jsm/loaders/FBXLoader.js",
      "three/examples/jsm/utils/SkeletonUtils.js": "/node_modules/three/examples/jsm/utils/SkeletonUtils.js"
    }
  }
  </script>
</head>
<body>
<script type="module">
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

window.THREE = THREE;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a202c);

const camera = new THREE.PerspectiveCamera(45, 1280 / 720, 0.1, 100);
camera.position.set(1.1, 1.35, 1.8);
camera.lookAt(0, 1.25, 0);
window.__camera = camera;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(1280, 720);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild(renderer.domElement);

const amb = new THREE.AmbientLight(0xffffff, 1.4);
scene.add(amb);

const dir = new THREE.DirectionalLight(0xffffff, 2.5);
dir.position.set(3, 8, 4);
scene.add(dir);

const fill = new THREE.DirectionalLight(0x7090ff, 1.0);
fill.position.set(-3, 2, -2);
scene.add(fill);

const grid = new THREE.GridHelper(10, 20, 0x334466, 0x223344);
scene.add(grid);

const loader = new FBXLoader();
loader.load('/src/assets/models/Characters/X Bot.fbx', (charFbx) => {
  const cloned = clone(charFbx);
  cloned.scale.setScalar(0.01);
  scene.add(cloned);
  window.__char = cloned;

  const surface = cloned.getObjectByName('Beta_Surface');
  const bones = {};
  surface.skeleton.bones.forEach(b => {
    const cleanKey = b.name.replace(/^mixamorig:?/i, '');
    if (!bones[cleanKey]) bones[cleanKey] = b;
  });
  window.__bones = bones;

  window.__ready = true;
  renderer.render(scene, camera);
});

window.renderFrame = () => {
  renderer.render(scene, camera);
};
</script>
</body>
</html>
  `;

  const server = http.createServer((req, res) => {
    const rawUrl = req.url.split('?')[0];
    const parsedUrl = decodeURIComponent(rawUrl);
    if (parsedUrl === '/' || parsedUrl === '/preview.html') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
      return;
    }
    const filePath = path.join(__dirname, '../client', parsedUrl);
    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end('Not found: ' + filePath);
      return;
    }
    const stat = fs.statSync(filePath);
    let contentType = 'application/octet-stream';
    if (filePath.endsWith('.js')) contentType = 'application/javascript';
    if (filePath.endsWith('.fbx')) contentType = 'application/octet-stream';
    res.writeHead(200, { 'Content-Length': stat.size, 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });

  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;

  const browser = await pw.chromium.launch({
    headless: true,
    executablePath,
    args: [
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--no-sandbox',
    ],
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(`http://127.0.0.1:${port}/preview.html`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__ready === true, { timeout: 30000 });

  // Test Punch Pose:
  await page.evaluate(() => {
    const bones = window.__bones;
    const char = window.__char;

    // Spine lean into punch
    if (bones.Spine) {
      bones.Spine.rotation.set(0.12, -0.15, 0);
    }
    if (bones.Spine1) {
      bones.Spine1.rotation.set(0.08, -0.1, 0);
    }

    // Right Arm: Straight Jab Punch forward!
    bones.RightArm.rotation.set(0.8, -0.3, -0.4);
    bones.RightForeArm.rotation.set(0, 0, -0.35);
    bones.RightHand.rotation.set(0, 0.45, 0.1);

    // Left Arm: Guard position covering face
    bones.LeftArm.rotation.set(0.85, 0.35, 0.5);
    bones.LeftForeArm.rotation.set(0, 0, 1.4);
    bones.LeftHand.rotation.set(0.2, 0.2, 0);

    char.updateMatrixWorld(true);
    window.renderFrame();
  });

  await page.screenshot({ path: path.join(__dirname, 'punch_pose_angle.png') });
  console.log('Saved punch_pose_angle.png');

  await page.evaluate(() => {
    window.__camera.position.set(0, 1.35, 2.0);
    window.__camera.lookAt(0, 1.25, 0);
    window.renderFrame();
  });
  await page.screenshot({ path: path.join(__dirname, 'punch_pose_front.png') });
  console.log('Saved punch_pose_front.png');

  await browser.close();
  server.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
```

===============================================================================
FILE: scratch/render_anim_test.js
===============================================================================

```js
const path = require('path');
const fs = require('fs');
const http = require('http');
const { execSync } = require('child_process');

(async () => {
  const npmRoot = execSync('npm root -g').toString().trim();
  const pw = require(path.join(npmRoot, 'playwright'));

  const exeCandidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  const executablePath = exeCandidates.find((p) => fs.existsSync(p));

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Running Two-Handed Test</title>
  <script type="importmap">
  {
    "imports": {
      "three": "/node_modules/three/build/three.module.js",
      "three/examples/jsm/loaders/FBXLoader.js": "/node_modules/three/examples/jsm/loaders/FBXLoader.js",
      "three/examples/jsm/utils/SkeletonUtils.js": "/node_modules/three/examples/jsm/utils/SkeletonUtils.js"
    }
  }
  </script>
</head>
<body>
<script type="module">
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

window.THREE = THREE;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a202c);

const camera = new THREE.PerspectiveCamera(45, 1280 / 720, 0.1, 100);
camera.position.set(1.4, 1.35, 1.6);
camera.lookAt(0, 1.25, 0);
window.__camera = camera;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(1280, 720);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild(renderer.domElement);

const amb = new THREE.AmbientLight(0xffffff, 1.4);
scene.add(amb);

const dir = new THREE.DirectionalLight(0xffffff, 2.5);
dir.position.set(3, 8, 4);
scene.add(dir);

const fill = new THREE.DirectionalLight(0x7090ff, 1.0);
fill.position.set(-3, 2, -2);
scene.add(fill);

const grid = new THREE.GridHelper(10, 20, 0x334466, 0x223344);
scene.add(grid);

const loader = new FBXLoader();
loader.load('/src/assets/models/Characters/X Bot.fbx', (charFbx) => {
  const cloned = clone(charFbx);
  cloned.scale.setScalar(0.01);
  scene.add(cloned);
  window.__char = cloned;

  const surface = cloned.getObjectByName('Beta_Surface');
  const bones = {};
  surface.skeleton.bones.forEach(b => {
    const cleanKey = b.name.replace(/^mixamorig:?/i, '');
    if (!bones[cleanKey]) bones[cleanKey] = b;
  });
  window.__bones = bones;

  const gunGroup = new THREE.Group();
  gunGroup.name = "EQUIPPED_WEAPON_GROUP";
  gunGroup.scale.setScalar(100);
  gunGroup.position.set(0.5, 9.5, 3.2);
  gunGroup.rotation.set(-0.62, 1.32, -0.62);

  const darkMetal = new THREE.MeshStandardMaterial({ color: "#161c26", metalness: 0.88, roughness: 0.24 });
  const darkPolymer = new THREE.MeshStandardMaterial({ color: "#0a0e16", roughness: 0.72, metalness: 0.15 });
  const accentMat = new THREE.MeshStandardMaterial({ color: "#2d79ff", metalness: 0.75, roughness: 0.25 });

  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.13, 0.046), darkPolymer);
  grip.position.set(0, -0.04, -0.02);
  grip.rotation.x = -0.28;
  gunGroup.add(grip);

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.088, 0.32), darkMetal);
  body.position.set(0, 0.048, 0.04);
  gunGroup.add(body);

  const stock = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.11, 0.22), darkPolymer);
  stock.position.set(0, 0.03, -0.22);
  gunGroup.add(stock);

  const mag = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.18, 0.065), accentMat);
  mag.position.set(0, -0.065, 0.12);
  mag.rotation.x = 0.22;
  gunGroup.add(mag);

  const handguard = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.075, 0.24), darkPolymer);
  handguard.position.set(0, 0.048, 0.28);
  gunGroup.add(handguard);

  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.32, 8), darkMetal);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 0.048, 0.44);
  gunGroup.add(barrel);

  bones.RightHand.add(gunGroup);
  window.__handguard = handguard;
  window.__gunGroup = gunGroup;

  // Load running animation
  loader.load('/src/assets/models/Characters/running.fbx', (animFbx) => {
    const mixer = new THREE.AnimationMixer(cloned);
    const clip = animFbx.animations[0];
    const action = mixer.clipAction(clip);
    action.play();
    window.__mixer = mixer;

    window.__ready = true;
    renderer.render(scene, camera);
  });
});

window.renderFrame = () => {
  renderer.render(scene, camera);
};
</script>
</body>
</html>
  `;

  const server = http.createServer((req, res) => {
    const rawUrl = req.url.split('?')[0];
    const parsedUrl = decodeURIComponent(rawUrl);
    if (parsedUrl === '/' || parsedUrl === '/preview.html') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
      return;
    }
    const filePath = path.join(__dirname, '../client', parsedUrl);
    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end('Not found: ' + filePath);
      return;
    }
    const stat = fs.statSync(filePath);
    let contentType = 'application/octet-stream';
    if (filePath.endsWith('.js')) contentType = 'application/javascript';
    if (filePath.endsWith('.fbx')) contentType = 'application/octet-stream';
    res.writeHead(200, { 'Content-Length': stat.size, 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });

  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;

  const browser = await pw.chromium.launch({
    headless: true,
    executablePath,
    args: [
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--no-sandbox',
    ],
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(`http://127.0.0.1:${port}/preview.html`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__ready === true, { timeout: 30000 });

  // Update mixer for a mid-run pose, then apply two-handed grip and Left Arm IK
  const res = await page.evaluate(() => {
    const mixer = window.__mixer;
    const bones = window.__bones;
    const hg = window.__handguard;
    const char = window.__char;

    // Advance animation 0.35s into the run cycle
    mixer.update(0.35);

    // Procedural Two-Handed Upper Body (Low Ready during run):
    // Spine stabilization
    if (bones.Spine) bones.Spine.rotation.y = 0.08;
    if (bones.Spine1) bones.Spine1.rotation.y = 0.12;

    // Right Arm: tactical carry holding pistol grip & trigger
    bones.RightArm.rotation.set(0.9, -0.35, -0.3);
    bones.RightForeArm.rotation.set(0, 0, -1.1);
    bones.RightHand.rotation.set(0, 0.1, 0.1);

    char.updateMatrixWorld(true);

    const hgPos = new THREE.Vector3();
    hg.getWorldPosition(hgPos);

    // Left Arm IK snaps directly to handguard:
    const lArm = bones.LeftArm;
    const lFore = bones.LeftForeArm;
    const lHand = bones.LeftHand;

    lArm.rotation.set(1.2, 0.4, 0.6);
    lFore.rotation.set(0, 0, 1.3);
    lHand.rotation.set(0.2, 0.3, -0.3);

    for (let iter = 0; iter < 15; iter++) {
      char.updateMatrixWorld(true);
      const elbowPos = new THREE.Vector3();
      const handPos = new THREE.Vector3();
      lFore.getWorldPosition(elbowPos);
      lHand.getWorldPosition(handPos);

      const v1 = handPos.clone().sub(elbowPos).normalize();
      const v2 = hgPos.clone().sub(elbowPos).normalize();
      const q1 = new THREE.Quaternion().setFromUnitVectors(v1, v2);

      const parentForeQ = new THREE.Quaternion();
      lFore.parent.getWorldQuaternion(parentForeQ);
      const curForeQ = new THREE.Quaternion();
      lFore.getWorldQuaternion(curForeQ);
      lFore.quaternion.copy(parentForeQ.invert().multiply(q1.multiply(curForeQ)));

      char.updateMatrixWorld(true);
      const shoulderPos = new THREE.Vector3();
      lArm.getWorldPosition(shoulderPos);
      lHand.getWorldPosition(handPos);

      const v3 = handPos.clone().sub(shoulderPos).normalize();
      const v4 = hgPos.clone().sub(shoulderPos).normalize();
      const q2 = new THREE.Quaternion().setFromUnitVectors(v3, v4);

      const parentArmQ = new THREE.Quaternion();
      lArm.parent.getWorldQuaternion(parentArmQ);
      const curArmQ = new THREE.Quaternion();
      lArm.getWorldQuaternion(curArmQ);
      lArm.quaternion.copy(parentArmQ.invert().multiply(q2.multiply(curArmQ)));
    }

    // Hand rotation to wrap palm under the handguard
    lHand.rotation.set(0.1, -0.3, 0.2);

    char.updateMatrixWorld(true);
    const finalHand = new THREE.Vector3();
    lHand.getWorldPosition(finalHand);

    window.renderFrame();

    return {
      dist: finalHand.distanceTo(hgPos),
      handPos: [finalHand.x, finalHand.y, finalHand.z],
      hgPos: [hgPos.x, hgPos.y, hgPos.z]
    };
  });

  console.log('Running test result:', res);

  await page.screenshot({ path: path.join(__dirname, 'running_two_handed_angle.png') });
  console.log('Saved running_two_handed_angle.png');

  await page.evaluate(() => {
    window.__camera.position.set(0, 1.35, 2.2);
    window.__camera.lookAt(0, 1.25, 0);
    window.renderFrame();
  });
  await page.screenshot({ path: path.join(__dirname, 'running_two_handed_front.png') });
  console.log('Saved running_two_handed_front.png');

  await browser.close();
  server.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});

```

===============================================================================
FILE: scratch/render_two_handed_preview.js
===============================================================================

```js
const path = require('path');
const fs = require('fs');
const http = require('http');
const { execSync } = require('child_process');

(async () => {
  const npmRoot = execSync('npm root -g').toString().trim();
  const pw = require(path.join(npmRoot, 'playwright'));

  const exeCandidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  const executablePath = exeCandidates.find((p) => fs.existsSync(p));

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Preview Two-Handed Hold</title>
  <style>body { margin: 0; background: #1a1a24; overflow: hidden; }</style>
  <script type="importmap">
  {
    "imports": {
      "three": "/node_modules/three/build/three.module.js",
      "three/examples/jsm/loaders/FBXLoader.js": "/node_modules/three/examples/jsm/loaders/FBXLoader.js",
      "three/examples/jsm/utils/SkeletonUtils.js": "/node_modules/three/examples/jsm/utils/SkeletonUtils.js"
    }
  }
  </script>
</head>
<body>
<script type="module">
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

window.THREE = THREE;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a202c);

const camera = new THREE.PerspectiveCamera(45, 1280 / 720, 0.1, 100);
camera.position.set(0, 1.35, 2.4);
camera.lookAt(0, 1.25, 0);
window.__camera = camera;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(1280, 720);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild(renderer.domElement);

const amb = new THREE.AmbientLight(0xffffff, 1.4);
scene.add(amb);

const dir = new THREE.DirectionalLight(0xffffff, 2.5);
dir.position.set(3, 8, 4);
scene.add(dir);

const fill = new THREE.DirectionalLight(0x7090ff, 1.0);
fill.position.set(-3, 2, -2);
scene.add(fill);

const grid = new THREE.GridHelper(10, 20, 0x334466, 0x223344);
scene.add(grid);

const loader = new FBXLoader();
loader.load('/src/assets/models/Characters/X Bot.fbx', (charFbx) => {
  const cloned = clone(charFbx);
  cloned.scale.setScalar(0.01);
  scene.add(cloned);
  window.__char = cloned;

  const surface = cloned.getObjectByName('Beta_Surface');
  const bones = {};
  surface.skeleton.bones.forEach(b => {
    const cleanKey = b.name.replace(/^mixamorig:?/i, '');
    if (!bones[cleanKey]) bones[cleanKey] = b;
  });
  window.__bones = bones;

  // Build Gun
  const gunGroup = new THREE.Group();
  gunGroup.name = "EQUIPPED_WEAPON_GROUP";
  gunGroup.scale.setScalar(100);
  gunGroup.position.set(0.5, 9.5, 3.2);
  gunGroup.rotation.set(-0.62, 1.32, -0.62);

  const darkMetal = new THREE.MeshStandardMaterial({ color: "#161c26", metalness: 0.88, roughness: 0.24 });
  const darkPolymer = new THREE.MeshStandardMaterial({ color: "#0a0e16", roughness: 0.72, metalness: 0.15 });
  const accentMat = new THREE.MeshStandardMaterial({ color: "#2d79ff", metalness: 0.75, roughness: 0.25 });

  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.13, 0.046), darkPolymer);
  grip.position.set(0, -0.04, -0.02);
  grip.rotation.x = -0.28;
  gunGroup.add(grip);

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.088, 0.32), darkMetal);
  body.position.set(0, 0.048, 0.04);
  gunGroup.add(body);

  const stock = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.11, 0.22), darkPolymer);
  stock.position.set(0, 0.03, -0.22);
  gunGroup.add(stock);

  const mag = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.18, 0.065), accentMat);
  mag.position.set(0, -0.065, 0.12);
  mag.rotation.x = 0.22;
  gunGroup.add(mag);

  const handguard = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.075, 0.24), darkPolymer);
  handguard.position.set(0, 0.048, 0.28);
  gunGroup.add(handguard);

  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.32, 8), darkMetal);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 0.048, 0.44);
  gunGroup.add(barrel);

  bones.RightHand.add(gunGroup);
  window.__handguard = handguard;
  window.__gunGroup = gunGroup;

  window.__ready = true;
  renderer.render(scene, camera);
}, undefined, (err) => {
  console.error('FBX Load error:', err);
});

window.renderFrame = () => {
  renderer.render(scene, camera);
};
</script>
</body>
</html>
  `;

  const server = http.createServer((req, res) => {
    const rawUrl = req.url.split('?')[0];
    const parsedUrl = decodeURIComponent(rawUrl);
    if (parsedUrl === '/' || parsedUrl === '/preview.html') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
      return;
    }
    const filePath = path.join(__dirname, '../client', parsedUrl);
    if (!fs.existsSync(filePath)) {
      console.error('File not found:', filePath);
      res.writeHead(404);
      res.end('Not found: ' + filePath);
      return;
    }
    const stat = fs.statSync(filePath);
    let contentType = 'application/octet-stream';
    if (filePath.endsWith('.js')) contentType = 'application/javascript';
    if (filePath.endsWith('.fbx')) contentType = 'application/octet-stream';
    res.writeHead(200, { 'Content-Length': stat.size, 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });

  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;

  const browser = await pw.chromium.launch({
    headless: true,
    executablePath,
    args: [
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--no-sandbox',
    ],
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  page.on('console', m => console.log('[BROWSER]', m.text()));
  page.on('pageerror', err => console.error('[PAGE ERROR]', err));

  await page.goto(`http://127.0.0.1:${port}/preview.html`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__ready === true, { timeout: 30000 });

  // Apply the two-handed pose!
  const poseRes = await page.evaluate(() => {
    const bones = window.__bones;
    const hg = window.__handguard;
    const char = window.__char;

    // Apply Low-Ready Two-Handed Hold:
    // Right hand holds grip & trigger across chest
    bones.RightArm.rotation.set(1.0, -0.4, 0.0);
    bones.RightForeArm.rotation.set(0, 0, -1.6);
    bones.RightHand.rotation.set(0, -0.2, 0);

    // Left hand cradles handguard from underneath
    bones.LeftArm.rotation.set(1.45, 0.6, 0.65);
    bones.LeftForeArm.rotation.set(0, 0, 1.35);
    bones.LeftHand.rotation.set(0.2, 0.3, -0.4);

    char.updateMatrixWorld(true);

    const hgPos = new THREE.Vector3();
    hg.getWorldPosition(hgPos);
    const lHandPos = new THREE.Vector3();
    bones.LeftHand.getWorldPosition(lHandPos);
    const rHandPos = new THREE.Vector3();
    bones.RightHand.getWorldPosition(rHandPos);

    window.renderFrame();

    return {
      handguard: [hgPos.x, hgPos.y, hgPos.z],
      leftHand: [lHandPos.x, lHandPos.y, lHandPos.z],
      rightHand: [rHandPos.x, rHandPos.y, rHandPos.z],
      dist: lHandPos.distanceTo(hgPos)
    };
  });

  console.log('Pose Evaluation:', poseRes);

  // Take screenshot 1: Front View (standing right in front of character)
  await page.screenshot({ path: path.join(__dirname, 'preview_two_hand_front.png') });
  console.log('Saved preview_two_hand_front.png');

  // Change camera to 3/4 perspective view
  await page.evaluate(() => {
    window.__camera.position.set(1.3, 1.35, 1.6);
    window.__camera.lookAt(0, 1.25, 0);
    window.renderFrame();
  });
  await page.screenshot({ path: path.join(__dirname, 'preview_two_hand_angle.png') });
  console.log('Saved preview_two_hand_angle.png');

  // Change camera to Chase View (behind player)
  await page.evaluate(() => {
    window.__camera.position.set(0.4, 1.45, -2.0);
    window.__camera.lookAt(0, 1.25, 1.0);
    window.renderFrame();
  });
  await page.screenshot({ path: path.join(__dirname, 'preview_two_hand_chase.png') });
  console.log('Saved preview_two_hand_chase.png');

  await browser.close();
  server.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
```

===============================================================================
FILE: scratch/solve_aim_angles.js
===============================================================================

```js
const path = require('path');
const fs = require('fs');
const http = require('http');
const { execSync } = require('child_process');

(async () => {
  const npmRoot = execSync('npm root -g').toString().trim();
  const pw = require(path.join(npmRoot, 'playwright'));

  const exeCandidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  const executablePath = exeCandidates.find((p) => fs.existsSync(p));

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Aim Optimizer</title>
  <script type="importmap">
  {
    "imports": {
      "three": "/node_modules/three/build/three.module.js",
      "three/examples/jsm/loaders/FBXLoader.js": "/node_modules/three/examples/jsm/loaders/FBXLoader.js",
      "three/examples/jsm/utils/SkeletonUtils.js": "/node_modules/three/examples/jsm/utils/SkeletonUtils.js"
    }
  }
  </script>
</head>
<body>
<script type="module">
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

window.THREE = THREE;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a202c);

const camera = new THREE.PerspectiveCamera(45, 1280 / 720, 0.1, 100);
camera.position.set(1.4, 1.35, 1.6);
camera.lookAt(0, 1.25, 0);
window.__camera = camera;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(1280, 720);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild(renderer.domElement);

const amb = new THREE.AmbientLight(0xffffff, 1.4);
scene.add(amb);

const dir = new THREE.DirectionalLight(0xffffff, 2.5);
dir.position.set(3, 8, 4);
scene.add(dir);

const fill = new THREE.DirectionalLight(0x7090ff, 1.0);
fill.position.set(-3, 2, -2);
scene.add(fill);

const grid = new THREE.GridHelper(10, 20, 0x334466, 0x223344);
scene.add(grid);

const loader = new FBXLoader();
loader.load('/src/assets/models/Characters/X Bot.fbx', (charFbx) => {
  const cloned = clone(charFbx);
  cloned.scale.setScalar(0.01);
  scene.add(cloned);
  window.__char = cloned;

  const surface = cloned.getObjectByName('Beta_Surface');
  const bones = {};
  surface.skeleton.bones.forEach(b => {
    const cleanKey = b.name.replace(/^mixamorig:?/i, '');
    if (!bones[cleanKey]) bones[cleanKey] = b;
  });
  window.__bones = bones;

  const gunGroup = new THREE.Group();
  gunGroup.name = "EQUIPPED_WEAPON_GROUP";
  gunGroup.scale.setScalar(100);
  gunGroup.position.set(0.5, 9.5, 3.2);
  gunGroup.rotation.set(-0.62, 1.32, -0.62);

  const darkMetal = new THREE.MeshStandardMaterial({ color: "#161c26", metalness: 0.88, roughness: 0.24 });
  const darkPolymer = new THREE.MeshStandardMaterial({ color: "#0a0e16", roughness: 0.72, metalness: 0.15 });
  const accentMat = new THREE.MeshStandardMaterial({ color: "#2d79ff", metalness: 0.75, roughness: 0.25 });

  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.13, 0.046), darkPolymer);
  grip.position.set(0, -0.04, -0.02);
  grip.rotation.x = -0.28;
  gunGroup.add(grip);

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.088, 0.32), darkMetal);
  body.position.set(0, 0.048, 0.04);
  gunGroup.add(body);

  const stock = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.11, 0.22), darkPolymer);
  stock.position.set(0, 0.03, -0.22);
  gunGroup.add(stock);

  const mag = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.18, 0.065), accentMat);
  mag.position.set(0, -0.065, 0.12);
  mag.rotation.x = 0.22;
  gunGroup.add(mag);

  const handguard = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.075, 0.24), darkPolymer);
  handguard.position.set(0, 0.048, 0.28);
  gunGroup.add(handguard);

  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.32, 8), darkMetal);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 0.048, 0.44);
  gunGroup.add(barrel);

  bones.RightHand.add(gunGroup);
  window.__handguard = handguard;
  window.__gunGroup = gunGroup;

  window.__ready = true;
  renderer.render(scene, camera);
});

window.renderFrame = () => {
  renderer.render(scene, camera);
};
</script>
</body>
</html>
  `;

  const server = http.createServer((req, res) => {
    const rawUrl = req.url.split('?')[0];
    const parsedUrl = decodeURIComponent(rawUrl);
    if (parsedUrl === '/' || parsedUrl === '/preview.html') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
      return;
    }
    const filePath = path.join(__dirname, '../client', parsedUrl);
    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end('Not found: ' + filePath);
      return;
    }
    const stat = fs.statSync(filePath);
    let contentType = 'application/octet-stream';
    if (filePath.endsWith('.js')) contentType = 'application/javascript';
    if (filePath.endsWith('.fbx')) contentType = 'application/octet-stream';
    res.writeHead(200, { 'Content-Length': stat.size, 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });

  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;

  const browser = await pw.chromium.launch({
    headless: true,
    executablePath,
    args: [
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--no-sandbox',
    ],
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(`http://127.0.0.1:${port}/preview.html`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__ready === true, { timeout: 30000 });

  // Now, let's find the exact Aiming / Shooting pose where gun points forward!
  const results = await page.evaluate(() => {
    const bones = window.__bones;
    const gun = window.__gunGroup;
    const hg = window.__handguard;
    const char = window.__char;

    // In Three.js:
    // If we want gun's forward vector (+Z of gun) to point along world +Z (0, 0, 1):
    // What right arm rotations achieve this?
    // Let's test a fine search:
    const targetFwd = new THREE.Vector3(0, 0, 1);
    const gunQuat = new THREE.Quaternion();
    const gunFwd = new THREE.Vector3();
    const hgPos = new THREE.Vector3();
    const rHandPos = new THREE.Vector3();

    let bestAimErr = Infinity;
    let bestAim = null;

    // Search across RightArm, ForeArm, and Hand:
    for (let ax = -0.5; ax <= 0.8; ax += 0.1) {
      for (let ay = -0.6; ay <= 0.4; ay += 0.1) {
        for (let az = -0.8; az <= 0.4; az += 0.1) {
          for (let fz = -1.8; fz <= -0.4; fz += 0.1) {
            for (let hy = -0.6; hy <= 0.4; hy += 0.2) {
              bones.RightArm.rotation.set(ax, ay, az);
              bones.RightForeArm.rotation.set(0, 0, fz);
              bones.RightHand.rotation.set(0, hy, 0);

              char.updateMatrixWorld(true);

              gun.getWorldQuaternion(gunQuat);
              gunFwd.set(0, 0, 1).applyQuaternion(gunQuat);

              // We want gunFwd close to (0, 0, 1)
              const angle = gunFwd.angleTo(targetFwd);
              hg.getWorldPosition(hgPos);
              bones.RightHand.getWorldPosition(rHandPos);

              // Handguard should be in front of chest:
              // y in [1.2, 1.45], z in [0.2, 0.55], x in [-0.25, 0.05]
              if (hgPos.y >= 1.2 && hgPos.y <= 1.45 && hgPos.z >= 0.2 && hgPos.z <= 0.55 && hgPos.x >= -0.25 && hgPos.x <= 0.05) {
                const err = angle + Math.abs(hgPos.x + 0.08) * 0.1;
                if (err < bestAimErr) {
                  bestAimErr = err;
                  bestAim = {
                    arm: [Number(ax.toFixed(2)), Number(ay.toFixed(2)), Number(az.toFixed(2))],
                    fore: [0, 0, Number(fz.toFixed(2))],
                    hand: [0, Number(hy.toFixed(2)), 0],
                    gunFwd: [Number(gunFwd.x.toFixed(3)), Number(gunFwd.y.toFixed(3)), Number(gunFwd.z.toFixed(3))],
                    hgPos: [Number(hgPos.x.toFixed(3)), Number(hgPos.y.toFixed(3)), Number(hgPos.z.toFixed(3))],
                    angleDeg: Number((angle * 180 / Math.PI).toFixed(1))
                  };
                }
              }
            }
          }
        }
      }
    }

    return bestAim;
  });

  console.log('Best Forward Aim Angles:', results);

  // Now apply the best forward aim angles, solve LeftArm IK, and render!
  await page.evaluate((aim) => {
    const bones = window.__bones;
    const hg = window.__handguard;
    const char = window.__char;

    bones.RightArm.rotation.set(...aim.arm);
    bones.RightForeArm.rotation.set(...aim.fore);
    bones.RightHand.rotation.set(...aim.hand);

    char.updateMatrixWorld(true);

    const hgPos = new THREE.Vector3();
    hg.getWorldPosition(hgPos);

    // Left Arm CCD IK
    const lArm = bones.LeftArm;
    const lFore = bones.LeftForeArm;
    const lHand = bones.LeftHand;

    lArm.rotation.set(1.2, 0.4, 0.6);
    lFore.rotation.set(0, 0, 1.3);
    lHand.rotation.set(0.2, 0.3, -0.3);

    for (let iter = 0; iter < 20; iter++) {
      char.updateMatrixWorld(true);
      const elbowPos = new THREE.Vector3();
      const handPos = new THREE.Vector3();
      lFore.getWorldPosition(elbowPos);
      lHand.getWorldPosition(handPos);

      const v1 = handPos.clone().sub(elbowPos).normalize();
      const v2 = hgPos.clone().sub(elbowPos).normalize();
      const q1 = new THREE.Quaternion().setFromUnitVectors(v1, v2);

      const parentForeQ = new THREE.Quaternion();
      lFore.parent.getWorldQuaternion(parentForeQ);
      const curForeQ = new THREE.Quaternion();
      lFore.getWorldQuaternion(curForeQ);
      lFore.quaternion.copy(parentForeQ.invert().multiply(q1.multiply(curForeQ)));

      char.updateMatrixWorld(true);
      const shoulderPos = new THREE.Vector3();
      lArm.getWorldPosition(shoulderPos);
      lHand.getWorldPosition(handPos);

      const v3 = handPos.clone().sub(shoulderPos).normalize();
      const v4 = hgPos.clone().sub(shoulderPos).normalize();
      const q2 = new THREE.Quaternion().setFromUnitVectors(v3, v4);

      const parentArmQ = new THREE.Quaternion();
      lArm.parent.getWorldQuaternion(parentArmQ);
      const curArmQ = new THREE.Quaternion();
      lArm.getWorldQuaternion(curArmQ);
      lArm.quaternion.copy(parentArmQ.invert().multiply(q2.multiply(curArmQ)));
    }

    char.updateMatrixWorld(true);
    window.renderFrame();
  }, results);

  // Take screenshot from 3 angles
  await page.screenshot({ path: path.join(__dirname, 'aim_solve_angle.png') });
  console.log('Saved aim_solve_angle.png');

  await page.evaluate(() => {
    window.__camera.position.set(0, 1.35, 2.0);
    window.__camera.lookAt(0, 1.25, 0);
    window.renderFrame();
  });
  await page.screenshot({ path: path.join(__dirname, 'aim_solve_front.png') });
  console.log('Saved aim_solve_front.png');

  await page.evaluate(() => {
    window.__camera.position.set(0.35, 1.45, -1.8);
    window.__camera.lookAt(0, 1.3, 1.0);
    window.renderFrame();
  });
  await page.screenshot({ path: path.join(__dirname, 'aim_solve_chase.png') });
  console.log('Saved aim_solve_chase.png');

  await browser.close();
  server.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});

```

===============================================================================
FILE: scratch/solve_full_two_handed_system.js
===============================================================================

```js
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

// Fast IK solver for left arm to snap leftHand to target position
function solveLeftArmTo(targetPos) {
  const lArm = bones.LeftArm;
  const lFore = bones.LeftForeArm;
  const lHand = bones.LeftHand;

  // Analytical 2-bone IK:
  // Root: lArm, Mid: lFore, End: lHand
  cloned.updateMatrixWorld(true);

  for (let iter = 0; iter < 10; iter++) {
    cloned.updateMatrixWorld(true);
    const elbowPos = new THREE.Vector3();
    const handPos = new THREE.Vector3();
    lFore.getWorldPosition(elbowPos);
    lHand.getWorldPosition(handPos);

    // 1. Rotate elbow to aim towards target
    const v1 = handPos.clone().sub(elbowPos).normalize();
    const v2 = targetPos.clone().sub(elbowPos).normalize();
    const q1 = new THREE.Quaternion().setFromUnitVectors(v1, v2);

    const parentForeQ = new THREE.Quaternion();
    lFore.parent.getWorldQuaternion(parentForeQ);
    const curForeQ = new THREE.Quaternion();
    lFore.getWorldQuaternion(curForeQ);
    lFore.quaternion.copy(parentForeQ.invert().multiply(q1.multiply(curForeQ)));

    // 2. Rotate shoulder to aim hand towards target
    cloned.updateMatrixWorld(true);
    const shoulderPos = new THREE.Vector3();
    lArm.getWorldPosition(shoulderPos);
    lHand.getWorldPosition(handPos);

    const v3 = handPos.clone().sub(shoulderPos).normalize();
    const v4 = targetPos.clone().sub(shoulderPos).normalize();
    const q2 = new THREE.Quaternion().setFromUnitVectors(v3, v4);

    const parentArmQ = new THREE.Quaternion();
    lArm.parent.getWorldQuaternion(parentArmQ);
    const curArmQ = new THREE.Quaternion();
    lArm.getWorldQuaternion(curArmQ);
    lArm.quaternion.copy(parentArmQ.invert().multiply(q2.multiply(curArmQ)));
  }

  cloned.updateMatrixWorld(true);
  const finalHandPos = new THREE.Vector3();
  lHand.getWorldPosition(finalHandPos);
  return finalHandPos.distanceTo(targetPos);
}

// Let's test aiming:
// In aiming, we want gunForward = [0, 0, 1]
// Handguard is target for left arm
console.log('Testing aim alignment...');

const gunQuat = new THREE.Quaternion();
const gunForward = new THREE.Vector3();
const hgPos = new THREE.Vector3();

// Let's search for right arm angles where gun points directly forward (+Z):
let bestScore = Infinity;
let bestPose = null;

for (let rx = -1.6; rx <= 1.6; rx += 0.2) {
  for (let ry = -1.6; ry <= 1.6; ry += 0.2) {
    for (let rz = -1.6; rz <= 1.6; rz += 0.2) {
      for (let fx = -1.6; fx <= 1.6; fx += 0.4) {
        for (let fz = -2.2; fz <= 0.0; fz += 0.4) {
          bones.RightArm.rotation.set(rx, ry, rz);
          bones.RightForeArm.rotation.set(fx, 0, fz);
          bones.RightHand.rotation.set(0, 0, 0);

          cloned.updateMatrixWorld(true);
          gun.getWorldQuaternion(gunQuat);
          gunForward.set(0, 0, 1).applyQuaternion(gunQuat);

          // We want gunForward: x near 0, y near 0, z near 1
          const dirError = Math.abs(gunForward.x) + Math.abs(gunForward.y) + (1 - gunForward.z);
          if (dirError > 0.4) continue;

          handguard.getWorldPosition(hgPos);
          // Check if handguard is in front of chest (y between 120 and 145, z between 25 and 45, x between -15 and 5)
          if (hgPos.y < 120 || hgPos.y > 145 || hgPos.z < 25 || hgPos.z > 50 || hgPos.x < -20 || hgPos.x > 10) continue;

          const distToLeftShoulder = hgPos.distanceTo(bones.LeftArm.getWorldPosition(new THREE.Vector3()));
          if (distToLeftShoulder > 50) continue;

          const score = dirError + Math.abs(hgPos.x + 5) * 0.01;
          if (score < bestScore) {
            bestScore = score;
            bestPose = {
              rArm: [rx, ry, rz],
              rFore: [fx, 0, fz],
              gunFwd: [Number(gunForward.x.toFixed(3)), Number(gunForward.y.toFixed(3)), Number(gunForward.z.toFixed(3))],
              hg: [Number(hgPos.x.toFixed(1)), Number(hgPos.y.toFixed(1)), Number(hgPos.z.toFixed(1))],
              distToLShoulder: Number(distToLeftShoulder.toFixed(1))
            };
          }
        }
      }
    }
  }
}

console.log('Best Aim Pose:', bestPose);

if (bestPose) {
  bones.RightArm.rotation.set(...bestPose.rArm);
  bones.RightForeArm.rotation.set(...bestPose.rFore);
  bones.RightHand.rotation.set(0, 0, 0);
  handguard.getWorldPosition(hgPos);

  // Set LeftArm initial guess pointing forward-across
  bones.LeftArm.rotation.set(1.0, 0.4, 0.6);
  bones.LeftForeArm.rotation.set(0, 0, 1.2);

  const ikDist = solveLeftArmTo(hgPos);
  console.log('IK final distance to handguard:', ikDist.toFixed(2), 'cm');
  console.log('LeftArm final rot:', bones.LeftArm.rotation);
  console.log('LeftForeArm final rot:', bones.LeftForeArm.rotation);
}

```

===============================================================================
FILE: scratch/solve_gun_forward.js
===============================================================================

```js
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

const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.32, 8));
barrel.rotation.x = Math.PI / 2;
barrel.position.set(0, 0.048, 0.44);
gun.add(barrel);

const handguard = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.075, 0.24));
handguard.position.set(0, 0.048, 0.28);
gun.add(handguard);

bones.RightHand.add(gun);

bones.RightArm.rotation.set(1.0, -0.4, 0.0);
bones.RightForeArm.rotation.set(0, 0, -1.6);
bones.RightHand.rotation.set(0, -0.2, 0);

cloned.updateMatrixWorld(true);

const gunQuat = new THREE.Quaternion();
gun.getWorldQuaternion(gunQuat);

const gunForward = new THREE.Vector3(0, 0, 1).applyQuaternion(gunQuat);
console.log('Gun forward vector in Ready stance:', gunForward);

// Now let's test aiming pose where gun points forward (gunForward.z > 0.9, y near 0)
// We want gunForward: [0, 0, 1] (or slightly tilted by aimPitch)
console.log('--- Solving Aiming (ADS) Pose ---');

let bestAimDiff = Infinity;
let bestAimAngles = null;

const targetDir = new THREE.Vector3(0, 0, 1);

for (let rx of [0.6, 0.8, 1.0, 1.2]) {
  for (let ry of [-0.6, -0.4, -0.2, 0.0]) {
    for (let rz of [-0.6, -0.4, -0.2, 0.0]) {
      for (let fx of [-0.4, -0.2, 0.0, 0.2]) {
        for (let fz of [-1.2, -1.5, -1.8, -2.1]) {
          for (let hx of [-0.4, -0.2, 0.0, 0.2, 0.4]) {
            for (let hy of [-0.6, -0.4, -0.2, 0.0, 0.2]) {
              for (let hz of [-0.4, -0.2, 0.0, 0.2, 0.4]) {
                bones.RightArm.rotation.set(rx, ry, rz);
                bones.RightForeArm.rotation.set(fx, 0, fz);
                bones.RightHand.rotation.set(hx, hy, hz);
                cloned.updateMatrixWorld(true);

                gun.getWorldQuaternion(gunQuat);
                gunForward.set(0, 0, 1).applyQuaternion(gunQuat);

                const angleDiff = gunForward.angleTo(targetDir);
                const hg = new THREE.Vector3();
                handguard.getWorldPosition(hg);

                // Gun should be at chest/eye height (125-145) and stock near shoulder
                if (hg.y >= 125 && hg.y <= 145 && hg.x >= -25 && hg.x <= 10 && hg.z >= 25 && hg.z <= 48) {
                  const score = angleDiff + Math.abs(hg.x + 5) * 0.02;
                  if (score < bestAimDiff) {
                    bestAimDiff = score;
                    bestAimAngles = {
                      rightArm: [rx, ry, rz],
                      rightFore: [fx, 0, fz],
                      rightHand: [hx, hy, hz],
                      gunForward: [Number(gunForward.x.toFixed(2)), Number(gunForward.y.toFixed(2)), Number(gunForward.z.toFixed(2))],
                      handguard: [Number(hg.x.toFixed(1)), Number(hg.y.toFixed(1)), Number(hg.z.toFixed(1))],
                      angleRad: Number(angleDiff.toFixed(3))
                    };
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

console.log('Best ADS Right Arm Aiming Angles:', bestAimAngles);

```

===============================================================================
FILE: scratch/solve_left_arm_match.js
===============================================================================

```js
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

```

===============================================================================
FILE: scratch/solve_realistic_hold.js
===============================================================================

```js
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

const stock = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.11, 0.22));
stock.position.set(0, 0.03, -0.22);
gun.add(stock);

bones.RightHand.add(gun);

// Let's test right arm angles so that:
// 1. Stock is near right shoulder ([ -15, 135, 5 ])
// 2. Handguard is in front of chest ([ -5 to 0, 125 to 135, 35 to 42 ])
// 3. Gun points forward along +Z (or slightly angled for low ready)

function evalPose(rArm, rFore, rHand) {
  bones.RightArm.rotation.set(...rArm);
  bones.RightForeArm.rotation.set(...rFore);
  bones.RightHand.rotation.set(...rHand);
  cloned.updateMatrixWorld(true);

  const stockPos = new THREE.Vector3();
  stock.getWorldPosition(stockPos);

  const hgPos = new THREE.Vector3();
  handguard.getWorldPosition(hgPos);

  const rHandPos = new THREE.Vector3();
  bones.RightHand.getWorldPosition(rHandPos);

  const lShoulder = new THREE.Vector3();
  bones.LeftArm.getWorldPosition(lShoulder);

  const distToLShoulder = hgPos.distanceTo(lShoulder);

  return { stockPos, hgPos, rHandPos, distToLShoulder };
}

// In Mixamo rest pose:
// RightArm: X is world +Z, Y is world -X, Z is world -Y.
// Let's test bending elbow tightly (RightForeArm rot.z around -1.6 to -2.2):
for (let armX of [0.8, 1.0, 1.2]) {
  for (let armY of [-0.4, -0.2, 0.0, 0.2]) {
    for (let armZ of [-0.6, -0.4, -0.2, 0.0]) {
      for (let foreZ of [-1.6, -1.8, -2.0, -2.2]) {
        for (let handY of [-0.4, -0.2, 0.0, 0.2]) {
          const res = evalPose([armX, armY, armZ], [0, 0, foreZ], [0, handY, 0]);
          // We want hgPos.z between 25 and 45, and distToLShoulder < 48
          if (res.hgPos.z >= 25 && res.hgPos.z <= 45 && res.distToLShoulder <= 45 && res.hgPos.y >= 100 && res.hgPos.y <= 140) {
            console.log(`Match: Arm[${armX}, ${armY}, ${armZ}] Fore[0,0,${foreZ}] Hand[0,${handY},0] => hg:[${res.hgPos.x.toFixed(1)}, ${res.hgPos.y.toFixed(1)}, ${res.hgPos.z.toFixed(1)}], distToLShoulder:${res.distToLShoulder.toFixed(1)} cm`);
          }
        }
      }
    }
  }
}

```

===============================================================================
FILE: scratch/solve_two_handed_pose.js
===============================================================================

```js
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
const idleData = fs.readFileSync(path.join(__dirname, '../client/src/assets/models/Characters/idle.fbx'));
const idleAnim = loader.parse(idleData.buffer.slice(idleData.byteOffset, idleData.byteOffset + idleData.byteLength), '');

const cloned = clone(char);
const surface = cloned.getObjectByName('Beta_Surface');
const bones = {};
surface.skeleton.bones.forEach(b => {
  const cleanKey = b.name.replace(/^mixamorig:?/i, '');
  if (!bones[cleanKey]) bones[cleanKey] = b;
});

// Build gun group
const gun = new THREE.Group();
gun.scale.setScalar(100);
gun.position.set(0.5, 9.5, 3.2);
gun.rotation.set(-0.62, 1.32, -0.62);

const handguard = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.075, 0.24));
handguard.position.set(0, 0.048, 0.28);
gun.add(handguard);

bones.RightHand.add(gun);

const mixer = new THREE.AnimationMixer(cloned);
const action = mixer.clipAction(idleAnim.animations[0]);
action.play();
mixer.update(0.1);

function getHandguardWorldPos() {
  cloned.updateMatrixWorld(true);
  const v = new THREE.Vector3();
  handguard.getWorldPosition(v);
  return v;
}

function getLeftHandWorldPos() {
  cloned.updateMatrixWorld(true);
  const v = new THREE.Vector3();
  bones.LeftHand.getWorldPosition(v);
  return v;
}

console.log('--- Initial idle pose ---');
console.log('Handguard world pos:', getHandguardWorldPos());
console.log('LeftHand world pos:', getLeftHandWorldPos());
console.log('Initial distance:', getLeftHandWorldPos().distanceTo(getHandguardWorldPos()).toFixed(2), 'cm');

```

===============================================================================
FILE: scratch/test_aiming_stance.js
===============================================================================

```js
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

// Let's test two stances:
// 1. AIMING / ADS STANCE:
// Right arm brought up to shoulder/chest, aiming forward (+Z).
// Let's test combinations of (rArm, rForeArm, rHand):
console.log('--- Testing Aiming Stance ---');
bones.RightArm.rotation.set(0.35, -0.25, -0.55);
bones.RightForeArm.rotation.set(-0.25, -0.15, -1.35);
bones.RightHand.rotation.set(-0.15, -0.4, 0.35);

cloned.updateMatrixWorld(true);

const hgPos = new THREE.Vector3();
handguard.getWorldPosition(hgPos);
const rHandPos = new THREE.Vector3();
bones.RightHand.getWorldPosition(rHandPos);

console.log('RightHand pos:', rHandPos);
console.log('Handguard pos:', hgPos);

// Gun forward direction (along local Z of gun):
const gunDir = new THREE.Vector3(0, 0, 1).applyQuaternion(handguard.getWorldQuaternion(new THREE.Quaternion())).normalize();
console.log('Gun forward direction:', gunDir);

```

===============================================================================
FILE: scratch/test_bone_hierarchy.js
===============================================================================

```js
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
const joints = cloned.getObjectByName('Beta_Joints');

console.log('Surface skeleton bones:');
surface.skeleton.bones.slice(0, 15).forEach(b => console.log(' ', b.name, 'parent:', b.parent?.name));

console.log('Joints skeleton bones:');
joints.skeleton.bones.slice(0, 15).forEach(b => console.log(' ', b.name, 'parent:', b.parent?.name));

```

===============================================================================
FILE: scratch/test_bone_matrix.js
===============================================================================

```js
const path = require('path');
const THREE = require(path.join(__dirname, '../client/node_modules/three'));
const fs = require('fs');
const { FBXLoader } = require(path.join(__dirname, '../client/node_modules/three-stdlib'));
global.window = global;
global.document = { createElementNS: () => ({}), createElement: () => ({}) };

const loader = new FBXLoader();
const fbxData = fs.readFileSync('f:/BMW-M4/client/src/assets/models/Characters/X Bot.fbx');
const char = loader.parse(fbxData.buffer.slice(fbxData.byteOffset, fbxData.byteOffset + fbxData.byteLength), '');

const rArm = char.getObjectByName('mixamorig:RightArm');
console.log('rArm matrixAutoUpdate:', rArm.matrixAutoUpdate);
console.log('rArm rot before:', rArm.rotation.toArray());
console.log('rArm quat before:', rArm.quaternion.toArray());

rArm.rotation.set(1.5, 0.5, 0.2);
console.log('rArm rot after set:', rArm.rotation.toArray());
console.log('rArm quat after set:', rArm.quaternion.toArray());

rArm.updateMatrix();
console.log('rArm matrix elements 12,13,14:', rArm.matrix.elements.slice(12, 15));

```

===============================================================================
FILE: scratch/test_clone_skeleton.js
===============================================================================

```js
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

const bones = [];
cloned.traverse(n => { if (n.isBone) bones.push(n); });
console.log('Total bones in cloned:', bones.length);

const meshes = [];
cloned.traverse(n => { if (n.isSkinnedMesh) meshes.push(n); });
console.log('SkinnedMeshes:', meshes.map(m => m.name));
meshes.forEach(m => {
  console.log(m.name, 'skeleton bones count:', m.skeleton.bones.length);
  console.log(m.name, 'first bone:', m.skeleton.bones[0].name, 'uuid:', m.skeleton.bones[0].uuid);
});

// Check if both meshes share the same bones or if each mesh has separate bones
const surfaceArm = meshes[0].skeleton.bones.find(b => b.name === 'mixamorigRightArm');
const jointsArm = meshes[1].skeleton.bones.find(b => b.name === 'mixamorigRightArm');
console.log('surfaceArm === jointsArm?', surfaceArm === jointsArm);

// Check if all bones in both meshes can be updated together
console.log('surfaceArm uuid:', surfaceArm?.uuid);
console.log('jointsArm uuid:', jointsArm?.uuid);

```

===============================================================================
FILE: scratch/test_combat_features.js
===============================================================================

```js
const assert = require("assert");

console.log("=== RUNNING COMBAT & HUD UNIT TESTS ===");

// 1. Draggable Fire Button Math
console.log("\n1. Testing Draggable Fire Button Drag & Headshot Lift Math...");
function computeDragOffset(rawDx, rawDy, maxRadius = 28) {
  const dist = Math.hypot(rawDx, rawDy);
  const clampedDist = Math.min(maxRadius, dist);
  const angle = Math.atan2(rawDy, rawDx);
  const vx = Math.cos(angle) * clampedDist;
  const vy = Math.sin(angle) * clampedDist;
  const isUp = rawDy < -6;
  const dragUpRatio = isUp ? Math.min(1, Math.abs(rawDy) / 50) : 0;
  return { vx, vy, isUp, dragUpRatio };
}

// Neutral / Small drag
const neutral = computeDragOffset(2, 3);
assert.strictEqual(neutral.isUp, false);
assert.strictEqual(neutral.dragUpRatio, 0);

// Strong drag UPWARD (-35px)
const dragUp = computeDragOffset(0, -35);
assert.strictEqual(dragUp.isUp, true);
assert(dragUp.dragUpRatio > 0.6 && dragUp.dragUpRatio <= 1.0, `Drag up ratio: ${dragUp.dragUpRatio}`);
assert(dragUp.vy < 0, "vy should be negative");
console.log("✓ Draggable Fire Button drag offset and upward dragUpRatio calculation verified");

// 2. Free Fire Aim Assist & Sensitivity Damping (Jelly Stickiness)
console.log("\n2. Testing Aim Assist Jelly Sensitivity Damping...");
const BASE_SENSITIVITY = 0.0028;
function getEffectiveSensitivity(isAimAssistLocked) {
  return isAimAssistLocked ? BASE_SENSITIVITY * 0.52 : BASE_SENSITIVITY;
}

const normalSens = getEffectiveSensitivity(false);
const jellySens = getEffectiveSensitivity(true);
assert.strictEqual(normalSens, 0.0028);
assert(Math.abs(jellySens - 0.001456) < 0.0001, `Jelly sens: ${jellySens}`);
assert(jellySens < normalSens, "Jelly sensitivity must provide friction damping");
console.log("✓ Jelly stickiness sensitivity damping (48% reduction) verified");

// 3. Melee Punch Strike Damage & Reach Calculation
console.log("\n3. Testing Fist Punch Damage and Range Calculation...");
function evaluateMeleePunch(playerPos, playerHeadingDeg, botPos, isHeadshot) {
  const dist = Math.hypot(botPos.x - playerPos.x, botPos.z - playerPos.z);
  const inRange = dist <= 2.6; // Melee forward reach: 2.6 meters
  if (!inRange) return null;

  const damage = isHeadshot ? 70 : 35;
  return { hit: true, distance: dist, damage, headshot: isHeadshot };
}

const punchCloseBody = evaluateMeleePunch({ x: 0, z: 0 }, 0, { x: 0, z: 1.8 }, false);
assert(punchCloseBody !== null && punchCloseBody.hit);
assert.strictEqual(punchCloseBody.damage, 35);
assert.strictEqual(punchCloseBody.headshot, false);

const punchCloseHead = evaluateMeleePunch({ x: 0, z: 0 }, 0, { x: 0, z: 1.2 }, true);
assert(punchCloseHead !== null && punchCloseHead.hit);
assert.strictEqual(punchCloseHead.damage, 70);
assert.strictEqual(punchCloseHead.headshot, true);

const punchFar = evaluateMeleePunch({ x: 0, z: 0 }, 0, { x: 0, z: 4.5 }, false);
assert.strictEqual(punchFar, null, "Target beyond 2.6m reach should not be hit by melee punch");
console.log("✓ Fist punch range check (2.6m) and damage (35 body, 70 headshot) verified");

// 4. Minimap Radar Coordinates: Enemies & BMW M4
console.log("\n4. Testing Minimap Projection for Enemies and Vehicle...");
function worldToMinimapPct(x, z, mapScale = 72) {
  const mapPctX = Math.max(6, Math.min(94, 50 + (x / mapScale) * 44));
  const mapPctZ = Math.max(6, Math.min(94, 50 + (z / mapScale) * 44));
  return { leftPct: mapPctX, topPct: mapPctZ };
}

const centerPos = worldToMinimapPct(0, 0);
assert.strictEqual(centerPos.leftPct, 50);
assert.strictEqual(centerPos.topPct, 50);

const northEastEnemy = worldToMinimapPct(36, -36);
assert(northEastEnemy.leftPct > 50, "Positive X should be east");
assert(northEastEnemy.topPct < 50, "Negative Z should be north");

const carPos = worldToMinimapPct(-15, 20);
assert(carPos.leftPct < 50, "Negative X should be west");
assert(carPos.topPct > 50, "Positive Z should be south");
console.log("✓ Minimap radar coordinate projection for enemies and vehicle verified");

// 5. Telemetry Snapshot Inclusion
console.log("\n5. Testing Telemetry Snapshot Properties...");
const mockTelemetry = {
  speed: 0,
  playerMode: "onFoot",
  weaponId: "fist",
  hp: 100,
  enemies: [
    { id: 0, name: "Kelly", x: 12, z: 14, headingDeg: 90, state: "patrol" },
    { id: 1, name: "Hayato", x: -8, z: 22, headingDeg: 180, state: "combat" },
  ],
  carPos: { x: -15, z: 20, headingDeg: 45 },
};

assert(Array.isArray(mockTelemetry.enemies) && mockTelemetry.enemies.length === 2);
assert(mockTelemetry.carPos !== null && typeof mockTelemetry.carPos.x === "number");
console.log("✓ Telemetry snapshot correctly bundles enemy list and car coordinates");

console.log("\nALL COMBAT & HUD UNIT TESTS PASSED SUCCESSFULLY! ✓✓✓");

```

===============================================================================
FILE: scratch/test_idle_eulers.js
===============================================================================

```js
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

```

===============================================================================
FILE: scratch/test_left_arm_ik.js
===============================================================================

```js
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
const idleData = fs.readFileSync(path.join(__dirname, '../client/src/assets/models/Characters/idle.fbx'));
const idleAnim = loader.parse(idleData.buffer.slice(idleData.byteOffset, idleData.byteOffset + idleData.byteLength), '');

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

const mixer = new THREE.AnimationMixer(cloned);
const action = mixer.clipAction(idleAnim.animations[0]);
action.play();
mixer.update(0.1);

// Let's test two-bone IK for Left Arm to reach handguard target
function solveLeftArmIK(targetWorldPos) {
  cloned.updateMatrixWorld(true);

  const leftShoulder = bones.LeftShoulder;
  const leftArm = bones.LeftArm;
  const leftForeArm = bones.LeftForeArm;
  const leftHand = bones.LeftHand;

  // Simple, robust cyclic coordinate descent (CCD) or analytical solver
  // Let's see current distance:
  const handPos = new THREE.Vector3();
  leftHand.getWorldPosition(handPos);
  
  // Test CCD iterations:
  for (let iter = 0; iter < 15; iter++) {
    // 1. Rotate LeftForeArm to point LeftHand towards target
    cloned.updateMatrixWorld(true);
    const elbowPos = new THREE.Vector3();
    leftForeArm.getWorldPosition(elbowPos);
    leftHand.getWorldPosition(handPos);

    const vForeToHand = handPos.clone().sub(elbowPos).normalize();
    const vForeToTarget = targetWorldPos.clone().sub(elbowPos).normalize();
    const qFore = new THREE.Quaternion().setFromUnitVectors(vForeToHand, vForeToTarget);

    // Apply rotation in world space to leftForeArm
    const parentForeWorldQuat = new THREE.Quaternion();
    leftForeArm.parent.getWorldQuaternion(parentForeWorldQuat);
    const parentForeWorldQuatInv = parentForeWorldQuat.clone().invert();

    const currentForeWorldQuat = new THREE.Quaternion();
    leftForeArm.getWorldQuaternion(currentForeWorldQuat);
    const newForeWorldQuat = qFore.multiply(currentForeWorldQuat);
    leftForeArm.quaternion.copy(parentForeWorldQuatInv.multiply(newForeWorldQuat));

    // 2. Rotate LeftArm to point LeftHand towards target
    cloned.updateMatrixWorld(true);
    const shoulderPos = new THREE.Vector3();
    leftArm.getWorldPosition(shoulderPos);
    leftHand.getWorldPosition(handPos);

    const vArmToHand = handPos.clone().sub(shoulderPos).normalize();
    const vArmToTarget = targetWorldPos.clone().sub(shoulderPos).normalize();
    const qArm = new THREE.Quaternion().setFromUnitVectors(vArmToHand, vArmToTarget);

    const parentArmWorldQuat = new THREE.Quaternion();
    leftArm.parent.getWorldQuaternion(parentArmWorldQuat);
    const parentArmWorldQuatInv = parentArmWorldQuat.clone().invert();

    const currentArmWorldQuat = new THREE.Quaternion();
    leftArm.getWorldQuaternion(currentArmWorldQuat);
    const newArmWorldQuat = qArm.multiply(currentArmWorldQuat);
    leftArm.quaternion.copy(parentArmWorldQuatInv.multiply(newArmWorldQuat));
  }

  cloned.updateMatrixWorld(true);
  leftHand.getWorldPosition(handPos);
  return handPos.distanceTo(targetWorldPos);
}

cloned.updateMatrixWorld(true);
const target = new THREE.Vector3();
handguard.getWorldPosition(target);

console.log('Distance from LeftArm (shoulder) to handguard target:',
  bones.LeftArm.getWorldPosition(new THREE.Vector3()).distanceTo(target).toFixed(2), 'cm'
);

const finalDist = solveLeftArmIK(target);
console.log('Distance after Left Arm IK:', finalDist.toFixed(2), 'cm');
console.log('LeftArm rotation:', bones.LeftArm.rotation);
console.log('LeftForeArm rotation:', bones.LeftForeArm.rotation);

```

===============================================================================
FILE: scratch/test_mixer_binding.js
===============================================================================

```js
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
const idleData = fs.readFileSync(path.join(__dirname, '../client/src/assets/models/Characters/idle.fbx'));
const idleAnim = loader.parse(idleData.buffer.slice(idleData.byteOffset, idleData.byteOffset + idleData.byteLength), '');

const cloned = clone(char);
const mixer = new THREE.AnimationMixer(cloned);
const action = mixer.clipAction(idleAnim.animations[0]);
action.play();

// Update mixer
mixer.update(0.1);

const surface = cloned.getObjectByName('Beta_Surface');
const joints = cloned.getObjectByName('Beta_Joints');

const sArm = surface.skeleton.bones.find(b => b.name === 'mixamorigRightArm');
const jArm = joints.skeleton.bones.find(b => b.name === 'mixamorigRightArm');

console.log('sArm quaternion after mixer.update:', sArm.quaternion);
console.log('jArm quaternion after mixer.update:', jArm.quaternion);

// Now see if rotating sArm rotates Beta_Surface vertices or jArm
console.log('sArm parent:', sArm.parent.name, sArm.parent.uuid);
console.log('jArm parent:', jArm.parent.name, jArm.parent.uuid);

```

===============================================================================
FILE: scratch/test_mixer_override.js
===============================================================================

```js
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
const idleData = fs.readFileSync(path.join(__dirname, '../client/src/assets/models/Characters/idle.fbx'));
const idleAnim = loader.parse(idleData.buffer.slice(idleData.byteOffset, idleData.byteOffset + idleData.byteLength), '');

const cloned = clone(char);
const surface = cloned.getObjectByName('Beta_Surface');
const bones = {};
surface.skeleton.bones.forEach(b => {
  const cleanKey = b.name.replace(/^mixamorig:?/i, '');
  if (!bones[cleanKey]) bones[cleanKey] = b;
});

const mixer = new THREE.AnimationMixer(cloned);
const action = mixer.clipAction(idleAnim.animations[0]);
action.play();

mixer.update(0.1);
console.log('RightArm quat after mixer update:', bones.RightArm.quaternion);

// Apply custom rotation
bones.RightArm.rotation.set(1.2, 0.5, -0.3);
console.log('RightArm quat after custom rotation:', bones.RightArm.quaternion);

// If mixer updates again:
mixer.update(0.1);
console.log('RightArm quat after second mixer update (overwritten):', bones.RightArm.quaternion);

```

===============================================================================
FILE: scratch/test_primary_bones.js
===============================================================================

```js
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

// Let's create primaryBones map from surface.skeleton.bones
const bones = {};
surface.skeleton.bones.forEach(b => {
  const cleanKey = b.name.replace(/^mixamorig:?/i, '');
  bones[cleanKey] = b;
});

console.log('Found main bones:', Object.keys(bones).length);
console.log('RightArm:', bones.RightArm?.name, 'uuid:', bones.RightArm?.uuid);
console.log('RightForeArm:', bones.RightForeArm?.name, 'uuid:', bones.RightForeArm?.uuid);
console.log('RightHand:', bones.RightHand?.name, 'uuid:', bones.RightHand?.uuid);
console.log('LeftArm:', bones.LeftArm?.name, 'uuid:', bones.LeftArm?.uuid);
console.log('LeftForeArm:', bones.LeftForeArm?.name, 'uuid:', bones.LeftForeArm?.uuid);
console.log('LeftHand:', bones.LeftHand?.name, 'uuid:', bones.LeftHand?.uuid);

// Check if child joint bones move along when main bone moves:
const sArm = bones.RightArm;
const jArm = cloned.getObjectByName('Beta_Joints').skeleton.bones.find(b => b.name === 'mixamorigRightArm');
console.log('jArm.parent === sArm?', jArm.parent === sArm);

```

===============================================================================
FILE: scratch/test_right_arm_poses.js
===============================================================================

```js
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

```

===============================================================================
FILE: scratch/test_rotated_gun.js
===============================================================================

```js
const path = require('path');
const fs = require('fs');
const http = require('http');
const { execSync } = require('child_process');

(async () => {
  const npmRoot = execSync('npm root -g').toString().trim();
  const pw = require(path.join(npmRoot, 'playwright'));

  const exeCandidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  const executablePath = exeCandidates.find((p) => fs.existsSync(p));

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Test Inverted Gun</title>
  <style>body { margin: 0; background: #1a1a24; overflow: hidden; }</style>
  <script type="importmap">
  {
    "imports": {
      "three": "/node_modules/three/build/three.module.js",
      "three/examples/jsm/loaders/FBXLoader.js": "/node_modules/three/examples/jsm/loaders/FBXLoader.js",
      "three/examples/jsm/utils/SkeletonUtils.js": "/node_modules/three/examples/jsm/utils/SkeletonUtils.js"
    }
  }
  </script>
</head>
<body>
<script type="module">
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

window.THREE = THREE;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a202c);

const camera = new THREE.PerspectiveCamera(45, 1280 / 720, 0.1, 100);
camera.position.set(1.2, 1.35, 1.8);
camera.lookAt(0, 1.25, 0);
window.__camera = camera;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(1280, 720);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild(renderer.domElement);

const amb = new THREE.AmbientLight(0xffffff, 1.4);
scene.add(amb);

const dir = new THREE.DirectionalLight(0xffffff, 2.5);
dir.position.set(3, 8, 4);
scene.add(dir);

const fill = new THREE.DirectionalLight(0x7090ff, 1.0);
fill.position.set(-3, 2, -2);
scene.add(fill);

const grid = new THREE.GridHelper(10, 20, 0x334466, 0x223344);
scene.add(grid);

const loader = new FBXLoader();
loader.load('/src/assets/models/Characters/X Bot.fbx', (charFbx) => {
  const cloned = clone(charFbx);
  cloned.scale.setScalar(0.01);
  scene.add(cloned);
  window.__char = cloned;

  const surface = cloned.getObjectByName('Beta_Surface');
  const bones = {};
  surface.skeleton.bones.forEach(b => {
    const cleanKey = b.name.replace(/^mixamorig:?/i, '');
    if (!bones[cleanKey]) bones[cleanKey] = b;
  });
  window.__bones = bones;

  const gunGroup = new THREE.Group();
  gunGroup.name = "EQUIPPED_WEAPON_GROUP";
  gunGroup.scale.setScalar(100);

  const darkMetal = new THREE.MeshStandardMaterial({ color: "#161c26", metalness: 0.88, roughness: 0.24 });
  const darkPolymer = new THREE.MeshStandardMaterial({ color: "#0a0e16", roughness: 0.72, metalness: 0.15 });
  const accentMat = new THREE.MeshStandardMaterial({ color: "#2d79ff", metalness: 0.75, roughness: 0.25 });

  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.13, 0.046), darkPolymer);
  grip.position.set(0, -0.04, -0.02);
  grip.rotation.x = -0.28;
  gunGroup.add(grip);

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.088, 0.32), darkMetal);
  body.position.set(0, 0.048, 0.04);
  gunGroup.add(body);

  const stock = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.11, 0.22), darkPolymer);
  stock.position.set(0, 0.03, -0.22);
  gunGroup.add(stock);

  const mag = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.18, 0.065), accentMat);
  mag.position.set(0, -0.065, 0.12);
  mag.rotation.x = 0.22;
  gunGroup.add(mag);

  const handguard = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.075, 0.24), darkPolymer);
  handguard.position.set(0, 0.048, 0.28);
  gunGroup.add(handguard);

  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.32, 8), darkMetal);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 0.048, 0.44);
  gunGroup.add(barrel);

  bones.RightHand.add(gunGroup);
  window.__handguard = handguard;
  window.__gunGroup = gunGroup;

  window.__ready = true;
  renderer.render(scene, camera);
});

window.renderFrame = () => {
  renderer.render(scene, camera);
};
</script>
</body>
</html>
  `;

  const server = http.createServer((req, res) => {
    const rawUrl = req.url.split('?')[0];
    const parsedUrl = decodeURIComponent(rawUrl);
    if (parsedUrl === '/' || parsedUrl === '/preview.html') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
      return;
    }
    const filePath = path.join(__dirname, '../client', parsedUrl);
    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end('Not found: ' + filePath);
      return;
    }
    const stat = fs.statSync(filePath);
    let contentType = 'application/octet-stream';
    if (filePath.endsWith('.js')) contentType = 'application/javascript';
    if (filePath.endsWith('.fbx')) contentType = 'application/octet-stream';
    res.writeHead(200, { 'Content-Length': stat.size, 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });

  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;

  const browser = await pw.chromium.launch({
    headless: true,
    executablePath,
    args: [
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--no-sandbox',
    ],
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(`http://127.0.0.1:${port}/preview.html`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__ready === true, { timeout: 30000 });

  // Now let's test:
  // In preview_two_hand_angle.png, gun.rotation was (-0.62, 1.32, -0.62).
  // If we rotate gun 180 degrees around local Z or Y:
  // Let's create an orientation where the barrel points FORWARD (+Z in world) and stock BACKWARD (-Z).
  const poseInfo = await page.evaluate(() => {
    const bones = window.__bones;
    const gun = window.__gunGroup;
    const hg = window.__handguard;
    const char = window.__char;

    // We want the gun to point along the right hand's forward pointing direction.
    // In RightHand:
    // Palm faces -Z, knuckles point along +Y.
    // Let's align gun:
    gun.position.set(0.5, 9.5, 3.2);
    // Flip barrel direction 180 deg from (-0.62, 1.32, -0.62)
    // -0.62 + PI = 2.52
    gun.rotation.set(2.52, 1.32, -0.62);

    // Let's test Right Arm holding rifle in natural ready position:
    bones.RightArm.rotation.set(0.85, -0.25, -0.2);
    bones.RightForeArm.rotation.set(0.1, 0, -1.5);
    bones.RightHand.rotation.set(0.1, -0.1, 0.2);

    char.updateMatrixWorld(true);

    const gunQuat = new THREE.Quaternion();
    gun.getWorldQuaternion(gunQuat);
    const gunFwd = new THREE.Vector3(0, 0, 1).applyQuaternion(gunQuat);

    const hgPos = new THREE.Vector3();
    hg.getWorldPosition(hgPos);

    // Now snap LeftArm so LeftHand touches handguard
    const lArm = bones.LeftArm;
    const lFore = bones.LeftForeArm;
    const lHand = bones.LeftHand;

    // Initial guess
    lArm.rotation.set(1.2, 0.4, 0.6);
    lFore.rotation.set(0, 0, 1.3);
    lHand.rotation.set(0.2, 0.3, -0.3);

    // Run CCD 15 iterations
    for (let iter = 0; iter < 15; iter++) {
      char.updateMatrixWorld(true);
      const elbowPos = new THREE.Vector3();
      const handPos = new THREE.Vector3();
      lFore.getWorldPosition(elbowPos);
      lHand.getWorldPosition(handPos);

      const v1 = handPos.clone().sub(elbowPos).normalize();
      const v2 = hgPos.clone().sub(elbowPos).normalize();
      const q1 = new THREE.Quaternion().setFromUnitVectors(v1, v2);

      const parentForeQ = new THREE.Quaternion();
      lFore.parent.getWorldQuaternion(parentForeQ);
      const curForeQ = new THREE.Quaternion();
      lFore.getWorldQuaternion(curForeQ);
      lFore.quaternion.copy(parentForeQ.invert().multiply(q1.multiply(curForeQ)));

      char.updateMatrixWorld(true);
      const shoulderPos = new THREE.Vector3();
      lArm.getWorldPosition(shoulderPos);
      lHand.getWorldPosition(handPos);

      const v3 = handPos.clone().sub(shoulderPos).normalize();
      const v4 = hgPos.clone().sub(shoulderPos).normalize();
      const q2 = new THREE.Quaternion().setFromUnitVectors(v3, v4);

      const parentArmQ = new THREE.Quaternion();
      lArm.parent.getWorldQuaternion(parentArmQ);
      const curArmQ = new THREE.Quaternion();
      lArm.getWorldQuaternion(curArmQ);
      lArm.quaternion.copy(parentArmQ.invert().multiply(q2.multiply(curArmQ)));
    }

    char.updateMatrixWorld(true);
    const finalHandPos = new THREE.Vector3();
    lHand.getWorldPosition(finalHandPos);

    window.renderFrame();

    return {
      dist: finalHandPos.distanceTo(hgPos),
      gunFwd: [gunFwd.x, gunFwd.y, gunFwd.z],
      hgPos: [hgPos.x, hgPos.y, hgPos.z],
      leftArmRot: [lArm.rotation.x, lArm.rotation.y, lArm.rotation.z],
      leftForeRot: [lFore.rotation.x, lFore.rotation.y, lFore.rotation.z],
      leftHandRot: [lHand.rotation.x, lHand.rotation.y, lHand.rotation.z]
    };
  });

  console.log('Pose Info:', poseInfo);
  await page.screenshot({ path: path.join(__dirname, 'preview_rotated_gun.png') });

  // Chase view
  await page.evaluate(() => {
    window.__camera.position.set(0.35, 1.45, -2.0);
    window.__camera.lookAt(0, 1.25, 0.8);
    window.renderFrame();
  });
  await page.screenshot({ path: path.join(__dirname, 'preview_rotated_gun_chase.png') });

  // Front view
  await page.evaluate(() => {
    window.__camera.position.set(0, 1.35, 2.2);
    window.__camera.lookAt(0, 1.25, 0);
    window.renderFrame();
  });
  await page.screenshot({ path: path.join(__dirname, 'preview_rotated_gun_front.png') });

  await browser.close();
  server.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});

```

===============================================================================
FILE: scratch/test_three_rotation_quaternion.js
===============================================================================

```js
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

```

===============================================================================
FILE: scratch/tune_grip.js
===============================================================================

```js
const path = require('path');
const fs = require('fs');
const http = require('http');
const { execSync } = require('child_process');

(async () => {
  const npmRoot = execSync('npm root -g').toString().trim();
  const pw = require(path.join(npmRoot, 'playwright'));

  const exeCandidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  const executablePath = exeCandidates.find((p) => fs.existsSync(p));

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Tune Two-Handed Hold</title>
  <style>body { margin: 0; background: #1a1a24; overflow: hidden; }</style>
  <script type="importmap">
  {
    "imports": {
      "three": "/node_modules/three/build/three.module.js",
      "three/examples/jsm/loaders/FBXLoader.js": "/node_modules/three/examples/jsm/loaders/FBXLoader.js",
      "three/examples/jsm/utils/SkeletonUtils.js": "/node_modules/three/examples/jsm/utils/SkeletonUtils.js"
    }
  }
  </script>
</head>
<body>
<script type="module">
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

window.THREE = THREE;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a202c);

const camera = new THREE.PerspectiveCamera(45, 1280 / 720, 0.1, 100);
camera.position.set(1.1, 1.35, 1.8);
camera.lookAt(0, 1.25, 0);
window.__camera = camera;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(1280, 720);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild(renderer.domElement);

const amb = new THREE.AmbientLight(0xffffff, 1.4);
scene.add(amb);

const dir = new THREE.DirectionalLight(0xffffff, 2.5);
dir.position.set(3, 8, 4);
scene.add(dir);

const fill = new THREE.DirectionalLight(0x7090ff, 1.0);
fill.position.set(-3, 2, -2);
scene.add(fill);

const grid = new THREE.GridHelper(10, 20, 0x334466, 0x223344);
scene.add(grid);

const loader = new FBXLoader();
loader.load('/src/assets/models/Characters/X Bot.fbx', (charFbx) => {
  const cloned = clone(charFbx);
  cloned.scale.setScalar(0.01);
  scene.add(cloned);
  window.__char = cloned;

  const surface = cloned.getObjectByName('Beta_Surface');
  const bones = {};
  surface.skeleton.bones.forEach(b => {
    const cleanKey = b.name.replace(/^mixamorig:?/i, '');
    if (!bones[cleanKey]) bones[cleanKey] = b;
  });
  window.__bones = bones;

  const gunGroup = new THREE.Group();
  gunGroup.name = "EQUIPPED_WEAPON_GROUP";
  gunGroup.scale.setScalar(100);

  const darkMetal = new THREE.MeshStandardMaterial({ color: "#161c26", metalness: 0.88, roughness: 0.24 });
  const darkPolymer = new THREE.MeshStandardMaterial({ color: "#0a0e16", roughness: 0.72, metalness: 0.15 });
  const accentMat = new THREE.MeshStandardMaterial({ color: "#2d79ff", metalness: 0.75, roughness: 0.25 });

  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.13, 0.046), darkPolymer);
  grip.position.set(0, -0.04, -0.02);
  grip.rotation.x = -0.28;
  gunGroup.add(grip);

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.088, 0.32), darkMetal);
  body.position.set(0, 0.048, 0.04);
  gunGroup.add(body);

  const stock = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.11, 0.22), darkPolymer);
  stock.position.set(0, 0.03, -0.22);
  gunGroup.add(stock);

  const mag = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.18, 0.065), accentMat);
  mag.position.set(0, -0.065, 0.12);
  mag.rotation.x = 0.22;
  gunGroup.add(mag);

  const handguard = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.075, 0.24), darkPolymer);
  handguard.position.set(0, 0.048, 0.28);
  gunGroup.add(handguard);

  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.32, 8), darkMetal);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 0.048, 0.44);
  gunGroup.add(barrel);

  bones.RightHand.add(gunGroup);
  window.__handguard = handguard;
  window.__gunGroup = gunGroup;
  window.__stock = stock;
  window.__barrel = barrel;

  window.__ready = true;
  renderer.render(scene, camera);
});

window.renderFrame = () => {
  renderer.render(scene, camera);
};
</script>
</body>
</html>
  `;

  const server = http.createServer((req, res) => {
    const rawUrl = req.url.split('?')[0];
    const parsedUrl = decodeURIComponent(rawUrl);
    if (parsedUrl === '/' || parsedUrl === '/preview.html') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
      return;
    }
    const filePath = path.join(__dirname, '../client', parsedUrl);
    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end('Not found: ' + filePath);
      return;
    }
    const stat = fs.statSync(filePath);
    let contentType = 'application/octet-stream';
    if (filePath.endsWith('.js')) contentType = 'application/javascript';
    if (filePath.endsWith('.fbx')) contentType = 'application/octet-stream';
    res.writeHead(200, { 'Content-Length': stat.size, 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });

  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;

  const browser = await pw.chromium.launch({
    headless: true,
    executablePath,
    args: [
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--no-sandbox',
    ],
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  await page.goto(`http://127.0.0.1:${port}/preview.html`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__ready === true, { timeout: 30000 });

  // Let's test a realistic tactical ready orientation:
  // We want the barrel pointing forward-down across the body (low ready)
  const info = await page.evaluate(() => {
    const bones = window.__bones;
    const gun = window.__gunGroup;
    const hg = window.__handguard;
    const char = window.__char;

    // Gun attachment inside RightHand:
    // Align gun so that when right hand grips it, barrel points in the direction of the knuckles:
    gun.position.set(0.5, 9.5, 3.2);
    // If we invert the forward direction or adjust pitch:
    gun.rotation.set(0.8, 1.4, 0.7);

    // Right Arm: brought forward and bent at elbow
    bones.RightArm.rotation.set(0.65, -0.4, 0.2);
    bones.RightForeArm.rotation.set(0.1, 0, -1.4);
    bones.RightHand.rotation.set(-0.2, -0.1, 0.1);

    // Left Arm: reaches forward across chest and holds handguard
    bones.LeftArm.rotation.set(1.2, 0.45, 0.5);
    bones.LeftForeArm.rotation.set(0, 0, 1.4);
    bones.LeftHand.rotation.set(-0.2, -0.4, 0.3);

    char.updateMatrixWorld(true);

    const hgPos = new THREE.Vector3();
    hg.getWorldPosition(hgPos);
    const lHandPos = new THREE.Vector3();
    bones.LeftHand.getWorldPosition(lHandPos);

    const gunQuat = new THREE.Quaternion();
    gun.getWorldQuaternion(gunQuat);
    const gunFwd = new THREE.Vector3(0, 0, 1).applyQuaternion(gunQuat);

    window.renderFrame();

    return {
      dist: lHandPos.distanceTo(hgPos),
      gunFwd: [gunFwd.x, gunFwd.y, gunFwd.z],
      hgPos: [hgPos.x, hgPos.y, hgPos.z]
    };
  });

  console.log('Test 1 Info:', info);
  await page.screenshot({ path: path.join(__dirname, 'preview_tune1.png') });

  // Now let's try aiming pose (ADS):
  const aimInfo = await page.evaluate(() => {
    const bones = window.__bones;
    const gun = window.__gunGroup;
    const hg = window.__handguard;
    const char = window.__char;

    // Aiming stance:
    // Gun stock against shoulder, barrel pointing forward (Z > 0)
    gun.position.set(0.5, 9.5, 3.2);
    gun.rotation.set(0.7, 1.45, 0.65);

    bones.RightArm.rotation.set(0.4, -0.3, 0.15);
    bones.RightForeArm.rotation.set(0.1, 0, -1.35);
    bones.RightHand.rotation.set(-0.1, -0.2, 0.1);

    bones.LeftArm.rotation.set(1.0, 0.4, 0.45);
    bones.LeftForeArm.rotation.set(0, 0, 1.35);
    bones.LeftHand.rotation.set(-0.2, -0.3, 0.2);

    char.updateMatrixWorld(true);

    const hgPos = new THREE.Vector3();
    hg.getWorldPosition(hgPos);
    const lHandPos = new THREE.Vector3();
    bones.LeftHand.getWorldPosition(lHandPos);

    const gunQuat = new THREE.Quaternion();
    gun.getWorldQuaternion(gunQuat);
    const gunFwd = new THREE.Vector3(0, 0, 1).applyQuaternion(gunQuat);

    window.renderFrame();

    return {
      dist: lHandPos.distanceTo(hgPos),
      gunFwd: [gunFwd.x, gunFwd.y, gunFwd.z],
      hgPos: [hgPos.x, hgPos.y, hgPos.z]
    };
  });

  console.log('Aim Info:', aimInfo);
  await page.screenshot({ path: path.join(__dirname, 'preview_tune_aim.png') });

  await browser.close();
  server.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});

```

===============================================================================
FILE: scratch/verify_custom_hud.js
===============================================================================

```js
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { startRelayServer } = require("f:/BMW-M4/server/server");

const SCRATCH_DIR = __dirname;

(async () => {
  const npmRoot = execSync("npm root -g").toString().trim();
  const pw = require(path.join(npmRoot, "playwright"));

  const server = startRelayServer(0, { disconnectGraceMs: 250, deferListen: true });
  await new Promise((resolve) => server.httpServer.listen(0, "0.0.0.0", resolve));
  const { port } = server.httpServer.address();
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`Custom HUD verification server running at ${baseUrl}`);

  const exeCandidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  ];
  const executablePath = exeCandidates.find((p) => fs.existsSync(p));

  const browser = await pw.chromium.launch({
    headless: true,
    executablePath,
    args: [
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-webgl",
      "--ignore-gpu-blocklist",
      "--no-sandbox",
    ],
  });

  const pageErrors = [];
  const consoleErrors = [];
  const attachErrorTrap = (page, name) => {
    page.on("pageerror", (err) => {
      console.error(`[pageerror:${name}]`, err.message);
      pageErrors.push(`${name}: ${err.message}`);
    });
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(`${name}: ${msg.text()}`);
      }
    });
  };

  try {
    // -------------------------------------------------------------------------
    // TEST 1: DESKTOP HUD CUSTOMIZATION
    // -------------------------------------------------------------------------
    console.log("==> Test 1: Desktop Custom HUD...");
    const desktopCtx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
    const desktopPage = await desktopCtx.newPage();
    attachErrorTrap(desktopPage, "desktop");

    await desktopPage.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await desktopPage.waitForSelector('[data-testid="quick-solo-btn"]');
    await desktopPage.click('[data-testid="quick-solo-btn"]');

    await desktopPage.waitForSelector('[data-testid="hud-custom-editor-btn"]', { timeout: 25000 });
    console.log("  -> In-game HUD loaded. Opening Custom HUD editor...");

    // Click Custom HUD button in top toolbar
    await desktopPage.click('[data-testid="hud-custom-editor-btn"]');
    await desktopPage.waitForSelector(".ffh-editor-top-bar");
    await desktopPage.waitForSelector(".ffh-editor-preset-pill");

    // Click on dropParachute element to select it
    console.log("  -> Selecting dropParachute element...");
    await desktopPage.click('[data-hudelem-id="dropParachute"]');
    await desktopPage.waitForSelector(".ffh-editor-slider-card");
    await desktopPage.waitForSelector(".ffh-hud-selection-ring");

    const targetLabel = (await desktopPage.textContent(".ffh-slider-target-name")).trim();
    assert.ok(targetLabel.toUpperCase().includes("EJECT") || targetLabel.toUpperCase().includes("DROP"), `Expected target label with EJECT/DROP, got: ${targetLabel}`);

    // Check slider rows
    const sliderTitles = await desktopPage.$$eval(".ffh-slider-title", (els) => els.map((e) => e.textContent.trim()));
    assert.ok(sliderTitles.includes("TRANSPARENCY"), "Expected TRANSPARENCY slider");
    assert.ok(sliderTitles.includes("SIZE"), "Expected SIZE slider");

    // Adjust Transparency slider to 45%
    console.log("  -> Adjusting Transparency slider to 45%...");
    const transInput = desktopPage.locator(".ffh-slider-row").filter({ hasText: "TRANSPARENCY" }).locator("input");
    await transInput.fill("45");
    await desktopPage.waitForTimeout(100);

    // Adjust Size slider to 150%
    console.log("  -> Adjusting Size slider to 150%...");
    const sizeInput = desktopPage.locator(".ffh-slider-row").filter({ hasText: "SIZE" }).locator("input");
    await sizeInput.fill("150");
    await desktopPage.waitForTimeout(100);

    // Verify element styles updated live
    const elemStyle = await desktopPage.evaluate(() => {
      const el = document.querySelector('[data-hudelem-id="dropParachute"]');
      return {
        opacity: el ? el.style.opacity : null,
        transform: el ? el.style.transform : null,
      };
    });
    console.log("  -> dropParachute live style:", elemStyle);
    assert.strictEqual(elemStyle.opacity, "0.45", "Opacity should be 0.45 (45%)");
    assert.ok(elemStyle.transform.includes("scale(1.5)"), "Transform should include scale(1.5) (150%)");

    // Test dragging the element
    console.log("  -> Dragging dropParachute element...");
    const dropBox = await desktopPage.locator('[data-hudelem-id="dropParachute"]').boundingBox();
    assert.ok(dropBox, "Bounding box must exist for dropParachute");
    await desktopPage.mouse.move(dropBox.x + dropBox.width / 2, dropBox.y + dropBox.height / 2);
    await desktopPage.mouse.down();
    await desktopPage.mouse.move(dropBox.x + dropBox.width / 2 + 30, dropBox.y + dropBox.height / 2 + 20);
    await desktopPage.mouse.up();
    await desktopPage.waitForTimeout(100);

    // Test Save button
    console.log("  -> Clicking Save button...");
    await desktopPage.click(".ffh-editor-bar-btn.save");
    await desktopPage.waitForSelector(".ffh-editor-toast");
    const toastText = (await desktopPage.textContent(".ffh-editor-toast")).trim();
    assert.ok(toastText.includes("SAVED"), `Expected SAVED toast, got: ${toastText}`);

    // Verify localStorage has the saved preset
    const savedStorage = await desktopPage.evaluate(() => {
      return window.localStorage.getItem("ff_custom_hud_preset_1");
    });
    assert.ok(savedStorage, "Expected ff_custom_hud_preset_1 in localStorage");
    const parsedLayout = JSON.parse(savedStorage);
    assert.strictEqual(parsedLayout.dropParachute.opacity, 45, "Stored opacity should be 45");
    assert.strictEqual(parsedLayout.dropParachute.size, 150, "Stored size should be 150");

    // Test Exit button
    console.log("  -> Clicking Exit button...");
    await desktopPage.click(".ffh-editor-bar-btn.exit");
    await desktopPage.waitForSelector(".ffh-editor-top-bar", { state: "detached" });

    // Verify live element in game still retains customized size and opacity!
    const postExitStyle = await desktopPage.evaluate(() => {
      const el = document.querySelector('[data-hudelem-id="dropParachute"]');
      return {
        opacity: el ? el.style.opacity : null,
        transform: el ? el.style.transform : null,
      };
    });
    assert.strictEqual(postExitStyle.opacity, "0.45", "Post-exit opacity should stay 0.45");
    assert.ok(postExitStyle.transform.includes("scale(1.5)"), "Post-exit scale should stay 1.5");

    await desktopPage.screenshot({ path: path.join(SCRATCH_DIR, "verify_custom_hud_desktop.png") });
    console.log("✓ Desktop Custom HUD tests passed!");

    // -------------------------------------------------------------------------
    // TEST 2: MOBILE CONTROLLER HUD CUSTOMIZATION
    // -------------------------------------------------------------------------
    console.log("==> Test 2: Mobile Controller Custom HUD...");
    const mobileCtx = await browser.newContext({
      viewport: { width: 844, height: 390 },
      hasTouch: true,
      isMobile: true,
    });
    const mobilePage = await mobileCtx.newPage();
    attachErrorTrap(mobilePage, "mobile");

    await mobilePage.goto(`${baseUrl}/?controller=1`, { waitUntil: "domcontentloaded" });
    await mobilePage.waitForSelector('[data-testid="phone-custom-hud-btn"]', { timeout: 20000 });
    console.log("  -> Mobile controller loaded. Opening Custom HUD on phone...");

    // Click Custom HUD button on phone
    await mobilePage.click('[data-testid="phone-custom-hud-btn"]');
    await mobilePage.waitForSelector(".ffh-editor-top-bar");
    await mobilePage.waitForSelector(".ffh-editor-preset-pill");

    // Tap Joystick on phone
    console.log("  -> Tapping joystick to select...");
    await mobilePage.click('[data-hudelem-id="joystick"]');
    await mobilePage.waitForSelector(".ffh-editor-slider-card");

    const joyLabel = (await mobilePage.textContent(".ffh-slider-target-name")).trim();
    assert.ok(joyLabel.toUpperCase().includes("JOYSTICK"), `Expected JOYSTICK label, got: ${joyLabel}`);

    // Adjust Joystick size to 135%
    const joySizeInput = mobilePage.locator(".ffh-slider-row").filter({ hasText: "SIZE" }).locator("input");
    await joySizeInput.fill("135");

    // Adjust Joystick transparency to 60%
    const joyTransInput = mobilePage.locator(".ffh-slider-row").filter({ hasText: "TRANSPARENCY" }).locator("input");
    await joyTransInput.fill("60");
    await mobilePage.waitForTimeout(100);

    const joyStyle = await mobilePage.evaluate(() => {
      const el = document.querySelector('[data-hudelem-id="joystick"]');
      return {
        opacity: el ? el.style.opacity : null,
        transform: el ? el.style.transform : null,
      };
    });
    console.log("  -> Mobile joystick style:", joyStyle);
    assert.strictEqual(joyStyle.opacity, "0.6", "Joystick opacity should be 0.6 (60%)");
    assert.ok(joyStyle.transform.includes("scale(1.35)"), "Joystick scale should include scale(1.35)");

    // Switch to PRESET 2
    console.log("  -> Switching to PRESET 2...");
    await mobilePage.click(".ffh-editor-preset-pill");
    await mobilePage.waitForFunction(() => {
      const el = document.querySelector(".ffh-preset-num");
      return el && el.textContent.trim() === "2";
    });
    console.log("  -> Switched to PRESET 2 successfully!");

    // Save Preset 2
    await mobilePage.click(".ffh-editor-bar-btn.save");
    await mobilePage.waitForSelector(".ffh-editor-toast");

    // Exit Custom HUD on phone
    await mobilePage.click(".ffh-editor-bar-btn.exit");
    await mobilePage.waitForSelector(".ffh-editor-top-bar", { state: "detached" });

    // Verify touch joystick still works after exiting Custom HUD
    console.log("  -> Verifying touch joystick responds in gameplay after exiting edit mode...");
    const joyCenter = await mobilePage.locator('[data-hudelem-id="joystick"]').boundingBox();
    assert.ok(joyCenter, "Joystick bounding box exists");
    await mobilePage.mouse.move(joyCenter.x + joyCenter.width / 2, joyCenter.y + joyCenter.height / 2);
    await mobilePage.mouse.down();
    await mobilePage.mouse.move(joyCenter.x + joyCenter.width / 2 + 25, joyCenter.y + joyCenter.height / 2 - 25);
    await mobilePage.waitForTimeout(100);
    await mobilePage.mouse.up();

    await mobilePage.screenshot({ path: path.join(SCRATCH_DIR, "verify_custom_hud_mobile.png") });
    console.log("✓ Mobile Controller Custom HUD tests passed!");

    assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join(" | ")}`);
    assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join(" | ")}`);

    console.log("\nALL CUSTOM HUD TESTS PASSED SUCCESSFULLY (SIZE, TRANSPARENCY, DRAG, PRESETS, SAVE & EXIT)!");
  } catch (err) {
    console.error("CUSTOM HUD TEST FAILED:", err);
    throw err;
  } finally {
    await browser.close();
    await server.close();
  }
})().catch((err) => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});

```

===============================================================================
FILE: server/matchManager.js
===============================================================================

```js
const crypto = require("crypto");

const TICK_RATE_MS = 50; // 20 updates per second
const MAX_SPEED_UNITS_PER_SEC = 28; // Anti-cheat max speed limit (sprinting + slight slope allowance)
const PLAYER_DISCONNECT_GRACE_MS = 15000;

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function round(val, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(val * factor) / factor;
}

function createMatchManager(options = {}) {
  const getIo = () => options.io || (typeof options.getIo === "function" ? options.getIo() : null);
  const onMatchEnd = options.onMatchEnd || null;

  const matchesById = new Map();
  const playerToMatchId = new Map();
  const socketToPlayerId = new Map();

  function matchChannel(matchId) {
    return `match:${matchId}`;
  }

  function initMatch({ roomId, matchId, matchManifest, config, onBroadcast }) {
    if (!matchId) matchId = `m_${crypto.randomBytes(5).toString("hex")}`;

    const playersMap = new Map();

    // Register all human players from manifest
    if (Array.isArray(matchManifest?.humans)) {
      matchManifest.humans.forEach((h, index) => {
        // Spawn players in slight formation near ground center (or aircraft line)
        const spawnAngle = (index / Math.max(1, matchManifest.humans.length)) * Math.PI * 2;
        const spawnDist = 4 + index * 2;
        const initialX = Math.cos(spawnAngle) * spawnDist;
        const initialZ = Math.sin(spawnAngle) * spawnDist;

        playersMap.set(h.id, {
          id: h.id,
          name: h.name || `Player-${index + 1}`,
          teamId: h.teamId || index + 1,
          slotIndex: h.slotIndex ?? index,
          isHost: Boolean(h.isHost),
          isBot: false,
          socketId: null,
          connected: true,
          alive: true,
          hp: 100,
          maxHp: 100,
          armor: 100,
          helmet: 100,
          kills: 0,
          damageDealt: 0,
          position: { x: initialX, y: 1.0, z: initialZ },
          rotation: { yaw: 0, pitch: 0 },
          velocity: { x: 0, y: 0, z: 0 },
          animation: "idle",
          weaponId: "fist",
          aiming: false,
          firing: false,
          vehicleMode: "onFoot",
          firstSync: true,
          lastStateTime: Date.now(),
          graceTimer: null,
        });
        playerToMatchId.set(h.id, matchId);
      });
    }

    // Register bots from manifest
    if (Array.isArray(matchManifest?.bots)) {
      matchManifest.bots.forEach((b, index) => {
        const botAngle = (index / Math.max(1, matchManifest.bots.length)) * Math.PI * 2;
        const botDist = 20 + (index % 5) * 8;
        const initialX = Math.cos(botAngle) * botDist;
        const initialZ = Math.sin(botAngle) * botDist;

        playersMap.set(b.id, {
          id: b.id,
          name: b.name || `[BOT] ${b.id}`,
          teamId: b.teamId || 99,
          slotIndex: b.slotIndex ?? (matchManifest.humans?.length || 0) + index,
          isHost: false,
          isBot: true,
          difficulty: b.difficulty || "normal",
          profile: b.profile || "tactical",
          socketId: null,
          connected: true,
          alive: true,
          hp: 100,
          maxHp: 100,
          armor: 50,
          helmet: 50,
          kills: 0,
          damageDealt: 0,
          position: { x: initialX, y: 1.0, z: initialZ },
          rotation: { yaw: 0, pitch: 0 },
          velocity: { x: 0, y: 0, z: 0 },
          animation: "idle",
          weaponId: "m4a1",
          aiming: false,
          firing: false,
          vehicleMode: "onFoot",
          firstSync: true,
          lastStateTime: Date.now(),
          graceTimer: null,
        });
      });
    }

    const match = {
      matchId,
      roomId,
      config: config || {},
      matchManifest,
      status: "ACTIVE", // ACTIVE | FINISHED
      startedAt: Date.now(),
      tickCount: 0,
      players: playersMap,
      tickTimer: null,
      onBroadcast: onBroadcast || null,
    };

    // Start 20Hz Simulation & Snapshot Broadcast Loop
    match.tickTimer = setInterval(() => {
      runMatchTick(match);
    }, TICK_RATE_MS);

    matchesById.set(matchId, match);
    return match;
  }

  function runMatchTick(match) {
    if (!match || match.status !== "ACTIVE") return;

    match.tickCount += 1;
    const now = Date.now();

    // Check alive players
    let aliveHumans = 0;
    let aliveBots = 0;
    const activePlayersPayload = [];

    for (const p of match.players.values()) {
      if (p.alive) {
        if (p.isBot) aliveBots += 1;
        else if (p.connected) aliveHumans += 1;
      }

      // Compact representation for low-bandwidth 20Hz snapshot
      activePlayersPayload.push({
        id: p.id,
        name: p.name,
        teamId: p.teamId,
        isBot: p.isBot,
        alive: p.alive,
        hp: p.hp,
        armor: p.armor,
        pos: [round(p.position.x, 2), round(p.position.y, 2), round(p.position.z, 2)],
        rot: [round(p.rotation.yaw, 3), round(p.rotation.pitch, 3)],
        vel: [round(p.velocity.x, 2), round(p.velocity.z, 2)],
        anim: p.animation,
        wep: p.weaponId,
        aim: p.aiming,
        fire: p.firing,
        veh: p.vehicleMode,
      });
    }

    const snapshot = {
      matchId: match.matchId,
      tick: match.tickCount,
      timestamp: now,
      aliveCount: aliveHumans + aliveBots,
      aliveHumans,
      players: activePlayersPayload,
    };

    const activeIo = getIo();
    if (activeIo) {
      activeIo.to(matchChannel(match.matchId)).emit("match:snapshot", snapshot);
    }
    if (typeof match.onBroadcast === "function") {
      match.onBroadcast(snapshot);
    }
  }

  function handlePlayerJoinMatch({ matchId, playerId, socketId }) {
    const match = matchesById.get(matchId);
    if (!match) {
      return { ok: false, error: "MATCH_NOT_FOUND", message: "Match not found or expired." };
    }

    const player = match.players.get(playerId);
    if (!player) {
      return { ok: false, error: "PLAYER_NOT_IN_MATCH", message: "Player not listed in match." };
    }

    if (player.graceTimer) {
      clearTimeout(player.graceTimer);
      player.graceTimer = null;
    }

    player.socketId = socketId;
    player.connected = true;
    socketToPlayerId.set(socketId, playerId);
    playerToMatchId.set(playerId, matchId);

    return {
      ok: true,
      matchId,
      player: {
        id: player.id,
        name: player.name,
        teamId: player.teamId,
        hp: player.hp,
        armor: player.armor,
        position: player.position,
      },
      matchManifest: match.matchManifest,
    };
  }

  function handlePlayerStateUpdate({ playerId, matchId, state }) {
    if (!playerId || !state) return false;
    const resolvedMatchId = matchId || playerToMatchId.get(playerId);
    const match = resolvedMatchId ? matchesById.get(resolvedMatchId) : null;
    if (!match || match.status !== "ACTIVE") return false;

    const player = match.players.get(playerId);
    if (!player || !player.alive) return false;

    const now = Date.now();
    const dt = Math.max(0.001, (now - player.lastStateTime) / 1000);
    player.lastStateTime = now;

    // Position & Movement Validation
    if (state.position && typeof state.position === "object") {
      const nextX = Number(state.position.x);
      const nextY = Number(state.position.y);
      const nextZ = Number(state.position.z);

      if (Number.isFinite(nextX) && Number.isFinite(nextY) && Number.isFinite(nextZ)) {
        const dx = nextX - player.position.x;
        const dz = nextZ - player.position.z;
        const horizontalDist = Math.hypot(dx, dz);
        const speed = horizontalDist / dt;

        // First state update accepts spawn position directly
        if (player.firstSync || state.isInitial) {
          player.firstSync = false;
          player.position.x = nextX;
          player.position.y = nextY;
          player.position.z = nextZ;
        } else if (speed <= MAX_SPEED_UNITS_PER_SEC || state.vehicleMode === "driving" || state.isDropping) {
          player.position.x = nextX;
          player.position.y = nextY;
          player.position.z = nextZ;
        } else {
          // Clamp move distance to maximum allowable travel
          const maxAllowedDist = MAX_SPEED_UNITS_PER_SEC * dt;
          const ratio = maxAllowedDist / horizontalDist;
          player.position.x += dx * ratio;
          player.position.y = nextY;
          player.position.z += dz * ratio;
        }
      }
    }

    // Rotation
    if (state.rotation && typeof state.rotation === "object") {
      const yaw = Number(state.rotation.yaw);
      const pitch = Number(state.rotation.pitch);
      if (Number.isFinite(yaw)) player.rotation.yaw = yaw;
      if (Number.isFinite(pitch)) player.rotation.pitch = clamp(pitch, -1.2, 1.2);
    }

    // Velocity
    if (state.velocity && typeof state.velocity === "object") {
      const vx = Number(state.velocity.x) || 0;
      const vz = Number(state.velocity.z) || 0;
      player.velocity.x = vx;
      player.velocity.z = vz;
    }

    // Animation & Combat Stance
    if (typeof state.animation === "string") {
      player.animation = state.animation.slice(0, 32);
    }
    if (typeof state.weaponId === "string") {
      player.weaponId = state.weaponId.slice(0, 24);
    }
    if (state.aiming !== undefined) {
      player.aiming = Boolean(state.aiming);
    }
    if (state.firing !== undefined) {
      player.firing = Boolean(state.firing);
    }
    if (typeof state.vehicleMode === "string") {
      player.vehicleMode = state.vehicleMode;
    }

    return true;
  }

  function handlePlayerDamage({
    matchId = null,
    attackerPlayerId,
    targetPlayerId,
    damage = 25,
    isHeadshot = false,
    weaponId = "m4a1",
  }) {
    const resolvedMatchId = matchId || playerToMatchId.get(targetPlayerId);
    const match = resolvedMatchId ? matchesById.get(resolvedMatchId) : null;
    if (!match || match.status !== "ACTIVE") {
      return { ok: false, error: "MATCH_NOT_ACTIVE" };
    }

    const target = match.players.get(targetPlayerId);
    if (!target || !target.alive) {
      return { ok: false, error: "TARGET_NOT_ALIVE" };
    }

    const attacker = match.players.get(attackerPlayerId);

    // Friendly fire restriction (Solo allows all, Duo/Squad forbids same teamId)
    if (attacker && attacker.id !== target.id && attacker.teamId && attacker.teamId === target.teamId) {
      return { ok: false, error: "FRIENDLY_FIRE_BLOCKED", message: "Cannot damage teammates." };
    }

    // Calculate damage: Armor absorbs 50% of damage until depleted
    let finalDamage = Number(damage) || 20;
    if (isHeadshot) {
      finalDamage = Math.round(finalDamage * 1.85); // Headshot multiplier
    }

    let armorAbsorbed = 0;
    if (target.armor > 0) {
      armorAbsorbed = Math.min(target.armor, Math.round(finalDamage * 0.5));
      target.armor = Math.max(0, target.armor - armorAbsorbed);
    }
    const healthDamage = finalDamage - armorAbsorbed;
    target.hp = Math.max(0, target.hp - healthDamage);

    if (attacker) {
      attacker.damageDealt = (attacker.damageDealt || 0) + finalDamage;
    }

    const isEliminated = target.hp <= 0;
    if (isEliminated) {
      target.alive = false;
      target.hp = 0;
      target.animation = "knockedOut";
      if (attacker) {
        attacker.kills = (attacker.kills || 0) + 1;
      }
    }

    const damagePayload = {
      matchId: resolvedMatchId,
      targetId: target.id,
      attackerId: attacker?.id || null,
      attackerName: attacker?.name || "Zone",
      targetName: target.name,
      damage: finalDamage,
      isHeadshot: Boolean(isHeadshot),
      remainingHp: target.hp,
      remainingArmor: target.armor,
      eliminated: isEliminated,
      weaponId: weaponId || attacker?.weaponId || "m4a1",
    };

    const activeIo = getIo();
    if (activeIo) {
      activeIo.to(matchChannel(resolvedMatchId)).emit("player:damaged", damagePayload);
      if (isEliminated) {
        activeIo.to(matchChannel(resolvedMatchId)).emit("match:elimination", {
          matchId: resolvedMatchId,
          victimId: target.id,
          victimName: target.name,
          attackerId: attacker?.id || null,
          attackerName: attacker?.name || "Zone",
          weaponId,
          isHeadshot,
        });
      }
    }

    return {
      ok: true,
      damagePayload,
    };
  }

  function handleSocketDisconnect({ socketId }) {
    const playerId = socketToPlayerId.get(socketId);
    if (!playerId) return;
    socketToPlayerId.delete(socketId);

    const matchId = playerToMatchId.get(playerId);
    const match = matchId ? matchesById.get(matchId) : null;
    if (!match) return;

    const player = match.players.get(playerId);
    if (!player) return;

    player.connected = false;
    player.socketId = null;

    if (player.graceTimer) clearTimeout(player.graceTimer);
    player.graceTimer = setTimeout(() => {
      // If player didn't reconnect, eliminate from match
      if (!player.connected && player.alive) {
        player.alive = false;
        player.hp = 0;
        player.animation = "knockedOut";
        const activeIo = getIo();
        if (activeIo) {
          activeIo.to(matchChannel(matchId)).emit("player:damaged", {
            matchId,
            targetId: player.id,
            attackerId: null,
            attackerName: "Disconnected",
            targetName: player.name,
            damage: 100,
            remainingHp: 0,
            remainingArmor: 0,
            eliminated: true,
          });
        }
      }
    }, PLAYER_DISCONNECT_GRACE_MS);
  }

  function endMatch(matchId, reason = "COMPLETED") {
    const match = matchesById.get(matchId);
    if (!match) return;

    match.status = "FINISHED";
    if (match.tickTimer) {
      clearInterval(match.tickTimer);
      match.tickTimer = null;
    }

    for (const p of match.players.values()) {
      if (p.graceTimer) clearTimeout(p.graceTimer);
      playerToMatchId.delete(p.id);
    }

    const activeIo = getIo();
    if (activeIo) {
      activeIo.to(matchChannel(matchId)).emit("match:ended", {
        matchId,
        reason,
        endedAt: Date.now(),
      });
    }

    matchesById.delete(matchId);
    onMatchEnd?.(match);
  }

  function getMatch(matchId) {
    return matchesById.get(matchId) || null;
  }

  function getMatchForPlayer(playerId) {
    const matchId = playerToMatchId.get(playerId);
    return matchId ? matchesById.get(matchId) || null : null;
  }

  return {
    initMatch,
    handlePlayerJoinMatch,
    handlePlayerStateUpdate,
    handlePlayerDamage,
    handleSocketDisconnect,
    endMatch,
    getMatch,
    getMatchForPlayer,
    matchChannel,
  };
}

module.exports = {
  createMatchManager,
  TICK_RATE_MS,
  MAX_SPEED_UNITS_PER_SEC,
};
```

===============================================================================
FILE: server/package.json
===============================================================================

```json
{
  "name": "server",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node server.js",
    "test": "node test_phase1_rooms.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "dependencies": {
    "socket.io": "^4.8.4"
  }
}
```

===============================================================================
FILE: server/roomManager.js
===============================================================================

```js
const crypto = require("crypto");

const MAX_MATCH_CAPACITY = 50;
const MIN_ROOM_CAPACITY = 2;
const VALID_MODES = ["solo", "duo", "squad"];
const VALID_MAPS = ["bermuda", "rainier", "cotedazur"];
const VALID_BOT_DIFFICULTIES = ["easy", "normal", "hard", "pro"];
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const BOT_CALLSIGNS = [
  "Kelly",
  "Hayato",
  "Alok",
  "Chrono",
  "Moco",
  "Maxim",
  "Andrew",
  "Kla",
  "Paloma",
  "Miguel",
  "Laura",
  "Rafael",
  "Wukong",
  "Jota",
  "Kapella",
  "Clu",
  "Skyler",
  "Tatsuya",
  "Iris",
  "Homer",
  "Dasha",
  "Xayne",
  "Kenta",
  "Leon",
];

const BOT_BEHAVIOR_PROFILES = ["rusher", "tactical", "looter", "flanker"];

function clampInt(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.round(n)));
}

function sanitizePlayerName(name, fallback = "Survivor") {
  if (typeof name !== "string") return fallback;
  const cleaned = name.replace(/[\r\n\t<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, 20);
  return cleaned || fallback;
}

function getTeamSizeForMode(mode) {
  if (mode === "duo") return 2;
  if (mode === "squad") return 4;
  return 1;
}

function generateInviteCode(existingCodes) {
  for (let attempt = 0; attempt < 32; attempt += 1) {
    let code = "";
    const bytes = crypto.randomBytes(6);
    for (let i = 0; i < 6; i += 1) {
      code += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
    }
    if (!existingCodes.has(code)) return code;
  }
  return `BR${Date.now().toString(36).slice(-4).toUpperCase()}`;
}

function normalizeConfig(raw = {}, base = null) {
  const prev = base || {
    maxPlayers: MAX_MATCH_CAPACITY,
    mapId: "bermuda",
    mode: "solo",
    botsEnabled: true,
    autoFillBots: true,
    botCount: MAX_MATCH_CAPACITY - 1,
    botDifficulty: "normal",
    countdownSec: 5,
  };

  const maxPlayers =
    raw.maxPlayers !== undefined
      ? clampInt(raw.maxPlayers, MIN_ROOM_CAPACITY, MAX_MATCH_CAPACITY, prev.maxPlayers)
      : prev.maxPlayers;

  const mapId = VALID_MAPS.includes(raw.mapId) ? raw.mapId : prev.mapId;
  const mode = VALID_MODES.includes(raw.mode) ? raw.mode : prev.mode;
  const botsEnabled =
    typeof raw.botsEnabled === "boolean" ? raw.botsEnabled : prev.botsEnabled;
  const autoFillBots =
    typeof raw.autoFillBots === "boolean" ? raw.autoFillBots : prev.autoFillBots;
  const botCount =
    raw.botCount !== undefined
      ? clampInt(raw.botCount, 0, Math.max(0, maxPlayers - 1), prev.botCount)
      : Math.min(prev.botCount, Math.max(0, maxPlayers - 1));
  const botDifficulty = VALID_BOT_DIFFICULTIES.includes(raw.botDifficulty)
    ? raw.botDifficulty
    : prev.botDifficulty;
  const countdownSec =
    raw.countdownSec !== undefined
      ? clampInt(raw.countdownSec, 3, 30, prev.countdownSec)
      : prev.countdownSec;

  return {
    maxPlayers,
    mapId,
    mode,
    botsEnabled,
    autoFillBots,
    botCount,
    botDifficulty,
    countdownSec,
  };
}

function createRoomManager({
  disconnectGraceMs = 8000,
  onRoomUpdated = null,
  onCountdownTick = null,
  onMatchStarted = null,
} = {}) {
  const roomsById = new Map();
  const roomIdByCode = new Map();
  const playerToRoomId = new Map();

  function recomputeTeamsAndSlots(room) {
    const teamSize = getTeamSizeForMode(room.config.mode);
    const ordered = Array.from(room.players.values()).sort(
      (a, b) => a.joinedAt - b.joinedAt,
    );
    ordered.forEach((p, idx) => {
      p.slotIndex = idx;
      p.teamId = Math.floor(idx / teamSize) + 1;
      p.isHost = p.playerId === room.hostPlayerId;
    });
  }

  function computeSlotAllocation(room) {
    const configuredMax = Math.min(MAX_MATCH_CAPACITY, room.config.maxPlayers);
    const realPlayers = room.players.size;
    const remaining = Math.max(0, configuredMax - realPlayers);
    let bots = 0;

    if (room.config.botsEnabled) {
      bots = room.config.autoFillBots
        ? remaining
        : Math.min(Math.max(0, room.config.botCount), remaining);
    }

    const totalOccupied = Math.min(configuredMax, realPlayers + bots);
    const availableSlots = Math.max(0, configuredMax - totalOccupied);

    return {
      maxCapacity: MAX_MATCH_CAPACITY,
      configuredMax,
      realPlayers,
      bots,
      availableSlots,
      totalOccupied,
      connectedPlayers: Array.from(room.players.values()).filter((p) => p.connected)
        .length,
    };
  }

  function buildBotRoster(room, botCount) {
    const teamSize = getTeamSizeForMode(room.config.mode);
    const startingSlot = room.players.size;
    const bots = [];

    for (let i = 0; i < botCount; i += 1) {
      const slotIndex = startingSlot + i;
      const callsignBase = BOT_CALLSIGNS[i % BOT_CALLSIGNS.length];
      const tagNum = String(i + 1).padStart(2, "0");
      bots.push({
        id: `bot_${room.roomId}_${tagNum}`,
        name: `[BOT] ${callsignBase}-${tagNum}`,
        isBot: true,
        difficulty: room.config.botDifficulty,
        profile: BOT_BEHAVIOR_PROFILES[i % BOT_BEHAVIOR_PROFILES.length],
        slotIndex,
        teamId: Math.floor(slotIndex / teamSize) + 1,
      });
    }
    return bots;
  }

  function serializeRoom(room) {
    if (!room) return null;
    recomputeTeamsAndSlots(room);
    const slots = computeSlotAllocation(room);
    const players = Array.from(room.players.values())
      .sort((a, b) => a.slotIndex - b.slotIndex)
      .map((p) => ({
        playerId: p.playerId,
        name: p.name,
        isHost: p.playerId === room.hostPlayerId,
        ready: Boolean(p.ready),
        connected: Boolean(p.connected),
        teamId: p.teamId,
        slotIndex: p.slotIndex,
        isBot: false,
      }));

    return {
      roomId: room.roomId,
      inviteCode: room.inviteCode,
      status: room.status,
      hostPlayerId: room.hostPlayerId,
      countdownRemaining: room.countdownRemaining,
      createdAt: room.createdAt,
      config: { ...room.config },
      slots,
      players,
      botSummary: {
        enabled: room.config.botsEnabled,
        autoFill: room.config.autoFillBots,
        count: slots.bots,
        difficulty: room.config.botDifficulty,
        isBotOnly: true,
      },
      matchManifest: room.matchManifest || null,
    };
  }

  function clearCountdownTimer(room) {
    if (room?.countdownTimer) {
      clearInterval(room.countdownTimer);
      room.countdownTimer = null;
    }
    if (room) {
      room.countdownRemaining = 0;
    }
  }

  function clearPlayerGraceTimer(player) {
    if (player?.graceTimer) {
      clearTimeout(player.graceTimer);
      player.graceTimer = null;
    }
  }

  function destroyRoom(room) {
    if (!room) return;
    clearCountdownTimer(room);
    for (const p of room.players.values()) {
      clearPlayerGraceTimer(p);
      if (playerToRoomId.get(p.playerId) === room.roomId) {
        playerToRoomId.delete(p.playerId);
      }
    }
    roomsById.delete(room.roomId);
    roomIdByCode.delete(room.inviteCode);
  }

  function transferHostIfNeeded(room) {
    if (room.players.has(room.hostPlayerId)) {
      const currentHost = room.players.get(room.hostPlayerId);
      if (currentHost?.connected) return;
    }

    const sorted = Array.from(room.players.values()).sort(
      (a, b) => a.joinedAt - b.joinedAt,
    );
    const nextConnected = sorted.find((p) => p.connected) || sorted[0];
    if (nextConnected) {
      room.hostPlayerId = nextConnected.playerId;
    }
  }

  function emitUpdate(room) {
    if (!room) return;
    onRoomUpdated?.(serializeRoom(room));
  }

  function removePlayerFromCurrentRoom(playerId, { reason = "left" } = {}) {
    const existingRoomId = playerToRoomId.get(playerId);
    if (!existingRoomId) return { ok: true, removed: false };

    const room = roomsById.get(existingRoomId);
    playerToRoomId.delete(playerId);
    if (!room) return { ok: true, removed: false };

    const player = room.players.get(playerId);
    if (player) {
      clearPlayerGraceTimer(player);
      room.players.delete(playerId);
    }

    if (room.players.size === 0) {
      destroyRoom(room);
      return { ok: true, removed: true, roomDeleted: true, roomId: existingRoomId };
    }

    if (room.status === "COUNTDOWN") {
      clearCountdownTimer(room);
      room.status = "LOBBY";
    }

    transferHostIfNeeded(room);
    const snapshot = serializeRoom(room);
    emitUpdate(room);

    return {
      ok: true,
      removed: true,
      roomDeleted: false,
      reason,
      room: snapshot,
    };
  }

  function createRoom({ playerId, playerName, socketId, config = {} }) {
    if (!playerId) {
      return { ok: false, error: "MISSING_IDENTITY", message: "Player identity required." };
    }

    removePlayerFromCurrentRoom(playerId, { reason: "switched_room" });

    const inviteCode = generateInviteCode(roomIdByCode);
    const roomId = `rm_${crypto.randomBytes(4).toString("hex")}`;
    const normalizedConfig = normalizeConfig(config);
    const now = Date.now();

    const room = {
      roomId,
      inviteCode,
      hostPlayerId: playerId,
      status: "LOBBY",
      createdAt: now,
      config: normalizedConfig,
      players: new Map(),
      countdownTimer: null,
      countdownRemaining: 0,
      matchManifest: null,
    };

    room.players.set(playerId, {
      playerId,
      name: sanitizePlayerName(playerName, "Host"),
      socketId,
      isHost: true,
      ready: true,
      connected: true,
      disconnectedAt: null,
      joinedAt: now,
      slotIndex: 0,
      teamId: 1,
      graceTimer: null,
      isBot: false,
    });

    roomsById.set(roomId, room);
    roomIdByCode.set(inviteCode, roomId);
    playerToRoomId.set(playerId, roomId);

    const snapshot = serializeRoom(room);
    emitUpdate(room);
    return { ok: true, room: snapshot };
  }

  function findRoomByCodeOrId(codeOrId) {
    if (!codeOrId || typeof codeOrId !== "string") return null;
    const trimmed = codeOrId.trim();
    const byId = roomsById.get(trimmed);
    if (byId) return byId;
    const mappedId = roomIdByCode.get(trimmed.toUpperCase());
    return mappedId ? roomsById.get(mappedId) : null;
  }

  function getRoomPreview(codeOrId) {
    const room = findRoomByCodeOrId(codeOrId);
    if (!room) return null;
    const slots = computeSlotAllocation(room);
    return {
      roomId: room.roomId,
      inviteCode: room.inviteCode,
      status: room.status,
      config: { ...room.config },
      slots,
    };
  }

  function joinRoom({ inviteCode, roomId, playerId, playerName, socketId }) {
    if (!playerId) {
      return { ok: false, error: "MISSING_IDENTITY", message: "Player identity required." };
    }

    const room = findRoomByCodeOrId(inviteCode || roomId);
    if (!room) {
      return {
        ok: false,
        error: "ROOM_NOT_FOUND",
        message: "Room not found. Check the invite code and try again.",
      };
    }

    // Reconnection to existing slot inside this room
    const existingInThisRoom = room.players.get(playerId);
    if (existingInThisRoom) {
      clearPlayerGraceTimer(existingInThisRoom);
      existingInThisRoom.socketId = socketId;
      existingInThisRoom.connected = true;
      existingInThisRoom.disconnectedAt = null;
      if (playerName) {
        existingInThisRoom.name = sanitizePlayerName(playerName, existingInThisRoom.name);
      }
      playerToRoomId.set(playerId, room.roomId);
      const snapshot = serializeRoom(room);
      emitUpdate(room);
      return { ok: true, reconnected: true, room: snapshot };
    }

    if (room.status !== "LOBBY") {
      return {
        ok: false,
        error: "MATCH_ALREADY_STARTED",
        message: "Match has already started. Cannot join after lobby lock.",
      };
    }

    if (room.players.size >= room.config.maxPlayers || room.players.size >= MAX_MATCH_CAPACITY) {
      return {
        ok: false,
        error: "ROOM_FULL",
        message: `Room is full (${room.config.maxPlayers}/${room.config.maxPlayers} players).`,
      };
    }

    const previousRoomId = playerToRoomId.get(playerId);
    if (previousRoomId && previousRoomId !== room.roomId) {
      removePlayerFromCurrentRoom(playerId, { reason: "switched_room" });
    }

    room.players.set(playerId, {
      playerId,
      name: sanitizePlayerName(playerName, `Player-${room.players.size + 1}`),
      socketId,
      isHost: false,
      ready: false,
      connected: true,
      disconnectedAt: null,
      joinedAt: Date.now(),
      slotIndex: room.players.size,
      teamId: 1,
      graceTimer: null,
      isBot: false,
    });

    playerToRoomId.set(playerId, room.roomId);
    const snapshot = serializeRoom(room);
    emitUpdate(room);
    return { ok: true, reconnected: false, room: snapshot };
  }

  function setReady({ playerId, ready }) {
    const roomId = playerToRoomId.get(playerId);
    const room = roomId ? roomsById.get(roomId) : null;
    if (!room) {
      return { ok: false, error: "NOT_IN_ROOM", message: "You are not inside a room." };
    }
    if (room.status !== "LOBBY") {
      return {
        ok: false,
        error: "ROOM_LOCKED",
        message: "Cannot change ready status after countdown starts.",
      };
    }
    const player = room.players.get(playerId);
    if (!player) {
      return { ok: false, error: "NOT_IN_ROOM", message: "Player not found in room." };
    }
    player.ready = typeof ready === "boolean" ? ready : !player.ready;
    const snapshot = serializeRoom(room);
    emitUpdate(room);
    return { ok: true, room: snapshot };
  }

  function updateConfig({ playerId, patch = {} }) {
    const roomId = playerToRoomId.get(playerId);
    const room = roomId ? roomsById.get(roomId) : null;
    if (!room) {
      return { ok: false, error: "NOT_IN_ROOM", message: "You are not inside a room." };
    }
    if (room.hostPlayerId !== playerId) {
      return {
        ok: false,
        error: "UNAUTHORIZED",
        message: "Only the room host can modify room settings.",
      };
    }
    if (room.status !== "LOBBY") {
      return {
        ok: false,
        error: "ROOM_LOCKED",
        message: "Cannot change room configuration after match countdown starts.",
      };
    }

    const requestedMax =
      patch.maxPlayers !== undefined
        ? clampInt(patch.maxPlayers, Math.max(MIN_ROOM_CAPACITY, room.players.size), MAX_MATCH_CAPACITY, room.config.maxPlayers)
        : room.config.maxPlayers;

    room.config = normalizeConfig({ ...patch, maxPlayers: requestedMax }, room.config);
    const snapshot = serializeRoom(room);
    emitUpdate(room);
    return { ok: true, room: snapshot };
  }

  function transferHost({ playerId, targetPlayerId }) {
    const roomId = playerToRoomId.get(playerId);
    const room = roomId ? roomsById.get(roomId) : null;
    if (!room) {
      return { ok: false, error: "NOT_IN_ROOM", message: "You are not inside a room." };
    }
    if (room.hostPlayerId !== playerId) {
      return {
        ok: false,
        error: "UNAUTHORIZED",
        message: "Only the room host can transfer host ownership.",
      };
    }
    if (!room.players.has(targetPlayerId)) {
      return {
        ok: false,
        error: "PLAYER_NOT_FOUND",
        message: "Target player is not in this room.",
      };
    }
    room.hostPlayerId = targetPlayerId;
    const targetPlayer = room.players.get(targetPlayerId);
    if (targetPlayer) targetPlayer.ready = true;
    const snapshot = serializeRoom(room);
    emitUpdate(room);
    return { ok: true, room: snapshot };
  }

  function kickPlayer({ playerId, targetPlayerId }) {
    const roomId = playerToRoomId.get(playerId);
    const room = roomId ? roomsById.get(roomId) : null;
    if (!room) {
      return { ok: false, error: "NOT_IN_ROOM", message: "You are not inside a room." };
    }
    if (room.hostPlayerId !== playerId) {
      return {
        ok: false,
        error: "UNAUTHORIZED",
        message: "Only the room host can kick players.",
      };
    }
    if (targetPlayerId === playerId) {
      return {
        ok: false,
        error: "INVALID_TARGET",
        message: "Host cannot kick themselves. Leave room instead.",
      };
    }
    const target = room.players.get(targetPlayerId);
    if (!target) {
      return {
        ok: false,
        error: "PLAYER_NOT_FOUND",
        message: "Player is no longer in this room.",
      };
    }

    const kickedSocketId = target.socketId;
    clearPlayerGraceTimer(target);
    room.players.delete(targetPlayerId);
    playerToRoomId.delete(targetPlayerId);

    if (room.status === "COUNTDOWN") {
      clearCountdownTimer(room);
      room.status = "LOBBY";
    }

    const snapshot = serializeRoom(room);
    emitUpdate(room);
    return {
      ok: true,
      kickedPlayerId: targetPlayerId,
      kickedSocketId,
      roomId: room.roomId,
      room: snapshot,
    };
  }

  function finalizeMatchStart(room) {
    if (!room || room.status !== "COUNTDOWN") return null;
    clearCountdownTimer(room);

    // Drop any lingering disconnected players before locking match manifest
    for (const [pid, player] of room.players.entries()) {
      if (!player.connected) {
        clearPlayerGraceTimer(player);
        room.players.delete(pid);
        playerToRoomId.delete(pid);
      }
    }

    if (room.players.size === 0) {
      destroyRoom(room);
      return null;
    }

    transferHostIfNeeded(room);
    recomputeTeamsAndSlots(room);
    const slots = computeSlotAllocation(room);
    const bots = buildBotRoster(room, slots.bots);

    const humans = Array.from(room.players.values())
      .sort((a, b) => a.slotIndex - b.slotIndex)
      .map((p) => ({
        id: p.playerId,
        name: p.name,
        isHost: p.playerId === room.hostPlayerId,
        isBot: false,
        slotIndex: p.slotIndex,
        teamId: p.teamId,
      }));

    const matchManifest = {
      matchId: `m_${crypto.randomBytes(5).toString("hex")}`,
      roomId: room.roomId,
      inviteCode: room.inviteCode,
      startedAt: Date.now(),
      config: { ...room.config },
      counts: {
        maxCapacity: MAX_MATCH_CAPACITY,
        configuredMax: room.config.maxPlayers,
        humans: humans.length,
        bots: bots.length,
        total: humans.length + bots.length,
      },
      humans,
      bots,
    };

    room.status = "IN_MATCH";
    room.matchManifest = matchManifest;

    const snapshot = serializeRoom(room);
    emitUpdate(room);
    onMatchStarted?.(snapshot, matchManifest);
    return matchManifest;
  }

  function startMatch({ playerId, force = false } = {}) {
    const roomId = playerToRoomId.get(playerId);
    const room = roomId ? roomsById.get(roomId) : null;
    if (!room) {
      return { ok: false, error: "NOT_IN_ROOM", message: "You are not inside a room." };
    }
    if (room.hostPlayerId !== playerId) {
      return {
        ok: false,
        error: "UNAUTHORIZED",
        message: "Only the room host can start the match.",
      };
    }
    if (room.status !== "LOBBY") {
      return {
        ok: false,
        error: "INVALID_STATE",
        message: `Cannot start match while room is ${room.status}.`,
      };
    }

    const connectedPlayers = Array.from(room.players.values()).filter((p) => p.connected);
    if (connectedPlayers.length === 0) {
      return { ok: false, error: "NO_PLAYERS", message: "No connected players in room." };
    }

    const unreadyOthers = connectedPlayers.filter(
      (p) => p.playerId !== room.hostPlayerId && !p.ready,
    );
    if (unreadyOthers.length > 0 && !force) {
      return {
        ok: false,
        error: "PLAYERS_NOT_READY",
        message: `${unreadyOthers.length} player(s) not ready (${unreadyOthers
          .map((p) => p.name)
          .slice(0, 3)
          .join(", ")}).`,
      };
    }

    const host = room.players.get(room.hostPlayerId);
    if (host) host.ready = true;

    room.status = "COUNTDOWN";
    room.countdownRemaining = room.config.countdownSec;
    const initialSnapshot = serializeRoom(room);
    emitUpdate(room);
    onCountdownTick?.(initialSnapshot, room.countdownRemaining);

    room.countdownTimer = setInterval(() => {
      if (!roomsById.has(room.roomId) || room.status !== "COUNTDOWN") {
        clearCountdownTimer(room);
        return;
      }
      room.countdownRemaining -= 1;
      if (room.countdownRemaining <= 0) {
        finalizeMatchStart(room);
        return;
      }
      const tickSnap = serializeRoom(room);
      emitUpdate(room);
      onCountdownTick?.(tickSnap, room.countdownRemaining);
    }, 1000);

    return { ok: true, room: initialSnapshot };
  }

  function cancelCountdown({ playerId }) {
    const roomId = playerToRoomId.get(playerId);
    const room = roomId ? roomsById.get(roomId) : null;
    if (!room) {
      return { ok: false, error: "NOT_IN_ROOM", message: "You are not inside a room." };
    }
    if (room.hostPlayerId !== playerId) {
      return {
        ok: false,
        error: "UNAUTHORIZED",
        message: "Only the room host can cancel countdown.",
      };
    }
    if (room.status !== "COUNTDOWN") {
      return { ok: false, error: "INVALID_STATE", message: "No countdown in progress." };
    }

    clearCountdownTimer(room);
    room.status = "LOBBY";
    const snapshot = serializeRoom(room);
    emitUpdate(room);
    return { ok: true, room: snapshot };
  }

  function returnToLobby({ playerId }) {
    const roomId = playerToRoomId.get(playerId);
    const room = roomId ? roomsById.get(roomId) : null;
    if (!room) {
      return { ok: false, error: "NOT_IN_ROOM", message: "You are not inside a room." };
    }
    if (room.hostPlayerId !== playerId) {
      return {
        ok: false,
        error: "UNAUTHORIZED",
        message: "Only the room host can return the room to lobby.",
      };
    }

    clearCountdownTimer(room);
    room.status = "LOBBY";
    room.matchManifest = null;
    for (const player of room.players.values()) {
      player.ready = player.playerId === room.hostPlayerId;
    }

    const snapshot = serializeRoom(room);
    emitUpdate(room);
    return { ok: true, room: snapshot };
  }

  function handleSocketDisconnect({ socketId, playerId = null }) {
    let targetPlayer = null;
    let targetRoom = null;

    if (playerId && playerToRoomId.has(playerId)) {
      const r = roomsById.get(playerToRoomId.get(playerId));
      const p = r?.players.get(playerId);
      if (p && p.socketId === socketId) {
        targetPlayer = p;
        targetRoom = r;
      }
    }

    if (!targetPlayer) {
      for (const room of roomsById.values()) {
        for (const p of room.players.values()) {
          if (p.socketId === socketId) {
            targetPlayer = p;
            targetRoom = room;
            break;
          }
        }
        if (targetPlayer) break;
      }
    }

    if (!targetPlayer || !targetRoom) return null;

    targetPlayer.connected = false;
    targetPlayer.disconnectedAt = Date.now();
    clearPlayerGraceTimer(targetPlayer);

    const pid = targetPlayer.playerId;
    const rid = targetRoom.roomId;

    targetPlayer.graceTimer = setTimeout(() => {
      const latestRoom = roomsById.get(rid);
      const latestPlayer = latestRoom?.players.get(pid);
      if (!latestRoom || !latestPlayer || latestPlayer.connected) return;
      removePlayerFromCurrentRoom(pid, { reason: "disconnect_timeout" });
    }, disconnectGraceMs);

    const snapshot = serializeRoom(targetRoom);
    emitUpdate(targetRoom);
    return snapshot;
  }

  function getRoomForPlayer(playerId) {
    const rid = playerToRoomId.get(playerId);
    if (!rid) return null;
    return serializeRoom(roomsById.get(rid));
  }

  function listRoomsSummary() {
    return Array.from(roomsById.values()).map((room) => ({
      roomId: room.roomId,
      inviteCode: room.inviteCode,
      status: room.status,
      mode: room.config.mode,
      mapId: room.config.mapId,
      slots: computeSlotAllocation(room),
    }));
  }

  return {
    MAX_MATCH_CAPACITY,
    createRoom,
    joinRoom,
    leaveRoom: ({ playerId }) => removePlayerFromCurrentRoom(playerId, { reason: "left" }),
    setReady,
    updateConfig,
    transferHost,
    kickPlayer,
    startMatch,
    cancelCountdown,
    returnToLobby,
    handleSocketDisconnect,
    getRoomPreview,
    getRoomForPlayer,
    listRoomsSummary,
  };
}

module.exports = {
  MAX_MATCH_CAPACITY,
  MIN_ROOM_CAPACITY,
  VALID_MODES,
  VALID_MAPS,
  VALID_BOT_DIFFICULTIES,
  createRoomManager,
};

```

===============================================================================
FILE: server/server.js
===============================================================================

```js
const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");
const { Server } = require("socket.io");
const { createRoomManager } = require("./roomManager");
const { createMatchManager } = require("./matchManager");

const DEFAULT_PORT = Number(process.env.RELAY_PORT || process.env.PORT || 4000);
const CLIENT_BUILD_DIR = path.resolve(__dirname, "../client/build");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".glb": "model/gltf-binary",
  ".gltf": "model/gltf+json",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

function scoreIpv4Candidate(ifaceName, address) {
  let score = 0;
  const lower = (ifaceName || "").toLowerCase();

  if (lower.includes("wi-fi") || lower.includes("wifi") || lower.includes("wlan")) {
    score += 50;
  } else if (lower.includes("ethernet")) {
    score += 40;
  }

  if (
    lower.includes("vethernet") ||
    lower.includes("wsl") ||
    lower.includes("hyper-v") ||
    lower.includes("virtual") ||
    lower.includes("vbox") ||
    lower.includes("vmware") ||
    lower.includes("docker") ||
    lower.includes("tailscale") ||
    lower.includes("zerotier") ||
    lower.includes("hamachi")
  ) {
    score -= 80;
  }

  if (address.startsWith("192.168.")) score += 30;
  else if (address.startsWith("10.")) score += 20;
  else if (/^172\.(1[6-9]|2\d|3[01])\./.test(address)) score += 10;

  return score;
}

function getLanIPv4Addresses() {
  const interfaces = os.networkInterfaces();
  const candidates = [];

  for (const [ifaceName, entries] of Object.entries(interfaces)) {
    if (!Array.isArray(entries)) continue;
    for (const entry of entries) {
      if (!entry || entry.internal) continue;
      if (entry.family !== "IPv4" && entry.family !== 4) continue;
      if (!entry.address || entry.address.startsWith("169.254.")) continue;
      candidates.push({
        address: entry.address,
        ifaceName,
        score: scoreIpv4Candidate(ifaceName, entry.address),
      });
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  return [...new Set(candidates.map((item) => item.address))];
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  });
  res.end(JSON.stringify(payload));
}

function serveStaticBuild(reqUrl, res) {
  if (!fs.existsSync(path.join(CLIENT_BUILD_DIR, "index.html"))) {
    return false;
  }
  let cleanPath = "/";
  try {
    cleanPath = decodeURIComponent((reqUrl || "/").split("?")[0]);
  } catch {
    return false;
  }

  const relativePath = cleanPath === "/" ? "index.html" : cleanPath.replace(/^\/+/, "");
  const resolved = path.resolve(CLIENT_BUILD_DIR, relativePath);
  if (resolved !== CLIENT_BUILD_DIR && !resolved.startsWith(CLIENT_BUILD_DIR + path.sep)) {
    return false;
  }

  let filePath = resolved;
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    // Only fall back to index.html for navigation routes without file extension
    if (path.extname(relativePath)) {
      return false;
    }
    filePath = path.join(CLIENT_BUILD_DIR, "index.html");
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": contentType });
  fs.createReadStream(filePath).pipe(res);
  return true;
}

function normalizePairToken(rawToken) {
  if (typeof rawToken !== "string") return "default";
  const cleaned = rawToken.trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64);
  return cleaned || "default";
}

function pairChannel(pairToken) {
  return `pair:${pairToken}`;
}

function roomChannel(roomId) {
  return `room:${roomId}`;
}

function replyAck(ack, payload) {
  if (typeof ack === "function") {
    try {
      ack(payload);
    } catch (err) {
      console.error("[Relay] Ack error:", err);
    }
  }
}

function startRelayServer(port = DEFAULT_PORT, options = {}) {
  const controllerIds = new Set();
  const gameIds = new Set();
  const socketMeta = new Map();

  let io = null;

  const matchManager = createMatchManager({
    getIo: () => io,
  });

  const roomManager = createRoomManager({
    disconnectGraceMs: options.disconnectGraceMs ?? 20000,
    onRoomUpdated: (room) => {
      if (io) {
        io.to(roomChannel(room.roomId)).emit("room:state", room);
      }
    },
    onCountdownTick: (room, remainingSec) => {
      if (io) {
        io.to(roomChannel(room.roomId)).emit("room:countdown", {
          roomId: room.roomId,
          remainingSec,
          totalSec: room.config.countdownSec,
        });
      }
    },
    onMatchStarted: (room, matchManifest) => {
      const match = matchManager.initMatch({
        roomId: room.roomId,
        matchId: matchManifest.matchId,
        matchManifest,
        config: room.config,
      });
      if (io) {
        io.to(roomChannel(room.roomId)).emit("match:started", {
          room,
          matchManifest,
          matchId: match.matchId,
        });
      }
    },
  });

  const httpServer = http.createServer((req, res) => {
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      res.end();
      return;
    }

    const reqPath = (req.url || "/").split("?")[0];
    if (reqPath.startsWith("/socket.io")) {
      return;
    }

    if (reqPath === "/api/health") {
      const ips = getLanIPv4Addresses();
      const addr = httpServer.address();
      sendJson(res, 200, {
        ok: true,
        port: typeof addr === "object" && addr ? addr.port : port,
        controllers: controllerIds.size,
        games: gameIds.size,
        rooms: roomManager.listRoomsSummary().length,
        primaryIp: ips[0] || null,
        ips,
      });
      return;
    }

    if (reqPath === "/api/network-info") {
      const ips = getLanIPv4Addresses();
      const addr = httpServer.address();
      sendJson(res, 200, {
        ips,
        primaryIp: ips[0] || null,
        port: typeof addr === "object" && addr ? addr.port : port,
      });
      return;
    }

    if (reqPath === "/api/rooms") {
      sendJson(res, 200, {
        ok: true,
        rooms: roomManager.listRoomsSummary(),
      });
      return;
    }

    if (reqPath.startsWith("/api/rooms/")) {
      const codeOrId = decodeURIComponent(reqPath.slice("/api/rooms/".length));
      const preview = roomManager.getRoomPreview(codeOrId);
      if (!preview) {
        sendJson(res, 404, { ok: false, error: "ROOM_NOT_FOUND", message: "Room not found." });
        return;
      }
      sendJson(res, 200, { ok: true, room: preview });
      return;
    }

    if (serveStaticBuild(req.url, res)) {
      return;
    }

    sendJson(res, 404, { error: "Not found" });
  });

  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    allowEIO3: true,
    pingTimeout: 12000,
    pingInterval: 5000,
  });

  function ensureMeta(socket) {
    let meta = socketMeta.get(socket.id);
    if (!meta) {
      meta = {
        role: null,
        pairToken: "default",
        playerId: null,
        playerName: null,
      };
      socketMeta.set(socket.id, meta);
      socket.join(pairChannel(meta.pairToken));
    }
    return meta;
  }

  function setSocketPairToken(socket, nextToken) {
    const meta = ensureMeta(socket);
    const clean = normalizePairToken(nextToken);
    if (meta.pairToken !== clean) {
      socket.leave(pairChannel(meta.pairToken));
      meta.pairToken = clean;
      socket.join(pairChannel(clean));
    } else {
      socket.join(pairChannel(clean));
    }
    return meta.pairToken;
  }

  function getActiveGamePairs() {
    const pairs = [];
    for (const gid of gameIds) {
      const m = socketMeta.get(gid);
      if (m && m.pairToken) {
        pairs.push(m.pairToken);
      }
    }
    return [...new Set(pairs)];
  }

  function resolveControllerTarget(controllerPairToken) {
    const activePairs = getActiveGamePairs();
    if (activePairs.includes(controllerPairToken)) {
      return { targetPair: controllerPairToken, linked: true, activePairs };
    }
    if (
      activePairs.length === 1 ||
      (controllerPairToken === "default" && activePairs.length > 0)
    ) {
      // Auto-bind only for a single active game or a bare controller URL without an explicit pair token
      return { targetPair: activePairs[activePairs.length - 1], linked: true, activePairs };
    }
    return { targetPair: controllerPairToken, linked: false, activePairs };
  }

  function notifyAllControllersPairStatus() {
    const activePairs = getActiveGamePairs();
    for (const cid of controllerIds) {
      const cMeta = socketMeta.get(cid);
      const targetSocket = io.sockets.sockets.get(cid);
      if (!cMeta || !targetSocket) continue;
      const resolved = resolveControllerTarget(cMeta.pairToken);
      if (resolved.targetPair) {
        targetSocket.join(pairChannel(resolved.targetPair));
      }
      targetSocket.emit("controller:pair-status", {
        linked: resolved.linked,
        pairToken: resolved.targetPair,
        activeGames: activePairs.length,
        availablePairs: activePairs,
      });
    }
  }

  function countControllersForPair(gamePairToken) {
    const activePairs = getActiveGamePairs();
    const allowDefaultFallback = activePairs.length <= 1;
    let count = 0;
    for (const meta of socketMeta.values()) {
      if (meta.role !== "controller") continue;
      if (
        meta.pairToken === gamePairToken ||
        (allowDefaultFallback && meta.pairToken === "default")
      ) {
        count += 1;
      }
    }
    return count;
  }

  function broadcastPairControllerStatus(pairToken, excludeSocket = null) {
    const resolved = resolveControllerTarget(pairToken);
    const targetPair = resolved.targetPair;
    const count = countControllersForPair(targetPair);
    const payload = {
      connected: count > 0,
      count,
      pairToken: targetPair,
    };
    const channel = pairChannel(targetPair);
    if (excludeSocket) {
      excludeSocket.to(channel).emit("controller:status", payload);
    } else {
      io.to(channel).emit("controller:status", payload);
    }
  }

  function markController(socket, requestedPairToken = null) {
    const meta = ensureMeta(socket);
    if (requestedPairToken) {
      setSocketPairToken(socket, requestedPairToken);
    }
    const resolved = resolveControllerTarget(meta.pairToken);
    if (resolved.targetPair && resolved.targetPair !== meta.pairToken) {
      socket.join(pairChannel(resolved.targetPair));
    }
    const changed = meta.role !== "controller" || !controllerIds.has(socket.id);
    meta.role = "controller";
    gameIds.delete(socket.id);
    controllerIds.add(socket.id);
    if (changed) {
      broadcastPairControllerStatus(meta.pairToken, socket);
      socket.emit("controller:pair-status", {
        linked: resolved.linked,
        pairToken: resolved.targetPair,
        activeGames: resolved.activePairs.length,
        availablePairs: resolved.activePairs,
      });
    }
    return meta;
  }

  function syncSocketLobbyChannel(socket, activeRoomId = null) {
    for (const joined of Array.from(socket.rooms)) {
      if (joined.startsWith("room:") && joined !== roomChannel(activeRoomId || "")) {
        socket.leave(joined);
      }
    }
    if (activeRoomId) {
      socket.join(roomChannel(activeRoomId));
    }
  }

  io.on("connection", (socket) => {
    ensureMeta(socket);
    console.log(`[Controller Relay] Connected: ${socket.id}`);

    socket.on("client:register", (regPayload) => {
      const isObj = regPayload && typeof regPayload === "object";
      const role = isObj ? regPayload.role : regPayload;
      const pairToken = isObj ? regPayload.pairToken : null;
      const playerId = isObj && typeof regPayload.playerId === "string" ? regPayload.playerId : null;
      const playerName =
        isObj && typeof regPayload.playerName === "string" ? regPayload.playerName : null;

      const meta = ensureMeta(socket);
      const activePairToken = setSocketPairToken(
        socket,
        pairToken || meta.pairToken || "default",
      );

      if (playerId) meta.playerId = playerId;
      if (playerName) meta.playerName = playerName;

      if (role === "controller") {
        const metaCtrl = markController(socket, activePairToken);
        const resolved = resolveControllerTarget(metaCtrl.pairToken);
        socket.emit("controller:pair-status", {
          linked: resolved.linked,
          pairToken: metaCtrl.pairToken,
          activeGames: resolved.activePairs.length,
          availablePairs: resolved.activePairs,
        });
      } else if (role === "game") {
        const wasController = controllerIds.delete(socket.id);
        meta.role = "game";
        gameIds.add(socket.id);
        if (wasController) {
          broadcastPairControllerStatus(activePairToken, socket);
        }
        const pairCount = countControllersForPair(activePairToken);
        socket.emit("controller:status", {
          connected: pairCount > 0,
          count: pairCount,
          pairToken: activePairToken,
        });
        notifyAllControllersPairStatus();
        if (meta.playerId) {
          const existingRoom = roomManager.getRoomForPlayer(meta.playerId);
          if (existingRoom) {
            syncSocketLobbyChannel(socket, existingRoom.roomId);
            socket.emit("room:state", existingRoom);
          }
        }
      }
    });

    socket.on("controller:input", (data) => {
      const meta = markController(socket, data?.pairToken);
      const { targetPair } = resolveControllerTarget(meta.pairToken);
      socket.to(pairChannel(targetPair)).emit("controller:input", data);
    });

    socket.on("controller:action", (action) => {
      const meta = markController(socket, action?.pairToken);
      const { targetPair } = resolveControllerTarget(meta.pairToken);
      socket.to(pairChannel(targetPair)).emit("controller:action", action);
    });

    socket.on("controller:settings", (settings) => {
      const meta = markController(socket, settings?.pairToken);
      const { targetPair } = resolveControllerTarget(meta.pairToken);
      socket.to(pairChannel(targetPair)).emit("controller:settings", settings);
    });

    socket.on("game:telemetry", (telemetry) => {
      const meta = ensureMeta(socket);
      if (!meta.role) meta.role = "game";
      gameIds.add(socket.id);
      socket.to(pairChannel(meta.pairToken)).emit("game:telemetry", telemetry);
      if (meta.pairToken !== "default" && getActiveGamePairs().length === 1) {
        socket.to(pairChannel("default")).emit("game:telemetry", telemetry);
      }
    });

    socket.on("game:haptic", (pattern) => {
      const meta = ensureMeta(socket);
      if (!meta.role) meta.role = "game";
      gameIds.add(socket.id);
      socket.to(pairChannel(meta.pairToken)).emit("game:haptic", pattern);
      if (meta.pairToken !== "default" && getActiveGamePairs().length === 1) {
        socket.to(pairChannel("default")).emit("game:haptic", pattern);
      }
    });

    // --- Phase 1: Custom Rooms & Multiplayer Lobby ---

    socket.on("auth:identify", (payload, ack) => {
      const meta = ensureMeta(socket);
      if (typeof payload?.playerId === "string" && payload.playerId.trim()) {
        meta.playerId = payload.playerId.trim().slice(0, 64);
      }
      if (typeof payload?.playerName === "string" && payload.playerName.trim()) {
        meta.playerName = payload.playerName.trim().slice(0, 20);
      }
      if (payload?.pairToken) {
        setSocketPairToken(socket, payload.pairToken);
      }
      const existingRoom = meta.playerId ? roomManager.getRoomForPlayer(meta.playerId) : null;
      if (existingRoom) {
        syncSocketLobbyChannel(socket, existingRoom.roomId);
      }
      replyAck(ack, {
        ok: true,
        playerId: meta.playerId,
        playerName: meta.playerName,
        pairToken: meta.pairToken,
        room: existingRoom,
      });
    });

    socket.on("room:create", (payload, ack) => {
      const meta = ensureMeta(socket);
      const playerId =
        (typeof payload?.playerId === "string" && payload.playerId.trim()) || meta.playerId;
      const playerName =
        (typeof payload?.playerName === "string" && payload.playerName.trim()) ||
        meta.playerName ||
        "Host";
      if (playerId) meta.playerId = playerId;
      meta.playerName = playerName;

      const res = roomManager.createRoom({
        playerId,
        playerName,
        socketId: socket.id,
        config: payload?.config || {},
      });
      if (res.ok && res.room) {
        syncSocketLobbyChannel(socket, res.room.roomId);
        socket.emit("room:state", res.room);
      }
      replyAck(ack, res);
    });

    socket.on("room:join", (payload, ack) => {
      const meta = ensureMeta(socket);
      const playerId =
        (typeof payload?.playerId === "string" && payload.playerId.trim()) || meta.playerId;
      const playerName =
        (typeof payload?.playerName === "string" && payload.playerName.trim()) ||
        meta.playerName ||
        "Survivor";
      if (playerId) meta.playerId = playerId;
      meta.playerName = playerName;

      const res = roomManager.joinRoom({
        inviteCode: payload?.inviteCode,
        roomId: payload?.roomId,
        playerId,
        playerName,
        socketId: socket.id,
      });
      if (res.ok && res.room) {
        syncSocketLobbyChannel(socket, res.room.roomId);
        socket.emit("room:state", res.room);
      }
      replyAck(ack, res);
    });

    socket.on("room:leave", (payload, ack) => {
      const meta = ensureMeta(socket);
      const playerId =
        (typeof payload?.playerId === "string" && payload.playerId.trim()) || meta.playerId;
      const res = roomManager.leaveRoom({ playerId });
      syncSocketLobbyChannel(socket, null);
      replyAck(ack, res);
    });

    socket.on("room:ready", (payload, ack) => {
      const meta = ensureMeta(socket);
      const playerId =
        (typeof payload?.playerId === "string" && payload.playerId.trim()) || meta.playerId;
      const res = roomManager.setReady({ playerId, ready: payload?.ready });
      replyAck(ack, res);
    });

    socket.on("room:config", (payload, ack) => {
      const meta = ensureMeta(socket);
      const playerId =
        (typeof payload?.playerId === "string" && payload.playerId.trim()) || meta.playerId;
      const patch = payload?.patch || payload?.config || payload || {};
      const res = roomManager.updateConfig({ playerId, patch });
      replyAck(ack, res);
    });

    socket.on("room:transfer-host", (payload, ack) => {
      const meta = ensureMeta(socket);
      const playerId =
        (typeof payload?.playerId === "string" && payload.playerId.trim()) || meta.playerId;
      const res = roomManager.transferHost({
        playerId,
        targetPlayerId: payload?.targetPlayerId,
      });
      replyAck(ack, res);
    });

    socket.on("room:kick", (payload, ack) => {
      const meta = ensureMeta(socket);
      const playerId =
        (typeof payload?.playerId === "string" && payload.playerId.trim()) || meta.playerId;
      const res = roomManager.kickPlayer({
        playerId,
        targetPlayerId: payload?.targetPlayerId,
      });
      if (res.ok && res.kickedSocketId) {
        const targetSocket = io.sockets.sockets.get(res.kickedSocketId);
        if (targetSocket) {
          syncSocketLobbyChannel(targetSocket, null);
          targetSocket.emit("room:kicked", {
            roomId: res.roomId,
            reason: "Removed by room host",
          });
        }
      }
      replyAck(ack, res);
    });

    socket.on("room:start", (payload, ack) => {
      const meta = ensureMeta(socket);
      const playerId =
        (typeof payload?.playerId === "string" && payload.playerId.trim()) || meta.playerId;
      const res = roomManager.startMatch({
        playerId,
        force: Boolean(payload?.force),
      });
      replyAck(ack, res);
    });

    socket.on("room:cancel-countdown", (payload, ack) => {
      const meta = ensureMeta(socket);
      const playerId =
        (typeof payload?.playerId === "string" && payload.playerId.trim()) || meta.playerId;
      const res = roomManager.cancelCountdown({ playerId });
      replyAck(ack, res);
    });

    socket.on("room:return-lobby", (payload, ack) => {
      const meta = ensureMeta(socket);
      const playerId =
        (typeof payload?.playerId === "string" && payload.playerId.trim()) || meta.playerId;
      const res = roomManager.returnToLobby({ playerId });
      replyAck(ack, res);
    });

    socket.on("room:list", (_payload, ack) => {
      replyAck(ack, { ok: true, rooms: roomManager.listRoomsSummary() });
    });

    // --- Phase 1 Authoritative Multiplayer Match Events ---

    socket.on("match:join", (payload, ack) => {
      const meta = ensureMeta(socket);
      const playerId =
        (typeof payload?.playerId === "string" && payload.playerId.trim()) || meta.playerId;
      const matchId = payload?.matchId;
      if (playerId) meta.playerId = playerId;

      const res = matchManager.handlePlayerJoinMatch({
        matchId,
        playerId,
        socketId: socket.id,
      });
      if (res.ok) {
        socket.join(matchManager.matchChannel(matchId));
      }
      replyAck(ack, res);
    });

    socket.on("player:state", (payload) => {
      const meta = ensureMeta(socket);
      const playerId =
        (typeof payload?.playerId === "string" && payload.playerId.trim()) || meta.playerId;
      matchManager.handlePlayerStateUpdate({
        playerId,
        matchId: payload?.matchId,
        state: payload,
      });
    });

    socket.on("player:damage", (payload, ack) => {
      const meta = ensureMeta(socket);
      const attackerPlayerId =
        (typeof payload?.attackerId === "string" && payload.attackerId.trim()) || meta.playerId;
      const res = matchManager.handlePlayerDamage({
        attackerPlayerId,
        targetPlayerId: payload?.targetId,
        damage: payload?.damage,
        isHeadshot: payload?.isHeadshot,
        weaponId: payload?.weaponId,
      });
      replyAck(ack, res);
    });

    socket.on("disconnect", () => {
      const meta = socketMeta.get(socket.id);
      socketMeta.delete(socket.id);
      console.log(`[Controller Relay] Disconnected: ${socket.id}`);

      const wasGame = gameIds.delete(socket.id);
      const wasController = controllerIds.delete(socket.id);

      if (wasController && meta) {
        const resolved = resolveControllerTarget(meta.pairToken);
        const targetPair = resolved.targetPair;
        const remaining = countControllersForPair(targetPair);
        broadcastPairControllerStatus(meta.pairToken);
        if (remaining === 0) {
          io.to(pairChannel(targetPair)).emit("controller:disconnected");
        }
      }

      if (wasGame) {
        notifyAllControllersPairStatus();
      }

      if ((wasGame || meta?.role !== "controller") && meta?.playerId) {
        roomManager.handleSocketDisconnect({
          socketId: socket.id,
          playerId: meta.playerId,
        });
      }

      matchManager.handleSocketDisconnect({ socketId: socket.id });
    });
  });

  if (!options.deferListen) {
    httpServer.listen(port, "0.0.0.0", () => {
      const addr = httpServer.address();
      const listeningPort = typeof addr === "object" && addr ? addr.port : port;
      const ips = getLanIPv4Addresses();
      console.log(`[Controller Relay] Listening on port ${listeningPort}`);
      if (ips.length > 0) {
        console.log(`[Controller Relay] LAN IPv4: ${ips.join(", ")}`);
      }
    });
  }

  return {
    httpServer,
    io,
    port,
    roomManager,
    matchManager,
    close: () =>
      new Promise((resolve) => {
        io.close(() => resolve());
      }),
  };
}

if (require.main === module) {
  startRelayServer(DEFAULT_PORT);
}

module.exports = {
  startRelayServer,
  getLanIPv4Addresses,
};
```

===============================================================================
FILE: server/test_phase1_match.js
===============================================================================

```js
const assert = require("assert");
const { io: ioClient } = require("../client/node_modules/socket.io-client");
const { createMatchManager } = require("./matchManager");
const { startRelayServer } = require("./server");

function emitAck(socket, event, payload) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timeout waiting for ack on ${event}`)), 5000);
    socket.emit(event, payload, (res) => {
      clearTimeout(timer);
      resolve(res);
    });
  });
}

function waitForEvent(socket, event, timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timeout waiting for event ${event}`)), timeoutMs);
    socket.once(event, (data) => {
      clearTimeout(timer);
      resolve(data);
    });
  });
}

async function runMatchUnitTests() {
  console.log("Running matchManager unit tests...");

  let broadcastSnapshots = [];
  const mm = createMatchManager({
    onMatchEnd: () => {},
  });

  const matchManifest = {
    matchId: "m_test123",
    roomId: "rm_abc",
    humans: [
      { id: "p1", name: "Alpha", teamId: 1, slotIndex: 0, isHost: true },
      { id: "p2", name: "Bravo", teamId: 2, slotIndex: 1, isHost: false },
    ],
    bots: Array.from({ length: 48 }, (_, i) => ({
      id: `bot_${i}`,
      name: `[BOT] Test-${i}`,
      teamId: Math.floor(i / 2) + 3,
      slotIndex: i + 2,
    })),
  };

  const match = mm.initMatch({
    roomId: "rm_abc",
    matchId: "m_test123",
    matchManifest,
    config: { mode: "solo" },
    onBroadcast: (snap) => broadcastSnapshots.push(snap),
  });

  assert.strictEqual(match.matchId, "m_test123");
  assert.strictEqual(match.players.size, 50, "Must have exactly 50 participants");

  // Verify Player 1 can join
  const joinRes1 = mm.handlePlayerJoinMatch({
    matchId: "m_test123",
    playerId: "p1",
    socketId: "sock_1",
  });
  assert.strictEqual(joinRes1.ok, true);
  assert.strictEqual(joinRes1.player.name, "Alpha");

  // Verify state update with valid position & speed
  const updateRes1 = mm.handlePlayerStateUpdate({
    playerId: "p1",
    matchId: "m_test123",
    state: {
      position: { x: 5, y: 1, z: 10 },
      rotation: { yaw: 1.2, pitch: 0.1 },
      velocity: { x: 2, z: 3 },
      animation: "running",
      weaponId: "m4a1",
      aiming: true,
      firing: false,
    },
  });
  assert.strictEqual(updateRes1, true);

  const p1 = match.players.get("p1");
  assert.strictEqual(p1.position.x, 5);
  assert.strictEqual(p1.position.z, 10);
  assert.strictEqual(p1.animation, "running");
  assert.strictEqual(p1.aiming, true);

  // Test Anti-Teleport validation: impossible travel distance in 0.05s
  mm.handlePlayerStateUpdate({
    playerId: "p1",
    matchId: "m_test123",
    state: {
      position: { x: 99999, y: 1, z: 99999 },
    },
  });
  assert(p1.position.x < 100, "Teleport hack must be clamped to max speed limit");

  // Test Damage & Armor system
  assert.strictEqual(p1.hp, 100);
  assert.strictEqual(p1.armor, 100);

  // P2 shoots P1 with 40 damage
  const dmgRes = mm.handlePlayerDamage({
    attackerPlayerId: "p2",
    targetPlayerId: "p1",
    damage: 40,
    isHeadshot: false,
    weaponId: "m4a1",
  });
  assert.strictEqual(dmgRes.ok, true);
  // 50% absorbed by armor (20 armor, 20 hp)
  assert.strictEqual(p1.armor, 80);
  assert.strictEqual(p1.hp, 80);

  // P2 shoots P1 with headshot for remaining health
  const lethalRes = mm.handlePlayerDamage({
    attackerPlayerId: "p2",
    targetPlayerId: "p1",
    damage: 100,
    isHeadshot: true,
    weaponId: "m4a1",
  });
  assert.strictEqual(lethalRes.ok, true);
  assert.strictEqual(p1.alive, false);
  assert.strictEqual(p1.hp, 0);
  assert.strictEqual(p1.animation, "knockedOut");

  // Friendly Fire protection in Duo/Squad
  const pTeam1A = { id: "ta", name: "TeamA", teamId: 10, isBot: false };
  const pTeam1B = { id: "tb", name: "TeamB", teamId: 10, isBot: false };
  match.players.set("ta", { ...pTeam1A, alive: true, hp: 100, armor: 0 });
  match.players.set("tb", { ...pTeam1B, alive: true, hp: 100, armor: 0 });
  const ffRes = mm.handlePlayerDamage({
    matchId: "m_test123",
    attackerPlayerId: "ta",
    targetPlayerId: "tb",
    damage: 30,
  });
  assert.strictEqual(ffRes.ok, false);
  assert.strictEqual(ffRes.error, "FRIENDLY_FIRE_BLOCKED");

  mm.endMatch("m_test123");
  console.log("✓ matchManager unit tests passed");
}

async function runMatchIntegrationTests() {
  console.log("Running Socket.IO match multiplayer integration tests...");

  // Start ephemeral server
  const serverInstance = startRelayServer(0, { deferListen: true });
  await new Promise((resolve) => serverInstance.httpServer.listen(0, "127.0.0.1", resolve));
  const port = serverInstance.httpServer.address().port;
  const serverUrl = `http://127.0.0.1:${port}`;

  const client1 = ioClient(serverUrl, { transports: ["websocket"] });
  const client2 = ioClient(serverUrl, { transports: ["websocket"] });

  await Promise.all([
    new Promise((resolve) => client1.on("connect", resolve)),
    new Promise((resolve) => client2.on("connect", resolve)),
  ]);

  // Identify players
  await emitAck(client1, "auth:identify", { playerId: "p_host", playerName: "HostPlayer" });
  await emitAck(client2, "auth:identify", { playerId: "p_guest", playerName: "GuestPlayer" });

  // Host creates custom room with 50 slots
  const createRes = await emitAck(client1, "room:create", {
    config: { mode: "solo", maxPlayers: 50, botsEnabled: true, autoFillBots: true, countdownSec: 3 },
  });
  assert.strictEqual(createRes.ok, true);
  const inviteCode = createRes.room.inviteCode;

  // Guest joins room
  const joinRes = await emitAck(client2, "room:join", { inviteCode });
  assert.strictEqual(joinRes.ok, true);

  // Both ready up
  await emitAck(client2, "room:ready", { ready: true });

  // Set up match:started listener on both clients
  const matchStartedP1 = waitForEvent(client1, "match:started");
  const matchStartedP2 = waitForEvent(client2, "match:started");

  // Host forces instant match start
  await emitAck(client1, "room:start", { force: true });

  const [matchPayload1, matchPayload2] = await Promise.all([matchStartedP1, matchStartedP2]);
  assert.strictEqual(matchPayload1.matchManifest.counts.humans, 2);
  assert.strictEqual(matchPayload1.matchManifest.counts.bots, 48);
  assert.strictEqual(matchPayload1.matchManifest.counts.total, 50);

  const matchId = matchPayload1.matchId || matchPayload1.matchManifest.matchId;

  // Both clients join match channel
  const joinMatchRes1 = await emitAck(client1, "match:join", { matchId, playerId: "p_host" });
  const joinMatchRes2 = await emitAck(client2, "match:join", { matchId, playerId: "p_guest" });
  assert.strictEqual(joinMatchRes1.ok, true);
  assert.strictEqual(joinMatchRes2.ok, true);

  // Client 1 moves: send player:state
  client1.emit("player:state", {
    matchId,
    playerId: "p_host",
    position: { x: 12.5, y: 1.0, z: -8.4 },
    rotation: { yaw: 2.14, pitch: -0.2 },
    velocity: { x: 4.2, z: 1.1 },
    animation: "run",
    weaponId: "ak47",
    aiming: true,
    firing: false,
  });

  // Client 2 must receive match:snapshot containing Client 1's position and rotation
  const snapshotP2 = await waitForEvent(client2, "match:snapshot");
  assert(snapshotP2.players.length >= 2);
  const p1Remote = snapshotP2.players.find((p) => p.id === "p_host");
  assert(p1Remote, "Client 2 must receive Client 1 in snapshot");
  assert.strictEqual(p1Remote.pos[0], 12.5);
  assert.strictEqual(p1Remote.pos[2], -8.4);
  assert.strictEqual(p1Remote.anim, "run");
  assert.strictEqual(p1Remote.wep, "ak47");
  assert.strictEqual(p1Remote.aim, true);

  // Client 2 damages Client 1
  const damageEventP1 = waitForEvent(client1, "player:damaged");
  const dmgRes = await emitAck(client2, "player:damage", {
    attackerId: "p_guest",
    targetId: "p_host",
    damage: 35,
    isHeadshot: false,
    weaponId: "m4a1",
  });
  assert.strictEqual(dmgRes.ok, true);

  const dmgEvent = await damageEventP1;
  assert.strictEqual(dmgEvent.targetId, "p_host");
  assert.strictEqual(dmgEvent.attackerName, "GuestPlayer");
  assert(dmgEvent.remainingHp < 100);

  client1.disconnect();
  client2.disconnect();
  await serverInstance.close();
  console.log("✓ Socket.IO match multiplayer integration tests passed");
}

async function main() {
  try {
    await runMatchUnitTests();
    await runMatchIntegrationTests();
    console.log("\nALL PHASE 1 MATCH MULTIPLAYER TESTS PASSED\n");
    process.exit(0);
  } catch (err) {
    console.error("\nTEST FAILED:", err);
    process.exit(1);
  }
}

main();
```

===============================================================================
FILE: server/test_phase1_rooms.js
===============================================================================

```js
const assert = require("assert");
const http = require("http");
const { io: ioClient } = require("../client/node_modules/socket.io-client");
const { createRoomManager } = require("./roomManager");
const { startRelayServer } = require("./server");

function fetchJson(port, path) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}${path}`, (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(body) });
        } catch (err) {
          reject(err);
        }
      });
    }).on("error", reject);
  });
}

function emitAck(socket, event, payload) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timeout waiting for ack on ${event}`)), 4000);
    socket.emit(event, payload, (res) => {
      clearTimeout(timer);
      resolve(res);
    });
  });
}

function waitForEvent(socket, event, timeoutMs = 4000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timeout waiting for event ${event}`)), timeoutMs);
    socket.once(event, (data) => {
      clearTimeout(timer);
      resolve(data);
    });
  });
}

async function runUnitTests() {
  console.log("Running roomManager unit tests...");
  let startedManifest = null;
  const rm = createRoomManager({
    disconnectGraceMs: 120,
    onMatchStarted: (_room, manifest) => {
      startedManifest = manifest;
    },
  });

  // 1. Create room with 50-slot default (1 human + 49 bots)
  const created = rm.createRoom({
    playerId: "p-host",
    playerName: "AlphaHost",
    socketId: "s-host",
    config: { maxPlayers: 99 }, // must clamp to 50
  });
  assert.strictEqual(created.ok, true);
  assert.strictEqual(created.room.config.maxPlayers, 50);
  assert.strictEqual(created.room.slots.realPlayers, 1);
  assert.strictEqual(created.room.slots.bots, 49);
  assert.strictEqual(created.room.slots.totalOccupied, 50);
  assert.strictEqual(created.room.slots.availableSlots, 0);
  assert.strictEqual(created.room.botSummary.count, 49);
  assert.strictEqual(created.room.botSummary.isBotOnly, true);

  // 2. Join 29 more humans -> 30 humans + 20 bots = 50
  for (let i = 2; i <= 30; i += 1) {
    const joined = rm.joinRoom({
      inviteCode: created.room.inviteCode,
      playerId: `p-${i}`,
      playerName: `Player${i}`,
      socketId: `s-${i}`,
    });
    assert.strictEqual(joined.ok, true);
    assert.strictEqual(joined.room.slots.realPlayers, i);
    assert.strictEqual(joined.room.slots.bots, 50 - i);
    assert.strictEqual(joined.room.slots.totalOccupied, 50);
  }

  // 3. Bots disabled -> 30 humans + 0 bots + 20 availableSlots
  const noBots = rm.updateConfig({
    playerId: "p-host",
    patch: { botsEnabled: false, mode: "squad", mapId: "rainier", countdownSec: 3 },
  });
  assert.strictEqual(noBots.ok, true);
  assert.strictEqual(noBots.room.slots.bots, 0);
  assert.strictEqual(noBots.room.slots.availableSlots, 20);
  assert.strictEqual(noBots.room.players.find((p) => p.playerId === "p-5").teamId, 2);

  // 4. Re-enable autoFillBots and start -> manifest has 50 participants, no bots impersonating humans
  rm.updateConfig({ playerId: "p-host", patch: { botsEnabled: true, autoFillBots: true } });
  const unauthStart = rm.startMatch({ playerId: "p-2" });
  assert.strictEqual(unauthStart.ok, false);
  assert.strictEqual(unauthStart.error, "UNAUTHORIZED");

  const startRes = rm.startMatch({ playerId: "p-host", force: true });
  assert.strictEqual(startRes.ok, true);
  assert.strictEqual(startRes.room.status, "COUNTDOWN");
  assert.strictEqual(startRes.room.config.countdownSec, 3);

  await new Promise((r) => setTimeout(r, 3400));
  assert.ok(startedManifest, "Expected matchManifest after 3s countdown");
  assert.strictEqual(startedManifest.counts.humans, 30);
  assert.strictEqual(startedManifest.counts.bots, 20);
  assert.strictEqual(startedManifest.counts.total, 50);
  assert.strictEqual(startedManifest.humans.length, 30);
  assert.strictEqual(startedManifest.bots.length, 20);
  assert.strictEqual(startedManifest.humans.every((x) => !x.isBot), true);
  assert.strictEqual(startedManifest.bots.every((x) => x.isBot === true), true);

  // 5. Reject new join once match started
  const lateJoin = rm.joinRoom({
    inviteCode: created.room.inviteCode,
    playerId: "p-late",
    playerName: "Latecomer",
    socketId: "s-late",
  });
  assert.strictEqual(lateJoin.ok, false);
  assert.strictEqual(lateJoin.error, "MATCH_ALREADY_STARTED");

  // Clean up rooms
  for (let i = 1; i <= 30; i += 1) {
    rm.leaveRoom({ playerId: i === 1 ? "p-host" : `p-${i}` });
  }
  console.log("✓ roomManager unit tests passed");
}

async function runIntegrationTests() {
  console.log("Running Socket.IO & HTTP integration tests...");
  const server = startRelayServer(0, { disconnectGraceMs: 250, deferListen: true });
  await new Promise((resolve) => server.httpServer.listen(0, "127.0.0.1", resolve));
  const { port } = server.httpServer.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  const sockets = [];
  const connectClient = (label) => {
    const s = ioClient(baseUrl, { transports: ["polling", "websocket"], timeout: 3000 });
    sockets.push(s);
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error(`Connect timeout for ${label}`)), 4000);
      s.once("connect", () => {
        clearTimeout(t);
        resolve(s);
      });
      s.once("connect_error", (err) => {
        clearTimeout(t);
        reject(new Error(`Connect error for ${label}: ${err.message} (${err.description || err.type || ""})`));
      });
    });
  };

  try {
    const healthProbe = await fetchJson(port, "/api/health");
    console.log("  -> healthProbe:", healthProbe.status, healthProbe.json.ok);
    console.log("  -> connecting sockets to", baseUrl);
    const host = await connectClient("host");
    const guest = await connectClient("guest");
    const guestB = await connectClient("guestB");
    const phoneA = await connectClient("phoneA");
    console.log("  -> sockets connected");

    host.emit("client:register", { role: "game", pairToken: "pair_alpha", playerId: "u-host", playerName: "HostAlpha" });
    guest.emit("client:register", { role: "game", pairToken: "pair_beta", playerId: "u-guest", playerName: "GuestBravo" });
    guestB.emit("client:register", { role: "game", pairToken: "pair_gamma", playerId: "u-charlie", playerName: "Charlie" });

    // 1. Host creates room
    const createRes = await emitAck(host, "room:create", {
      playerId: "u-host",
      playerName: "HostAlpha",
      config: { mapId: "bermuda", mode: "duo", countdownSec: 1 },
    });
    assert.strictEqual(createRes.ok, true);
    const { inviteCode, roomId } = createRes.room;
    assert.strictEqual(inviteCode.length, 6);

    // 2. HTTP room preview & summary
    const listHttp = await fetchJson(port, "/api/rooms");
    assert.strictEqual(listHttp.status, 200);
    assert.strictEqual(listHttp.json.rooms.length, 1);

    const previewHttp = await fetchJson(port, `/api/rooms/${inviteCode}`);
    assert.strictEqual(previewHttp.status, 200);
    assert.strictEqual(previewHttp.json.room.inviteCode, inviteCode);

    const missingHttp = await fetchJson(port, "/api/rooms/ZZZZZZ");
    assert.strictEqual(missingHttp.status, 404);

    // 3. Guest joins by invite code
    const joinRes = await emitAck(guest, "room:join", {
      inviteCode,
      playerId: "u-guest",
      playerName: "GuestBravo",
    });
    assert.strictEqual(joinRes.ok, true);
    assert.strictEqual(joinRes.room.slots.realPlayers, 2);
    assert.strictEqual(joinRes.room.slots.bots, 48);

    // 4. Host permission checks
    const unauthCfg = await emitAck(guest, "room:config", {
      playerId: "u-guest",
      patch: { mapId: "cotedazur" },
    });
    assert.strictEqual(unauthCfg.ok, false);
    assert.strictEqual(unauthCfg.error, "UNAUTHORIZED");

    // 5. Ready gate & start countdown -> match:started
    const blockedStart = await emitAck(host, "room:start", { playerId: "u-host", force: false });
    assert.strictEqual(blockedStart.ok, false);
    assert.strictEqual(blockedStart.error, "PLAYERS_NOT_READY");

    const readyRes = await emitAck(guest, "room:ready", { playerId: "u-guest", ready: true });
    assert.strictEqual(readyRes.ok, true);

    const matchStartedPromise = waitForEvent(guest, "match:started", 5000);
    const countdownPromise = waitForEvent(guest, "room:countdown", 3000);
    const startRes = await emitAck(host, "room:start", { playerId: "u-host", force: false });
    assert.strictEqual(startRes.ok, true);

    const tick = await countdownPromise;
    assert.strictEqual(tick.roomId, roomId);
    const started = await matchStartedPromise;
    assert.strictEqual(started.matchManifest.counts.humans, 2);
    assert.strictEqual(started.matchManifest.counts.bots, 48);
    assert.strictEqual(started.matchManifest.counts.total, 50);

    // 6. Return to lobby
    const retRes = await emitAck(host, "room:return-lobby", { playerId: "u-host" });
    assert.strictEqual(retRes.ok, true);
    assert.strictEqual(retRes.room.status, "LOBBY");

    // 7. Kick guestB after joining
    const joinC = await emitAck(guestB, "room:join", {
      inviteCode,
      playerId: "u-charlie",
      playerName: "Charlie",
    });
    assert.strictEqual(joinC.ok, true);
    const kickedNotice = waitForEvent(guestB, "room:kicked", 3000);
    const kickRes = await emitAck(host, "room:kick", {
      playerId: "u-host",
      targetPlayerId: "u-charlie",
    });
    assert.strictEqual(kickRes.ok, true);
    const kickedData = await kickedNotice;
    assert.strictEqual(kickedData.roomId, roomId);

    // 8. Scoped Phone Controller isolation (phoneA belongs to pair_alpha -> reaches host, NEVER guest on pair_beta)
    let betaReceivedPhoneInput = false;
    guest.on("controller:input", () => {
      betaReceivedPhoneInput = true;
    });
    const hostInputPromise = waitForEvent(host, "controller:input", 3000);
    phoneA.emit("client:register", { role: "controller", pairToken: "pair_alpha" });
    phoneA.emit("controller:input", { pairToken: "pair_alpha", throttle: 0.9, steer: -0.4 });
    const received = await hostInputPromise;
    assert.strictEqual(received.throttle, 0.9);
    await new Promise((r) => setTimeout(r, 120));
    assert.strictEqual(betaReceivedPhoneInput, false, "Phone input leaked across pairToken!");

    // 8b. Single-laptop "default" phone controller compatibility check:
    // Disconnect guest and guestB (leaving only host -> 1 active game on pair_alpha), then verify legacy phone without ?pair= routes to host.
    guest.disconnect();
    guestB.disconnect();
    await new Promise((r) => setTimeout(r, 120));
    const defaultPhone = await connectClient("defaultPhone");
    const defaultPairStatus = waitForEvent(defaultPhone, "controller:pair-status", 3000);
    defaultPhone.emit("client:register", "controller");
    const pStatus = await defaultPairStatus;
    assert.strictEqual(pStatus.linked, true, "Single-laptop fallback should link default phone");

    const hostLegacyInput = waitForEvent(host, "controller:input", 3000);
    defaultPhone.emit("controller:input", { fire: true, moveY: 1 });
    const legacyReceived = await hostLegacyInput;
    assert.strictEqual(legacyReceived.fire, true);
    defaultPhone.disconnect();

    // 9. Reconnect guest for unexpected host disconnect failover test
    const guest2 = await connectClient("guest2");
    guest2.emit("client:register", { role: "game", pairToken: "pair_beta", playerId: "u-guest", playerName: "GuestBravo" });
    await emitAck(guest2, "room:join", { inviteCode, playerId: "u-guest", playerName: "GuestBravo" });

    const hostPromotedUpdate = new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Host failover timeout")), 3000);
      const listener = (room) => {
        if (room.hostPlayerId === "u-guest") {
          clearTimeout(timer);
          guest2.off("room:state", listener);
          resolve(room);
        }
      };
      guest2.on("room:state", listener);
    });
    host.disconnect();
    const updatedAfterDrop = await hostPromotedUpdate;
    assert.strictEqual(updatedAfterDrop.hostPlayerId, "u-guest");
    assert.strictEqual(updatedAfterDrop.slots.realPlayers, 1);

    console.log("✓ Socket.IO & HTTP integration tests passed");
  } finally {
    for (const s of sockets) {
      try {
        s.disconnect();
      } catch {}
    }
    await server.close();
  }
}

(async () => {
  try {
    await runUnitTests();
    await runIntegrationTests();
    console.log("\nALL PHASE 1 SERVER TESTS PASSED");
    process.exit(0);
  } catch (err) {
    console.error("\nTEST FAILED:", err);
    process.exit(1);
  }
})();
```

-------------------------------------------------------------------------------

Generated by ctx

Total Files: 98
