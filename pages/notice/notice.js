const http = require('../../utils/request')
const { ensureLogin } = require('../../utils/auth')

Page({
  data: { items: [] },

  async onShow() {
    await ensureLogin()
    await this.reload()
  },

  async reload() {
    const data = await http.get('/api/notices')
    this.setData({ items: data.items || [] })
  },

  open(e) {
    wx.navigateTo({ url: `/pages/notice-detail/notice-detail?id=${e.currentTarget.dataset.id}` })
  }
})