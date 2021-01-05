const Joi = require('./Joi')

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

    const testErrorMessage = message => value => expect(
      schema.validate(value).error
    ).toHaveProperty('message', message)

    testErrorMessage('"value" is not allowed to be empty')('')

    testErrorMessage('"value" is required')(undefined)

    ;[
      null,
      0,
      {},
      []
    ].forEach(testErrorMessage('"value" must be a string'))

    ;[
      'abc',
      '0xCc6E2d20cC5AaFDCa329bA2d63e5ba5edD684B2f',
      `${validChecksumAddress}0}`
    ].forEach(testErrorMessage('"value" must be a valid Ethereum Address'))
  })
})
