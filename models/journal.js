var mongoose=require('mongoose')
var journalSchema=require('../schemas/journal')

var Journal=mongoose.model('Journal',journalSchema,'journal')
// 列表分页
Journal.getPage=function(length,n,cb){
	// @length每页显示个数 @n第几页 @total总页数
	Journal
		.count({})
		.exec(function(err,total){
			Journal
				.find({})
				.sort({'meta.createAt':-1})
				.limit(length)
				.skip((n-1)*length)
				.exec(function(err,items){
					cb(err,items,Math.ceil(total/length))
				})
		})
}
// 上一篇下一篇
Journal.getSiblings=function(id,cb){
	var siblings=[]
	// 获取当前文章的createtime
	function getCreateTime(){
		var time
		Journal
			.findById(id)
			.select('meta.createAt')
			.exec(function(err,t){
				time=t.meta.createAt
				getLast(err,time)
			})
	}
	// 上一篇
	function getLast(err,time){
		Journal
			.find({'meta.createAt':{$gt:time}})
			.sort({'meta.createAt':1})
			.limit(1)
			.exec(function(err,item){
				siblings.push(item[0])
				getNext(err,time)
			})
	}
	// 下一篇
	function getNext(err,time){
		Journal
			.find({'meta.createAt':{$lt:time}})
			.sort({'meta.createAt':-1})
			.limit(1)
			.exec(function(err,item){
				siblings.push(item[0])
				cb(err,siblings)
			})
	}
	getCreateTime()
}

module.exports=Journal