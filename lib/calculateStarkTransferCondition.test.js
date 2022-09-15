const calculateStarkTransferCondition = require(
  './calculateStarkTransferCondition',
)

const factRegistryAddress = '0xCc6E2d20cC5AaFDCa329bA2d63e5ba5edD684B2F'
const fact = 'cd7110159df66d2b4164484d6440f7099f8492f5c20d4cde01009b0d4ab85bbf'

describe('calculateStarkTransferCondition', () => {
  it('works is given valid data', () => {
    const factRegistryAddress = '0xCc6E2d20cC5AaFDCa329bA2d63e5ba5edD684B2F'
    const fact =
      'cd7110159df66d2b4164484d6440f7099f8492f5c20d4cde01009b0d4ab85bbf'
    const expectedCondition =
      '0xe92c5c54fe8326ef50fda04630ed26f040930b3cd508d2f0bf30ec11c326d6'

    expect(calculateStarkTransferCondition({ fact, factRegistryAddress }))
      .toEqual(expectedCondition)

    expect(calculateStarkTransferCondition({
      fact: '2ae53cabfd18fd1b82f64e9be8c1530d45cd28085d141be0bd207356f5eec215',
      factRegistryAddress: '0xA34eDCafebb1D5DC665B1fa8f43E094caAD4D2bE',
    }))
      .toEqual(
        '0x3d3ca40797c80f2648c32cf62cfa03732170a1423a58e85114e2ef0f41641c2',
      )
  })

  it('throws an error if factRegistryAddress has invalid checksum', () => {
    const badFactRegistryAddress = factRegistryAddress.toLowerCase()

    expect(() =>
      calculateStarkTransferCondition(
        { fact, factRegistryAddress: badFactRegistryAddress },
      )
    )
      .toThrow(
        new Error(
          `factRegistryAddress (${badFactRegistryAddress}) has invalid checksum`,
        ),
      )
  })

  it('throws an error if factRegistryAddress is not defined', () => {
    expect(() =>
      calculateStarkTransferCondition(
        { fact },
      )
    )
      .toThrow(new Error('factRegistryAddress is required'))
  })

  it('throws an error if fact is not defined', () => {
    expect(() =>
      calculateStarkTransferCondition(
        { factRegistryAddress },
      )
    )
      .toThrow(new Error('fact is required'))
  })
})
