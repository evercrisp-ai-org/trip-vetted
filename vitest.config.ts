import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    testTimeout: 20000,
    hookTimeout: 20000,
    // RLS tests hit a real local Supabase; keep them sequential so
    // fixture users never race each other.
    fileParallelism: false,
  },
});
