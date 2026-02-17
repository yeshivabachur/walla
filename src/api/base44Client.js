import { createClient } from "@base44/sdk";
import { env } from "@/env";

/**
 * Base44 client: keep as a singleton.
 * We require auth for user-scoped operations; Base44 handles token storage/refresh internally.
 */
export const base44 = createClient({
  appId: env.VITE_BASE44_APP_ID,
  requiresAuth: true,
  options: {
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error("[Base44] SDK error:", error);
    },
  },
});
