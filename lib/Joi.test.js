const Joi = require('./Joi')
const toLong = require('./toLong')
const Long = require('./Long')
const toBN = require('./toBN')

const testErrorMessage = schema => message => value =>
  expect(
    schema.validate(value).error,
  )
    .toHaveProperty('message', message)

const nonStrings = [
  null,
  0,
  {},
  [],
]

const nonNumbers = [
  null,
  {},
  [],
  '',
]

describe('Joi', () => {
  it('prefixedHexString', () => {
    const validHexString =
      '0x0180fc633b754b50370614a587218cf36a4fa7c2f11d65ec761dded48a81ab9e'

    const schema = Joi.prefixedHexString().required()

    expect(schema.validate(validHexString)).toEqual({ value: validHexString })

    const testError = testErrorMessage(schema)

    testError('"value" is not allowed to be empty')('')

    testError('"value" is required')(undefined)

    nonStrings.forEach(testError('"value" must be a string'))

    const invalidStrings = [
      'abc',
      '0x1818*9-2',
      `1x${validHexString}}`,
    ]

    invalidStrings.forEach(
      testError('"value" must be a valid 0x-prefixed hex string'),
    )
  })

  it('ethAddress', () => {
    const validChecksumAddress = '0xCc6E2d20cC5AaFDCa329bA2d63e5ba5edD684B2F'

    const schema = Joi.ethAddress().required()

    // Set expected number of assertion to make sure that asserts wrapped in
    // testErrorMessage helper are actually executed.
    expect.assertions(3 + 1 + 1 + 4 + 4)

    const validAddresses = [
      validChecksumAddress,
      validChecksumAddress.toLowerCase(),
      validChecksumAddress.toUpperCase(),
    ]

    validAddresses.forEach(value => {
      expect(schema.validate(value)).toEqual({ value })
    })

    const testError = testErrorMessage(schema)

    testError('"value" is not allowed to be empty')('')

    testError('"value" is required')(undefined)

    nonStrings.forEach(testError('"value" must be a string'))

    const invalidAddresses = [
      'abc',
      '0xCc6E2d20cC5AaFDCa329bA2d63e5ba5edD684B2f',
      '2d5752b42440139a130f453e0c646e6e656dded4',
      `${validChecksumAddress}0}`,
    ]

    invalidAddresses.forEach(
      testError('"value" must be a valid Ethereum Address'),
    )
  })

  describe('long', () => {
    const testValid = schema => value => {
      expect(schema.validate(value)).toEqual({ value: toLong(value) })
    }

    const schema = Joi.long().required()

    it('accepts values of mongodb.Long type or ones which can be unambiguously coerced to it', () => {
      expect.assertions(7 + 1 + 4)

      const valid = [
        -1,
        '-1',
        0,
        toLong(0),
        toLong(Number.MAX_SAFE_INTEGER).add(toLong(1)),
        toBN(Number.MAX_SAFE_INTEGER).plus(1),
        Number.MAX_SAFE_INTEGER,
      ]

      valid.forEach(testValid(schema))

      const testError = testErrorMessage(schema)

      testError('"value" is required')(undefined)

      const errorMessage =
        '"value" must be of type (or unambiguously coercible to) Long (64 bit signed integer)'

      nonNumbers.forEach(testError(errorMessage))
    })

    it('respects min modifier', () => {
      expect.assertions(2 + 2)

      const schemaMin = schema.min(toLong(1))

      const valid = [1, '2']
      valid.forEach(testValid(schemaMin))

      const tooSmall = [0, '-1']
      tooSmall.forEach(testErrorMessage(schemaMin)('"value" must be >= 1'))
    })

    it('respects max modifier', () => {
      expect.assertions(2 + 2)

      const schemaMax = schema.max(1)
      const valid = [0, '1']

      valid.forEach(testValid(schemaMax))

      const tooLarge = [2, '3']
      tooLarge.forEach(testErrorMessage(schemaMax)('"value" must be <= 1'))
    })
  })

  describe('bigNumber', () => {
    const testValid = schema => value => {
      expect(schema.validate(value)).toEqual({ value: toBN(value) })
    }

    const schema = Joi.bigNumber().required()

    it('accepts values of mongodb.Long type or ones which can be unambiguously coerced to it', () => {
      expect.assertions(7 + 1 + 4)
      const valid = [
        -1,
        '-1',
        0,
        toBN(0),
        toBN(Number.MAX_VALUE).plus(toBN(1)),
        Long.MAX_VALUE,
        Number.MAX_VALUE,
      ]

      valid.forEach(testValid(schema))

      const testError = testErrorMessage(schema)

      testError('"value" is required')(undefined)

      const errorMessage =
        '"value" must be of type (or unambiguously coercible to) BigNumber'

      nonNumbers.forEach(testError(errorMessage))
    })

    it('respects min modifier', () => {
      expect.assertions(2 + 2)

      const schemaMin = schema.min(1)

      const valid = [1, '2']
      valid.forEach(testValid(schemaMin))

      const tooSmall = [0, '-1']
      tooSmall.forEach(testErrorMessage(schemaMin)('"value" must be >= 1'))
    })

    it('respects max modifier', () => {
      expect.assertions(2 + 2)

      const schemaMax = schema.max(toBN(1))

      const valid = [0, '1']
      valid.forEach(testValid(schemaMax))

      const invalid = [2, '3']
      invalid.forEach(testErrorMessage(schemaMax)('"value" must be <= 1'))
    })

    it('respects greaterThan modifier', () => {
      expect.assertions(2 + 2)

      const schemaGreaterThan = schema.greaterThan(1)

      const valid = [2, '3']
      valid.forEach(testValid(schemaGreaterThan))

      const invalid = [1, '0']
      invalid.forEach(
        testErrorMessage(schemaGreaterThan)('"value" must be > 1'),
      )
    })

    it('respects lessThan modifier', () => {
      expect.assertions(2 + 2)

      const schemaLessThan = schema.lessThan(toBN(1))

      const valid = [-1, '0']
      valid.forEach(testValid(schemaLessThan))

      const invalid = [1, '2']
      invalid.forEach(testErrorMessage(schemaLessThan)('"value" must be < 1'))
    })
  })
})
