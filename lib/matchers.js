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
  return _.isArray(want) && (
    !_.isArray(got) && !want.includes(got) ||
    _.isArray(got) && !got.every(x => want.includes(x))
  )
}

m.nin = function(want, got) {
  return _.isArray(want) && (
    !_.isArray(got) && want.includes(got) ||
    _.isArray(got) && got.some(x => want.includes(x))
  )
}

m.length = function(want, got) {
  return !_.isString(got) || want !== got.length
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
  return want == 'boolean' && !_.isBoolean(got) ||
    want == 'string' && !_.isString(got) ||
    want == 'number' && !_.isNumber(got) ||
    want == 'integer' && !_.isInteger(got) ||
    want == 'decimal' && (!_.isNumber(got) || _.isInteger(got)) ||
    want == 'date' && !isDate(got) ||
    want == 'id' && !extras.isId(got) ||
    want == 'object' && !_.isPlainObject(got) ||
    want == 'array' && !_.isArray(got) ||
    want == 'email' && !extras.isEmail(got) ||
    want == 'url' && !extras.isURL(got) ||
    want == 'undefined' && !_.isUndefined(got)
}

module.exports = m