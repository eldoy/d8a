const assert = require('assert')
const _ = require('lodash')
const tools = require('extras')
const locales = require('./locales.js')
const types = require('./types.js')

function equal(want, got) {
  try {
    assert.deepEqual(want, got)
  } catch(e) {
    return false
  }
  return true
}

function isDate(got) {
  return _.isDate(got) || (_.isString(got) && tools.isDate(got))
}

module.exports = async function(spec, data, opt = {}) {
  const { lang = 'en', lax = false, ext = {} } = opt
  for (const x in ext) {
    types[x] = ext[x].type || 'any'
  }
  if (!_.isPlainObject(spec)) {
    spec = { val: spec }
  }
  if (!_.isPlainObject(data)) {
    data = { val: data }
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

    const empty = _.isUndefined(got) && type == 'required' && want === true
    if (empty || lax && _.isUndefined(got)) {
      if (empty) add(field, t('required'))
      break
    }

    if (
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
        want == 'date' && !isDate(got) ||
        want == 'id' && !tools.isId(got) ||
        want == 'object' && !_.isPlainObject(got) ||
        want == 'array' && !_.isArray(got) ||
        want == 'email' && !tools.isEmail(got) ||
        want == 'url' && !tools.isURL(got) ||
        want == 'undefined' && !_.isUndefined(got)
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

    else if (ext[type] && _.isFunction(ext[type].fn)) {
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

  return _.isEmpty(errors) ? null : errors
}
