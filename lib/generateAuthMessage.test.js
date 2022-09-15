const generateAuthMessage = require('./generateAuthMessage')

describe('generateAuthMessage', () => {
  it('defaults to using raw nonce as message', () => {
    const msg = generateAuthMessage('1615893628.661')
    expect(msg).toEqual('1615893628.661')
  })

  it('detects v1 nonce and uses raw nonce as message', () => {
    const msg = generateAuthMessage('v1-1615893628.661')
    expect(msg).toEqual('1615893628.661')
  })

  it('detects v2 nonce and generate human-readable message', () => {
    const msg = generateAuthMessage('v2-1615893628.661')
    expect(msg).toEqual(
      'Signing in to DeversiFi on Tue, 16 Mar 2021 11:20:28 GMT.'
        + ' For your safety, only sign this message on DeversiFi.',
    )
  })
})
