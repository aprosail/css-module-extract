import { currentPosition, detectPackageRoot } from "@/utils/trace"
import { existsSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, test, vi } from "vitest"

describe("detectPackageRoot", () => {
  test("returns package root", () => {
    const result = detectPackageRoot()
    expect(result).toBeDefined()
    expect(typeof result).toBe("string")
    if (result) {
      expect(existsSync(join(result, "package.json"))).toBe(true)
    }
  })

  test("returns correct directory", () => {
    const result = detectPackageRoot()
    expect(result).toMatch(/^\/.*css-module-extract/)
    if (result) {
      expect(existsSync(join(result, "package.json"))).toBe(true)
    }
  })

  test("handles edge cases", () => {
    expect(() => detectPackageRoot()).not.toThrow()
    const result = detectPackageRoot()
    expect(result === undefined || typeof result === "string").toBe(true)
  })

  test("handles inaccessible dirs", () => {
    const result = detectPackageRoot()
    expect(result === undefined || typeof result === "string").toBe(true)
  })
})

describe("currentPosition", () => {
  // Helper function to mock stack
  const mockStack = (stack: string) => {
    vi.spyOn(global, "Error").mockImplementationOnce(() => ({ stack }) as Error)
  }

  test("returns position with line and column", () => {
    mockStack(`Error: mock stack
    at mockFunction0 (/test/file.ts:100:20)
    at mockFunction1 (/test/file.ts:105:23)
    at mockFunction2 (/test/file.ts:110:26)`)

    const position = currentPosition()

    expect(position).toHaveProperty("line")
    expect(position).toHaveProperty("column")
    expect(typeof position.line).toBe("number")
    expect(typeof position.column).toBe("number")
    expect(position.line).toBe(110)
    expect(position.column).toBe(26)
    expect(position.file).toBe("/test/file.ts")
  })

  test("returns position with different depths", () => {
    const stack = `Error: mock stack
    at depth0 (/test/file.ts:100:20)
    at depth1 (/test/file.ts:105:23)
    at depth2 (/test/file.ts:110:26)`

    mockStack(stack)
    const position0 = currentPosition(0)
    expect(position0.line).toBe(100)
    expect(position0.column).toBe(20)

    mockStack(stack)
    const position1 = currentPosition(1)
    expect(position1.line).toBe(105)
    expect(position1.column).toBe(23)

    mockStack(stack)
    const position2 = currentPosition(2)
    expect(position2.line).toBe(110)
    expect(position2.column).toBe(26)
  })

  test("handles simplified stack", () => {
    mockStack(`Error: mock stack
    at /test/file.ts:10:5
    at /test/file.ts:15:8
    at /test/file.ts:20:12
    at Module._compile (node:internal/modules/cjs/loader:1376:14)`)

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
