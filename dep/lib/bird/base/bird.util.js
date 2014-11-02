define("bird.util", [ "./bird.object", "./bird.array", "./bird.lang", "./bird.string", "./bird.uuid" ], function(require) {
    var object = require("./bird.object");
    var array = require("./bird.array");
    var lang = require("./bird.lang");
    var string = require("./bird.string");
    var uuid = require("./bird.uuid");
    function Util() {}
    (function() {
        /**
		 * 在bird.array和bird.object里都有了各自的each和forEach,这里为何还要再弄个呢?
		 * 很多场景,我们并不想或并不能完全确定传入的实参的各层属性到底是Array还是PlainObject,
		 * 这种情况下就用这里的each和forEach,免得在业务逻辑里再去判断类型并选择导入array模块还是object模块
		 */
        //each可从内部中断,当findSuper为true时把继承而来的property也一起遍历
        this.each = function(p, callback, findSuper) {
            return lang.isArray(p) ? array.each(p, callback, findSuper) : object.each(p, callback, findSuper);
        };
        //each不可从内部中断,当findSuper为true时把继承而来的property也一起遍历
        this.forEach = function(p, callback, findSuper) {
            lang.isArray(p) ? array.forEach(p, callback, findSuper) : object.forEach(p, callback, findSuper);
        };
        this.uuid = function(prefix) {
            var uid = uuid.uuid(8);
            return prefix ? prefix + uid : uid;
        };
        this.stringify = function(obj) {
            var isArray = lang.isArray(obj);
            var ret = [ isArray ? "[" : "{" ];
            var _arguments = arguments;
            var me = this;
            this.forEach(obj, function(val, key, obj) {
                if (!isArray) {
                    ret.push(key, ":");
                }
                if (lang.isArray(val) || lang.isPlainObject(val)) {
                    ret.push(_arguments.callee.call(me, val));
                } else if (lang.isDate(val)) {
                    ret.push('"', val.toLocaleString(), '"');
                } else {
                    var isRaw = lang.isString(val) || lang.isNumber(val);
                    isRaw && ret.push('"');
                    ret.push(string.trim(val));
                    isRaw && ret.push('"');
                }
                ret.push(",");
            });
            ret.pop();
            ret.push(isArray ? "]" : "}");
            return ret.join("");
        };
    }).call(Util.prototype);
    //考虑到AMD加载器会缓存模块实例,所以这里只需要简单的new一个实例即可,无需去判断是否是首次实例化一个类
    return new Util();
});