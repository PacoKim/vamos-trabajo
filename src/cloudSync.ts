const CODE_KEY = "ahw-sync-code";
const PIN_KEY = "ahw-sync-pin";
const HASH_KEY = "ahw-sync-last-hash";
const CLOUD_TIME_KEY = "ahw-sync-cloud-time";

type CloudRecord = { payload: string; updatedAt: number };

const bytesToBase64 = (bytes: Uint8Array) => {
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
};

const base64ToBytes = (value: string) => {
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

const digest = async (value: string) => {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

const deriveKey = async (pin: string, salt: Uint8Array) => {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(pin),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: 150000, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
};

const encrypt = async (plainText: string, pin: string) => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(pin, salt);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plainText),
  );
  return [bytesToBase64(salt), bytesToBase64(iv), bytesToBase64(new Uint8Array(encrypted))].join(".");
};

const decrypt = async (payload: string, pin: string) => {
  const [saltValue, ivValue, encryptedValue] = payload.split(".");
  if (!saltValue || !ivValue || !encryptedValue) throw new Error("동기화 데이터 형식이 올바르지 않습니다.");
  const salt = base64ToBytes(saltValue);
  const iv = base64ToBytes(ivValue);
  const key = await deriveKey(pin, salt);
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    base64ToBytes(encryptedValue),
  );
  return new TextDecoder().decode(plain);
};

export const collectAppData = () => {
  const data: Record<string, string> = {};
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key?.startsWith("ahw-") && !key.startsWith("ahw-sync-")) {
      data[key] = localStorage.getItem(key) || "";
    }
  }
  return JSON.stringify(data);
};

const endpoint = async (code: string) => `/api/sync?key=${await digest(code.trim().toUpperCase())}`;

const getCloud = async (code: string): Promise<CloudRecord | null> => {
  const response = await fetch(await endpoint(code), { cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || "클라우드 데이터를 불러오지 못했습니다.");
  return response.json();
};

export const uploadCloud = async (code: string, pin: string) => {
  const snapshot = collectAppData();
  const payload = await encrypt(snapshot, pin);
  const response = await fetch(await endpoint(code), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload }),
  });
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || "클라우드 저장에 실패했습니다.");
  const result: CloudRecord = await response.json();
  localStorage.setItem(HASH_KEY, await digest(snapshot));
  localStorage.setItem(CLOUD_TIME_KEY, String(result.updatedAt));
  window.dispatchEvent(new CustomEvent("ahw-sync-status", { detail: "이 기기의 변경 내용을 클라우드에 저장했습니다." }));
  return result;
};

export const downloadCloud = async (code: string, pin: string, reload = true) => {
  const cloud = await getCloud(code);
  if (!cloud) return false;
  let parsed: Record<string, string>;
  try {
    parsed = JSON.parse(await decrypt(cloud.payload, pin));
  } catch {
    throw new Error("동기화 비밀번호가 다르거나 데이터가 손상되었습니다.");
  }
  Object.entries(parsed).forEach(([key, value]) => {
    if (key.startsWith("ahw-") && !key.startsWith("ahw-sync-") && typeof value === "string") {
      localStorage.setItem(key, value);
    }
  });
  const snapshot = collectAppData();
  localStorage.setItem(HASH_KEY, await digest(snapshot));
  localStorage.setItem(CLOUD_TIME_KEY, String(cloud.updatedAt));
  window.dispatchEvent(new CustomEvent("ahw-sync-status", { detail: "다른 기기의 최신 내용을 가져왔습니다." }));
  if (reload) location.reload();
  return true;
};

export const connectCloud = async (code: string, pin: string) => {
  const normalizedCode = code.trim().toUpperCase();
  if (normalizedCode.length < 12) throw new Error("동기화 코드는 12자 이상이어야 합니다.");
  if (pin.length < 6) throw new Error("동기화 비밀번호는 6자 이상이어야 합니다.");
  const cloud = await getCloud(normalizedCode);
  if (cloud) {
    await downloadCloud(normalizedCode, pin, false);
    localStorage.setItem(CODE_KEY, normalizedCode);
    localStorage.setItem(PIN_KEY, pin);
    location.reload();
    return "클라우드 데이터를 이 기기에 연결했습니다.";
  }
  await uploadCloud(normalizedCode, pin);
  // 서버 저장이 성공한 뒤에만 연결 자격 정보를 남긴다.
  localStorage.setItem(CODE_KEY, normalizedCode);
  localStorage.setItem(PIN_KEY, pin);
  return "이 기기 데이터를 클라우드에 처음 저장했습니다.";
};

export const hasCloudData = async (code: string) => {
  if (!code.trim()) return false;
  return (await getCloud(code)) !== null;
};

export const generateSyncCode = () => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
};

export const getSyncCredentials = () => ({
  code: localStorage.getItem(CODE_KEY) || "",
  pin: localStorage.getItem(PIN_KEY) || "",
});

/** 저장 버튼을 누른 중요한 변경은 다음 자동 주기를 기다리지 않고 즉시 보낸다. */
export const syncLocalChangesNow = async () => {
  const { code, pin } = getSyncCredentials();
  if (!code || !pin) return false;
  try {
    await uploadCloud(code, pin);
    return true;
  } catch (error) {
    window.dispatchEvent(new CustomEvent("ahw-sync-status", {
      detail: error instanceof Error ? error.message : "즉시 동기화에 실패했습니다.",
    }));
    return false;
  }
};

export const disconnectCloud = () => {
  [CODE_KEY, PIN_KEY, HASH_KEY, CLOUD_TIME_KEY].forEach((key) => localStorage.removeItem(key));
};

export const startCloudAutoSync = () => {
  let working = false;
  const run = async () => {
    const { code, pin } = getSyncCredentials();
    if (!code || !pin || working || document.visibilityState === "hidden") return;
    working = true;
    try {
      const cloud = await getCloud(code);
      const localCloudTime = Number(localStorage.getItem(CLOUD_TIME_KEY) || 0);
      if (cloud && cloud.updatedAt > localCloudTime) {
        await downloadCloud(code, pin);
        return;
      }
      const snapshot = collectAppData();
      const currentHash = await digest(snapshot);
      if (!cloud || currentHash !== localStorage.getItem(HASH_KEY)) await uploadCloud(code, pin);
    } catch (error) {
      window.dispatchEvent(new CustomEvent("ahw-sync-status", { detail: error instanceof Error ? error.message : "자동 동기화 실패" }));
    } finally {
      working = false;
    }
  };
  void run();
  // 휴대폰 브라우저는 백그라운드 타이머를 오래 멈출 수 있으므로 짧은 주기와
  // 화면 복귀 이벤트를 함께 사용한다. 변경이 없으면 쓰기 요청은 보내지 않는다.
  const timer = window.setInterval(run, 5000);
  const onVisible = () => { if (document.visibilityState === "visible") void run(); };
  const onResume = () => { void run(); };
  document.addEventListener("visibilitychange", onVisible);
  window.addEventListener("focus", onResume);
  window.addEventListener("pageshow", onResume);
  window.addEventListener("online", onResume);
  return () => {
    window.clearInterval(timer);
    document.removeEventListener("visibilitychange", onVisible);
    window.removeEventListener("focus", onResume);
    window.removeEventListener("pageshow", onResume);
    window.removeEventListener("online", onResume);
  };
};
