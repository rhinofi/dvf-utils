const Long = require('./Long')

// eslint-disable-next-line no-underscore-dangle
module.exports = v => v instanceof Long || (v != null && v._bsontype === 'Long')
