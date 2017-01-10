var express=require('express')
var router=express.Router()
var Journal=require('../models/journal')
var http=require('http')
var fs=require('fs')

// 获取全部文章
router.get('/journals',function(req,res,next){
	Journal
		.find({})
		.sort({'meta.createAt':-1})
		.exec(function(err,items){
			if(err) return next(err)
			res.json(items)
		})
})

// 获取单个文章
router.get('/journal',function(req,res,next){
	var id=req.query.id
	Journal
		.findById(id)
		.exec(function(err,item){
			if(err) return next(err)
			res.json(item)
		})
})

module.exports=router