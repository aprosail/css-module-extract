import { cssVariable } from "@/css/variable"
import { describe, expect, test, vi } from "vitest"

describe("cssVariable", () => {
  // Helper function to mock stack
  const mockStack = (stack: string) => {
    vi.spyOn(global, "Error").mockImplementationOnce(() => ({ stack }) as Error)
  }

  // Common stack patterns
  const standardStack = `Error: mock stack
    at mockFunction0 (/test/file.ts:100:20)
    at mockFunction1 (/test/file.ts:105:23)
    at mockFunction2 (/test/file.ts:110:26)
    at cssVariable (/css-module-extract/src/css/variable.ts:15:10)`

  const differentLineStack = `Error: mock stack
    at mockFunction0 (/test/file.ts:100:20)
    at mockFunction1 (/test/file.ts:105:23)
    at mockFunction2 (/test/file.ts:120:26)
    at cssVariable (/css-module-extract/src/css/variable.ts:15:10)`

  const relativePathStack = `Error: mock stack
    at mockFunction0 (/test/file.ts:100:20)
    at mockFunction1 (/test/file.ts:105:23)
    at mockFunction2 (/css-module-extract/src/test/file.ts:110:26)
    at cssVariable (/css-module-extract/src/css/variable.ts:15:10)`

  const simplifiedStack = `Error: mock stack
    at /test/file.ts:10:5
    at /test/file.ts:15:8
    at /test/file.ts:20:12
    at /css-module-extract/src/css/variable.ts:15:10`

  test("generates hash from caller position", () => {
    mockStack(standardStack)
    const result = cssVariable()
    expect(result).toMatch(/^unextracted-css-variable: [a-f0-9]{16}$/)
    expect(result).not.toBe("unextracted-css-variable: hash")
  })

  test("generates consistent hash for same position", () => {
    mockStack(standardStack)
    const result1 = cssVariable()
    mockStack(standardStack)
    const result2 = cssVariable()
    expect(result1).toBe(result2)
  })

  test("generates different hash for different positions", () => {
    mockStack(standardStack)
    const result1 = cssVariable()
    mockStack(differentLineStack)
    const result2 = cssVariable()
    expect(result1).not.toBe(result2)
  })

  test("handles relative path calculation", () => {
    mockStack(relativePathStack)
    const result = cssVariable()
    expect(result).toMatch(/^unextracted-css-variable: [a-f0-9]{16}$/)
  })

  test("handles simplified stack format", () => {
    mockStack(simplifiedStack)
    const result = cssVariable()
    expect(result).toMatch(/^unextracted-css-variable: [a-f0-9]{16}$/)
  })

  test("generates 16-character hex hash", () => {
    mockStack(standardStack)
    const result = cssVariable()
    const hash = result.replace("unextracted-css-variable: ", "")
    expect(hash).toHaveLength(16)
    expect(hash).toMatch(/^[a-f0-9]{16}$/)
  })
})
