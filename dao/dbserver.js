var dbmodel=require('../model/dbmodel')
var bcrypt=require('../dao/bcrypt')
var User=dbmodel.model('User')
var Friend=dbmodel.model('Friend')
var Group=dbmodel.model('Group')
var GroupUser=dbmodel.model('GroupUser')
var Message=dbmodel.model('Message')
var GroupMsg=dbmodel.model('GroupMsg')
var Circle=dbmodel.model('Circle')
var Comment=dbmodel.model('circleComment')
var Invite=dbmodel.model('groupInvit')
var jwt=require('../dao/jwt')
//新建用户

exports.buildUser = function(name,mail,pwd,res){
    let password=bcrypt.encryption(pwd)

    let data={
        agentID:Math.floor(Math.random() * 9000000) + 1000000,
        name:name,
        email:mail,
        psw:password,
        time:new Date()
    }

    let user=new User(data) //生成user表对象

    user.save(function(err,result){//保存数据
        if(err){
            res.send({status:500});
        }else{
            res.send({status:200});
        }
    })
}

exports.countUserValue = function(data,type,res){
    let wherestr={}
    wherestr[type] = data

    User.countDocuments(wherestr,function(err,result){
        if(err){
            res.send({status:500});
        }else{
            res.send({status:200,result});
        }
    })
}

exports.userMatch=function(data,pwd,res){
    console.log(data)
    let wherestr;
    if (!isNaN(data)) {
        // 如果是数字，使用 agentID 进行查询
        wherestr = { $or: [{ 'agentID': data }, { 'email': data }] };
    } else {
        // 如果不是数字，使用 email 进行查询
        wherestr = { 'email': data };
    }
    let out={'name':1,'imgurl':1,'psw':1,'agentID':1}
    User.find(wherestr,out,function(err,result){
        if(err){
            console.log(err)
            res.send({status:500})
        }else{
            if(result==''){
                res.send({status:400,message:'没有这个用户'})
            }
            result.map(function(e){
                const pwdMatch=bcrypt.verification(pwd,e.psw)
                if(pwdMatch){
                    let token=jwt.generateToken(e._id)
                    let back={
                        userAgentID:e.agentID,
                        id:e._id,
                        name:e.name,
                        imgurl:e.imgurl,
                        token:token
                    }                  
                      res.send({status:200,back,message:'登陆成功'})
                }else{
                    res.send({status:400,message:'密码错误'})
                }
            })
        }
    }) 
}

//搜索用户
exports.searchUser=function(data,res){
    let wherestr
    if(data=='谢安'){
        wherestr={}
    }else{
        wherestr={$or:[{'name':{$regex:data}},{'email':{$regex:data}}]}
    }
    let out={
        '_id':1,
        'name':1,
        'email':1,
        'imgurl':1
    }
    User.find(wherestr,out,function(err,result){
        if(err){
            res.send({status:500})
        }else{
            res.send({status:200,result})
        }
    })
}

//判断是否为好友
exports.isFriend=function(uid,fid,res){
    let wherestr={'userID':uid,'friendID':fid,'state':0}
    Friend.findOne(wherestr,function(err,result){
        if(err){
            res.send({status:500})
        }else{
            if(result){
                //是好友
                res.send({status:200})
            }else{
                res.send({status:400})
            }
        }
    })
}

//搜索群
exports.searchGroup=function(data,res){
    let wherestr
    if(data=='谢安'){
         wherestr={}
    }else{
        wherestr={'name':{$regex:data}}
    }
    let out={
        'name':1,
        'imgurl':1
    }
    Group.find(wherestr,out,function(err,result){
        if(err){
            res.send({status:500})
        }else{
            res.send({status:200,result})
        }
    })
}

//判断是否在群内
exports.isInGroup=function(uid,gid,res){
    let wherestr={'userID':uid,'groupID':gid}
    GroupUser.findOne(wherestr,function(err,result){
        if(err){
            res.send({status:500})
        }else{
            if(result){
                //是在群内
                res.send({status:200})
            }else{
                //不在
                res.send({status:400})
            }
        }
    })
}

//查找用户详情
exports.userDetial=function(id,res){
    let wherestr={'_id':id}
    let out={'psw':0}
    User.findOne(wherestr,out,function(err,result){
        if(err){
            res.send({status:500})
        }else{
            res.send({status:200,result})
        }
    })
}

function update(data,update,res){
    User.findByIdAndUpdate(data,update,function(err,resu){
        if(err){
            res.send({status:500})
        }else{
            res.send({status:200,message:'修改成功'})
        }
    })
}

//更新用户
exports.userUpdate=function(data,res){
    let updatestr={}
    //判断是否有密码
    if(typeof(data.pwd)!='undefined'){
        //有密码就要匹配密码
        User.find({'_id':data.id},{'psw':1},function(err,result){
            if(err){
                res.send({status:500});
            }else{
                if(result==''){
                    res.send({status:303,message:'没有这个人'})
                }
                result.map(function(e){
                    //密码验证
                    const pwdMatch=bcrypt.verification(data.pwd,e.psw)
                    if(pwdMatch){
                        //验证成功
                        //判断是修改密码还是修改邮箱
                        if(data.type=='psw'){
                            let password=bcrypt.encryption(data.data)
                            updatestr[data.type]=password
                            update(data.id,updatestr,res)

                        }else{
                            //是修改邮箱，进行邮箱匹配
                            updatestr[data.type]=data.data
                            User.countDocuments(updatestr,function(err,result){
                                if(err){
                                    res.send({status:500});
                                }else{
                                    if(result==0){
                                        //没有相同的邮箱可以进行修改
                                        update(data.id,updatestr,res)                                     
                                    }else{
                                        res.send({status:600,message:"邮箱已存在"});
                                    }
                                }
                            })
                        }
                        
                    }else{
                        res.send({status:400,message:'密码错误'})
                    }
                })
            }
        })
    }else if(data.type=='name'){
        //如果是修改用户名
        updatestr[data.type]=data.data
        User.countDocuments(updatestr,function(err,result){
            if(err){
                res.send({status:500});
            }else{
                if(result==0){
                    //没有相同的用户名,可以进行修改
                    update(data.id,updatestr,res)

                }else{
                    res.send({status:300,message:"用户名已存在"});
                }
            }
        })
    }else{
        //一般数据修改
        updatestr[data.type]=data.data
        update(data.id,updatestr,res)

    }
}

//获取好友昵称
exports.getMarkName=function(data,res){
    let wherestr={'userID':data.uid,"friendID":data.fid}
    let out={'markname':1}
    Friend.findOne(wherestr,out,function(err,result){
        if(err){
            res.send({status:500})
        }else{
            res.send({status:200,result})
        }
    })
}

//修改好友昵称
exports.updateMarkName=function(data,res){
    let wherestr={'userID':data.uid,"friendID":data.fid}
    let updatestr={'markname':data.name}
    Friend.updateOne(wherestr,updatestr,function(err,result){
        if(err){
            res.send({status:500})
        }else{
            res.send({status:200})
        }
    })
}

//添加好友表
exports.buidlFriend=function(uid,fid,state,res){
    let data={
        userID:uid,
        friendID:fid,
        state:state,
        time:new Date(),
        lastTime:new Date()
    }
    let friend=new Friend(data)
    friend.save(function(err,resule){
        if(err){
            // res.send({status:500})

        }else{
            // res.send({status:200})
        }
    })
}

//更新好友最后通讯时间
exports.upFriendLastTime=function(data){
    let wherestr={$or:[{'userID':data.uid, 'friendID':data.fid},{'userID':data.fid, 'friendID':data.uid}]}
    let updatestr={'lastTime':new Date()}
    Friend.updateMany(wherestr,updatestr,function(err,result){
        if(err){
            // res.send({status:500})
        }else{
            // res.send({status:200})
        }
    })
}

//添加一对一消息
exports.insertMsg=function(uid,fid,msg,type,res){
    let data={
        userID:uid,           
        friendID:fid,
        message:msg,           
        types:type,
        time:new Date(),
        state:1
    }
    let message=new Message(data)
    message.save(function(err,result){
        if(err){
            if(res){
                res.send({status:500})
            }
        }else{
            if(res){
            res.send({status:200,result})
            }
        }
    })
}

//好友申请
exports.applyFriend=function(data,res){
    //判断是否已经申请过
    let wherestr={'userID':data.uid,'friendID':data.fid}
    Friend.countDocuments(wherestr,(err,result)=>{
        if(err){
            res.send({status:500})
        }else{
            //如果result=0代表初次申请
            if(result==0){
                this.buidlFriend(data.uid,data.fid,2)
                this.buidlFriend(data.fid,data.uid,1)
            }else{
                //已经申请过则更新一下最新消息时间
                this.upFriendLastTime(data)
            }
            this.insertMsg(data.uid,data.fid,data.msg,0,res)
        }
    })
}

//更新好友状态
exports.updateFriendState=function(data,res){
    let wherestr={$or:[{'userID':data.uid, 'friendID':data.fid},{'userID':data.fid, 'friendID':data.uid}]}
    Friend.updateMany(wherestr,{'state':0},function(err,result){
        if(err){
            res.send({status:500})
        }else{
            res.send({status:200})
        }
    })
}

//拒绝好友或者删除好友
exports.deleteFriend=function(data,res){
    let wherestr={$or:[{'userID':data.uid, 'friendID':data.fid},{'userID':data.fid, 'friendID':data.uid}]}
    Friend.deleteMany(wherestr,function(err,result){
        if(err){
            res.send({status:500})
        }else{
            res.send({status:200})
        }
    })
}
//获取用户列表
function getUsers(data,res){
    return new Promise(function(resolve,reject){
        let query=Friend.find({})
        query.where({'userID':data.uid,'state':data.state})
        query.populate('friendID')
        query.sort({'lastTime':-1})
        query.exec().then(function(e){
            let result=e.map(function(ver){
                return{
                    id:ver.friendID._id,
                    name:ver.friendID.name,
                    markname:ver.friendID.markname,
                    imgurl:ver.friendID.imgurl,
                    lastTime:ver.lastTime,
                    type:0
                }
            })
            resolve(result)
        }).catch(function(err){
            reject({status:500})
        })
    })
}

exports.getUsers1=function(data,res){
    return new Promise(function(resolve,reject){
        let query=Friend.find({})
        query.where({'userID':data.uid,'state':data.state})
        query.populate('friendID')
        query.sort({'lastTime':-1})
        query.exec().then(function(e){
            let result=e.map(function(ver){
                return{
                    id:ver.friendID._id,
                    name:ver.friendID.name,
                    markname:ver.friendID.markname,
                    imgurl:ver.friendID.imgurl,
                    lastTime:ver.lastTime,
                    type:0
                }
            })
            resolve({status:200,result})
        }).catch(function(err){
            reject({status:500})
        })
    }).then(function onFulfilled(value){
        res.send(value)
    })
}


/*废弃
exports.getUsers1=function(data,res){
    let query=Friend.find({})
    //查询条件
    query.where({'userID':data.uid,'state':data.state})
    //查找friendid关联的user对象
    query.populate('friendID')
    query.sort({'lastTime':-1})

    query.exec().then(function(e){
        let result=e.map(function(ver){
            return{
                id:ver.friendID._id,
                name:ver.friendID.name,
                markname:ver.friendID.markname,
                imgurl:ver.friendID.imgurl,
                lastTime:ver.lastTime,
                type:0
            }
        })
        res.send({status:200,result})
    }).catch(function(err){
        res.send({status:500})
    })
}*/

//获取一对一消息
function getOneMsg(uid,fid){
    return new Promise(function(resolve,reject){
        let query = Message.findOne({})
        //查询条件
        query.where({ $or: [{ 'userID': uid, 'friendID': fid }, { 'userID': fid, 'friendID':uid }] })

        query.sort({ 'time': -1 })

        query.exec().then(function (ver) {
            let result = {
                message: ver.message,
                types: ver.types,
                time: ver.time,
            }
            resolve(result)
        }).catch(function (err) {
           reject({ status: 500 })
        })
    })
    
}


exports.getOneMsg=function(data,res){
    let query=Message.findOne({})
    //查询条件
    query.where({$or:[{'userID':data.uid, 'friendID':data.fid},{'userID':data.fid, 'friendID':data.uid}]})

    query.sort({'time':-1})

    query.exec().then(function(ver){
            let result = {
                message:ver.message, 
                types:ver.types,
                time:ver.time,
            }
        res.send({status:200,result})
    }).catch(function(err){
        res.send({status:500})
    })
}

exports.unreadMsg=function(data,res){
    let wherestr={'userID':data.fid,'friendID':data.uid,"state":1}
    Message.countDocuments(wherestr,(err,result)=>{
        if(err){
            res.send({status:500})
        }else{
            res.send({status:200,result})
        }
    })
}

//查找未读消息数
function unreadMsgs(uid,fid){
    return new Promise(function(resolve,reject){
        let wherestr = { 'userID': fid, 'friendID':uid, "state": 1 }
        Message.countDocuments(wherestr, (err, result) => {
            if (err) {
                reject({ status: 500 })
            } else {
                resolve(result);
            }
        })
    })
    
}

async function doIt(data,res){
    let result,bb,cc,err
    [err,result]=await getUsers(data).then(data=>[null,data]).catch(err=>[err,null])
    for(var i=0;i<result.length;i++){
        [err,bb]=await getOneMsg(data.uid,result[i].id).then(data=>[null,data]).catch(err=>[err,null])
        if(bb.types==0){

        }else if(bb.types==1){
            bb.message='[图片]'
        }else if(bb.types==2){
            bb.message='[音频]'
        }else if(bb.types==3){
            bb.message='[位置]'
        }
        else if(bb.types==4){
            bb.message='[视频]'
        }
        result[i].msg=bb.message
        /*[err,cc]=await unreadMsgs(data.uid,result[i].id).then(data=>[null,data]).catch(err=>[err,null])*/
        cc=await unreadMsgs(data.uid,result[i].id)
        result[i].tip=cc  
    }
    if(err){
        res.send(err)
    }else{
        res.send({status:200,result})
    }
}

exports.getUsers=function(data,res){
    doIt(data,res)
}


//修改未读消息
exports.updateMsg=function(data,res){
    let wherestr={'userId':data.uid,'friendID':data.fid,"state":1}
    let updatestr={'state':0}
    Message.updateMany(wherestr,updatestr,(err,result)=>{
        if(err){
            res.send({status:500})
        }else{
            res.send({status:200})
        }
    })
}

//新建群
exports.createGroup=function(data,res){
    let groupData={
        userID:data.uid,
        name:data.name,
        imgurl:data.imgurl,
        time:new Date(),
    }
    var group=new Group(groupData)
    group.save(function(err,result){
        if(err){
            res.send({status:500})
        }else{
            Group.find({'userID':data.uid,'name':data.name},{'_id':1},function(err,rest){
                if(err){
                    res.send({status:500}) 
                }else{
                    rest.map(function(gid){
                        let udata={
                            groupID:gid._id,
                            userID:data.uid,
                            time:new Date(),
                            lastTime:new Date(),
                        }
                        insertGroupUser(udata)
                        //添加好友入群
                        for(let i=0;i<data.user.length;i++){
                            let fdata={
                                groupID:gid._id,
                                userID:data.user[i],
                                time:new Date(),
                                lastTime:new Date(),
                            }
                            insertGroupUser(fdata)
                        }
                    })
                    res.send({status:200})
                }
            })
        }
    })
}

//添加群成员
function insertGroupUser(data,res){
    var groupuser=new GroupUser(data)
    groupuser.save(function(err,rest){
        if(err){
            res.send({status:500})
        }else{
            console.log('成功')
        }
    })
}



/*
exports.createGroup=function(data,res){
    return new Promise(function(resolve,reject){
        let groupData={
            userID:data.uid,
            name:data.name,
            imgurl:data.imgurl,
            time:new Date(),
        }
        var group=new Group(groupData)
        group.save(function(err,result){
            if(err){
                reject({status:500})
            }else{
                resolve(result)
            }
        })
    }).then(function onFulfilled(value){
        console.log(data)
        for(let i=0;i<data.user.length;i++){
            let fdata={
                groupID:value._id,
                userID:data.user[i],
                time:new Date(),
                lastTime:new Date(),
            }
            insertGroupUser(fdata,res)
        }
        res.send({status:200,result})
    }).catch(function onRejected(error){
        res.send(error)
    })
}

}


exports.createGroup = function (data, res) {
    return new Promise(function (resolve, reject) {
        let groupData = {
            userID: data.uid,
            name: data.name,
            imgurl: data.imgurl,
            time: new Date(),
        }
        var group = new Group(groupData)
        group.save(function (err, result) {
            if (err) {
                reject({ status: 500 })
            } else {
                resolve(result)
            }
        })
    }).then(function onFulfilled(value) {
        console.log(data)
        // 使用Promise.all等待所有Promise解析完成
        return Promise.all(data.user.map(function (userId) {
            let fdata = {
                groupID: value._id,
                userID: userId,
                time: new Date(),
                lastTime: new Date(),
            };
            return insertGroupUser(fdata);
        }));
    }).then(function onFulfilled(results) {
        // 在所有群组用户插入完成后发送响应
        res.send({ status: 200, result: results });
    }).catch(function onRejected(error) {
        res.send(error);
    });
}

// 封装insertGroupUser为返回Promise的版本
function insertGroupUser(data) {
    return new Promise(function (resolve, reject) {
        var groupuser = new GroupUser(data)
        groupuser.save(function (err, rest) {
            if (err) {
                reject({ status: 500 });
            } else {
                resolve(rest);
            }
        });
    });
}
*/

//获取群列表
exports.getGroup=function(id,res){
    //id问用户所在的群
    console.log('lllllll')
    let query=GroupUser.find({})
    //查询条件
    query.where({'userID':id})
    //查找friendid关联的user对象
    query.populate('groupID')
    query.sort({'lastTime':-1})

    query.exec().then(function(e){
        let result=e.map(function(ver){
            console.log(ver)
            return{
                id:ver.groupID._id,
                name:ver.groupID.name,
                markname:ver.name,
                imgurl:ver.groupID.imgurl,
                lastTime:ver.lastTime,
                tip:ver.tip,
                type:1
            }
        })
        res.send({status:200,result})
    }).catch(function(err){
        console.log(err)
        res.send({status:500})
    })
}

//获取群消息
exports.getOneGroupMsg=function(gid,res){
    let query=GroupMsg.findOne({})
    //查询条件
    query.where({'groupID':gid})
    //查找根据userID关联出来的user对象
    query.populate('userID')
    query.sort({'time':-1})

    query.exec().then(function(ver){
        console.log(ver)
        if(ver){
           let result = {
                message:ver.message,
                types:ver.types,
                lastTime:ver.time,
                name:ver.userID.name
            }
        res.send({status:200,result}) 
        }else{
            res.send({status:304})
        }
            
    }).catch(function(err){
        console.log(err)
        res.send({status:500})
    })
}

//修改群未读消息
exports.updatGroupeMsg=function(data,res){
    let wherestr={"userID":data.uid,'groupID':data.gid}
    let updatestr={'tip':0}
    Message.updateOne(wherestr,updatestr,(err,result)=>{
        if(err){
            res.send({status:500})
        }else{
            res.send({status:200})
        }
    })
}


//添加群消息
exports.insertGroupMsg=function(gid,uid,msg,type,sendername,res){
    let data={
        groupID:gid,           
        userID:uid,
        message:msg,           
        types:type,
        time:new Date(),
        sender:sendername
    }
    let message=new GroupMsg(data)
    message.save(function(err,result){
        if(err){
            if(res){
                res.send({status:500})
            }
        }else{
            if(res){
                res.send({status:200,result})
            }
        }
    })
}

//获取群消息
exports.getGroupMsg = function(data, res) {
    console.log(data)
    var skipNum = data.nowPage * data.pageSize;

    let query = GroupMsg.find({}); // 假设你的群消息表模型为 GroupMsg

    query.where({'groupID': data.groupID}); // 假设群ID的字段名为 'groupID'，请根据实际情况修改
    query.sort({'time': -1});
    query.populate("userID"); // 如果需要获取用户信息，可以进行 populate
    query.skip(skipNum);
    query.limit(data.pageSize);

    query.exec().then(function(e) {
        let result = e.map(function(ver) {
            return {
                id: ver._id,
                groupID: ver.groupID,
                userID: ver.userID._id,
                message: ver.message,
                types: ver.types,
                time: ver.time,
                sender: ver.sender,
                imgurl: ver.userID.imgurl
            };
        });

        res.send({status: 200, result});
    }).catch(function(err) {
        res.send({status: 500});
    });
};


//分页获取一对一聊天数据
exports.msg=function(data,res){
    var skipNum=data.nowPage*data.pageSize
    let query=Message.find({})

    query.where({$or:[{'userID':data.uid,"friendID":data.fid},{'userID':data.fid,"friendID":data.uid}]})
    query.sort({'time':-1})
    query.populate("userID")
    query.skip(skipNum)
    query.limit(data.pageSize)
    query.exec().then(function(e){
        let result=e.map(function(ver){

            return {
                id:ver._id,
                message:ver.message,
                types:ver.types,
                time:ver.time,
                fromId:ver.userID._id,
                imgurl:ver.userID.imgurl
            }
        })
        console.log(result)
        res.send({status:200,result})
    }).catch(function(err){
        res.send({status:500})
        console.log('err',err)
    })
}


//添加一个朋友圈内容
exports.buildCircle=function(data,res){
    console.log(data)
    let circleData={
        userID:data.userID,
        userName:data.userName,
        userImgUrl:data.userImgUrl,
        textcontent:data.textcontent,
        imgcontent: Array.isArray(data.imgcontent)
            ? data.imgcontent
            : JSON.parse(data.imgcontent),
        video:data.video,
        time:new Date()
    }
    let circle=new Circle(circleData)

    circle.save(function(err,result){
        if(err){
            res.send({status:500})
        }else{
            res.send({status:200,result})
        }
    })
}
//查询朋友圈
exports.getcircle=function(data,res){
let friendsID=[]
data.friendArry.forEach(item => {
    friendsID.push(item.id)
});
var currentUserID = data.userID;
let query = Circle.find({});

query.where({'userID': { $in: [currentUserID, ...friendsID] }});
 query.sort({'time':-1})
// 执行查询
query.exec().then(function (result) {
        if(result){
            const mappedResult = result.map(item => {
                return {
                    ...item.toObject(),  // 转换为普通 JavaScript 对象
                    circleID: item._id   // 添加新的属性 circleID
                };
            });

            res.send({status:200,result:mappedResult})

        }else{
            res.send({status:400,})
        }
    }).catch(function (err) {
        console.error(err);
        res.send({status:500})
        // 处理错误
    });
}

//更具朋友圈id查询朋友圈查询朋友圈
exports.searchcircle=function(data,res){

    var circleID = data.circleID;
    let query = Circle.find({});
    
    query.where({'_id': circleID});
     query.sort({'time':-1})
    // 执行查询
    query.exec().then(function (result) {
            if(result){
                const mappedResult = result.map(item => {
                    return {
                        ...item.toObject(),  // 转换为普通 JavaScript 对象
                        circleID: item._id   // 添加新的属性 circleID
                    };
                });
    
                res.send({status:200,result:mappedResult})
    
            }else{
                res.send({status:400,})
            }
        }).catch(function (err) {
            console.error(err);
            res.send({status:500})
            // 处理错误
        });
    }

//发表评论
exports.buildComment=function(data,res){
    let commentData={
        circleID:data.circleID,
        senderID:data.senderID,
        receiverID:data.receiverID,
        senderName:data.senderName,
        receiverName:data.receiverName,
        comment:data.comment,
        type:data.type,
        time:new Date()
    }
    let circommentcle=new Comment(commentData)

    circommentcle.save(function(err,result){
        if(err){
            res.send({status:500})
        }else{
            res.send({status:200,result})
        }
    })
}

//查找对应朋友圈的所有评论列表
exports.getComment=function(data,res){
    var currentcircleID = data.circleID;
    let query = Comment.find({});
    
    query.where({ 'circleID':currentcircleID});
     query.sort({'time':1})
    // 执行查询
    query.exec().then(function (result) {
            if(result){
                res.send({status:200,result})
    
            }else{
                res.send({status:400,})
            }
        }).catch(function (err) {
            console.error(err);
            res.send({status:500})
            // 处理错误
        });
    }

    // 删除对应朋友圈的所有评论
exports.deleteByCircleID = function (data, res) {
    var currentcircleID = data.circleID;

    let query = Circle.deleteOne({ '_id': currentcircleID });

    query.exec().then(function (result) {
        if (result.deletedCount > 0) {
            res.send({ status: 200});
        } else {
            res.send({ status: 404, message: '没有这个，删除失败' });
        }
    }).catch(function (err) {
        console.error(err);
        res.send({ status: 500, message: 'Internal Server Error' });
        // 处理错误
    });
}

//搜索好友
exports.getFriendList=function(data,res){
    let query = User.find({});
    console.log( data.friendIDArry);
    query.where({'_id': { $in: [ ... data.friendIDArry] }});
    // 执行查询
    query.exec().then(function (result) {
            if(result){
                const mappedResult = result.map(item => {
                        // 转换为普通 JavaScript 对象
                        const { _id, ...rest } = item.toObject();
                        return { id: _id, ...rest };
                });
    
                res.send({status:200,result:mappedResult})
    
            }else{
                res.send({status:400,})
            }
        }).catch(function (err) {
            console.error(err);
            res.send({status:500})
            // 处理错误
        });
    }

 // 获取用户加入的所有群组信息
 exports.getUserGroups = function (data, res) {
    // 查询用户加入的所有群组
    console.log(data);
    GroupUser.find({ userID: data.userId }, (err, userGroups) => {
        if (err) {
            console.error('查询用户群组信息时发生错误：', err);
            res.status(500).send({ status: 500, message: 'ServerError' });
            return;
        }

        // 提取群组ID数组
        const groupIds = userGroups.map(group => group.groupID);

        // 查询群组信息
        Group.find({ _id: { $in: groupIds } }, (err, groups) => {
            if (err) {
                console.error('查询群组信息时发生错误：', err);
                res.status(500).send({ status: 500, message: 'ServerError' });
                return;
            }

            // 将结果转换为普通 JavaScript 对象，并映射 _id 为 id
            const mappedGroups = groups.map(group => {
                const { _id, ...rest } = group.toObject();
                return { id: _id, ...rest };
            });

            console.log('mappedGroups', mappedGroups);
            // 发送结果给客户端
            res.status(200).send({ status: 200, result: mappedGroups });
        });
    });
};

//查询这个群所有的用户信息
exports.getGroupUserDetial=function(data,res){
    GroupUser.find({ groupID :data.GroupID },(err,groupUserIDs)=>{
        if (err) {
            console.error('查询群成员信息时发生错误：', err);
            res.status(500).send({ status: 500, message: 'ServerError' });
            return;
        }
        const groupUserId = groupUserIDs.map(groupUser => groupUser.userID);
        User.find({_id:{$in:groupUserId}}, { psw: 0 },(err,users)=>{
            if (err) {
                console.error('查询用户信息时发生错误：', err);
                res.status(500).send({ status: 500, message: 'ServerError' });
                return;
            }
            const mappedUsers= users.map(user => {
                const { _id, ...rest } = user.toObject();
                return { id: _id, ...rest };
            });
            res.status(200).send({ status: 200, result: mappedUsers });

        })
    })
}
//获取群详情
exports.getGroupDetial=function(data,res){
    Group.find({_id:data.GroupID},(err,GroupDetials)=>{
    if (err) {
        console.error('查询群成员信息时发生错误：', err);
        res.status(500).send({ status: 500, message: 'ServerError' });
        return;
    }
    const mappedGroup= GroupDetials.map(group => {
        const { _id, ...rest } = group.toObject();
        return { gid: _id, ...rest };
    });

    res.status(200).send({ status: 200, result: mappedGroup });
})
}

//删除群
exports.deleteGRoup=function(data,res){
    Group.deleteMany({_id:data.groupID},function(err,result){
        if(err){
            res.send({status:500})
        }else{
            GroupUser.deleteMany({groupID:data.groupID},function(err,result){
                if(err){
                    res.send({status:500})
                }else{
                    GroupMsg.deleteMany({groupID:data.groupID},function(err,result){
                        if(err){
                            res.send({status:500})
                        }else{
                            res.send({status:200})
                        }
                    })
                }
            })
        }
    })
}

//退出群
exports.exitGRoup=function(data,res){
    console.log( data.groupID,data.userID)
    GroupUser.deleteMany({ groupID: data.groupID,userID:data.userID}, function (err, result) {
        if (err) {
            res.send({ status: 500 })
        } else {
            res.send({ status: 200 })
        }
    })
}

//判断是否在群聊中
exports.checkInGroup = function(data, res) {
    GroupUser.findOne({ groupID: data.groupID, userID: data.friendID }, function(err, result) {
        if (err) {
            res.send({ status: 500 });
        } else {
            if (result) {
                res.send({ status: 200 });
            } else {
                res.send({ status: 201 }); // 或者其他状态码表示未找到匹配记录
            }
        }
    });
};

//创建邀请好友加入群聊消息
exports.buildInviteMsg=function(data,res){
    let fdata={
        groupID:data.GroupID,
        inviterName:data.inviterName,
        inviterID:data.inviterID,
        recevierName:data.recevierName,
        receiverID:data.receiverID,
        time:new Date()
    }
    var InviteMsg=new Invite(fdata)
    InviteMsg.save(function(err,rest){
        if(err){
            res.send({status:500})
        }else{
            res.send({status:200})
        }
    })
}
//获取群邀请消息
exports.getGroupInviteMsg = function(data, res) {
    Invite.find(
        { receiverID: data.userID }, // 查询条件
        { groupID: 1, inviterID: 1 ,time: 1} // 投影，只选择 groupID 和 inviterID 字段
    )
    .populate('inviterID', 'name imgurl _id') // 关联查询 users 集合，排除密码字段
    .populate('groupID','name imgurl')
    .exec((err, invites) => {
        if (err) {
            console.error('查询群成员信息时发生错误：', err);
            res.status(500).send({ status: 500, message: 'ServerError' });
            return;
        }

        const mappedInvites = invites.map(invite => {
            const { _id, name,imgurl } = invite.inviterID.toObject(); // 排除 _id
            const { name: groupName, imgurl: groupImgurl } = invite.groupID.toObject();
            const { time } = invite; 
            return { groupID: invite.groupID,groupName,groupImgurl, time,InviterID: _id, InviterName: name, Inviterimgurl: imgurl};
        });

        res.status(200).send({ status: 200, result: mappedInvites });
    });
};
//拒绝群邀请
exports.refuseInvite=function(data,res){
    console.log(data);
    Invite.deleteMany({groupID:data.groupID,inviterID:data.inviterID,receiverID:data.receiverID},(err,result)=>{
        if(err){
            res.send({status:500})
        }else{
            res.send({status:200})
        }
    })
}
//同意邀请 
exports.invitFriend=function(data,res){
    let fdata={
        groupID:data.groupID,
        userID:data.userID,
        tip:0,
        time:new Date(),
        lastTime:new Date(),
    }
    var groupuser=new GroupUser(fdata)
    groupuser.save(function(err,rest){
        if(err){
            res.send({status:500})
        }else{
            res.send({status:200})
        }
    })
    
}
//修改群信息
exports.updateGroup=function(data,res){
    let updatestr={}
    updatestr[data.type]=data.value
    Group.findByIdAndUpdate(data.groupID, updatestr, { new: true }, function (err, result) {
        if (err) {
          res.send({ status: 500, error: 'Internal Error.' });
        } else {
          if (!result) {
            res.send({ status: 404, error: '没找到群' });
          } else {
            res.send({ status: 200,});
          }
        }
      });
}