var express=require('express')
var multer=require('multer')
var fs=require('fs')
var router=express.Router()
var config=require('../config')
var upPath=config.upload
var maxUpdate=config.maxUpdate
// 判断是否存在uploads文件夹
try{
	var stats=fs.lstatSync(upPath)
}catch(e){
	fs.mkdirSync(upPath)
}
// 存储设置
var storage=multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,upPath)
  },
  filename:function(req,file,cb) {
    cb(null,file.fieldname+'-'+Math.round(Math.random()*100)+Date.now()+'.jpg')
  }
})
// 文件格式判断
var imgReg=/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/
var upload=multer({
	storage:storage,
	fileFilter:function(req,file,cb){
		if(!imgReg.test(file.originalname)){
			cb(null,false)
		}else{
			cb(null,true)
		}
	}
}).fields([{name:'thumb',maxCount:1},{name:'photo',maxCount:maxUpdate}])

// 图片上传
router.post('/upload',function(req,res,next){
	upload(req,res,function(err){
		if(err) return next(err)
		res.json(req.files)
	})
})

module.exports=router