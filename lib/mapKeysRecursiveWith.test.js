const BN = require('./BN')

const toUpperCase = s => s.toUpperCase()

const mapKeysRecursiveWith = require('./mapKeysRecursiveWith')

describe('mapKeysRecursiveWith', () => {
  it('customiser can be used to stop recursion for particular type', () => {
    const mapKeysToUpperDefualt = mapKeysRecursiveWith([])(toUpperCase)
    const bnCustomiser = {
      test: v => BN.isBigNumber(v),
      // Simply return the value instead of recursing on it's props.
      map: v => v,
    }
    const mapKeysToUpperHandleBN = mapKeysRecursiveWith([bnCustomiser])(
      toUpperCase,
    )

    const obj = {
      ab: 1,
      bc: BN(1),
      cd: {
        de: 2,
        ef: BN(2),
      },
    }

    const expectObj = {
      AB: 1,
      BC: BN(1),
      CD: {
        DE: 2,
        EF: BN(2),
      },
    }
    expect(mapKeysToUpperHandleBN(obj)).toEqual(expectObj)
    // Default implementation does not handle BN well since it modifies it's
    // members.
    expect(mapKeysToUpperDefualt(obj)).not.toEqual(expectObj)
  })
})
