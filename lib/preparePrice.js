const preparePriceBN = require('./preparePriceBN')

module.exports = price => preparePriceBN(price).toString()
