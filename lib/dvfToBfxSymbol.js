const R = require('ramda')

const dvfTobfx = require('./DvfToBfxToken')
const MapUSDTSymbol = require('./MapUSDTSymbol')

module.exports = dvfSymbol => {
  const tokens = R.take(2, dvfSymbol.split(':'))
  const bfxTokens = R.map(dvfTobfx, tokens)
  const joiner = bfxTokens[0].length === 3 ? '' : ':'

  return R.compose(
    MapUSDTSymbol,
    R.concat('t'),
    R.join(joiner),
  )(bfxTokens)
}
