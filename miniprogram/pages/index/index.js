const app = getApp() // 全局APP
let that = null // 页面this指针
Page({
  data:{
    id:0,
    user:'',
    pwd:'',
    show_login:false

  },
  oninput(e){
    this.data.pwd = e.detail.value
  },
  onTian(){
      wx.navigateTo({
        url:'../science_hospital_entry/science_hospital_entry',
      })
  },
  onTianScience(){
    wx.navigateTo({
      url:'../enterprise_startup_entry/enterprise_startup_entry',
    })
  },
  onTianTurn(){
    wx.navigateTo({
      url:'../turn_need/turn_need',
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
  oninput_pwd(e){
    this.setData({
      pwd:e.detail.value
    })
  },
  oninput_user(e){
    this.setData({
      user:e.detail.value
    })
  },
  modalConfirm(e){
    app.call({
      name: 'getUser',
      data: {
        message: 'getData',
      }
    }).then(res => {
      var flag = true
      for (const i in res.data) {
        if (this.data.pwd == res.data[i].pwd && this.data.user == res.data[i].name){
          flag = false
          if (res.data[i].hospital[0] == "all"){
            wx.navigateTo({
              url:'../admin_main/admin_main',
            })
          }
          else{
            var temp = res.data[i].hospital[0]
            for (var j = 1; j < res.data[i].hospital.length ;j++){
              temp += ( "," + res.data[i].hospital[j])
            }
            wx.navigateTo({
              url:`../admin/admin?admin=${temp}&name=${this.data.user}`,
            })
          }
        }
      }
      if (flag){
        wx.showModal({
          content: '用户名或密码错误',
          showCancel:false
        })
      }
    })
  },
  onSee(e){
    this.setData({
      show_login:true
    })

  },
  onLoad(){
    app.loadFont()
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
