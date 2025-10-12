import { createHash } from "node:crypto"

export type CodePosition = {
  url: string
  line: number
  column: number
}

/**
 * Hash the code position to a short hex string.
 *
 * @param position the code position to hash.
 * @param length the max length of hash code hex, default to 16 (64bit).
 * @param algorithm the hash algorithm, default to "sha256".
 * @returns the hash code of the code position.
 */
export function hashCodePosition(
  position: CodePosition,
  length = 16,
  algorithm = "sha256",
) {
  const hasher = createHash(algorithm)
  hasher.update(position.url)
  hasher.update(position.line.toString())
  hasher.update(position.column.toString())
  return hasher.digest("hex").substring(0, length)
}

/**
 * Get the code position of the caller of corresponding {@link depth}.
 *
 * The {@link depth} is default to 2,
 * which means where the {@link trace} function is called.
 * You may also customize the {@link depth} to get the code position
 * of other depths according to different demands.
 *
 * @param depth the depth of stack trace, default to 2.
 * @returns the code position of the caller of corresponding {@link depth}.
 */
export function trace(depth = 2): CodePosition {
  const stack = new Error().stack
  if (!stack) throw new Error("cannot get stack trace of mock error")

  const stackLines = stack.split("\n")
  // Skip the first line (Error message) and get the line at specified depth.
  // Note: depth 0 is the Error constructor call,
  // depth 1 is the trace() function itself.
  // depth 2 is where trace() was called from (default behavior).
  const targetLine = stackLines[depth]
  if (!targetLine) throw new Error(`stack depth ${depth} is out of bounds`)

  // Parse stack trace line format:
  // "    at functionName (url:line:column)" or
  // "    at url:line:column"
  const match =
    targetLine.match(/at\s+(?:.*\s+)?\((.*):(\d+):(\d+)\)/) ||
    targetLine.match(/at\s+(.*):(\d+):(\d+)/)
  if (!match) throw new Error(`cannot parse stack trace line: ${targetLine}`)

  const [, url, line, column] = match
  return {
    url: url.replace(/^file:\/\//g, ""),
    line: parseInt(line, 10),
    column: parseInt(column, 10),
  }
}

/**
 * Get the hash code of the code position of the caller
 * of corresponding {@link depth}.
 *
 * @param depth the depth of stack trace, default to 3.
 * @param length the max length of hash code hex, default to 16 (64bit).
 * @param algorithm the hash algorithm, default to "sha256".
 * @returns the hash code of the code position.
 */
export function hashPosition({
  depth = 3,
  length = 16,
  algorithm = "sha256",
}: {
  depth?: number
  length?: number
  algorithm?: string
}) {
  return hashCodePosition(trace(depth), length, algorithm)
}
