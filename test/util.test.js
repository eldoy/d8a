var { util } = require('../index.js')

describe('util', () => {
  // Test sort object single key
  it('should sort object with single key', async () => {
    var obj = {
      name: {
        is: 'string',
        required: true
      }
    }

    var result = util.sort(obj)
    var keys = Object.keys(result.name)
    expect(keys.length).toBe(2)
    expect(keys[0]).toBe('required')
    expect(keys[1]).toBe('is')
  })

  // Test sort object multiple keys
  it('should sort object with multiple keys', async () => {
    var obj = {
      name: {
        is: 'string',
        required: true
      },
      email: {
        is: 'email',
        required: true
      }
    }

    var result = util.sort(obj)
    var keys1 = Object.keys(result.name)
    expect(keys1.length).toBe(2)
    expect(keys1[0]).toBe('required')
    expect(keys1[1]).toBe('is')

    var keys2 = Object.keys(result.email)
    expect(keys2.length).toBe(2)
    expect(keys2[0]).toBe('required')
    expect(keys2[1]).toBe('is')
  })

  // Test sort add eq as default
  it('should sort object with multiple keys', async () => {
    var obj = {
      name: 'hello'
    }
    var result = util.sort(obj)
    expect(obj).toEqual({ name: { eq: 'hello' } })
  })
})
