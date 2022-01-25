const d8a = require('../index.js')

/** Testing allow function */

describe('allow', () => {

  // Test allow fields
  it('should allow fields', async () => {
    let obj = {
      val: 1
    }
    let result = await d8a().allow(obj, ['val'])
    expect(result).toBeNull()
  })

  // Test disallow fields
  it('should disallow fields', async () => {
    let obj = {
      val: 1
    }
    let result = await d8a().allow(obj, ['key'])
    expect(result.key[0]).toBe('is not allowed')
  })
})