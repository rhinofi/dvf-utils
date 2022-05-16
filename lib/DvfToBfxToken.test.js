const DvfToBfxToken = require('./DvfToBfxToken')

const testValue = (Dvf, Bfx) => {
  expect(DvfToBfxToken(Dvf)).toBe(Bfx)
}

describe('DvfToBfxToken', () => {
  it('converts Deversifi token string to Bitfinex token string', () => {
    testValue('USDT', 'USD')
    testValue('USDC', 'UDC')
    testValue('MANA', 'MNA')
    testValue('usdt', 'USD')
    testValue('usdc', 'UDC')
    testValue('mana', 'MNA')
  })
})
