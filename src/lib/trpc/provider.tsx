"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "./client";
import { createClient } from "@/lib/supabase/client";

const queryClient = new QueryClient();

function createTRPCClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: `${process.env.NEXT_PUBLIC_APP_URL}/api/trpc`,
        async headers() {
          // Get the current user ID from Supabase and send it to the server
          const supabase = createClient();
          const {
            data: { session },
          } = await supabase.auth.getSession();

          const headers: Record<string, string> = {};
          if (session?.user?.id) {
            headers["x-user-id"] = session.user.id;
          }
          return headers;
        },
      }),
    ],
  });
}

export function TrpcProvider({ children }: { children: ReactNode }) {
  const [trpcClient] = useState(() => createTRPCClient());

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
