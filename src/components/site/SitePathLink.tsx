import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

type SitePathLinkProps = {
  to: string;
  hash?: string;
  className?: string;
  children: ReactNode;
};

export function SitePathLink({ to, hash, className, children }: SitePathLinkProps) {
  if (to === "/") return <Link to="/" hash={hash} className={className}>{children}</Link>;
  if (to === "/about") return <Link to="/about" hash={hash} className={className}>{children}</Link>;
  if (to === "/history") return <Link to="/history" hash={hash} className={className}>{children}</Link>;
  if (to === "/business") return <Link to="/business" hash={hash} className={className}>{children}</Link>;
  if (to === "/achievements") return <Link to="/achievements" hash={hash} className={className}>{children}</Link>;
  if (to === "/contact") return <Link to="/contact" hash={hash} className={className}>{children}</Link>;
  if (to === "/privacy-center") return <Link to="/privacy-center" hash={hash} className={className}>{children}</Link>;
  if (to === "/privacy-center/security-services") {
    return <Link to="/privacy-center/security-services" hash={hash} className={className}>{children}</Link>;
  }
  if (to === "/privacy-center/research") {
    return <Link to="/privacy-center/research" hash={hash} className={className}>{children}</Link>;
  }
  if (to === "/privacy-center/education") {
    return <Link to="/privacy-center/education" hash={hash} className={className}>{children}</Link>;
  }
  if (to === "/privacy-center/sure-check") {
    return <Link to="/privacy-center/sure-check" hash={hash} className={className}>{children}</Link>;
  }
  if (to === "/privacy-center/sure-mark") {
    return <Link to="/privacy-center/sure-mark" hash={hash} className={className}>{children}</Link>;
  }
  if (to === "/privacy-center/publications") {
    return <Link to="/privacy-center/publications" hash={hash} className={className}>{children}</Link>;
  }
  if (to.startsWith("/")) {
    const href = hash ? `${to}#${hash}` : to;
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return <Link to="/" className={className}>{children}</Link>;
}
