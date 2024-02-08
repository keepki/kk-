var mongoose = require('mongoose');
var db=mongoose.createConnection('mongodb://localhost:27017/kk-chat',{useNewUrlParser:true,useUnifiedTopology:true});
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('success')
});

module.exports=db