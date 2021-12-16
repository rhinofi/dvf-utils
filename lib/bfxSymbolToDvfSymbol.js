const R = require('ramda')

let dvfTokens

const convertSymbol = (symbol) => {
  let newSymbol = ''
  dvfTokens.map((t) => {
    newSymbol =
      symbol.indexOf(t) > 0
        ? symbol.substr(0, symbol.indexOf(t)) + ':' + t
        : newSymbol
  })
  return newSymbol
}

const bfxSymbolToDvfSymbol = R.pipe(
  R.map(R.replace(/^t/, '')),
  R.map(R.replace(':', '')),
  R.map(R.replace('USD', 'USDT')),
  R.map(R.replace('UST', 'USDT')),
  R.map(R.replace('UDC', 'USDC')),
  R.map(R.replace('TT', 'T')),
  R.map(R.replace('MNA', 'MANA')),
  R.map(convertSymbol)
)

module.exports = (symbols, allTokens) => {
  dvfTokens = allTokens

  return bfxSymbolToDvfSymbol(symbols)
}
