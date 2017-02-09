var express=require('express')
var path=require('path')

module.exports=function(app){
	/* 判断是否是手机访问
	app.use(function(req,res,next){
		var ua=req.headers['user-agent'].toLowerCase()
		if(/(iphone|ipod|ipad|android)/.test(ua)){
			res.sendFile(path.resolve(__dirname,'../h5/index.html'))
		}else{
			next()
		}
	})*/

	app.get('/',function(req,res){
		res.redirect('/journal')
	})
	// 手机访问
	app.get('/h5',function(req,res,next){
		res.sendFile(path.resolve(__dirname,'../h5/index.html'))
	})
	app.use('/refuse',require('./refuse')) // 拒绝ip
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
		return next(err)
	})
	if(app.get('env')=='production'){
		app.use(function(err,req,res,next){
			res.status(err.status || 500)
			res.render('error',{
				message:err.message,
				error:{}
			})
		})
	}
	app.use(function(err,req,res,next){
		res.status(err.status || 500)
		res.render('error',{
			message:err.message,
			error:err
		})
	})
}