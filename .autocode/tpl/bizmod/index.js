/**
 * @file     {{__filepath__}}
 * @summary  这里写模块简介
 * @author   {{author}}
 * @email    {{email}}
 * @date     {{__date__}}
 */
define(function(require) {
	var Class = require('bird.class');
	var Action = require('bird.action');

	function Index(){
		Index.superClass.apply(this, arguments);
	}

	Class.inherit(Index, Action);


	(function () {
		//配置模板的路径
		this.tplUrl = './biz/{{__moduleprefix__}}/tpl/index.html';

		//配置进入此Action后浏览器的document.title
		this.title = '{{__moduleprefix__}}';

		/**
		 * 初始化数据模型, 数据的初始化工作在此方法内部完成
		 * STEP 1
		 */
		this.initModel = function($model,$watcher){
			
		};

		/**
		 * 渲染模板前的行为, 此处不应出现数据的操作
		 * 具体该做什么视情况而定, 多数情况下该方法用不着
		 * STEP 2
		 */
		this.beforeRender = function($model,$watcher){
			
		};

		/**
		 * 渲染模板后的行为, 此时页面的DOM结构已被模板和model更新
		 * 此处可做针对DOM的额外操作
		 * STEP 3
		 */
		this.afterRender = function($model,$watcher){
			
		};

		/**
		 * 绑定事件, 通常情况下, 事件绑定应在模板里使用双向绑定完成
		 * 此处可针对相应的业务需要添加合理的事件绑定, 如: 为了性能优化而使用事件委托
		 * STEP 4
		 */
		this.bindEvent = function($model,$watcher){
			
		};
 
		/**
		 * 离开此Action前的行为
		 * 解绑在`STEP 4`中添加的事件绑定
		 * 销毁变量, 释放内存
		 * STEP 5
		 */
		this.beforeLeave = function($model,$watcher){
			
		};
		
	}).call(Index.prototype);

	return new Index();
});