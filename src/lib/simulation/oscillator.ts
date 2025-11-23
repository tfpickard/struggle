import type {
  OscillatorState,
  OscillatorConfig,
  SimulationMetrics,
  Vec2,
} from "./types";
import { SeededRandom } from "./math";

export function createOscillatorState(
  config: OscillatorConfig
): OscillatorState {
  const rng = new SeededRandom(config.seed);
  const values: number[] = [];
  const velocities: number[] = [];

  for (let i = 0; i < config.numBodies; i++) {
    values.push(rng.range(-10, 10));
    velocities.push(rng.range(-2, 2));
  }

  return {
    values,
    velocities,
    time: 0,
  };
}

export function stepOscillator(
  state: OscillatorState,
  config: OscillatorConfig
): OscillatorState {
  const dt = config.timeStep;
  const n = state.values.length;
  const newValues: number[] = [];
  const newVelocities: number[] = [];

  for (let i = 0; i < n; i++) {
    const x = state.values[i]!;
    const v = state.velocities[i]!;

    let force = -config.springConstant * x;

    const leftNeighbor = state.values[(i - 1 + n) % n]!;
    const rightNeighbor = state.values[(i + 1) % n]!;

    force += config.couplingStrength * (leftNeighbor - x);
    force += config.couplingStrength * (rightNeighbor - x);

    const acceleration = force;

    let newV = v + acceleration * dt;
    newV *= 1 - config.damping * dt;

    const newX = x + newV * dt;

    newValues.push(newX);
    newVelocities.push(newV);
  }

  return {
    values: newValues,
    velocities: newVelocities,
    time: state.time + dt,
  };
}

export function computeOscillatorMetrics(
  state: OscillatorState,
  config: OscillatorConfig
): SimulationMetrics {
  let kineticEnergy = 0;
  let potentialEnergy = 0;

  for (let i = 0; i < state.values.length; i++) {
    const x = state.values[i]!;
    const v = state.velocities[i]!;

    kineticEnergy += 0.5 * v * v;

    potentialEnergy += 0.5 * config.springConstant * x * x;

    const nextX = state.values[(i + 1) % state.values.length]!;
    const coupling = 0.5 * config.couplingStrength * (nextX - x) ** 2;
    potentialEnergy += coupling;
  }

  const totalEnergy = kineticEnergy + potentialEnergy;

  let errorMetric = 0;
  for (let i = 0; i < state.values.length; i++) {
    errorMetric += Math.abs(state.values[i]!);
    errorMetric += Math.abs(state.velocities[i]!);
  }
  errorMetric /= state.values.length;

  return {
    totalEnergy,
    kineticEnergy,
    potentialEnergy,
    errorMetric,
    centerOfMass: [0, 0],
    angularMomentum: 0,
  };
}
