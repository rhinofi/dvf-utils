const BN = require('./BN')
const toBN = require('./toBN')
const precision = require('../config/config').precision

module.exports = (
  price,
  decimalPlaces = precision.amountDecimalPlaces,
  roundingMethod = BN.ROUND_HALF_UP
) => toBN(price).decimalPlaces(
  Math.min(precision.amountDecimalPlaces, decimalPlaces),
  roundingMethod
)
