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
      let name = validator[type]
      const value = _.get(data, field)

      if (type !== 'matcher' && _.isFunction(name)) {
        name = await name(value, opt)
      }

      if (_.isUndefined(value)) {
        if (type == 'required' && name === true) {
          add(field, t(type))
        }
      }

      else if (
        type == 'eq' && name !== value ||
        type == 'ne' && name === value ||
        type == 'gt' && (!_.isNumber(value) || value <= name) ||
        type == 'lt' && (!_.isNumber(value) || value >= name) ||
        type == 'gte' && (!_.isNumber(value) || value < name) ||
        type == 'lte' && (!_.isNumber(value) || value > name) ||
        type == 'in' && !name.includes(value) ||
        type == 'nin' && name.includes(value) ||
        type == 'length' && (!_.isString(value) || name !== value.length) ||
        type == 'minlength' && (!_.isString(value) || name > value.length) ||
        type == 'maxlength' && (!_.isString(value) || name < value.length) ||
        type == 'match' && (!_.isRegExp(name) || !name.test(value))
      ) {
        add(field, t(type, name))
      }

      else if (
        type == 'is' && (
          name == 'boolean' && !_.isBoolean(value) ||
          name == 'string' && !_.isString(value) ||
          name == 'number' && !_.isNumber(value) ||
          name == 'integer' && !_.isInteger(value) ||
          name == 'decimal' && (!_.isNumber(value) || _.isInteger(value)) ||
          name == 'date' && !_.isDate(value) ||
          name == 'id' && !tools.isId(value) ||
          name == 'object' && !_.isPlainObject(value) ||
          name == 'array' && !_.isArray(value) ||
          name == 'email' && !tools.isEmail(value) ||
          name == 'url' && !tools.isURL(value)
        )
      ) {
        add(field, t(name))
      }

      else if (type == 'matcher' && _.isFunction(name)) {
        const result = await name(value, opt)
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
          name,
          value
        })
      }
    }
  }

  return _.isEmpty(errors) ? null : errors
}
