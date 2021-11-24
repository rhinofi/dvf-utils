/**
 * Check if current environment is node or browser
 *
 * @returns {boolean} isNode
 */
module.exports = () => {
  let isNode = typeof process !== 'undefined' && process.versions && process.versions.node

  // Check emulated dom
  if (typeof window !== 'undefined' && window.document) {
    isNode = false
  }

  return isNode
}
