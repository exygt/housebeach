import {
  mysqlTable,
  serial,
  varchar,
  text,
  decimal,
  int,
  timestamp,
} from "drizzle-orm/mysql-core";

export const menuItems = mysqlTable("menu_items", {
  id: serial("id").primaryKey(),
  category: varchar("category", { length: 50 }).notNull(),
  nameTr: varchar("name_tr", { length: 255 }).notNull(),
  nameEn: varchar("name_en", { length: 255 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  ingredientsTr: text("ingredients_tr"),
  ingredientsEn: text("ingredients_en"),
  sortOrder: int("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = typeof menuItems.$inferInsert;
