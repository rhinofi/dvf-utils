const prepareAmount = require('./prepareAmount')
const BN = require('./BN')

const bfxUtils = require('bfx-api-node-util')

const assertConsitentWithBfx = price => {
  expect(prepareAmount(price)).toBe(
    BN(bfxUtils.prepareAmount(price)).toString()
  )
}

const testValue = (priceIn, priceOut) => {
  expect(prepareAmount(priceIn)).toBe(priceOut)
  assertConsitentWithBfx(priceIn)
}

describe('prepareAmount', () => {
  it('rounds provided number (or numeric string) to 8 decimal points, and returns it as a string', () => {
    testValue(1, '1')
    testValue(0.5, '0.5')
    testValue(0.6, '0.6')
    testValue(0.00000001, '0.00000001')
    testValue(0.000000001, '0')
    testValue(0.000000004, '0')
    testValue(0.000000005, '0.00000001')
    testValue(0.000000006, '0.00000001')
    testValue(1000000.000000006, '1000000.00000001')
  })
})
