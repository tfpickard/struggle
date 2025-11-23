import { Title, Meta } from "@solidjs/meta";

export default function Blog() {
  return (
    <>
      <Title>Blog - Chaotic Unity</Title>
      <Meta name="description" content="Updates and insights from Chaotic Unity" />

      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 class="text-4xl font-bold mb-8">Blog & Changelog</h1>

        <div class="space-y-8">
          <article class="border-b border-surface-border pb-8">
            <div class="text-sm text-text-tertiary mb-2">November 23, 2025</div>
            <h2 class="text-2xl font-semibold mb-4">Welcome to Chaotic Unity</h2>
            <p class="text-text-secondary">
              Chaotic Unity is now live. Explore the beauty of deterministic
              chaos and imperfect control systems in this interactive playground.
            </p>
          </article>
        </div>
      </div>
    </>
  );
}
