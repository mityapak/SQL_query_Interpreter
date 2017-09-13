var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _lexer = require('./lexer');

var _lexer2 = _interopRequireDefault(_lexer);

var _errors = require('./errors');

var _errors2 = _interopRequireDefault(_errors);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var Parser = (function () {
    function Parser(text, keyWords) {
        _classCallCheck(this, Parser);

        this.lexer = new _lexer2['default'](text, keyWords);
    }

    Parser.prototype.parseQuery = function parseQuery() {
        var query = {
            type: 'query',
            parent: null,
            query: []
        };

        this.getNextToken();

        while (this.currentToken.text !== "EOF") {
            query.query.push(this.parseQueryField());

            this.getNextToken();
        }

        return query;
    };

    Parser.prototype.parseQueryField = function parseQueryField() {
        if (this.currentToken.type !== "keyword" && this.currentToken.text !== "select") {
            throw _errors2['default'].Unexpectedtoken(this.currentToken.text);
        }

        return this.parseSelectQuery();
    };

    Parser.prototype.getNextToken = function getNextToken() {
        this.currentToken = this.lexer.getNextWord();
    };

    Parser.prototype.parseSelectQuery = function parseSelectQuery() {

        var selectQuery = {
            type: "keyword",
            text: "select",
            select: null,
            from: null,
            where: null
        };

        this.getNextToken();

        if (this.currentToken.type !== "word" && this.currentToken.text !== "*") {
            throw _errors2['default'].Unexpectedtoken(this.currentToken.text);
        }
        selectQuery.select = this.parseSelectExpression();

        if (this.currentToken.type !== "keyword" && this.currentToken.text !== "from") {
            throw _errors2['default'].Unexpectedtoken(this.currentToken.text);
        }

        selectQuery.from = this.parseFromExpression();

        this.getNextToken();

        if (this.currentToken.text === "EOF" || this.currentToken.text === "endQuery") {
            return selectQuery;
        }

        if (this.currentToken.type !== "keyword" && this.currentToken.text !== "where") {
            throw _errors2['default'].Unexpectedtoken(this.currentToken.text);
        }

        selectQuery.where = this.parseWhereExpression();

        return selectQuery;
    };

    Parser.prototype.parseSelectExpression = function parseSelectExpression() {
        if (this.currentToken.type === "word") {
            return this.parseFieldList();
        }

        if (this.currentToken.text === "*") {
            return this.parseAllFieldsExpration();
        }
    };

    Parser.prototype.parseAllFieldsExpration = function parseAllFieldsExpration() {
        this.getNextToken();
        return {
            type: "specialSymbol",
            text: "*"
        };
    };

    Parser.prototype.parseFieldList = function parseFieldList() {
        var items = [];
        items.push(this.parseField());
        this.getNextToken();

        while (this.currentToken.type === "specialSymbol" && this.currentToken.text === ",") {
            this.getNextToken();

            if (this.currentToken.type !== "word") {
                throw _errors2['default'].Unexpectedtoken(this.currentToken.text);
            }

            items.push(this.parseField());

            this.getNextToken();
        }
        return {
            type: 'field-list',
            items: items
        };
    };

    Parser.prototype.parseField = function parseField() {
        return {
            type: "word",
            text: this.currentToken.text
        };
    };

    Parser.prototype.parseFromExpression = function parseFromExpression() {
        this.getNextToken();

        if (this.currentToken.type !== "word") {
            throw _errors2['default'].Unexpectedtoken(this.currentToken.text);
        }

        return {
            type: "from",
            variant: "collection",
            name: this.currentToken.text
        };
    };

    Parser.prototype.parseWhereExpression = function parseWhereExpression() {
        var where = {
            type: "where",
            expressions: null
        };

        this.getNextToken();

        if (this.currentToken.type !== "word") {
            throw _errors2['default'].Unexpectedtoken(this.currentToken.text);
        }

        where.expressions = this.parseExpressions();

        return where;
    };

    Parser.prototype.parseExpressions = function parseExpressions() {

        var expression = this.parseExpression();
        this.getNextToken();

        if (this.currentToken.text === "EOF" || this.currentToken.text === "endQuery") {
            return expression;
        }

        while (this.currentToken.text === "and") {
            var expressions = {
                type: 'expression',
                variant: 'operation',
                operation: null,
                left: null,
                right: null
            };

            expressions.left = expression;

            expressions.operation = this.currentToken.text;

            this.getNextToken();

            if (this.currentToken.type !== "word") {
                throw _errors2['default'].Unexpectedtoken(this.currentToken.text);
            }

            expressions.right = this.parseExpression();

            expression = expressions;

            this.getNextToken();

            if (this.currentToken.text === "EOF" || this.currentToken.text === "endQuery") {
                return expressions;
            }
        }
    };

    Parser.prototype.parseExpression = function parseExpression() {
        var expression = {
            type: 'expression',
            variant: 'operation',
            operation: null,
            left: null,
            right: null
        };

        expression.left = this.parseLeft();
        this.getNextToken();
        if (this.currentToken.type !== "operator" && this.currentToken.text !== "in") {
            throw _errors2['default'].Unexpectedtoken(this.currentToken.text);
        }
        expression.operation = this.currentToken.text;

        if (this.currentToken.text === "in") {
            this.getNextToken();

            if (this.currentToken.text !== "(") {
                throw _errors2['default'].Unexpectedtoken(this.currentToken.text);
            }

            var rightDeclaration = {
                type: 'declaration',
                value: []
            };

            do {
                this.getNextToken();

                if (this.currentToken.type !== 'number') {
                    throw _errors2['default'].Unexpectedtoken(this.currentToken.text);
                }

                rightDeclaration.value.push(this.currentToken.text);
                this.getNextToken();

                if (this.currentToken.text === ')') {
                    break;
                }

                if (this.currentToken.text !== ',') {
                    throw _errors2['default'].Unexpectedtoken(this.currentToken.text);
                }
            } while (this.currentToken.text === ",");

            expression.right = rightDeclaration;
            return expression;
        }

        this.getNextToken();
        if (this.currentToken.type !== "line" && this.currentToken.type !== 'number') {
            throw _errors2['default'].Unexpectedtoken(this.currentToken.text);
        }
        expression.right = this.parseRight();
        return expression;
    };

    Parser.prototype.parseLeft = function parseLeft() {
        return {
            type: "word",
            name: this.currentToken.text
        };
    };

    Parser.prototype.parseRight = function parseRight() {
        return {
            type: "literal",
            value: this.currentToken.text
        };
    };

    return Parser;
})();

exports['default'] = Parser;
module.exports = exports['default'];
//# sourceMappingURL=parserQuery.js.map
