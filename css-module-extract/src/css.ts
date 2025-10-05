import { currentPosition, detectPackageRoot } from "@/utils/trace"
import { createHash } from "node:crypto"
import { relative } from "node:path"

export type CssVariable = string

/**
 * Generate a CSS variable with a hash based on the caller's
 * file path and line number. The hash is generated from the relative
 * path (from package root) and line number,
 * then truncated to the first 16 hexadecimal characters of SHA256.
 */
export function cssVariable(): CssVariable {
  const position = currentPosition(2) // depth=2 to get the caller's position

  if (!position.file) throw new Error("unable to determine caller file path")
  const packageRoot = detectPackageRoot()
  let relativePath = position.file

  if (packageRoot) relativePath = relative(packageRoot, position.file)
  const hashInput = `${relativePath}:${position.line}`
  const hash = createHash("sha256").update(hashInput).digest("hex")

  return `unextracted-css-variable: ${hash.substring(0, 16)}`
}
