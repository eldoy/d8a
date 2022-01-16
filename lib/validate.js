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
      const y = _.get(data, field)

      if (type !== 'matcher' && _.isFunction(name)) {
        name = await name(y, opt)
      }

      if (_.isUndefined(y)) {
        if (type === 'required' && name === true) {
          add(field, t(type))
        }

      } else if (
        type === 'eq' && name !== y ||
        type === 'ne' && name === y ||
        type === 'gt' && (!_.isNumber(y) || y <= name) ||
        type === 'lt' && (!_.isNumber(y) || y >= name) ||
        type === 'gte' && (!_.isNumber(y) || y < name) ||
        type === 'lte' && (!_.isNumber(y) || y > name) ||
        type === 'in' && !name.includes(y) ||
        type === 'nin' && name.includes(y) ||
        type === 'length' && (!_.isString(y) || name !== y.length) ||
        type === 'minlength' && (!_.isString(y) || name > y.length) ||
        type === 'maxlength' && (!_.isString(y) || name < y.length) ||
        type === 'match' && (!_.isRegExp(name) || !name.test(y))
      ) {
        add(field, t(type, name))

      } else if (
        type === 'is' && (
          name === 'boolean' && !_.isBoolean(y) ||
          name === 'string' && !_.isString(y) ||
          name === 'number' && !_.isNumber(y) ||
          name === 'integer' && !_.isInteger(y) ||
          name === 'decimal' && (!_.isNumber(y) || _.isInteger(y)) ||
          name === 'date' && !_.isDate(y) ||
          name === 'id' && !tools.isId(y) ||
          name === 'object' && !_.isPlainObject(y) ||
          name === 'array' && !_.isArray(y) ||
          name === 'email' && !tools.isEmail(y) ||
          name === 'url' && !tools.isURL(y)
        )
      ) {
        add(field, t(name))

      } else if (type === 'matcher' && _.isFunction(name)) {
        const result = await name(y, opt)
        if (result) {
          add(field, result)
        }
      }
    }
  }

  return _.isEmpty(errors) ? null : errors
}
