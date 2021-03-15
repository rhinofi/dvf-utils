module.exports = (version = 2) => {
  switch (version) {
    // New authentication method where an human-readable message is signed
    case 2:
      return nonce => {
        const formattedUTCDate = new Date(nonce * 1000).toUTCString()
        return `Signing in to DeversiFi on ${formattedUTCDate}. For your safety, only sign this message on DeversiFi.`.toString(16)
      }
    default:
      // Original authentication method where raw nonce was signed
      return nonce => nonce.toString().toString(16)
  }
}
