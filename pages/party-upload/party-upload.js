const { baseUrl } = require('../../utils/config')
const http = require('../../utils/request')
const { ensureLogin } = require('../../utils/auth')

Page({
  data: { remark: '', filePath: '', fileName: '' },

  async onLoad() { await ensureLogin() },

  onRemark(e) { this.setData({ remark: e.detail.value }) },

  chooseFile() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: (res) => {
        const f = res.tempFiles[0]
        this.setData({ filePath: f.path, fileName: f.name })
      }
    })
  },

  submit() {
    const token = wx.getStorageSync('token')
    const { remark, filePath, fileName } = this.data
    if (!filePath) return

    wx.uploadFile({
      url: `${baseUrl}/api/files/upload`,
      filePath,
      name: 'file',
      header: { 'Authorization': `Bearer ${token}` },
      formData: { biz: 'party_material', filename: fileName },
      success: async (res) => {
        const json = JSON.parse(res.data || '{}')
        const fileId = json.id
        await http.post('/api/party/materials/submit', { fileId, remark })
        wx.showToast({ title: '提交成功', icon: 'success' })
        wx.navigateBack()
      },
      fail: () => wx.showToast({ title: '上传失败', icon: 'none' })
    })
  }
})