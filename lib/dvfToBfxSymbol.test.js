const dvfToBfxSymbol = require('./dvfToBfxSymbol')

const testValue = (dvf, bfx) => {
  expect(dvfToBfxSymbol(dvf)).toBe(bfx)
}

const testingPairs = [
  ['ETH:USDT', 'tETHUST'],
  ['BTC:USDT', 'tBTCUST'],
  ['SUSHI:USDT', 'tSUSHI:UST'],
  ['USDC:USDT', 'tUDCUST'],
  ['ZRX:ETH', 'tZRXETH'],
  ['ZRX:USDT', 'tZRXUSD'],
  ['DUSK:BTC', 'tDUSK:BTC'],
  ['DUSK:USDT', 'tDUSK:USD'],
  ['OMG:ETH', 'tOMGETH'],
  ['OMG:USDT', 'tOMGUSD'],
  ['NEC:USDT', 'tNECUSD'],
  ['LINK:USDT', 'tLINK:UST'],
  ['COMP:USDT', 'tCOMP:UST'],
  ['UNI:USDT', 'tUNIUST'],
  ['YFI:USDT', 'tYFIUST'],
  ['ETH:USDC', 'tETHUST'],
  ['BTC:USDC', 'tBTCUST'],
  ['1INCH:USDT', 't1INCH:UST'],
  ['MATIC:USDT', 'tMATIC:UST'],
  ['AAVE:USDT', 'tAAVE:UST'],
  ['SPELL:USDT', 'tSPELL:USD'],
  ['MANA:USDT', 'tMNAUSD'],
  ['CRV:USDT', 'tCRVUST'],
]

describe('dvfToBfxSymbol', () => {
  testingPairs.forEach(([dvf, bfx]) => {
    it(`converts Deversifi trading symbol string (${dvf}) to Bitfinex trading symbol string (${bfx})`, () => {
      testValue(dvf, bfx)
    })
  })
})
