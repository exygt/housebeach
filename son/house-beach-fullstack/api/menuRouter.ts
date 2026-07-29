import crypto from "node:crypto";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { asc, eq } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { menuItems } from "@db/schema";
import { CATEGORIES } from "@contracts/menu";

// --- Simple single-admin auth (username/password -> signed token) ---
const ADMIN_USERNAME = "exxx";
const ADMIN_PASSWORD = "xxxe";
const TOKEN_SECRET = "beach-menu-admin-secret-v1";

function makeToken(username: string): string {
  return crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(`${username}:beach-admin`)
    .digest("hex");
}

function assertAdmin(token: string) {
  if (token !== makeToken(ADMIN_USERNAME)) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Geçersiz oturum" });
  }
}

const priceSchema = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, "Fiyat geçersiz (örn: 250 veya 250.50)");

const itemInput = {
  category: z.enum(CATEGORIES),
  nameTr: z.string().min(1),
  nameEn: z.string().min(1),
  price: priceSchema,
  ingredientsTr: z.string().optional().default(""),
  ingredientsEn: z.string().optional().default(""),
};

export const menuRouter = createRouter({
  // Public: everyone can read the menu
  list: publicQuery.query(async () => {
    return getDb()
      .select()
      .from(menuItems)
      .orderBy(asc(menuItems.sortOrder), asc(menuItems.id));
  }),

  // Admin: login
  login: publicQuery
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(async ({ input }) => {
      if (
        input.username !== ADMIN_USERNAME ||
        input.password !== ADMIN_PASSWORD
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Kullanıcı adı veya şifre hatalı",
        });
      }
      return { token: makeToken(ADMIN_USERNAME) };
    }),

  // Admin: add item
  add: publicQuery
    .input(z.object({ token: z.string(), ...itemInput }))
    .mutation(async ({ input }) => {
      assertAdmin(input.token);
      const db = getDb();
      const [{ id }] = await db
        .insert(menuItems)
        .values({
          category: input.category,
          nameTr: input.nameTr,
          nameEn: input.nameEn,
          price: input.price,
          ingredientsTr: input.ingredientsTr,
          ingredientsEn: input.ingredientsEn,
        })
        .$returningId();
      return db.query.menuItems.findFirst({ where: eq(menuItems.id, id) });
    }),

  // Admin: update item (name / price / ingredients)
  update: publicQuery
    .input(z.object({ token: z.string(), id: z.number(), ...itemInput }))
    .mutation(async ({ input }) => {
      assertAdmin(input.token);
      const db = getDb();
      await db
        .update(menuItems)
        .set({
          category: input.category,
          nameTr: input.nameTr,
          nameEn: input.nameEn,
          price: input.price,
          ingredientsTr: input.ingredientsTr,
          ingredientsEn: input.ingredientsEn,
        })
        .where(eq(menuItems.id, input.id));
      return db.query.menuItems.findFirst({
        where: eq(menuItems.id, input.id),
      });
    }),

  // Admin: delete item
  remove: publicQuery
    .input(z.object({ token: z.string(), id: z.number() }))
    .mutation(async ({ input }) => {
      assertAdmin(input.token);
      await getDb().delete(menuItems).where(eq(menuItems.id, input.id));
      return { ok: true };
    }),
});
