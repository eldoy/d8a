const assert = require('assert')
const lodash = require('lodash')
const extras = require('extras')

function equal(want, got) {
  try {
    assert.deepEqual(want, got)
  } catch (e) {
    return false
  }
  return true
}

function isDate(got) {
  return lodash.isDate(got) || (lodash.isString(got) && extras.isDate(got))
}

function isDomain(got) {
  return extras.regexp.domain.test(got)
}

function isSlug(got) {
  return lodash.isString(got) && extras.regexp.slug.test(got)
}

function all(list, want) {
  return list.every((x) => want.includes(x))
}

function any(list, want) {
  return list.some((x) => want.includes(x))
}

const m = {}

m.eq = function (want, got) {
  return !equal(want, got)
}

m.ne = function (want, got) {
  return equal(want, got)
}

m.gt = function (want, got) {
  return !lodash.isNumber(got) || got <= want
}

m.lt = function (want, got) {
  return !lodash.isNumber(got) || got >= want
}

m.gte = function (want, got) {
  return !lodash.isNumber(got) || got < want
}

m.lte = function (want, got) {
  return !lodash.isNumber(got) || got > want
}

m.in = function (want, got) {
  if (!lodash.isArray(want)) return
  if (lodash.isArray(got)) {
    return !all(got, want)
  }
  if (lodash.isPlainObject(got)) {
    let keys = Object.keys(got)
    return !all(keys, want)
  }
  return !want.includes(got)
}

m.nin = function (want, got) {
  if (!lodash.isArray(want)) return
  if (lodash.isArray(got)) {
    return any(got, want)
  }
  if (lodash.isPlainObject(got)) {
    let keys = Object.keys(got)
    return any(keys, want)
  }
  return want.includes(got)
}

m.length = function (want, got) {
  if (lodash.isString(got) || lodash.isArray(got)) {
    return want !== got.length
  }
  if (lodash.isPlainObject(got)) {
    return want !== Object.keys(got).length
  }
  return true
}

m.min = function (want, got) {
  if (lodash.isString(got) || lodash.isArray(got)) {
    return want > got.length
  }
  if (lodash.isPlainObject(got)) {
    return want > Object.keys(got).length
  }
  return true
}

m.max = function (want, got) {
  if (lodash.isString(got) || lodash.isArray(got)) {
    return want < got.length
  }
  if (lodash.isPlainObject(got)) {
    return want < Object.keys(got).length
  }
  return true
}

m.match = function (want, got) {
  return !lodash.isRegExp(want) || !want.test(got)
}

m.is = function (want, got) {
  if (!Array.isArray(want)) {
    want = [want]
  }

  return want.every((type) => {
    if (type == 'boolean') {
      return !lodash.isBoolean(got)
    } else if (type == 'string') {
      return !lodash.isString(got)
    } else if (type == 'number') {
      return !lodash.isNumber(got)
    } else if (type == 'integer') {
      return !lodash.isInteger(got)
    } else if (type == 'decimal') {
      return !lodash.isNumber(got) || lodash.isInteger(got)
    } else if (type == 'date') {
      return !isDate(got)
    } else if (type == 'id') {
      return !extras.isId(got)
    } else if (type == 'object') {
      return !lodash.isPlainObject(got)
    } else if (type == 'array') {
      return !lodash.isArray(got)
    } else if (type == 'email') {
      return !extras.isEmail(got)
    } else if (type == 'domain') {
      return !isDomain(got)
    } else if (type == 'slug') {
      return !isSlug(got)
    } else if (type == 'url') {
      return !extras.isURL(got)
    } else if (type == 'undefined') {
      return !lodash.isUndefined(got)
    } else if (type == 'null') {
      return !lodash.isNil(got)
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
