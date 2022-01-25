const assert = require('assert')
const _ = require('lodash')
const tools = require('extras')
const locales = require('./lib/locales.js')
const types = require('./lib/types.js')

function equal(want, got) {
  try {
    assert.deepEqual(want, got)
  } catch(e) {
    return false
  }
  return true
}

module.exports = function(opt = {}) {
  const { lang = 'en', ext = {}, mode = 'lax' } = opt
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

  const result = function() {
    return _.isEmpty(errors) ? null : errors
  }

  const fn = {}

  fn.allow = async function(obj, fields = []) {
    for (const field of fields) {
      if (!_.get(obj, field)) {
        add(field, t('allow'))
      }
    }
    return result()
  }

  fn.deny = async function(obj, fields = []) {
    for (const field of fields) {
      if (_.get(obj, field)) {
        add(field, t('deny'))
      }
    }
    return result()
  }

  fn.validate = async function(spec, data) {
    if (!_.isPlainObject(spec)) spec = { val: spec }
    if (!_.isPlainObject(data)) data = { val: data }

    const validators = Object.keys(types)
    const dotspec = tools.dot(spec)

    for (const key in dotspec) {
      const path = key.split('.')
      let type = path.slice(-1)[0]
      if (!validators.includes(type)) {
        path.push(type = 'eq')
      }
      const field = path.slice(0, -1).join('.')
      let want = _.get(dotspec, key)
      const got = _.get(data, field)

      if (type !== 'matcher' && _.isFunction(want)) {
        want = await want(got, opt)
      }

      if (mode != 'strict' && _.isUndefined(got)) {
        if (type == 'required' && want === true) {
          add(field, t(type))
        }
      }

      else if (
        type == 'eq' && !equal(want, got) ||
        type == 'ne' && equal(want, got) ||
        type == 'gt' && (!_.isNumber(got) || got <= want) ||
        type == 'lt' && (!_.isNumber(got) || got >= want) ||
        type == 'gte' && (!_.isNumber(got) || got < want) ||
        type == 'lte' && (!_.isNumber(got) || got > want) ||
        type == 'in' && _.isArray(want) && !want.includes(got) ||
        type == 'nin' && _.isArray(want) && want.includes(got) ||
        type == 'length' && (!_.isString(got) || want !== got.length) ||
        type == 'min' && (!_.isString(got) || want > got.length) ||
        type == 'max' && (!_.isString(got) || want < got.length) ||
        type == 'match' && (!_.isRegExp(want) || !want.test(got))
      ) {
        add(field, t(type, want))
      }

      else if (
        type == 'is' && (
          want == 'boolean' && !_.isBoolean(got) ||
          want == 'string' && !_.isString(got) ||
          want == 'number' && !_.isNumber(got) ||
          want == 'integer' && !_.isInteger(got) ||
          want == 'decimal' && (!_.isNumber(got) || _.isInteger(got)) ||
          want == 'date' && !_.isDate(got) ||
          want == 'id' && !tools.isId(got) ||
          want == 'object' && !_.isPlainObject(got) ||
          want == 'array' && !_.isArray(got) ||
          want == 'email' && !tools.isEmail(got) ||
          want == 'url' && !tools.isURL(got)
        )
      ) {
        add(field, t(want))
      }

      else if (type == 'matcher' && _.isFunction(want)) {
        const result = await want(got, opt)
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
          type,
          want,
          got
        })
      }
    }
    return result()
  }

  return fn
}
