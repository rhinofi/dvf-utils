const BN = require('./BN')
const splitSymbol = require('./splitSymbol')
const toBN = require('./toBN')

const applyFee = (amountBuy, { feeRate, feeAmount }) => {
  if (feeAmount) {
    return amountBuy.minus(feeAmount)
  }

  return amountBuy.times(1 - feeRate)
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

  const amountBuy = applyFee(amountBuyBeforeFee, { feeRate, feeAmount })
    .integerValue()
    .toString()

  const amountSell = toBN(10)
    .pow(sellTokenReg.decimals)
    .times(sell.amount)
    .dividedBy(sellTokenReg.quantization)
    .times(1 + (settleSpreadSell || 0))
    .integerValue(BN.ROUND_DOWN)
    .toString()

  return {
    amountSell,
    amountBuy,
    tokenSell: sell.token,
    tokenBuy: buy.token
  }
}
