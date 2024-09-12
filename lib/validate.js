const extras = require('extras')
const DEFAULT_LOCALES = require('./locales.js')
const types = require('./types.js')
const util = require('./util.js')
const matchers = require('./matchers.js')

module.exports = async function (spec, data, opt = {}) {
  const { lang = 'en', ext = {}, lax = false, $ = {} } = opt
  for (const x in ext) {
    types[x] = ext[x].type || 'any'
  }
  if (!extras.isPlainObject(spec)) {
    spec = { val: spec }
  }
  if (!extras.isPlainObject(data)) {
    data = { val: data }
  }
  spec = util.sort(spec)
  const locales = extras.merge({}, DEFAULT_LOCALES, opt.locales)

  const t = function (path, ...args) {
    let key = `validation.${path}`
    if (opt.t) return opt.t(key, ...args)
    const value = extras.get(locales[lang], key) || path
    return extras.format(value, ...args)
  }

  const errors = {}
  function add(key, value) {
    const list = extras.get(errors, key) || []
    list.push(value)
    extras.set(errors, key, list)
  }

  for (const field in spec) {
    let validation = extras.get(spec, field)

    for (const type in validation) {
      let want = validation[type]
      const got = extras.get(data, field)

      if (type !== 'matcher' && extras.isFunction(want)) {
        want = await want(got, opt.$)
      }

      let message
      if (extras.isPlainObject(want) && want.$val) {
        message = want.message
        want = want.$val
      }

      const empty =
        extras.isUndefined(got) && type == 'required' && want === true
      if (empty || (lax && extras.isUndefined(got))) {
        if (empty) add(field, message || t(type))
        break
      } else if (type == 'skip' && matchers.skip(want, got)) {
        break
      } else if (['is', 'isnt'].includes(type) && matchers[type](want, got)) {
        add(field, message || t(type, t(want)))
      } else if (
        extras.isFunction(matchers[type]) &&
        matchers[type](want, got)
      ) {
        add(field, message || t(type, want))
      } else if (type == 'matcher' && extras.isFunction(want)) {
        const result = await want(got, opt.$)
        if (result) {
          if (extras.isArray(result)) {
            for (var entry of result) {
              add(field, entry)
            }
          } else {
            add(field, result)
          }
        }
      } else if (ext[type] && extras.isFunction(ext[type].fn)) {
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

  return extras.isEmpty(errors) ? null : errors
}
