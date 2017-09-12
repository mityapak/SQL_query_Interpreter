var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

exports.__esModule = true;

var Cursor = (function () {
    function Cursor(text) {
        _classCallCheck(this, Cursor);

        this.symbolIndex = 0;
        this.text = text;
    }

    Cursor.prototype.getCurrentCursor = function getCurrentCursor() {
        if (this.symbolIndex < this.text.length) {
            return this.text[this.symbolIndex];
        } else {
            return "EOF";
        }
    };

    return Cursor;
})();

exports["default"] = Cursor;
module.exports = exports["default"];
//# sourceMappingURL=cursor.js.map
