var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

exports.__esModule = true;

var _cursor = require('./cursor');

var _cursor2 = _interopRequireDefault(_cursor);

var Lexer = (function () {
    function Lexer(text, keyWords) {
        _classCallCheck(this, Lexer);

        this.keyWords = keyWords;
        this.cursor = new _cursor2["default"](text);
    }

    Lexer.prototype.getCurrentSymbol = function getCurrentSymbol() {
        this.symbol = this.cursor.getCurrentCursor();
        this.symbolCode = this.symbol.charCodeAt(0);
    };

    Lexer.prototype.getNextWord = function getNextWord() {
        this.getCurrentSymbol();

        switch (true) {
            case this.isCharacter():
                return this.parseIdent();

            case this.isNumber():
                return this.parseNumber();

            case this.isQuote():
                return this.parseLine();

            case this.isWhiteSpace():
                return this.skipWhiteSpace();

            case this.isSpecialSign():
                return this.parseSpecialSign();

            case this.isComma():
                return this.parseComma();

            case this.isParenthsis():
                return this.parseParenthsis();

            case this.isOperator():
                return this.parseOperator();

            case this.isEndString():
                return this.endOfstring();

            case this.isEndQuery():
                return this.endOfQuery();

            default:
                throw new Error();
        }
    };

    Lexer.prototype.isCharacter = function isCharacter() {
        return this.symbolCode >= 97 && this.symbolCode <= 122;
    };

    Lexer.prototype.isNumber = function isNumber() {
        return this.symbolCode >= 48 && this.symbolCode <= 57;
    };

    Lexer.prototype.isQuote = function isQuote() {
        if (this.symbolCode === 43 || this.symbolCode === 39) return true;
        return false;
    };

    Lexer.prototype.isSpecialSign = function isSpecialSign() {
        return this.symbol === "*";
    };

    Lexer.prototype.isWhiteSpace = function isWhiteSpace() {
        return this.symbolCode === 32;
    };

    Lexer.prototype.isLowerHyphen = function isLowerHyphen() {
        return this.symbolCode === 95;
    };

    Lexer.prototype.isEndString = function isEndString() {
        return this.symbol === "EOF";
    };

    Lexer.prototype.isComma = function isComma() {
        return this.symbol === ",";
    };

    Lexer.prototype.isParenthsis = function isParenthsis() {
        return this.symbolCode === 40 || this.symbolCode === 41;
    };

    Lexer.prototype.isOperator = function isOperator() {
        if (this.symbolCode >= 60 && this.symbolCode <= 62) return true;
        return false;
    };

    Lexer.prototype.isEndQuery = function isEndQuery() {
        return this.symbolCode === 59;
    };

    Lexer.prototype.isKeyWord = function isKeyWord(word) {
        for (var i = 0; i < this.keyWords.length; i++) {
            if (word === this.keyWords[i]) {
                return true;
            }
        }
        return false;
    };

    Lexer.prototype.parseIdent = function parseIdent() {
        var word = '';
        word += this.symbol;
        this.cursor.symbolIndex++;
        this.getCurrentSymbol();

        while (this.isCharacter() || this.isLowerHyphen()) {
            word += this.symbol;
            this.cursor.symbolIndex++;
            this.getCurrentSymbol();
        };
        if (this.isKeyWord(word)) {
            return {
                type: "keyword",
                text: word
            };
        } else {
            return {
                type: "word",
                text: word
            };
        }
    };

    Lexer.prototype.parseNumber = function parseNumber() {
        var number = '';
        do {
            number += this.symbol;
            this.cursor.symbolIndex++;
            this.getCurrentSymbol();
        } while (this.isNumber());
        var num = parseInt(number);
        return {
            type: 'number',
            text: num
        };
    };

    Lexer.prototype.parseSpecialSign = function parseSpecialSign() {
        this.cursor.symbolIndex++;
        this.getCurrentSymbol();
        return {
            type: 'specialSymbol',
            text: '*'
        };
    };

    Lexer.prototype.parseOperator = function parseOperator() {
        this.cursor.symbolIndex++;

        return {
            type: "operator",
            text: this.symbol
        };
    };

    Lexer.prototype.parseComma = function parseComma() {
        this.cursor.symbolIndex++;
        return {
            type: 'specialSymbol',
            text: ','
        };
    };

    Lexer.prototype.parseLine = function parseLine() {
        var line = '';
        var num = this.symbolCode;
        this.cursor.symbolIndex++;
        this.getCurrentSymbol();

        while (this.symbolCode != num) {

            line += this.symbol;
            this.cursor.symbolIndex++;
            this.getCurrentSymbol();
        }
        this.cursor.symbolIndex++;

        return {
            type: 'line',
            text: line
        };
    };

    Lexer.prototype.parseParenthsis = function parseParenthsis() {
        this.cursor.symbolIndex++;
        return {
            type: 'specialSymbol',
            text: this.symbol
        };
    };

    Lexer.prototype.skipWhiteSpace = function skipWhiteSpace() {
        do {
            this.cursor.symbolIndex++;
            this.getCurrentSymbol();
        } while (this.symbolCode === 32);
        return this.getNextWord();
    };

    Lexer.prototype.endOfQuery = function endOfQuery() {
        this.cursor.symbolIndex++;
        return {
            type: 'end',
            text: 'endQuery'
        };
    };

    Lexer.prototype.endOfstring = function endOfstring() {
        return {
            type: 'end',
            text: 'EOF'
        };
    };

    return Lexer;
})();

exports["default"] = Lexer;
module.exports = exports["default"];
//# sourceMappingURL=lexer.js.map
