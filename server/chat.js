var dbserver=require('../dao/dbserver')

//一对一聊天
exports.msg=function(req,res){
    let data=req.body
    dbserver.msg(data,res)
}
