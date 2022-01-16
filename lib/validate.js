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
      const value = _.get(data, field)

      if (type !== 'matcher' && _.isFunction(a)) {
        a = await a(value, opt)
      }

      if (_.isUndefined(value)) {
        if (type == 'required' && a === true) {
          add(field, t(type))
        }
      }

      else if (
        type == 'eq' && a !== value ||
        type == 'ne' && a === value ||
        type == 'gt' && (!_.isNumber(value) || value <= a) ||
        type == 'lt' && (!_.isNumber(value) || value >= a) ||
        type == 'gte' && (!_.isNumber(value) || value < a) ||
        type == 'lte' && (!_.isNumber(value) || value > a) ||
        type == 'in' && !a.includes(value) ||
        type == 'nin' && a.includes(value) ||
        type == 'length' && (!_.isString(value) || a !== value.length) ||
        type == 'minlength' && (!_.isString(value) || a > value.length) ||
        type == 'maxlength' && (!_.isString(value) || a < value.length) ||
        type == 'match' && (!_.isRegExp(a) || !a.test(value))
      ) {
        add(field, t(type, a))
      }

      else if (
        type == 'is' && (
          a == 'boolean' && !_.isBoolean(value) ||
          a == 'string' && !_.isString(value) ||
          a == 'number' && !_.isNumber(value) ||
          a == 'integer' && !_.isInteger(value) ||
          a == 'decimal' && (!_.isNumber(value) || _.isInteger(value)) ||
          a == 'date' && !_.isDate(value) ||
          a == 'id' && !tools.isId(value) ||
          a == 'object' && !_.isPlainObject(value) ||
          a == 'array' && !_.isArray(value) ||
          a == 'email' && !tools.isEmail(value) ||
          a == 'url' && !tools.isURL(value)
        )
      ) {
        add(field, t(a))
      }

      else if (type == 'matcher' && _.isFunction(a)) {
        const result = await a(value, opt)
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
          value
        })
      }
    }
  }

  return _.isEmpty(errors) ? null : errors
}
