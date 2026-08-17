/**
 * gencow/items.ts — Item CRUD (관리자 전용, Zero-Boilerplate)
 *
 * 🔓 인증 불필요 — allowAnonymous: true 로 모든 접근 허용
 */
import { createCrud } from "./runtime";
import { items } from "./schema";

// 자동 생성: list, get, create, update, remove (인증 없음, realtime push 포함)
export const itemsCrud = createCrud(items, {
  allowAnonymous: true,
});

export const { list, get, create, update, remove } = itemsCrud;
