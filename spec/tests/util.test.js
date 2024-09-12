var { util } = require('../../index.js')

// Test sort object single key
it('should sort object with single key', async ({ t }) => {
  var obj = {
    name: {
      is: 'string',
      required: true
    }
  }

  var result = util.sort(obj)
  var keys = Object.keys(result.name)
  t.equal(keys.length, 2)
  t.equal(keys[0], 'required')
  t.equal(keys[1], 'is')
})

// Test sort object multiple keys
it('should sort object with multiple keys', async ({ t }) => {
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
  t.equal(keys1.length, 2)
  t.equal(keys1[0], 'required')
  t.equal(keys1[1], 'is')

  var keys2 = Object.keys(result.email)
  t.equal(keys2.length, 2)
  t.equal(keys2[0], 'required')
  t.equal(keys2[1], 'is')
})

// Test sort add eq as default
it('should sort object with multiple keys', async ({ t }) => {
  var obj = {
    name: 'hello'
  }
  var result = util.sort(obj)
  t.deepEqual(obj, { name: { eq: 'hello' } })
})
