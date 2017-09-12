var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _parserQuery = require('../parserQuery');

var _parserQuery2 = _interopRequireDefault(_parserQuery);

var _interpreter = require('../interpreter');

var _interpreter2 = _interopRequireDefault(_interpreter);

var text = "select * from users where age < 4 and name ='ccc'";
var keyWords = ["select", "from", "where", "and"];

var controller = (function () {
    function controller(text, keyWords) {
        _classCallCheck(this, controller);

        this.file = text;
        this.keyWords = keyWords;
        this.parserQuery = new _parserQuery2['default'](this.file, this.keyWords);
    }

    controller.prototype.queryMongo = function queryMongo() {
        var parsedQuery = this.parserQuery.parseQuery();

        this.interpretator = new _interpreter2['default'](parsedQuery);
        var data = this.interpretator.sendQuery();

        return data;
    };

    return controller;
})();

var control = new controller(text, keyWords);

control.queryMongo();
//# sourceMappingURL=testing.js.map
