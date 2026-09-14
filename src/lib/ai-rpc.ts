import { createServerFn } from "@tanstack/react-start";

export type AiMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AiChatInput = {
  messages: AiMessage[];
  temperature?: number;
  maxTokens?: number;
};

export type AiChatResult =
  { ok: true; content: string } | { ok: false; kind: "no-key" | "error"; message?: string };

export type AiInfoResult = {
  configured: boolean;
  model: string;
  baseUrl: string;
};

function getEnv(key: string): string | undefined {
  const p = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
  return p?.env?.[key];
}

const DEFAULT_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_MODEL = "gpt-4o-mini";
const REQUEST_TIMEOUT_MS = 120_000;

function isLocalBaseUrl(baseUrl: string): boolean {
  return /^(http:\/\/|https?:\/\/)?(localhost|127\.0\.0\.1|0\.0\.0\.0|::1)/i.test(baseUrl);
}

export const aiChat = createServerFn({ method: "POST" })
  .validator((d: unknown) => {
    if (!d || typeof d !== "object") throw new Error("payload must be an object");
    const payload = d as Partial<AiChatInput>;
    if (!Array.isArray(payload.messages) || payload.messages.length === 0) {
      throw new Error("messages must be a non-empty array");
    }
    for (const m of payload.messages) {
      if (!m || typeof m.role !== "string" || typeof m.content !== "string") {
        throw new Error("invalid message shape");
      }
    }
    const input: AiChatInput = {
      messages: payload.messages as AiMessage[],
    };
    if (typeof payload.temperature === "number") input.temperature = payload.temperature;
    if (typeof payload.maxTokens === "number") input.maxTokens = payload.maxTokens;
    return input;
  })
  .handler(async ({ data }) => {
    const baseUrl = (getEnv("AI_BASE_URL") || DEFAULT_BASE_URL).replace(/\/+$/, "");
    const model = getEnv("AI_MODEL") || DEFAULT_MODEL;
    const apiKey = getEnv("AI_API_KEY") ?? "";

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      const headers: Record<string, string> = {
        "content-type": "application/json",
      };
      if (apiKey) headers["authorization"] = `Bearer ${apiKey}`;
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model,
          messages: data.messages,
          temperature: data.temperature ?? 0.4,
          max_tokens: data.maxTokens ?? 1400,
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        return {
          ok: false,
          kind: "error",
          message: `مشکل از سرویس مدل (HTTP ${res.status}): ${body.slice(0, 200)}`,
        } as const;
      }

      const json = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const content = json.choices?.[0]?.message?.content?.trim();
      if (!content) return { ok: false, kind: "error", message: "پاسخ مدل خالی بود" } as const;

      return { ok: true, content } as const;
    } catch (err) {
      const message = err instanceof Error ? err.message : "خطای ناشناخته در ارتباط با مدل";
      return { ok: false, kind: "error", message } as const;
    }
  });

export const aiInfo = createServerFn({ method: "GET" }).handler(async (): Promise<AiInfoResult> => {
  const baseUrl = (getEnv("AI_BASE_URL") || DEFAULT_BASE_URL).replace(/\/+$/, "");
  return {
    configured: Boolean(getEnv("AI_API_KEY")) || isLocalBaseUrl(baseUrl),
    model: getEnv("AI_MODEL") || DEFAULT_MODEL,
    baseUrl,
  };
});
