var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _asyncToGenerator = require("babel-runtime/helpers/async-to-generator")["default"];

exports.__esModule = true;

var _mongodb = require('mongodb');

var Interpreter = (function () {
    function Interpreter(parsedQuery) {
        _classCallCheck(this, Interpreter);

        this.parsedQuery = parsedQuery;
        this.objectParams = {};
    }

    Interpreter.prototype.sendQuery = function sendQuery() {
        var _this = this;

        _mongodb.MongoClient.connect("mongodb://localhost:27017/test", _asyncToGenerator(function* (err, db) {
            if (err) console.log(err);

            var queryList = _this.getQueryList();

            for (var i = 0; i < queryList.length; i++) {
                _this.objectQuery = queryList[i];
                var collectionName = _this.getCollectionName();
                var command = _this.getCommand();
                var queryParams = _this.getQueryParams();
                var fieldsList = _this.getfieldsList();

                var collection = yield db.collection(collectionName);
                var data = yield collection[command](queryParams, fieldsList);
                var result = yield data.toArray();
                console.log(result);
            }
        }));
    };

    Interpreter.prototype.getQueryList = function getQueryList() {
        if (this.parsedQuery.query.constructor === Array) {
            return this.parsedQuery.query;
        } else {
            return err;
        }
    };

    Interpreter.prototype.getCollectionName = function getCollectionName() {
        return this.objectQuery.from.name;
    };

    Interpreter.prototype.getCommand = function getCommand() {
        var command = this.objectQuery.text;
        switch (command) {
            case "select":
                return "find";
            default:
                return err;
        }
    };

    Interpreter.prototype.getfieldsList = function getfieldsList() {

        if (this.objectQuery.select.items && this.objectQuery.select.items.constructor === Array) {

            var fieldList = this.objectQuery.select.items;
            var fields = {};
            for (var i = 0; i < fieldList.length; i++) {
                fields[fieldList[i].text] = 1;
            }
            return fields;
        }

        if (this.objectQuery.select.type === 'specialSymbol' && this.objectQuery.select.text === '*') {
            return {};
        }
    };

    Interpreter.prototype.getQueryParams = function getQueryParams() {
        if (this.objectQuery.where) {
            var expression = this.objectQuery.where.expressions;
            this.compileObjectParam(expression);
            return this.objectParams;
        } else {
            return {};
        }
    };

    Interpreter.prototype.compileObjectParam = function compileObjectParam(expression) {
        switch (expression.operation) {
            case "and":
                this.getRightParams(expression);
                this.getLeftParams(expression);
                break;
            case "=":
                this.equalOperation(expression);
                break;
            case ">":
                this.noEqualOperation(expression, "$gt");
                break;
            case "<":
                this.noEqualOperation(expression, "$lt");
                break;
            case "in":
                this.noEqualOperation(expression, "$in");
        }
    };

    Interpreter.prototype.getRightParams = function getRightParams(expression) {
        var rightObject = expression.right;
        this.compileObjectParam(rightObject);
    };

    Interpreter.prototype.getLeftParams = function getLeftParams(expression) {
        var leftObject = expression.left;
        this.compileObjectParam(leftObject);
    };

    Interpreter.prototype.equalOperation = function equalOperation(expression) {
        var leftValue = expression.left.name;
        var rightValue = expression.right.value;
        if (!this.objectParams[leftValue]) {
            this.objectParams[leftValue] = rightValue;
        }
    };

    Interpreter.prototype.noEqualOperation = function noEqualOperation(expression, operation) {
        var leftValue = expression.left.name;
        var rightValue = expression.right.value;
        if (!this.objectParams[leftValue]) {
            var _objectParams$leftValue;

            this.objectParams[leftValue] = (_objectParams$leftValue = {}, _objectParams$leftValue[operation] = rightValue, _objectParams$leftValue);
        } else {
            if (!this.objectParams[leftValue][operation]) {
                this.objectParams[leftValue][operation] = rightValue;
            }
        }
    };

    return Interpreter;
})();

exports["default"] = Interpreter;
module.exports = exports["default"];
//# sourceMappingURL=Interpreter.js.map
