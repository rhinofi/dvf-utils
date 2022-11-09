// This uses native BigInt under the hood if available.
module.exports = sw => order =>
  sw.getLimitOrderMsgHash(
    order.vaultIdSell,
    order.vaultIdBuy,
    order.amountSell,
    order.amountBuy,
    order.tokenSell,
    order.tokenBuy,
    order.nonce,
    order.expirationTimestamp,
  )
