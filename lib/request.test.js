const nock = require('nock')
const https = require('https')
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
  // Import current testEnvironment from jest config
  const testEnvironment = global.JEST_TEST_ENV

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

    it('formats qs array as repeat', async () => {
      requestNock.get(`${getTest.url}?test=value1&test=value2`).reply(200)

      await request.get(`${apiDomain}${getTest.url}`, {
        qs: {
          test: ['value1', 'value2']
        }
      })

      expect(requestNock.isDone()).toEqual(true)
    })

    it('Allows override of qs stringify options', async () => {
      requestNock.get(`${getTest.url}?test%5B%5D=value1&test%5B%5D=value2`).reply(200)

      await request.get(`${apiDomain}${getTest.url}`, {
        qs: {
          test: ['value1', 'value2']
        },
        qsOptions: {
          arrayFormat: 'brackets'
        }
      })

      expect(requestNock.isDone()).toEqual(true)
    })
  })

  describe('Success / Failure dependent on environment', () => {
    it('allows certificate data only when running in node environment', async () => {
      requestNock.get(getTest.url).reply(200, JSON.stringify(getTest.response))

      expect.assertions(1)

      let response

      try {
        response = await request.get(`${apiDomain}${getTest.url}`, {
          agent: new https.Agent()
        })
      } catch (error) {
        response = error
      }

      if (testEnvironment === 'node') {
        expect(response).toEqual(getTest.response)
      } else {
        expect(response).toBeInstanceOf(InvalidOptionError)
      }
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

    // Test below works but logs an error with jsDom environment.
    // TODO: submit an issue on nock's repo.
    it('fails with RequestError for no response', () => {
      return expect(request.get(`${apiDomain}${getTest.url}`))
        .rejects.toThrow(RequestError)
    })
  })
})
