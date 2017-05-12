// eslint-disable-next-line
import 'whatwg-fetch'
import url from 'url'
import _ from 'lodash'
import { Message } from 'element-ui'

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
      Message.error({
        message: data.message,
        duration: 5000
      })
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

  let status, data
  return fetch(uri, params)
    .then((res) => {
      status = res.status
      return res.json()
    })
    .then((res) => {
      data = res

      if (status >= 400) {
        throw new Error(data.message)
      }
      return {status, data}
    })
    .catch(function (err) {
      if (typeof data !== 'object') {
        data = {message: err.message}
      }

      handleHttpError(status, data)
      throw err
    })
}
