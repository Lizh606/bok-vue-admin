export const getCssVar = (type: string, name: string, prefix = "wanyue") => {
  return `var(--${prefix}-${type}-${name})`
}
