const http = require('../../utils/request')

Page({
  data: {
    hasToken: false,
    user: null,
    userBound: false,

    studentNo: '',
    name: '',
    major: '',

    debugMsg: ''
  },

  onShow() {
    const token = wx.getStorageSync('token')
    const user = wx.getStorageSync('user')
    this.setData({
      hasToken: !!token,
      user: user || null,
      userBound: !!(user && user.studentNo),
      debugMsg: ''
    })

    // 若已有 user，预填表单（可选）
    if (user && !this.data.userBound) {
      this.setData({
        studentNo: user.studentNo || '',
        name: user.name || '',
        major: user.major || ''
      })
    }
  },

  onStudentNo(e) { this.setData({ studentNo: (e.detail.value || '').trim() }) },
  onName(e) { this.setData({ name: (e.detail.value || '').trim() }) },
  onMajor(e) { this.setData({ major: (e.detail.value || '').trim() }) },

  // 手动触发微信登录：后端换 token
  doWxLogin() {
    wx.login({
      success: async (res) => {
        try {
          const data = await http.post('/api/auth/wx-login', { code: res.code }, { silent401: true })
          wx.setStorageSync('token', data.token)
          if (data.user) wx.setStorageSync('user', data.user)

          this.onShow()
          wx.showToast({ title: '登录成功', icon: 'success' })
        } catch (e) {
          console.warn(e)
          this.setData({ debugMsg: '登录失败：请确认后端已启动在 http://127.0.0.1:8080' })
          wx.showToast({ title: '登录失败', icon: 'none' })
        }
      },
      fail: () => wx.showToast({ title: 'wx.login 失败', icon: 'none' })
    })
  },

  async bindStudent() {
    if (!this.data.hasToken) {
      wx.showToast({ title: '请先微信登录', icon: 'none' })
      return
    }
    const { studentNo, name, major } = this.data
    if (!studentNo || !name) {
      wx.showToast({ title: '请填写学号与姓名', icon: 'none' })
      return
    }

    try {
      const data = await http.post('/api/auth/bind-student', { studentNo, name, major })
      wx.setStorageSync('user', data.user)
      this.onShow()
      wx.showToast({ title: '绑定成功', icon: 'success' })
    } catch (e) {
      console.warn(e)
      this.setData({ debugMsg: '绑定失败：请检查后端接口 /api/auth/bind-student' })
      wx.showToast({ title: '绑定失败', icon: 'none' })
    }
  },

  logout() {
    wx.removeStorageSync('token')
    wx.removeStorageSync('user')
    this.setData({
      hasToken: false,
      user: null,
      userBound: false,
      studentNo: '',
      name: '',
      major: '',
      debugMsg: ''
    })
    wx.showToast({ title: '已退出', icon: 'none' })
  }
})