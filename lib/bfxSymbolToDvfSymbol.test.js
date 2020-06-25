const bfxSymbolToDvfSymbol = require('./bfxSymbolToDvfSymbol')

const allTokens = ['ETH', 'USDT', 'ZRX', 'BTC', 'MKR', 'LOOM', 'XAUT', 'DUSK', 'OMG', 'NEC']

const testValue = (bfxSymbols, dvfSymbols) => {
  expect(bfxSymbolToDvfSymbol(bfxSymbols, allTokens)).toStrictEqual(dvfSymbols)
}

describe('bfxSymbolToDvfSymbol', () => {
  it('converts Bitfinex symbols array to to Deversifi symbols array', () => {
    const bfxSymbols = [
      'tETHUSD',
      'tZRXUSD',
      'tZRXETH',
      'tBTCUSD',
      'tMKRUSD',
      'tMKRETH',
      'tDUSK:BTC',
      'tDUSK:USD'
    ]
    const expectedDvfSymbols = [
      'ETH:USDT',
      'ZRX:USDT',
      'ZRX:ETH',
      'BTC:USDT',
      'MKR:USDT',
      'MKR:ETH',
      'DUSK:BTC',
      'DUSK:USDT'
    ]
    testValue(bfxSymbols, expectedDvfSymbols)
  })
})
