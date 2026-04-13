const http = require('../../utils/request')
const { ensureLogin } = require('../../utils/auth')

Page({
  data: { item: null },

  async onLoad(options) {
    await ensureLogin()
    const data = await http.get(`/api/tickets/${options.id}`)
    this.setData({ item: data })
  }
})