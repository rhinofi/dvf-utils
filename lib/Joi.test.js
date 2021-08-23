const Joi = require('./Joi')
const toLong = require('./toLong')
const Long = require('./Long')
const toBN = require('./toBN')

const testErrorMessage = schema => message => value => expect(
  schema.validate(value).error
).toHaveProperty('message', message)

describe('Joi', () => {
  it('prefixedHexString', () => {
    const validHexString = '0x0180fc633b754b50370614a587218cf36a4fa7c2f11d65ec761dded48a81ab9e'

    const schema = Joi.prefixedHexString().required()

    expect(schema.validate(validHexString)).toEqual({ value: validHexString })

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
      '0x1818*9-2',
      `1x${validHexString}}`
    ].forEach(testError('"value" must be a valid 0x-prefixed hex string'))
  })

  it('ethAddress', () => {
    const validChecksumAddress = '0xCc6E2d20cC5AaFDCa329bA2d63e5ba5edD684B2F'

    const schema = Joi.ethAddress().required()

    // Set expected number of assertion to make sure that asserts wrapped in
    // testErrorMessage helper are actually executed.
    expect.assertions(3 + 1 + 1 + 4 + 4)

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
      '2d5752b42440139a130f453e0c646e6e656dded4',
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

      const schemaMax = schema.max(1)
      ;[0, '1'].forEach(testValid(schemaMax))

      ;[2, '3'].forEach(testErrorMessage(schemaMax)('"value" must be <= 1'))
    })
  })

  describe('bigNumber', () => {
    const schema = Joi.bigNumber().required()
    const testValid = schema => value => {
      expect(schema.validate(value)).toEqual({ value: toBN(value) })
    }
    it('accepts values of mongodb.Long type or ones which can be unambiguously coerced to it', () => {
      expect.assertions(7 + 1 + 4)

      ;[
        -1,
        '-1',
        0,
        toBN(0),
        toBN(Number.MAX_VALUE).plus(toBN(1)),
        Long.MAX_VALUE,
        Number.MAX_VALUE
      ].forEach(testValid(schema))

      const testError = testErrorMessage(schema)

      testError('"value" is required')(undefined)

      ;[
        null,
        {},
        [],
        ''
      ].forEach(testError('"value" must be of type (or unambiguously coercible to) BigNumber'))
    })

    it('respects min modifier', () => {
      expect.assertions(2 + 2)

      const schemaMin = schema.min(1)
      ;[1, '2'].forEach(testValid(schemaMin))

      ;[0, '-1'].forEach(testErrorMessage(schemaMin)('"value" must be >= 1'))
    })

    it('respects max modifier', () => {
      expect.assertions(2 + 2)

      const schemaMax = schema.max(toBN(1))
      ;[0, '1'].forEach(testValid(schemaMax))

      ;[2, '3'].forEach(testErrorMessage(schemaMax)('"value" must be <= 1'))
    })

    it('respects greaterThan modifier', () => {
      expect.assertions(2 + 2)

      const schemaGreaterThan = schema.greaterThan(1)
      ;[2, '3'].forEach(testValid(schemaGreaterThan))

      ;[1, '0'].forEach(testErrorMessage(schemaGreaterThan)('"value" must be > 1'))
    })

    it('respects lessThan modifier', () => {
      expect.assertions(2 + 2)

      const schemaLessThan = schema.lessThan(toBN(1))
      ;[-1, '0'].forEach(testValid(schemaLessThan))

      ;[1, '2'].forEach(testErrorMessage(schemaLessThan)('"value" must be < 1'))
    })
  })

  describe('price', () => {
    it('should coerce the input number', () => {
      const schema = Joi.price().required()
      expect(schema.validate('250.12345678')).toEqual({ value: '250.12' })
      expect(schema.validate(123456)).toEqual({ value: '123460' })
    })
    it('should return the same number when the input is valid', () => {
      const schema = Joi.price().required()
      expect(schema.validate('250.123')).toEqual({ value: '250.12' })
      expect(schema.validate(12345)).toEqual({ value: '12345' })
    })
    it('should return error if the input is longer than allowed, when coercion is bypassed', () => {
      const schema = Joi.price().required()
      expect(schema.validate('250.12345678', { convert: false }).error.message)
        .toEqual('"value" must not have more than 5 significant digits')
      expect(schema.validate('123456', { convert: false }).error.message)
        .toEqual('"value" must not have more than 5 significant digits')
    })
  })
  describe('amount', () => {
    it('should coerce the input number', () => {
      const schema = Joi.amount().required()
      expect(schema.validate('0.1234567899')).toEqual({ value: '0.12345679' })
      expect(schema.validate(0.000000006)).toEqual({ value: '0.00000001' })
    })
    it('should return the same number when the input is valid', () => {
      const schema = Joi.amount().required()
      expect(schema.validate('0.12345678')).toEqual({ value: '0.12345678' })
      expect(schema.validate(12345678)).toEqual({ value: '12345678' })
    })
    it('should return error if the input is longer than allowed, when coercion is bypassed', () => {
      const schema = Joi.amount().required()
      expect(schema.validate('0.1234567899', { convert: false }).error.message)
        .toEqual('"value" must not have more than 8 decimal places')
      expect(schema.validate('0.000000006', { convert: false }).error.message)
        .toEqual('"value" must not have more than 8 decimal places')
    })
  })
})
