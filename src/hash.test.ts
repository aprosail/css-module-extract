import { trace } from "@/hash"
import { mockCallerPosition, mockFilePath, mockPosition } from "@/hash.mock"
import { describe, expect, test, vi } from "vitest"

describe("parse trace stack", () => {
  test("throw: stack undefined", () => {
    const error = new Error()
    delete (error as any).stack
    vi.spyOn(global, "Error").mockImplementationOnce(() => error)
    expect(() => trace()).toThrow("cannot get stack trace of mock error")
  })

  test("throws: depth out of bounds", () => {
    const error = new Error()
    error.stack = "Error: test\n" + "    at file:///test.ts:1:1"
    vi.spyOn(global, "Error").mockImplementationOnce(() => error)
    expect(() => trace(5)).toThrow("stack depth 5 is out of bounds")
  })

  test("throws: stack line cannot be parsed", () => {
    const error = new Error()
    error.stack = "Error: test\n" + "    at invalid stack line format"
    vi.spyOn(global, "Error").mockImplementationOnce(() => error)
    expect(() => trace(1)).toThrow(
      "cannot parse stack trace line:     at invalid stack line format",
    )
  })

  test("parentheses format", () => {
    const error = new Error()
    error.stack =
      "Error: test\n" +
      "    at Function.trace (file:///src/hash.ts:20:10)\n" +
      "    at Context.<anonymous> (file:///src/hash.test.ts:100:20)"

    vi.spyOn(global, "Error").mockImplementationOnce(() => error)
    const result = trace(2)
    expect(result).toEqual({ url: "/src/hash.test.ts", line: 100, column: 20 })
  })

  test("no parentheses format", () => {
    const error = new Error()
    error.stack =
      "Error: test\n" +
      "    at file:///direct.ts:5:25\n" +
      "    at Module._compile (node:internal/modules/cjs/loader:1376:14)"

    vi.spyOn(global, "Error").mockImplementationOnce(() => error)
    const result = trace(1)
    expect(result).toEqual({ url: "/direct.ts", line: 5, column: 25 })
  })

  test("complex format", () => {
    const error = new Error()
    error.stack =
      "Error: test\n" +
      "    at firstCall (file:///first.ts:1:1)\n" +
      "    at secondCall (file:///second.ts:2:2)\n" +
      "    at thirdCall (file:///third.ts:3:3)"

    vi.spyOn(global, "Error").mockImplementationOnce(() => error)
    const result = trace(1)
    expect(result).toEqual({ url: "/first.ts", line: 1, column: 1 })
  })

  test("mock file test", () => {
    expect(mockPosition).toEqual({ url: mockFilePath, line: 8, column: 29 })
    expect(mockCallerPosition).toEqual({
      url: mockFilePath,
      line: 9,
      column: 35,
    })
  })
})
