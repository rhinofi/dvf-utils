// TODO: this file should start with lower case.
const invert = require('lodash/invert')

const mapping = require('../config/config').tokenMapping

module.exports = token => (invert(mapping)[token.toUpperCase()] || token)
