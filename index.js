const express = require('express')
const jwt=require('./dao/jwt')
const cors=require('cors')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
//引入socket.io
var server=app.listen(8082)
var io=require('socket.io').listen(server)
require('./dao/socket')(io)

app.use(cors())
app.use(express.static(__dirname+'/data'))
app.use(bodyParser.json({limit:'50mb'}))
app.use(bodyParser.urlencoded({limit:'50mb',  extended: false }))

app.use(function(req, res, next) {
  if(typeof(req.body.token) != 'undefined'){
    let token = req.body.token
    let tokenMatch=jwt.verifyToken(token)
    if(tokenMatch==1){
      //通过
      next()
    }else{
      res.send({status:300})
    }
  }else{
    next()
  }
})


require('./router/index')(app)
require('./router/files')(app)



//404
app.use(function(req, res,next){
    let err=new Error("Couldn't Find")
    err.status=404
    next(err)
}) 

//出现错误 
app.use(function(err,req, res,next){
    res.status(err.status||500).send(err.message)
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})