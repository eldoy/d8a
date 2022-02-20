const _ = require('lodash')
const { format } = require('extras')
const locales = require('./locales.js')
const types = require('./types.js')
const util = require('./util.js')
const matchers = require('./matchers.js')

module.exports = async function(spec, data, opt = {}) {
  const { lang = 'en', ext = {}, lax = false } = opt
  for (const x in ext) {
    types[x] = ext[x].type || 'any'
  }
  if (!_.isPlainObject(spec)) {
    spec = { val: spec }
  }
  if (!_.isPlainObject(data)) {
    data = { val: data }
  }
  spec = util.sort(spec)
  _.merge(locales, opt.locales)

  const t = function(path, ...args) {
    let key = `validation.${path}`
    if (opt.t) return opt.t(key, ...args)
    const value = _.get(locales[lang], key) || path
    return format(value, ...args)
  }

  const errors = {}
  function add(key, value) {
    const list = _.get(errors, key) || []
    list.push(value)
    _.set(errors, key, list)
  }

  const validators = Object.keys(types)

  for (const field in spec) {
    let validation = _.get(spec, field)

    for (const type in validation) {
      let want = validation[type]
      const got = _.get(data, field)

      if (type !== 'matcher' && _.isFunction(want)) {
        want = await want(got, opt)
      }

      let message
      if (_.isPlainObject(want) && want.$val) {
        message = want.message
        want = want.$val
      }

      const empty = _.isUndefined(got) && type == 'required' && want === true
      if (empty || lax && _.isUndefined(got)) {
        if (empty) add(field, message || t(type))
        break

      } else if (type == 'ignore' && matchers.ignore(want, got)) {
        break

      } else if (type == 'is' && matchers.is(want, got)) {
        add(field, message || t(want))

      } else if (_.isFunction(matchers[type]) && matchers[type](want, got)) {
        add(field, message || t(type, want))

      } else if (type == 'matcher' && _.isFunction(want)) {
        const result = await want(got, opt)
        if (result) {
          add(field, result)
        }

      } else if (ext[type] && _.isFunction(ext[type].fn)) {
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
  }

  return _.isEmpty(errors) ? null : errors
}
