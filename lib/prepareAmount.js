const prepareAmountBN = require('./prepareAmountBN')

module.exports = (amount, DECIMAL_PLACES = 8) =>
  prepareAmountBN(amount, DECIMAL_PLACES).toString()
