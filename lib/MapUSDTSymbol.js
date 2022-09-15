const mapping = require('../config/config').USDTMapping

module.exports = symbol => (mapping[symbol] || symbol)
