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

  // Test missing field
  it('should validate against missing field', async () => {
    let spec = {
      val: {
        eq: 1
      }
    }
    let data = { key: 'string' }

    let result = await validate(spec, data)
    expect(result.val[0]).toBe('must be equal to 1')
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

    // Support array
    data = {
      val: [5, 6]
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {
      val: [5, 6, 7]
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be one of 5, 6'])

    data = {
      val: []
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    // Support object
    spec = {
      val: {
        in: ['a', 'b']
      }
    }
    data = {
      val: { a: 5, b: 6 }
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {
      val: { c: 7 }
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be one of a, b'])

    data = {
      val: {}
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()
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

    // Support array
    data = {
      val: [5, 6]
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must not be one of 5, 6'])

    data = {
      val: [5, 6, 7]
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must not be one of 5, 6'])

    data = {
      val: [7, 8]
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {
      val: []
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    // Support object
    spec = {
      val: {
        nin: ['a', 'b']
      }
    }
    data = {
      val: { a: 5, b: 6 }
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must not be one of a, b'])

    data = {
      val: { c: 7 }
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {
      val: {}
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()
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

    // Support array
    data = {
      val: []
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['length must be 5'])

    data = {
      val: [1, 2, 3]
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['length must be 5'])

    data = {
      val: [1, 2, 3, 4, 5]
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    // Support object
    data = {
      val: {}
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['length must be 5'])

    data = {
      val: { a: 1, b: 2, c: 3 }
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['length must be 5'])

    data = {
      val: { a: 1, b: 2, c: 3, d: 4, e: 5 }
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()
  })

  // Test min
  it('should have a min length', async () => {
    let spec = {
      val: {
        min: 5
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

    // Support array
    data = {
      val: []
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['minimum length is 5'])

    data = {
      val: [1, 2, 3]
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['minimum length is 5'])

    data = {
      val: [1, 2, 3, 4, 5]
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {
      val: [1, 2, 3, 4, 5, 6, 7]
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    // Support object
    data = {
      val: {}
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['minimum length is 5'])

    data = {
      val: { a: 1, b: 2, c: 3 }
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['minimum length is 5'])

    data = {
      val: { a: 1, b: 2, c: 3, d: 4, e: 5 }
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {
      val: { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7 }
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()
  })

  // Test max
  it('should have a max length', async () => {
    let spec = {
      val: {
        max: 5
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
      val: 'hello!'
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['maximum length is 5'])

    // Support array
    data = {
      val: []
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {
      val: [1, 2, 3]
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {
      val: [1, 2, 3, 4, 5]
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {
      val: [1, 2, 3, 4, 5, 6, 7]
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['maximum length is 5'])

    // Support object
    data = {
      val: {}
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {
      val: { a: 1, b: 2, c: 3 }
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {
      val: { a: 1, b: 2, c: 3, d: 4, e: 5 }
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {
      val: { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7 }
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['maximum length is 5'])
  })

  // Test is: boolean
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

  // Test is: string
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

  // Test is: number
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

  // Test is: integer
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

  // Test is: decimal
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

  // Test is: date
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
      val: '2022-01-25T08:20:07.144Z'
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

  // Test is: id
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

  // Test is: object
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

  // Test is: array
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

  // Test is: email
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

  // Test is: url
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

  // Test is: undefined
  it('should be undefined', async () => {
    let spec = {
      val: {
        is: 'undefined'
      }
    }
    let data = {
      val: undefined
    }
    let error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {}
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {
      val: 1
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be undefined'])

    data = {
      val: null
    }
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must be undefined'])
  })

  // Test isnt
  it('should be isnt', async () => {
    let spec = {
      val: {
        isnt: 'undefined'
      }
    }
    let data = {
      val: undefined
    }
    let error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must not be undefined'])

    data = {}
    error = await validate(spec, data, opt)
    expect(error.val).toEqual(['must not be undefined'])

    data = {
      val: 1
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    data = {
      val: null
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()
  })

  // Test deeply nested values
  it('should validate deeply nested values', async () => {
    let spec = {
      'street.name': {
        max: 5
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
  it('should show either require or min', async () => {
    let spec = {
      val: {
        required: true,
        min: 2
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

  // Test other with required
  it('should show required before min', async () => {
    let spec = {
      val: {
        min: 2,
        required: true
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

  // Test multiple error
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

  // Test multiple keys
  it('should multiple errors with multiple keys', async () => {
    let spec = {
      name: {
        required: true,
        is: 'string'
      },
      email: {
        required: true,
        is: 'email'
      }
    }
    let data = {}
    let error = await validate(spec, data, opt)
    expect(error.name).toEqual(['is required'])
    expect(error.email).toEqual(['is required'])
  })

  // Test custom error messages
  it('should work with custom error messages', async () => {
    let spec = {
      name: {
        required: {
          $val: true,
          message: 'has'
        }
      },
      email: {
        is: {
          $val: 'email',
          message: 'must be emaily'
        }
      },
      street: {
        min: {
          $val: 5,
          message: 'must be five'
        }
      }
    }
    let data = {}
    let error = await validate(spec, data, opt)
    expect(error.name).toEqual(['has'])
    expect(error.email).toEqual(['must be emaily'])
    expect(error.street).toEqual(['must be five'])
  })

  // Test ignore values
  it('should ignore values', async () => {
    let spec = {
      name: {
        min: 3,
        ignore: ''
      }
    }
    let data = {}
    let error = await validate(spec, data, opt)
    expect(error.name).toEqual(['minimum length is 3'])

    spec = {
      name: {
        ignore: '',
        min: 3
      }
    }
    data = {}
    error = await validate(spec, data, opt)
    expect(error.name).toEqual(['minimum length is 3'])

    data = {
      name: ''
    }
    error = await validate(spec, data, opt)
    expect(error).toBeNull()

    spec = {
      name: {
        min: 3,
        eq: 'bye',
        ignore: 'hello'
      }
    }
    data = {
      name: 'hello'
    }
    error = await validate(spec, data, opt)
    expect(error.name).toEqual(['must be equal to bye'])

    spec = {
      name: {
        min: 3,
        ignore: 'hello',
        eq: 'bye'
      }
    }

    error = await validate(spec, data, opt)
    expect(error).toBeNull()
  })
})
