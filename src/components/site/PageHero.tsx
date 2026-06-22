export function PageHero({
  eyebrow,
  title,
  desc,
  bgImage,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  bgImage?: string;
}) {
  if (bgImage) {
    return (
      <section className="relative overflow-hidden border-b border-border bg-navy-deep">
        <img
          src={bgImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-90 motion-safe:animate-hero-zoom"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(7,21,41,0.2) 0%, rgba(7,21,41,0.45) 55%, rgba(7,21,41,0.72) 100%)",
          }}
        />
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="relative container-page py-20 md:py-32">
          <div className="hero-eyebrow">{eyebrow}</div>
          <h1 className="mt-5 max-w-4xl text-white">{title}</h1>
          {desc && (
            <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-white/82">
              {desc}
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden border-b border-border bg-section-bg">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="relative container-page py-16 md:py-24">
        <div className="label-eyebrow">{eyebrow}</div>
        <h1 className="max-w-4xl text-navy">{title}</h1>
        {desc && (
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-text-secondary">
            {desc}
          </p>
        )}
      </div>
    </section>
  );
}
