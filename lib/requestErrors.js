/**
 * Error instances used in request lib
 */

/**
 * RequestError
 *
 * Used when server does not respond to HTTP
 * request.
 *
 * @param {string} message Reason for request error.
 */
class RequestError extends Error {
  constructor (message) {
    super()

    this.name = 'RequestError'
    this.message = String(message)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

/**
 * StatusCodeError
 *
 * Used when server sends error response to
 * HTTP request.
 *
 * @param {number} code HTTP response code.
 * @param {string} message Reason for request error.
 */
class StatusCodeError extends Error {
  constructor (code, message, data = {}) {
    super()

    this.name = 'StatusCodeError'
    this.message = String(message)
    this.statusCode = code
    this.body = data

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

/**
 * InvalidOptionError
 *
 * Used when request method called with invalid
 * options - exits before request sent.
 *
 * @param {string} option Name of option triggering error.
 * @param {string} method Name of method called (get, post, etc).
 */
class InvalidOptionError extends Error {
  constructor (option, method = '') {
    super()

    this.name = 'InvalidOptionError'
    this.message = `Invalid option '${option}' for request`

    if (method) {
      this.message += ` method ${method.toUpperCase()}`
    }

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

module.exports = {
  RequestError,
  StatusCodeError,
  InvalidOptionError
}
