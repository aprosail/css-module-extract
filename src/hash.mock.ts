// Don't modify this file with position information.
// Or you need to manually update all position comments inside this function,
// and all position data inside the corresponding test file (./hash.test.ts).

import { trace } from "@/hash"

export const mockFilePath = import.meta.url.replace(/^file:\/\//g, "")
export const mockPosition = trace() // Line 8, column 29.
export const mockCallerPosition = traceCaller() // Line 19, column 35.

export function traceCaller() {
  return trace(3)
}
