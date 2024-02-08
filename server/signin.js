var dbserver=require('../dao/dbserver')

exports.siginIn=function(req,res){
    let data=req.body.data
    let pwd=req.body.pwd

    dbserver.userMatch(data,pwd,res)
}