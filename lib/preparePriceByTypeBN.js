const BN = require('./BN')
const toBN = require('./toBN')
const SIGNIFICANT_DIGITS = 5

const rounding = {
  bid: BN.ROUND_DOWN,
  ask: BN.ROUND_UP
}

const typeMap = {
  sell: 'bid',
  buy: 'ask'
}

const mapTypes = (type) => {
  const typeLower = String(type).toLowerCase()
  return typeMap[typeLower] || typeLower
}

/**
 * Prepare price with rounding by order type.
 *
 * @param {number|string|BigNumber} price Price to prepare.
 * @param {string} type Order type to apply rounding.
 * @return {BigNumber}
 */
module.exports = (price, type) => {
  const mappedType = mapTypes(type)

  if (!type || !Object.keys(rounding).includes(mappedType)) {
    throw new Error(`Invalid price type: ${type}`)
  }

  return toBN(price).precision(SIGNIFICANT_DIGITS, rounding[mappedType])
}
