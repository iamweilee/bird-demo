/**
 * 所有业务Action的基类,定义了一个Action应该包含的一系列接口
 * 所有业务子Action必须继承该类
 */
define("bird.action", [ "q", "bird.object", "bird.lang", "bird.dom", "bird.array", "bird.util", "bird.request", "./bird.model", "./bird.databind", "./bird.globalcontext", "./bird.requesthelper", "./bird.validator", "bird.__lrucache__" ], function(require) {
    var Q = require("q");
    var object = require("bird.object");
    var lang = require("bird.lang");
    var dom = require("bird.dom");
    var array = require("bird.array");
    var util = require("bird.util");
    var request = require("bird.request");
    var Model = require("./bird.model");
    var DataBind = require("./bird.databind");
    var globalContext = require("./bird.globalcontext");
    var RequestHelper = require("./bird.requesthelper");
    var validator = require("./bird.validator");
    var LRUCache = require("bird.__lrucache__");
    function Action() {
        this.id = util.uuid("action_");
        this.model = new Model();
        this.dataBind = new DataBind();
        this.dataBinds = [];
        this.requestHelper = new RequestHelper();
        this.lruCache = new LRUCache();
        this.args = {};
        this.lifePhase = this.LifeCycle.NEW;
        this.init();
    }
    Action.setContainer = function(container) {
        Action.prototype.container = lang.isString(container) ? document.getElementById(container) : container;
    };
    (function() {
        this.LifeCycle = {
            NEW: 0,
            INITED: 1,
            MODEL_BOUND: 2,
            RENDERED: 3,
            EVENT_BOUND: 4,
            DESTROYED: 5
        };
        this.tpl = "";
        this.name = "";
        this.container = document.getElementById("wrapper");
        this.init = function() {
            if (!this.requestUrl) {
                this.requestUrl = {};
            }
            if (!this.requestUrlWhenEnter) {
                this.requestUrlWhenEnter = {};
            }
            object.extend(this.requestUrl, this.requestUrlWhenEnter);
            if (!this.requestUrl.resource) {
                this.requestUrl.resource = "/api/" + this.name;
            }
            this.requestHelper.generateRequestMethods(this.requestUrl, this.name);
            this.lifePhase = this.LifeCycle.INITED;
        };
        this._requestData = function() {
            var me = this;
            var deferred;
            var promiseArr = [];
            if (lang.isNotEmpty(this.requestUrlWhenEnter)) {
                object.forEach(this.requestUrlWhenEnter, function(value, key) {
                    var arr = value.split(/\s+/);
                    var reqType = arr && arr[0];
                    var url = arr && arr[1];
                    if (/\{\{[^{}]+\}\}/.test(url)) {
                        url = string.format(url, me.args);
                    }
                    deferred = Q.defer();
                    (function(deferred) {
                        request.ajax({
                            url: url,
                            requestType: reqType,
                            responseType: "json",
                            data: me.args && me.args.param,
                            complete: function(data) {
                                data = data && data.result || data || {};
                                me.model[url] = data;
                                deferred.resolve();
                            },
                            error: function() {
                                deferred.resolve();
                            }
                        });
                    })(deferred);
                    promiseArr.push(deferred.promise);
                });
            } else {
                deferred = Q.defer();
                deferred.resolve();
                promiseArr.push(deferred.promise);
            }
            this.dataRequestPromise = Q.all(promiseArr);
        };
        //子类可以覆盖该接口
        this.initModel = function(modelReference, watcherReference, requesterReference, argumentsReference, lruCacheReference) {};
        this._initModel = function() {
            this.initModel(this.model, this.model.watcher, this.requestHelper, this.args, this.lruCache);
            this.lifePhase = this.LifeCycle.MODEL_BOUND;
        };
        /*
		 * 初始模板应用双向绑定
		 * @private
		 */
        this._applyBind = function() {
            if (!this.tpl) {
                dom.empty(this.container);
                return;
            }
            this.dataBind.parseTpl(this.tpl);
            this.container.innerHTML = this.dataBind.fillTpl(this.model, this.id);
            this.dataBind.bind(this.model, this.model.watcher, this.container, this.dataBinds, this.id);
        };
        /*
		 * 为动态插入的模板应用双向绑定
		 * 一个Action对应一个根容器,即使这里的container非根容器,它也必须是根容器的子节点,所以这里可以把事件绑定在根容器上
		 * @public
		 */
        this.applyBind = function(tpl, container, append) {
            if (!tpl || !container) {
                return;
            }
            var dataBind = new DataBind();
            this.dataBinds.push(dataBind);
            dataBind.parseTpl(tpl);
            var html = dataBind.fillTpl(this.model, this.id);
            if (lang.isFunction(append)) {
                append(html, container);
            } else if (append) {
                dom.appendTo(html, container);
            } else {
                container.innerHTML = html;
            }
            //绑定事件处理逻辑到该Action的根容器上
            dataBind.bind(this.model, this.model.watcher, this.container, this.dataBinds, this.id);
        };
        //子类可以覆盖该接口,自定义事件绑定逻辑
        this.bindEvent = function(modelReference, watcherReference, requesterReference, argumentsReference, lruCacheReference) {};
        this._bindEvent = function() {
            this.bindEvent(this.model, this.model.watcher, this.requestHelper, this.args, this.lruCache);
            this.lifePhase = this.LifeCycle.EVENT_BOUND;
        };
        //子类可以覆盖该接口,用来修改从服务器端获取的数据的结构以满足页面控件的需求
        this.beforeRender = function(modelReference, watcherReference, requesterReference, argumentsReference, lruCacheReference) {};
        this._render = function() {
            this.render(this.model, this.model.watcher, this.requestHelper, this.args, this.lruCache);
            this.lifePhase = this.LifeCycle.RENDERED;
        };
        //子类可以覆盖该接口,请求后台数据返回后重新渲染模板部分内容
        this.render = function(modelReference, watcherReference, requesterReference, argumentsReference, lruCacheReference) {};
        //子类可以覆盖该接口,可能用来修改一些元素的状态等善后操作
        this.afterRender = function(modelReference, watcherReference, requesterReference, argumentsReference, lruCacheReference) {};
        this.loadTpl = function() {
            var deferred = Q.defer();
            if (!this.tplUrl || this.tpl) {
                deferred.resolve();
            } else {
                var me = this;
                request.load(this.tplUrl + "?" + new Date().getTime(), function(data) {
                    me.constructor.prototype.tpl = data;
                    deferred.resolve();
                });
            }
            this.tplRequestPromise = deferred.promise;
        };
        this.enter = function(args) {
            var me = this;
            this.args = args;
            this._requestData();
            this._initModel();
            this.loadTpl();
            this.tplRequestPromise.then(function() {
                //根据Action的变化更新浏览器标题栏
                if (me.title && me.title !== document.title) {
                    document.title = me.title;
                }
                me._applyBind();
                if (me.lifePhase < me.LifeCycle.EVENT_BOUND) {
                    me._bindEvent();
                }
                me.dataRequestPromise.spread(function() {
                    me.beforeRender(me.model, me.model.watcher, me.requestHelper, me.args, me.lruCache);
                    me._render();
                    me.afterRender(me.model, me.model.watcher, me.requestHelper, me.args, me.lruCache);
                }).done();
            }).done();
        };
        //子类可以覆盖该接口,离开Action之前释放一些内存和解绑事件等等
        this.beforeLeave = function(modelReference, watcherReference, requesterReference, argumentsReference, lruCacheReference) {};
        this.leave = function(nextAction) {
            this.beforeLeave(this.model, this.model.watcher, this.requestHelper, this.args, this.lruCache);
            globalContext.remove(this.id);
            validator.clearMessageStack();
            this.dataRequestPromise = null;
            this.dataBind.destroy();
            array.forEach(this.dataBinds, function(dataBind) {
                dataBind.destroy(true);
            });
            this.dataBinds.length = 0;
            this.model.destroy();
            //解决ie8等浏览器切换action时页面闪动的问题
            if (nextAction && nextAction.container !== this.container) {
                dom.empty(this.container);
            }
            this.lifePhase = this.LifeCycle.DESTROYED;
        };
    }).call(Action.prototype);
    return Action;
});