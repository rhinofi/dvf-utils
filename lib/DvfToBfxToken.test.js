const DvfToBfxToken = require('./DvfToBfxToken')

const testValue = (Dvf, Bfx) => {
  expect(DvfToBfxToken(Dvf)).toBe(Bfx)
}

describe('preparePrice', () => {
  it('converts Deversifi token string to Bitfinex token string', () => {
    testValue('USDT', 'USD')
    testValue('USDC', 'UDC')
    testValue('usdt', 'USD')
    testValue('usdc', 'UDC')
  })
})
