const app = getApp() // 全局APP
let that = {}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        all_item: [],
        evaluation: [],
        selectedFlag: [],
        send_index: [],
        flag:false,
        Reality: [
            {name:'A、痛点并不存在'},
            {name:'B、痛点存在但并不产生困扰，没有必要专门解决'},
            {name:'C、痛点存在且产生困扰，有必要找合适的解决方案'},
            {name:'D、不了解该场景无法评价'},
          ],
        chooseReality:"",

        Solution: [
            {name:'A、目前没有解决方案'},
            {name:'B、目前已有解决方案但仍有改进的空间'},
            {name:'C、目前已有成熟的解决方案'},
            {name:'D、不了解该场景无法评价'},
          ],
        chooseSolution:"",

        Scene: [
            {name:'A、极为罕见'},
            {name:'B、比较罕见'},
            {name:'C、较为常见'},
            {name:'D、常见'},
            {name:'E、不了解该场景无法评价'},
          ],
        chooseScene:"",
        
        Frequency: [
            {name:'A、每天多次'},
            {name:'B、每天一次'},
            {name:'C、每周两三次'},
            {name:'D、每周一次'},
            {name:'E、每月一次'},
            {name:'F、几个月一次或更低'},
            {name:'G、不了解该场景无法评价'},
          ],
        chooseFrequency:"",

        Prospect: [
            {name:'A、市场前景很好'},
            {name:'B、市场前景较好'},
            {name:'C、市场前景一般'},
            {name:'D、无市场前景'},
            {name:'E、不了解该场景无法评价'},
          ],
        chooseProspect:"",
        submit_f:true,

    },
    previewImage(e) {
        wx.previewImage({
          current: e.currentTarget.id, // 当前显示图片的http链接
          urls: [e.currentTarget.id], // 需要预览的图片http链接列表
        });
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

    checkboxChange: function (e) {},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        that = this;
        //// console.log(app.share_data)
        // console.log(options)
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
        app.call({
            name: 'getAll',
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

    checkboxChange_reality: function (e) {
        const key = e.currentTarget.dataset.key
        this.data.evaluation[key]['Reality'] = e.detail.value
    },

    checkboxChange_solution: function (e) {
        const key = e.currentTarget.dataset.key
        this.data.evaluation[key]['Solution'] = e.detail.value
    },

    checkboxChange_scene: function (e) {
        const key = e.currentTarget.dataset.key
        this.data.evaluation[key]['Scene'] = e.detail.value
    },

    checkboxChange_frequency: function (e) {
        const key = e.currentTarget.dataset.key
        this.data.evaluation[key]['Frequency'] = e.detail.value
    },

    checkboxChange_prospect: function (e) {
        const key = e.currentTarget.dataset.key
        this.data.evaluation[key]['Prospect'] = e.detail.value
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    oninput_name(e) {
        const key = e.currentTarget.dataset.key
        this.data.evaluation[key]['name'] = e.detail.value
    },

    oninput_place(e) {
        const key = e.currentTarget.dataset.key
        this.data.evaluation[key]['place'] = e.detail.value

    },

    oninput_ds(e) {
        const key = e.currentTarget.dataset.key
        this.data.evaluation[key]['describe'] = e.detail.value

    },

    oninput_eva(e) {
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {},
    async submit() {
        let flag = true // 先设置flag为true，用于检查
        const form = this.data.evaluation // 取出输入的

        // console.log(form)
        const check = ['name','place','Reality','Solution','Scene','Frequency','Prospect','comp']
        const check_name = ['姓名','单位','痛点真实性','现有解决方案','痛点覆盖的场景','痛点出现的频率','痛点前景','综合评价']
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
                    name: 'upload_eva',
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