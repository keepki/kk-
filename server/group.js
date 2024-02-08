var dbserver=require('../dao/dbserver')
//获取群列表
exports.getGroup=function(req,res){
    let uid=req.body.uid
    dbserver.getGroup(uid,res)
 }

 //获取群最后一条消息
 exports.getLastGroupMsg=function(req,res){
   let gid=req.body.gid
   dbserver.getOneGroupMsg(gid,res)
 }

 //修改群未读消息
 exports.updateGroupMsg=function(req,res){
   let data=req.body
   dbserver.updatGroupeMsg(data,res)
 }

 //新建群
 exports.createGroup=function(req,res){
  let data=req.body
  dbserver.createGroup(data,res)
}
//添加群消息
exports.insertGroupMsg=function(req,res){
  let data=req.body
  dbserver.insertGroupMsg(data,res)
}
exports.getGroupMsg=function(req,res){
  let data=req.body
  dbserver.getGroupMsg(data,res)
}
//查询群列表
exports.getUserGroups=function(req,res){
  let data=req.body
  dbserver.getUserGroups(data,res)
}
//查询群用户详情
exports.getGroupUserDetial=function(req,res){
  let data=req.body
  dbserver.getGroupUserDetial(data,res)
}
//获取群详情
exports.getGroupDetial=function(req,res){
  let data=req.body
  dbserver.getGroupDetial(data,res)
}
//删除群
exports.deleteGRoup=function(req,res){
  let data=req.body
  dbserver.deleteGRoup(data,res)
}
//退出群
exports.exitGRoup=function(req,res){
  let data=req.body
  dbserver.exitGRoup(data,res)
}

//判断是否在群中
exports.checkInGroup=function(req,res){
  let data=req.body
  dbserver.checkInGroup(data,res)
}

//好友同意
exports.invitFriend=function(req,res){
  let data=req.body
  dbserver.invitFriend(data,res)
}
//创建邀请好友加入群聊消息

exports.buildInviteMsg=function(req,res){
  let data=req.body
  dbserver. buildInviteMsg(data,res)
}
//获取群邀请的消息

exports.getGroupInviteMsg=function(req,res){
  let data=req.body
  dbserver. getGroupInviteMsg(data,res)
}
//拒绝群邀请
exports.refuseInvite=function(req,res){
  let data=req.body
  dbserver. refuseInvite(data,res)
}
//修改群信息
exports.updateGroup=function(req,res){
  let data=req.body
  dbserver.updateGroup(data,res)
}