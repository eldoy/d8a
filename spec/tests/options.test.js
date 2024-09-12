var { validate, locales } = require('../../index.js')

// Test lax option
it('should not process undefined if lax', async ({ t }) => {
  var spec = {
    val: {
      eq: 1
    }
  }
  var data = { key: 'string' }

  var result = await validate(spec, data)
  t.deepEqual(result.val, ['must be equal to 1'])

  result = await validate(spec, data, { lax: true })
  t.ok(result === null)

  data = { val: 2 }
  result = await validate(spec, data, { lax: true })
  t.deepEqual(result.val, ['must be equal to 1'])

  data = {}
  spec = {
    val: {
      required: true
    }
  }

  result = await validate(spec, data, { lax: true })
  t.deepEqual(result.val, ['is required'])
})

// Test callback extension
it('should support callback extension', async ({ t }) => {
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
  t.deepEqual(error.val, ['must be unique'])
})

// Test extension with locales
it('should support extension with locales', async ({ t }) => {
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
  t.deepEqual(error.val, ['must be unique'])
})

// Test opt params
it('should mutate opt params', async ({ t }) => {
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

  t.ok(result === null)
  t.equal($.hello, 'hi')
})
