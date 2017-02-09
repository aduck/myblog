var mongoose=require('mongoose')
var refuseSchema=new mongoose.Schema({
  ip:String,
  time:{
    type:Date,
    default:Date.now()
  }
})
refuseSchema.pre('save',function(next){
  this.time=Date.now()
  next()
})
module.exports=refuseSchema