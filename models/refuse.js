var mongoose=require('mongoose')
var refuseSchema=require('../schemas/refuse')

var Refuse=mongoose.model('Refuse',refuseSchema,'refuse')
// show
Refuse.showIps=function(cb){
  Refuse
    .find({})
    .sort({time:"-1"})
    .exec(function(err,docs){
      cb(err,docs)
    })
}
// add
Refuse.addIp=function(ip,cb){
  var refuse=new Refuse({ip:ip})
  refuse.save(function(err){
    cb(err)
  })
}
// remove
Refuse.removeIp=function(ip,cb){
  Refuse
    .findOneAndRemove({ip:ip})
    .exec(function(err,doc){
      cb(err,doc)
    })
}

module.exports=Refuse