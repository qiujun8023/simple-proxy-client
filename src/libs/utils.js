exports.isDomain = function (val) {
  let regex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/
  return regex.test(val)
}

exports.isIP = function (val) {
  let regex = /^(?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/
  return regex.test(val)
}

exports.isPort = function (val) {
  return val && val >= 0 && val <= 65535
}
