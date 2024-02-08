var dbserver=require('../dao/dbserver')

exports.applyFriend=function(req,res){
    let data=req.body
    dbserver.applyFriend(data,res)
}

//更新好友状态
exports.updateFriendState=function(req,res){
    let data=req.body
    dbserver.updateFriendState(data,res)
}
//拒绝好友或者删除好友
exports.deleteFriend=function(req,res){
    let data=req.body
    dbserver.deleteFriend(data,res)
}

//获取好友列表
exports.getFriendList=function(req,res){
    let data=req.body
    dbserver.getFriendList(data,res)
}
