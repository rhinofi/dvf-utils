const bfxToDvfSymbol = require('dvf-utils/lib/bfxToDvfSymbol')

const testValue = (dvf, bfx) => {
  expect(bfxToDvfSymbol(dvf)).toBe(bfx)
}

describe('bfxToDvfSymbol', () => {
  it('converts Bitfinex trading symbol string to Deversifi trading symbol string', () => {
    testValue('tETHUST', 'ETH:USDT')
    testValue('tBTCUST', 'BTC:USDT')
    testValue('tUDCUSD', 'USDC:USDT')
    testValue('tZRXETH', 'ZRX:ETH')
    testValue('tZRXUSD', 'ZRX:USDT')
    testValue('tDUSK:BTC', 'DUSK:BTC')
    testValue('tDUSK:USD', 'DUSK:USDT')
    testValue('tOMGETH', 'OMG:ETH')
    testValue('tOMGUSD', 'OMG:USDT')
    testValue('tNECUSD', 'NEC:USDT')
  })
})
