const Joi = require('@hapi/joi')
const web3Utils = require('web3-utils')

const prepareAmount = require('./prepareAmount')
const preparePrice = require('./preparePrice')
const toBN = require('./toBN')
const BN = require('./BN')
const toBigInt = require('./toBigInt')
const isLong = require('./isLong')
const toLong = require('./toLong')

module.exports = Joi
  .extend(Joi => ({
    base: Joi.string(),
    type: 'ethAddress',
    messages: {
      'ethAddress.base': '{{#label}} must be a valid Ethereum Address'
    },
    validate: (value, helpers) => {
      if (!web3Utils.isAddress(value)) {
        return { value, errors: helpers.error('ethAddress.base') }
      }
    }
  }))
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
  .extend(Joi => ({
    base: Joi.any(),
    type: 'long',
    messages: {
      'long.base': '{{#label}} must be of type (or unambiguously coercible to) Long (64 bit signed integer)',
      'long.min': '{{#label}} must be >= {{#minimum}}',
      'long.max': '{{#label}} must be <= {{#maximum}}'
    },
    coerce: (value, helpers) => {
      try {
        return { value: toLong(value) }
      } catch (error) {
        return { value }
      }
    },
    validate: (value, helpers) => {
      if (!(isLong(value))) {
        return { value, errors: helpers.error('long.base') }
      }
    },
    rules: {
      min: {
        method (minimum) {
          if (minimum == null) {
            throw new Error('minimum arg cannot be nullish')
          }
          return this.$_addRule({ name: 'min', args: { minimum: toLong(minimum) } })
        },
        args: [
          {
            name: 'minimum',
            assert: value => isLong(value),
            message: 'must be a Long'
          }
        ],
        validate: (value, helpers, args, options) => value.greaterThanOrEqual(args.minimum)
          ? value
          : helpers.error('long.min', { minimum: args.minimum })
      },
      max: {
        method (maximum) {
          if (maximum == null) {
            throw new Error('maximum arg cannot be nullish')
          }
          return this.$_addRule({ name: 'max', args: { maximum: toLong(maximum) } })
        },
        args: [
          {
            name: 'maximum',
            assert: value => isLong(value),
            message: 'must be a Long'
          }
        ],
        validate: (value, helpers, args, options) => value.lessThanOrEqual(args.maximum)
          ? value
          : helpers.error('long.max', { maximum: args.maximum })
      }
    }
  }))
  .extend(Joi => ({
    base: Joi.any(),
    type: 'bigNumber',
    messages: {
      'bigNumber.base': '{{#label}} must be of type (or unambiguously coercible to) BigNumber',
      'bigNumber.min': '{{#label}} must be >= {{#minimum}}',
      'bigNumber.max': '{{#label}} must be <= {{#maximum}}',
      'bigNumber.greaterThan': '{{#label}} must be > {{#exclusiveMinimum}}',
      'bigNumber.lessThan': '{{#label}} must be < {{#exclusiveMaximum}}'
    },
    coerce: (value, helpers) => {
      try {
        return { value: toBN(value) }
      } catch (error) {
        return { value }
      }
    },
    validate: (value, helpers) => {
      if (!(BN.isBigNumber(value))) {
        return { value, errors: helpers.error('bigNumber.base') }
      }
    },
    rules: {
      min: {
        method (minimum) {
          if (minimum == null) {
            throw new Error('minimum arg cannot be nullish')
          }
          return this.$_addRule({ name: 'min', args: { minimum: toBN(minimum) } })
        },
        args: [
          {
            name: 'minimum',
            assert: value => BN.isBigNumber(value),
            message: 'must be a Long'
          }
        ],
        validate: (value, helpers, args, options) => value.isGreaterThanOrEqualTo(args.minimum)
          ? value
          : helpers.error('bigNumber.min', { minimum: args.minimum })
      },
      max: {
        method (maximum) {
          if (maximum == null) {
            throw new Error('maximum arg cannot be nullish')
          }
          return this.$_addRule({ name: 'max', args: { maximum: toBN(maximum) } })
        },
        args: [
          {
            name: 'maximum',
            assert: value => BN.isBigNumber(value),
            message: 'must be a Long'
          }
        ],
        validate: (value, helpers, args, options) => value.isLessThanOrEqualTo(args.maximum)
          ? value
          : helpers.error('bigNumber.max', { maximum: args.maximum })
      },
      greaterThan: {
        method (exclusiveMinimum) {
          if (exclusiveMinimum == null) {
            throw new Error('exclusiveMinimum arg cannot be nullish')
          }
          return this.$_addRule({ name: 'greaterThan', args: { exclusiveMinimum: toBN(exclusiveMinimum) } })
        },
        args: [
          {
            name: 'exclusiveMinimum',
            assert: value => BN.isBigNumber(value),
            message: 'must be a Long'
          }
        ],
        validate: (value, helpers, args, options) => value.isGreaterThan(args.exclusiveMinimum)
          ? value
          : helpers.error('bigNumber.greaterThan', { exclusiveMinimum: args.exclusiveMinimum })
      },
      lessThan: {
        method (exclusiveMaximum) {
          if (exclusiveMaximum == null) {
            throw new Error('exclusiveMaximum arg cannot be nullish')
          }
          return this.$_addRule({ name: 'lessThan', args: { exclusiveMaximum: toBN(exclusiveMaximum) } })
        },
        args: [
          {
            name: 'exclusiveMaximum',
            assert: value => BN.isBigNumber(value),
            message: 'must be a Long'
          }
        ],
        validate: (value, helpers, args, options) => value.isLessThan(args.exclusiveMaximum)
          ? value
          : helpers.error('bigNumber.lessThan', { exclusiveMaximum: args.exclusiveMaximum })
      }
    }
  }))
