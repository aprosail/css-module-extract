export type CodePosition = {
  url: string
  line: number
  column: number
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
  // Skip the first line (Error message) and get the line at specified depth
  // Note: depth 0 is the Error constructor call, depth 1 is the trace() function call
  // depth 2 is where trace() was called from (default behavior)
  const targetLine = stackLines[depth]

  if (!targetLine) {
    throw new Error(`Stack depth ${depth} is out of bounds`)
  }

  // Parse stack trace line format: "    at functionName (url:line:column)" or "    at url:line:column"
  const match =
    targetLine.match(/at\s+(?:.*\s+)?\((.*):(\d+):(\d+)\)/) ||
    targetLine.match(/at\s+(.*):(\d+):(\d+)/)

  if (!match) {
    throw new Error(`Cannot parse stack trace line: ${targetLine}`)
  }

  const [, url, line, column] = match
  return {
    url,
    line: parseInt(line, 10),
    column: parseInt(column, 10),
  }
}
