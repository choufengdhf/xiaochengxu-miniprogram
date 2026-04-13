const http = require('./request')

async function ensureLogin() {
  const token = wx.getStorageSync('token')
  if (token) return true

  // 走微信登录拿 code，再向后端换 token
  const code = await new Promise((resolve, reject) => {
    wx.login({
      success: (res) => res.code ? resolve(res.code) : reject(res),
      fail: reject
    })
  })

  const data = await http.post('/api/auth/wx-login', { code }, { silent401: true })
  // 后端会返回 { token, userBound, user }
  wx.setStorageSync('token', data.token)
  if (data.user) wx.setStorageSync('user', data.user)

  if (!data.userBound) {
    wx.navigateTo({ url: '/pages/bind/bind' })
    return false
  }
  return true
}

module.exports = { ensureLogin }