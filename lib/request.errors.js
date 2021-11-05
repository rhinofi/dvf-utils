/**
 * Error instances used in request lib
 */

// RequestError - Server does not respond
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

// StatusCodeError - Server sends error response
class StatusCodeError extends Error {
  constructor (code, message) {
    super()

    this.name = 'StatusCodeError'
    this.message = String(message)
    this.statusCode = code

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

// InvalidOptionError
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
