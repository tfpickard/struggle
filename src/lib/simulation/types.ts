export type Vec2 = [number, number];

export interface Body {
  position: Vec2;
  velocity: Vec2;
  mass: number;
}

export interface NBodyState {
  bodies: Body[];
  time: number;
}

export interface OscillatorState {
  values: number[];
  velocities: number[];
  time: number;
}

export type SimulationState = NBodyState | OscillatorState;

export interface SimulationConfig {
  type: "n-body" | "oscillator";
  numBodies: number;
  gravitationalConstant: number;
  damping: number;
  timeStep: number;
  seed: number;
}

export interface NBodyConfig extends SimulationConfig {
  type: "n-body";
  softening: number;
}

export interface OscillatorConfig extends SimulationConfig {
  type: "oscillator";
  couplingStrength: number;
  springConstant: number;
}

export interface SimulationMetrics {
  totalEnergy: number;
  kineticEnergy: number;
  potentialEnergy: number;
  errorMetric: number;
  centerOfMass: Vec2;
  angularMomentum: number;
}

export interface ControlInput {
  targetIndex: number;
  velocityDelta: Vec2;
}

export interface StabilizerState {
  enabled: boolean;
  mode: "stabilize" | "antagonize";
  strength: number;
  randomness: number;
}
