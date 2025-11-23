import { Title, Meta } from "@solidjs/meta";

export default function Playground() {
  return (
    <>
      <Title>Playground - Chaotic Unity</Title>
      <Meta
        name="description"
        content="Interactive chaotic dynamics playground"
      />

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-3xl font-bold mb-6">Playground</h1>

        <div class="bg-surface-elevated border border-surface-border rounded-lg p-8 text-center">
          <p class="text-text-secondary mb-4">
            Interactive simulation visualization coming soon.
          </p>
          <p class="text-sm text-text-tertiary">
            This will feature a live canvas with n-body or oscillator
            visualization, interactive controls, and real-time metrics display.
          </p>
        </div>
      </div>
    </>
  );
}
