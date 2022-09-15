const BN = require('./BN')
const toBN = require('./toBN')
const SIGNIFICANT_DIGITS = 5

module.exports = price =>
  toBN(price)
    .precision(SIGNIFICANT_DIGITS, BN.ROUND_HALF_DOWN)
