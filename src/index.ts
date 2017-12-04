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
  const filePath = getFilePath(isWindows, load.address)

  const fs = this._nodeRequire('fs')
  if (fs.existsSync(filePath)) {
    if (fs.statSync(filePath).isDirectory()) {
      const extensions = getExtensions(this.domtureConfig)
      const ext = extensions.find(ext => {
        const path = `${filePath}/index${ext}`
        return fs.existsSync(path)
      })
      if (ext) {
        const logger = this._nodeRequire('@unional/logging').getLogger('domture')
        const address = load.address
        load.address += `/index${ext}`
        logger.debug(`locate ${address} as ${load.address}`)
      }
    }
  }
  else {
    const extensions = getExtensions(this.domtureConfig)
    const ext = extensions.find(ext => {
      return fs.existsSync(filePath + ext)
    })
    if (ext) {
      const logger = this._nodeRequire('@unional/logging').getLogger('domture')
      const address = load.address
      load.address += ext
      logger.debug(`locate ${address} as ${load.address}`)
    }
  }
}

function getFilePath(isWindows, address: string) {
  // slice(7): trim 'file://' + '/Users/x/y/z'
  // slice(8): trime 'file:///' + 'C:/Users/...'
  // istanbul ignore next
  return isWindows() ? address.slice(8) : address.slice(7)
}

function getExtensions(domtureConfig): string[] {
  if (domtureConfig.moduleFileExtensions)
    return domtureConfig.moduleFileExtensions.map(ext => `.${ext}`)
  const transpiler = domtureConfig.transpiler || 'none'
  return extMap[transpiler]
}
