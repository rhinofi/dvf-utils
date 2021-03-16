const extractNonceAndAuthVersion = require('./extractNonceAndAuthVersion')
const generateAuthMessageForAuthVersion = require('./generateAuthMessageForAuthVersion')

module.exports = nonceStr => {
  const [nonce, authVersion] = extractNonceAndAuthVersion(nonceStr)
  return generateAuthMessageForAuthVersion(nonce, authVersion)
}
