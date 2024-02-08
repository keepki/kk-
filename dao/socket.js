var dbserver=require('../dao/dbserver')

module.exports=function(io){
    var user={}

    io.on('connection', function(socket) {
        console.log('connection')
        // 在 'connection' 事件内部监听 'login' 事件
        socket.on('login', (id)=>{
            socket.name=id
            user[id]=socket.id
            socket.emit('connectionSuccess',id);

        });

        //用户一对一消息
        socket.on('msg', (msg,fromid,toid)=>{
            dbserver.upFriendLastTime({uid:fromid,fid:toid})
            dbserver.insertMsg(fromid,toid,msg.message,msg.types)
            if(user[toid]){
                console.log('user already')
                socket.to(user[toid]).emit('msg',msg,fromid,0);
            }
            socket.emit('msg',msg,toid,1);
        });


        socket.on('disconnect', function () {
            if(user.hasOwnProperty(socket.name)){
                delete user[socket.name]
                console.log(socket.id,' user disconnected');

            }
        });
    
        // 其他事件监听和处理逻辑... 
        socket.on('group',function (data){
            socket.join(data)
        })

        socket.on('groupMsg',function(msg,fromid,gid,uname,uimg){
            dbserver.insertGroupMsg(gid,fromid,msg.message,msg.types,uname)

            socket.to(gid).emit('groupmsg',msg,gid,uname,uimg,fromid,0)
            socket.emit('groupmsg',msg,gid,uname,uimg,fromid,1)
        })

        //告知离开当前聊天页面
        socket.on('leaveChatr',function(uid,fid){
            socket.emit('leavechatr',uid,fid)
        })

        socket.on('callRemote',function(frindID,fimgurl,uname,uid) {
            if(user[frindID]){
                socket.to(user[frindID]).emit('callRemote',frindID,fimgurl,uname,uid);
            }
        })
        socket.on('cancel',function(frindID) {
            if(user[frindID]){
                socket.to(user[frindID]).emit('cancel');
            }
        })
        socket.on('asceptCall',function(frindID){
            if(user[frindID]){
                socket.to(user[frindID]).emit('asceptCall');
            }
        })
        //接受offer
        socket.on('sendOffer',function(offer,frindID){
            if(user[frindID]){
                socket.to(user[frindID]).emit('sendOffer',offer);
            }
        })
        socket.on('sendAnswer',function(answer,frindID){
            if(user[frindID]){
                socket.to(user[frindID]).emit('sendAnswer',answer);
            }
        })
        socket.on('sendCandidate',function(frindID,candidate){
            if(user[frindID]){
                socket.to(user[frindID]).emit('sendCandidate',candidate);
            }
        })

        socket.on('sendcomment',function(circleID,receiverID,receiverName,senderID,senderName,msg,type,uimgurl,time){
            //发送给这个朋友圈的创建者我这条评论circleID朋友圈id，userid是这条朋友群的创建者id，uid是发送者id,uname发送者name
            console.log(receiverName)
            if(user[receiverID]){
                console.log('dqweqefgdsf')
                socket.to(user[receiverID]).emit('getcomment',circleID,receiverID,receiverName,senderID,senderName,msg,type,uimgurl,time);
            }
        })
        socket.on('sendeRepete',function(circleID,receiverID,receiverName,senderID,senderName,msg,type,uimgurl,time){
            //发送给这个朋友圈的创建者我这条评论circleID朋友圈id，userid是这条朋友群的创建者id，uid是发送者id,uname发送者name
            if(user[receiverID]){
                socket.to(user[receiverID]).emit('getrepete',circleID,receiverID,receiverName,senderID,senderName,msg,type,uimgurl,time);
            }
        })
    });  
}

