// 云函数入口文件
delete require.cache[require.resolve('officegen')];
const cloud = require('wx-server-sdk')
var office = require('office.js');

cloud.init({
    env:cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    console.log(event)
    return await office.genWord(event);
}