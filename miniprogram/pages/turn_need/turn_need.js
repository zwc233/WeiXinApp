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

        hospitals: [

        ],
        chooseHospital: '',
        flagH: false,

        Resource:[
            {name: '参与研发'},
            {name: '场景试用'},
            {name: '市场推广'},
            {name: '资金'},
        ],
        chooseResource:[],
        flagResource:false,
        Resource_other:'',

        Turnway:[
            {name: '专利一次性转让'},
            {name: '专利授权'},
            {name: '专利&技术入股'},
            {name: '自主创业'},
        ],
        chooseTurnway:[],
        flagTurnway:false,
        Turnway_other:'',

        Phase: [{
                name: '想法待验证'
            },
            {
                name: '已申报专利但未获授权'
            },
            {
                name: '已授权专利'
            },
            {
                name: '样机/样品研发中'
            },
            {
                name: '已完成样机/样品'
            },
            {
                name: '试销'
            },
            {
                name: '小批量生产'
            },
            {
                name: '批量生产'
            },
            {
                name: '其他'
            }
        ],
        choosePhase: '',
        flagP1: '',
        flagP2: '',
        flagP3: '',

        Turn_need: [{
                name: '研发'
            },
            {
                name: '打样'
            },
            {
                name: '资金'
            },
            {
                name: '生产'
            },
            {
                name: '商业模式设计'
            },
            {
                name: '市场推广'
            },
            {
                name: '其他'
            }
        ],
        chooseTurn: [],
        

        info: {
            form_personal: { // 报名填写项
                sci_realm: {
                    name: '工作/研究领域*',
                    place: '请填写您的工作方向或研究领域。工作方向举例：如新生儿科。研究领域举例：如细胞再生领域、辅助生殖领域、柔性电子领域、力学传感领域',
                    size: 80,
                },
                sci_problem: {
                    name: '成果拟解决的问题*',
                    place: '请填写您的科技成果拟解决或可能解决的问题。例如：脑卒中患者长时间卧床导致的足底压疮问题；生殖辅助过程中细胞污染问题；男性脱发问题；精神疾病诊断问题；慢阻肺新疗法',
                    size: 80,
                },
                sci_describe: {
                    name: '成果描述*',
                    place: '请详细描述您的成果，包括但不限于成果针对的痛点、成果所采用技术原理、技术路径等',
                    size: 80,
                },
            },
            form_p1:{
                sci_need: {
                    name: '转化需求描述*',
                    place: '请进一步描述您的转化需求。例如：需要材料学专家参与确定成果所使用的材料种类；需要机械领域专家参与确定成果结构；需要10万资金进行临床验证。无法描述可不填',
                    size: 80,
                },
            },
            form_p2:{
                sci_resource: {
                    name: '可提供的资源描述*',
                    place: '请进一步描述您在转化过程中可提供的资源。例如：参与成果产品化的设计与研发过程；成果产品化后在某些场景进行推广',
                    size: 80,
                },
            },
            form_p3:{
                contact_way: {
                    name: '联系方式*',
                    place: '可填手机号、微信号',
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
    uploadPDF(){
        wx.chooseMessageFile({
          count: 1,
          type: 'file',
          success (res) {
            const tempFilePaths = res.tempFiles
            that.data.pdfFiles.push(tempFilePaths[0])
            that.setData({
              pdfFiles:that.data.pdfFiles
            })
            // console.log(that.data.pdfFiles)
          }
        })
      },
    /**
     * 初始化加载信息
     */
    async init() {

    },

    checkboxChange2: function (e) {
        this.data.chooseHospital = e.detail.value
        if (e.detail.value === '其他') {
            this.setData({
                flagH: true,
                chooseHospital: ''
            })
        } else {
            this.setData({
                flagH: false
            })
        }

    },
    checkboxChange_phase: function (e) {
        this.data.choosePhase = e.detail.value
        if (e.detail.value === '其他') {
            this.setData({
                flagP2: true,
                choosePhase: ''
            })
        } else {
            this.setData({
                flagP2: false
            })
        }
        if (e.detail.value === '已申报专利但未获授权') {
            this.setData({
                flagP1: true,
                choosePhase: ''
            })
        } else {
            this.setData({
                flagP1: false
            })
        }
        if (e.detail.value === '已授权专利') {
            this.setData({
                flagP3: true,
                choosePhase: ''
            })
        } else {
            this.setData({
                flagP3: false
            })
        }

        // console.log(this.data.choosePhase)
    },
    checkboxChange_turn: function (e) {
        this.data.chooseTurn = e.detail.value
        // console.log(this.data.chooseTurn)
    },

    checkboxChange_resource: function (e) {
        this.data.chooseResource = e.detail.value
        this.setData({
            flagResource: false
        })
        var temp = 0
        for (const i in e.detail.value){
            if (e.detail.value[i] === '其他') {
                temp = i
                this.setData({
                    flagResource: true,
                })
            } 
        }
        this.data.chooseResource.splice(temp,temp)
    },

    checkboxChange_turnway: function (e) {
        this.data.chooseTurnway = e.detail.value
        this.setData({
            flagTurnway: false
        })
        for (const i in e.detail.value){
            var temp = 0
            if (e.detail.value[i] === '其他') {
                temp = i
                this.setData({
                    flagTurnway: true,
                })
            } 
        }
        this.data.chooseTurnway.splice(temp,temp)
    },

    /**
     * 更新输入框输入值
     * @param {*} e 页面信息
     */
    oninput(e) {
        const key = `${e.currentTarget.dataset.key}` // 将key值带入，生成改变路径
        // console.log(key)
        this.data.info.form[key] = e.detail.value
    },
    oninputH(e) {
        this.data.chooseHospital = e.detail.value
        // console.log(this.data.chooseHospital)
    },
    oninputP1(e) {
        this.data.choosePhase = "已申报专利但未获授权 专利号/专利名称：" + e.detail.value
        // console.log(this.data.choosePhase)
    },
    oninputP2(e) {
        this.data.choosePhase = e.detail.value
        // console.log(this.data.choosePhase)
    },
    oninputP5(e){
        this.data.choosePhase = "已授权专利 专利号/专利名称：" + e.detail.value
    },

    oninputP3(e) {
        this.data.Resource_other = e.detail.value
        // console.log(this.data.Resource_other)
    },

    oninputP4(e) {
        this.data.Turnway_other = e.detail.value
        // console.log(this.data.Turnway_other)
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
            form['Phase'] = this.data.choosePhase
            form['Turn_need'] = this.data.chooseTurn
            form['hospital'] = this.data.chooseHospital
    
            if (this.data.Resource_other !== '' && this.data.Resource_other !== null){
                this.data.chooseResource.push(this.data.Resource_other)
            }
            
            form['Resource'] = this.data.chooseResource
    
            if (this.data.Turnway_other !== '' && this.data.Turnway_other !== null){
                this.data.chooseTurnway.push(this.data.Turnway_other)
            }
           
            form['Turnway'] = this.data.chooseTurnway
    
            for (const i in this.data.pdfFiles){
                form['fileID'].push(this.data.pdfFiles[i].path)
                this.data.imgName.push(this.data.pdfFiles[i].time+'_'+this.data.pdfFiles[i].name)
            }
    
            // console.log(form)
    
    
            const check = ['name', 'hospital', 'sci_realm','sci_problem','sci_describe','sci_advance','Phase','sci_need','sci_resource','contact_way','email']
            const check_name = ['姓名', '单位', '工作/研究领域','成果拟解决的问题','成果描述','成果的先进性', '成果所处阶段', '转化需求描述','可提供的资源描述','联系方式','邮箱']
            for (const i in check) { // 对原始结构进行循环
                if (form[check[i]] == null || form[check[i]] === '') { // 如果原始需要填写的没有写
                    wx.showModal({ // 提示要补充
                        content: `${check_name[i]}未填写，请补充！`,
                        showCancel: false,
                        success (res) {
                            that.setData({
                              submit_f:true
                            })
                          }
                    })
                    flag = false // 设置false，跳过提交环节
                    break // 退出for循环
                }
            }
    
            const check2 = ['Turn_need','Resource','Turnway']
            const check_name2 = ['转化需求','转化过程中您可提供的资源','预期转化的方式']
            for (const i in check2) { // 对原始结构进行循环
                if (form[check2[i]].length === 0) { // 如果原始需要填写的没有写
                    wx.showModal({ // 提示要补充
                        content: `${check_name2[i]}未填写，请补充！`,
                        showCancel: false,
                        success (res) {
                            that.setData({
                              submit_f:true
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
                    success (res) {
                        that.setData({
                          submit_f:true
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
                            name: 'add_turn_need',
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
                      name: 'add_turn_need',
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