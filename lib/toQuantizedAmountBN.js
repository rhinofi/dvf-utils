/*
Converts token amount to quantised amount based on given quantization
and decimals. Used to convert token amounts to amounts used in the starkware
contract.
*/
const R = require('ramda')

const BN = require('./BN')
const toBN = require('./toBN')

module.exports = R.curry((tokenInfo, amount, rounding = BN.ROUND_FLOOR) => toBN(10)
  .pow(tokenInfo.decimals)
  .times(amount)
  .dividedBy(tokenInfo.quantization)
  .integerValue(rounding)
)
