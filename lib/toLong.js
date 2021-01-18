const Long = require('./Long')

const isLong = require('./isLong')

const isNumber = v => v instanceof Number || typeof v === 'number'
const isString = v => v instanceof String || typeof v === 'string'

const maxLongValueAsBigInt = BigInt(Long.MAX_VALUE)
const minLongValueAsBigInt = BigInt(Long.MIN_VALUE)

const fromString = value => {
  const result = Long.fromString(value)
  if (result.toString() !== value) {
    throw new Error(`ivalid Long string value: ${value}, converts to: ${result}`)
  }
  return result
}

module.exports = (value) => {
  if (isLong(value)) return value

  if (isNumber(value)) return Long.fromNumber(value)

  if (isString(value)) {
    return fromString(value)
  }

  if (typeof value === 'bigint') {
    if (value >= minLongValueAsBigInt && value <= maxLongValueAsBigInt) {
      return Long.fromString(value.toString())
    } else {
      throw new Error(
        'cannot convert provided BigInt value to Long, ' +
        `as its out of range, value: ${value}`
      )
    }
  }

  if (value.toString) {
    return fromString(value.toString())
  }

  throw new Error(`cannot convert given value to Long, value: ${value}`)
}
