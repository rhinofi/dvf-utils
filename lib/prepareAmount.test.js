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
  it('rounds provided number (or numeric string) to 6 decimal points, and returns it as a string', () => {
    testValue(1, '1')
    testValue(0.5, '0.5')
    testValue(0.6, '0.6')
    testValue(0.000001, '0.000001')
    testValue(0.000000001, '0')
    testValue(0.000000004, '0')
    testValue(0.0000005, '0.000001')
    testValue(0.0000006, '0.000001')
    testValue(1000000.0000006, '1000000.000001')
  })
})
