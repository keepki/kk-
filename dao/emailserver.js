var nodemailer=require('nodemailer')
var dbmodel=require('../model/dbmodel')
var bcrypt=require('../dao/bcrypt')
var User=dbmodel.model('User')
var credentials=require('../config/credentials')
var jwt=require('../dao/jwt')
//创建传输方式
const transporter = nodemailer.createTransport({
    service:'qq',
    auth: {
      user: credentials.qq.user,
      pass: credentials.qq.pass,
    },
  });

  var userEmali={}
  var registerEmail={}

exports.emailRegister=function(data,res){
    const verificationCode = Math.floor(Math.random() * 900000) + 100000;
    console.log(verificationCode)
    if(registerEmail[data.email]){
        //已经存在把原来的
        不做处理
    }else{
        registerEmail[data.email]=verificationCode
    }

    let options={
        from:'2761705990@qq.com',
        to:data.email,
        subject:'感谢注册',
        html:`<div style="background-color: #000; padding: 20px; text-align: center; color: #fff; font-family: 'Helvetica', 'Arial', sans-serif;">
        <span style="font-size: 24px; color: #55aaff;">欢迎加入 KK 的聊天软件</span>
        <br/>
        <p style="font-size: 18px;">您的验证码是: <strong style="color: #ff9900;">${verificationCode}</strong></p>
        <p style="font-size: 16px;">请在注册页面输入此验证码以完成注册。</p>
        <a href="http://127.0.0.1:8000/" style="display: inline-block; margin-top: 20px; padding: 15px 30px; background-color: #4caf50; color: #fff; text-decoration: none; border-radius: 5px; font-size: 18px;">立即注册</a>
    </div>
    `
    }

    transporter.sendMail(options,function(err,msg){
        if(err){
            console.log(err)
        }else{
           console.log('邮箱发送成功')
            setTimeout(() => {
                delete registerEmail[data.email];
                console.log(`邮箱 ${data.email} 的验证码已过期并被清除`);
            }, 60000 ); // 60秒 
        }
    })
} 

exports.emailRegisterVerification=function(data,res){
    if(registerEmail[data.email]==data.emailCode){
        //比对成功，可以注册

    let password=bcrypt.encryption(data.pwd)

    let datas={
        agentID:Math.floor(Math.random() * 9000000) + 1000000,
        name:data.name,
        email:data.email, 
        psw:password,
        time:new Date()
    }

    let user=new User(datas) //生成user表对象

    user.save(function(err,result){//保存数据
        if(err){
            res.send({status:500});
        }else{
            console.log('登录成功')
            res.send({status:200});
        }
    })
}else{
    res.send({status:403,result:'验证码错误'});
}
    
}







exports.emailSiginUp=function(email,res){
    //发送的信息内容
    //判断邮箱是否存在数据库
        User.countDocuments({email:email},function(err,result){
            console.log(result)
            if(err){
                console.log('邮箱不存在')
                res.send({result:'邮箱不存在'});
            }
            if(result==0){
                console.log('不可以发')
            }
            if(result>0){
                console.log('可以发')
                //邮箱存在，可以发
                const verificationCode = Math.floor(Math.random() * 900000) + 100000;
                if(userEmali[email]){
                    //已经存在把原来的
                    不做处理
                }else{
                    userEmali[email]=verificationCode
                }
                let option={
                    from:'2761705990@qq.com',
                    to:email,
                    subject:'欢迎登陆',
                    html:`<div style="background-color: #000; padding: 20px; text-align: center; color: #fff; font-family: 'Helvetica', 'Arial', sans-serif;">
                    <span style="font-size: 24px; color: #55aaff;">欢迎登录 KK 的聊天软件</span>
                    <br/>
                    <p style="font-size: 18px;">您的验证码是: <strong style="color: #ff9900;">${verificationCode}</strong></p>
                    <p style="font-size: 16px;">请在登录页面输入此验证码以完成登录</p>
                    <a href="http://127.0.0.1:8000/" style="display: inline-block; margin-top: 20px; padding: 15px 30px; background-color: #4caf50; color: #fff; text-decoration: none; border-radius: 5px; font-size: 18px;">立即注册</a>
                </div>
                `
                }
                transporter.sendMail(option,function(err,msg){
                    if(err){
                        console.log(err)
                    }else{
                       console.log('邮箱发送成功')
                        setTimeout(() => {
                            delete userEmali[email];
                            console.log(`邮箱 ${email} 的验证码已过期并被清除`);
                        }, 60000); // 60秒
                    }
                })
            }
        })
}

exports.emailMatch=function(data,res){
    if(userEmali[data.email]==data.emailCode){
        console.log('比对成功',userEmali[data.email])
        //查找数据库返回相应的信息
        let wherestr = { 'email': data.email };
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
                        let token=jwt.generateToken(e._id)
                        let back={
                            userAgentID:e.agentID,
                            id:e._id,
                            name:e.name,
                            imgurl:e.imgurl,
                            token:token
                        }                 
                        res.send({status:200,back,message:'登陆成功'})
                })
            }
        })

    }else{
        console.log('比对失败')
    }
}