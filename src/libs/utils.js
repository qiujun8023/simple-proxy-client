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

exports.getDiffDays = function (t1, t2) {
  t2 = t2 || new Date()
  return Math.floor((t2.getTime() - t1.getTime()) / 8.64e7)
}

exports.getColors = function () {
  return [
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 99, 132, 0.8)',
    'rgba(255, 206, 86, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(19, 206, 102, 0.8)',
    'rgba(255, 159, 64, 0.8)'
  ]
}
