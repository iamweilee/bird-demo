define(function(require) {
	var config = [
		{
			location: '/',
			action: 'index/index'
		}, {
			location: '/todos',
			action: 'todos/todos'
		}, {
			location: '/todos/{{id}}',//变量需要双花括号包围
			action: 'todos/todos'
		}, {
			location: '/bootstrap',
			action: 'bootstrap/bs'
		}, {
			location: '/404',
			action: 'common/404',
			isNotFound: true
		}
	];

	return config;
})