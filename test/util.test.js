const { util } = require('../index.js')

/** Testing util */

describe('util', () => {
  // Test sort object single key
  it('should sort object with single key', async () => {
    let obj = {
      name: {
        is: 'string',
        required: true
      }
    }

    let result = util.sort(obj)
    const keys = Object.keys(result.name)
    expect(keys.length).toBe(2)
    expect(keys[0]).toBe('required')
    expect(keys[1]).toBe('is')
  })

  // Test sort object multiple keys
  it('should sort object with multiple keys', async () => {
    let obj = {
      name: {
        is: 'string',
        required: true
      },
      email: {
        is: 'email',
        required: true
      }
    }

    let result = util.sort(obj)
    const keys1 = Object.keys(result.name)
    expect(keys1.length).toBe(2)
    expect(keys1[0]).toBe('required')
    expect(keys1[1]).toBe('is')

    const keys2 = Object.keys(result.email)
    expect(keys2.length).toBe(2)
    expect(keys2[0]).toBe('required')
    expect(keys2[1]).toBe('is')
  })

  // Test sort add eq as default
  it('should sort object with multiple keys', async () => {
    let obj = {
      name: 'hello'
    }
    let result = util.sort(obj)
    expect(obj).toEqual({ name: { eq: 'hello' } })
  })
})
