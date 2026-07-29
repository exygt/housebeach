import { createRouter, publicQuery } from "./middleware";
import { menuRouter } from "./menuRouter";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  menu: menuRouter,
});

export type AppRouter = typeof appRouter;
