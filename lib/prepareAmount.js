const prepareAmountBN = require('./prepareAmountBN')

module.exports = (amount, decimalPlaces, roundingMethod) =>
  prepareAmountBN(amount, decimalPlaces, roundingMethod).toString()
