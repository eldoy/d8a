var extras = require('extras')
var DEFAULT_LOCALES = require('./locales.js')
var types = require('./types.js')
var util = require('./util.js')
var matchers = require('./matchers.js')

module.exports = async function (spec, data, opt = {}) {
  var { lang = 'en', ext = {}, lax = false, $ = {} } = opt
  for (var x in ext) {
    types[x] = ext[x].type || 'any'
  }
  if (!extras.isPlainObject(spec)) {
    spec = { val: spec }
  }
  if (!extras.isPlainObject(data)) {
    data = { val: data }
  }
  spec = util.sort(spec)
  var locales = extras.merge({}, DEFAULT_LOCALES, opt.locales)

  var t = function (path, ...args) {
    var key = `validation.${path}`
    if (opt.t) return opt.t(key, ...args)
    var value = extras.get(locales[lang], key) || path
    return extras.format(value, ...args)
  }

  var errors = {}
  function add(key, value) {
    var list = extras.get(errors, key) || []
    list.push(value)
    extras.set(errors, key, list)
  }

  for (var field in spec) {
    var validation = extras.get(spec, field)

    for (var type in validation) {
      var want = validation[type]
      var got = extras.get(data, field)

      if (type !== 'matcher' && extras.isFunction(want)) {
        want = await want(got, opt.$)
      }

      var message
      if (extras.isPlainObject(want) && want.$val) {
        message = want.message
        want = want.$val
      }

      var empty = extras.isUndefined(got) && type == 'required' && want === true
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
        var result = await want(got, opt.$)
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
