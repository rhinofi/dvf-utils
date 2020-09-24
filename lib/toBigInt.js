module.exports = value => {
  const typeofValue = typeof value

  if (typeofValue === 'bigint') return value
  if (typeofValue === 'number') return BigInt(value)
  if (typeofValue === 'string') return BigInt(value)

  // This will throw is cannot be converted.
  return BigInt(value.toString())
}
