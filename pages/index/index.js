const { ensureLogin } = require('../../utils/auth')

Page({
  data: { user: null },

  async onShow() {
    await ensureLogin()
    const user = wx.getStorageSync('user')
    this.setData({ user: user || null })
  },

  onRefresh() {
    const user = wx.getStorageSync('user')
    this.setData({ user: user || null })
    wx.showToast({ title: '已刷新', icon: 'none' })
  },

  goBind() { wx.navigateTo({ url: '/pages/bind/bind' }) },
  goQa() { wx.navigateTo({ url: '/pages/qa/qa' }) },
  goParty() { wx.navigateTo({ url: '/pages/party/party' }) },
  goNotice() { wx.navigateTo({ url: '/pages/notice/notice' }) },
  goTicket() { wx.navigateTo({ url: '/pages/ticket/ticket' }) },
})