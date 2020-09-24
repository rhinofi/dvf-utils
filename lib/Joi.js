const Joi = require('@hapi/joi')

const prepareAmount = require('./prepareAmount')
const preparePrice = require('./preparePrice')
const toBN = require('./toBN')
const toBigInt = require('./toBigInt')

module.exports = Joi
  .extend(Joi => ({
    base: Joi.string(),
    type: 'price',
    messages: {
      'price.base': '{{#label}} must be a valid number or numerical string',
      'price.zero': '{{#label}} must not be 0'
    },
    coerce: (value, helpers) => {
      try {
        return { value: preparePrice(value) }
      } catch (error) {
        return { value }
      }
    },
    validate: (value, helpers) => {
      try {
        // Throws is value is not valid number or cannot be converted to one
        const bn = toBN(value)
        if (bn.isZero()) {
          return { value, errors: helpers.error('price.zero') }
        }
      } catch (error) {
        return { value, errors: helpers.error('price.base') }
      }
    }
  }))
  .extend(Joi => ({
    base: Joi.string(),
    type: 'amount',
    messages: {
      'amount.base': '{{#label}} must be a valid number or numerical string',
      'amount.zero': '{{#label}} must not be 0'
    },
    coerce: (value, helpers) => {
      try {
        return { value: prepareAmount(value) }
      } catch (error) {
        return { value }
      }
    },
    validate: (value, helpers) => {
      try {
        // Throws is value is not valid number or cannot be converted to one
        const bn = toBN(value)
        if (bn.isZero()) {
          return { value, errors: helpers.error('amount.zero') }
        }
      } catch (error) {
        return { value, errors: helpers.error('amount.base') }
      }
    }
  }))
  .extend(Joi => ({
    base: Joi.any(),
    type: 'bigInt',
    messages: {
      'amount.base': '{{#label}} must be of type (or unambiguously coercible to) BigInt'
    },
    coerce: (value, helpers) => {
      try {
        return { value: toBigInt(value) }
      } catch (error) {
        return { value }
      }
    },
    validate: (value, helpers) => {
      if (!(typeof value === 'bigint')) {
        return { value, errors: helpers.error('amount.base') }
      }
    }
  }))
