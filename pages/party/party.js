const http = require('../../utils/request')
const { ensureLogin } = require('../../utils/auth')

Page({
  data: { progress: null },

  async onShow() {
    await ensureLogin()
    const data = await http.get('/api/party/progress/me')
    this.setData({ progress: data })
  },

  goUpload() {
    wx.navigateTo({ url: '/pages/party-upload/party-upload' })
  }
})