import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: string;
  duration?: number;
  className?: string;
}

// Parse "1,500~1,600+" into segments: numbers vs non-numbers
function parseSegments(value: string) {
  const regex = /([\d,]+)/g;
  const segments: { text: string; isNum: boolean; target: number; hasComma: boolean }[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(value)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        text: value.slice(lastIndex, match.index),
        isNum: false,
        target: 0,
        hasComma: false,
      });
    }
    const raw = match[1];
    const num = parseInt(raw.replace(/,/g, ""), 10);
    segments.push({
      text: raw,
      isNum: true,
      target: num,
      hasComma: raw.includes(","),
    });
    lastIndex = match.index + raw.length;
  }
  if (lastIndex < value.length) {
    segments.push({ text: value.slice(lastIndex), isNum: false, target: 0, hasComma: false });
  }
  return segments;
}

function format(n: number, withComma: boolean) {
  return withComma ? n.toLocaleString("en-US") : String(n);
}

export function CountUp({ value, duration = 1800, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const segments = parseSegments(value);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            setStarted(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, duration]);

  return (
    <span ref={ref} className={className}>
      {segments.map((seg, i) => {
        if (!seg.isNum) return <span key={i}>{seg.text}</span>;
        const current = Math.round(seg.target * progress);
        return <span key={i}>{format(current, seg.hasComma)}</span>;
      })}
    </span>
  );
}
