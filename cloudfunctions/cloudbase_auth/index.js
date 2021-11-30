const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event)
  console.log(wxContext)
  return {
    errCode: 0,
    errMsg: wxContext.FROM_OPENID,
    auth: JSON.stringify({
      sid: wxContext.FROM_APPID
    })
  }
}
