var bcrypt = require('bcryptjs');


//生成加密密码
exports.encryption=function(e){
    let salt=bcrypt.genSaltSync(10)//创建一个随机盐进行加密

    let hash=bcrypt.hashSync(e,salt)//生成

    return hash
}

exports.verification=function(e,hash){
    let verif=bcrypt.compareSync(e,hash)//解密经行密码验证，返回一个布尔值
    return verif
}