/**
 * gencow/schema.ts — Admin Tool 스키마
 *
 * 🔓 관리자 전용 앱 — 인증 없이 전체 데이터 접근
 * filter: () => true 로 모든 데이터를 공개합니다.
 *
 * 변경 후: gencow dev가 자동 반영
 */
import { pgTable } from "drizzle-orm/pg-core";
import { serial, text, timestamp } from "drizzle-orm/pg-core";

// 관리자 전용 — 인증 없이 전체 접근
export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").default("todo").notNull(),
  priority: text("priority").default("medium").notNull(),
  assignee: text("assignee"),
  dueDate: text("due_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
