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
  const startTime = new Date().getTime()
  const suffix = findMissingFileSuffix(this, getFilePath(load.address))

  const log = this._nodeRequire('@unional/logging').getLogger('domture')

  if (suffix) {
    const address = load.address + suffix
    load.address = address
    log.debug(`locate ${load.address} as ${address} (${new Date().getTime() - startTime})`)
    return address
  }

  log.debug(`locate ${load.address} (${new Date().getTime() - startTime})`)
}

function getFilePath(address) {
  const rawPath = address.slice(8)

  // for windows:
  // file:///C:/Users/...
  // for others:
  // file:///Users/...
  return rawPath[1] === ':' ? rawPath : '/' + rawPath
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
