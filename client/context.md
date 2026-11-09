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
├── README.md
├── package.json
├── public
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
└── src
    ├── App.css
    ├── App.js
    ├── App.jsx
    ├── App.test.js
    ├── components
    │   ├── Car
    │   │   ├── BMWM4.js
    │   │   └── CarController.js
    │   └── World
    │       └── OpenWorldMap.js
    ├── index.css
    ├── index.js
    ├── main.jsx
    ├── reportWebVitals.js
    └── setupTests.js
```

===============================================================================
FILE: .gitignore
===============================================================================

```text
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

===============================================================================
FILE: package.json
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
    "three": "^0.187.0",
    "web-vitals": "^2.1.4"
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
FILE: public/index.html
===============================================================================

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
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
FILE: public/manifest.json
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
FILE: public/robots.txt
===============================================================================

```text
# https://www.robotstxt.org/robotstxt.html
User-agent: *
Disallow:
```

===============================================================================
FILE: README.md
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
FILE: src/App.css
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
FILE: src/App.js
===============================================================================

```js
export { default } from "./App.jsx";
```

===============================================================================
FILE: src/App.jsx
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
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Grid,
  OrbitControls,
  PerspectiveCamera,
  Loader,
} from "@react-three/drei";
import * as THREE from "three";
import OpenWorldMap from "./components/World/OpenWorldMap";
import BMWM4 from "./components/Car/BMWM4";
import CarController from "./components/Car/CarController";
import "./index.css";

const SCENE_PRESETS = {
  track: {
    label: "Proving Ground",
    bg: "#0b111b",
    fog: ["#0b111b", 28, 165],
    ambient: 0.85,
    hemiSky: "#dceaff",
    hemiGround: "#182232",
    dirIntensity: 3.4,
    dirColor: "#fff6e8",
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

const CAMERA_MODES = [
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

// The old flat circuit (grid, rings, pylons, light towers) sits at y ≈ 0 and
// would float or bury itself relative to the open-world map. Set to true only
// if you drive without the map.
const SHOW_PROVING_GROUND = false;

function DrivingWorld({ presetKey, mode }) {
  const preset = SCENE_PRESETS[presetKey] || SCENE_PRESETS.track;

  // Generate track pylons, curbs, and light gantries around the circuit
  const trackElements = useMemo(() => {
    const gates = [];
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const innerR = 32;
      const outerR = 52;
      const midR = 88;
      gates.push({
        id: i,
        angle,
        inner: [Math.cos(angle) * innerR, 0, Math.sin(angle) * innerR],
        outer: [Math.cos(angle) * outerR, 0, Math.sin(angle) * outerR],
        gantry: [Math.cos(angle) * midR, 0, Math.sin(angle) * midR],
      });
    }
    return gates;
  }, []);

  return (
    <>
      <color attach="background" args={[preset.bg]} />
      <fog attach="fog" args={preset.fog} />

      <ambientLight intensity={preset.ambient} />
      <hemisphereLight args={[preset.hemiSky, preset.hemiGround, 1.15]} />

      <directionalLight
        position={[14, 22, 16]}
        intensity={preset.dirIntensity}
        color={preset.dirColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
      />

      <spotLight
        position={[-8, 9, -6]}
        angle={0.75}
        penumbra={1}
        intensity={85}
        distance={28}
        color="#9fc9ff"
      />

      <pointLight
        position={[5, 2.5, -6]}
        intensity={20}
        color={preset.accentColor}
      />
      <pointLight position={[-5, 2.5, 6]} intensity={14} color="#ffffff" />

      {/* Main Asphalt Ground (showroom only; the open-world map is the floor in driving mode) */}
      {mode !== "driving" && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.035, 0]}
          receiveShadow
        >
          <planeGeometry args={[320, 320]} />
          <meshStandardMaterial
            color={preset.groundColor}
            roughness={presetKey === "night" ? 0.22 : 0.36}
            metalness={presetKey === "night" ? 0.42 : 0.25}
          />
        </mesh>
      )}

      {/* Showroom Plinth (only in showroom or studio preset) */}
      {(mode === "showroom" || presetKey === "studio") && (
        <mesh position={[0, -0.12, 0]} receiveShadow>
          <cylinderGeometry args={[5.2, 5.4, 0.16, 96]} />
          <meshStandardMaterial
            color="#171e29"
            roughness={0.28}
            metalness={0.48}
          />
        </mesh>
      )}

      {/* Proving Ground Grid & Circuit Architecture */}
      {mode === "driving" && SHOW_PROVING_GROUND && (
        <>
          <Grid
            position={[0, -0.028, 0]}
            args={[280, 280]}
            cellSize={4}
            cellThickness={0.6}
            cellColor={preset.gridCell}
            sectionSize={20}
            sectionThickness={1.2}
            sectionColor={preset.gridSection}
            fadeDistance={145}
            fadeStrength={1.4}
          />

          {/* Inner & Outer Circuit Asphalt Rings */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.025, 0]}
            receiveShadow
          >
            <ringGeometry args={[32, 52, 96]} />
            <meshStandardMaterial
              color="#151d28"
              roughness={0.42}
              metalness={0.18}
            />
          </mesh>

          {/* Glowing Circuit Boundary Ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
            <ringGeometry args={[134.5, 135.5, 128]} />
            <meshBasicMaterial color={preset.accentColor} />
          </mesh>

          {/* Circuit Pylons & Overhead Light Gantries */}
          {trackElements.map((item) => (
            <group key={item.id}>
              {/* Inner Apex Pylon */}
              <mesh position={[item.inner[0], 0.45, item.inner[2]]} castShadow>
                <cylinderGeometry args={[0.14, 0.22, 0.9, 16]} />
                <meshStandardMaterial
                  color={item.id % 2 === 0 ? "#ff3b30" : "#f4f7fb"}
                  emissive={item.id % 2 === 0 ? "#ff2a1f" : "#1769d2"}
                  emissiveIntensity={presetKey === "night" ? 1.4 : 0.35}
                />
              </mesh>

              {/* Outer Track Marker */}
              <mesh position={[item.outer[0], 0.55, item.outer[2]]} castShadow>
                <boxGeometry args={[0.35, 1.1, 0.35]} />
                <meshStandardMaterial
                  color="#1c2636"
                  emissive={preset.accentColor}
                  emissiveIntensity={0.6}
                />
              </mesh>

              {/* Outer Perimeter Light Towers (every 2nd slot) */}
              {item.id % 2 === 0 && (
                <group
                  position={[item.gantry[0], 0, item.gantry[2]]}
                  rotation={[0, -item.angle, 0]}
                >
                  <mesh position={[0, 4.5, 0]} castShadow>
                    <boxGeometry args={[0.45, 9, 0.45]} />
                    <meshStandardMaterial
                      color="#182232"
                      metalness={0.6}
                      roughness={0.3}
                    />
                  </mesh>
                  <mesh position={[-1.8, 8.6, 0]}>
                    <boxGeometry args={[3.8, 0.25, 0.6]} />
                    <meshBasicMaterial
                      color={presetKey === "night" ? "#00d2ff" : "#dceaff"}
                    />
                  </mesh>
                </group>
              )}
            </group>
          ))}
        </>
      )}

      {/* Fixed-height contact shadow: only valid on the flat showroom floor */}
      {mode !== "driving" && (
        <ContactShadows
          position={[0, -0.024, 0]}
          opacity={0.5}
          scale={14}
          blur={2.6}
          far={5}
          resolution={512}
          color="#000000"
        />
      )}
    </>
  );
}

function FollowCamera({ carRef, physicsStateRef, active, cameraMode }) {
  const { camera } = useThree();
  const desiredPosition = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());
  const currentLook = useRef(new THREE.Vector3());

  const camPreset =
    CAMERA_MODES.find((c) => c.id === cameraMode) || CAMERA_MODES[0];

  useFrame((_, rawDelta) => {
    const car = carRef.current;
    if (!active || !car) return;
    const dt = Math.min(rawDelta, 0.05);

    const phys = physicsStateRef.current || {
      vx: 0,
      vy: 0,
      steering: 0,
      boost: false,
    };
    const yaw = car.rotation.y;

    if (cameraMode === "hood") {
      const hoodOffset = new THREE.Vector3(...camPreset.offset);
      hoodOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
      camera.position.copy(car.position).add(hoodOffset);

      const forwardLook = new THREE.Vector3(
        12,
        camPreset.lookY,
        -phys.steering * 3,
      );
      forwardLook.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
      lookTarget.current.copy(car.position).add(forwardLook);
      camera.lookAt(lookTarget.current);
    } else {
      // Swing camera slightly into the drift angle so the side of the car is visible while sliding
      const driftSwing = THREE.MathUtils.clamp(phys.vy * 0.14, -1.6, 1.6);
      const speedPullback = THREE.MathUtils.clamp(
        Math.abs(phys.vx) * 0.035,
        0,
        1.4,
      );

      const offset = new THREE.Vector3(
        camPreset.offset[0] - speedPullback,
        camPreset.offset[1],
        camPreset.offset[2] + driftSwing,
      );
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);

      desiredPosition.current.copy(car.position).add(offset);
      camera.position.lerp(desiredPosition.current, 1 - Math.exp(-6.5 * dt));

      const lookAhead = new THREE.Vector3(
        2.2,
        camPreset.lookY,
        -phys.steering * 1.1,
      );
      lookAhead.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
      lookTarget.current.copy(car.position).add(lookAhead);

      currentLook.current.lerp(lookTarget.current, 1 - Math.exp(-10 * dt));
      camera.lookAt(currentLook.current);
    }

    // Dynamic FOV expansion at high speed / M-Boost
    const speedRatio = THREE.MathUtils.clamp(Math.abs(phys.vx) / 55, 0, 1);
    const targetFov = camPreset.fov + speedRatio * 10 + (phys.boost ? 4.5 : 0);
    if (Math.abs(camera.fov - targetFov) > 0.05) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 5 * dt);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

export default function App() {
  const [mode, setMode] = useState("showroom");
  const [scenePreset, setScenePreset] = useState("track");
  const [cameraMode, setCameraMode] = useState("chase");
  const [telemetry, setTelemetry] = useState({
    speed: 0,
    rpm: 850,
    gear: "N",
    drifting: false,
    driftAngle: 0,
    boost: false,
  });
  const [modelError, setModelError] = useState("");
  const collidersRef = useRef([]);
  const carRef = useRef(null);
  const wheelAssembliesRef = useRef([]);
  const physicsStateRef = useRef({
    vx: 0,
    vy: 0,
    steering: 0,
    isDrifting: false,
    boost: false,
  });

  const handleWheelsReady = useCallback((rigData) => {
    wheelAssembliesRef.current = rigData;
  }, []);

  const handleModelError = useCallback((error) => {
    console.error("BMW M4 model failed to load:", error);
    setModelError("Could not load the BMW M4 GLB. Check the model file path.");
  }, []);

  const enterDriving = useCallback(() => {
    setMode("driving");
  }, []);

  const enterShowroom = useCallback(() => {
    setMode("showroom");
    if (carRef.current) {
      carRef.current.position.set(0, 0, 0);
      carRef.current.rotation.set(0, 0, 0);
    }
  }, []);

  const cycleCamera = useCallback(() => {
    setCameraMode((prev) => {
      const idx = CAMERA_MODES.findIndex((c) => c.id === prev);
      return CAMERA_MODES[(idx + 1) % CAMERA_MODES.length].id;
    });
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape" && mode === "driving") {
        enterShowroom();
      } else if (e.key.toLowerCase() === "c" && mode === "driving") {
        cycleCamera();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mode, enterShowroom, cycleCamera]);

  const rpmPercent = Math.min(100, Math.round((telemetry.rpm / 7500) * 100));

  return (
    <main className="game-shell">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <PerspectiveCamera
          makeDefault
          position={[5.3, 3.1, 7.2]}
          fov={42}
          near={0.1}
          far={320}
        />

        {mode === "driving" && (
          <Suspense fallback={null}>
            <OpenWorldMap collidersRef={collidersRef} />
          </Suspense>
        )}

        <DrivingWorld presetKey={scenePreset} mode={mode} />

        <Suspense fallback={null}>
          <BMWM4
            ref={carRef}
            onWheelsReady={handleWheelsReady}
            onError={handleModelError}
          />
        </Suspense>

        <CarController
          carRef={carRef}
          wheelAssembliesRef={wheelAssembliesRef}
          collidersRef={collidersRef}
          enabled={mode === "driving"}
          onTelemetryChange={setTelemetry}
          physicsStateRef={physicsStateRef}
        />

        <FollowCamera
          carRef={carRef}
          physicsStateRef={physicsStateRef}
          active={mode === "driving"}
          cameraMode={cameraMode}
        />

        {/* {mode === "showroom" && (
          <OrbitControls
            makeDefault
            target={[0, 0.86, 0]}
            enableDamping
            dampingFactor={0.06}
            autoRotate
            autoRotateSpeed={0.42}
            minDistance={4.2}
            maxDistance={13}
            maxPolarAngle={Math.PI / 2.02}
          />
        )} */}
      </Canvas>

      <div className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark">M</span>
          <div>
            <div className="eyebrow">BMW M PERFORMANCE</div>
            <div className="brand-title">M4 COMPETITION</div>
          </div>
        </div>

        <div className="topbar-controls">
          <div className="scene-switch">
            {Object.entries(SCENE_PRESETS).map(([key, item]) => (
              <button
                key={key}
                className={
                  scenePreset === key ? "scene-button active" : "scene-button"
                }
                onClick={() => setScenePreset(key)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {mode === "driving" && (
            <button className="camera-button" onClick={cycleCamera}>
              CAM: {CAMERA_MODES.find((c) => c.id === cameraMode)?.label}
            </button>
          )}

          <div className="mode-switch">
            <button
              className={
                mode === "showroom" ? "mode-button active" : "mode-button"
              }
              onClick={enterShowroom}
            >
              Showroom
            </button>
            <button
              className={
                mode === "driving" ? "mode-button active" : "mode-button"
              }
              onClick={enterDriving}
            >
              Drive
            </button>
          </div>
        </div>
      </div>

      {mode === "showroom" ? (
        <section className="showroom-panel">
          <div className="panel-kicker">2021 · G82 GENERATION</div>
          <h1>
            Precision.
            <br />
            In every line.
          </h1>
          <p>
            Explore the BMW M4 Competition. Drag to orbit, scroll to zoom,
            switch environments above, or enter the proving ground to test RWD
            drift physics.
          </p>
          <button className="primary-button" onClick={enterDriving}>
            <span>Enter driving mode</span>
            <span aria-hidden="true">↗</span>
          </button>
          <div className="showroom-hint">
            DRAG TO ROTATE <span>·</span> SCROLL TO ZOOM
          </div>
        </section>
      ) : (
        <>
          <section className="drive-hud">
            <div className="hud-row">
              <div>
                <div className="hud-label">VEHICLE SPEED</div>
                <div className="speed-reading">
                  {String(Math.abs(telemetry.speed)).padStart(3, "0")}
                  <span>KM/H</span>
                </div>
              </div>
              <div className="gear-box">
                <div className="hud-label">GEAR</div>
                <div className="gear-reading">{telemetry.gear}</div>
              </div>
            </div>

            <div className="rpm-section">
              <div className="rpm-header">
                <span className="hud-label">ENGINE RPM</span>
                <span className="rpm-value">{telemetry.rpm}</span>
              </div>
              <div className="rpm-bar-track">
                <div
                  className={
                    rpmPercent > 84 ? "rpm-bar-fill redline" : "rpm-bar-fill"
                  }
                  style={{ width: `${rpmPercent}%` }}
                />
              </div>
            </div>

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
          </section>

          <section className="drive-help">
            <div>
              <kbd>W</kbd>
              <kbd>S</kbd>
              <span>Throttle / Brake</span>
            </div>
            <div>
              <kbd>A</kbd>
              <kbd>D</kbd>
              <span>Steer</span>
            </div>
            <div>
              <kbd>SPACE</kbd>
              <span>Handbrake Drift</span>
            </div>
            <div>
              <kbd>SHIFT</kbd>
              <span>M-Boost</span>
            </div>
            <div>
              <kbd>C</kbd>
              <span>Camera</span>
              <kbd>R</kbd>
              <span>Reset</span>
            </div>
            <div className="drive-note">ESC / SHOWROOM BUTTON TO EXIT</div>
          </section>
        </>
      )}

      {modelError && <div className="error-banner">{modelError}</div>}
      <div className="corner-status">
        <span className="status-dot" />
        M-DYNAMIC PHYSICS · {SCENE_PRESETS[scenePreset]?.label.toUpperCase()}
      </div>
      <Loader containerStyles={{ background: "rgba(9,13,20,.92)" }} />
    </main>
  );
}
```

===============================================================================
FILE: src/App.test.js
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
FILE: src/components/Car/BMWM4.js
===============================================================================

```js
import React, { forwardRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

import modelUrl from "../../assets/models/2021_bmw_m4_competition.glb";

export const BMW_M4_SCALE = 0.73;

// Reflection strength on the car paint/glass.
// Raise it if the car is still too dark, lower it if it looks washed out.
const CAR_ENV_INTENSITY = 1.2;

// The GLB's front is +Z. Rotating +90° on Y makes the car face +X,
// which is what CarController and FollowCamera expect.
const MODEL_YAW = Math.PI / 2;

// The front wheels are authored with a ~20° showroom steering turn.
// It is removed once so steering = 0 means "straight ahead".
// If the front wheels look turned at rest, flip the sign or set this to 0.
const PRE_POSED_STEER = -0.34906585;

// Names below are taken from the uploaded GLB's actual node hierarchy.
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

// GLTFLoader renames nodes: spaces become "_" ("brake disc" -> "brake_disc").
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
  // Refresh every ancestor (incl. the scaled <group>) and descendant first,
  // so all measurements below use the same up-to-date matrices.
  model.updateWorldMatrix(true, true);

  const assemblies = [];

  for (const definition of WHEEL_DEFINITIONS) {
    const tyres = definition.tyreNames
      .map((name) => getNode(model, name))
      .filter(Boolean);
    const rim = getNode(model, definition.rimName);
    const disc = getNode(model, definition.discName);
    const caliper = getNode(model, definition.caliperName);

    // Only tyres + rim are required. A missing disc or caliper must never
    // disable steering and rolling for the whole wheel.
    if (!tyres.length || !rim) {
      console.warn(`[BMW M4] Incomplete wheel assembly: ${definition.id}`);
      continue;
    }

    const rollingParts = [...tyres, rim];
    if (disc) rollingParts.push(disc);

    // Wheel centre (model space) and radius (world units).
    const box = new THREE.Box3();
    [...tyres, rim].forEach((part) => box.expandByObject(part));
    const centerLocal = model.worldToLocal(box.getCenter(new THREE.Vector3()));
    const radius = (box.max.y - box.min.y) / 2;

    // Pivots sit directly under `model`: steering = rotation.y,
    // rolling = rotation.x (the axle runs along model X).
    const steeringPivot = new THREE.Group();
    steeringPivot.name = `GAME_STEER_${definition.id}`;
    steeringPivot.position.copy(centerLocal);
    model.add(steeringPivot);

    const rollingPivot = new THREE.Group();
    rollingPivot.name = `GAME_ROLL_${definition.id}`;
    steeringPivot.add(rollingPivot);

    // Pose the pivot like the authored wheel, attach (keeps world transform),
    // then reset to straight.
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

  console.info(
    `[BMW M4] Built ${assemblies.length}/${WHEEL_DEFINITIONS.length} wheel pivots.`,
  );

  return assemblies;
}

// React StrictMode runs effects twice in dev. Build the rig only once per
// model, otherwise the front wheels would be un-turned twice.
const wheelRigCache = new WeakMap();

const BMWM4 = forwardRef(function BMWM4(
  { onWheelsReady, onError },
  forwardedRef,
) {
  const { scene } = useGLTF(modelUrl);
  const gl = useThree((state) => state.gl);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.rotation.y = MODEL_YAW;
    return clone;
  }, [scene]);

  // Metallic paint only shows reflections. Without an environment map it
  // renders as a flat black silhouette. RoomEnvironment is generated locally
  // (no network download).
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
          // Car-only reflections, so the map keeps its current look.
          if (material.isMeshStandardMaterial) {
            material.envMap = envMap;
            material.envMapIntensity = CAR_ENV_INTENSITY;
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

      console.table(
        assemblies.map((wheel) => ({
          id: wheel.id,
          front: wheel.isFront,
          radius: wheel.radius,
        })),
      );
      if (mounted) onWheelsReady?.(assemblies);
    } catch (error) {
      console.error("[BMW M4] Wheel setup failed:", error);
      if (mounted) onError?.(error);
    }

    return () => {
      mounted = false;
      onWheelsReady?.([]);
    };
  }, [model, envMap, onError, onWheelsReady]);

  return (
    <group ref={forwardedRef} scale={BMW_M4_SCALE}>
      <primitive object={model} />
    </group>
  );
});

useGLTF.preload(modelUrl);

export default BMWM4;
```

===============================================================================
FILE: src/components/Car/CarController.js
===============================================================================

```js
// import { useEffect, useRef } from "react";
// import { useFrame } from "@react-three/fiber";
// import * as THREE from "three";
// import { BMW_M4_SCALE } from "./BMWM4";

// const MAX_FORWARD_SPEED = 31;
// const MAX_REVERSE_SPEED = 9;
// const ACCELERATION = 7.5;
// const BRAKE_DECELERATION = 17;
// const COAST_DECELERATION = 1.8;
// const WHEELBASE = 2.85;
// const WHEEL_RADIUS = 0.34; // fallback only, BMWM4 measures the real radius
// const MAX_STEERING_ANGLE = 0.48;

// // Collision tuning (world units)
// const CAR_HALF_LENGTH = 2.3 * BMW_M4_SCALE;
// const CAR_HALF_WIDTH = 0.95 * BMW_M4_SCALE;
// const WALL_RAY_HEIGHT = 0.55; // obstacles taller than this block the car
// const WALL_RAY_COUNT = 16;
// const MAX_PUSH = 0.6;
// const GROUND_RAY_UP = 0.6;
// const GROUND_RAY_DOWN = 1.6;
// const NEARBY_RADIUS = 30;
// const NEARBY_REFRESH = 10;

// const GEAR_TOP_SPEEDS = [7, 13, 19, 25, MAX_FORWARD_SPEED];
// const IDLE_TELEMETRY = {
//   speed: 0,
//   rpm: 850,
//   gear: "N",
//   drifting: false,
//   driftAngle: 0,
//   boost: false,
// };

// // Scratch objects (no per-frame allocations)
// const _forward = new THREE.Vector3();
// const _before = new THREE.Vector3();
// const _origin = new THREE.Vector3();
// const _dir = new THREE.Vector3();
// const _normal = new THREE.Vector3();
// const _down = new THREE.Vector3(0, -1, 0);
// const raycaster = new THREE.Raycaster();
// raycaster.firstHitOnly = true; // used by three-mesh-bvh

// // Rays fan out from the car centre; each one is as long as the car's
// // elliptical footprint in that direction.
// const WALL_PROBES = Array.from({ length: WALL_RAY_COUNT }, (_, i) => {
//   const angle = (i / WALL_RAY_COUNT) * Math.PI * 2;
//   const c = Math.cos(angle);
//   const s = Math.sin(angle);
//   const radius =
//     (CAR_HALF_LENGTH * CAR_HALF_WIDTH) /
//     Math.hypot(CAR_HALF_WIDTH * c, CAR_HALF_LENGTH * s);
//   return { dir: new THREE.Vector3(c, 0, s), radius };
// });

// function getNearbyMeshes(cache, colliders, position) {
//   const moved = Math.hypot(position.x - cache.x, position.z - cache.z);

//   if (
//     cache.source !== colliders ||
//     cache.count !== colliders.length ||
//     moved > NEARBY_REFRESH
//   ) {
//     cache.source = colliders;
//     cache.count = colliders.length;
//     cache.x = position.x;
//     cache.z = position.z;
//     cache.meshes = colliders
//       .filter(({ box }) => box.distanceToPoint(position) < NEARBY_RADIUS)
//       .map(({ mesh }) => mesh);
//   }

//   return cache.meshes;
// }

// // Pushes the car out of any wall that enters its footprint. Because only the
// // penetrating part is removed, the car slides along walls naturally.
// function collideWithWalls(car, meshes) {
//   for (const probe of WALL_PROBES) {
//     _dir.copy(probe.dir).applyQuaternion(car.quaternion);
//     _origin.set(
//       car.position.x,
//       car.position.y + WALL_RAY_HEIGHT,
//       car.position.z,
//     );

//     raycaster.set(_origin, _dir);
//     raycaster.far = probe.radius;

//     const hit = raycaster.intersectObjects(meshes, false)[0];
//     if (!hit || !hit.face) continue;

//     _normal.copy(hit.face.normal).transformDirection(hit.object.matrixWorld);
//     if (Math.abs(_normal.y) > 0.7) continue; // floor / ramp, not a wall

//     _normal.y = 0;
//     _normal.normalize();
//     if (_normal.dot(_dir) > 0) _normal.negate(); // always push away from wall

//     const depth = (probe.radius - hit.distance) * Math.abs(_normal.dot(_dir));
//     car.position.addScaledVector(_normal, Math.min(depth, MAX_PUSH));
//   }
// }

// // Keeps the car on the road surface (ramps, slopes, small curbs).
// function followGround(car, meshes, delta) {
//   _origin.set(car.position.x, car.position.y + GROUND_RAY_UP, car.position.z);
//   raycaster.set(_origin, _down);
//   raycaster.far = GROUND_RAY_UP + GROUND_RAY_DOWN;

//   let groundY = 0;
//   for (const hit of raycaster.intersectObjects(meshes, false)) {
//     if (!hit.face) continue;
//     _normal.copy(hit.face.normal).transformDirection(hit.object.matrixWorld);
//     if (Math.abs(_normal.y) > 0.5) {
//       groundY = hit.point.y;
//       break;
//     }
//   }

//   car.position.y = THREE.MathUtils.damp(car.position.y, groundY, 14, delta);
// }

// function getGearAndRpm(speed) {
//   const abs = Math.abs(speed);
//   if (abs < 0.3) return { gear: "N", rpm: 850 };
//   if (speed < 0) {
//     return {
//       gear: "R",
//       rpm: Math.round(850 + (abs / MAX_REVERSE_SPEED) * 3200),
//     };
//   }

//   const found = GEAR_TOP_SPEEDS.findIndex((top) => abs <= top);
//   const index = found === -1 ? GEAR_TOP_SPEEDS.length - 1 : found;
//   const low = index === 0 ? 0 : GEAR_TOP_SPEEDS[index - 1];
//   const ratio = (abs - low) / (GEAR_TOP_SPEEDS[index] - low);

//   return { gear: String(index + 1), rpm: Math.round(2200 + ratio * 4800) };
// }

// export default function CarController({
//   carRef,
//   wheelAssembliesRef,
//   collidersRef,
//   enabled,
//   onTelemetryChange,
//   physicsStateRef,
// }) {
//   const keys = useRef({});
//   const speed = useRef(0);
//   const steering = useRef(0);
//   const uiTimer = useRef(0);
//   const nearby = useRef({ source: null, count: -1, x: 0, z: 0, meshes: [] });

//   useEffect(() => {
//     const normalizeKey = (key) => (key === " " ? "space" : key.toLowerCase());

//     const onKeyDown = (event) => {
//       const key = normalizeKey(event.key);
//       if (["w", "a", "s", "d", "space"].includes(key)) {
//         event.preventDefault();
//         keys.current[key] = true;
//       }
//     };

//     const onKeyUp = (event) => {
//       keys.current[normalizeKey(event.key)] = false;
//     };

//     const clearKeys = () => {
//       keys.current = {};
//     };

//     window.addEventListener("keydown", onKeyDown, { passive: false });
//     window.addEventListener("keyup", onKeyUp);
//     window.addEventListener("blur", clearKeys);

//     return () => {
//       window.removeEventListener("keydown", onKeyDown);
//       window.removeEventListener("keyup", onKeyUp);
//       window.removeEventListener("blur", clearKeys);
//     };
//   }, []);

//   useEffect(() => {
//     if (!enabled) {
//       speed.current = 0;
//       steering.current = 0;
//       keys.current = {};
//       onTelemetryChange?.(IDLE_TELEMETRY);

//       // Reset wheel steering when leaving driving mode.
//       (wheelAssembliesRef.current || []).forEach((wheel) => {
//         wheel.steeringPivot.rotation.y = 0;
//       });
//     }
//   }, [enabled, onTelemetryChange, wheelAssembliesRef]);

//   useFrame((_, rawDelta) => {
//     if (!enabled || !carRef.current) return;

//     const delta = Math.min(rawDelta, 0.05);
//     const car = carRef.current;
//     const input = keys.current;

//     const throttle = (input.w ? 1 : 0) - (input.s ? 1 : 0);
//     const handbrake = Boolean(input.space);

//     if (handbrake) {
//       speed.current = THREE.MathUtils.damp(speed.current, 0, 11, delta);
//     } else if (throttle > 0) {
//       speed.current = Math.min(
//         MAX_FORWARD_SPEED,
//         speed.current + ACCELERATION * delta,
//       );
//     } else if (throttle < 0) {
//       if (speed.current > 0.5) {
//         speed.current = Math.max(0, speed.current - BRAKE_DECELERATION * delta);
//       } else {
//         speed.current = Math.max(
//           -MAX_REVERSE_SPEED,
//           speed.current - ACCELERATION * delta,
//         );
//       }
//     } else {
//       speed.current = THREE.MathUtils.damp(
//         speed.current,
//         0,
//         COAST_DECELERATION,
//         delta,
//       );
//     }

//     // Positive steering = left (counter-clockwise from above). A = left.
//     const steerInput = (input.a ? 1 : 0) - (input.d ? 1 : 0);
//     steering.current = THREE.MathUtils.damp(
//       steering.current,
//       steerInput * MAX_STEERING_ANGLE,
//       7,
//       delta,
//     );

//     const yawRate = (speed.current / WHEELBASE) * Math.tan(steering.current);
//     car.rotation.y += yawRate * delta;

//     // BMWM4 rotates the model so the car faces +X.
//     _forward.set(1, 0, 0).applyQuaternion(car.quaternion);
//     car.position.addScaledVector(_forward, speed.current * delta);

//     // --- Collision with the map ---
//     const colliders = collidersRef?.current;
//     if (colliders && colliders.length) {
//       const meshes = getNearbyMeshes(nearby.current, colliders, car.position);

//       _before.copy(car.position);
//       collideWithWalls(car, meshes);

//       // Hitting a wall costs speed in proportion to how hard we hit it.
//       const pushedForward =
//         (car.position.x - _before.x) * _forward.x +
//         (car.position.z - _before.z) * _forward.z;
//       const safeDelta = Math.max(delta, 0.001);

//       if (speed.current > 0 && pushedForward < 0) {
//         speed.current = Math.max(0, speed.current + pushedForward / safeDelta);
//       } else if (speed.current < 0 && pushedForward > 0) {
//         speed.current = Math.min(0, speed.current + pushedForward / safeDelta);
//       }

//       followGround(car, meshes, delta);
//     }

//     // --- Wheels ---
//     (wheelAssembliesRef.current || []).forEach((wheel) => {
//       if (!wheel.steeringPivot || !wheel.rollingPivot) return;

//       // Only front wheels turn left and right.
//       wheel.steeringPivot.rotation.y = wheel.isFront ? steering.current : 0;

//       // Roll around the axle (model X).
//       wheel.rollingPivot.rotation.x +=
//         (speed.current * delta) / (wheel.radius || WHEEL_RADIUS);
//     });

//     // --- Shared state for FollowCamera + HUD ---
//     const phys = physicsStateRef?.current;
//     if (phys) {
//       phys.vx = speed.current;
//       phys.vy = 0;
//       phys.steering = steering.current;
//       phys.isDrifting = false;
//       phys.boost = false;
//     }

//     uiTimer.current += delta;
//     if (uiTimer.current >= 0.08) {
//       uiTimer.current = 0;
//       const { gear, rpm } = getGearAndRpm(speed.current);
//       onTelemetryChange?.({
//         speed: Math.round(speed.current * 3.6),
//         rpm,
//         gear,
//         drifting: false,
//         driftAngle: 0,
//         boost: false,
//       });
//     }
//   });

//   return null;
// }

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BMW_M4_SCALE } from "./BMWM4";

/* ------------------------------------------------------------------ */
/*  Tuning                                                             */
/* ------------------------------------------------------------------ */

// Drivetrain
const MAX_FORWARD_SPEED = 31;
const MAX_REVERSE_SPEED = 9;
const ACCELERATION = 7.5;
const BRAKE_DECELERATION = 17;
const COAST_DECELERATION = 1.8;
const HANDBRAKE_DECELERATION = 5;
const BOOST_SPEED_MULT = 1.3;
const BOOST_ACCEL_MULT = 1.7;

// Steering and tyres
const WHEELBASE = 2.85;
const WHEEL_RADIUS = 0.34; // fallback only, BMWM4 measures the real radius
const MAX_STEERING_ANGLE = 0.48;
const MAX_LATERAL_ACCEL = 17; // limits how hard the car can turn at speed
const HANDBRAKE_LATERAL_BOOST = 1.8; // handbrake lets the car rotate harder
const GRIP = 9; // how fast sideways sliding dies out (1/s)
const HANDBRAKE_GRIP = 0.9; // rear tyres locked -> car slides

// World physics
const GRAVITY = 24;
const SUBSTEP = 1 / 120; // fixed-ish physics step
const MAX_SUBSTEPS = 4;
const RAY_UP = 0.7; // wheel rays start this far above the tyre bottom
const SUSPENSION_TRAVEL = 0.4; // ground further below than this = airborne
const MIN_CONTACTS = 2; // wheels that must touch the ground to be "grounded"
const HEAVE_STIFFNESS = 170; // body bounce spring (landing / bumps)
const HEAVE_DAMPING = 15;

// Where the car is placed when Drive mode starts or R is pressed.
// Map is centred on the world origin, so 0,0 is the middle of the map.
// The ground height is found automatically by a ray from the sky.
const SPAWN = { x: 0, z: 0, yaw: 0 };
const SPAWN_RAY_HEIGHT = 1000;
const KILL_DEPTH = 250; // fell this far below the spawn ground -> respawn

// Collision tuning (world units)
const CAR_HALF_LENGTH = 2.3 * BMW_M4_SCALE;
const CAR_HALF_WIDTH = 0.95 * BMW_M4_SCALE;
const WALL_RAY_HEIGHT = 0.55; // obstacles taller than this block the car
const WALL_RAY_COUNT = 16;
const MAX_PUSH = 0.9;
const WALL_RESTITUTION = 0.1;
const WALL_SCRAPE = 0.04;
const NEARBY_RADIUS = 30;
const NEARBY_REFRESH = 10;

const GEAR_TOP_SPEEDS = [7, 13, 19, 25, MAX_FORWARD_SPEED];
const IDLE_TELEMETRY = {
  speed: 0,
  rpm: 850,
  gear: "N",
  drifting: false,
  driftAngle: 0,
  boost: false,
};

const EMPTY = [];
const CONTROL_KEYS = ["w", "a", "s", "d", "space", "shift"];

/* ------------------------------------------------------------------ */
/*  Scratch objects (no per-frame allocations)                         */
/* ------------------------------------------------------------------ */

const UP = new THREE.Vector3(0, 1, 0);
const _v = new THREE.Vector3();
const _before = new THREE.Vector3();
const _origin = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _normal = new THREE.Vector3();
const _down = new THREE.Vector3(0, -1, 0);
const raycaster = new THREE.Raycaster();
raycaster.firstHitOnly = true; // used by three-mesh-bvh

// Rays fan out from the car centre; each one is as long as the car's
// elliptical footprint in that direction.
const WALL_PROBES = Array.from({ length: WALL_RAY_COUNT }, (_, i) => {
  const angle = (i / WALL_RAY_COUNT) * Math.PI * 2;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const radius =
    (CAR_HALF_LENGTH * CAR_HALF_WIDTH) /
    Math.hypot(CAR_HALF_WIDTH * c, CAR_HALF_LENGTH * s);
  return { dir: new THREE.Vector3(c, 0, s), radius };
});

/* ------------------------------------------------------------------ */
/*  State                                                              */
/* ------------------------------------------------------------------ */

function createState() {
  return {
    // planar velocity in the car's frame: lon = forward (+X), lat = right (+Z)
    lon: 0,
    lat: 0,
    // vertical motion
    y: 0,
    vy: 0,
    vyGround: 0,
    airborne: false,
    // rotation / steering
    yawRate: 0,
    steering: 0,
    grip: GRIP,
    // visual attitude
    groundPitch: 0,
    groundRoll: 0,
    bodyPitch: 0,
    bodyRoll: 0,
    heave: 0,
    heaveVel: 0,
    prevLon: 0,
    aLon: 0,
    // bookkeeping
    ground: { contacts: 0, targetY: 0, pitch: 0, roll: 0 },
    spawned: false,
    resetRequested: false,
    killY: -Infinity,
    safe: null,
    safeTimer: 0,
  };
}

/* ------------------------------------------------------------------ */
/*  Collision helpers                                                  */
/* ------------------------------------------------------------------ */

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

// Casts a ray from the sky and returns the walkable surface closest to refY
// (so the car spawns on the street, not on a rooftop or the sea floor).
function findGroundHeight(meshes, x, z, refY) {
  _origin.set(x, SPAWN_RAY_HEIGHT, z);
  raycaster.set(_origin, _down);
  raycaster.far = SPAWN_RAY_HEIGHT * 2.5;
  raycaster.firstHitOnly = false; // we need every layer, not just the top one

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

// Pushes the car out of any wall that enters its footprint. Because only the
// penetrating part is removed, the car slides along walls naturally.
function collideWithWalls(car, meshes) {
  for (const probe of WALL_PROBES) {
    _dir.copy(probe.dir).applyAxisAngle(UP, car.rotation.y); // yaw only
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
    if (Math.abs(_normal.y) > 0.7) continue; // floor / ramp, not a wall

    _normal.y = 0;
    _normal.normalize();
    if (_normal.dot(_dir) > 0) _normal.negate(); // always push away from wall

    const depth = (probe.radius - hit.distance) * Math.abs(_normal.dot(_dir));
    car.position.addScaledVector(_normal, Math.min(depth, MAX_PUSH));
  }
}

/* ------------------------------------------------------------------ */
/*  Wheel rig + ground sampling                                        */
/* ------------------------------------------------------------------ */

// Wheel positions in the car's own frame (X forward, Z right, world scale),
// taken from the wheel pivots that BMWM4 builds from the GLB.
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
      bottom: _v.y - radius, // tyre contact point relative to the car origin
      front: Boolean(wheel.isFront),
      left: _v.z < 0,
    });
  });

  if (wheels.length < 4) {
    // Fallback when the GLB wheels are not available.
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

// One ray per wheel. From the hits we get: the ride height that puts every
// tyre on the road, and the pitch/roll of the road under the car.
function sampleGround(car, meshes, rig, y, vy, h, out) {
  const cosY = Math.cos(car.rotation.y);
  const sinY = Math.sin(car.rotation.y);
  const fall = Math.max(0, -vy) * h * 2; // never tunnel through the road

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
    // + pitch = nose up, + roll = left side up
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
  if (groundY === null) groundY = car.position.y; // nothing under spawn point

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
  s.airborne = true; // lands on the first physics step
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

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CarController({
  carRef,
  wheelAssembliesRef,
  collidersRef,
  enabled,
  onTelemetryChange,
  physicsStateRef,
}) {
  const keys = useRef({});
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
    if (!enabled) {
      state.current = createState();
      keys.current = {};
      onTelemetryChange?.(IDLE_TELEMETRY);

      // Reset wheel steering and body tilt when leaving driving mode.
      (wheelAssembliesRef.current || EMPTY).forEach((wheel) => {
        wheel.steeringPivot.rotation.y = 0;
      });
      if (carRef.current) {
        carRef.current.rotation.x = 0;
        carRef.current.rotation.z = 0;
      }
    }
  }, [enabled, onTelemetryChange, wheelAssembliesRef, carRef]);

  useFrame((_, rawDelta) => {
    const car = carRef.current;
    if (!enabled || !car) return;

    // Hold the car until the map's collision data is built, otherwise it
    // would fall through a world that has no floor yet.
    const colliders = collidersRef?.current;
    if (!colliders || !colliders.ready) return;

    const frameDelta = Math.min(rawDelta, 0.05);
    if (frameDelta <= 0) return;

    const s = state.current;
    const input = keys.current;

    // YXZ keeps rotation.y a pure heading (FollowCamera reads it) while
    // rotation.x = roll and rotation.z = pitch tilt the body on slopes.
    if (car.rotation.order !== "YXZ") car.rotation.order = "YXZ";

    const assemblies = wheelAssembliesRef.current || EMPTY;
    if (!rig.current || rig.current.source !== assemblies) {
      rig.current = buildRig(car, assemblies);
    }
    const rigData = rig.current;

    if (!s.spawned || s.resetRequested) {
      placeCar(car, s, colliders, rigData, SPAWN.x, SPAWN.z, SPAWN.yaw);
    }

    const meshes = getNearbyMeshes(nearby.current, colliders, car.position);

    const throttle = (input.w ? 1 : 0) - (input.s ? 1 : 0);
    // Positive steering = left (counter-clockwise from above). A = left.
    const steerInput = (input.a ? 1 : 0) - (input.d ? 1 : 0);
    const handbrake = Boolean(input.space);
    const boostKey = Boolean(input.shift);

    const steps = Math.min(MAX_SUBSTEPS, Math.ceil(frameDelta / SUBSTEP));
    const h = frameDelta / steps;
    let yaw = car.rotation.y;
    let boosting = false;

    /* ---------------- physics sub-steps ---------------- */
    for (let i = 0; i < steps; i++) {
      const grounded = !s.airborne;
      const speedAbs = Math.abs(s.lon);
      boosting = false;

      // --- Engine, brakes, slopes (only when the tyres touch the road) ---
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

        // Gravity along the slope: uphill slows you, downhill speeds you up.
        if (speedAbs > 1 || throttle !== 0) {
          s.lon -= GRAVITY * Math.sin(s.groundPitch) * h;
        }

        if (s.lon > vMax) s.lon = THREE.MathUtils.damp(s.lon, vMax, 2.5, h);
        s.lon = Math.max(s.lon, -MAX_REVERSE_SPEED);
      }

      // --- Steering: the faster you go, the less the wheels can turn ---
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

      // --- Turn the car; the velocity vector stays put in the world, so the
      //     car frame gains sideways speed (this is what makes it slide). ---
      const dYaw = s.yawRate * h;
      yaw += dYaw;
      const cosD = Math.cos(dYaw);
      const sinD = Math.sin(dYaw);
      const lon = s.lon * cosD - s.lat * sinD;
      const lat = s.lon * sinD + s.lat * cosD;
      s.lon = lon;
      s.lat = lat;

      // --- Tyre grip pulls the velocity back in line with the car ---
      if (grounded) {
        const saturated = Math.abs(steerInput) > 0.9 && speedAbs > 20;
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

      // --- Move on the horizontal plane ---
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      car.position.x += (s.lon * cosY + s.lat * sinY) * h;
      car.position.z += (-s.lon * sinY + s.lat * cosY) * h;
      car.rotation.y = yaw;

      // --- Ground contact / gravity ---
      const g = sampleGround(car, meshes, rigData, s.y, s.vy, h, s.ground);
      const hasGround = g.contacts >= MIN_CONTACTS;

      if (!s.airborne) {
        if (hasGround) {
          // Stick to the road exactly and remember how fast it rises/falls,
          // so driving off a ramp keeps its upward momentum.
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
            s.heaveVel -= Math.min(impact, 14) * 0.4; // suspension squash
            s.lon *= 1 - Math.min(0.12, impact * 0.008); // landing scrub
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

    if (pushLen > 1e-4) {
      const nx = pushX / pushLen;
      const nz = pushZ / pushLen;
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const nForward = nx * cosY - nz * sinY;
      const nRight = nx * sinY + nz * cosY;
      const vn = s.lon * nForward + s.lat * nRight;

      if (vn < 0) {
        // Remove the speed going into the wall (plus a little bounce).
        const j = -(1 + WALL_RESTITUTION) * vn;
        s.lon += j * nForward;
        s.lat += j * nRight;
      }
      const scrape = 1 - WALL_SCRAPE * Math.min(1, pushLen / MAX_PUSH);
      s.lon *= scrape;
      s.lat *= scrape;
    }

    /* ---------------- body attitude (visual) ---------------- */
    const dt = frameDelta;

    // Weight transfer: nose lifts on throttle, dives on braking, body leans
    // to the outside of a corner.
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

    // Follow the road's slope on the ground; follow the flight path in the air.
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

    // Suspension bounce
    s.heaveVel +=
      (-HEAVE_STIFFNESS * s.heave - HEAVE_DAMPING * s.heaveVel) * dt;
    s.heave = THREE.MathUtils.clamp(s.heave + s.heaveVel * dt, -0.2, 0.06);

    car.rotation.set(
      s.groundRoll + s.bodyRoll,
      yaw,
      s.groundPitch + s.bodyPitch,
    );
    car.position.y = s.y + s.heave;

    /* ---------------- safety net: fell out of the world ---------------- */
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

      // Only front wheels turn left and right.
      wheel.steeringPivot.rotation.y = wheel.isFront ? s.steering : 0;

      // Roll around the axle (model X). Handbrake locks the rear wheels.
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
      phys.vy = s.lat; // sideways slide speed -> camera swings into the drift
      phys.steering = s.steering;
      phys.isDrifting = drifting;
      phys.boost = boosting;
    }

    uiTimer.current += dt;
    if (uiTimer.current >= 0.08) {
      uiTimer.current = 0;
      const { gear, rpm } = getGearAndRpm(s.lon);
      onTelemetryChange?.({
        speed: Math.round(planarSpeed * 3.6),
        rpm,
        gear,
        drifting,
        driftAngle: drifting ? Math.round((slip * 180) / Math.PI) : 0,
        boost: boosting,
      });
    }
  });

  return null;
}
```

===============================================================================
FILE: src/components/World/OpenWorldMap.js
===============================================================================

```js
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
```

===============================================================================
FILE: src/index.css
===============================================================================

```css
@import url("https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap");

:root {
  color-scheme: dark;
  font-family: "Inter", sans-serif;
  background: #090d14;
  color: #f4f7fb;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

html,
body,
#root {
  width: 100%;
  height: 100%;
  min-height: 100%;
  margin: 0;
  overflow: hidden;
}

body {
  background: #090d14;
}

button {
  font: inherit;
}

.game-shell {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 520px;
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
  z-index: 5;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 25px 34px;
  pointer-events: none;
}

.brand-lockup,
.topbar-controls,
.mode-switch,
.scene-switch {
  display: flex;
  align-items: center;
  pointer-events: auto;
}

.topbar-controls {
  gap: 10px;
}

.brand-lockup {
  gap: 12px;
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
.panel-kicker,
.hud-label,
.showroom-hint,
.drive-note,
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

.mode-switch,
.scene-switch {
  gap: 4px;
  padding: 4px;
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 8px;
  background: rgba(10, 15, 23, 0.72);
  backdrop-filter: blur(14px);
}

.mode-button,
.scene-button,
.camera-button {
  border: 0;
  border-radius: 5px;
  padding: 10px 14px;
  color: #9ba8b8;
  background: transparent;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  transition: background 0.2s ease, color 0.2s ease;
}

.camera-button {
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 8px;
  background: rgba(10, 15, 23, 0.72);
  backdrop-filter: blur(14px);
  color: #dce5ef;
}

.camera-button:hover {
  background: rgba(23, 105, 210, 0.35);
}

.mode-button:hover,
.mode-button.active {
  color: #fff;
  background: #1769d2;
}

.scene-button:hover,
.scene-button.active {
  color: #fff;
  background: rgba(255, 255, 255, 0.14);
}

.showroom-panel {
  position: absolute;
  z-index: 4;
  left: 5.5%;
  bottom: 12%;
  width: min(370px, 38vw);
  pointer-events: none;
}

.panel-kicker {
  margin-bottom: 12px;
  color: #74b5ff;
}

.showroom-panel h1 {
  margin: 0;
  font-family: "Barlow Condensed", sans-serif;
  font-size: clamp(48px, 6vw, 78px);
  line-height: 0.88;
  letter-spacing: -1.5px;
  text-transform: uppercase;
}

.showroom-panel p {
  max-width: 330px;
  margin: 20px 0 22px;
  color: #aab5c3;
  font-size: 13px;
  line-height: 1.8;
}

.primary-button {
  display: flex;
  width: 220px;
  align-items: center;
  justify-content: space-between;
  border: 0;
  border-radius: 5px;
  padding: 14px 17px;
  color: #fff;
  background: #1769d2;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  pointer-events: auto;
  transition: background 0.2s ease, transform 0.2s ease;
}

.primary-button:hover {
  background: #2581f4;
  transform: translateY(-2px);
}

.primary-button span:last-child {
  font-size: 18px;
}

.showroom-hint {
  margin-top: 28px;
  color: #718092;
  font-size: 8px;
}

.showroom-hint span {
  padding: 0 7px;
  color: #398df4;
}

.corner-status {
  position: absolute;
  z-index: 4;
  left: 34px;
  bottom: 25px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #8492a3;
  font-size: 8px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #49d99b;
  box-shadow: 0 0 10px #49d99b;
}

.drive-hud {
  position: absolute;
  z-index: 4;
  top: 102px;
  left: 34px;
  width: 220px;
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  background: rgba(8, 13, 21, 0.78);
  backdrop-filter: blur(14px);
}

.hud-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.hud-label {
  color: #8292a5;
  font-size: 8px;
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

.drive-help {
  position: absolute;
  z-index: 4;
  right: 30px;
  bottom: 28px;
  display: grid;
  gap: 8px;
  min-width: 195px;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  background: rgba(8, 13, 21, 0.72);
  backdrop-filter: blur(14px);
}

.drive-help > div:not(.drive-note) {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #aeb9c7;
  font-size: 10px;
}

kbd {
  display: inline-grid;
  min-width: 23px;
  height: 22px;
  padding: 0 5px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
  font-family: "Inter", sans-serif;
  font-size: 9px;
  font-weight: 700;
}

.drive-note {
  margin-top: 4px;
  color: #728196;
  font-size: 7px;
  letter-spacing: 1px;
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

@media (max-width: 820px) {
  .topbar {
    padding: 14px;
    flex-wrap: wrap;
    gap: 10px;
  }

  .scene-switch {
    display: none;
  }

  .showroom-panel {
    left: 20px;
    bottom: 9%;
    width: min(310px, 78vw);
  }

  .drive-hud {
    top: 84px;
    left: 15px;
    width: 190px;
    padding: 12px;
  }
}
```

===============================================================================
FILE: src/index.js
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
FILE: src/main.jsx
===============================================================================

```jsx
```

===============================================================================
FILE: src/reportWebVitals.js
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
FILE: src/setupTests.js
===============================================================================

```js
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
```

-------------------------------------------------------------------------------

Generated by ctx

Total Files: 18
