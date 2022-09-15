const dvfTobfx = require('./DvfToBfxToken')
const MapUSDTSymbol = require('./MapUSDTSymbol')

module.exports = dvfSymbol => {
  dvfSymbol = dvfSymbol.split(':')
  const joiner = dvfTobfx(dvfSymbol[0]).length === 3 ? '' : ':'
  const bfxSymbol = 't'
    + dvfTobfx(dvfSymbol[0])
    + joiner
    + dvfTobfx(dvfSymbol[1])
  return MapUSDTSymbol(bfxSymbol)
}
