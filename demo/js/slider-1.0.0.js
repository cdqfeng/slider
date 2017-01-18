'use strict';
/* 
 * Slider轮播类
 * @auth qingfeng
 * @version 1.0.0
 * @date 2017-01-18
 * @dependence Jquery
 * @param Object config 配置对象
 * @return Object
 */
function Slider(config) {
	if (!(this instanceof Slider)) return new Slider();	// 返回类的实例化对象
	this.container = '';			// 主要容器
	this.wrap = '';					// 容纳图片的容器
	this.interval = 5000;			// 轮播时间间隔(ms)
	this.speed = 300;				// 图片切换速度(ms)
	this.auto = false;				// 自动播放
	this.width = 0;					// 图片宽度
	this.sum = 0;					// 图片数量
	this.current = 0;				// 当前图片下标
	this.timer = '';				// 定时器
	this.arrows = {					// 左右箭头标签
		prev: '<a class="slider-prev" href="javascript:;"></a>',
		next: '<a class="slider-next" href="javascript:;"></a>'
	};
	this.nav = function(index) {	// 分页按钮
		return index;
	};
	this.navNode = {				// 分页按钮标签
		wrap: '<div class="slider-nav"><ol></ol></div>',
		li: '<li></li>'
	};
	this.init(config);				// 运行构造函数
}
// 构造函数
Slider.prototype.init = function(config) {
	// 加载配置 覆盖类的成员变量的默认值
	for( var k in config ) {
		this[k] = config[k];
	}
	this.container = $(this.container);
	this.wrap = $(this.wrap);
	this.width = this.wrap.children('li:first').width();
	this.sum = this.wrap.children('li').length;
	if( this.arrows ) {
		this.arrows.prev = $(this.arrows.prev);
		this.arrows.next = $(this.arrows.next);
		this.container.after( this.arrows.prev ).after( this.arrows.next );
	}
	if( this.nav ) {
		this.navNode.wrap = $( this.navNode.wrap );
		for( var i =1; i< this.sum + 1; i++ ) {
			var li = $(this.navNode.li).html( this.nav(i) );
			this.navNode.wrap.children('ol').append( li );
		}
		this.navNode.wrap.find('li:first').addClass('active');
		this.container.after( this.navNode.wrap );
	}
	if( this.auto ) {
		this.start();
	}
	this.handle();
}
// 向左滚动
Slider.prototype.next = function(num) {
	var _ = this;
	this.wrap.stop(true,true).animate({left: -this.width+'px'}, this.speed, function(){
		for( var i = 0; i < num; i++ ) {	// 频繁点击按钮时动画会反应不及时,故需将循环放在回调函数内
			var liFirst = $(this).children('li:first');
			$(this).append(liFirst);
			_.current++;
			if( _.current == _.sum ) {
				_.current = 0;
			}
			if( _.nav ) {
				_.navNode.wrap.find('li').removeClass('active').eq(_.current).addClass('active');
			}
		}
		$(this).css({left: 0});
	});
}
// 向右滚动
Slider.prototype.prev = function() {
	this.wrap.css({left: -this.width+'px'});
	var lastChildren = this.wrap.children('li:last');
	this.wrap.prepend(lastChildren);
	this.wrap.stop().animate({left: 0}, this.speed);
	this.current--;
	if( this.current < 0 ) {
		this.current = this.sum - 1;
	}
	if( this.nav ) {
		this.navNode.wrap.find('li').removeClass('active').eq(this.current).addClass('active');
	}
}
// 注册事件
Slider.prototype.handle = function() {
	var _ = this;
	// 点击左右箭头
	if( this.arrows ) {
		this.arrows.next.on('click',function(){
			_.next(1);
		});
		this.arrows.prev.on('click',function(){
			_.prev();
		});
	}
	// 点击分页按钮
	if( this.nav ) {
		this.navNode.wrap.on('click', 'li', function() {
			var index = $(this).index();
			var difference = Math.abs( index - _.current );
			if( _.nav ) {
				_.navNode.wrap.find('li').removeClass('active').eq(_.current).addClass('active');
			}
			if( index > _.current ) {
				_.next(difference);
			}
			if( index < _.current ) {
				for( var i = 0 ; i < difference; i++ ) {
					_.prev();
				}
			}
		});
	}
}
// 开始轮播
Slider.prototype.start = function() {
	var _ = this;
	this.timer = setInterval(function(){
		_.next(1);
	},_.interval);
}
// 暂停轮播
Slider.prototype.stop = function() {
	clearInterval( this.timer );
}