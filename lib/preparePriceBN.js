const BN = require('./BN')
const toBN = require('./toBN')
const significantDigits = require('../config/config').decimalSpaces

module.exports = price => toBN(price)
  .precision(significantDigits.price, BN.ROUND_HALF_DOWN)
