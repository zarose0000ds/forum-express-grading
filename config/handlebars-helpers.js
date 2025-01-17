const moment = require('moment')

module.exports = {
  ifCond: (a, b, options) => {
    if (a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  ifAbove: (a, b, options) => {
    if (a >= b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  moment: function (a) {
    return moment(a).fromNow()
  }
}