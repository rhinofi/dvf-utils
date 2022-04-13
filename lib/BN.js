/**
 * @type { import('bignumber.js/bignumber').BigNumber.Constructor }
 */
const BigNumber = require('bignumber.js')

BigNumber.config({
  DECIMAL_PLACES: 50,
  ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
  EXPONENTIAL_AT: 50
})

module.exports = BigNumber
