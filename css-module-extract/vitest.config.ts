import aliases from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [aliases()],
  test: { include: ["src/**/*.test.ts"] },
})
