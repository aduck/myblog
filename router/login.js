var express=require('express')
var router=express.Router()
var User=require('../models/user')
var checkNotLogin=require('../middle/check').checkNotLogin

router.get('/',checkNotLogin,function(req,res,next){
	res.render('login')
})
router.post('/',checkNotLogin,function(req,res,next){
	var username=req.body.username
	var password=req.body.password
	var backUrl=req.query.from || '/'
	// 验证
	User
		.findOne({username:username})
		.exec(function(err,user){
			// 不存在
			if(!user){
				return res.json({"error":1,"msg":"用户不存在"})
			}
			// 密码不正确
			if(user.password!=password){
				return res.json({"error":1,"msg":"密码不正确"})
			}
			// 成功
			req.session.user=user
			res.redirect(backUrl)
		})
})

module.exports=router