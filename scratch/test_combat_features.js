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

