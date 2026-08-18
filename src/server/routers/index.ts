import { router } from "@/server/trpc";
import { docketRouter } from "./docket";
import { clientsRouter } from "./clients";
import { usersRouter } from "./users";
import { calendarRouter } from "./calendar";

export const appRouter = router({
  docket: docketRouter,
  clients: clientsRouter,
  users: usersRouter,
  calendar: calendarRouter,
});

export type AppRouter = typeof appRouter;
