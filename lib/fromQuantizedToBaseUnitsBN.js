const R = require('ramda')

const toBN = require('./toBN')

module.exports = R.curry((tokenInfo, quantizedAount) => toBN(quantizedAount)
  .times(tokenInfo.quantization)
)
