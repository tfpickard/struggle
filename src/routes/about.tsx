import { Title, Meta } from "@solidjs/meta";

export default function About() {
  return (
    <>
      <Title>About - Chaotic Unity</Title>
      <Meta
        name="description"
        content="Learn about the philosophy and purpose of Chaotic Unity"
      />

      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 class="text-4xl font-bold mb-8">About Chaotic Unity</h1>

        <div class="prose prose-lg dark:prose-invert max-w-none">
          <p class="text-xl text-text-secondary mb-6">
            Chaotic Unity is an exploration of deterministic chaos, imperfect
            control, and the beauty of systems that resist optimization.
          </p>

          <h2 class="text-2xl font-semibold mb-4 mt-8">The Philosophy</h2>
          <p class="text-text-secondary mb-4">
            In a world obsessed with efficiency and optimization, Chaotic Unity
            celebrates the opposite: systems that are beautifully, deliberately
            useless. Our auto-stabilizer doesn't always stabilize. Our chaos
            isn't always chaotic. And that's precisely the point.
          </p>

          <h2 class="text-2xl font-semibold mb-4 mt-8">The Science</h2>
          <p class="text-text-secondary mb-4">
            At its core, Chaotic Unity simulates deterministic dynamical systems:
          </p>
          <ul class="list-disc list-inside text-text-secondary mb-4 space-y-2">
            <li>N-body gravitational systems using Newtonian physics</li>
            <li>Coupled oscillator networks with spring-like interactions</li>
            <li>Imperfect control algorithms that attempt stabilization</li>
          </ul>
          <p class="text-text-secondary mb-4">
            These systems exhibit sensitive dependence on initial conditions,
            making long-term prediction impossible despite being fully
            deterministic.
          </p>

          <h2 class="text-2xl font-semibold mb-4 mt-8">The Purpose</h2>
          <p class="text-text-secondary mb-4">
            Chaotic Unity exists because not everything needs a practical purpose.
            It's a digital sandbox for curiosity, a meditation on entropy, and
            an invitation to find beauty in futility.
          </p>
        </div>
      </div>
    </>
  );
}
