const d8a = require('../index.js')

/** Testing d8a options */

describe('options', () => {

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

    error = await d8a({ ext }).validate(spec, data)
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

    error = await d8a({ ext, locales }).validate(spec, data)
    expect(error.val).toEqual(['must be unique'])
  })
})
