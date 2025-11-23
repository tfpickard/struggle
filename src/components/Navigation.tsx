import { A } from "@solidjs/router";
import { createSignal, Show, For } from "solid-js";
import { useTheme } from "./ThemeProvider";
import { getCurrentUser } from "~/lib/auth/server";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/playground", label: "Playground" },
  { href: "/gallery", label: "Gallery" },
  { href: "/docs", label: "Docs" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = createSignal(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const user = getCurrentUser();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen());

  const cycleTheme = () => {
    const current = theme();
    if (current === "light") setTheme("dark");
    else if (current === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <nav class="bg-surface-elevated border-b border-surface-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <A href="/" class="text-xl font-bold text-text-primary">
              Chaotic Unity
            </A>
          </div>

          <div class="hidden md:flex items-center space-x-4">
            <For each={navLinks}>
              {(link) => (
                <A
                  href={link.href}
                  class="text-text-secondary hover:text-text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  activeClass="text-text-primary bg-surface"
                >
                  {link.label}
                </A>
              )}
            </For>

            <Show
              when={user()}
              fallback={
                <A
                  href="/auth/signin"
                  class="text-text-secondary hover:text-text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </A>
              }
            >
              <A
                href="/account"
                class="text-text-secondary hover:text-text-primary px-3 py-2 rounded-md text-sm font-medium"
              >
                Account
              </A>
              <Show when={user()?.role === "ADMIN"}>
                <A
                  href="/admin"
                  class="text-text-secondary hover:text-text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Admin
                </A>
              </Show>
            </Show>

            <button
              onClick={cycleTheme}
              class="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
              aria-label="Toggle theme"
            >
              <Show
                when={resolvedTheme() === "dark"}
                fallback={
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                }
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </Show>
            </button>
          </div>

          <div class="md:hidden">
            <button
              onClick={toggleMobileMenu}
              class="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
              aria-label="Toggle menu"
            >
              <Show
                when={mobileMenuOpen()}
                fallback={
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                }
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Show>
            </button>
          </div>
        </div>
      </div>

      <Show when={mobileMenuOpen()}>
        <div class="md:hidden border-t border-surface-border">
          <div class="px-2 pt-2 pb-3 space-y-1">
            <For each={navLinks}>
              {(link) => (
                <A
                  href={link.href}
                  class="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
                  activeClass="text-text-primary bg-surface"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </A>
              )}
            </For>

            <Show
              when={user()}
              fallback={
                <A
                  href="/auth/signin"
                  class="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-text-primary hover:bg-surface"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </A>
              }
            >
              <A
                href="/account"
                class="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-text-primary hover:bg-surface"
                onClick={() => setMobileMenuOpen(false)}
              >
                Account
              </A>
              <Show when={user()?.role === "ADMIN"}>
                <A
                  href="/admin"
                  class="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-text-primary hover:bg-surface"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </A>
              </Show>
            </Show>

            <button
              onClick={() => {
                cycleTheme();
                setMobileMenuOpen(false);
              }}
              class="w-full text-left px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-text-primary hover:bg-surface"
            >
              Theme: {theme()}
            </button>
          </div>
        </div>
      </Show>
    </nav>
  );
}
