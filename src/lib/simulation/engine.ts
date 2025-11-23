import type {
  SimulationState,
  SimulationConfig,
  NBodyConfig,
  OscillatorConfig,
  SimulationMetrics,
  StabilizerState,
  NBodyState,
  OscillatorState,
} from "./types";
import {
  createNBodyState,
  stepNBody,
  computeNBodyMetrics,
} from "./n-body";
import {
  createOscillatorState,
  stepOscillator,
  computeOscillatorMetrics,
} from "./oscillator";
import {
  applyNBodyControl,
  applyOscillatorControl,
  computeNBodyStabilizerControl,
  computeOscillatorStabilizerControl,
} from "./stabilizer";
import { SeededRandom } from "./math";

export class SimulationEngine {
  private state: SimulationState;
  private config: SimulationConfig;
  private stabilizerState: StabilizerState;
  private rng: SeededRandom;

  constructor(config: SimulationConfig) {
    this.config = config;
    this.rng = new SeededRandom(config.seed);

    if (config.type === "n-body") {
      this.state = createNBodyState(config);
    } else {
      this.state = createOscillatorState(config);
    }

    this.stabilizerState = {
      enabled: false,
      mode: "stabilize",
      strength: 1.0,
      randomness: 0.1,
    };
  }

  step(): void {
    if (this.config.type === "n-body") {
      const control = computeNBodyStabilizerControl(
        this.state as NBodyState,
        this.config as NBodyConfig,
        this.stabilizerState,
        this.rng
      );

      if (control) {
        this.state = applyNBodyControl(this.state as NBodyState, control);
      }

      this.state = stepNBody(
        this.state as NBodyState,
        this.config as NBodyConfig
      );
    } else {
      const control = computeOscillatorStabilizerControl(
        this.state as OscillatorState,
        this.config as OscillatorConfig,
        this.stabilizerState,
        this.rng
      );

      if (control) {
        this.state = applyOscillatorControl(
          this.state as OscillatorState,
          control.targetIndex,
          control.valueDelta,
          control.velocityDelta
        );
      }

      this.state = stepOscillator(
        this.state as OscillatorState,
        this.config as OscillatorConfig
      );
    }
  }

  getState(): SimulationState {
    return this.state;
  }

  setState(state: SimulationState): void {
    this.state = state;
  }

  getMetrics(): SimulationMetrics {
    if (this.config.type === "n-body") {
      return computeNBodyMetrics(
        this.state as NBodyState,
        this.config as NBodyConfig
      );
    } else {
      return computeOscillatorMetrics(
        this.state as OscillatorState,
        this.config as OscillatorConfig
      );
    }
  }

  getStabilizerState(): StabilizerState {
    return { ...this.stabilizerState };
  }

  setStabilizerState(state: Partial<StabilizerState>): void {
    this.stabilizerState = {
      ...this.stabilizerState,
      ...state,
    };
  }

  reset(): void {
    if (this.config.type === "n-body") {
      this.state = createNBodyState(this.config);
    } else {
      this.state = createOscillatorState(this.config);
    }
  }

  getConfig(): SimulationConfig {
    return { ...this.config };
  }
}

export function createDefaultNBodyConfig(): NBodyConfig {
  return {
    type: "n-body",
    numBodies: 3,
    gravitationalConstant: 1.0,
    damping: 0.01,
    timeStep: 0.016,
    seed: Date.now(),
    softening: 0.01,
  };
}

export function createDefaultOscillatorConfig(): OscillatorConfig {
  return {
    type: "oscillator",
    numBodies: 5,
    gravitationalConstant: 0,
    damping: 0.05,
    timeStep: 0.016,
    seed: Date.now(),
    couplingStrength: 0.5,
    springConstant: 1.0,
  };
}
