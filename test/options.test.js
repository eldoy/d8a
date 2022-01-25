const { validate, locales } = require('../index.js')

/** Testing options */

describe('options', () => {

  // Test strict mode option
  it('should support strict mode', async () => {
    let spec = {
      val: {
        eq: 1
      }
    }
    let data = { key: 'string' }

    let result = await validate(spec, data)
    expect(result).toBeNull()

    result = await validate(spec, data, { mode: 'strict' })
    expect(result.val[0]).toBe('must be equal to 1')
  })

  // Test callback extension
  it('should support callback extension', async () => {
    let spec = {
      val: {
        unique: true
      }
    }
    let data = { val: 'string' }

    const ext = {
      unique: {
        type: 'bool',
        fn: async function({ field, add, t }) {
          add(field, 'must be unique')
        }
      }
    }

    error = await validate(spec, data, { ext })
    expect(error.val).toEqual(['must be unique'])
  })

  // Test extension with locales
  it('should support extension with locales', async () => {
    let spec = {
      val: {
        unique: true
      }
    }
    let data = { val: 'string' }

    const ext = {
      unique: {
        type: 'bool',
        fn: async function({ field, add, t }) {
          add(field, t('unique'))
        }
      }
    }

    const locales = {
      en: {
        validation: {
          unique: 'must be unique'
        }
      }
    }

    error = await validate(spec, data, { ext, locales })
    expect(error.val).toEqual(['must be unique'])
  })
})
