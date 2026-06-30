import kcfLogo from "@site-image/kcf_logo.jpg";

type KcfLogoProps = {
  /** header/footer: full wordmark, mark: small badge */
  variant?: "header" | "footer" | "mark";
  className?: string;
};

const variantClass: Record<NonNullable<KcfLogoProps["variant"]>, string> = {
  header: "h-9 w-auto max-w-[240px] sm:h-10 md:h-11",
  footer: "h-9 w-auto max-w-[260px] sm:h-10 md:h-11",
  mark: "h-7 w-7 object-cover object-left",
};

export function KcfLogo({ variant = "header", className = "" }: KcfLogoProps) {
  return (
    <img
      src={kcfLogo}
      alt="한국컨설팅산업재단 Korea Consultancy Foundation"
      className={`object-contain object-left ${variantClass[variant]} ${className}`.trim()}
      width={320}
      height={80}
    />
  );
}
