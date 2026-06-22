import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "../components/site/Header";
import { Footer } from "../components/site/Footer";
import { useScrollReveal } from "../hooks/use-scroll-reveal";
import { Toaster } from "../components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-[13px] font-semibold uppercase tracking-wider text-trust-blue">404</p>
        <h1 className="mt-3 text-navy">페이지를 찾을 수 없습니다</h1>
        <p className="mt-4 text-text-secondary">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <div className="mt-8">
          <Link to="/" className="btn-primary-kcf">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-navy">페이지를 불러오지 못했습니다</h1>
        <p className="mt-4 text-text-secondary">
          일시적인 오류가 발생했습니다. 새로고침하거나 홈으로 이동해 주세요.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-primary-kcf"
          >
            다시 시도
          </button>
          <a href="/" className="btn-secondary-kcf">
            홈으로
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "한국컨설팅산업재단 | 대한민국 지식서비스산업을 선도하는 공익재단" },
      {
        name: "description",
        content:
          "재단법인 한국컨설팅산업재단(KCF)은 2010년 설립된 비영리 법정기부금단체로 컨설팅, 청소년 경영교육, 개인정보보호 진흥, 전국상업경진대회(NBO) 사무국 운영을 담당합니다.",
      },
      { name: "author", content: "재단법인 한국컨설팅산업재단" },
      { property: "og:title", content: "한국컨설팅산업재단 | 대한민국 지식서비스산업을 선도하는 공익재단" },
      {
        property: "og:description",
        content:
          "컨설팅·청소년 경영교육·개인정보보호 진흥·NBO 사무국을 운영하는 비영리 공익재단.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "한국컨설팅산업재단" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "한국컨설팅산업재단 | 대한민국 지식서비스산업을 선도하는 공익재단" },
      {
        name: "twitter:description",
        content:
          "컨설팅·청소년 경영교육·개인정보보호 진흥·NBO 사무국을 운영하는 비영리 공익재단.",
      },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/fe52ccff-313f-41e2-a500-88e3f4c6883a/id-preview-083e3be0--683db3eb-3a98-4531-9791-1319737559a2.lovable.app-1782136458096.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/fe52ccff-313f-41e2-a500-88e3f4c6883a/id-preview-083e3be0--683db3eb-3a98-4531-9791-1319737559a2.lovable.app-1782136458096.png" },
    ],
    links: [
      {
        rel: "preconnect",
        href: "https://cdn.jsdelivr.net",
      },
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useScrollReveal();

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hash = useRouterState({ select: (s) => s.location.hash });
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <Toaster position="top-center" richColors closeButton />
      </div>
    </QueryClientProvider>
  );
}
