import { ZodError } from "zod";

/** Server function / Zod 오류를 사용자용 한 줄 메시지로 변환 */
export function formatUserError(err: unknown): string {
  if (err instanceof ZodError) {
    return err.issues[0]?.message ?? "입력값을 확인해 주세요.";
  }

  if (err instanceof Error) {
    const msg = err.message.trim();

    if (msg.startsWith("[") || msg.startsWith("{")) {
      try {
        const parsed = JSON.parse(msg) as unknown;
        if (Array.isArray(parsed) && parsed[0] && typeof parsed[0] === "object") {
          const first = parsed[0] as { message?: string };
          if (first.message) return first.message;
        }
      } catch {
        /* not JSON */
      }
    }

    if (msg.includes('"message"') && msg.includes("too_small")) {
      const match = msg.match(/"message"\s*:\s*"([^"]+)"/);
      if (match?.[1]) return match[1];
    }

    return msg || "요청 처리에 실패했습니다.";
  }

  return "요청 처리에 실패했습니다.";
}

export function parseWithUserError<T>(
  schema: { safeParse: (data: unknown) => { success: true; data: T } | { success: false; error: ZodError } },
  data: unknown,
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.issues[0]?.message ?? "입력값을 확인해 주세요.");
  }
  return result.data;
}
