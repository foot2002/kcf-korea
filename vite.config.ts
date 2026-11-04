// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const isGitHubPages = process.env.GITHUB_PAGES === "true";
/** Custom domain (www.kcf-korea.org) uses "/". Set SITE_BASE_PATH=kcf-korea for user.github.io/repo URLs. */
const siteBasePath = (process.env.SITE_BASE_PATH ?? "").replace(/^\/|\/$/g, "");
const assetBase = siteBasePath ? `/${siteBasePath}/` : "/";
const routerBasepath = siteBasePath ? `/${siteBasePath}` : "/";

/** Published EDUCATION_SEED detail URLs. GitHub Pages 404s if these are not prerendered. */
const educationDetailPages = ["/privacy-center/education/2026-privacy-practice"];
const publicationDetailPages = [
  "/privacy-center/publications/2026-public-collection-survey",
  "/privacy-center/publications/etnews-20261015-survey-tools",
  "/privacy-center/publications/pipc-20261016-survey-guidance",
  "/privacy-center/publications/privacy-law-explainer",
];
const monitorApplyPage = ["/privacy-center/rights/monitor/apply"];

const redirectPages = [
  "/privacy-center/policy",
  "/privacy-center/policy/secure-tool-use",
  "/privacy-center/policy/joint-guideline",
  "/privacy-center/policy/high-risk-review",
  "/privacy-center/policy/account-lifecycle",
  "/privacy-center/policy/consignment-standard",
  "/privacy-center/policy/continuous-check",
  "/privacy-center/support",
  "/privacy-center/support/apply",
  "/privacy-center/association-apply",
  "/privacy-center/voucher",
  "/privacy-center/sure-certified",
  "/privacy-center/self-check",
];

export default defineConfig({
  vite: {
    base: isGitHubPages ? assetBase : "/",
    resolve: {
      alias: {
        "@site-image": path.resolve(rootDir, "image"),
      },
    },
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
      filter: (page: { path: string }) => {
        const pathname = page.path.split(/[?#]/)[0] ?? "";
        if (pathname.startsWith("/downloads/") || pathname.startsWith("/content/") || pathname.startsWith("/fonts/")) {
          return false;
        }
        if (/\.(pdf|docx|png|jpg|jpeg|svg|json|woff2|zip|gif|webp|ico|woff|ttf)$/i.test(pathname)) return false;
        return true;
      },
    },
    pages: [...redirectPages, ...educationDetailPages, ...publicationDetailPages, ...monitorApplyPage, "/404"].map((path) => ({
      path,
    })),
  },
});
