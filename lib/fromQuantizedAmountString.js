const R = require('ramda')
const toBN = require('./toBN')

/**
 * Converts quantized amount to decimal token amount based on
 * given quantization and decimals
 */

module.exports = R.curry(
  ({ quantization = 1, decimals = 1 }, quantizedAmount) =>
    toBN(quantizedAmount)
      .times(quantization)
      .shiftedBy(-1 * decimals)
      .toString()
)
