// eslint-disable-next-line
import 'whatwg-fetch'
import url from 'url'
import _ from 'lodash'

let status, ok

let getLoginUrl = function (config) {
  let uri = 'https://qy.weixin.qq.com/cgi-bin/loginpage'
  let query = _.assign({
    state: location.href,
    usertype: 'admin'
  }, config)

  return uri + url.format({query})
}

let handleHttpError = function (status, data) {
  switch (status) {
    case 401:
      location.href = getLoginUrl(data.extra)
      return true
    default:
      return false
  }
}

export default function (uri, params) {
  params = params || {}
  params.method = params.method || 'GET'

  // 处理 Cookie
  params.credentials = 'same-origin'

  // 处理 POST参数，POST 使用 JSON
  if (['POST', 'PUT'].indexOf(params.method.toUpperCase()) !== -1) {
    params.headers = params.headers || {}
    params.headers['Content-Type'] = 'application/json'
    if (params.body && typeof body !== 'string') {
      params.body = JSON.stringify(params.body)
    }
  }

  // 处理 GET 参数
  uri = uri + url.format({query: params.query})
  params.query = undefined

  return fetch(uri, params)
    .then((res) => {
      ok = res.ok
      status = res.status
      return res.json()
    })
    .then((data) => {
      if (typeof data !== 'object') {
        data = {message: '服务器错误'}
      }

      if (handleHttpError(status, data)) {
        return {}
      }
      return {status, ok, data}
    }, (err) => {
      return {status: 500, ok: false, data: {message: err}}
    })
}
