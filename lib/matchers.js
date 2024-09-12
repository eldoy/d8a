var assert = require('assert')
var extras = require('extras')

function equal(want, got) {
  try {
    assert.deepEqual(want, got)
  } catch (e) {
    return false
  }
  return true
}

function isDate(got) {
  return (
    extras.isDate(got) || (extras.isString(got) && extras.isDateString(got))
  )
}

function isDomain(got) {
  return extras.regexp.domain.test(got)
}

function isSlug(got) {
  return extras.isString(got) && extras.regexp.slug.test(got)
}

function all(list, want) {
  return list.every((x) => want.includes(x))
}

function any(list, want) {
  return list.some((x) => want.includes(x))
}

var m = {}

m.eq = function (want, got) {
  return !equal(want, got)
}

m.ne = function (want, got) {
  return equal(want, got)
}

m.gt = function (want, got) {
  return !extras.isNumber(got) || got <= want
}

m.lt = function (want, got) {
  return !extras.isNumber(got) || got >= want
}

m.gte = function (want, got) {
  return !extras.isNumber(got) || got < want
}

m.lte = function (want, got) {
  return !extras.isNumber(got) || got > want
}

m.in = function (want, got) {
  if (!extras.isArray(want)) return
  if (extras.isArray(got)) {
    return !all(got, want)
  }
  if (extras.isPlainObject(got)) {
    let keys = Object.keys(got)
    return !all(keys, want)
  }
  return !want.includes(got)
}

m.nin = function (want, got) {
  if (!extras.isArray(want)) return
  if (extras.isArray(got)) {
    return any(got, want)
  }
  if (extras.isPlainObject(got)) {
    let keys = Object.keys(got)
    return any(keys, want)
  }
  return want.includes(got)
}

m.length = function (want, got) {
  if (extras.isString(got) || extras.isArray(got)) {
    return want !== got.length
  }
  if (extras.isPlainObject(got)) {
    return want !== Object.keys(got).length
  }
  return true
}

m.min = function (want, got) {
  if (extras.isString(got) || extras.isArray(got)) {
    return want > got.length
  }
  if (extras.isPlainObject(got)) {
    return want > Object.keys(got).length
  }
  return true
}

m.max = function (want, got) {
  if (extras.isString(got) || extras.isArray(got)) {
    return want < got.length
  }
  if (extras.isPlainObject(got)) {
    return want < Object.keys(got).length
  }
  return true
}

m.match = function (want, got) {
  return !extras.isRegExp(want) || !want.test(got)
}

m.is = function (want, got) {
  if (!Array.isArray(want)) {
    want = [want]
  }

  return want.every((type) => {
    if (type == 'boolean') {
      return !extras.isBoolean(got)
    } else if (type == 'string') {
      return !extras.isString(got)
    } else if (type == 'number') {
      return !extras.isNumber(got)
    } else if (type == 'integer') {
      return !extras.isInteger(got)
    } else if (type == 'decimal') {
      return !extras.isNumber(got) || extras.isInteger(got)
    } else if (type == 'date') {
      return !isDate(got)
    } else if (type == 'id') {
      return !extras.isId(got)
    } else if (type == 'object') {
      return !extras.isPlainObject(got)
    } else if (type == 'array') {
      return !extras.isArray(got)
    } else if (type == 'email') {
      return !extras.isEmail(got)
    } else if (type == 'domain') {
      return !isDomain(got)
    } else if (type == 'slug') {
      return !isSlug(got)
    } else if (type == 'url') {
      return !extras.isURL(got)
    } else if (type == 'undefined') {
      return !extras.isUndefined(got)
    } else if (type == 'null') {
      return !extras.isNil(got)
    }
  })
}

m.isnt = function (want, got) {
  return !m.is(want, got)
}

m.skip = function (want, got) {
  if (!Array.isArray(want)) {
    want = [want]
  }
  return want.some((x) => equal(x, got))
}

module.exports = m
