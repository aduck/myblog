window.Cookie={
	get:function(name){
		var cookie_name=encodeURIComponent(name)+"=",
			start=document.cookie.indexOf(cookie_name),
			cookie_value=null;
		if(start>-1){
			var end=document.cookie.indexOf(";",start);
			if(end>-1){
				cookie_value=document.cookie.slice(start+cookie_name.length,end);
			}else{
				cookie_value=document.cookie.slice(start+cookie_name.length);
			}
		}
		return decodeURIComponent(cookie_value);
	},
	set:function(options){
		var cookie_txt=encodeURIComponent(options.name)+"="+encodeURIComponent(options.value);
		cookie_txt+=(options.expires instanceof Date)?";expires="+options.expires.toGMTString():";expires="+new Date(new Date().getTime()+3600*1000).toGMTString();
		cookie_txt+=options.path?";path="+options.path:"";
		cookie_txt+=options.domain?";domain="+options.domain:"";
		document.cookie=cookie_txt;
	},
	unset:function(name,path,domain){
		this.set({
			name:name,
			value:"",
			expires:new Date(0)
		});
	}
};