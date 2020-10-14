const bfxToDvfSymbol = require('dvf-utils/lib/bfxToDvfSymbol')

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
  ['tYFIUST', 'YFI:USDT']
]

describe('bfxToDvfSymbol', () => {
  testingPairs.forEach(([bfx, dvf]) => {
    it(`converts Bitfinex trading symbol string (${bfx}) to Deversifi trading symbol string (${dvf})`, () => {
      testValue(bfx, dvf)
    })
  })
})
