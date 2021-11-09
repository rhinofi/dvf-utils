const nock = require('nock')
const request = require('./request')
const {
  RequestError,
  StatusCodeError,
  InvalidOptionError
} = request.errors

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
    it('fails with InvalidOptionError using data option for get', () => {
      return expect(request.get(`${apiDomain}${getTest.url}`, {
        data: {
          test: 'test'
        }
      })).rejects.toThrow(InvalidOptionError)
    })

    it('fails with InvalidOptionError using invalid option for request', () => {
      return expect(request.get(`${apiDomain}${getTest.url}`, {
        params: {
          test: 'test'
        }
      })).rejects.toThrow(InvalidOptionError)
    })

    it('fails with StatusCodeError for 404', () => {
      requestNock.get(getTest.url).reply(404)

      return expect(request.get(`${apiDomain}${getTest.url}`))
        .rejects.toThrow(StatusCodeError)
    })

    it('fails with RequestError for timeout', () => {
      requestNock.get(getTest.url).delay(200).reply(200, getTest.response)

      return expect(request.get(`${apiDomain}${getTest.url}`, {
        timeout: 10
      })).rejects.toThrow(RequestError)
    })
  })

  // Independent block to avoid network issues for other tests
  describe('Network Failure', () => {
    beforeAll(() => {
      nock.disableNetConnect()
    })

    afterAll(() => {
      nock.enableNetConnect()
    })

    // Currently Jest/JSDom hooks into http client and logs errors
    // to the console, we are not using JSDom at all but in Jest
    // v26.x default testEnvironment is 'jsdom' - in Jest v27.x
    // default testEnvironment is 'node'.
    //
    // Test below works (with disable/enable in before/after) but
    // kicks up an error with jsDom environment.
    //
    // Skip until we decide to switch to node for test env.
    it.skip('fails with RequestError for no response', () => {
      return expect(request.get(`${apiDomain}${getTest.url}`))
        .rejects.toThrow(RequestError)
    })
  })
})
