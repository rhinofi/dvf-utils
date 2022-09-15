/*
  Maps keys recursively with given map function.
  Both recursion and mapping can be customised with an array of customisers:
  objects with `test` and `map` functions. `test(v)` if called to check if the
  value should be handled by given customiser, and if so then `map`` is called
  with `value`, original `map` function and `recourse`. The latter can be called
  to given back control to the original recursion mechanism.
*/

const R = require('ramda')

const mapKeysRecursiveWith = customisers => map => v => {
  const recurse = mapKeysRecursiveWith(customisers)(map)
  const customiser = R.find(
    ({ test }) => test(v),
    customisers,
  )

  if (customiser) {
    return (customiser.map(v, map, recurse))
  } else if (R.is(Array, v)) {
    return R.map(recurse, v)
  } else if (R.is(Object, v)) {
    return R.compose(
      R.fromPairs,
      R.map(([k, v]) => [map(k), recurse(v)]),
      R.toPairs,
    )(v)
  } else {
    return v
  }
}

module.exports = mapKeysRecursiveWith
