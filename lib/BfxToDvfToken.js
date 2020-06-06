const mapping = require('../config/config').tokenMapping
const _ = require('lodash')

module.exports = (token) => (_.invert(mapping)[token] || token)
