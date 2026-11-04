import type { ReactNode } from "react";

export function FeatureSplit({
  image,
  reverse = false,
  cover = false,
  children,
}: {
  image: string;
  reverse?: boolean;
  cover?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="grid items-center gap-6 lg:grid-cols-12">
      <div className={reverse ? "lg:order-2 lg:col-span-5" : "lg:col-span-5"}>
        <img
          src={image}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className={
            cover
              ? "h-[220px] w-full rounded-[8px] object-cover"
              : "mx-auto max-h-[220px] w-full object-contain"
          }
        />
      </div>
      <div className={reverse ? "lg:order-1 lg:col-span-7" : "lg:col-span-7"}>{children}</div>
    </div>
  );
}
