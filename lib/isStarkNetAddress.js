// TODO: Can probably be improve (ex: size of 64 is not mandatory but just usual)
module.exports = value => /^0x[0-9abcdefABCDEF]{64}$/.test(value)
