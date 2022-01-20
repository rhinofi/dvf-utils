const mapping = require('../config/config').tokenMapping
const _invert = require('lodash/invert')

module.exports = (token) => (_invert(mapping)[token.toUpperCase()] || token)
