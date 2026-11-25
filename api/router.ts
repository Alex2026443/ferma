import { createRouter, publicQuery } from "./middleware";
import { sourceRequestRouter } from "./sourceRequestRouter";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  sourceRequests: sourceRequestRouter,
});

export type AppRouter = typeof appRouter;
