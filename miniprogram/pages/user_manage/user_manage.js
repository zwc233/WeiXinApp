const app = getApp() // 全局APP
let that = null // 页面this指针
Page({
    data: {
        id: 0,
        user: '',
        pwd: '',
        hospitals: [],
        all_user: [],
        choose_hospital: "",
        show_user: [],
        delete_item:"",
    },
    oninput_pwd(e) {
        this.setData({
            pwd: e.detail.value
        })
    },
    oninput_user(e) {
        this.setData({
            user: e.detail.value
        })
    },
    onTian() {
        wx.navigateTo({
            url: '../admin/admin?admin=all&name=浙大孵化平台',
        })
    },
    radioChange(e) {
        this.setData({
            choose_hospital: e.detail.value
        })
    },
    CreateUser(){
        wx.navigateTo({
          url: '../user_create/user_create',
        })
    },
    ManageUser(){
        wx.navigateTo({
            url: '../user_manage/user_manage',
          })
    },
    onLoad: function (options) {
        that = this

        app.call({
            name: 'getDepartment',
            data: {
                message: 'getData',
            }
        }).then(res => {
            this.data.hospitals = []
            for (const i in res.data) {
                this.data.hospitals.push({})
                var h = i + 1;
                this.data.hospitals[i]['name'] = res.data[i].name
                this.data.hospitals[i]['value'] = res.data[i].name
            }
            this.setData({
                hospitals: this.data.hospitals
            })
            // console.log(this.data.hospitals)
        })

        app.call({
            name: 'getUser',
            data: {
                message: 'getData',
            }
        }).then(res => {
            this.setData({
                all_user: res.data
            })
        }).then(res => {
            this.data.show_user = []
            for (const i in this.data.all_user) {
                if (this.data.all_user[i].hospital[0] != 'all') {
                    this.data.show_user.push(this.data.all_user[i])
                    // console.log("Y")
                }
            }
            this.setData({
                show_user: this.data.show_user
            })
            // console.log(this.data.show_user)
        })


    },
    UserChoose(e){
        this.setData({
            delete_item:e.detail['value']
        })
        console.log(this.data.delete_item)
    },
    onDelete(){
        app.call({ // 发起云函数，提交信息
            name: 'delete_user',
            data: this.data.delete_item
        })
        wx.showModal({
            content: `删除成功`,
            showCancel: false,
        })
        this.onLoad()
    }
})