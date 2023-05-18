const _ = require('lodash')

const util = {}

util.sort = function (obj) {
  for (const field in obj) {
    let val = obj[field]
    if (!_.isPlainObject(val)) {
      val = { eq: val }
    }
    const sorted = []
    for (const key in val) {
      const entry = [key, val[key]]
      if (key == 'required') {
        sorted.unshift(entry)
      } else {
        sorted.push(entry)
      }
    }
    obj[field] = Object.fromEntries(sorted)
  }
  return obj
}

module.exports = util
