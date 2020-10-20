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

const testConfigurableDecimals = (amountIn, amountOut, decimalPlaces, rounding) => {
  expect(prepareAmount(amountIn, decimalPlaces, rounding)).toBe(amountOut)
}
const testMaxDecimalsCorrection = (amountIn, amountOut, decimalPlaces) => {
  expect(prepareAmount(amountIn, decimalPlaces)).toBe(amountOut)
}

describe('prepareAmount', () => {
  it('rounds provided number (or numeric string) to 8 decimal points by default, and returns it as a string', () => {
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
  it('decimal place precision can be configured lower than 8', () => {
    testConfigurableDecimals(1, '1', 6)
    testConfigurableDecimals(0.5, '0.5', 6)
    testConfigurableDecimals(0.6, '0.6', 6)
    testConfigurableDecimals(0.00000001, '0', 6)
    testConfigurableDecimals(0.000000001, '0', 6)
    testConfigurableDecimals(0.000000004, '0', 6)
    testConfigurableDecimals(0.0000005, '0.000001', 6)
    testConfigurableDecimals(0.0000006, '0.000001', 6)
  })
  it('rounding method can be configured', () => {
    testConfigurableDecimals(0.000000001, '0', 8, BN.ROUND_FLOOR)
    testConfigurableDecimals(0.000000001, '0.00000001', 8, BN.ROUND_CEIL)
    testConfigurableDecimals(1000000.000000006, '1000000', 8, BN.ROUND_FLOOR)
    testConfigurableDecimals(1000000.000000006, '1000000.00000001', 8, BN.ROUND_CEIL)
  })
  it('rounds provided number to max 8 decimal points if more than 8 was passed', () => {
    testMaxDecimalsCorrection(1, '1', 10)
    testMaxDecimalsCorrection(0.5, '0.5', 10)
    testMaxDecimalsCorrection(0.6, '0.6', 10)
    testMaxDecimalsCorrection(0.00000001, '0.00000001', 11)
    testMaxDecimalsCorrection(0.000000001, '0', 12)
    testMaxDecimalsCorrection(0.000000004, '0', 10)
    testMaxDecimalsCorrection(0.000000005, '0.00000001', 11)
    testMaxDecimalsCorrection(0.000000006, '0.00000001', 12)
    testMaxDecimalsCorrection(1000000.000000006, '1000000.00000001', 12)
  })
})
