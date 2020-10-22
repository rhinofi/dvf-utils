// This uses native BigInt under the hood if available.
const BI = require('big-integer')
const keccak = require('keccak')
const toBN = require('./toBN')
const toBigInt = require('./toBigInt')

const keccak256 = (...args) => {
  const hash = keccak('keccak256')

  args.forEach(v => console.log('v', v) || hash.update(v))

  return '0x' + hash.digest('hex')
}

const hasNativeBigInt = typeof BigInt === 'function'

const mask250bit = BI(1).shiftLeft(250).minus(1)
const take250LSBits = v => v.and(mask250bit)
const take250LSBitsAsHexString = v => '0x' + take250LSBits(
  // unfortunately big-integer does not handle 0x hex strings correctly
  // so we need to convert to something it understands.
  BI(hasNativeBigInt ? toBigInt(v) : toBN(v).toString(10))
).toString(16)

const supportedTransactionTypes = [
  'TransferRequest',
  'ConditionalTransferRequest'
]

module.exports = sw => tx => {
  if (!supportedTransactionTypes.includes(tx.type)) {
    throw new Error(`unsuported transaction type: ${tx.type}`)
  }
  return sw.getTransferMsgHash(
    tx.amount,
    tx.nonce,
    tx.senderVaultId,
    tx.token,
    tx.receiverVaultId,
    tx.receiverPublicKey,
    tx.expirationTimestamp,
    // This is required for ConditionalTransferRequest
    tx.type === 'ConditionalTransferRequest' && take250LSBitsAsHexString(keccak256(tx.factRegistryAddress, tx.fact))
  )
}
