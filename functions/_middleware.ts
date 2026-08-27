interface KeyValueStore {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

interface Env {
  AUTH_USERNAME?: string;
  AUTH_PASSWORD?: string;
  AUTH_SESSION_SECRET?: string;
  SYNC_STORE?: KeyValueStore;
}

interface PagesContext {
  request: Request;
  env: Env;
  next(): Promise<Response>;
}

const encoder = new TextEncoder();
const COOKIE_NAME = "vamos_session";
const SESSION_SECONDS = 60 * 60 * 24 * 30;
const LOGIN_PATH = "/__auth/login";
const LOGOUT_PATH = "/__auth/logout";

const html = (body: string, status = 200, headers: HeadersInit = {}) => new Response(body, {
  status,
  headers: {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store, private",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
    ...headers,
  },
});

const redirect = (location: string, clearCookie = false) => new Response(null, {
  status: 303,
  headers: {
    Location: location,
    "Cache-Control": "no-store",
    ...(clearCookie ? { "Set-Cookie": `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0` } : {}),
  },
});

const base64Url = (bytes: Uint8Array) => {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const sign = async (value: string, secret: string) => {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return base64Url(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value))));
};

const constantTimeEqual = async (left: string, right: string) => {
  const [leftHash, rightHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(left)),
    crypto.subtle.digest("SHA-256", encoder.encode(right)),
  ]);
  const a = new Uint8Array(leftHash);
  const b = new Uint8Array(rightHash);
  let mismatch = a.length ^ b.length;
  for (let index = 0; index < a.length; index += 1) mismatch |= a[index] ^ b[index];
  return mismatch === 0;
};

const getCookie = (request: Request) => {
  const cookies = request.headers.get("Cookie") || "";
  for (const part of cookies.split(";")) {
    const [name, ...value] = part.trim().split("=");
    if (name === COOKIE_NAME) return value.join("=");
  }
  return "";
};

const isAuthenticated = async (request: Request, secret: string) => {
  const cookie = getCookie(request);
  const separator = cookie.lastIndexOf(".");
  if (separator < 1) return false;
  const payload = cookie.slice(0, separator);
  const signature = cookie.slice(separator + 1);
  const [username, expiresText] = payload.split(".");
  const expires = Number(expiresText);
  if (!username || !Number.isFinite(expires) || expires <= Date.now()) return false;
  const expected = await sign(payload, secret);
  return constantTimeEqual(signature, expected);
};

const loginPage = (message = "", status = 200) => html(`<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#10251d"><title>로그인 · Automotive HW R&D Prep</title>
<style>
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:#eef3ef;color:#12231c;font-family:-apple-system,BlinkMacSystemFont,"Pretendard","Noto Sans KR",sans-serif}.card{width:min(100%,420px);background:#fff;border:1px solid #dbe5de;border-radius:22px;padding:32px;box-shadow:0 18px 50px rgba(16,37,29,.1)}.eyebrow{margin:0 0 10px;color:#547565;font-size:12px;font-weight:800;letter-spacing:.12em}.title{margin:0;font-size:26px;line-height:1.3}.desc{margin:10px 0 26px;color:#687a71;font-size:14px;line-height:1.65}.field{display:block;margin-top:16px;color:#334b40;font-size:13px;font-weight:700}.field input{width:100%;margin-top:7px;padding:13px 14px;border:1px solid #cad8d0;border-radius:12px;background:#fbfdfb;color:#12231c;font:inherit;outline:none}.field input:focus{border-color:#5e8d72;box-shadow:0 0 0 3px rgba(94,141,114,.15)}.error{margin:0 0 16px;padding:11px 13px;border-radius:10px;background:#fff1ef;color:#a13e32;font-size:13px}.submit{width:100%;margin-top:24px;padding:14px;border:0;border-radius:12px;background:#163d2d;color:#fff;font-size:15px;font-weight:800;cursor:pointer}.submit:hover{background:#0f3023}.note{margin:18px 0 0;text-align:center;color:#839088;font-size:12px}@media(max-width:480px){body{padding:16px}.card{padding:26px 20px;border-radius:18px}}
</style></head><body><main class="card"><p class="eyebrow">PRIVATE WORKSPACE</p><h1 class="title">취업 준비 대시보드</h1><p class="desc">개인 기록과 학습 데이터를 보호하기 위해 로그인해 주세요.</p>${message ? `<p class="error" role="alert">${message}</p>` : ""}<form method="post" action="${LOGIN_PATH}"><label class="field">로그인<input name="username" autocomplete="username" required autofocus></label><label class="field">비밀번호<input name="password" type="password" autocomplete="current-password" required></label><button class="submit" type="submit">로그인</button></form><p class="note">승인된 사용자만 접속할 수 있습니다.</p></main></body></html>`, status);

const rateLimitKey = async (request: Request) => {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(ip));
  return `auth:attempts:${base64Url(new Uint8Array(digest)).slice(0, 24)}`;
};

const handleLogin = async (request: Request, env: Env) => {
  if (request.method !== "POST") return loginPage();
  if (!env.AUTH_USERNAME || !env.AUTH_PASSWORD || !env.AUTH_SESSION_SECRET) {
    return loginPage("로그인 보안 설정이 완료되지 않았습니다.", 503);
  }

  const key = await rateLimitKey(request);
  const attempts = Number(await env.SYNC_STORE?.get(key) || "0");
  if (attempts >= 5) return loginPage("로그인 시도가 너무 많습니다. 15분 뒤 다시 시도해 주세요.", 429);

  const form = await request.formData();
  const username = String(form.get("username") || "");
  const password = String(form.get("password") || "");
  const [validUsername, validPassword] = await Promise.all([
    constantTimeEqual(username, env.AUTH_USERNAME),
    constantTimeEqual(password, env.AUTH_PASSWORD),
  ]);

  if (!validUsername || !validPassword) {
    await env.SYNC_STORE?.put(key, String(attempts + 1), { expirationTtl: 900 });
    return loginPage("로그인 정보가 올바르지 않습니다.", 401);
  }

  const expires = Date.now() + SESSION_SECONDS * 1000;
  const payload = `${username}.${expires}`;
  const signature = await sign(payload, env.AUTH_SESSION_SECRET);
  return new Response(null, {
    status: 303,
    headers: {
      Location: "/",
      "Cache-Control": "no-store",
      "Set-Cookie": `${COOKIE_NAME}=${payload}.${signature}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_SECONDS}`,
    },
  });
};

export const onRequest = async ({ request, env, next }: PagesContext) => {
  const url = new URL(request.url);
  if (url.pathname === LOGIN_PATH) return handleLogin(request, env);
  if (url.pathname === LOGOUT_PATH) return redirect(LOGIN_PATH, true);

  if (!env.AUTH_SESSION_SECRET || !await isAuthenticated(request, env.AUTH_SESSION_SECRET)) {
    if (url.pathname.startsWith("/api/")) {
      return new Response(JSON.stringify({ error: "로그인이 필요합니다." }), {
        status: 401,
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      });
    }
    return redirect(LOGIN_PATH);
  }

  const response = await next();
  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "same-origin");
  if (url.pathname === "/" || url.pathname.endsWith(".html")) headers.set("Cache-Control", "no-store, private");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
};
