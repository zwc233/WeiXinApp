const app = getApp() // 全局APP
let that = null // 页面this指针
Page({
  item:{
    id:0,
  },


  data:{
    id:0,
    pwd:''
  },
  oninput(e){
    this.data.pwd = e.detail.value
  },
  onTian(){
      wx.navigateTo({
        url:'../question/question',
      })
  },
  onTianScience(){
    wx.navigateTo({
      url:'../science/science',
    })
  },
  onTianEnter(){
    wx.navigateTo({
      url:'../enterprise/enterprise',
    })
  },
  onTianStartup(){
    wx.navigateTo({
      url:'../startup/startup',
    })
  },

  onWord(){
    wx.cloud.callFunction({
      name:'Data2Word',
      success:function (res){
        // console.log(res)
      },
      data: {
        item:{
          id:0
        }
      },
      item:{
        id:0
      },
      fail:  console.error
    })
  },

  onSee(e){
    // console.log(this.data.pwd)
    // this.data.pwd === 'vmm1024'
    if (true){
      wx.navigateTo({
        url:'../admin/admin',
      })
    }
    else{
      wx.showModal({
        title: '提示',
        content: '密码错误',
        success: function (res) {
            if (res.confirm) { //这里是点击了确定以后
                // console.log('用户点击确定')
            } else { //这里是点击了取消以后
                // console.log('用户点击取消')
            }
        }
    })
    }
  },
  getPhoneNumber(e) {
    // console.log(e)
    if (e.detail.encryptedData) {
      this.setData({
        havePhone: false
      })
      wx.request({
        url: app.globalData.url + 'xiao_bindphone',
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          user_id: app.globalData.user_id,
          sessionKey: app.globalData.sessionKey,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        success(res) {
          // console.log(res)
        }
      })
    }
  }
})
