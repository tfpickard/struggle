import { Title, Meta } from "@solidjs/meta";

export default function Docs() {
  return (
    <>
      <Title>Documentation - Chaotic Unity</Title>
      <Meta name="description" content="Technical documentation for Chaotic Unity" />

      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 class="text-4xl font-bold mb-8">Documentation</h1>

        <div class="space-y-8">
          <section>
            <h2 class="text-2xl font-semibold mb-4">Getting Started</h2>
            <p class="text-text-secondary mb-4">
              Chaotic Unity provides an interactive playground for exploring
              chaotic dynamical systems. No installation required - just visit
              the playground and start experimenting.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">N-Body Simulation</h2>
            <p class="text-text-secondary mb-4">
              The n-body mode simulates gravitational interactions between
              celestial bodies using Newtonian physics:
            </p>
            <ul class="list-disc list-inside text-text-secondary space-y-2">
              <li>Configurable number of bodies (typically 3-5)</li>
              <li>Gravitational constant controls attraction strength</li>
              <li>Damping factor slowly dissipates energy</li>
              <li>Softening parameter prevents singularities</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">Coupled Oscillators</h2>
            <p class="text-text-secondary mb-4">
              The oscillator mode creates a network of coupled harmonic
              oscillators:
            </p>
            <ul class="list-disc list-inside text-text-secondary space-y-2">
              <li>Each oscillator connected to its neighbors</li>
              <li>Spring constant controls restoring force</li>
              <li>Coupling strength determines interaction level</li>
              <li>Damping gradually reduces oscillation amplitude</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">Auto-Stabilizer</h2>
            <p class="text-text-secondary mb-4">
              The auto-stabilizer is an imperfect control system that attempts
              to guide the system toward stability:
            </p>
            <ul class="list-disc list-inside text-text-secondary space-y-2">
              <li>Stabilize mode: tries to reduce system energy and error</li>
              <li>Antagonize mode: deliberately increases chaos</li>
              <li>Randomness parameter adds unpredictable behavior</li>
              <li>Strength controls intervention magnitude</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-semibold mb-4">Metrics</h2>
            <p class="text-text-secondary mb-4">
              The simulation tracks several key metrics:
            </p>
            <ul class="list-disc list-inside text-text-secondary space-y-2">
              <li>Total energy (kinetic + potential)</li>
              <li>Error metric (deviation from target configuration)</li>
              <li>Center of mass position</li>
              <li>Angular momentum (n-body only)</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
