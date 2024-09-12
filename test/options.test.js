var { validate, locales } = require('../index.js')

describe('options', () => {
  // Test lax option
  it('should not process undefined if lax', async () => {
    var spec = {
      val: {
        eq: 1
      }
    }
    var data = { key: 'string' }

    var result = await validate(spec, data)
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
    var spec = {
      val: {
        unique: true
      }
    }
    var data = { val: 'string' }

    var ext = {
      unique: {
        type: 'bool',
        fn: async function ({ field, add, t }) {
          add(field, 'must be unique')
        }
      }
    }

    error = await validate(spec, data, { ext })
    expect(error.val).toEqual(['must be unique'])
  })

  // Test extension with locales
  it('should support extension with locales', async () => {
    var spec = {
      val: {
        unique: true
      }
    }
    var data = { val: 'string' }

    var ext = {
      unique: {
        type: 'bool',
        fn: async function ({ field, add, t }) {
          add(field, t('unique'))
        }
      }
    }

    var locales = {
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
    var spec = {
      val: {
        matcher: async function (val, $) {
          $.hello = 'hi'
        }
      }
    }
    var data = { val: 'string' }
    var $ = {}
    var result = await validate(spec, data, { $ })

    expect(result).toBeNull()
    expect($.hello).toBe('hi')
  })
})
