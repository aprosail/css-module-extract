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
