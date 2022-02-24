const app = getApp() // 全局APP
let that = {}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        all_item: [],
        selectedFlag: [],
        evaluation: [],
        send_index: [],
        flag:false,
        submit_f:true,
        Problem: [{
                name: 'A、不认为该成果解决的问题有解决的必要'
            },
            {
                name: 'B、有一定的必要性但并非刚需'
            },
            {
                name: 'C、确实非常有必要解决'
            },
            {
                name: 'D、不了解无法评价'
            },
        ],
        Solution: [{
                name: 'A、存在成本优势'
            },
            {
                name: 'B、存在性能/技术优势'
            },
            {
                name: 'C、成本和性能/技术方面均有优势'
            },
            {
                name: 'D、成本和性能/技术均无优势'
            },
            {
                name: 'E、不了解无法评价'
            },
        ],
        Prospect: [{
                name: 'A、切中市场刚需，且具备领先优势，很有前景'
            },
            {
                name: 'B、有一定前景，但需较强的商业化运作'
            },
            {
                name: 'C、没有前景'
            },
            {
                name: 'D、不了解无法评价'
            },
        ],
    },
    // 展开折叠选择  
    changeToggle: function (e) {
        var index = e.currentTarget.id;
        if (this.data.selectedFlag[index]) {
            this.data.selectedFlag[index] = false;
        } else {
            this.data.selectedFlag[index] = true;
        }

        this.setData({
            selectedFlag: this.data.selectedFlag
        })
    },

    checkboxChange: function (e) {
        var index = e.currentTarget.id;
        if (this.data.selectedFlag[index]) {
            this.data.selectedFlag[index] = false;
        } else {
            this.data.selectedFlag[index] = true;
        }

        this.setData({
            selectedFlag: this.data.selectedFlag
        })

        if (this.data.send_index[e.currentTarget.dataset["key"]] === 0)
            this.data.send_index[e.currentTarget.dataset["key"]] = 1
        else
            this.data.send_index[e.currentTarget.dataset["key"]] = 0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        that = this
        if (options.flag == "1"){
            this.setData({
                flag:true
            })
            // console.log(this.data.flag)
        }
        else if (options.flag == "0"){
            this.setData({
                flag:false
            })
            // console.log(this.data.flag)
        }
        that = this
        app.call({
            name: 'getAllTurn',
            data: {
                message: 'getData',
            }
        }).then(res => {
            var temp = []
            for (var i = 0; i < res.data.length; i++) {
                if (options.index[i * 2] === '1') {
                    temp.push(res.data[i])
                    this.data.selectedFlag.push(false)
                    var temp2 = {}
                    this.data.evaluation.push(temp2)
                }
            }
            // console.log(temp)
            this.setData({
                all_item: temp,
            })
        })
    },

    checkboxChange_problem: function (e) {
        const key = e.currentTarget.dataset.key
        this.data.evaluation[key]['Problem'] = e.detail.value
    },

    checkboxChange_solution: function (e) {
        const key = e.currentTarget.dataset.key
        this.data.evaluation[key]['Solution'] = e.detail.value
    },

    checkboxChange_prospect: function (e) {
        const key = e.currentTarget.dataset.key
        this.data.evaluation[key]['Prospect'] = e.detail.value
    },



    oninput_name(e) {
        const key = e.currentTarget.dataset.key
        this.data.evaluation[key]['name'] = e.detail.value
    },

    oninput_place(e) {
        const key = e.currentTarget.dataset.key
        this.data.evaluation[key]['place'] = e.detail.value
    },

    oninput_price(e) {
        const key = e.currentTarget.dataset.key
        this.data.evaluation[key]['price'] = e.detail.value
    },

    oninput_comp(e) {
        const key = e.currentTarget.dataset.key
        this.data.evaluation[key]['comp'] = e.detail.value
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
    oninput(e) {
        const key = e.currentTarget.dataset.key
        // console.log(key)
        this.data.evaluation[key] = e.detail.value
        // that.setData({ // 更改对应路径为输入信息
        //   [key]: e.detail.value
        // })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    async submit() {
        let flag = true // 先设置flag为true，用于检查
        const form = this.data.evaluation // 取出输入的

        // console.log(form)
        const check = ['name','place','Problem','Solution','Prospect','comp']
        const check_name = ['姓名','单位','成果解决的问题是否有必要被解决','该解决方案与现有解决方案比是否存在优势','您认为该成果转化的市场前景如何','综合评价']
        for (const i in form){
            for (const j in check){
                // console.log(form[i][check[j]])
                if (form[i][check[j]] == null || form[i][check[j]] == ''){
                    wx.showModal({ // 提示要补充
                        content: `${check_name[j]}未填写，请补充！`,
                        showCancel: false
                    })
                    flag = false // 设置false，跳过提交环节
                    break // 退出for循环
                }
            }
        }

        if (flag === true) { // 如果flag=true，证明验证通过
            for (var key in form) {
                this.data.all_item[key].evaluation.push(form[key])
            }
            for (var i = 0; i < this.data.all_item.length; i++) {
                // console.log(this.data.all_item[i]._id)
                app.call({ // 发起云函数，提交信息
                    name: 'upload_eva_turn',
                    data: {
                        id: `${this.data.all_item[i]._id}`,
                        evaluation: this.data.all_item[i].evaluation
                    }
                }).catch((e) => {
                    // console.log(e);
                });
            }

            wx.showModal({
                title: '提示',
                content: '上传成功',
                success: function (res) {
                    that.setData({
                        submit_f:false
                    })
                }
            })
        }
    }
})