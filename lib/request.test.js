const nock = require('nock')
const request = require('./request')
const {
  RequestError,
  StatusCodeError,
  InvalidOptionError
} = require('./request.errors')

const apiDomain = 'https://api.stg.deversifi.com'

// Get Test Url / Response
const getTest = {
  url: '/market-data/getUsdtPrice/USDT',
  response: {
    price: 1,
    token: 'USDT'
  }
}

// Post Test Url / Response
const postTest = {
  url: '/v1/trading/r/getConf',
  response: {
    DVF: {
      defaultFeeRate: 0.002,
      defaultFeeRateSwap: 0.003
    }
  }
}

describe('Request Tests', () => {
  let requestNock

  beforeAll(() => {
    nock.cleanAll()
  })

  beforeEach(() => {
    requestNock = nock(apiDomain).defaultReplyHeaders({
      'access-control-allow-origin': '*'
    })
  })

  afterEach(() => {
    nock.cleanAll()
  })

  afterAll(() => {
    nock.cleanAll()
  })

  describe('Expected Success', () => {
    it('returns default data only for get', async () => {
      requestNock.get(getTest.url).reply(200, getTest.response)

      const response = await request.get(`${apiDomain}${getTest.url}`)

      expect(response).toEqual(getTest.response)
    })

    it('returns default data only for post', async () => {
      requestNock.post(postTest.url).reply(200, postTest.response)

      const response = await request.post(`${apiDomain}${postTest.url}`)

      expect(response).toEqual(postTest.response)
    })

    it('returns extended data using fullResponse for get', async () => {
      requestNock.get(getTest.url).reply(200, getTest.response)

      const response = await request.get(`${apiDomain}${getTest.url}`, {
        fullResponse: true
      })

      expect(response).not.toEqual(getTest.response)
      expect(response.data).toEqual(getTest.response)
      expect(response.statusCode).toBe(200)
      expect(response.statusText).toBe('OK')
      expect(response.headers).toBeDefined()
    })

    it('returns extended data using fullResponse for post', async () => {
      requestNock.post(postTest.url).reply(200, postTest.response)

      const response = await request.post(`${apiDomain}${postTest.url}`, {
        fullResponse: true
      })

      expect(response).not.toEqual(postTest.response)
      expect(response.data).toEqual(postTest.response)
      expect(response.statusCode).toBe(200)
      expect(response.statusText).toBe('OK')
      expect(response.headers).toBeDefined()
    })

    it('returns plain text data using responseType text', async () => {
      requestNock.get(getTest.url).reply(200, JSON.stringify(getTest.response))

      // Issue with plain text, sometimes works, sometimes not
      const response = await request.get(`${apiDomain}${getTest.url}`, {
        responseType: 'text'
      })

      expect(response).not.toEqual(getTest.response)
    })
  })

  describe('Expected Failure', () => {
    it('fails with InvalidOptionError using data option for get', async () => {
      expect(async () => {
        await request.get(`${apiDomain}${getTest.url}`, {
          data: {
            test: 'test'
          }
        })
      }).rejects.toThrow(InvalidOptionError)
    })

    it('fails with InvalidOptionError using invalid option for request', async () => {
      expect(async () => {
        await request.get(`${apiDomain}${getTest.url}`, {
          params: {
            test: 'test'
          }
        })
      }).rejects.toThrow(InvalidOptionError)
    })

    it('fails with StatusCodeError for 404', async () => {
      requestNock.get(getTest.url).reply(404)

      expect(async () => {
        await request.get(`${apiDomain}${getTest.url}`)
      }).rejects.toThrow(StatusCodeError)
    })

    it('fails with RequestError for timeout', async () => {
      requestNock.get(getTest.url).delay(200).reply(200, getTest.response)

      expect(async () => {
        await request.get(`${apiDomain}${getTest.url}`, {
          timeout: 10
        })
      }).rejects.toThrow(RequestError)
    })
  })

  // Independent block to avoid network issues for other tests
  describe('Network Failure', () => {
    it('fails with RequestError for no response', async () => {
      nock.disableNetConnect()

      expect(async () => {
        await request.get(`${apiDomain}${getTest.url}`)
        nock.enableNetConnect()
      }).rejects.toThrow(RequestError)
    })
  })
})
