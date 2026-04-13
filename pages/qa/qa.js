const http = require('../../utils/request')
const { ensureLogin } = require('../../utils/auth')

Page({
  data: { q: '', hot: [], list: [] },

  async onLoad() {
    await ensureLogin()
    await this.loadHot()
  },

  onQ(e) { this.setData({ q: e.detail.value }) },

  async loadHot() {
    const data = await http.get('/api/qa/hot')
    this.setData({ hot: data.items || [] })
  },

  async onSearch() {
    const q = (this.data.q || '').trim()
    if (!q) { wx.showToast({ title: '请输入关键词', icon: 'none' }); return }
    const data = await http.get('/api/qa/search', { q })
    this.setData({ list: data.items || [] })
  },

  openDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/qa-detail/qa-detail?id=${id}` })
  }
})