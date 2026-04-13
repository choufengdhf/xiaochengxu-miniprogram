const { baseUrl } = require('./config')

function request(method, url, data = {}, options = {}) {
  const token = wx.getStorageSync('token') || ''
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success(res) {
        if (res.statusCode === 401) {
          wx.removeStorageSync('token')
          wx.removeStorageSync('user')
          if (!options.silent401) {
            wx.showToast({ title: '请先登录/绑定学号', icon: 'none' })
            wx.navigateTo({ url: '/pages/bind/bind' })
          }
          return reject(res)
        }
        if (res.statusCode >= 200 && res.statusCode < 300) return resolve(res.data)
        reject(res)
      },
      fail(err) { reject(err) }
    })
  })
}

module.exports = {
  get: (url, data, options) => request('GET', url, data, options),
  post: (url, data, options) => request('POST', url, data, options),
}