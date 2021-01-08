// This uses native BigInt under the hood if available.
const calculateStarkTransferCondition = require('./calculateStarkTransferCondition')

const supportedTransactionTypes = [
  'TransferRequest',
  'ConditionalTransferRequest'
]

module.exports = sw => tx => {
  if (!supportedTransactionTypes.includes(tx.type)) {
    throw new Error(`unsuported transaction type: ${tx.type}`)
  }

  const condition = tx.type === 'ConditionalTransferRequest'
    ? calculateStarkTransferCondition(tx)
    : null

  return sw.getTransferMsgHash(
    tx.amount,
    tx.nonce,
    tx.senderVaultId,
    tx.token,
    tx.receiverVaultId,
    tx.receiverPublicKey,
    tx.expirationTimestamp,
    condition
  )
}
