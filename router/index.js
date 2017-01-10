var express=require('express')

module.exports=function(app){
	app.get('/',function(req,res){
		res.redirect('/journal')
	})
	app.use('/login',require('./login')) // 登陆
	app.use('/logout',require('./logout')) // 登出
	app.use('/photo',require('./photo')) // 图片
	app.use('/journal',require('./journal')) // 日志
	app.use('/tag',require('./tag')) // 标签
	app.use('/api',require('./api')) // api
	// 错误处理
	app.use(function(req,res,next){
		var err=new Error('Not Found')
		err.status=404
		next(err)
	})
	if(app.get('env')=='development'){
		app.use(function(err,req,res,next){
			res.status(err.status || 500)
			res.render('error',{
				message:err.message,
				error:err
			})
		})
	}
	app.use(function(err,req,res,next){
		res.status(err.status || 500)
		res.render('error',{
			message:err.message,
			error:{}
		})
	})
}