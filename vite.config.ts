// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
/** Custom domain (www.kcf-korea.org) uses "/". Set SITE_BASE_PATH=kcf-korea for user.github.io/repo URLs. */
const siteBasePath = (process.env.SITE_BASE_PATH ?? "").replace(/^\/|\/$/g, "");
const assetBase = siteBasePath ? `/${siteBasePath}/` : "/";
const routerBasepath = siteBasePath ? `/${siteBasePath}` : "/";

export default defineConfig({
  vite: {
    base: isGitHubPages ? assetBase : "/",
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    router: {
      basepath: isGitHubPages ? routerBasepath : "/",
    },
    prerender: {
      enabled: isGitHubPages,
      crawlLinks: true,
    },
  },
});
