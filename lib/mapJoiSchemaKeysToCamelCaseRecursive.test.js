const R = require('ramda')
const Joi = require('./Joi.js')

const mapJoiSchemaKeysToCamelCaseRecursive = require(
  './mapJoiSchemaKeysToCamelCaseRecursive',
)

describe('mapJoiSchemaKeysToCamelCaseRecursive', () => {
  it('maps Joi schema keys to camelCase (recursively)', () => {
    const schemaSnakeCase = Joi.object({
      a_a: Joi.number(),
      b_b: Joi.object({
        c_c: Joi.string(),
        d_d: Joi.object({ e_e: Joi.array() }),
      }),
      f_f: Joi.any(),
    })

    const schemaCamelCase = Joi.object({
      aA: Joi.number(),
      bB: Joi.object({
        cC: Joi.string(),
        dD: Joi.object({ eE: Joi.array() }),
      }),
      fF: Joi.any(),
    })

    // Using describe() since comparing Joi schemas for equality directly
    // doesn't work.
    expect(mapJoiSchemaKeysToCamelCaseRecursive(schemaSnakeCase).describe())
      .toEqual(schemaCamelCase.describe())

    const getDescryption = s => s.describe()
    const getDescryptions = R.map(getDescryption)

    // Handles multiple schemas in an array
    expect(
      getDescryptions(
        mapJoiSchemaKeysToCamelCaseRecursive([
          schemaSnakeCase,
          schemaSnakeCase,
        ]),
      ),
    )
      .toEqual(getDescryptions([schemaCamelCase, schemaCamelCase]))

    // Handles multiple schemas in an object (maps object keys)
    expect(
      getDescryptions(
        mapJoiSchemaKeysToCamelCaseRecursive({
          s_1: schemaSnakeCase,
          s_2: schemaSnakeCase,
        }),
      ),
    )
      .toEqual(getDescryptions({ s1: schemaCamelCase, s2: schemaCamelCase }))
  })
})
