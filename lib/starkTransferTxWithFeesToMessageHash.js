// This uses native BigInt under the hood if available.
const { checkAddressChecksum } = require('web3-utils')

const supportedTransactionTypes = [
  'TransferRequest',
  'ConditionalTransferRequest'
]

const getFactInfo = (tx) => {
  const { fact, factRegistryAddress } = tx

  if (!checkAddressChecksum(factRegistryAddress)) {
    throw new Error(
      `factRegistryAddress (${factRegistryAddress}) has invalid checksum`
    )
  }

  return { fact, factRegistryAddress}
}

module.exports = sw => tx => {
  if (!supportedTransactionTypes.includes(tx.type)) {
    throw new Error(`unsuported transaction type: ${tx.type}`)
  }

  const condition = tx.type === 'ConditionalTransferRequest'
    ? getFactInfo(tx)
    : null

  return sw.getTransferWithFeesMsgHash(
    tx.amount,
    tx.feeInfoUser.feeLimit
    tx.nonce,
    tx.senderVaultId,
    tx.token,
    tx.feeInfoUser.tokenId,
    tx.receiverVaultId,
    tx.feeInfoUser.sourceVaultId,
    tx.receiverPublicKey,
    tx.expirationTimestamp,
    condition
  )
}
