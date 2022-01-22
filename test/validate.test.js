const { validate, locales } = require('../index.js')

const opt = {}

/** Testing validate functions */

describe('validate', () => {

  // Test required: true
  it('should require a value to be set', async () => {
    let spec = {
      val: {
        required: true
      }
    }
    let data = {}
    let error = await validate(spec, data, opt)
    expect(error.val).toEqual(['is required'])

    data = { val: 'hello' }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()
  })

  // Test required: function
  it('should require a value to be set as a function', async () => {
    let spec = {
      val: {
        required: async function(val, opt) {
          return true
        }
      }
    }
    let data = {}
    let error = await validate(spec, data, opt)
    expect(error.val).toEqual(['is required'])

    data = { val: 'hello' }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()
  })

  // Test eq
  it('should be equal to x', async () => {
    let spec = {
      val: {
        eq: 6
      }
    }
    let data = {
      val: 4
    }
    let error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be equal to 6'])

    data = {
      val: 6
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()
  })

  // Test eq as default
  it('should have eq as default', async () => {
    let spec = {
      val: 6
    }
    let data = {
      val: 4
    }
    let error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be equal to 6'])

    data = {
      val: 6
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()
  })

  // Test eq for objects
  it('should do eq for objects', async () => {
    let spec = {
      val: { a: 1, b: { c: 2 } }
    }

    data = {
      val: { a: 1, b: { c: 2 } }
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()
  })

  // Test eq for arrays
  it('should do eq for arrays', async () => {
    let spec = {
      val: [1, 2, 3]
    }

    data = {
      val: [1, 2, 3]
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()
  })

  // Test eq for integers
  it('should do eq for arrays', async () => {
    let spec = 1
    data = 2

    let error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be equal to 1'])

    data = 1
    error = await validate(spec, data, opt)

    expect(error).toBeNull()
  })

  // Test ne
  it('should not be equal to x', async () => {
    let spec = {
      val: {
        ne: 6
      }
    }
    let data = {
      val: 6
    }
    let error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must not be equal to 6'])

    data = {
      val: 4
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()
  })

  // Test gt
  it('should be greater than x', async () => {
    let spec = {
      val: {
        gt: 4
      }
    }
    let data = {
      val: 4
    }
    let error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be greater than 4'])

    data = {
      val: 'string'
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be greater than 4'])

    data = {
      val: 5
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()
  })

  // Test lt
  it('should be less than x', async () => {
    let spec = {
      val: {
        lt: 3
      }
    }
    let data = {
      val: 4
    }
    let error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be less than 3'])

    data = {
      val: 'string'
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be less than 3'])

    data = {
      val: 2
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()
  })

  // Test gte
  it('should be greater than or equal to x', async () => {
    let spec = {
      val: {
        gte: 3
      }
    }
    let data = {
      val: 2
    }
    let error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be greater than or equal to 3'])

    data = {
      val: 'string'
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be greater than or equal to 3'])

    data = {
      val: 3
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {
      val: 4
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()
  })

  // Test lte
  it('should be less than or equal to x', async () => {
    let spec = {
      val: {
        lte: 3
      }
    }
    let data = {
      val: 4
    }
    let error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be less than or equal to 3'])

    data = {
      val: 'string'
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be less than or equal to 3'])

    data = {
      val: 3
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {
      val: 2
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()
  })

  // Test in
  it('should error if value is not in array', async () => {
    let spec = {
      val: {
        in: [5, 6]
      }
    }
    let data = {
      val: 5
    }
    let error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {
      val: 6
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {
      val: 7
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be one of 5, 6'])
  })

  // Test nin
  it('should error if value is in array', async () => {
    let spec = {
      val: {
        nin: [5, 6]
      }
    }
    let data = {
      val: 4
    }
    let error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {
      val: 7
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {
      val: 5
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must not be one of 5, 6'])
  })

  // Test match: /regex/
  it('should match regex', async () => {
    let spec = {
      val: {
        match: /regex/
      }
    }
    let data = {
      val: null
    }
    let error = await validate(spec, data, opt)
    expect(error.val).toEqual(["must match '/regex/'"])

    data = {
      val: 5
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(["must match '/regex/'"])

    data = {
      val: new Date()
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(["must match '/regex/'"])

    data = {
      val: 'string'
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(["must match '/regex/'"])

    data = {
      val: {}
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(["must match '/regex/'"])

    data = {
      val: 'regex'
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()
  })

  // Test matcher
  it('should use a matcher function', async () => {
    let spec = {
      val: {
        matcher: async function(val) {
          if (val === 5) {
            return 'can not be 5'
          }
        }
      }
    }
    let data = {
      val: 5
    }
    let error = await validate(spec, data, opt)
    expect(error.val).toEqual(['can not be 5'])

    data = {
      val: 4
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {}

    error = await validate(spec, data, opt)
    expect(error).toBeNull()
  })

  // Test length
  it('should have a length', async () => {
    let spec = {
      val: {
        length: 5
      }
    }

    let data = {
      val: null
    }
    let error = await validate(spec, data, opt)
    expect(error.val).toEqual(['length must be 5'])

    data = {
      val: 5
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['length must be 5'])

    data = {
      val: new Date()
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['length must be 5'])

    data = {
      val: 'hey'
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['length must be 5'])

    data = {
      val: {}
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['length must be 5'])

    data = {
      val: 'hello'
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()
  })

  // Test minlength
  it('should have a min length', async () => {
    let spec = {
      val: {
        minlength: 5
      }
    }

    let data = {
      val: null
    }
    let error = await validate(spec, data, opt)
    expect(error.val).toEqual(['minimum length is 5'])

    data = {
      val: 5
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['minimum length is 5'])

    data = {
      val: new Date()
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['minimum length is 5'])

    data = {
      val: 'hey'
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['minimum length is 5'])
    data = {
      val: {}
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['minimum length is 5'])

    data = {
      val: 'hello'
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()
  })

  // Test maxlength
  it('should have a max length', async () => {
    let spec = {
      val: {
        maxlength: 5
      }
    }
    let data = {
      val: null
    }
    let error = await validate(spec, data, opt)
    expect(error.val).toEqual(['maximum length is 5'])

    data = {
      val: 5
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['maximum length is 5'])

    data = {
      val: new Date()
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['maximum length is 5'])

    data = {
      val: 'hey'
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()
    data = {
      val: {}
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['maximum length is 5'])

    data = {
      val: 'hello!'
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['maximum length is 5'])
  })

  // Test is: optboolean
  it('should be boolean', async () => {
    let spec = {
      val: {
        is: 'boolean'
      }
    }
    let data = {
      val: null
    }
    let error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be true or false'])

    data = {
      val: 5
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be true or false'])

    data = {
      val: 'string'
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be true or false'])

    data = {
      val: true
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {
      val: false
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()
  })

  // Test is: optstring
  it('should be string', async () => {
    let spec = {
      val: {
        is: 'string'
      }
    }
    let data = {
      val: null
    }
    let error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be a string'])

    data = {
      val: 5
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be a string'])

    data = {
      val: 'string'
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {
      val: true
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be a string'])

    data = {
      val: false
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be a string'])
  })

  // Test is: optnumber
  it('should be number', async () => {
    let spec = {
      val: {
        is: 'number'
      }
    }
    let data = {
      val: null
    }
    let error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be a number'])

    data = {
      val: 5
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {
      val: 5.3
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {
      val: 'string'
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be a number'])

    data = {
      val: true
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be a number'])

    data = {
      val: false
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be a number'])
  })

  // Test is: optinteger
  it('should be an integer', async () => {
    let spec = {
      val: {
        is: 'integer'
      }
    }
    let data = {
      val: null
    }
    let error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be an integer'])

    data = {
      val: 5
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {
      val: 5.3
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be an integer'])

    data = {
      val: 'string'
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be an integer'])

    data = {
      val: true
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be an integer'])

    data = {
      val: false
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be an integer'])
  })

  // Test is: optdecimal
  it('should be decimal', async () => {
    let spec = {
      val: {
        is: 'decimal'
      }
    }
    let data = {
      val: null
    }
    let error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be a decimal'])

    data = {
      val: 5
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be a decimal'])

    data = {
      val: 5.3
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {
      val: 'string'
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be a decimal'])

    data = {
      val: true
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be a decimal'])

    data = {
      val: false
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be a decimal'])
  })

  // Test is: optdate
  it('should be date', async () => {
    let spec = {
      val: {
        is: 'date'
      }
    }
    let data = {
      val: null
    }
    let error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be a date'])

    data = {
      val: 5
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be a date'])

    data = {
      val: new Date()
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {
      val: 'string'
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be a date'])

    data = {
      val: true
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be a date'])

    data = {
      val: false
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be a date'])
  })

  // Test is: optid
  it('should be id', async () => {
    let spec = {
      val: {
        is: 'id'
      }
    }
    let data = {
      val: null
    }
    let error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be an id'])

    data = {
      val: 5
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be an id'])

    data = {
      val: new Date()
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be an id'])

    data = {
      val: 'string'
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be an id'])

    data = {
      val: '507f1f77bcf86cd799439011'
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {
      val: 'ck2m9iwoo0001akps7f5fh8we'
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()
  })

  // Test is: optobject
  it('should be object', async () => {
    let spec = {
      val: {
        is: 'object'
      }
    }
    let data = {
      val: null
    }
    let error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be an object'])

    data = {
      val: 5
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be an object'])

    data = {
      val: new Date()
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be an object'])

    data = {
      val: 'string'
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be an object'])

    data = {
      val: {}
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()
  })

  // Test is: optarray
  it('should be array', async () => {
    let spec = {
      val: {
        is: 'array'
      }
    }
    let data = {
      val: null
    }
    let error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be an array'])

    data = {
      val: 5
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be an array'])

    data = {
      val: new Date()
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be an array'])

    data = {
      val: 'string'
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be an array'])
    data = {
      val: {}
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be an array'])

    data = {
      val: []
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()
  })

  // Test is: optemail
  it('should be email', async () => {
    let spec = {
      val: {
        is: 'email'
      }
    }
    let data = {
      val: null
    }
    let error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be an email'])

    data = {
      val: 5
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be an email'])

    data = {
      val: new Date()
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be an email'])

    data = {
      val: 'string'
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be an email'])
    data = {
      val: {}
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be an email'])

    data = {
      val: 'mail@example.com'
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()
  })

  // Test is: opturl
  it('should be url', async () => {
    let spec = {
      val: {
        is: 'url'
      }
    }
    let data = {
      val: null
    }
    let error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be a URL'])

    data = {
      val: 5
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be a URL'])

    data = {
      val: new Date()
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be a URL'])

    data = {
      val: 'string'
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be a URL'])
    data = {
      val: {}
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be a URL'])

    data = {
      val: 'http://example.com'
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()
  })

  // Test deeply nested values
  it('should validate deeply nested values', async () => {
    let spec = {
      'street.name': {
        maxlength: 5
      }
    }
    let data = {
      street: {
        name: 'hello!'
      }
    }
    let error = await validate(spec, data, opt)
    expect(error.street.name).toEqual(['maximum length is 5'])
  })

  // Test deeply nested values with array
  it('should validate nested values with array', async () => {
    let spec = {
      'cars.name[0]': {
        eq: 'cart'
      }
    }
    let data = {
      cars: {
        name: ['cart']
      }
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()
  })

  // Test required with other
  it('should show either require or minlength', async () => {
    let spec = {
      val: {
        required: true,
        minlength: 2
      }
    }
    let data = {}
    let error = await validate(spec, data, opt)
    expect(error.val).toEqual(['is required'])

    data = { val: 'h' }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['minimum length is 2'])

    data = { val: 'hello' }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = { val: null }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['minimum length is 2'])

    data = { val: new Date() }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['minimum length is 2'])
  })

  // Test multiple error range
  it('should multiple error range', async () => {
    let spec = {
      val: {
        gt: 2,
        lt: 5
      }
    }
    let data = { val: 1 }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be greater than 2'])

    data = { val: 6 }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be less than 5'])

    data = { val: 3 }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()
  })

  // Test multiple error range
  it('should multiple error', async () => {
    let spec = {
      val: {
        is: 'integer',
        eq: 5
      }
    }
    let data = { val: 'string' }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be an integer', 'must be equal to 5'])

    data = { val: 6 }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be equal to 5'])

    data = { val: 5 }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()
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
