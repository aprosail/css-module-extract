import { readdirSync, rmSync } from "node:fs"
import { builtinModules } from "node:module"
import { join } from "node:path"
import { defineConfig } from "rolldown"
import { dts } from "rolldown-plugin-dts"
import { dependencies } from "./package.json"

const root = import.meta.dirname
const out = join(root, "out")

for (const n of readdirSync(out)) rmSync(join(out, n), { recursive: true })
export default defineConfig({
  plugins: [dts({ sourcemap: true })],
  external: [/^node:/g, ...Object.keys(dependencies), ...builtinModules],
  input: ["css"].map((n) => join(root, `src/${n}.ts`)),
  output: { dir: "out", format: "esm", minify: true, sourcemap: true },
})
