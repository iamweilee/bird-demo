define(function(require) {
	var Class = require('bird.class');
	var Action = require('bird.action');

	function Index(){
		Index.superClass.apply(this, arguments);
	}

	Class.inherit(Index, Action);


	(function () {
		this.tplUrl = './biz/index/tpl/index.html';

		this.title = '示例 | 导航页';

		this.initModel = function($model,$watcher){
			$model.bootstrapLabel = "整合bootstrap";
		};
		
	}).call(Index.prototype);

	return new Index();
});