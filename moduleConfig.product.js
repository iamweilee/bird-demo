(function() {
	var pathname = location.pathname;
	var modprefix = /\/$/.test(pathname) ? pathname : pathname.substring(0, pathname.lastIndexOf('/') + 1);

	var alias = {
		'jquery': 'dep/lib/jquery/jquery-1.11.1',
		'moment': 'dep/lib/moment/moment',
		'q': 'dep/lib/q/q',
		'bootstrap': 'dep/ui/bootstrap/js/bootstrap.amd'
	};

	/*//begin
	var modMap = {
		app: {
			prefix: modprefix + 'biz/',
			mods: [
				'common/404' ,'index/index', 'todos/todos', 'bootstrap/bs', 'entry'
			]
		}
	};
	//end*/

	each(modMap, function(m) {
		each(m.mods, function(modName) {
			alias[modName] = m.prefix + modName;
		});
	});

	seajs.config({
		base: modprefix,
		alias: alias
	});

	function each(p, handle) {
		var i, len;
		var isFunc = typeof handle === 'function';

		if (Array.isArray && Array.isArray(p) || p instanceof Array) {
			for (i = 0, len = p.length; i < len; i++) {
				if (isFunc) {
					handle(p[i], i, p);
				}
			}
		} else {
			for (i in p) {
				if (p.hasOwnProperty(i) && isFunc) {
					handle(p[i], i, p);
				}
			}
		}
	}
})();