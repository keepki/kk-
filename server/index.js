var dbserver=require('../dao/dbserver')

//获取好友
 exports.getFriend=function(req,res){
    let data=req.body
    if(data.state==0){
      dbserver.getUsers(data,res)
    }else if(data.state==1){
      dbserver.getUsers1(data,res)
    }
 }

 //获取最后一条消息
 exports.getLastMsg=function(req,res){
   let data=req.body
   dbserver.getOneMsg(data,res)
 }

  //获取未读消息数
  exports.unreadMsg=function(req,res){
   let data=req.body
   dbserver.unreadMsg(data,res)
 }

 //修改未读消息
 exports.updateMsg=function(req,res){
   let data=req.body
   dbserver.updateMsg(data,res)
 }