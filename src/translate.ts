import { getTranspiler } from './getTranspiler'

export function translate(load) {
  const transpiler = getTranspiler(this.domtureConfig)
  if (transpiler === 'none') return load.source

  return this.import('plugin-typescript')
    .then(tsplugin => {
      return tsplugin.translate.call(this, load)
    })
}
