import { describe, expect, test, vi } from "vitest"
import { trace } from "./hash"

describe("trace function", () => {
  test("throws error when stack is undefined", () => {
    const error = new Error()
    delete (error as any).stack
    vi.spyOn(global, "Error").mockImplementationOnce(() => error)
    expect(() => trace()).toThrow("cannot get stack trace of mock error")
  })

  test("throws error when depth is out of bounds", () => {
    const error = new Error()
    error.stack = "Error: test\n" + "    at file:///test.ts:1:1"
    vi.spyOn(global, "Error").mockImplementationOnce(() => error)
    expect(() => trace(5)).toThrow("Stack depth 5 is out of bounds")
  })

  test("throws error when stack line cannot be parsed", () => {
    const error = new Error()
    error.stack = "Error: test\n" + "    at invalid stack line format"
    vi.spyOn(global, "Error").mockImplementationOnce(() => error)
    expect(() => trace(1)).toThrow(
      "Cannot parse stack trace line:     at invalid stack line format",
    )
  })

  test("parses stack trace with parentheses format", () => {
    const error = new Error()
    error.stack =
      "Error: test\n" +
      "    at Function.trace (file:///src/hash.ts:20:10)\n" +
      "    at Context.<anonymous> (file:///src/hash.test.ts:100:20)"

    vi.spyOn(global, "Error").mockImplementationOnce(() => error)
    const result = trace(2)
    expect(result).toEqual({
      url: "file:///src/hash.test.ts",
      line: 100,
      column: 20,
    })
  })

  test("parses stack trace without parentheses format", () => {
    const error = new Error()
    error.stack =
      "Error: test\n" +
      "    at file:///direct.ts:5:25\n" +
      "    at Module._compile (node:internal/modules/cjs/loader:1376:14)"

    vi.spyOn(global, "Error").mockImplementationOnce(() => error)
    const result = trace(1)
    expect(result).toEqual({
      url: "file:///direct.ts",
      line: 5,
      column: 25,
    })
  })

  test("handles complex stack trace format", () => {
    const error = new Error()
    error.stack =
      "Error: test\n" +
      "    at firstCall (file:///first.ts:1:1)\n" +
      "    at secondCall (file:///second.ts:2:2)\n" +
      "    at thirdCall (file:///third.ts:3:3)"

    vi.spyOn(global, "Error").mockImplementationOnce(() => error)
    const result = trace(1)
    expect(result).toEqual({
      url: "file:///first.ts",
      line: 1,
      column: 1,
    })
  })
})
