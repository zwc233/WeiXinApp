const app = getApp() // 全局APP
let that = null // 页面this指针
Page({
  data:{
    pwd:'',
    temp_save:'',
    user:'',
    is_admin:false
  },
  oninput(e){
    this.data.pwd = e.detail.value
  },

  onSee(e){
    // this.data.pwd === 'vmm1024'
      wx.navigateTo({
        url:`../admin_hurt/admin_hurt?admin=${this.data.temp_save}&name=${this.data.user}`,
      })
  },
  onSeeScience(){
    wx.navigateTo({
      url:`../admin_science/admin_science?admin=${this.data.temp_save}&name=${this.data.user}`,
    })
  },
  onSeeTurn(){
    wx.navigateTo({
      url:`../admin_turn_need/admin_turn_need?admin=${this.data.temp_save}&name=${this.data.user}`,
    })
  },
  onSeeEnter(){
    wx.navigateTo({
      url:`../admin_enterprise/admin_enterprise?admin=${this.data.temp_save}&name=${this.data.user}`,
    })
  },
  onSeeStartup(){
    wx.navigateTo({
      url:`../admin_startup/admin_startup?admin=${this.data.temp_save}&name=${this.data.user}`,
    })
  },
  onLoad(options){
    if (options['admin'] == 'all'){
      this.setData({
        is_admin:true
      })
    }
    else{
      this.setData({
        is_admin:false
      })
    }
    this.setData({
      temp_save:options['admin'],
      user:options['name']
    })
  }
})
