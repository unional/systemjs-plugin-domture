export function getTranspiler(domtureConfig): 'typescript' | 'none' {
  return domtureConfig.transpiler || 'none'
}
