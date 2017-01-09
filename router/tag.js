var express=require('express')
var router=express.Router()
var Journal=require('../models/journal')
var moment=require('moment')
var marked=require('marked')

// 标签列表
router.get('/',function(req,res,next){
	Journal
		.distinct('tags')
		.exec(function(err,tags){
			if(err) return next(err);
			res.render('tags',{tags:tags})
		})
})
// 标签页
router.get('/:tagName',function(req,res,next){
	var tagName=req.params.tagName
	var dates=[]
	var intros=[]
	Journal
		.find({"tags":tagName})
		.sort({'meta.createAt':-1})
		.exec(function(err,journals){
			if(err) return next(err);
			journals.forEach(function(journal){
				dates.push(moment(journal.meta.createAt).utcOffset(8).format('DD MMM YYYY'))
				intros.push(marked(journal.content).replace(/<[^>]+>/g,'').slice(0,60))
			})
			res.locals.dates=dates
			res.locals.intros=intros
			res.render('tag',{items:journals})
		})
})

module.exports=router