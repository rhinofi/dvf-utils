module.exports = nonceStr => {
  return `Signing in to DeversiFi using nonce (${nonceStr}). For your security, only sign this message on DeversiFi.`.toString(16)
}
