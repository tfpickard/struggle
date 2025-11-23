import { Title, Meta } from "@solidjs/meta";

export default function Gallery() {
  return (
    <>
      <Title>Gallery - Chaotic Unity</Title>
      <Meta
        name="description"
        content="Explore public chaotic system configurations"
      />

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-3xl font-bold mb-6">Gallery</h1>

        <div class="bg-surface-elevated border border-surface-border rounded-lg p-8 text-center">
          <p class="text-text-secondary mb-4">
            Public simulation gallery coming soon.
          </p>
          <p class="text-sm text-text-tertiary">
            Browse and explore interesting chaotic configurations created by
            the community.
          </p>
        </div>
      </div>
    </>
  );
}
