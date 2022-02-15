const preparePriceByType = require('./preparePriceByType')
const preparePrice = require('./preparePrice')

const testValue = (priceIn, type, priceOut) => {
  expect(preparePriceByType(priceIn, type)).toBe(priceOut)
}

const testBidValue = (priceIn, priceOut) => testValue(priceIn, 'bid', priceOut)
const testAskValue = (priceIn, priceOut) => testValue(priceIn, 'ask', priceOut)

describe('preparePriceByType', () => {
  it('rounds provided bid price down to 5 significant digits and returns as a string', () => {
    testBidValue(1, '1')
    testBidValue(0.5, '0.5')
    testBidValue(0.6, '0.6')
    testBidValue(12.3454, '12.345')
    testBidValue(12.3455, '12.345')
    testBidValue(12.3456, '12.345')
    testBidValue(123456, '123450')
    testBidValue(0.00123456, '0.0012345')
    testBidValue(0.02170350, '0.021703')
  })

  it('rounds provided ask price up to 5 significant digits and returns as a string', () => {
    testAskValue(1, '1')
    testAskValue(0.5, '0.5')
    testAskValue(0.6, '0.6')
    testAskValue(12.3454, '12.346')
    testAskValue(12.3455, '12.346')
    testAskValue(12.3456, '12.346')
    testAskValue(123456, '123460')
    testAskValue(0.00123456, '0.0012346')
    testAskValue(0.02170350, '0.021704')
  })

  it('rounds differently to preparePrice', () => {
    const bidPrice = 0.02170351
    const askPrice = 0.02170350

    // Incorrect bid
    expect(preparePrice(bidPrice)).toBe('0.021704')
    expect(preparePriceByType(bidPrice, 'ask')).toBe('0.021704')

    // Correct bid
    expect(preparePriceByType(bidPrice, 'bid')).toBe('0.021703')

    // Incorrect ask
    expect(preparePrice(askPrice)).toBe('0.021703')
    expect(preparePriceByType(askPrice, 'bid')).toBe('0.021703')

    // Correct ask
    expect(preparePriceByType(askPrice, 'ask')).toBe('0.021704')
  })

  it('accepts buy/ask and sell/bid', () => {
    const price = 1.23456

    // Synonyms should match
    expect(preparePriceByType(price, 'ask')).toBe(preparePriceByType(price, 'buy'))
    expect(preparePriceByType(price, 'aSk')).toBe(preparePriceByType(price, 'BuY'))
    expect(preparePriceByType(price, 'bid')).toBe(preparePriceByType(price, 'sell'))
    expect(preparePriceByType(price, 'BiD')).toBe(preparePriceByType(price, 'sElL'))

    // Antonyms should not match
    expect(preparePriceByType(price, 'ask')).not.toBe(preparePriceByType(price, 'sell'))
    expect(preparePriceByType(price, 'aSk')).not.toBe(preparePriceByType(price, 'sElL'))
    expect(preparePriceByType(price, 'bid')).not.toBe(preparePriceByType(price, 'buy'))
    expect(preparePriceByType(price, 'BiD')).not.toBe(preparePriceByType(price, 'BuY'))
  })

  it('fails if type not specified or invalid', () => {
    expect.assertions(2)

    try {
      preparePriceByType(1)
    } catch (e) {
      expect(e.message).toBe('Invalid price type: undefined')
    }

    try {
      preparePriceByType(1, 'test')
    } catch (e) {
      expect(e.message).toBe('Invalid price type: test')
    }
  })
})
