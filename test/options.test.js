const { validate, locales } = require('../index.js')

/** Testing options */

describe('options', () => {

  // Test lax option
  it('should not process undefined if lax', async () => {
    let spec = {
      val: {
        eq: 1
      }
    }
    let data = { key: 'string' }

    let result = await validate(spec, data)
    expect(result.val).toEqual(['must be equal to 1'])

    result = await validate(spec, data, { lax: true })
    expect(result).toBeNull()

    data = { val: 2 }
    result = await validate(spec, data, { lax: true })
    expect(result.val).toEqual(['must be equal to 1'])

    data = {}
    spec = {
      val: {
        required: true
      }
    }

    result = await validate(spec, data, { lax: true })
    expect(result.val).toEqual(['is required'])
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

  // Test opt params
  it('should mutate opt params', async () => {
    let spec = {
      val: {
        matcher: async function(val, $) {
          $.hello = 'hi'
        }
      }
    }
    let data = { val: 'string' }
    const params = {}
    let result = await validate(spec, data, { params })

    expect(result).toBeNull()
    expect(params.hello).toBe('hi')
  })
})
