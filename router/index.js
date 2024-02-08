var dbserver=require('../dao/dbserver')

//引入email发送模块
var emailserver = require('../dao/emailserver')
//引入注册server
var signup=require('../server/signup')
var signin=require('../server/signin')
var search=require('../server/search')
var user=require('../server/userdetial')
var friend=require('../server/friend')
var index=require('../server/index')
var group=require('../server/group')
var chat=require('../server/chat')
var ai=require('../server/ai')
var circle=require('../server/circle')

module.exports=function(app){
    app.get('/test', (req, res) => {
        dbserver.findUser(res)
      })
    app.post('/mail/emailLint', (req, res) => {
      let email = req.body.email
      emailserver.emailSiginUp(email,res)
    })
    
    app.post('/mail/emailMatch', (req, res) => {
      let data = req.body
      emailserver.emailMatch(data,res)
    })
    
    app.post('/mail/emailRegister', (req, res) => {
      let data = req.body
      emailserver.emailRegister(data,res)
    })

    
    app.post('/mail/emailRegisterVerification', (req, res) => {
      let data = req.body
      emailserver.emailRegisterVerification(data,res)
    })
    //注册接口
    app.post('/signup/add', (req,res)=>{
      signup.signUp(req,res)
    })
    //判断邮箱或者账户是否占用
    app.post('/signup/judge', (req,res)=>{
      signup.judgeValue(req,res)
    })

    //登录
    app.post('/signin/match', (req,res)=>{
      signin.siginIn(req,res)
    })
    //搜索用户
    app.post('/search/user', (req,res)=>{
      search.searchUser(req,res)
    })
    //搜索是否为好友
    app.post('/search/isfriend', (req,res)=>{
      search.isFriend(req,res)
    })
    //搜索群
    app.post('/search/group', (req,res)=>{
      search.searchGroup(req,res)
    })
    //判断在群中 
    app.post('/search/isingroup', (req,res)=>{
      search.isInGroup(req,res)
    })
    //用户详情
    app.post('/user/detial', (req,res)=>{
      user.userDetial(req,res)
    })
    //用户信息更改
    app.post('/user/update', (req,res)=>{
      user.userUpdate(req,res)
    })
    //获取好友昵称
    app.post('/user/getmarkname', (req,res)=>{
      user.getMarkName(req,res)
    })
    //好友昵称更改
    app.post('/user/updatemarkname', (req,res)=>{
      user.updateMarkName(req,res)
    })
    //好友申请
    app.post('/friend/applyfriend', (req,res)=>{
      friend.applyFriend(req,res)
    })
    //好友状态修改
    app.post('/friend/updatefriendstate', (req,res)=>{
      friend.updateFriendState(req,res)
    })
    //拒绝好友或者删除好友
    app.post('/friend/deletefriend', (req,res)=>{
      friend.deleteFriend(req,res)
    })
    
    //获取好友列表
    app.post('/index/getfriend', (req,res)=>{
      index.getFriend(req,res)
    })
    //获取最后一条消息
    app.post('/index/getlastmsg', (req,res)=>{
      index.getLastMsg(req,res)
    })
    //获取未读消息
    app.post('/index/unreadmsg', (req,res)=>{
      index.unreadMsg(req,res)
    })
    //修改未读消息
    app.post('/index/updatemsg', (req,res)=>{
      index.updateMsg(req,res)
    })

    //获取群列表
    app.post('/group/getgroup', (req,res)=>{
      group.getGroup(req,res)
    })
    //获取群最后一条消息
    app.post('/group/getlastgroupmsg', (req,res)=>{
      group.getLastGroupMsg(req,res)
    })
    //修改群未读消息
    app.post('/group/updategroupmsg', (req,res)=>{
      group.updateGroupMsg(req,res)
    })
     //一对一聊天
     app.post('/chat/msg', (req,res)=>{
      chat.msg(req,res)
    })
    //建群
    app.post('/group/creategroup', (req,res)=>{
      group.createGroup(req,res)
    })
    //插入群消息
    app.post('/group/insertGroupMsg', (req,res)=>{
      group.insertGroupMsg(req,res)
    })
    //获取群消息
    app.post('/group/getGroupMsg', (req,res)=>{
      group.getGroupMsg(req,res)
    })
    //获取AI消息
    app.post('/ai/getAIResponse', (req,res)=>{
      ai.getAIResponse(req,res)
    })

    //朋友圈操作
    //创建朋友圈
    app.post('/circle/buildCircle', (req,res)=>{
      circle.buildCircle(req,res)
    })
    //查找朋友圈
    app.post('/circle/getcircle', (req,res)=>{
      circle.getcircle(req,res)
    })
    //发表评论
    app.post('/circle/buildComment', (req,res)=>{
      circle.buildComment(req,res)
    })
    //获取评论
    app.post('/circle/getComment', (req,res)=>{
      circle.getComment(req,res)
    })
    //查询朋友圈
    app.post('/circle/searchcircle', (req,res)=>{
      circle.searchcircle(req,res)
    })
    //删除朋友圈
    app.post('/circle/deleteByCircleID', (req,res)=>{
      circle.deleteByCircleID(req,res)
    })
    
    //获取好友列表
    app.post('/friend/getFriendList', (req,res)=>{
      friend.getFriendList(req,res)
    })
    //获取群列表
    
    app.post('/group/getUserGroups', (req,res)=>{
      group.getUserGroups(req,res)
    })
    //获取群成员详情
    
    app.post('/group/getGroupUserDetial', (req,res)=>{
      group.getGroupUserDetial(req,res)
    })

    //获取群详情
    app.post('/group/getGroupDetial', (req,res)=>{
      group.getGroupDetial(req,res)
    })
    
    //删除群
    app.post('/group/deleteGRoup', (req,res)=>{
      group.deleteGRoup(req,res)
    })
    //退出群
    app.post('/group/exitGRoup', (req,res)=>{
      group.exitGRoup(req,res)
    })
    //判断好友是否在群中
    app.post('/group/checkInGroup', (req,res)=>{
      group.checkInGroup(req,res)
    })
    //好友同意加入群聊
    app.post('/group/invitFriend', (req,res)=>{
      group.invitFriend(req,res)
    })
    //创建邀请好友加入群聊消息
    
    app.post('/group/buildInviteMsg', (req,res)=>{
      group.buildInviteMsg(req,res)
    })
    //获取群邀请的消息
    app.post('/group/getGroupInviteMsg', (req,res)=>{
      group.getGroupInviteMsg(req,res)
    })
    
    //拒绝群邀请
    app.post('/group/refuseInvite', (req,res)=>{
      group.refuseInvite(req,res)
    })
    //修改群消息
    app.post('/group/updateGroup', (req,res)=>{
      group.updateGroup(req,res)
    })
}
