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
    async onSubmit() {
        var flag = true
        if (this.data.user === '' || this.data.user == null) {
            wx.showModal({ // 提示要补充
                content: `未填写用户`,
                showCancel: false
            })
            flag = false
        }
        if (this.data.pwd === '' || this.data.pwd == null) {
            wx.showModal({ // 提示要补充
                content: `未填写密码`,
                showCancel: false
            })
            flag = false
        }
        if (this.data.choose_hospital === '' || this.data.choose_hospital == null) {
            wx.showModal({ // 提示要补充
                content: `未选择合作单位`,
                showCancel: false
            })
            flag = false
        }
        if (flag == true) {
            for (const i in this.data.all_user) {
                // console.log(this.data.all_user[i].name)
                if (this.data.user == this.data.all_user[i].name) {
                    flag = false
                    wx.showModal({ // 提示要补充
                        content: `账号重复`,
                        showCancel: false
                    })
                    break
                }
            }
        }
        if (flag == true) {
            // console.log("ok")
            var form = {
                name: this.data.user,
                pwd: this.data.pwd,
                hospital: [this.data.choose_hospital],
            }
            app.call({ // 发起云函数，提交信息
                name: 'add_user',
                data: form
            })
            wx.showModal({
                content: `提交成功`,
                showCancel: false,
            })
            this.onLoad();
        }
    },
})