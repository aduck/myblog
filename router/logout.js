var express=require('express')
var router=express.Router()
var User=require('../models/user')
var checkLogin=require('../middle/check').checkLogin

router.get('/',function(req,res,next){
	req.session.user=null
	res.redirect('/')
})

module.exports=router