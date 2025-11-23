import type {
  NBodyState,
  OscillatorState,
  NBodyConfig,
  OscillatorConfig,
  StabilizerState,
  ControlInput,
  Vec2,
} from "./types";
import { vec2Scale, vec2Normalize, SeededRandom } from "./math";
import { computeNBodyMetrics } from "./n-body";
import { computeOscillatorMetrics } from "./oscillator";

export function applyNBodyControl(
  state: NBodyState,
  control: ControlInput
): NBodyState {
  const newBodies = state.bodies.map((body, i) => {
    if (i === control.targetIndex) {
      return {
        ...body,
        velocity: [
          body.velocity[0] + control.velocityDelta[0],
          body.velocity[1] + control.velocityDelta[1],
        ] as Vec2,
      };
    }
    return body;
  });

  return {
    ...state,
    bodies: newBodies,
  };
}

export function applyOscillatorControl(
  state: OscillatorState,
  targetIndex: number,
  valueDelta: number,
  velocityDelta: number
): OscillatorState {
  const newValues = [...state.values];
  const newVelocities = [...state.velocities];

  newValues[targetIndex] = (newValues[targetIndex] ?? 0) + valueDelta;
  newVelocities[targetIndex] =
    (newVelocities[targetIndex] ?? 0) + velocityDelta;

  return {
    ...state,
    values: newValues,
    velocities: newVelocities,
  };
}

export function computeNBodyStabilizerControl(
  state: NBodyState,
  config: NBodyConfig,
  stabilizerState: StabilizerState,
  rng: SeededRandom
): ControlInput | null {
  if (!stabilizerState.enabled) return null;

  const metrics = computeNBodyMetrics(state, config);
  const com = metrics.centerOfMass;

  let maxError = 0;
  let worstIndex = 0;

  for (let i = 0; i < state.bodies.length; i++) {
    const body = state.bodies[i]!;
    const dx = body.position[0] - com[0];
    const dy = body.position[1] - com[1];
    const error = Math.sqrt(dx * dx + dy * dy);

    if (error > maxError) {
      maxError = error;
      worstIndex = i;
    }
  }

  const body = state.bodies[worstIndex]!;
  const toCenter: Vec2 = [com[0] - body.position[0], com[1] - body.position[1]];
  const toCenterNorm = vec2Normalize(toCenter);

  let controlDirection: Vec2;
  if (stabilizerState.mode === "stabilize") {
    controlDirection = toCenterNorm;
  } else {
    controlDirection = [-toCenterNorm[0], -toCenterNorm[1]];
  }

  const randomAngle = rng.range(0, 2 * Math.PI) * stabilizerState.randomness;
  const cos = Math.cos(randomAngle);
  const sin = Math.sin(randomAngle);
  const rotated: Vec2 = [
    controlDirection[0] * cos - controlDirection[1] * sin,
    controlDirection[0] * sin + controlDirection[1] * cos,
  ];

  const velocityDelta = vec2Scale(rotated, stabilizerState.strength * 0.01);

  return {
    targetIndex: worstIndex,
    velocityDelta,
  };
}

export function computeOscillatorStabilizerControl(
  state: OscillatorState,
  config: OscillatorConfig,
  stabilizerState: StabilizerState,
  rng: SeededRandom
): { targetIndex: number; valueDelta: number; velocityDelta: number } | null {
  if (!stabilizerState.enabled) return null;

  let maxError = 0;
  let worstIndex = 0;

  for (let i = 0; i < state.values.length; i++) {
    const error = Math.abs(state.values[i]!) + Math.abs(state.velocities[i]!);
    if (error > maxError) {
      maxError = error;
      worstIndex = i;
    }
  }

  const value = state.values[worstIndex]!;
  const velocity = state.velocities[worstIndex]!;

  let valueDelta: number;
  let velocityDelta: number;

  if (stabilizerState.mode === "stabilize") {
    valueDelta = -value * stabilizerState.strength * 0.001;
    velocityDelta = -velocity * stabilizerState.strength * 0.01;
  } else {
    valueDelta = Math.sign(value) * stabilizerState.strength * 0.01;
    velocityDelta = Math.sign(velocity) * stabilizerState.strength * 0.1;
  }

  valueDelta += rng.gaussian(0, stabilizerState.randomness * 0.1);
  velocityDelta += rng.gaussian(0, stabilizerState.randomness * 0.01);

  return {
    targetIndex: worstIndex,
    valueDelta,
    velocityDelta,
  };
}
