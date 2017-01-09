var mongoose=require('mongoose')
var userSchema=new mongoose.Schema({
	username:String,
	password:String,
	nick:String
})
module.exports=userSchema