const d8a = require('../index.js')

/** Testing deny function */

describe('deny', () => {

  // Test deny fields
  it('should deny fields', async () => {
    let obj = {
      val: 1
    }
    let result = await d8a().deny(obj, ['val'])
    expect(result.val[0]).toBe('is denied')
  })

  // Test not deny fields
  it('should not deny fields', async () => {
    let obj = {
      val: 1
    }
    let result = await d8a().deny(obj, ['key'])
    expect(result).toBeNull()
  })
})
