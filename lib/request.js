/**
 * Wrapper for HTTP requests allowing switching
 * of underlying lib in one place.
 *
 * Current Lib: https://github.com/axios/axios
 * Query String Lib: https://github.com/ljharb/qs#stringifying
 */
const R = require('ramda')
const httpRequest = require('axios')
const Qs = require('qs')
const isEnvironmentNode = require('./isEnvironmentNode')
const requestErrors = require('./requestErrors')

const {
  RequestError,
  StatusCodeError,
  InvalidOptionError,
} = requestErrors

/**
 * Request Interceptor
 *
 * Modify request config before sending request.
 */
httpRequest.interceptors.request.use(requestConfig => {
  const { qs, qsOptions = {}, headers = {}, ...config } = requestConfig

  // Avoid force JSON parsing when responseType not json
  config.transitional.forcedJSONParsing = config.responseType === 'json'

  // Explicitly set accept header for json requests
  config.headers = {
    ...(
      config.responseType === 'json'
        ? { accept: 'application/json' }
        : {}
    ),
    ...headers,
  }

  // Switch wrapper qs option for lib param option
  if (qs) {
    config.params = qs
    config.paramsSerializer = params =>
      Qs.stringify(params, {
        arrayFormat: 'repeat',
        ...(qsOptions || {}),
      })
  }

  return config
})

/**
 * Response Interceptor
 *
 * Respond with abstracted custom errors instead of
 * library specific ones.
 */
httpRequest.interceptors.response.use(
  response => response,
  error => {
    const { message, status, config: { url } } =
      (error.toJSON && error.toJSON())
      || {
        message: 'Unknown',
        status: 0,
        config: { url: '' },
      }

    // Server errors and no response errors
    if (error.response) {
      throw new StatusCodeError(status, message, error.response.data, url)
    } else if (error.request) {
      throw new RequestError(message, url)
    }

    throw error
  },
)

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
  'fullResponse',
  'invalidOptions',
  'signal',
  'qsOptions',
]

/**
 * Additional node only options
 */
const nodeOnlyRequestOptions = [
  'agent',
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

  // Check passed invalid options
  if (Array.isArray(options.invalidOptions)) {
    validOptions = validOptions.filter(option =>
      !options.invalidOptions.includes(option)
    )
  }

  // Validate options
  for (const option of Object.keys(options)) {
    if (!validOptions.includes(option)) {
      throw new InvalidOptionError(option, method)
    }
  }

  const { agent, fullResponse, responseType } = options
  // Extract non request options
  const requestOptions = R.omit(
    [
      'fullResponse',
      'agent',
      'invalidOptions',
      'responseType',
    ],
    options,
  )

  // Auto switch agent type
  if (agent) {
    const agentType = agent.defaultPort === 80 ? 'http' : 'https'
    requestOptions[`${agentType}Agent`] = agent
  }

  // Keep result without original request / config
  const response = await httpRequest({
    method,
    url,
    responseType: responseType || 'json',
    ...requestOptions,
  })

  const { status } = response
  const result = R.omit(
    [
      'request',
      'config',
      'status',
    ],
    response,
  )

  if (fullResponse === true) {
    return {
      statusCode: status,
      ...result,
    }
  }

  return result.data
}

module.exports = {
  get: (url, options = {}) =>
    sendRequest('get', url, { ...options, invalidOptions: ['data'] }),
  head: (url, options = {}) =>
    sendRequest('head', url, { ...options, invalidOptions: ['data'] }),
  options: (url, options = {}) =>
    sendRequest('options', url, { ...options, invalidOptions: ['data'] }),
  post: (url, options) => sendRequest('post', url, options),
  put: (url, options) => sendRequest('put', url, options),
  patch: (url, options) => sendRequest('patch', url, options),
  delete: (url, options) => sendRequest('delete', url, options),
  errors: requestErrors,
}
