const BN = require('./BN')
const toBN = require('./toBN')
const significantDigits = require('../config/config').significantDigits

module.exports = (
  price,
  decimalPlaces = significantDigits.amount,
  roundingMethod = BN.ROUND_HALF_UP
) => toBN(price).decimalPlaces(
  Math.min(significantDigits.amount, decimalPlaces),
  roundingMethod
)
