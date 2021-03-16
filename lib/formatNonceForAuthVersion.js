module.exports = (nonce, authVersion) => {
  return `v${authVersion}-${nonce.toString()}`
}
