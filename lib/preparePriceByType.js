const preparePriceByTypeBN = require('./preparePriceByTypeBN')

module.exports = (price, type) => preparePriceByTypeBN(price, type).toString()
