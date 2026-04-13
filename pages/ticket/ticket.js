const http = require('../../utils/request')
const { ensureLogin } = require('../../utils/auth')

Page({
  data: { items: [] },

  async onShow() {
    await ensureLogin()
    const data = await http.get('/api/tickets')
    this.setData({ items: data.items || [] })
  },

  goCreate() { wx.navigateTo({ url: '/pages/ticket-create/ticket-create' }) },

  open(e) {
    wx.navigateTo({ url: `/pages/ticket-detail/ticket-detail?id=${e.currentTarget.dataset.id}` })
  }
})