const dvfToBfxSymbol = require('./dvfToBfxSymbol')

const testValue = (dvf, bfx) => {
  expect(dvfToBfxSymbol(dvf)).toBe(bfx)
}

describe('dvfToBfxSymbol', () => {
  it('converts Deversifi trading symbol string to Bitfinex trading symbol string', () => {
    testValue('ETH:USDT', 'tETHUST')
    testValue('BTC:USDT', 'tBTCUST')
    testValue('USDC:USDT', 'tUDCUSD')
    testValue('ZRX:ETH', 'tZRXETH')
    testValue('ZRX:USDT', 'tZRXUSD')
    testValue('DUSK:BTC', 'tDUSK:BTC')
    testValue('DUSK:USDT', 'tDUSK:USD')
    testValue('OMG:ETH', 'tOMGETH')
    testValue('OMG:USDT', 'tOMGUSD')
    testValue('NEC:USDT', 'tNECUSD')
  })
})
