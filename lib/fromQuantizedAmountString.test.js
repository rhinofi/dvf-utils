const toLong = require('./toLong')

const fromQuantizedAmountString = require('./fromQuantizedAmountString')
const toQuantizedAmount = require('./toQuantizedAmountBN')

const tokenInfo = {
  quantization: 10000000000,
  decimals: 18,
}

describe('fromQuantizedAmount', () => {
  it('works for strings, numbers and Longs', () => {
    expect(fromQuantizedAmountString(tokenInfo, 100000000)).toBe('1')
    expect(fromQuantizedAmountString(tokenInfo, 20000000)).toBe('0.2')
    expect(fromQuantizedAmountString(tokenInfo, 25630000)).toBe('0.2563')
    expect(fromQuantizedAmountString(tokenInfo, '100000000')).toBe('1')
    expect(fromQuantizedAmountString(tokenInfo, toLong('100000000'))).toBe('1')
    expect(
      fromQuantizedAmountString(tokenInfo, toQuantizedAmount(tokenInfo, 1)),
    )
      .toBe('1')
  })
})
