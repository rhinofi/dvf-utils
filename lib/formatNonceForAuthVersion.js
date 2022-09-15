module.exports = (nonce, authVersion) => `v${authVersion}-${nonce.toString()}`
