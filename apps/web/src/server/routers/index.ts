import { router } from "@/server/trpc";
import { docketRouter } from "./docket";

export const appRouter = router({
  docket: docketRouter,
});

export type AppRouter = typeof appRouter;
