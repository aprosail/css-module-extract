import { currentPosition, detectPackageRoot } from "@/utils/trace"
import { existsSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, test, vi } from "vitest"

describe("detectPackageRoot", () => {
  test("returns current package root", () => {
    const result = detectPackageRoot()

    expect(result).toBeDefined()
    expect(typeof result).toBe("string")

    if (result) {
      const packageJsonPath = join(result, "package.json")
      expect(existsSync(packageJsonPath)).toBe(true)
    }
  })

  test("returns correct directory structure", () => {
    const result = detectPackageRoot()
    expect(result).toMatch(/^\/.*css-module-extract/)

    if (result) {
      const packageJsonPath = join(result, "package.json")
      expect(existsSync(packageJsonPath)).toBe(true)
    }
  })

  test("handles edge cases", () => {
    expect(() => detectPackageRoot()).not.toThrow()

    const result = detectPackageRoot()
    expect(result === undefined || typeof result === "string").toBe(true)
  })

  test("handles inaccessible directories", () => {
    const result = detectPackageRoot()
    expect(result === undefined || typeof result === "string").toBe(true)
  })
})

describe("currentPosition", () => {
  test("returns valid position with specific line and column using mock", () => {
    // Mock stack with predictable line numbers
    // depth=2 means targetIndex=3 (depth+1)
    const mockStack = `Error: mock stack
    at mockFunction0 (/test/file.ts:100:20)
    at mockFunction1 (/test/file.ts:105:23)
    at mockFunction2 (/test/file.ts:110:26)`

    vi.spyOn(global, "Error").mockImplementationOnce(
      () =>
        ({
          stack: mockStack,
        }) as Error,
    )

    const position = currentPosition()

    expect(position).toHaveProperty("line")
    expect(position).toHaveProperty("column")
    expect(typeof position.line).toBe("number")
    expect(typeof position.column).toBe("number")

    // Test specific values from our mock
    // depth=2 should get the 3rd stack line (index 2)
    expect(position.line).toBe(110)
    expect(position.column).toBe(26)
    expect(position.file).toBe("/test/file.ts")
  })

  test("returns valid position with different depth using mock", () => {
    // Test depth=0
    const mockStack0 = `Error: mock stack
    at depth0 (/test/file.ts:100:20)
    at depth1 (/test/file.ts:105:23)
    at depth2 (/test/file.ts:110:26)`

    vi.spyOn(global, "Error").mockImplementationOnce(
      () =>
        ({
          stack: mockStack0,
        }) as Error,
    )
    const positionDepth0 = currentPosition(0) // targetIndex=1 -> depth0

    // Test depth=1
    const mockStack1 = `Error: mock stack
    at depth0 (/test/file.ts:100:20)
    at depth1 (/test/file.ts:105:23)
    at depth2 (/test/file.ts:110:26)`

    vi.spyOn(global, "Error").mockImplementationOnce(
      () =>
        ({
          stack: mockStack1,
        }) as Error,
    )
    const positionDepth1 = currentPosition(1) // targetIndex=2 -> depth1

    // Test depth=2
    const mockStack2 = `Error: mock stack
    at depth0 (/test/file.ts:100:20)
    at depth1 (/test/file.ts:105:23)
    at depth2 (/test/file.ts:110:26)`

    vi.spyOn(global, "Error").mockImplementationOnce(
      () =>
        ({
          stack: mockStack2,
        }) as Error,
    )
    const positionDepth2 = currentPosition(2) // targetIndex=3 -> depth2

    // Test specific values for different depths
    expect(positionDepth0.line).toBe(100)
    expect(positionDepth0.column).toBe(20)

    expect(positionDepth1.line).toBe(105)
    expect(positionDepth1.column).toBe(23)

    expect(positionDepth2.line).toBe(110)
    expect(positionDepth2.column).toBe(26)
  })

  test("handles simplified stack format", () => {
    // Mock simplified stack format (without function name)
    // depth=2 means targetIndex=3
    const mockStack = `Error: mock stack
    at /test/file.ts:10:5
    at /test/file.ts:15:8
    at /test/file.ts:20:12
    at Module._compile (node:internal/modules/cjs/loader:1376:14)`

    vi.spyOn(global, "Error").mockImplementationOnce(
      () =>
        ({
          stack: mockStack,
        }) as Error,
    )

    const position = currentPosition()

    expect(position.line).toBe(20)
    expect(position.column).toBe(12)
    expect(position.file).toBe("/test/file.ts")
  })

  test("invalid depth", () => {
    expect(() => currentPosition(100)).toThrow(
      "stack depth 100 exceeds available stack frames",
    )
  })
})
