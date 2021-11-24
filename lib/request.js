/**
 * Wrapper for HTTP requests allowing switching
 * of underlying lib in one place.
 *
 * Current Lib: https://github.com/axios/axios
 */
const httpRequest = require('axios')
const isEnvironmentNode = require('./isEnvironmentNode')
const requestErrors = require('./requestErrors')
const {
  RequestError,
  StatusCodeError,
  InvalidOptionError
} = requestErrors

/**
 * Request Interceptor
 *
 * Modify request config before sending request.
 */
httpRequest.interceptors.request.use((requestConfig) => {
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
httpRequest.interceptors.response.use((response) => {
  return response
}, (error) => {
  const { message, status, config: { url } } = (error.toJSON && error.toJSON()) || {
    message: 'Unknown',
    status: 0,
    config: { url: '' }
  }

  // Server errors and no response errors
  if (error.response) {
    throw new StatusCodeError(status, `${message} (${url})`, error.response.data)
  } else if (error.request) {
    throw new RequestError(`${message} (${url})`)
  }

  throw error
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
  'timeout',
  'fullResponse'
]

/**
 * Additional node only options
 */
const nodeOnlyRequestOptions = [
  'agent'
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
  let validOptions = validRequestOptions

  // Allow additional options for node env
  if (isEnvironmentNode()) {
    validOptions = [...validOptions, ...nodeOnlyRequestOptions]
  }

  // Validate options
  for (const option of Object.keys(options)) {
    if (!validOptions.includes(option)) {
      throw new InvalidOptionError(option, method)
    }
  }

  // Extract non request options
  const { fullResponse, agent, ...requestOptions } = options

  // Auto switch agent type
  if (agent) {
    const agentType = agent.defaultPort === 80 ? 'http' : 'https'
    requestOptions[`${agentType}Agent`] = agent
  }

  // Keep result without original request / config
  const { request, config, status, ...result } = await httpRequest({
    method: method,
    url: url,
    ...requestOptions
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
 * Proxied to sendRequest with method set to get.
 *
 * @param {string} url
 * @param {object} options
 * @return {*}
 */
const get = async (url, options = {}) => {
  if ('data' in options) {
    throw new InvalidOptionError('data', 'get')
  }

  return await sendRequest('get', url, options)
}

/**
 * Proxied to sendRequest with method set to post.
 *
 * @param {string} url
 * @param {object} options
 * @return {*}
 */
const post = async (url, options) => {
  return await sendRequest('post', url, options)
}

module.exports = {
  get,
  post,
  errors: requestErrors
}
