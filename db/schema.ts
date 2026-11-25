import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/mysql-core";

export const sourceRequests = mysqlTable("source_requests", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  contact: varchar("contact", { length: 180 }).notNull(),
  comment: text("comment"),
  status: mysqlEnum("status", ["new", "contacted", "closed"]).notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type SourceRequest = typeof sourceRequests.$inferSelect;
export type InsertSourceRequest = typeof sourceRequests.$inferInsert;
