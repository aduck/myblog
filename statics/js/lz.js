;(function(){
	// 常量
	var winHeight=document.documentElement.clientHeight // 窗口高度
	// 变量
	var sTop // 滚动高度

	// 判断是否在屏幕可视范围
	function isVisible($o){
		sTop=document.documentElement.scrollTop || document.body.scrollTop
		// 最小高度
		var minH=parseInt($o.offset().top)
		// 最大高度
		var maxH=parseInt($o.offset().top)+parseInt($o.height())
		// 条件：最小高度小于滚动高度加屏幕高度 并且 最大高度大于滚动高度
		if(minH<sTop+winHeight && maxH>sTop){
			return true
		}
		return false
	}

	// 加载
	function loadImgs($imgs){  
		$imgs.each(function(){
			var $this=$(this)
			if(isVisible($this)){
				if(!$this.loaded){
					$this.attr('src',$this.data('origin'))
					$this.loaded=true
				}
			}
		})
	}

	// 主函数
	function lazyload($elems){
		$(window).on('load scroll',function(){
			loadImgs($elems)
		})
	}

	// 暴露
	window.lazyload=lazyload
})();