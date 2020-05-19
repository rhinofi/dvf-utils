const preparePrice = require('./preparePrice')
const BN = require('./BN')

const bfxUtils = require('bfx-api-node-util')

const assertConsitentWithBfx = price => {
  expect(preparePrice(price)).toBe(
    BN(bfxUtils.preparePrice(price)).toString()
  )
}

const testValue = (priceIn, priceOut) => {
  expect(preparePrice(priceIn)).toBe(priceOut)
  assertConsitentWithBfx(priceIn)
}

describe('preparePrice', () => {
  it('rounds provided number (or numeric string) to 8 decimal points, and returns it as a string', () => {
    testValue(1, '1')
    testValue(0.5, '0.5')
    testValue(0.6, '0.6')
    testValue(12.3454, '12.345')
    testValue(12.3455, '12.345')
    testValue(12.3456, '12.346')
    testValue(123456, '123460')
    testValue(0.00123456, '0.0012346')
  })
})
