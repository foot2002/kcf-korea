import { useEffect, useState } from "react";

import { buildPublicContent, emptyDb } from "@/lib/center-ops/logic";
import { loadPublicContent } from "@/lib/center-ops/api";
import type { PublicContent } from "@/lib/center-ops/types";

export function usePublicContent() {
  const [now, setNow] = useState<number | null>(null);
  const [remote, setRemote] = useState<PublicContent | null>(null);

  useEffect(() => {
    setNow(Date.now());
    void loadPublicContent()
      .then(setRemote)
      .catch(() => setRemote(null));
  }, []);

  return remote ?? buildPublicContent(emptyDb(), now);
}
