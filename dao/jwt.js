var jwt=require('jsonwebtoken');
let secret='kk666nb'

//生成token
exports.generateToken=function(id,res){
    let payload={
        id:id,
        time:new Date()
    }//用户信息

    let token=jwt.sign(payload,secret,{expiresIn:60 * 60 * 24 * 60 })
    return token
}

exports.verifyToken=function(e){
    let payload;
    jwt.verify(e,secret,function(err,result){
        if(err){
            payload=0
        }else{
            payload=1
        }
    })

    return payload
}