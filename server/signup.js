var dbserver=require('../dao/dbserver')
var emailserver=require('../dao/emailserver')
//注册就是新增用户方法
exports.signUp=function(req,res){
    let name =req.body.name
    let mail = req.body.mail
    let pwd = req.body.pwd
    
    dbserver.buildUser(name,mail,pwd,res)

}

//判断邮箱或者用户名是否占用
exports.judgeValue=function(req,res){
    let data = req.body.data
    let type = req.body.type

    dbserver.countUserValue(data,type,res)
} 