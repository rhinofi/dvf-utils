const BN = require('./BN')
const toBN = require('./toBN')

const defaultAndMaxDecimalPlaces = 8

module.exports = (
  price,
  decimalPlaces = defaultAndMaxDecimalPlaces,
  roundingMethod = BN.ROUND_HALF_UP,
) =>
  toBN(price).decimalPlaces(
    Math.min(defaultAndMaxDecimalPlaces, decimalPlaces),
    roundingMethod,
  )
