const app = getApp() // 全局APP
let that = {}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        all_item: [],
        isImg: [],
        fileName: [],
        evaluation: {},
        selectedFlag: [],
        send_index: [],
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
        that = this
        //// console.log(app.share_data)
        // console.log(options)
        app.call({
            name: 'getAllScience',
            data: {
                message: 'getData',
            }
        }).then(res => {
            var temp = []
            for (var i = 0; i < res.data.length; i++) {
                if (options.index[i * 2] === '1') {
                    temp.push(res.data[i])
                    this.data.selectedFlag.push(false)
                }
            }
            // console.log(temp)
            
            for (var i = 0; i < temp.length; i++) {
                var temp1 = []
                var tempName = []
                for (const j in temp[i].fileID) {
                    var z = temp[i].fileID[j]
                    var y = z.slice(z.indexOf('//') + 2)
                    var x = y.slice(y.indexOf('/') + 1)
                    tempName.push(x)
                    temp1.push(false)
                    if (temp[i].fileID[j].indexOf('jpg') != -1 || temp[i].fileID[j].indexOf('jpeg') != -1 || temp[i].fileID[j].indexOf('png') != -1) {
                        temp1[temp1.length - 1] = true
                    }
                }
                this.data.isImg.push(temp1)
                this.data.fileName.push(tempName)
            }
            
            this.setData({
                all_item: temp,
                isImg: this.data.isImg,
                fileName: this.data.fileName
            })
        })
    },
    download(e) {
        // console.log(e.currentTarget.id[2])
        wx.showLoading({
          title: '下载中',
        })
        wx.cloud.downloadFile({
            fileID: that.data.all_item[e.currentTarget.id[0]].fileID[e.currentTarget.id[2]]
        }).then(res => {
            // get temp file path
            // console.log(res)
            // 将临时地址转存到本地缓存中
            wx.saveFile({
                tempFilePath: res.tempFilePath,
                success: function (res) {
                    // console.log(res);
                    var savedFilePath = res.savedFilePath;
                    // console.log('文件已下载到' + savedFilePath);
                    // 查看下载的文件列表
                    wx.getSavedFileList({
                        success: function (res) {
                            // console.log(res);
                        }
                    })
                    // 打开文档
                    wx.openDocument({
                        filePath: savedFilePath,
                        success: function (res) {
                            // console.log('打开文档成功')
                        }
                    })
                    wx.hideLoading({
                      success: (res) => {},
                    })
                }
            })
        }).catch(error => {
            // console.log(error)
        })

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

    oninput(e) {
        const key = e.currentTarget.dataset.key
        this.data.evaluation[key] = e.detail.value
        // that.setData({ // 更改对应路径为输入信息
        //   [key]: e.detail.value
        // })
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
        for (var key in form) {
            this.data.all_item[key].evaluation.push(form[key])
        }

        if (flag === true) { // 如果flag=true，证明验证通过
            for (var i = 0; i < this.data.all_item.length; i++) {
                // console.log(this.data.all_item[i]._id)
                app.call({ // 发起云函数，提交信息
                    name: 'upload_eva_sci',
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
                    if (res.confirm) { //这里是点击了确定以后
                        // console.log('用户点击确定')
                    } else { //这里是点击了取消以后
                        // console.log('用户点击取消')
                    }
                }
            })
        }
    }
})