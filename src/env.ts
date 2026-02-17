import { z } from "zod";

/**
 * Centralized, type-safe environment parsing.
 * Keep this minimal and expand as services are added.
 */
const EnvSchema = z.object({
  VITE_BASE44_APP_ID: z.string().min(1, "VITE_BASE44_APP_ID is required"),
});

export type AppEnv = z.infer<typeof EnvSchema>;

function parseEnv(): AppEnv {
  // `import.meta.env` is populated by Vite at build/runtime.
  const parsed = EnvSchema.safeParse(import.meta.env);
  if (!parsed.success) {
    // Fail fast during development and CI: missing envs cause non-obvious runtime failures.
    // eslint-disable-next-line no-console
    console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables. Check .env / deployment config.");
  }
  return parsed.data;
}

export const env: AppEnv = parseEnv();
