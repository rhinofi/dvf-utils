/**
 * Wrapper for HTTP requests allowing switching
 * of underlying lib in one place.
 *
 * Current Lib: https://github.com/axios/axios
 */
const rq = require('axios')
const {
  RequestError,
  StatusCodeError,
  InvalidOptionError
} = require('./request.errors')

/**
 * Request Interceptor
 *
 * Modify request config before sending request.
 */
rq.interceptors.request.use((requestConfig) => {
  const { qs, ...config } = requestConfig

  // Avoid force JSON parsing when responseType not json
  if (config.responseType) {
    config.transitional.forcedJSONParsing = config.responseType === 'json'
  }

  // Switch wrapper qs option for lib param option
  if (qs) {
    config.params = qs
  }

  return config
})

/**
 * Response Interceptor
 *
 * Respond with abstracted custom errors instead of
 * library specific ones.
 */
rq.interceptors.response.use((response) => {
  return response
}, (error) => {
  const { message, status, config: { url } } = error.toJSON?.() ?? {
    message: 'Unknown',
    status: 0,
    config: { url: '' }
  }

  // Server errors and no response errors
  if (error.response) {
    throw new StatusCodeError(status, `${message} (${url})`)
  } else if (error.request) {
    throw new RequestError(`${message} (${url})`)
  }

  // Pre request error (request not sent)
  throw new Error(message)
})

/**
 * Valid Options for requests.
 *
 * Avoids exposing all underlying params of wrapped
 * lib so less maintenance needed for future
 * switches.
 */
const validRequestOptions = [
  'qs',
  'data',
  'headers',
  'responseType',
  'timeout'
]

/**
 * Send Request
 *
 * Method used for all requests in Request class.  Allows
 * consistent request / response without repeat code.
 *
 * Return type dependant on responseType param (default json)
 * and fullResponse param (default false - returns data only,
 * if true additionally returns headers, statusCode, etc).
 *
 * @param {string} method Type of request (get, post, etc).
 * @param {string} url Desitination url for request.
 * @param {object} options Options to send with request.
 * @returns {*} result Type dependant on responseType and fullResponse.
 */
const sendRequest = async (method, url, options = {}) => {
  const { fullResponse, ...rqOptions } = options

  // Validate options
  for (const option of Object.keys(rqOptions)) {
    if (!validRequestOptions.includes(option)) {
      throw new InvalidOptionError(option, method)
    }
  }

  // Keep result without original request / config
  const { request, config, status, ...result } = await rq({
    method: method,
    url: url,
    ...rqOptions
  })

  if (fullResponse === true) {
    return {
      statusCode: status,
      ...result
    }
  }

  return result.data
}

/**
 * Request class
 *
 * Currently exposes only get and post, we could expose
 * more, head, options, put, patch, delete statically as
 * below or use a Proxy to forward dependent on method.
 */
class Request {
  static async get (url, options = {}) {
    if ('data' in options) {
      throw new InvalidOptionError('data', 'get')
    }

    return await sendRequest('get', url, options)
  }

  static async post (url, options) {
    return await sendRequest('post', url, options)
  }
}

module.exports = Request
