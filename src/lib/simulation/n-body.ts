import type {
  Body,
  NBodyState,
  NBodyConfig,
  SimulationMetrics,
  Vec2,
} from "./types";
import {
  vec2Add,
  vec2Sub,
  vec2Scale,
  vec2Length,
  vec2LengthSquared,
  vec2Cross,
  SeededRandom,
} from "./math";

export function createNBodyState(config: NBodyConfig): NBodyState {
  const rng = new SeededRandom(config.seed);
  const bodies: Body[] = [];

  for (let i = 0; i < config.numBodies; i++) {
    const angle = (i / config.numBodies) * 2 * Math.PI;
    const radius = 1 + rng.range(-0.2, 0.2);
    const position: Vec2 = [
      radius * Math.cos(angle),
      radius * Math.sin(angle),
    ];

    const speed = Math.sqrt(config.gravitationalConstant / radius);
    const velocity: Vec2 = [
      -speed * Math.sin(angle) * (1 + rng.range(-0.1, 0.1)),
      speed * Math.cos(angle) * (1 + rng.range(-0.1, 0.1)),
    ];

    bodies.push({
      position,
      velocity,
      mass: 1.0,
    });
  }

  return {
    bodies,
    time: 0,
  };
}

function computeAcceleration(
  body: Body,
  bodies: Body[],
  config: NBodyConfig
): Vec2 {
  let ax = 0;
  let ay = 0;

  for (const other of bodies) {
    if (other === body) continue;

    const dx = other.position[0] - body.position[0];
    const dy = other.position[1] - body.position[1];
    const distSq = dx * dx + dy * dy + config.softening * config.softening;
    const dist = Math.sqrt(distSq);

    if (dist > 1e-10) {
      const force =
        (config.gravitationalConstant * other.mass) / (distSq * dist);
      ax += force * dx;
      ay += force * dy;
    }
  }

  return [ax, ay];
}

export function stepNBody(state: NBodyState, config: NBodyConfig): NBodyState {
  const dt = config.timeStep;
  const newBodies: Body[] = [];

  const accelerations = state.bodies.map((body) =>
    computeAcceleration(body, state.bodies, config)
  );

  for (let i = 0; i < state.bodies.length; i++) {
    const body = state.bodies[i]!;
    const acc = accelerations[i]!;

    let newVelocity = vec2Add(body.velocity, vec2Scale(acc, dt));
    newVelocity = vec2Scale(newVelocity, 1 - config.damping * dt);

    const avgVelocity = vec2Scale(
      vec2Add(body.velocity, newVelocity),
      0.5
    );
    const newPosition = vec2Add(body.position, vec2Scale(avgVelocity, dt));

    newBodies.push({
      position: newPosition,
      velocity: newVelocity,
      mass: body.mass,
    });
  }

  const halfState: NBodyState = {
    bodies: newBodies,
    time: state.time + dt,
  };

  const newAccelerations = halfState.bodies.map((body) =>
    computeAcceleration(body, halfState.bodies, config)
  );

  const finalBodies: Body[] = [];
  for (let i = 0; i < state.bodies.length; i++) {
    const body = state.bodies[i]!;
    const acc1 = accelerations[i]!;
    const acc2 = newAccelerations[i]!;
    const avgAcc = vec2Scale(vec2Add(acc1, acc2), 0.5);

    let newVelocity = vec2Add(body.velocity, vec2Scale(avgAcc, dt));
    newVelocity = vec2Scale(newVelocity, 1 - config.damping * dt);

    const avgVelocity = vec2Scale(
      vec2Add(body.velocity, newVelocity),
      0.5
    );
    const newPosition = vec2Add(body.position, vec2Scale(avgVelocity, dt));

    finalBodies.push({
      position: newPosition,
      velocity: newVelocity,
      mass: body.mass,
    });
  }

  return {
    bodies: finalBodies,
    time: state.time + dt,
  };
}

export function computeNBodyMetrics(
  state: NBodyState,
  config: NBodyConfig
): SimulationMetrics {
  let kineticEnergy = 0;
  let potentialEnergy = 0;
  let comX = 0;
  let comY = 0;
  let totalMass = 0;
  let angularMomentum = 0;

  for (const body of state.bodies) {
    const vSq = vec2LengthSquared(body.velocity);
    kineticEnergy += 0.5 * body.mass * vSq;

    comX += body.position[0] * body.mass;
    comY += body.position[1] * body.mass;
    totalMass += body.mass;

    const L = vec2Cross(body.position, vec2Scale(body.velocity, body.mass));
    angularMomentum += L;
  }

  const centerOfMass: Vec2 = [comX / totalMass, comY / totalMass];

  for (let i = 0; i < state.bodies.length; i++) {
    for (let j = i + 1; j < state.bodies.length; j++) {
      const body1 = state.bodies[i]!;
      const body2 = state.bodies[j]!;

      const r = vec2Sub(body2.position, body1.position);
      const dist = vec2Length(r);

      if (dist > 1e-10) {
        potentialEnergy -=
          (config.gravitationalConstant * body1.mass * body2.mass) / dist;
      }
    }
  }

  const totalEnergy = kineticEnergy + potentialEnergy;

  let errorMetric = 0;
  for (const body of state.bodies) {
    const distFromCenter = vec2Length(vec2Sub(body.position, centerOfMass));
    errorMetric += Math.abs(distFromCenter - 1.0);

    const speed = vec2Length(body.velocity);
    const expectedSpeed = Math.sqrt(config.gravitationalConstant / 1.0);
    errorMetric += Math.abs(speed - expectedSpeed);
  }
  errorMetric /= state.bodies.length;

  return {
    totalEnergy,
    kineticEnergy,
    potentialEnergy,
    errorMetric,
    centerOfMass,
    angularMomentum,
  };
}
