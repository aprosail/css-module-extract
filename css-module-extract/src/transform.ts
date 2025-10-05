import { Encoding } from "node:crypto"
import { readFileSync } from "node:fs"

export type TransformOptions = {
  encoding?: Encoding
}

export type TransformResult = {
  code: string
  css?: string
}

export default function (
  file: string,
  code?: string,
  options?: TransformOptions,
): TransformResult {
  const sourceCode = code || readFileSync(file, options?.encoding || "utf8")

  // Placeholder.
  return { code: sourceCode }
}
