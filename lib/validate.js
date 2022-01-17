const _ = require('lodash')
const tools = require('extras')
const locales = require('./locales.js')

module.exports = async function(spec, data, opt = {}, fn) {
  if (typeof opt == 'function') {
    fn = opt
    opt = {}
  }
  const lang = opt.lang || 'en'
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

  for (const field in spec) {
    const validator = spec[field]
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
        type == 'eq' && a !== b ||
        type == 'ne' && a === b ||
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

      else if (typeof fn == 'function') {
        await fn({
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
