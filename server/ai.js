var aiserver=require('../dao/ai')
//一对一聊天
exports.getAIResponse=function(req,res){
    let query=req.body.query
    aiserver.getAIResponse(query,res)
}
