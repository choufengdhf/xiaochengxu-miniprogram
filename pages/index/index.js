Page({
  data: {},

  goMe() {
    wx.switchTab({ url: '/pages/me/me' })
  },

  comingSoon(e) {
    const name = e.currentTarget.dataset.name || '功能'
    wx.showToast({ title: `${name}：未实现`, icon: 'none' })
  },

  // 入口路由：如果页面不存在就提示，避免报错
  go(e) {
    const to = e.currentTarget.dataset.to
    const map = {
      qa: '/pages/qa/qa',
      party: '/pages/party/party',
      notice: '/pages/notice/notice',
      ticket: '/pages/ticket/ticket'
    }
    const url = map[to]
    if (!url) return this.comingSoon({ currentTarget: { dataset: { name: '功能' } } })

    // 由于你目前 app.json 只保留了 index+me，这些页面大概率不存在
    // 直接 navigateTo 会报错，所以先做兜底提示：
    wx.showToast({ title: '该入口页面暂未加入项目', icon: 'none' })
    // 如果你后面把对应页面加回 app.json，再把下面一行注释取消即可：
    // wx.navigateTo({ url })
  }
})