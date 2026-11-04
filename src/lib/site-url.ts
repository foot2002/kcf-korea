export const SITE_ORIGIN = "https://www.kcf-korea.org";

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${normalized}`;
}

export function shareImageForPath(pathname: string) {
  return pathname === "/privacy-center" || pathname.startsWith("/privacy-center/")
    ? "/og-privacy.png"
    : "/og-kcf.png";
}
