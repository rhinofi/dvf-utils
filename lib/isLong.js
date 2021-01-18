const Long = require('./Long')

module.exports = v => v instanceof Long || (v != null && v._bsontype === 'Long')
