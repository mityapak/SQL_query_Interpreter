var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

exports.__esModule = true;

var Errors = (function () {
    function Errors() {
        _classCallCheck(this, Errors);
    }

    Errors.Unexpectedtoken = function Unexpectedtoken(token) {
        return new Error('Unexpected token: ' + '"' + token + '"');
    };

    return Errors;
})();

exports['default'] = Errors;
module.exports = exports['default'];
//# sourceMappingURL=errors.js.map
