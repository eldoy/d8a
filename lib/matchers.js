const assert = require('assert')
const _ = require('lodash')
const extras = require('extras')

function equal(want, got) {
  try {
    assert.deepEqual(want, got)
  } catch(e) {
    return false
  }
  return true
}

function isDate(got) {
  return _.isDate(got) || _.isString(got) && extras.isDate(got)
}

function all(list, want) {
  return list.every(x => want.includes(x))
}

function any(list, want) {
  return list.some(x => want.includes(x))
}

const m = {}

m.eq = function(want, got) {
  return !equal(want, got)
}

m.ne = function(want, got) {
  return equal(want, got)
}

m.gt = function(want, got) {
  return !_.isNumber(got) || got <= want
}

m.lt = function(want, got) {
  return !_.isNumber(got) || got >= want
}

m.gte = function(want, got) {
  return !_.isNumber(got) || got < want
}

m.lte = function(want, got) {
  return !_.isNumber(got) || got > want
}

m.in = function(want, got) {
  if (!_.isArray(want)) return
  if (_.isArray(got)) {
    return !all(got, want)
  }
  if (_.isPlainObject(got)) {
    let keys = Object.keys(got)
    return !all(keys, want)
  }
  return !want.includes(got)
}

m.nin = function(want, got) {
  if (!_.isArray(want)) return
  if (_.isArray(got)) {
    return any(got, want)
  }
  if (_.isPlainObject(got)) {
    let keys = Object.keys(got)
    return any(keys, want)
  }
  return want.includes(got)
}

m.length = function(want, got) {
  if (_.isString(got) || _.isArray(got)) {
    return want !== got.length
  }
  if (_.isPlainObject(got)) {
    return want !== Object.keys(got).length
  }
  return true
}

m.min = function(want, got) {
  return !_.isString(got) || want > got.length
}

m.max = function(want, got) {
  return !_.isString(got) || want < got.length
}

m.match = function(want, got) {
  return !_.isRegExp(want) || !want.test(got)
}

m.is = function(want, got) {
  if (want == 'boolean') {
    return !_.isBoolean(got)
  }

  else if (want == 'string') {
    return !_.isString(got)
  }

  else if (want == 'number') {
    return !_.isNumber(got)
  }

  else if (want == 'integer') {
    return !_.isInteger(got)
  }

  else if (want == 'decimal') {
    return !_.isNumber(got) || _.isInteger(got)
  }

  else if (want == 'date') {
    return !isDate(got)
  }

  else if (want == 'id') {
    return !extras.isId(got)
  }

  else if (want == 'object') {
    return !_.isPlainObject(got)
  }

  else if (want == 'array') {
    return !_.isArray(got)
  }

  else if (want == 'email') {
    return !extras.isEmail(got)
  }

  else if (want == 'url') {
    return !extras.isURL(got)
  }

  else if (want == 'undefined') {
    return !_.isUndefined(got)
  }
}

module.exports = m