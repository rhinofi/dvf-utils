const FP = require('lodash/fp')
const R = require('ramda')

const Joi = require('./Joi')
const mapKeysRecursiveWith = require('./mapKeysRecursiveWith')

const joiCustomiser = {
  test: v => Joi.isSchema(v),
  map: (v, map, recurse) => {
    const joiDescription = v.describe()
    if (joiDescription.type === 'object') {
      const keys = R.compose(
        R.fromPairs,
        R.map(k => [map(k), recurse(v.extract([k]))]),
      )(R.keys(joiDescription.keys))

      return Joi.object(keys)
    }

    return v
  },
}

module.exports = mapKeysRecursiveWith([joiCustomiser])(FP.camelCase)
module.exports.joiCustomiser = joiCustomiser
