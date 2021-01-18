const Joi = require('./Joi')
const toLong = require('./toLong')
const toBN = require('./toBN')

const testErrorMessage = schema => message => value => expect(
  schema.validate(value).error
).toHaveProperty('message', message)

describe('Joi', () => {
  it('ethAddress', () => {
    const validChecksumAddress = '0xCc6E2d20cC5AaFDCa329bA2d63e5ba5edD684B2F'

    const schema = Joi.ethAddress().required()

    // Set expected number of assertion to make sure that asserts wrapped in
    // testErrorMessage helper are actually executed.
    expect.assertions(3 + 1 + 1 + 4 + 3)

    ;[
      validChecksumAddress,
      validChecksumAddress.toLowerCase(),
      validChecksumAddress.toUpperCase()
    ].forEach(value => {
      expect(schema.validate(value)).toEqual({ value })
    })

    const testError = testErrorMessage(schema)

    testError('"value" is not allowed to be empty')('')

    testError('"value" is required')(undefined)

    ;[
      null,
      0,
      {},
      []
    ].forEach(testError('"value" must be a string'))

    ;[
      'abc',
      '0xCc6E2d20cC5AaFDCa329bA2d63e5ba5edD684B2f',
      `${validChecksumAddress}0}`
    ].forEach(testError('"value" must be a valid Ethereum Address'))
  })

  describe('long', () => {
    const schema = Joi.long().required()

    const testValid = schema => value => {
      expect(schema.validate(value)).toEqual({ value: toLong(value) })
    }

    it('accepts values of mongodb.Long type or ones which can be unambiguously coerced to it', () => {
      expect.assertions(7 + 1 + 4)

      ;[
        -1,
        '-1',
        0,
        toLong(0),
        toLong(Number.MAX_SAFE_INTEGER).add(toLong(1)),
        toBN(Number.MAX_SAFE_INTEGER).plus(1),
        Number.MAX_SAFE_INTEGER
      ].forEach(testValid(schema))

      const testError = testErrorMessage(schema)

      testError('"value" is required')(undefined)

      ;[
        null,
        {},
        [],
        ''
      ].forEach(testError('"value" must be of type (or unambiguously coercible to) Long (64 bit signed integer)'))
    })

    it('respects min modifier', () => {
      expect.assertions(2 + 2)

      const schemaMin = schema.min(toLong(1))
      ;[1, '2'].forEach(testValid(schemaMin))

      ;[0, '-1'].forEach(testErrorMessage(schemaMin)('"value" must be >= 1'))
    })

    it('respects max modifier', () => {
      expect.assertions(2 + 2)

      const schemaMin = schema.max(toLong(1))
      ;[0, '1'].forEach(testValid(schemaMin))

      ;[2, '3'].forEach(testErrorMessage(schemaMin)('"value" must be <= 1'))
    })
  })
})
