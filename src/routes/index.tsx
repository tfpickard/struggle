import { Title, Meta } from "@solidjs/meta";
import { A } from "@solidjs/router";

export default function Home() {
  return (
    <>
      <Title>Chaotic Unity - A Useless Device as a Service</Title>
      <Meta
        name="description"
        content="Experience the beauty of chaos. Watch as our auto-stabilizer battles entropy in a mesmerizing dance of physics and futility."
      />

      <div class="relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-primary-700/10 pointer-events-none" />

        <section class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div class="text-center">
            <h1 class="text-5xl sm:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
              Chaotic Unity
            </h1>
            <p class="text-xl sm:text-2xl text-text-secondary mb-8 max-w-3xl mx-auto">
              A useless device as a service: where order meets chaos, and neither
              wins
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <A
                href="/playground"
                class="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors shadow-lg"
              >
                Enter the Playground
              </A>
              <A
                href="/gallery"
                class="px-8 py-3 bg-surface-elevated hover:bg-surface border border-surface-border text-text-primary rounded-lg font-medium transition-colors"
              >
                Explore the Gallery
              </A>
            </div>
          </div>
        </section>

        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div class="grid md:grid-cols-3 gap-8">
            <div class="bg-surface-elevated border border-surface-border rounded-lg p-6">
              <div class="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg
                  class="w-6 h-6 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Chaotic Dynamics</h3>
              <p class="text-text-secondary">
                Watch n-body gravitational systems or coupled oscillators evolve
                in real-time. Every interaction creates unpredictable beauty.
              </p>
            </div>

            <div class="bg-surface-elevated border border-surface-border rounded-lg p-6">
              <div class="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg
                  class="w-6 h-6 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Auto-Stabilizer</h3>
              <p class="text-text-secondary">
                Our imperfect controller tries to bring order to chaos. Sometimes
                it helps. Sometimes it makes things worse. Always entertaining.
              </p>
            </div>

            <div class="bg-surface-elevated border border-surface-border rounded-lg p-6">
              <div class="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg
                  class="w-6 h-6 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Share & Explore</h3>
              <p class="text-text-secondary">
                Save your favorite chaotic configurations. Browse interesting
                systems created by others. Celebrate the futility together.
              </p>
            </div>
          </div>
        </section>

        <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 class="text-3xl font-bold mb-4">Why does this exist?</h2>
          <p class="text-lg text-text-secondary mb-4">
            Because some things don't need a purpose to justify their existence.
          </p>
          <p class="text-text-secondary">
            Chaotic Unity is an exploration of deterministic chaos, imperfect
            control systems, and the strange beauty that emerges when we stop
            trying to optimize everything. It's a playground for curiosity,
            a meditation on entropy, and yes, completely useless.
          </p>
          <div class="mt-8">
            <A
              href="/about"
              class="text-primary-600 hover:text-primary-700 font-medium"
            >
              Learn more about the philosophy →
            </A>
          </div>
        </section>
      </div>
    </>
  );
}
