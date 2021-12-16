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
      'tDUSK:USD',
      't1INCH:UST',
      'tMATIC:UST',
      'tAAVE:UST',
      'tSPELL:UST',
      'tMNAUSD',
      'tCRVUST'
    ]
    const expectedDvfSymbols = [
      'ETH:USDT',
      'ZRX:USDT',
      'ZRX:ETH',
      'BTC:USDT',
      'MKR:USDT',
      'MKR:ETH',
      'DUSK:BTC',
      'DUSK:USDT',
      '1INCH:USDT',
      'MATIC:USDT',
      'AAVE:USDT',
      'SPELL:USDT',
      'MANA:USDT',
      'CRV:USDT'
    ]
    testValue(bfxSymbols, expectedDvfSymbols)
  })
})
