const mapping = require('../config/config').tokenMapping

module.exports = (token) => (mapping[token.toUpperCase()] || token)
