const assert = require('assert')
const _ = require('lodash')
const tools = require('extras')
const locales = require('./locales.js')
const types = require('./types.js')

function equal(a, b) {
  try {
    assert.deepEqual(a, b)
  } catch(e) {
    return false
  }
  return true
}

module.exports = async function(spec, data, opt = {}) {
  const { lang = 'en', ext = {}} = opt
  for (const x in ext) {
    types[x] = ext[x].type || 'any'
  }

  _.merge(locales, opt.locales)

  const t = function(path, ...args) {
    let key = `validation.${path}`
    if (opt.t) return opt.t(key, ...args)
    const value = _.get(locales[lang], key) || path
    return tools.format(value, ...args)
  }

  const errors = {}
  function add(key, value) {
    const list = _.get(errors, key) || []
    list.push(value)
    _.set(errors, key, list)
  }

  const names = Object.keys(types)

  for (const field in spec) {
    let validator = spec[field]

    const name = _.isPlainObject(validator)
      ? Object.keys(validator)[0]
      : validator
    if (!names.includes(name)) {
      validator = { eq: validator }
    }

    for (const type in validator) {
      let a = validator[type]
      const b = _.get(data, field)

      if (type !== 'matcher' && _.isFunction(a)) {
        a = await a(b, opt)
      }

      if (_.isUndefined(b)) {
        if (type == 'required' && a === true) {
          add(field, t(type))
        }
      }

      else if (
        type == 'eq' && !equal(a, b) ||
        type == 'ne' && equal(a, b) ||
        type == 'gt' && (!_.isNumber(b) || b <= a) ||
        type == 'lt' && (!_.isNumber(b) || b >= a) ||
        type == 'gte' && (!_.isNumber(b) || b < a) ||
        type == 'lte' && (!_.isNumber(b) || b > a) ||
        type == 'in' && _.isArray(a) && !a.includes(b) ||
        type == 'nin' && _.isArray(a) && a.includes(b) ||
        type == 'length' && (!_.isString(b) || a !== b.length) ||
        type == 'minlength' && (!_.isString(b) || a > b.length) ||
        type == 'maxlength' && (!_.isString(b) || a < b.length) ||
        type == 'match' && (!_.isRegExp(a) || !a.test(b))
      ) {
        add(field, t(type, a))
      }

      else if (
        type == 'is' && (
          a == 'boolean' && !_.isBoolean(b) ||
          a == 'string' && !_.isString(b) ||
          a == 'number' && !_.isNumber(b) ||
          a == 'integer' && !_.isInteger(b) ||
          a == 'decimal' && (!_.isNumber(b) || _.isInteger(b)) ||
          a == 'date' && !_.isDate(b) ||
          a == 'id' && !tools.isId(b) ||
          a == 'object' && !_.isPlainObject(b) ||
          a == 'array' && !_.isArray(b) ||
          a == 'email' && !tools.isEmail(b) ||
          a == 'url' && !tools.isURL(b)
        )
      ) {
        add(field, t(a))
      }

      else if (type == 'matcher' && _.isFunction(a)) {
        const result = await a(b, opt)
        if (result) {
          add(field, result)
        }
      }

      else if (ext[type] && typeof ext[type].fn == 'function') {
        await ext[type].fn({
          spec,
          data,
          opt,
          lang,
          t,
          errors,
          add,
          field,
          spec,
          type,
          validator,
          a,
          b
        })
      }
    }
  }

  return _.isEmpty(errors) ? null : errors
}
