export function formatTemplate(
  template: TemplateStringsArray,
  ...args: unknown[]
) {
  const parts: string[] = []
  for (let i = 0; i < template.length; i++) {
    parts.push(template[i])
    if (i < args.length) parts.push(String(args[i]))
  }
  return parts.join("")
}
