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

        need_type: [{
                name: '新产品布局'
            },
            {
                name: '研发外包'
            },
            {
                name: '产品研发中的问题攻克'
            },
            {
                name: '科技赋能现有产品'
            },
            {
                name: '现有产品市场推广 （限医疗健康领域）'
            },
            {
                name: '申请医疗器械证'
            },
            {
                name: '人才'
            },
            {
                name: '投融资'
            },
            {
                name: '企业管理咨询'
            },
            {
                name: '企业发展战略设计'
            },
        ],
        chooseRole: '',
        flagR: false,

        info: {
            form_personal: { // 报名填写项
                name: {
                    name: '企业名称*',
                    place: '请输入企业名称',
                    size: 20,
                },
                address: {
                    name: '地址*',
                    place: '请输入企业地址',
                    size: 20,
                },
                intro: {
                    name: '介绍*',
                    place: '请填写企业简介',
                    size: 80,
                },
                scale: {
                    name: '规模*',
                    place: '请输入企业规模，可填写企业员工数或年营业收入',
                    size: 40,
                },
                industry: {
                    name: '所处行业*',
                    place: '请输入企业所属行业。如：医疗器械、康复辅具、CRO',
                    size: 40,
                },
                product: {
                    name: '产品或服务种类*',
                    place: '请输入企业生产的产品或提供的服务种类。如：拐杖、轮椅、留置针、双目摄像机、器械CRO、受试者招募等',
                    size: 80,
                },
            },
            form_p1: {
                describe: {
                    name: '需求描述*',
                    place: '请详细描述您的需求',
                    size: 80,
                },
                coop: {
                    name: '合作单位/个人要求',
                    place: '如某领域的副教授职称以上教授。没有可填无',
                    size: 80,
                },
                price: {
                    name: '预算*',
                    place: '请输入您的预算',
                    size: 20,
                },
            },
            form_p2: {
                contact_man:{
                    name: '联系人*',
                    place: '请输入联系人姓名',
                    size: 20,
                },
                contact_way: {
                    name: '联系电话或微信*',
                    place: '请填写您的联系电话或微信号',
                    size: 80,
                },
                email: {
                    name: '邮箱*',
                    place: '请输入联系人邮箱，以便需求匹配过程中的文件传输',
                    size: 80,
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
        if (e.detail.value === '其他') {
            this.setData({
                flagR: true,
                chooseRole: ''
            })
        } else {
            this.setData({
                flagR: false
            })
        }
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
        promise.then(()=>{
            let flag = true // 先设置flag为true，用于检查
            const form = this.data.info.form // 取出输入的
            this.data.imgName = []
            form['fileID'] = []
            form['Need_type'] = this.data.chooseRole
    
            for (const i in this.data.pdfFiles) {
                form['fileID'].push(this.data.pdfFiles[i].path)
                this.data.imgName.push(this.data.pdfFiles[i].time + '_' + this.data.pdfFiles[i].name)
            }
    
            // console.log(form)
    
    
            const check = ['name', 'address', 'intro', 'scale', 'industry', 'product', 'Need_type', 'describe', 'price','contact_man','contact_way','email']
            const check_name = ['企业名称', '地址', '介绍', '规模', '所处行业', '产品或服务种类', '需求类型', '需求描述', '预算', '联系人', '联系方式', '邮箱']
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
                                    name: 'add_enterprise',
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
                        name: 'add_enterprise',
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