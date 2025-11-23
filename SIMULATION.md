# Simulation Engine

This document describes the mathematical models and numerical methods used in the Chaotic Unity simulation engine.

## Overview

The simulation engine implements two types of dynamical systems:

1. **N-Body Gravitational System**: Celestial mechanics with Newtonian gravity
2. **Coupled Oscillator Network**: Spring-mass systems with nearest-neighbor coupling

Both systems exhibit sensitive dependence on initial conditions, making them chaotic for certain parameter ranges.

## N-Body Gravitational System

### Equations of Motion

For N bodies with positions **r**ᵢ, velocities **v**ᵢ, and masses mᵢ:

```
d²rᵢ/dt² = G Σⱼ₌₁ᴺ (mⱼ (rⱼ - rᵢ)) / |rⱼ - rᵢ|³
```

Where:
- G is the gravitational constant
- The sum excludes i = j

### Numerical Integration

We use a **semi-implicit velocity Verlet** method for numerical stability:

1. Compute accelerations at time t:
   ```
   aᵢ(t) = G Σⱼ₌₁ᴺ (mⱼ (rⱼ(t) - rᵢ(t))) / (|rⱼ(t) - rᵢ(t)|² + ε²)^(3/2)
   ```

2. Update velocities (half-step):
   ```
   vᵢ(t + dt/2) = vᵢ(t) + aᵢ(t) · dt/2
   ```

3. Update positions:
   ```
   rᵢ(t + dt) = rᵢ(t) + vᵢ(t + dt/2) · dt
   ```

4. Compute new accelerations:
   ```
   aᵢ(t + dt) = ...
   ```

5. Update velocities (second half-step):
   ```
   vᵢ(t + dt) = vᵢ(t + dt/2) + aᵢ(t + dt) · dt/2
   ```

6. Apply damping:
   ```
   vᵢ(t + dt) ← vᵢ(t + dt) · (1 - β · dt)
   ```

**Parameters**:
- dt: Time step (typically 0.016s for 60 FPS)
- ε: Softening parameter (prevents singularities when bodies collide)
- β: Damping coefficient (dissipates energy)

### Energy and Invariants

**Kinetic Energy**:
```
T = Σᵢ (1/2) mᵢ |vᵢ|²
```

**Potential Energy**:
```
U = -G Σᵢ<ⱼ (mᵢ mⱼ) / |rᵢ - rⱼ|
```

**Total Energy**:
```
E = T + U
```

Without damping, energy should be approximately conserved. With damping, energy decreases monotonically.

**Angular Momentum** (2D):
```
L = Σᵢ mᵢ (rᵢ × vᵢ)
```

Should be conserved in the absence of external torques.

**Center of Mass**:
```
R = (Σᵢ mᵢ rᵢ) / (Σᵢ mᵢ)
```

Should remain stationary or move at constant velocity.

### Error Metric

The error metric quantifies deviation from a "stable" circular orbit configuration:

```
Error = (1/N) Σᵢ [ |rᵢ - R| - r₀ | + | |vᵢ| - v₀ | ]
```

Where:
- r₀ = 1.0 (target orbital radius)
- v₀ = √(G/r₀) (circular orbit speed)
- R = center of mass

## Coupled Oscillator Network

### Equations of Motion

For N oscillators with values xᵢ and velocities vᵢ:

```
d²xᵢ/dt² = -k xᵢ + c (xᵢ₋₁ + xᵢ₊₁ - 2xᵢ)
```

With periodic boundary conditions: x₀ = xₙ, xₙ₊₁ = x₁

Where:
- k is the spring constant (restoring force)
- c is the coupling strength (neighbor interaction)

### Numerical Integration

We use a simple **semi-implicit Euler** method:

1. Compute acceleration:
   ```
   aᵢ = -k xᵢ + c (xᵢ₋₁ + xᵢ₊₁ - 2xᵢ)
   ```

2. Update velocity:
   ```
   vᵢ(t + dt) = vᵢ(t) + aᵢ(t) · dt
   ```

3. Apply damping:
   ```
   vᵢ(t + dt) ← vᵢ(t + dt) · (1 - β · dt)
   ```

4. Update position:
   ```
   xᵢ(t + dt) = xᵢ(t) + vᵢ(t + dt) · dt
   ```

### Energy

**Kinetic Energy**:
```
T = Σᵢ (1/2) vᵢ²
```

**Potential Energy**:
```
U = Σᵢ [ (1/2) k xᵢ² + (1/2) c (xᵢ₊₁ - xᵢ)² ]
```

**Total Energy**:
```
E = T + U
```

### Error Metric

The error metric is simply the total displacement and velocity magnitude:

```
Error = (1/N) Σᵢ [ |xᵢ| + |vᵢ| ]
```

This quantifies how far the system is from the "unity" state where all oscillators are at rest at x = 0.

## Auto-Stabilizer

The auto-stabilizer is an imperfect control algorithm that attempts to reduce the error metric.

### N-Body Control

1. Identify the body with the largest deviation from the target radius:
   ```
   i* = argmaxᵢ |rᵢ - R|
   ```

2. Compute direction to center of mass:
   ```
   d = (R - rᵢ*) / |R - rᵢ*|
   ```

3. Add randomness via rotation:
   ```
   θ = random(-π, π) · randomness
   d' = rotate(d, θ)
   ```

4. Apply velocity correction:
   ```
   Δvᵢ* = α · d'
   ```

Where α is the stabilizer strength.

In **antagonize mode**, the direction is reversed: d' ← -d'

### Oscillator Control

1. Identify the oscillator with the largest error:
   ```
   i* = argmaxᵢ (|xᵢ| + |vᵢ|)
   ```

2. Compute corrective forces:
   ```
   Δxᵢ* = -xᵢ* · α
   Δvᵢ* = -vᵢ* · β
   ```

3. Add Gaussian noise:
   ```
   Δxᵢ* += N(0, σ)
   Δvᵢ* += N(0, σ)
   ```

Where σ is proportional to the randomness parameter.

In **antagonize mode**, signs are flipped.

### Why Imperfect?

The stabilizer is intentionally imperfect:

1. **Local, not global**: Only targets one component at a time
2. **Heuristic**: Uses simple error metrics, not optimal control theory
3. **Random perturbations**: Adds noise to corrective actions
4. **Fixed strength**: Doesn't adapt to system state

This creates emergent behavior where the stabilizer sometimes helps, sometimes hinders, and sometimes does nothing at all.

## Determinism and Reproducibility

All randomness is **pseudorandom** using a seeded linear congruential generator:

```
seed_{n+1} = (a · seed_n + c) mod m
```

With:
- a = 9301
- c = 49297
- m = 233280

This ensures that:
- Same seed → same initial conditions
- Same seed + same inputs → same trajectory
- Different seeds → different but equally valid behaviors

## Numerical Stability

### Timestep Selection

For n-body:
- dt < 0.1 / √(G/r₀) ensures orbit resolution
- Typical: dt = 0.016s (60 FPS)

For oscillators:
- dt < 2 / √(k + 4c) ensures stability
- Typical: dt = 0.016s

### Softening Parameter

The softening parameter ε prevents numerical instability when bodies nearly collide:

```
r_eff = √(r² + ε²)
```

Typical value: ε = 0.01

### Damping

Damping prevents unbounded growth of energy due to numerical errors:

```
v ← v · (1 - β · dt)
```

Typical value: β = 0.01 (1% energy loss per second)

## Performance

The simulation engine is optimized for real-time performance:

- **N-body**: O(N²) per step (pairwise interactions)
- **Oscillators**: O(N) per step (local coupling)

For N = 3-5 bodies, 60 FPS is easily achievable on any modern device.

## Future Enhancements

### Adaptive Timestep

Use error estimation to adjust dt dynamically:

```
if (|E(t) - E(t-1)| > threshold) {
  dt ← dt / 2
} else if (...) {
  dt ← dt * 1.5
}
```

### Barnes-Hut Algorithm

For large N (> 100), use hierarchical methods:

- O(N log N) instead of O(N²)
- Approximate distant interactions
- Maintain accuracy for nearby bodies

### Higher-Order Integrators

Use Runge-Kutta 4 (RK4) for better accuracy:

- 4th order vs 2nd order
- Allows larger timesteps
- More computation per step

### Symplectic Integrators

Use specialized integrators that preserve energy exactly:

- Leapfrog
- Yoshida
- Forest-Ruth

These are especially important for long-term simulations (days, years) but less critical for our interactive use case (seconds, minutes).
