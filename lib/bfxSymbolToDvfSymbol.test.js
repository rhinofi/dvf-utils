const bfxSymbolToDvfSymbol = require('./bfxSymbolToDvfSymbol')

const allTokens = ['ETH', 'USDT', 'ZRX', 'BTC', 'MKR', 'LOOM', 'XAUT']

const testValue = (bfxSymbols, dvfSymbols) => {
  expect(bfxSymbolToDvfSymbol(bfxSymbols, allTokens)).toStrictEqual(dvfSymbols)
}

describe('preparePrice', () => {
  it('converts Bitfinex symbols array to to Deversifi symbols array', () => {
    const bfxSymbols = [
      'tETHUSD',
      'tZRXUSD',
      'tZRXETH',
      'tBTCUSD',
      'tMKRUSD',
      'tMKRETH'
    ]
    const expectedDvfSymbols = [
      'ETH:USDT',
      'ZRX:USDT',
      'ZRX:ETH',
      'BTC:USDT',
      'MKR:USDT',
      'MKR:ETH'
    ]
    testValue(bfxSymbols, expectedDvfSymbols)
  })
})
