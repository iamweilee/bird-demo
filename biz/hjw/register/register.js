/**
 * AMD register/register
 * require path: './js/module/biz/register'
 */
define(function(require) {

	var mask = require('mask');
	var Class = require('bird.class');
	var Action = require('bird.action');
	var request = require('bird.request');

	function Register(){
		Register.superClass.apply(this, arguments);
	}

	Class.inherit(Register, Action);


	(function () {
		//this.container = document.getElementById('viewWrapper');

		this.tplUrl = './js/module/biz/register/tpl/form.html';

		this.title = '沪江网 | 注册';


		this.afterRender = function($){
			mask.show();
			//var me = this;
			/*setTimeout(function (argument) {
				$.set('email', 'iamweilee11@gmail.com');
				$.set('pwd', 'weiwei-120222');
				$.set('emailDisabled', 'disabled');
				$.set('phonenum', '18816611150');
			},5000);*/
		};

		this.initModel = function($){
			/*var user = $.user = {};
			user.set('email', 'iamweilee11@gmail.com');
			user.set('pwd', 'weiwei-120222');
			user.set('emailDisabled', 'disabled');
			user.set('phonenum', '18816611150');*/
			$.set('user', {
				email: 'iamweilee11@gmail.com',
				pwd: 'weiwei-120222',
				emailDisabled: 'disabled',
				phonenum: '18816611150',
				submitRegister: function(){
					request.post('./register.action', $.toJSON(['user.email', 'user.pwd']));
				}
			});

			
		};

		this.beforeLeave = function(){
			mask.hide();
		};

		this.bindEvent = function(){

		};

	}).call(Register.prototype);

	return new Register();
});