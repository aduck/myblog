var express=require('express')
var router=express.Router()
var Journal=require('../models/journal')
var http=require('http')
var fs=require('fs')
var marked=require('marked')

// 根据条件获取文章列表
router.get('/journals',function(req,res,next){
	/* 
		@page 第几页
		@limit 每页条数
		@mdrender 是否渲染markdown文本
	*/
	var page=parseInt(req.query.page) || 1
	var limit=parseInt(req.query.limit) || 10
	var mdrender=req.query.mdrender || 'true'
	Journal.getPage(limit,page,function(err,journals,total){
    if(err) return res.json({"success":false,"message":err.message});
    if(mdrender=='true'){
    	journals.forEach(function(journal){
    		var content=journal.content
    		journal.content=marked(content)
    	})
    }
    res.json({
    	"success":true,
    	"total":total,
    	"data":journals
    })
  })
})

// 获取单个文章
router.get('/journal',function(req,res,next){
	/*
		@mdrender 是否渲染markdown文本
		@lazy 是否延时加载图片(只在mdrender选项为true时生效)
	*/
	var id=req.query.id
	var mdrender=req.query.mdrender || 'true'
	var lazy=req.query.lazy || 'false'
	Journal
		.findById(id)
		.exec(function(err,item){
			if(err) return res.json({"success":false,"message":err.message})
			if(mdrender=='true'){
				var content=item.content
				item.content=marked(content)
				if(lazy=='true'){
					item.content=item.content.replace(/\s+src/g," src='data:image/gif;base64,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' data-origin")
				}
			}
			Journal.getSiblings(id,function(err,items){
        if(err) return res.json({"success":false,"message":err.message})	
        res.json({
        	"success":true,
          "data":{
          	"journal":item,
          	"siblings":items
          }
        })
      })
		})
})

module.exports=router