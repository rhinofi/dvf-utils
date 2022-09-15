const R = require('ramda')

const convertSymbol = dvfTokens => symbol => {
  let newSymbol = ''
  dvfTokens.forEach(t => {
    const indexOfToken = symbol.indexOf(t)
    newSymbol = indexOfToken > 0
      ? `${symbol.substr(0, indexOfToken)}:${t}`
      : newSymbol
  })
  return newSymbol
}

const bfxSymbolToDvfSymbol = dvfTokens =>
  R.pipe(
    R.map(R.replace(/^t/, '')),
    R.map(R.replace(':', '')),
    R.map(R.replace('USD', 'USDT')),
    R.map(R.replace('UST', 'USDT')),
    R.map(R.replace('UDC', 'USDC')),
    R.map(R.replace('TT', 'T')),
    R.map(R.replace('MNA', 'MANA')),
    R.map(convertSymbol(dvfTokens)),
  )

module.exports = (symbols, allTokens) =>
  bfxSymbolToDvfSymbol(allTokens)(symbols)
