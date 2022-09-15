module.exports = nonceStr => {
  if (nonceStr.includes('-')) {
    const [versionStr, nonceValue] = nonceStr.split('-')
    const authVersion = parseInt(versionStr.substr(1), 10)
    return [parseFloat(nonceValue), authVersion]
  }

  return [parseFloat(nonceStr), 1]
}
