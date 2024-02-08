const fs=require("fs");
const path=require("path");

exports.mkdirs = function(pathname,callback) {
    //判断是否为绝对路径
    console.log('pathname',pathname)
    pathname =path.isAbsolute(pathname) ? pathname : path.join(__dirname,pathname)
    //获取相对路径
    pathname=path.relative(__dirname,pathname)
    let floders=pathname.split(path.sep)//path.sep避免平台差异带来的bug
    let pre=''
    floders.forEach(floder => {
        try{
            //没有异常，文件已经创建，提示用户这个文件已经创建
            let _stat=fs.statSync(path.join(__dirname,pre,floder))
            let hasMkdir=_stat && _stat.isDirectory()
            if(hasMkdir){
                callback
                //callback(`文件${floder}已经存在，不能重复创建`)
            }
        }catch (error){
            try{
                fs.mkdirSync(path.join(__dirname,pre,floder))
                callback && callback(null)
            }catch (error){
                callback && callback(error)
            }
        }
        pre=path.join(pre,floder)
    });
}