var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _asyncToGenerator = require('babel-runtime/helpers/async-to-generator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _parserQuery = require('./parserQuery');

var _parserQuery2 = _interopRequireDefault(_parserQuery);

var _interpreter = require('./interpreter');

var _interpreter2 = _interopRequireDefault(_interpreter);

var controller = (function () {
    function controller(text, keyWords) {
        _classCallCheck(this, controller);

        this.file = text;
        this.keyWords = keyWords;
        this.parserQuery = new _parserQuery2['default'](this.file, this.keyWords);
    }

    controller.prototype.queryMongo = _asyncToGenerator(function* () {
        var parsedQuery = this.parserQuery.parseQuery();

        this.interpretator = new _interpreter2['default'](parsedQuery);
        var data = yield this.interpretator.connectMongodb();
        console.log(data);
        return data;
    });
    return controller;
})();

exports['default'] = controller;
module.exports = exports['default'];
//# sourceMappingURL=app.js.map
