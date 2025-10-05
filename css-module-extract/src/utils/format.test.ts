import { formatTemplate } from "@/utils/format"
import { describe, expect, test } from "vitest"

// Helper to mock template literal like: `xxx ${xxx} xxx`.
function mockTemplate(strings: TemplateStringsArray, ...args: unknown[]) {
  return formatTemplate(strings, ...args)
}

describe("formatTemplate", () => {
  test("combines template and args alternately", () => {
    const result = mockTemplate`Hello ${"John"}, welcome to ${"TypeScript"}!`
    expect(result).toBe("Hello John, welcome to TypeScript!")
  })

  test("handles empty template", () => {
    const result = mockTemplate``
    expect(result).toBe("")
  })

  test("handles template with no args", () => {
    const result = mockTemplate`Hello world!`
    expect(result).toBe("Hello world!")
  })

  test("handles more args than template parts", () => {
    const result = mockTemplate`Hello ${"John"}!${" and "}${"more"}`
    expect(result).toBe("Hello John! and more")
  })

  test("handles more template parts than args", () => {
    const result = mockTemplate`Hello ${"John"}, welcome to !`
    expect(result).toBe("Hello John, welcome to !")
  })

  test("converts args to string", () => {
    const result = mockTemplate`Value: ${42}, Count: ${3.14}`
    expect(result).toBe("Value: 42, Count: 3.14")
  })

  test("handles complex types in args", () => {
    const obj = { name: "test" }
    const arr = [1, 2, 3]
    const result = mockTemplate`Object: ${obj}, Array: ${arr}`
    expect(result).toBe("Object: [object Object], Array: 1,2,3")
  })

  test("handles null and undefined args", () => {
    const result = mockTemplate`Value: ${null}, Undefined: ${undefined}`
    expect(result).toBe("Value: null, Undefined: undefined")
  })

  test("handles multiple interpolations", () => {
    const result = mockTemplate`${1} + ${2} = ${3}`
    expect(result).toBe("1 + 2 = 3")
  })

  test("preserves whitespace and formatting", () => {
    const result = mockTemplate`  Hello ${"world"}  
    This is ${"test"}  `
    expect(result).toBe("  Hello world  \n    This is test  ")
  })
})
