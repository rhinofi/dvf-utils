const R = require('ramda')

const toQuantizedAmountBN = require('./toQuantizedAmountBN')

module.exports = R.compose(R.toString, toQuantizedAmountBN)
