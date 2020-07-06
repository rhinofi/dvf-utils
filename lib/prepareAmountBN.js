const BN = require('./BN')
const toBN = require('./toBN')

module.exports = (price, DECIMAL_PLACES = 8) =>
  toBN(price).decimalPlaces(Math.min(8, DECIMAL_PLACES), BN.ROUND_FLOOR)
