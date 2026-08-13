import { router } from "@/server/trpc";
import { docketRouter } from "./docket";
import { clientsRouter } from "./clients";
import { usersRouter } from "./users";

export const appRouter = router({
  docket: docketRouter,
  clients: clientsRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
