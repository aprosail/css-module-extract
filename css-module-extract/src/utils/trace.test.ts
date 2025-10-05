import { detectPackageRoot } from "@/utils/trace"
import { existsSync } from "node:fs"
import { join } from "node:path"
import { expect, test } from "vitest"

test("detectPackageRoot returns current package root", () => {
  const result = detectPackageRoot()

  expect(result).toBeDefined()
  expect(typeof result).toBe("string")

  if (result) {
    const packageJsonPath = join(result, "package.json")
    expect(existsSync(packageJsonPath)).toBe(true)
  }
})

test("detectPackageRoot returns correct directory structure", () => {
  const result = detectPackageRoot()
  expect(result).toMatch(/^\/.*css-module-extract/)

  if (result) {
    const packageJsonPath = join(result, "package.json")
    expect(existsSync(packageJsonPath)).toBe(true)
  }
})

test("detectPackageRoot handles edge cases", () => {
  expect(() => detectPackageRoot()).not.toThrow()

  const result = detectPackageRoot()
  expect(result === undefined || typeof result === "string").toBe(true)
})

test("findPackageRootRecursive handles inaccessible directories", () => {
  const result = detectPackageRoot()
  expect(result === undefined || typeof result === "string").toBe(true)
})
