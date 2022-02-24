const app = getApp() // 全局APP
let that = null // 页面this指针
Page({
  data: {
    my_timer: 3,
    spage: 0, // 切换页面开始，勿改
    epage: 0, // 切换页面结束，勿改
    status: 0, // 报名状态
    form: {}, // 报名信息填写
    imgSrc: [],
    imgName: [],
    haveGetImgSrc: false,

    submit_f:true,

    pdfFiles:[],

    height: 0,
    hospitals: [],
    chooseHospital: '',
    flagH: false,
    items: [{
        value: '每天多次',
        name: '每天多次'
      },
      {
        value: '每天一次',
        name: '每天一次'
      },
      {
        value: '每周两三次',
        name: '每周两三次'
      },
      {
        value: '每周一次',
        name: '每周一次'
      },
      {
        value: '每月一次',
        name: '每月一次'
      },
      {
        value: '几个月一次或更少',
        name: '几个月一次或更少'
      }
    ],
    Arr: [],
    info: {
      form_personal: { // 报名填写项
        room: {
          name: '科室*',
          place: '请输入您所在的科室',
          size: 20,
        },
        hurt_info: {
          name: '痛点名称*',
          place: '请用一句话简要说明该痛点，如”某些医疗操作下的某问题”，限30个字内',
          size: 80,
        },
        relate_place: {
          name: '痛点场景描述*',
          place: '请详细描述您发现的痛点。如在何种场景下，什么人在进行什么操作的过程中存在或可能存在什么样的问题，可能造成什么样的后果',
          size: 40,
        },
        relate_room: {
          name: '痛点涉及科室*',
          place: '涉及该痛点的科室有哪些',
          size: 20,
        },
        relate_people: {
          name: '痛点涉及人群*',
          place: '包含该痛点所涉及到的患者（如患某种疾病需要进行某些医疗操作的患者）、医护人员（如要进行某些特定操作的医护人员）、家属等一切与本医疗痛点相关的人员',
          size: 80,
        },
      },
      form_solution: {
        already_solution: {
          name: '现有解决方案',
          place: '针对该痛点现有的解决方案是什么？该解决方案存在的问题有哪些？若无已有解决方案可不填',
          size: 80,
        },
        your_solution: {
          name: '您设想的解决方案',
          place: '针对该痛点，您设想中的解决方案是什么样的？没有可不填',
          size: 80,
        },
        patent: {
          name: '专利情况',
          place: '针对该痛点，是否已申请相关专利？如有请填写专利全称或专利号，没有可不填',
          size: 80,
        },
      },
      form_others:{
        contact_way: {
          name: '联系方式',
          place: '可填手机号、微信号',
          size: 20,
        },
        email:{
          name: '邮箱*',
          place: '我们将评估痛点，并将痛点评估结果通过邮件回复给您',
          size: 80,
        },
        others: {
          name: '其它',
          place: '其它相关信息均可在此描述。包括但不限于其他调研结果、市场相关情况等。没有可不填',
          size: 80,
        },
      },
      form: {}
    }
  },
  /**
   * 页面加载
   */
  onLoad(options) {
    // wx.showModal({ // 提示要补充
    //   title:'医护人员痛点征集系统填写须知',
    //   content: `
    //   痛点定义：在您日常的临床工作中，您认为对您产生困扰的问题或值得被改进的针对某问题的解决方案
    //   保密：浙江大学健康产业创新研究中心-医疗健康科技成果商业化孵化平台负责本系统运营
    //   `,
    //   showCancel: false,
    //   confirmText:"我已知晓",
    //   success (res) {
    //     if (res.confirm) {
    //       res.confirm = false
    //       // console.log(res.confirm)
    //     } else if (res.cancel) {
    //       // console.log('用户点击取消')
    //     }
    //   }
    // })
    // console.log(options)
    that = this // 页面this指向指针变量
    const {
      windowHeight,
      windowWidth
    } = wx.getSystemInfoSync() // 获取系统屏幕信息
    app.call({
      name: 'getHospital',
      data: {
        message: 'getHospital',
      }
    }).then(res => {
      this.setData({
        height: wx.getSystemInfoSync().windowHeight,
        hospitals: res.data
      })
      // console.log(this.data.hospitals)
    })

    // app.call({
    //   name:'getOpenID',
    //   data:{
    //     message:'helloCloud',
    //   }
    // }).then(res=>{
    //   // console.log(res)//res就将appid和openid返回了
    //     //做一些后续操作，不用考虑代码的异步执行问题。
    // })

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
  uploadImg() {
    if (this.data.imgSrc.length <= 20) {
      wx.showLoading({
        title: '',
      });
      // 让用户选择一张图片
      wx.chooseImage({
        count: 1,
        success: chooseResult => {
          // 将图片上传至云存储空间
          var tempFilesSize = chooseResult.tempFiles[0].size;
          if (tempFilesSize <= 10000000) {
            var str = chooseResult.tempFilePaths[0];
            var obj = str.lastIndexOf("/");
            this.data.imgSrc.push(chooseResult.tempFilePaths[0])
            this.data.imgName.push(str.substr(obj + 1))
            this.setData({
              haveGetImgSrc: true,
              imgSrc: that.data.imgSrc,
              imgName: that.data.imgName
            });
            wx.hideLoading();
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '上传图片不能大于10M!', //标题
              icon: 'none' //图标 none不使用图标，详情看官方文档
            })
          }
        },
      });
    } else {
      wx.showModal({
        content: `图片过多`,
        showCancel: false
      })
    }
  },
  previewImage(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: [e.currentTarget.id], // 需要预览的图片http链接列表
    });
  },
  checkboxChange2: function (e) {
    this.data.chooseHospital = e.detail.value
    if (e.detail.value === '其他') {
      this.setData({
        flagH: true,
        chooseHospital:''
      })
    } else {
      this.setData({
        flagH: false
      })
    }
    
  },
  checkboxChange: function (e) {
    var arr = [];
    this.data.Arr[0] = e.detail.value
    // console.log(this.data.Arr)
  },
  focus(e) {
    let height = e.detail.height;
    this.setData({
      bottom: height
    })
  },
  blur(e) {
    this.setData({
      bottom: 0
    })
  },
  /**
   * 更新输入框输入值
   * @param {*} e 页面信息
   */
  oninput(e) {
    const key = `${e.currentTarget.dataset.key}` // 将key值带入，生成改变路径
    // console.log(key)
    this.data.info.form[key] = e.detail.value
    // that.setData({ // 更改对应路径为输入信息
    //   [key]: e.detail.value
    // })
  },
  oninputH(e) {
    this.data.chooseHospital = e.detail.value
    // console.log(this.data.chooseHospital)
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
      
      form['fileID'] = []
      for (const i in this.data.imgSrc){
        form['fileID'].push(this.data.imgSrc[i])
      }
      form['checkArr'] = this.data.Arr
      form['hospital'] = this.data.chooseHospital
  
  
      const check = ['name','hospital','room','hurt_info','relate_place','relate_room','relate_people','email']
      const check_name = ['姓名','医院','科室','痛点名称','痛点场景描述','痛点涉及科室','痛点涉及人群','邮箱']
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
  
      if (form['checkArr'].length === 0){
        wx.showModal({ // 提示要补充
          content: `痛点频率未填写，请补充！`,
          showCancel: false,
          success (res) {
            that.setData({
              submit_f:true
            })
          }
        })
        flag = false // 设置false，跳过提交环节
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
      var temp2 = false
      if (flag == true){
        var j = 0
        for (const i in this.data.pdfFiles){
          form['fileID'].push(this.data.pdfFiles[i].path)
          this.data.imgName.push(this.data.pdfFiles[i].time+'_'+this.data.pdfFiles[i].name)
          j += 1
        }
        if (j == this.data.pdfFiles.length){
          temp2 = true
        }
      }
  
      if (temp2 == true) { // 如果flag=true，证明验证通过
  
        // console.log(form)
        // console.log(this.data.imgName)
  
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
              // console.log('上传图片成功', res);
            }).then(res => {
              signal -= 1
              if (signal <= 0) {
                app.call({ // 发起云函数，提交信息
                  name: 'add',
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
            name: 'add',
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