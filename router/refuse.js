var express=require('express')
var router=express.Router()
var Refuse=require('../models/refuse')
var checkLogin=require('../middle/check').checkLogin
var moment=require('moment')

router.get('/',checkLogin,function(req,res,next){
  Refuse.showIps(function(err,ips){
    var items=[]
    ips.forEach(function(ip){
      var time=moment(ip.time).utcOffset(8).format('YYYY/MM/DD HH:mm:ss')
      items.push({ip:ip.ip,time:time})
    })
    res.render('refuse',{items:items})
  })
})
router.post('/add',checkLogin,function(req,res,next){
  var ip=req.body.ip
  Refuse.addIp(ip,function(err){
    if(err){
      res.json({"error":1,"msg":err.message})
      return next(err)
    }else{
      res.json({"error":0,"msg":"添加成功"})
    }
  })
})
router.post('/remove',checkLogin,function(req,res,next){
  var ip=req.body.ip
  Refuse.removeIp(ip,function(err){
    if(err){
      res.json({"error":1,"msg":err.message})
      return next(err)
    }else{
      res.json({"error":0,"msg":"删除成功"})
    }
  })
})

module.exports=router