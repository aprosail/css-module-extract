import { existsSync } from "node:fs"
import { dirname, join } from "node:path"

function findPackageRootRecursive(dir: string): string | undefined {
  const packageJsonPath = join(dir, "package.json")
  try {
    if (existsSync(packageJsonPath)) return dir
  } catch {
    return undefined
  }

  const parentDir = dirname(dir)
  if (parentDir === dir) return undefined
  return findPackageRootRecursive(parentDir)
}

/**
 * Detects the nearest package root directory containing package.json.
 *
 * 1. When `import.meta.dirname` not available, return undefined.
 * 2. It will find package.json recursively from current dirname to system root.
 * 3. If completely not found, it will also return undefined.
 *
 * @returns dirname of the nearest package.json, and undefined if not found.
 */
export function detectPackageRoot() {
  const root = import.meta.dirname
  if (!root) return undefined
  return findPackageRootRecursive(root)
}

export type CodePosition = {
  file?: string
  line: number
  column: number
}

/**
 * Detect current position of the caller according to its depth.
 *
 * 1. It will create a Error to get stack but won't throw directly.
 * 2. Avoid call such function in production or performance sensitive cases.
 * 3. When cannot get stack, no such depth, it will also throw an error.
 *
 * @param depth The depth of the stack trace to traverse. Default is 2.
 * @returns The code position of the caller.
 */
export function currentPosition(depth: number = 2): CodePosition {
  const stack = new Error().stack
  if (!stack) throw new Error("unable to get mock stack")

  const stackLines = stack.split("\n")

  const targetIndex = depth + 1 // The first line is the error message.
  if (targetIndex >= stackLines.length) {
    throw new Error(`stack depth ${depth} exceeds available stack frames`)
  }

  const stackLine = stackLines[targetIndex].trim()

  // Parse the stack line, format is usually:
  // at functionName (file:line:column) or at file:line:column.
  const match = stackLine.match(/at\s+(.+?)\s+\(?(.+?):(\d+):(\d+)\)?$/)

  if (!match) {
    // If no standard format is matched, try to match the simplified format.
    const simpleMatch = stackLine.match(/at\s+(.+?):(\d+):(\d+)$/)
    if (simpleMatch) {
      return {
        file: simpleMatch[1],
        line: parseInt(simpleMatch[2]),
        column: parseInt(simpleMatch[3]),
      }
    }
    throw new Error(`unable to parse stack line: ${stackLine}`)
  }

  return {
    file: match[2],
    line: parseInt(match[3]),
    column: parseInt(match[4]),
  }
}
