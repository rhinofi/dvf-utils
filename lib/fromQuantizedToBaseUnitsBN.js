const R = require('ramda')

const toBN = require('./toBN')

module.exports = R.curry((tokenInfo, quantizedAmount) => toBN(quantizedAmount)
  .times(tokenInfo.quantization)
)
