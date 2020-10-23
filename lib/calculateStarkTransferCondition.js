// Note web3-utils.BN is different that ./BN.js
// the former is bn.js the latter is
// TODO: we might want to consider switching to bn.js everywhere since it's
// already a dep of web3 and starkware_crypto js
const { checkAddressChecksum, keccak256, encodePacked, BN } = require('web3-utils')

const assertString = (name, value) => {
  if (!value) throw new Error(`${name} is required`)

  const type = typeof value
  if (type !== 'string') {
    throw new Error(
      `${name} needs to be a string, got: ${type}`
    )
  }
}
module.exports = ({ fact, factRegistryAddress }) => {
  assertString('fact', fact)
  assertString('factRegistryAddress', factRegistryAddress)

  if (!checkAddressChecksum(factRegistryAddress)) {
    throw new Error(
      `factRegistryAddress (${factRegistryAddress}) has invalid checksum`
    )
  }

  const hashHexString = keccak256(encodePacked(
    { t: 'address', v: factRegistryAddress },
    { t: 'bytes32', v: fact }
  ))

  const hashBN = new BN(hashHexString.substring(2), 'hex')
  return '0x' + hashBN.maskn(250).toString('hex')
}
