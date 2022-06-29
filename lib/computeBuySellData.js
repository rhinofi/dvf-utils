const BN = require('./BN')
const splitSymbol = require('./splitSymbol')
const toBN = require('./toBN')

const getFeeAmount = (amountBuy, { feeRate, feeAmount }) => {
  const fee = feeAmount == null
    ? feeRate == null
        ? BN(0)
        : amountBuy.times(toBN(feeRate))
    : feeAmount

  // Round in favour of the user.
  return fee.integerValue(BN.ROUND_DOWN)
}

module.exports = ({ DVFError, getTokenInfo }) => ({ symbol, amount, price, feeRate, feeAmount, settleSpreadBuy, settleSpreadSell }) => {
  amount = toBN(amount)
  price = toBN(price)

  if (amount.isEqualTo(0)) throw new DVFError('AMOUNT_CANNOT_BE_ZERO')
  if (price.isLessThan(0)) throw new DVFError('PRICE_MUST_BE_POSITIVE')

  const [baseToken, quoteToken] = splitSymbol(symbol)
  const absAmount = amount.absoluteValue()

  const base = {
    token: baseToken,
    amount: absAmount
  }

  const quote = {
    token: quoteToken,
    amount: absAmount.times(price)
  }

  const [buy, sell] = amount.isGreaterThan(0)
    ? [base, quote]
    : [quote, base]

  const sellTokenReg = getTokenInfo(sell.token)
  const buyTokenReg = getTokenInfo(buy.token)

  settleSpreadBuy = buyTokenReg.settleSpread
  settleSpreadSell = sellTokenReg.settleSpread

  const amountBuyBeforeFee = toBN(10)
    .pow(buyTokenReg.decimals)
    .times(buy.amount)
    .dividedBy(buyTokenReg.quantization)
    .times(1 + (settleSpreadBuy || 0))
    // Round UP (in favour of user) to avoid invalidating stark settlement ratio,
    // by moving the price below orders limit.
    .integerValue(BN.ROUND_UP)

  const finalFeeAmount = getFeeAmount(amountBuyBeforeFee, { feeRate, feeAmount })
  const amountBuy = amountBuyBeforeFee.minus(finalFeeAmount)

  const amountSell = toBN(10)
    .pow(sellTokenReg.decimals)
    .times(sell.amount)
    .dividedBy(sellTokenReg.quantization)
    .times(1 + (settleSpreadSell || 0))
    // Same reason as above.
    .integerValue(BN.ROUND_DOWN)

  // TODO: remove toString calls. These should be done at the client side (if
  // needed).
  return {
    amountSell: amountSell.toString(),
    amountBuy: amountBuy.toString(),
    tokenSell: sell.token,
    tokenBuy: buy.token,
    feeAmount: finalFeeAmount.toString()
  }
}
