const BN = require('./BN')
const toBN = require('./toBN')
const precision = require('../config/config').precision

module.exports = price => toBN(price)
  .precision(precision.priceSignificantDigits, BN.ROUND_HALF_DOWN)
