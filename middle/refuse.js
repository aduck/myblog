var Refuse=require('../models/refuse')

module.exports=function(req,res,next){
  var ip=req.connection.remoteAddress.slice(7)
  Refuse.showIps(function(err,ips){
    if(err) return next(err)
    for(var i=0,len=ips.length;i<len;i++){
      if(ip.indexOf(ips[i]['ip'])!=-1){
        var e=new Error('无法访问')
        return next(e)
        break;
      }
    }
    next()
  })
}