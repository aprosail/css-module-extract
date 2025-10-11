import aliases from "tsconfig-aliases"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: { alias: aliases() },
  test: { include: ["src/**/*.test.ts"] },
})
