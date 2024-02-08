var dbserver=require('../dao/dbserver')

//创建朋友圈
exports.buildCircle=function(req,res){
    let data=req.body
    dbserver.buildCircle(data,res)
}

exports.getcircle=function(req,res){
    let data=req.body
    dbserver.getcircle(data,res)
}
exports.searchcircle=function(req,res){
    let data=req.body
    dbserver.searchcircle(data,res)
}

exports.buildComment=function(req,res){
    let data=req.body
    dbserver.buildComment(data,res)
}

exports.getComment=function(req,res){
    let data=req.body
    dbserver.getComment(data,res)
}
exports.deleteByCircleID=function(req,res){
    let data=req.body
    dbserver.deleteByCircleID(data,res)
}
