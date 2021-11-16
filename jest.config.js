module.exports = {
  projects: [
    {
      displayName: 'browser',
      testEnvironment: 'jsdom',
      globals: {
        JEST_TEST_ENV: 'jsdom'
      }
    },
    {
      displayName: 'node',
      testEnvironment: 'node',
      globals: {
        JEST_TEST_ENV: 'node'
      }
    }
  ]
}
