const BN = require('./BN')
const splitSymbol = require('./splitSymbol')
const toBN = require('./toBN')

module.exports = ({ DVFError, getTokenInfo }) => ({ symbol, amount, price, feeRate, computeFill }) => {
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

  // If Buy and Sell Amounts are for fill then first calculate
  // the original order settle spread and use the same to calculate
  // buy and sell amounts for the fill
  if (computeFill) {
    const orderBuyAmount = computeFill.amountBuy
    const orderSellAmount = computeFill.amountSell

    const buySettleSpread = toBN(orderBuyAmount)
      .times(buyTokenReg.quantization)
      .shiftedBy(-1 * buyTokenReg.decimals)
      .dividedBy(buy.amount)
      .dividedBy(1 - feeRate)
      .minus(1)
      .toNumber()

    buyTokenReg.settleSpread = buySettleSpread

    const sellSettleSpread = toBN(orderSellAmount)
      .times(sellTokenReg.quantization)
      .shiftedBy(-1 * sellTokenReg.decimals)
      .dividedBy(sell.amount)
      .minus(1)
      .toNumber()

    sellTokenReg.settleSpread = sellSettleSpread
  }
  const amountBuy = toBN(10)
    .pow(buyTokenReg.decimals)
    .times(buy.amount)
    .dividedBy(buyTokenReg.quantization)
    .times(1 + (buyTokenReg.settleSpread || 0))
    .times(1 - feeRate)
    .integerValue()
    .toString()

  const amountSell = toBN(10)
    .pow(sellTokenReg.decimals)
    .times(sell.amount)
    .dividedBy(sellTokenReg.quantization)
    .times(1 + (sellTokenReg.settleSpread || 0))
    .integerValue(BN.ROUND_DOWN)
    .toString()

  return {
    amountSell,
    amountBuy,
    tokenSell: sell.token,
    tokenBuy: buy.token
  }
}
