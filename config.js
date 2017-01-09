module.exports={
	// 根目录
	root:'http://localhost',
	// 端口
	port:80,
	// 上传路径
	upload:'uploads',
	// 同时最大上传个数
	maxUpdate:12,
	// 信息
	blog:{
		name:'博客',
		author:'higher',
		keywords:'博客',
		description:'我还没想好怎么描述'
	},
	// 分页个数
	page:10,
	session:{
		key:'blogtest',
		secret:'blogtest',
		maxAge:24*60*60*1000
	},
	mongodb:'mongodb:localhost/test'
}