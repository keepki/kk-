var mongoose = require('mongoose');
var db=require('../config/db');
var Schema = mongoose.Schema;
//用户表
var UserSchema=new Schema({
    agentID:{type:Number},                                  //用户id
    name:{type:String},                                     //用户名
    psw:{type:String},                                      //密码 
    email:{type:String},                                    //邮箱
    sex:{type:String,default:'asexual'},                    //性别
    birth:{type:Date},                                      //生日
    phone:{type:Number},                                    //电话
    explain:{type:String},                                  //签名
    imgurl:{type:String,default:'/user/user.png'},                //头像图片链接
    time:{type:Date},                                   //注册时间
})

//好友表
var FriendSchema=new Schema({
    userID:{type:Schema.Types.ObjectId,ref:'User'},         //用户id
    friendID:{type:Schema.Types.ObjectId,ref:'User'},       //好友id
    state:{type:String},                                    //状态(0:已经是好友，1：申请者申情中，2：接收方接收到消息但处于申请中还没同意) 
    markname:{type:String},                                 //好友昵称
    time:{type:Date},                                       //注册时间
    lastTime:{type:Date},                                   //最后通讯时间
})

//一对一信息表
var MessageSchema=new Schema({
    userID:{type:Schema.Types.ObjectId,ref:'User'},         //用户id
    friendID:{type:Schema.Types.ObjectId,ref:'User'},       //好友id
    message:{type:String},                                  //消息内容
    types:{type:String},                                    //内容类型(0文字，1图片链接，2音频链接。。。)
    time:{type:Date},                                       //发送时间
    state:{type:String},                                    //消息状态(0:已读，1：未读)   
})

//群表
var GroupSchema=new Schema({
    userID:{type:Schema.Types.ObjectId,ref:'User'},         //用户id
    name:{type:String},                                     //群名称
    imgurl:{type:String,default:'/group/group.png'},        //群头像链接
    time:{type:Date},                                       //创建时间
    notice:{type:String},                                   //群公告
})

//群成员信息表
var GroupUserSchema=new Schema({
    groupID:{type:Schema.Types.ObjectId,ref:'Group'},       //群id
    userID:{type:Schema.Types.ObjectId,ref:'User'},         //用户id
    name:{type:String},                                     //群内名称
    tip:{type:Number,default:0},                            //未读消息数
    time:{type:Date},                                       //加入群聊时间
    lastTime:{type:Date},                                   //时间
    shield:{type:Number},                                   //是否屏蔽群通知(0不屏蔽，1屏蔽)
})

//群消息表
var GroupMsgSchema=new Schema({
    groupID:{type:Schema.Types.ObjectId,ref:'Group'},       //群id
    userID:{type:Schema.Types.ObjectId,ref:'User'},         //用户id
    message:{type:String},                                  //消息内容
    types:{type:String},                                    //内容类型(0文字，1图片链接，2音频链接。。。)
    time:{type:Date},                                       //发送时间
    sender:{type:String},   
})

//朋友圈表
var circleScheama=new Schema({
    //circleID:{type:Schema.Types.ObjectId,ref:'circle'},     //朋友圈id
    userID:{type:Schema.Types.ObjectId,ref:'User'},         //用户id
    userName:{type:String},                                 //用户名
    userImgUrl:{type:String},                               //用户头像
    textcontent:{type:String},                              //文本内容
    imgcontent:[{type: String}],                               //图片内容
    video:{type:String},                                    //视频内容
    time:{type:Date},  
})

//评论列表
var circleCommentScheama=new Schema({
    circleID:{type:Schema.Types.ObjectId,ref:'circle'},       //朋友圈id
    senderID:{type:Schema.Types.ObjectId,ref:'User'},         //发送评论的用户id
    receiverID:{type:Schema.Types.ObjectId,ref:'User'},       //收到评论的用户id
    senderName:{type:String},                                 //发送者的名称
    receiverName:{type:String},                               //接收者的名称
    comment:{type:String},                                    //评论信息
    type:{type:Number},                                       //类型，1代表常规评论，2代表回复别人                                
    time:{type:Date},                                         //评论时间
}) 

//发送过去的群邀请列表
var groupInvitScheama=new Schema({
    groupID:{type:Schema.Types.ObjectId,ref:'Group'},       //群id，从哪个群来的
    inviterName:{type:String},                                  //邀请人
    inviterID:{type:Schema.Types.ObjectId,ref:'User'},
    recevierName:{type:String},                                  //受邀人
    receiverID:{type:Schema.Types.ObjectId,ref:'User'},
    time:{type:Date},                                       //时间
}) 

module.exports=db.model('User',UserSchema)
module.exports=db.model('Friend',FriendSchema)
module.exports=db.model('Message',MessageSchema)
module.exports=db.model('Group',GroupSchema)
module.exports=db.model('GroupUser',GroupUserSchema)
module.exports=db.model('GroupMsg',GroupMsgSchema)
module.exports=db.model('Circle',circleScheama)
module.exports=db.model('circleComment',circleCommentScheama)

module.exports=db.model('groupInvit',groupInvitScheama)


