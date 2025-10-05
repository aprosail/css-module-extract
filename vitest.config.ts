import { defineConfig } from "vitest/config"

const repos: string[] = ["css-module-extract"]

export default defineConfig({
  test: { projects: [...repos] },
})
