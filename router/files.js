const multer = require('multer')
const mkdir = require('../dao/mkdir')

//控制文件存储
var storage=multer.diskStorage({
    destination:function(req,file,cb){
        let url=req.body.url;
        console.log(url)
        mkdir.mkdirs ('../data/'+url,err=>{
            console.log('err',err)
        })
        cb(null,'./data/'+url)
    },
    filename:function(req,file,cb){
        let name=req.body.name
        let type=file.originalname.replace(/.+\./,".")
        console.log(file.fieldname)
        cb(null,name+type)
    }
})

var upload =multer({storage:storage})

module.exports=function(app){
    app.post('/files/upload',upload.array('file',10),function(req,res,next){
        //路劲拼接
        let url=req.body.url
        //文件信息
        let name=req.files[0].filename
        let imgurl='/'+url+'/'+name
        //返回给前端
        res.send(imgurl)
    })
}