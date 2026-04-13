const http = require('../../utils/request')
const { ensureLogin } = require('../../utils/auth')

Page({
  data: { types: [], selectedType: null, reason: '' },

  async onLoad() {
    await ensureLogin()
    const data = await http.get('/api/ticket-types')
    this.setData({ types: data.items || [] })
  },

  onTypeChange(e) {
    const idx = Number(e.detail.value)
    this.setData({ selectedType: this.data.types[idx] })
  },

  onReason(e) { this.setData({ reason: e.detail.value }) },

  async submit() {
    const { selectedType, reason } = this.data
    if (!selectedType) return wx.showToast({ title: '请选择类型', icon: 'none' })
    if (!reason.trim()) return wx.showToast({ title: '请填写事由', icon: 'none' })

    await http.post('/api/tickets', { typeId: selectedType.id, reason })
    wx.showToast({ title: '已提交', icon: 'success' })
    wx.navigateBack()
  }
})