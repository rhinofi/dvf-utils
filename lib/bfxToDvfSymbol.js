const bfxToDvf = require('./BfxToDvfToken')
const MapUSDTSymbol = require('./MapUSDTSymbol')

module.exports = bfxSymbol => {
  bfxSymbol = bfxSymbol.replace('t', '')
  if (bfxSymbol.indexOf(':') >= 0) {
    bfxSymbol = bfxSymbol.split(':')
  } else {
    bfxSymbol = [bfxSymbol.slice(0, 3), bfxSymbol.slice(3)]
  }
  const dvfSymbol = `${bfxToDvf(bfxSymbol[0])}:${bfxToDvf(bfxSymbol[1])}`
  return MapUSDTSymbol(dvfSymbol)
}
