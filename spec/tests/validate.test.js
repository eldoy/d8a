var { validate, locales } = require('../../index.js')

var opt = {}

// Test required: true
it('should require a value to be set', async ({ t }) => {
  var spec = {
    val: {
      required: true
    }
  }
  var data = {}
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['is required'])

  data = { val: 'hello' }
  error = await validate(spec, data, opt)
  t.ok(error === null)
})

// Test missing field
it('should validate against missing field', async ({ t }) => {
  var spec = {
    val: {
      eq: 1
    }
  }
  var data = { key: 'string' }

  var result = await validate(spec, data)
  t.equal(result.val[0], 'must be equal to 1')
})

// Test required: function
it('should require a value to be set as a function', async ({ t }) => {
  var spec = {
    val: {
      required: async function (val, opt) {
        return true
      }
    }
  }
  var data = {}
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['is required'])

  data = { val: 'hello' }
  error = await validate(spec, data, opt)
  t.ok(error === null)
})

// Test eq
it('should be equal to x', async ({ t }) => {
  var spec = {
    val: {
      eq: 6
    }
  }
  var data = {
    val: 4
  }
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be equal to 6'])

  data = {
    val: 6
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)
})

// Test eq as default
it('should have eq as default', async ({ t }) => {
  var spec = {
    val: 6
  }
  var data = {
    val: 4
  }
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be equal to 6'])

  data = {
    val: 6
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)
})

// Test eq for objects
it('should do eq for objects', async ({ t }) => {
  var spec = {
    val: { a: 1, b: { c: 2 } }
  }

  data = {
    val: { a: 1, b: { c: 2 } }
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)
})

// Test eq for arrays
it('should do eq for arrays', async ({ t }) => {
  var spec = {
    val: [1, 2, 3]
  }

  data = {
    val: [1, 2, 3]
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)
})

// Test eq for integers
it('should do eq for arrays', async ({ t }) => {
  var spec = 1
  data = 2

  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be equal to 1'])

  data = 1
  error = await validate(spec, data, opt)

  t.ok(error === null)
})

// Test ne
it('should not be equal to x', async ({ t }) => {
  var spec = {
    val: {
      ne: 6
    }
  }
  var data = {
    val: 6
  }
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must not be equal to 6'])

  data = {
    val: 4
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)
})

// Test gt
it('should be greater than x', async ({ t }) => {
  var spec = {
    val: {
      gt: 4
    }
  }
  var data = {
    val: 4
  }
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be greater than 4'])

  data = {
    val: 'string'
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be greater than 4'])

  data = {
    val: 5
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)
})

// Test lt
it('should be less than x', async ({ t }) => {
  var spec = {
    val: {
      lt: 3
    }
  }
  var data = {
    val: 4
  }
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be less than 3'])

  data = {
    val: 'string'
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be less than 3'])

  data = {
    val: 2
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)
})

// Test gte
it('should be greater than or equal to x', async ({ t }) => {
  var spec = {
    val: {
      gte: 3
    }
  }
  var data = {
    val: 2
  }
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be greater than or equal to 3'])

  data = {
    val: 'string'
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be greater than or equal to 3'])

  data = {
    val: 3
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: 4
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)
})

// Test lte
it('should be less than or equal to x', async ({ t }) => {
  var spec = {
    val: {
      lte: 3
    }
  }
  var data = {
    val: 4
  }
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be less than or equal to 3'])

  data = {
    val: 'string'
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be less than or equal to 3'])

  data = {
    val: 3
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: 2
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)
})

// Test in
it('should error if value is not in array', async ({ t }) => {
  var spec = {
    val: {
      in: [5, 6]
    }
  }
  var data = {
    val: 5
  }
  var error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: 6
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: 7
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be one of 5, 6'])

  // Support array
  data = {
    val: [5, 6]
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: [5, 6, 7]
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be one of 5, 6'])

  data = {
    val: []
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

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
  t.ok(error === null)

  data = {
    val: { c: 7 }
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be one of a, b'])

  data = {
    val: {}
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)
})

// Test nin
it('should error if value is in array', async ({ t }) => {
  var spec = {
    val: {
      nin: [5, 6]
    }
  }
  var data = {
    val: 4
  }
  var error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: 7
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: 5
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must not be one of 5, 6'])

  // Support array
  data = {
    val: [5, 6]
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must not be one of 5, 6'])

  data = {
    val: [5, 6, 7]
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must not be one of 5, 6'])

  data = {
    val: [7, 8]
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: []
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

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
  t.deepEqual(error.val, ['must not be one of a, b'])

  data = {
    val: { c: 7 }
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: {}
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)
})

// Test match: /regex/
it('should match regex', async ({ t }) => {
  var spec = {
    val: {
      match: /regex/
    }
  }
  var data = {
    val: null
  }
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ["must match '/regex/'"])

  data = {
    val: 5
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ["must match '/regex/'"])

  data = {
    val: new Date()
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ["must match '/regex/'"])

  data = {
    val: 'string'
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ["must match '/regex/'"])

  data = {
    val: {}
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ["must match '/regex/'"])

  data = {
    val: 'regex'
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)
})

// Test matcher
it('should use a matcher function', async ({ t }) => {
  var spec = {
    val: {
      matcher: async function (val) {
        if (val === 5) {
          return 'can not be 5'
        }
      }
    }
  }
  var data = {
    val: 5
  }
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['can not be 5'])

  data = {
    val: 4
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {}

  error = await validate(spec, data, opt)
  t.ok(error === null)
})

it('should accept array from matcher function', async ({ t }) => {
  var spec = {
    val: {
      matcher: async function (val) {
        if (val === 5) {
          return ['can not be 5', 'should not be 5']
        }
      }
    }
  }
  var data = {
    val: 5
  }
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['can not be 5', 'should not be 5'])

  data = {
    val: 4
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {}

  error = await validate(spec, data, opt)
  t.ok(error === null)
})

// Test length
it('should have a length', async ({ t }) => {
  var spec = {
    val: {
      length: 5
    }
  }

  var data = {
    val: null
  }
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['length must be 5'])

  data = {
    val: 5
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['length must be 5'])

  data = {
    val: new Date()
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['length must be 5'])

  data = {
    val: 'hey'
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['length must be 5'])

  data = {
    val: {}
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['length must be 5'])

  data = {
    val: 'hello'
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  // Support array
  data = {
    val: []
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['length must be 5'])

  data = {
    val: [1, 2, 3]
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['length must be 5'])

  data = {
    val: [1, 2, 3, 4, 5]
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  // Support object
  data = {
    val: {}
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['length must be 5'])

  data = {
    val: { a: 1, b: 2, c: 3 }
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['length must be 5'])

  data = {
    val: { a: 1, b: 2, c: 3, d: 4, e: 5 }
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)
})

// Test min
it('should have a min length', async ({ t }) => {
  var spec = {
    val: {
      min: 5
    }
  }

  var data = {
    val: null
  }
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['minimum length is 5'])

  data = {
    val: 5
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['minimum length is 5'])

  data = {
    val: new Date()
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['minimum length is 5'])

  data = {
    val: 'hey'
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['minimum length is 5'])
  data = {
    val: {}
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['minimum length is 5'])

  data = {
    val: 'hello'
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  // Support array
  data = {
    val: []
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['minimum length is 5'])

  data = {
    val: [1, 2, 3]
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['minimum length is 5'])

  data = {
    val: [1, 2, 3, 4, 5]
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: [1, 2, 3, 4, 5, 6, 7]
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  // Support object
  data = {
    val: {}
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['minimum length is 5'])

  data = {
    val: { a: 1, b: 2, c: 3 }
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['minimum length is 5'])

  data = {
    val: { a: 1, b: 2, c: 3, d: 4, e: 5 }
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7 }
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)
})

// Test max
it('should have a max length', async ({ t }) => {
  var spec = {
    val: {
      max: 5
    }
  }
  var data = {
    val: null
  }
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['maximum length is 5'])

  data = {
    val: 5
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['maximum length is 5'])

  data = {
    val: new Date()
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['maximum length is 5'])

  data = {
    val: 'hey'
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: 'hello!'
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['maximum length is 5'])

  // Support array
  data = {
    val: []
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: [1, 2, 3]
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: [1, 2, 3, 4, 5]
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: [1, 2, 3, 4, 5, 6, 7]
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['maximum length is 5'])

  // Support object
  data = {
    val: {}
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: { a: 1, b: 2, c: 3 }
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: { a: 1, b: 2, c: 3, d: 4, e: 5 }
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7 }
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['maximum length is 5'])
})

// Test is: boolean
it('should be boolean', async ({ t }) => {
  var spec = {
    val: {
      is: 'boolean'
    }
  }
  var data = {
    val: null
  }
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be boolean'])

  data = {
    val: 5
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be boolean'])

  data = {
    val: 'string'
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be boolean'])

  data = {
    val: true
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: false
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)
})

// Test is: string
it('should be string', async ({ t }) => {
  var spec = {
    val: {
      is: 'string'
    }
  }
  var data = {
    val: null
  }
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be string'])

  data = {
    val: 5
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be string'])

  data = {
    val: 'string'
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: true
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be string'])

  data = {
    val: false
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be string'])
})

// Test is: number
it('should be number', async ({ t }) => {
  var spec = {
    val: {
      is: 'number'
    }
  }
  var data = {
    val: null
  }
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be number'])

  data = {
    val: 5
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: 5.3
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: 'string'
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be number'])

  data = {
    val: true
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be number'])

  data = {
    val: false
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be number'])
})

// Test is: integer
it('should be integer', async ({ t }) => {
  var spec = {
    val: {
      is: 'integer'
    }
  }
  var data = {
    val: null
  }
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be integer'])

  data = {
    val: 5
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: 5.3
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be integer'])

  data = {
    val: 'string'
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be integer'])

  data = {
    val: true
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be integer'])

  data = {
    val: false
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be integer'])
})

// Test is: decimal
it('should be decimal', async ({ t }) => {
  var spec = {
    val: {
      is: 'decimal'
    }
  }
  var data = {
    val: null
  }
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be decimal'])

  data = {
    val: 5
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be decimal'])

  data = {
    val: 5.3
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: 'string'
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be decimal'])

  data = {
    val: true
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be decimal'])

  data = {
    val: false
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be decimal'])
})

// Test is: date
it('should be date', async ({ t }) => {
  var spec = {
    val: {
      is: 'date'
    }
  }
  var data = {
    val: null
  }
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be date'])

  data = {
    val: 5
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be date'])

  data = {
    val: new Date()
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: '2022-01-25T08:20:07.144Z'
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: 'string'
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be date'])

  data = {
    val: true
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be date'])

  data = {
    val: false
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be date'])
})

// Test is: id
it('should be id', async ({ t }) => {
  var spec = {
    val: {
      is: 'id'
    }
  }
  var data = {
    val: null
  }
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be id'])

  data = {
    val: 5
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be id'])

  data = {
    val: new Date()
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be id'])

  data = {
    val: 'string'
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be id'])

  data = {
    val: '507f1f77bcf86cd799439011'
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: 'ck2m9iwoo0001akps7f5fh8we'
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)
})

// Test is: object
it('should be object', async ({ t }) => {
  var spec = {
    val: {
      is: 'object'
    }
  }
  var data = {
    val: null
  }
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be object'])

  data = {
    val: 5
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be object'])

  data = {
    val: new Date()
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be object'])

  data = {
    val: 'string'
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be object'])

  data = {
    val: {}
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)
})

// Test is: array
it('should be array', async ({ t }) => {
  var spec = {
    val: {
      is: 'array'
    }
  }
  var data = {
    val: null
  }
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be array'])

  data = {
    val: 5
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be array'])

  data = {
    val: new Date()
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be array'])

  data = {
    val: 'string'
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be array'])
  data = {
    val: {}
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be array'])

  data = {
    val: []
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)
})

// Test is: email
it('should be email', async ({ t }) => {
  var spec = {
    val: {
      is: 'email'
    }
  }
  var data = {
    val: null
  }
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be email'])

  data = {
    val: 5
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be email'])

  data = {
    val: new Date()
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be email'])

  data = {
    val: 'string'
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be email'])
  data = {
    val: {}
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be email'])

  data = {
    val: 'mail@example.com'
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)
})

// Test is: domain
it('should be domain', async ({ t }) => {
  var spec = {
    val: {
      is: 'domain'
    }
  }
  var data = {
    val: null
  }
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be domain'])

  data = {
    val: 5
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be domain'])

  data = {
    val: new Date()
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be domain'])

  data = {
    val: 'string'
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be domain'])
  data = {
    val: {}
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be domain'])

  data = {
    val: 'https://example.com'
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be domain'])

  data = {
    val: 'example.com'
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)
})

// Test is: slug
it('should be slug', async ({ t }) => {
  var spec = {
    val: {
      is: 'slug'
    }
  }
  var data = {
    val: null
  }
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be slug'])

  data = {
    val: 5
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be slug'])

  data = {
    val: new Date()
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be slug'])

  data = {
    val: '+string'
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be slug'])
  data = {
    val: {}
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be slug'])

  data = {
    val: 'https://example.com'
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be slug'])

  data = {
    val: 'example-com'
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)
})

// Test is: url
it('should be url', async ({ t }) => {
  var spec = {
    val: {
      is: 'url'
    }
  }
  var data = {
    val: null
  }
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be URL'])

  data = {
    val: 5
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be URL'])

  data = {
    val: new Date()
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be URL'])

  data = {
    val: 'string'
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be URL'])
  data = {
    val: {}
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be URL'])

  data = {
    val: 'http://example.com'
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)
})

// Test is: undefined
it('should be undefined', async ({ t }) => {
  var spec = {
    val: {
      is: 'undefined'
    }
  }
  var data = {
    val: undefined
  }
  var error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {}
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: 1
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be undefined'])

  data = {
    val: null
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be undefined'])
})

// Test is: null
it('should be null', async ({ t }) => {
  var spec = {
    val: {
      is: 'null'
    }
  }
  var data = {
    val: null
  }
  var error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {}
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: 1
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be null'])
})

// Test is multiple types
it('should support multiple types', async ({ t }) => {
  var spec = {
    val: {
      is: ['integer', 'string']
    }
  }
  var data = {
    val: 1
  }
  var error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: 'hello'
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: null
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be integer, string'])

  data = {
    val: true
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be integer, string'])
})

// Test isnt
it('should be isnt', async ({ t }) => {
  var spec = {
    val: {
      isnt: 'undefined'
    }
  }
  var data = {
    val: undefined
  }
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must not be undefined'])

  data = {}
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must not be undefined'])

  data = {
    val: 1
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = {
    val: null
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)
})

// Test deeply nested values
it('should validate deeply nested values', async ({ t }) => {
  var spec = {
    'street.name': {
      max: 5
    }
  }
  var data = {
    street: {
      name: 'hello!'
    }
  }
  var error = await validate(spec, data, opt)
  t.deepEqual(error.street.name, ['maximum length is 5'])
})

// Test deeply nested values with array
it('should validate nested values with array', async ({ t }) => {
  var spec = {
    'cars.name[0]': {
      eq: 'cart'
    }
  }
  var data = {
    cars: {
      name: ['cart']
    }
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)
})

// Test required with other
it('should show either require or min', async ({ t }) => {
  var spec = {
    val: {
      required: true,
      min: 2
    }
  }
  var data = {}
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['is required'])

  data = { val: 'h' }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['minimum length is 2'])

  data = { val: 'hello' }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = { val: null }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['minimum length is 2'])

  data = { val: new Date() }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['minimum length is 2'])
})

// Test other with required
it('should show required before min', async ({ t }) => {
  var spec = {
    val: {
      min: 2,
      required: true
    }
  }
  var data = {}
  var error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['is required'])

  data = { val: 'h' }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['minimum length is 2'])

  data = { val: 'hello' }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  data = { val: null }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['minimum length is 2'])

  data = { val: new Date() }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['minimum length is 2'])
})

// Test multiple error range
it('should multiple error range', async ({ t }) => {
  var spec = {
    val: {
      gt: 2,
      lt: 5
    }
  }
  var data = { val: 1 }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be greater than 2'])

  data = { val: 6 }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be less than 5'])

  data = { val: 3 }
  error = await validate(spec, data, opt)
  t.ok(error === null)
})

// Test multiple error
it('should multiple error', async ({ t }) => {
  var spec = {
    val: {
      is: 'integer',
      eq: 5
    }
  }
  var data = { val: 'string' }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be integer', 'must be equal to 5'])

  data = { val: 6 }
  error = await validate(spec, data, opt)
  t.deepEqual(error.val, ['must be equal to 5'])

  data = { val: 5 }
  error = await validate(spec, data, opt)
  t.ok(error === null)
})

// Test multiple keys
it('should multiple errors with multiple keys', async ({ t }) => {
  var spec = {
    name: {
      required: true,
      is: 'string'
    },
    email: {
      required: true,
      is: 'email'
    }
  }
  var data = {}
  var error = await validate(spec, data, opt)
  t.deepEqual(error.name, ['is required'])
  t.deepEqual(error.email, ['is required'])
})

// Test custom error messages
it('should work with custom error messages', async ({ t }) => {
  var spec = {
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
  var data = {}
  var error = await validate(spec, data, opt)
  t.deepEqual(error.name, ['has'])
  t.deepEqual(error.email, ['must be emaily'])
  t.deepEqual(error.street, ['must be five'])
})

// Test skip values
it('should skip values', async ({ t }) => {
  var spec = {
    name: {
      min: 3,
      skip: ''
    }
  }
  var data = {}
  var error = await validate(spec, data, opt)
  t.deepEqual(error.name, ['minimum length is 3'])

  spec = {
    name: {
      skip: '',
      min: 3
    }
  }
  data = {}
  error = await validate(spec, data, opt)
  t.deepEqual(error.name, ['minimum length is 3'])

  data = {
    name: ''
  }
  error = await validate(spec, data, opt)
  t.ok(error === null)

  spec = {
    name: {
      min: 3,
      eq: 'bye',
      skip: 'hello'
    }
  }
  data = {
    name: 'hello'
  }
  error = await validate(spec, data, opt)
  t.deepEqual(error.name, ['must be equal to bye'])

  spec = {
    name: {
      min: 3,
      skip: 'hello',
      eq: 'bye'
    }
  }

  error = await validate(spec, data, opt)
  t.ok(error === null)
})
