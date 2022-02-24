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
        selectedFlag: [],
        send_index: [],
        user:''
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
        var temp_save = options['admin'].split(",")
        // console.log(temp_save)
        this.setData({
            user:options['name']
          })

        app.call({
            name: 'getAllStartup',
            data: {
                message: 'getData',
            }
        }).then(res => {
            var new_res = []
            for (const i in res.data){
              var flag = false
              for (const j in temp_save){
                if (res.data[i].hospital == temp_save[j]){
                  flag = true
                  break
                }
              }
              if (flag || temp_save[0] == 'all'){
                new_res.push(res.data[i])
              }
            }
            for (var i = 0; i < new_res.length; i++) {
                this.data.selectedFlag.push(false)
                this.data.send_index.push(0)
                var temp = []
                var tempName = []
                for (const j in new_res[i].fileID) {
                    var z = new_res[i].fileID[j]
                    var y = z.slice(z.indexOf('//') + 2)
                    var x = y.slice(y.indexOf('/') + 1)
                    tempName.push(x)
                    temp.push(false)
                    if (new_res[i].fileID[j].indexOf('jpg') != -1 || new_res[i].fileID[j].indexOf('jpeg') != -1 || new_res[i].fileID[j].indexOf('png') != -1) {
                        temp[temp.length - 1] = true
                    }
                }
                this.data.isImg.push(temp)
                this.data.fileName.push(tempName)
            }
            this.setData({
                all_item: new_res,
                isImg: this.data.isImg,
                fileName: this.data.fileName,
            })
        })
    },

    checkboxChange_shai(e) {
        this.data.shai_conditon = e.detail.value
        if (e.detail.value.length === 0) {
    
          for (const i in this.data.show_data) {
            this.data.show_data[i] = true;
          }
        } else {
          for (const i in this.data.show_data) {
            this.data.show_data[i] = false;
          }
          for (const i in e.detail.value) {
            if (e.detail.value[i] === '其他') {
              for (const j in this.data.show_data) {
                var show_flag = true
                for(const k in this.data.hospitals){
                  if (this.data.all_item[j].hospital === this.data.hospitals[k].name){
                    show_flag = false
                  }
                }
                this.data.show_data[j] = show_flag
              }
            } else {
              for (const j in this.data.show_data) {
                if (e.detail.value[i] === this.data.all_item[j].hospital) {
                  this.data.show_data[j] = true
                }
              }
            }
          }
        }
        this.setData({
          shai_conditon: this.data.shai_conditon,
          show_data: this.data.show_data
        })
      },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

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
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

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

    previewImage(e) {
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: [e.currentTarget.id], // 需要预览的图片http链接列表
        });
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        // console.log("OK")
        app.share_data = []
        for (var i = 0; i < this.data.all_item.length; i++) {
            if (this.data.send_index[i] === 1) {
                app.share_data.push(this.data.all_item[i])
            }
        }

        var str_send = `/pages/share_science/share_science?index=${this.data.send_index}`
        // console.log(str_send)
        wx.navigateTo({
            url: `/pages/share_science/share_science?index=${this.data.send_index}`,
        })
        return {
            title: `${this.data.user}给您分享`,
            path: str_send,
            imageUrl: '/images/main_s.png',
            success: function (res) {
                // 转发成功
                wx.showToast({
                    title: "分享成功",
                    icon: 'success',
                    duration: 2000
                })
            },
            fail: function (res) {
                // 分享失败
            },
        }
    }
})