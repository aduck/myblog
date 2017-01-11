var fs=require('fs')
var http=require('http')
var moment=require('moment')

module.exports=function(req,res,next){
	var output='logs' //输出目录
	var originUrl=req.originalUrl // 访问目录
	var ip=req.connection.remoteAddress.slice(7) // 访问者ip
	var city // 访问者城市
	var isp // 访问者电信服务商
	var line=''
	var date=moment(Date.now()).utcOffset(8).format('YYYY-MM-DD')
	var time=moment(Date.now()).utcOffset(8).format('HH:mm')
	try{
		fs.lstatSync(output)
	}catch(e){
		fs.mkdirSync(output)
	}
	http.get(`http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=${ip}`,function(response){
		var statusCode=response.statusCode
		var err
		if(statusCode!=200) err=new Error(`请求失败，错误码${statusCode}`)
		if(err){
			city='未知'
		}
		var rawData=''
		response.setEncoding('utf8')
		response.on('data',function(chunk){
			rawData+=chunk
		}).on('end',function(){
			try{
				var raw=JSON.parse(rawData)
				city=raw.city || '未知城市'
				isp=raw.isp || '未知服务商'
			}catch(e){}
			line+=`${ip}　${city}|${isp}　${originUrl}　${time}\n`
			fs.writeFile(`${output}/${date}`,line,{flag:'a'},function(error){
				if(error) return next(error)
			})
		})
	}).on('error',function(e){
		next(e)
	})
	next()
}