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
    submit_f:true,

    imgSrc: [],
    imgName: [],
    haveGetImgSrc: false,
    
    pdfFiles:[],

    sci_files:[],

    hospitals: [],
    chooseHospital: '',
    flagH: false,

    roles:[
      {name:'必须为课题负责人'},
      {name:'可担任课题负责人也可担任课题其他参与人'},
    ],
    chooseRole:'',
    flagR:false,


    Education: [
      {name:'博士'},
      {name:'硕士'},
      {name:'大学'},
      {name:'其他'}
    ],
    chooseEducation:'',
    
    Rank: [
      {name:'正高级职称'},
      {name:'副高级职称'},
      {name:'中级职称'},
      {name:'其他'}
    ],
    chooseRank:'',
    info: {
      form_personal: { // 报名填写项
        sci_realm: {
          name: '工作/研究领域*',
          place: '请填写您的工作方向或研究领域。工作方向举例：如新生儿科。研究领域举例：如细胞再生领域、辅助生殖领域、柔性电子领域、力学传感领域',
          size: 80,
        },
      },
      form_p0:{
        sci_problem: {
          name: '拟解决/研究科研问题*',
          place: '请填写您拟解决/研究的科研方向。例如：拟构建孕产妇疼痛评价体系、拟搭建浙江省新生儿先天性心脏病早筛系统',
          size: 40,
        },
        sci_keyword: {
          name: '拟解决/研究科研问题的关键词*',
          place: '请填写关键词',
          size: 20,
        },
        sci_type: {
          name: '拟申报课题类型*',
          place: '请填写您预期申报的课题类型。例如：国家重点研发计划、国自然、省自然、省公益。没有可不填',
          size: 80,
        },
      },
      form_p1:{
        sci_partener: {
          name: '预期的科研伙伴*',
          place: '请填写您预期匹配的科研伙伴。例如：心内科领域专家、运动康复学专家、高分子材料学专家、产品设计专家等',
          size: 80,
        },
        sci_place: {
          name: '预期的科研机构',
          place: '您是否有希望定向合作的科研机构。如有可填写具体机构名称，没有可不填',
          size: 80,
        },
        sci_others: {
          name: '其他',
          place: '其他相关信息均可在此描述，没有可不填',
          size: 80,
        },
      },
      form_p2:{
        contact_way: {
          name: '联系电话或微信',
          place: '请填写您的联系电话或微信号',
          size: 80,
        },
        email: {
          name: '邮箱*',
          place: '请填写您的邮箱，我们将根据您的需求进行初步匹配，并通过邮件给您反馈匹配情况',
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

  uploadSci(){
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success (res) {
        const tempFilePaths = res.tempFiles
        that.data.sci_files.push(tempFilePaths[0])
        that.setData({
          sci_files:that.data.sci_files
        })
        // console.log(that.data.sci_files)
      }
    })
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

  checkboxChange3: function (e) {
    this.data.chooseRole = e.detail.value
    if (e.detail.value === '其他') {
      this.setData({
        flagR: true,
        chooseRole:''
      })
    } else {
      this.setData({
        flagR: false
      })
    }
  },

  
  checkboxChange_edu: function (e) {
    this.data.chooseEducation = e.detail.value
    // console.log(this.data.chooseEducation)
  },
  checkboxChange_rank: function (e) {
    this.data.chooseRank = e.detail.value
    // console.log(this.data.chooseRank)
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
  });
  promise.then(() => {
    let flag = true // 先设置flag为true，用于检查
      const form = this.data.info.form // 取出输入的
      this.data.imgName = []
      form['fileID'] = []
      form['Education'] = this.data.chooseEducation
      form['Rank'] = this.data.chooseRank
      form['hospital'] = this.data.chooseHospital
      form['Role'] = this.data.chooseRole
      
  
      for (const i in this.data.pdfFiles){
        form['fileID'].push(this.data.pdfFiles[i].path)
        this.data.imgName.push(this.data.pdfFiles[i].time+'_'+this.data.pdfFiles[i].name)
      }
  
      form['divide'] = this.data.pdfFiles.length
  
  
      for (const i in this.data.sci_files){
        form['fileID'].push(this.data.sci_files[i].path)
        this.data.imgName.push(this.data.sci_files[i].time+'_'+this.data.sci_files[i].name)
      }
      // console.log(form)
  
  
      if (form['sci_type'] !== null && form['sci_type'] !== ''){
        if (form['Role'] === null || form['Role'] === ''){
          wx.showModal({ // 提示要补充
            content: `担任角色未填写，请补充！`,
            showCancel: false,
            success (res) {
              that.setData({
                submit_f:true
              })
            }
          })
          flag = false // 设置false，跳过提交环节
        }
      }
      
      
      const check = ['name','hospital','Education','Rank','sci_realm','sci_fruit','sci_problem','sci_keyword','sci_partener','contact_way','email']
      const check_name = ['姓名','单位','学历','职称','工作/研究领域','个人&科研成果简介','拟解决/研究科研问题','关键词','预期的科研伙伴','联系方式','邮箱']
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
                  name: 'add_sci',
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
            name: 'add_sci',
            data: form
          })
          wx.showModal({
            content: `提交成功`,
            showCancel: false,
            success (res) {
            }
          })
        }
      }
  });


  }
})