module.exports={
	checkLogin:function(req,res,next){
		if(!req.session.user){
			var originalUrl=req.originalUrl
			return res.redirect('/login?from='+originalUrl)
		}
		next()
	},
	checkNotLogin:function(req,res,next){
		if(req.session.user){
			return res.redirect('back')
		}
		next()
	}
}