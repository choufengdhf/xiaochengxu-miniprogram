const http = require('../../utils/request')
const { baseUrl } = require('../../utils/config')
const { ensureLogin } = require('../../utils/auth')

Page({
  data: { id: '', item: null },

  async onLoad(options) {
    await ensureLogin()
    this.setData({ id: options.id })
    const data = await http.get(`/api/qa/articles/${options.id}`)
    this.setData({ item: data })
  },

  openPolicy() {
    const url = this.data.item.policyUrl
    // 简化：直接复制/打开（如果是http链接可用webview；课程可先做复制）
    wx.setClipboardData({ data: url })
    wx.showToast({ title: '已复制链接', icon: 'none' })
  },

  download(e) {
    const fileId = e.currentTarget.dataset.id
    const token = wx.getStorageSync('token')
    const url = `${baseUrl}/api/files/${fileId}/download`
    wx.downloadFile({
      url,
      header: { 'Authorization': `Bearer ${token}` },
      success: (res) => {
        wx.openDocument({ filePath: res.tempFilePath, showMenu: true })
      },
      fail: () => wx.showToast({ title: '下载失败', icon: 'none' })
    })
  }
})