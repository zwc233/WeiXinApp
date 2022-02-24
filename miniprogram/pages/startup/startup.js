const app = getApp() // 全局APP
let that = null // 页面this指针
Page({
    data: {
        my_timer: 3,
        spage: 0, // 切换页面开始，勿改
        epage: 0, // 切换页面结束，勿改
        status: 0, // 报名状态
        height: 0,
        form: {}, // 报名信息填写
        submit_f: true,

        imgSrc: [],
        imgName: [],
        haveGetImgSrc: false,

        pdfFiles: [],

        hospitals: [],
        chooseHospital: '',
        flagH: false,

        Education: [{
                name: '博士及以上'
            },
            {
                name: '博士在读'
            },
            {
                name: '研究生学历'
            },
            {
                name: '研究生在读'
            },
            {
                name: '本科学历'
            },
            {
                name: '其他'
            }
        ],
        chooseEducation:'',

        manner: [{
                name: '全职创业'
            },
            {
                name: '兼职创业'
            },
            {
                name: '其他'
            },
        ],
        chooseRole: '',
        flagR: false,

        info: {
            form_personal: { // 报名填写项
                school: {
                    name: '毕业院校*',
                    place: '请输入您最高学历的毕业院校',
                    size: 80,
                },
                work: {
                    name: '工作履历*',
                    place: '请输入您的工作履历',
                    size: 80,
                },
                industry: {
                    name: '了解的行业*',
                    place: '请输入您了解的行业并具体描述。如三类医疗器械报证；康复辅具；器官移植',
                    size: 80,
                },
                scale: {
                    name: '擅长的领域*',
                    place: '请输入您擅长的领域并具体描述。如：商业模式设计、财务、股权架构、领导力等',
                    size: 80,
                },
                mem: {
                    name: '创业经历*',
                    place: '请输入您的创业经历，没有可填无',
                    size: 80,
                },
            },
            form_p1: {
                prospect: {
                    name: '预期的创业项目',
                    place: '请输入您对预期创业项目的描述，没有可不填',
                    size: 80,
                },
                self_eva: {
                    name: '自我评价*',
                    place: '请输入您的自我评价',
                    size: 80,
                },
                other: {
                    name: '其他',
                    place: '如有其他以上未填写的必要信息，均可在此填写',
                    size: 80,
                },
            },
            form_p2: {
                contact_way: {
                    name: '联系电话或微信*',
                    place: '请填写您的联系电话或微信号',
                    size: 80,
                },
                email: {
                    name: '邮箱*',
                    place: '请输入您的邮箱',
                    size: 20,
                },
            },

            form: {}
        }
    },
    /**
     * 页面加载
     */
    onLoad() {
        that = this // 页面this指向指针变量

        app.call({
            name: 'getDepartment',
            data: {
                message: 'getData',
            }
        }).then(res => {
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


        const {
            windowHeight,
            windowWidth
        } = wx.getSystemInfoSync() // 获取系统屏幕信息

        that.init() // 初始化
    },
    /**
     * 初始化加载信息
     */
    async init() {

    },

    uploadPDF() {
        wx.chooseMessageFile({
            count: 1,
            type: 'file',
            success(res) {
                const tempFilePaths = res.tempFiles
                that.data.pdfFiles.push(tempFilePaths[0])
                that.setData({
                    pdfFiles: that.data.pdfFiles
                })
                // console.log(that.data.pdfFiles)
            }
        })
    },
    previewImage(e) {
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: [e.currentTarget.id], // 需要预览的图片http链接列表
        });
    },


    checkboxChange3: function (e) {
        this.data.chooseRole = e.detail.value
    },

    checkboxChange_edu: function (e) {
        this.data.chooseEducation = e.detail.value
        // console.log(this.data.chooseEducation)
      },

    oninput(e) {
        const key = `${e.currentTarget.dataset.key}` // 将key值带入，生成改变路径
        // console.log(key)
        this.data.info.form[key] = e.detail.value
    },


    oninputR(e) {
        this.data.chooseRole = e.detail.value
        // console.log(this.data.chooseRole)
    },
    /**
     * 提交报名
     */
    async submit() {
        let promise = new Promise(function(resolve, reject){
            that.setData({
              submit_f:false
            })
            resolve()
        })
        promise.then(() =>{
            let flag = true // 先设置flag为true，用于检查
            const form = this.data.info.form // 取出输入的
            this.data.imgName = []
            form['fileID'] = []
            form['Education'] = this.data.chooseEducation
            form['Manner'] = this.data.chooseRole
    
            for (const i in this.data.pdfFiles) {
                form['fileID'].push(this.data.pdfFiles[i].path)
                this.data.imgName.push(this.data.pdfFiles[i].time + '_' + this.data.pdfFiles[i].name)
            }
    
            // console.log(form)
    
    
            const check = ['name', 'Education','school','work', 'industry', 'scale','mem','Manner','self_eva', 'contact_way', 'email']
            const check_name = ['姓名','学历','毕业院校','工作履历','了解的行业','擅长的领域','创业经历','对创业的态度','自我评价','联系方式','邮箱']
            for (const i in check) { // 对原始结构进行循环
                if (form[check[i]] == null || form[check[i]] === '') { // 如果原始需要填写的没有写
                    wx.showModal({ // 提示要补充
                        content: `${check_name[i]}未填写，请补充！`,
                        showCancel: false,
                        success(res) {
                            that.setData({
                                submit_f: true
                            })
                        }
                    })
                    flag = false // 设置false，跳过提交环节
                    break // 退出for循环
                }
            }
    
            if (flag === true){
                if ( !app.check_email(form['email']) ){
                  wx.showModal({ // 提示要补充
                    content: `邮箱格式错误`,
                    showCancel: false,
                    success(res) {
                        that.setData({
                            submit_f: true
                        })
                    }
                  })
                  flag = false
                }
              }
    
            if (flag === true) { // 如果flag=true，证明验证通过
                if (form['fileID'].length != 0) {
                    var signal = form['fileID'].length
                    for (const i in form['fileID']) {
                        wx.cloud.uploadFile({
                            // 指定上传到的云路径
                            cloudPath: this.data.imgName[i],
                            // 指定要上传的文件的小程序临时文件路径
                            filePath: form['fileID'][i],
                            config: {
                                env: this.data.envId
                            }
                        }).then(res => {
                            form['fileID'][i] = res.fileID
                            // console.log('上传成功', res);
                        }).then(res => {
                            signal -= 1
                            if (signal <= 0) {
                                app.call({ // 发起云函数，提交信息
                                    name: 'add_startup',
                                    data: form
                                })
                                wx.showModal({
                                    content: `提交成功`,
                                    showCancel: false,
                                })
                            }
                        }).catch((e) => {
                            // console.log(e);
                        });
                    }
    
                } else {
                    // console.log('no')
                    app.call({ // 发起云函数，提交信息
                        name: 'add_startup',
                        data: form
                    })
                    wx.showModal({
                        content: `提交成功`,
                        showCancel: false,
                    })
                }
            }
        })

    }
})