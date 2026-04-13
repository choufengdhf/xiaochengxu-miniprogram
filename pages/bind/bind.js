const http = require('../../utils/request')
const { ensureLogin } = require('../../utils/auth')

Page({
  data: { studentNo: '', name: '', major: '' },

  async onShow() {
    // 确保已拿到 token（哪怕未绑定）
    await ensureLogin()
  },

  onStudentNo(e) { this.setData({ studentNo: e.detail.value.trim() }) },
  onName(e) { this.setData({ name: e.detail.value.trim() }) },
  onMajor(e) { this.setData({ major: e.detail.value.trim() }) },

  async onBind() {
    const { studentNo, name, major } = this.data
    if (!studentNo || !name) {
      wx.showToast({ title: '请填写学号与姓名', icon: 'none' })
      return
    }
    try {
      const data = await http.post('/api/auth/bind-student', { studentNo, name, major })
      wx.setStorageSync('user', data.user)
      wx.showToast({ title: '绑定成功', icon: 'success' })
      wx.navigateBack()
    } catch (e) {
      wx.showToast({ title: '绑定失败，请检查信息', icon: 'none' })
    }
  }
})