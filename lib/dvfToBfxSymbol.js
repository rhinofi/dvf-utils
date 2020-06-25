const dvfTobfx = require('./DvfToBfxToken')
const MapUSDTSymbol = require('./MapUSDTSymbol')
const { mappingExeptions } = require('../config/config')

module.exports = dvfSymbol => {
  dvfSymbol = dvfSymbol.split(':')
  let bfxSymbol = 't' + dvfTobfx(dvfSymbol[0]) + dvfTobfx(dvfSymbol[1])
  bfxSymbol = MapUSDTSymbol(bfxSymbol)
  return mappingExeptions[bfxSymbol] || bfxSymbol
}
