import { getTranspiler } from './getTranspiler';
const extMap = {
  'none': [
    '.js',
    '.jsx'
  ],
  // if `allowJs`, need to add js files
  'typescript': [
    '.ts',
    '.tsx'
  ]
}
export function locate(load) {
  const isWindows = this._nodeRequire('is-windows')
  if (isWindows())
    locateForWindows(this, load)
  else
    locateForOtherOS(this, load)

}
function locateForWindows(systemjs, load) {
  // slice(8): trim 'file:///' + 'C:/Users/...'
  const suffix = findMissingFileSuffix(systemjs, load.address.slice(8))
  updateAddressIfNeeded(systemjs, load, suffix)
}
function locateForOtherOS(systemjs, load) {
  // slice(7): trim 'file://' + '/Users/x/y/z'
  const suffix = findMissingFileSuffix(systemjs, load.address.slice(7))
  updateAddressIfNeeded(systemjs, load, suffix)
}
function findMissingFileSuffix(systemjs, givenFilePath) {
  const fs = systemjs._nodeRequire('fs')
  if (fs.existsSync(givenFilePath)) {
    if (fs.statSync(givenFilePath).isDirectory()) {
      const ext = findExtension(fs, getExtensions(systemjs.domtureConfig), givenFilePath + '/index')
      return ext ? '/index' + ext : undefined
    }
    else
      return undefined
  }
  else
    return findExtension(fs, getExtensions(systemjs.domtureConfig), givenFilePath)
}
function findExtension(fs, extensions, filePath) {
  return extensions.find(ext => {
    const path = filePath + ext
    return fs.existsSync(path)
  })
}

function getExtensions(domtureConfig): string[] {
  if (domtureConfig.moduleFileExtensions)
    return domtureConfig.moduleFileExtensions.map(ext => `.${ext}`)
  const transpiler = getTranspiler(domtureConfig)
  return extMap[transpiler]
}

function updateAddressIfNeeded(systemjs, load, suffix) {
  const log = systemjs._nodeRequire('@unional/logging').getLogger('domture')
  if (suffix) {
    const address = load.address + suffix
    log.debug(`locate ${load.address} as ${address}`)
    load.address = address
  }
  else {
    log.debug(`locate ${load.address}`)
  }
}
