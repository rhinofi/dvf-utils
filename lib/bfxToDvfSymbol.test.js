const bfxToDvfSymbol = require('./bfxToDvfSymbol')

const testValue = (bfx, dvf) => {
  expect(bfxToDvfSymbol(bfx)).toBe(dvf)
}

const testingPairs = [
  ['tETHUST', 'ETH:USDT'],
  ['tBTCUST', 'BTC:USDT'],
  ['tUDCUSD', 'USDC:USDT'],
  ['tZRXETH', 'ZRX:ETH'],
  ['tZRXUSD', 'ZRX:USDT'],
  ['tDUSK:BTC', 'DUSK:BTC'],
  ['tDUSK:USD', 'DUSK:USDT'],
  ['tOMGETH', 'OMG:ETH'],
  ['tOMGUSD', 'OMG:USDT'],
  ['tNECUSD', 'NEC:USDT'],
  ['tLINK:UST', 'LINK:USDT'],
  ['tCOMP:UST', 'COMP:USDT'],
  ['tUNIUST', 'UNI:USDT'],
  ['tYFIUST', 'YFI:USDT'],
  ['t1INCH:UST', '1INCH:USDT'],
  ['tMATIC:UST', 'MATIC:USDT'],
  ['tAAVE:UST', 'AAVE:USDT'],
  ['tSPELL:UST', 'SPELL:USDT'],
  ['tMNAUSD', 'MANA:USDT'],
  ['tCRVUST', 'CRV:USDT']
]

describe('bfxToDvfSymbol', () => {
  testingPairs.forEach(([bfx, dvf]) => {
    it(`converts Bitfinex trading symbol string (${bfx}) to Deversifi trading symbol string (${dvf})`, () => {
      testValue(bfx, dvf)
    })
  })
})
