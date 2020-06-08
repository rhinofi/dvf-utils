const BfxToDvfToken = require('./BfxToDvfToken')

const testValue = (Bfx, Dvf) => {
  expect(BfxToDvfToken(Bfx)).toBe(Dvf)
}

describe('BfxToDvfToken', () => {
  it('converts Bitfinex token string to Deversifi token string', () => {
    testValue('USD', 'USDT')
    testValue('UDC', 'USDC')
    testValue('udc', 'USDC')
    testValue('Usd', 'USDT')
  })
})
