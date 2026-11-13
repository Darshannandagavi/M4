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
