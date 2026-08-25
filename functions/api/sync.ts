interface Env {
  SYNC_STORE?: {
    get(key: string): Promise<string | null>;
    put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  };
}

type PagesContext = {
  request: Request;
  env: Env;
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
});

const getKey = (request: Request) => {
  const key = new URL(request.url).searchParams.get("key") || "";
  return /^[a-f0-9]{64}$/.test(key) ? key : "";
};

export const onRequestGet = async ({ request, env }: PagesContext) => {
  if (!env.SYNC_STORE) return json({ error: "Cloudflare KV 저장소가 연결되지 않았습니다." }, 503);
  const key = getKey(request);
  if (!key) return json({ error: "잘못된 동기화 코드입니다." }, 400);
  const value = await env.SYNC_STORE.get(key);
  return value ? new Response(value, { headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } }) : json({ error: "저장된 데이터가 없습니다." }, 404);
};

export const onRequestPut = async ({ request, env }: PagesContext) => {
  if (!env.SYNC_STORE) return json({ error: "Cloudflare KV 저장소가 연결되지 않았습니다." }, 503);
  const key = getKey(request);
  if (!key) return json({ error: "잘못된 동기화 코드입니다." }, 400);
  const body = await request.json().catch(() => null) as { payload?: string } | null;
  if (!body?.payload || body.payload.length > 2_500_000) return json({ error: "동기화 데이터가 없거나 너무 큽니다." }, 400);
  const record = { payload: body.payload, updatedAt: Date.now() };
  await env.SYNC_STORE.put(key, JSON.stringify(record));
  return json(record);
};
