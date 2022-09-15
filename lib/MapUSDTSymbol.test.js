const MapUSDTSymbol = require('./MapUSDTSymbol')

const testValue = (value, correctedValue) => {
  expect(MapUSDTSymbol(value)).toBe(correctedValue)
}

describe('MapUSDTSymbol', () => {
  it('converts USD to UST symbols for ETH and BTC base pairs', () => {
    testValue('ETH:UST', 'ETH:USDT')
    testValue('ETH:MKR', 'ETH:MKR')
    testValue('tETHBTC', 'tETHBTC')
    testValue('tZRXUST', 'tZRXUST')
    testValue('BTC:UST', 'BTC:USDT')
    testValue('BTC:MKR', 'BTC:MKR')
    testValue('tBTCETH', 'tBTCETH')
    testValue('tZRXUST', 'tZRXUST')
  })
})
