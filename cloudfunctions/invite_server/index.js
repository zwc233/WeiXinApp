const cloud = require('wx-server-sdk') // 云开发服务端SDK引入
cloud.init({ // 初始化云开发环境
  env: cloud.DYNAMIC_CURRENT_ENV // 当前环境的常量
})
const db = cloud.database() // 取出数据库操作对象

exports.main = async (event, context) => {
  // 预置创建集合，如果存在则自动失败跳过，自己上架时可以去掉
  try{ await db.createCollection('invite') }catch(e){}
  const wxContext = cloud.getWXContext() // 获取微信上下文
  if (event.type === 'get') { // 如果行为是get
    const data = (await db.collection('invite').where({ // 查找数据库集合文档
      _id: wxContext.OPENID || wxContext.FROM_OPENID // 文档ID为用户的openid
    }).get()).data // 取出data
    if (data.length !== 0) { // 如果取出来有值
      return data[0].status // 返回记录的statxwus值
    } else {
      return 0 // 没有的话，返回0-未提交xw
    }
  }
  if (event.type === 'delete_user'){
    await db.collection("admin_item").doc(event.data).remove({})
  }
  if (event.type === 'add') { // 如果行为是add
    await db.collection('invite').add({ // 增加设置数据库集合文档，文档ID为用户openid
      data: { // 设置值
        name: event.data.name,
        room: event.data.room,
        hospital: event.data.hospital,
        hurt_info: event.data.hurt_info,
        patent: event.data.patent,
        contact_way: event.data.contact_way,
        others: event.data.others,
        relate_people: event.data.relate_people,
        relate_room: event.data.relate_room,
        relate_place: event.data.relate_place,
        already_solution: event.data.already_solution,
        your_solution: event.data.your_solution,
        checkArr:event.data.checkArr,
        fileID:event.data.fileID,
        email:event.data.email,
        evaluation:[],
        status: 1 // 默认为1，1-审核中；2-同意；3-拒绝
      }
    })
    return true // 返回成功
  }
  if (event.type === 'add_sci') { // 如果行为是add
    await db.collection('science_test').add({ // 增加设置数据库集合文档，文档ID为用户openid
      data: { // 设置值
        name: event.data.name,
        Education: event.data.Education,
        hospital: event.data.hospital,
        Rank: event.data.Rank,
        Role: event.data.Role,
        sci_realm: event.data.sci_realm,
        sci_fruit: event.data.sci_fruit,
        sci_problem: event.data.sci_problem,
        sci_type: event.data.sci_type,
        sci_partener: event.data.sci_partener,
        sci_place: event.data.sci_place,
        sci_others: event.data.sci_others,
        fileID:event.data.fileID,
        email:event.data.email,
        contact_way: event.data.contact_way,
        evaluation:[],
        divide:event.data.divide,
        keyword:event.data.keyword,
      }
    })
    return true // 返回成功
  }

  if (event.type === 'add_turn_need') { // 如果行为是add
    await db.collection('turn_need_test').add({ // 增加设置数据库集合文档，文档ID为用户openid
      data: { // 设置值
        name: event.data.name,
        hospital: event.data.hospital,
        sci_realm: event.data.sci_realm,
        sci_problem: event.data.sci_problem,
        sci_describe: event.data.sci_describe,
        sci_advance: event.data.sci_advance,
        Phase: event.data.Phase,
        Turn_need: event.data.Turn_need,
        Resource: event.data.Resource,
        sci_resource: event.data.sci_resource,
        Turnway: event.data.Turnway,
        fileID:event.data.fileID,
        email:event.data.email,
        contact_way: event.data.contact_way,
        evaluation:[],
      }
    })
    return true // 返回成功
  }

  if (event.type === 'add_enterprise') { // 如果行为是add
    await db.collection('enterprise_test').add({ // 增加设置数据库集合文档，文档ID为用户openid
      data: { // 设置值
        name: event.data.name,
        address: event.data.address,
        intro: event.data.intro,
        scale: event.data.scale,
        industry: event.data.industry,
        product: event.data.product,
        Need_type: event.data.Need_type,
        describe: event.data.describe,
        coop: event.data.coop,
        price: event.data.price,
        fileID:event.data.fileID,
        contact_man:event.data.contact_man,
        email:event.data.email,
        contact_way: event.data.contact_way,
        evaluation:[],
      }
    })
    return true // 返回成功
  }

  if (event.type === 'add_startup') { // 如果行为是add
    await db.collection('startup_test').add({ // 增加设置数据库集合文档，文档ID为用户openid
      data: { // 设置值
        name: event.data.name,
        Education: event.data.Education,
        school: event.data.school,
        work: event.data.work,
        industry: event.data.industry,
        scale: event.data.scale,
        mem: event.data.mem,
        Manner: event.data.Manner,
        prospect: event.data.prospect,
        self_eva: event.data.self_eva,
        other:event.data.other,
        fileID:event.data.fileID,
        email:event.data.email,
        contact_way: event.data.contact_way,
        evaluation:[],
      }
    })
    return true // 返回成功
  }

  if (event.type === 'add_user') { // 如果行为是add
    await db.collection('admin_item').add({ // 增加设置数据库集合文档，文档ID为用户openid
      data: { // 设置值
        name:event.data.name,
        pwd:event.data.pwd,
        hospital:event.data.hospital,
      }
    })
    return true // 返回成功
  }

  if (event.type === 'getOpenID'){
    let{APPID,OPENID}=cloud.getWXContext()
    return {
      APPID,OPENID
    }
  }

  if (event.type === 'getAll'){
    return await db.collection('invite').get();
  }
  if (event.type === 'getAllScience'){
    return await db.collection('science_test').get();
  }
  if (event.type === 'getAllTurn'){
    return await db.collection('turn_need_test').get();
  }
  if (event.type === 'getAllEnterprise'){
    return await db.collection('enterprise_test').get();
  }
  if (event.type === 'getAllStartup'){
    return await db.collection('startup_test').get();
  }
  if (event.type === 'getHospital'){
    return await db.collection('hospital').get();
  }
  if (event.type === 'getDepartment'){
    return await db.collection('department').get();
  }
  if (event.type === 'getUser'){
    return await db.collection('admin_item').get();
  }


  if (event.type === 'upload_eva'){
    return await db.collection('invite').doc(event.data.id).update({
      data: {
        evaluation:event.data.evaluation
      }
    })
  }
  if (event.type === 'upload_eva_sci'){
    return await db.collection('science_test').doc(event.data.id).update({
      data: {
        evaluation:event.data.evaluation
      }
    })
  }

  if (event.type === 'upload_eva_turn'){
    return await db.collection('turn_need_test').doc(event.data.id).update({
      data: {
        evaluation:event.data.evaluation
      }
    })
  }

  return false // 没有处理方法，则false
}
