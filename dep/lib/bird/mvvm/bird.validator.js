define("bird.validator", [ "bird.lang", "bird.array", "bird.object" ], function(require) {
    var lang = require("bird.lang");
    var array = require("bird.array");
    var object = require("bird.object");
    function Validator() {}
    (function() {
        var messageStack = [];
        var messageMap = {
            required: "请输入",
            number: "只能输入数字",
            positiveNumber: "只能输入正数",
            positiveInt: "只能输入正整数",
            negativeNumber: "只能输入负数",
            negativeInt: "只能输入负整数",
            notPositiveNumber: "只能输入非正数",
            notPositiveInt: "只能输入非正整数",
            notNegativeNumber: "只能输入非负数",
            notNegativeInt: "只能输入非负整数",
            email: "邮箱格式不正确",
            mobile: "手机号码格式不正确",
            idNumber: "身份证号码格式不正确"
        };
        var ruleMap = {
            required: function(value) {
                var ret = lang.isNotEmpty(value);
                if (!ret) {
                    messageStack.push(messageMap["required"]);
                }
                return ret;
            },
            number: function(value) {
                if (value == null || value === "") {
                    return true;
                }
                var ret = !isNaN(+value);
                if (!ret) {
                    messageStack.push(messageMap["number"]);
                }
                return ret;
            },
            positiveNumber: function(value) {
                if (value == null || value === "") {
                    return true;
                }
                if (this.number(value)) {
                    if (+value > 0) {
                        return true;
                    }
                    messageStack.push(messageMap["positiveNumber"]);
                    return false;
                }
                return false;
            },
            positiveInt: function(value) {
                if (value == null || value === "") {
                    return true;
                }
                if (this.number(value)) {
                    if (+value > 0 && /^\d+$/.test(value)) {
                        return true;
                    }
                    messageStack.push(messageMap["positiveInt"]);
                    return false;
                }
                return false;
            },
            negativeNumber: function(value) {
                if (value == null || value === "") {
                    return true;
                }
                if (this.number(value)) {
                    if (+value < 0) {
                        return true;
                    }
                    messageStack.push(messageMap["negativeNumber"]);
                    return false;
                }
                return false;
            },
            negativeInt: function(value) {
                if (value == null || value === "") {
                    return true;
                }
                if (this.number(value)) {
                    if (+value < 0 && /^\-\d+$/.test(value)) {
                        return true;
                    }
                    messageStack.push(messageMap["negativeInt"]);
                    return false;
                }
                return false;
            },
            notNegativeNumber: function(value) {
                if (value == null || value === "") {
                    return true;
                }
                if (this.number(value)) {
                    if (+value >= 0) {
                        return true;
                    }
                    messageStack.push(messageMap["positiveNumber"]);
                    return false;
                }
                return false;
            },
            notNegativeInt: function(value) {
                if (value == null || value === "") {
                    return true;
                }
                if (this.number(value)) {
                    if (+value >= 0 && /^\d+$/.test(value)) {
                        return true;
                    }
                    messageStack.push(messageMap["positiveInt"]);
                    return false;
                }
                return false;
            },
            notPositiveNumber: function(value) {
                if (value == null || value === "") {
                    return true;
                }
                if (this.number(value)) {
                    if (+value <= 0) {
                        return true;
                    }
                    messageStack.push(messageMap["negativeNumber"]);
                    return false;
                }
                return false;
            },
            notPositiveInt: function(value) {
                if (value == null || value === "") {
                    return true;
                }
                if (this.number(value)) {
                    if (+value <= 0 && /^\-\d+$/.test(value)) {
                        return true;
                    }
                    messageStack.push(messageMap["negativeInt"]);
                    return false;
                }
                return false;
            },
            email: function(value) {
                if (value == null || value === "") {
                    return true;
                }
                if (/^[a-z0-9][a-z0-9\-_]*@[a-z0-9][a-z0-9\-_]*\.[a-z]+(?:\.[a-z]+)?$/i.test(value)) {
                    return true;
                }
                messageStack.push(messageMap["email"]);
                return false;
            },
            mobile: function(value) {
                if (value == null || value === "") {
                    return true;
                }
                if (/^1\d{10,11}$/.test(value)) {
                    return true;
                }
                messageStack.push(messageMap["mobile"]);
                return false;
            },
            idNumber: function(value) {
                if (value == null || value === "") {
                    return true;
                }
                if (/^(?:\d{15}|\d{18})$/.test(value)) {
                    return true;
                }
                messageStack.push(messageMap["idNumber"]);
                return false;
            }
        };
        this.getRuleMap = function() {
            return ruleMap;
        };
        this.getRule = function(ruleName) {
            return ruleMap[ruleName];
        };
        this.getMessageStack = function() {
            return messageStack;
        };
        this.clearMessageStack = function() {
            messageStack.length = 0;
        };
        /**
		 * @param {Object|Array}
		 *
		 * {
		 *		name: 'required',
		 *		handle: function(){...},
		 *		message: '请输入'
		 * }
		 */
        this.addValidator = function(v) {
            if (lang.isPlainObject(v)) {
                ruleMap[v.name] = v.handle;
                messageMap[v.name] = v.message;
            } else if (lang.isArray(v)) {
                var _arguments = arguments;
                array.forEach(v, function(_v) {
                    _arguments.callee(_v);
                });
            }
        };
    }).call(Validator.prototype);
    return new Validator();
});