var extras = require('extras')
var util = {}

util.sort = function (obj) {
  for (var field in obj) {
    var val = obj[field]
    if (!extras.isPlainObject(val)) {
      val = { eq: val }
    }
    var sorted = []
    for (var key in val) {
      var entry = [key, val[key]]
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
