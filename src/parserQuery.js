import Lexer from './lexer';
import Errors from './errors';
import util from 'util'

export default class Parser {
    constructor(text, keyWords) {
        this.lexer = new Lexer(text, keyWords);

    }

    parseQuery(){
        let query = {
            type: 'query',
            parent: null,
            query: []
        };

        this.getNextToken();
        while(this.currentToken.text !== "EOF"){

            query.query.push(
                this.parseQueryField()
            );

            this.getNextToken();
        }
        //console.log(util.inspect(query, { depth: 8 }))

        return query;
    }

    parseQueryField() {
        if (this.currentToken.type !== "keyword" && this.currentToken.text !== "select") {
            throw Errors.Unexpectedtoken(this.currentToken.text);
        }

        return this.parseSelectQuery();
    }

    getNextToken() {
        this.currentToken = this.lexer.getNextWord();
    }

    parseSelectQuery() {

        let selectQuery = {
            type: "keyword",
            text: "select",
            select: null,
            from: null,
            where: null
        };

        this.getNextToken();


        if (this.currentToken.type !== "word" && this.currentToken.text !== "*") {
            throw Errors.Unexpectedtoken(this.currentToken.text);
        }
        selectQuery.select = this.parseSelectExpression();


        if (this.currentToken.type !== "keyword" && this.currentToken.text !== "from") {
            throw Errors.Unexpectedtoken(this.currentToken.text);
        }
        selectQuery.from = this.parseFromExpression();

        this.getNextToken();

        if(this.currentToken.text === "EOF" || this.currentToken.text === "endQuery"){
            return selectQuery;
        }

        if (this.currentToken.type !== "keyword" && this.currentToken.text !== "where") {
            throw Errors.Unexpectedtoken(this.currentToken.text);
        }
        selectQuery.where = this.parseWhereExpression();
        return selectQuery;
    }

    parseSelectExpression() {
        if (this.currentToken.type === "word") {
            return this.parseFieldList();
        }
        if (this.currentToken.text === "*") {
            return this.parseAllFieldsExpration();
        }
    }

    parseAllFieldsExpration() {
        this.getNextToken();
        return {
            type: "specialSymbol",
            text: "*"
        }
    }

    parseFieldList() {
        let items = [];
        items.push(this.parseField());
        this.getNextToken();

        while (this.currentToken.type === "specialSymbol" && this.currentToken.text === ",") {
            this.getNextToken();

            if(this.currentToken.type !== "word"){
                throw Errors.Unexpectedtoken(this.currentToken.text);
            }
            items.push(this.parseField());

            this.getNextToken();
        }
        return {
            type: 'field-list',
            items
        }
    }

    parseField() {
        return {
            type: "word",
            text: this.currentToken.text
        }
    }

    parseFromExpression(){
        this.getNextToken();
        if(this.currentToken.type !== "word"){
            throw Errors.Unexpectedtoken(this.currentToken.text);
        }

        return {
            type: "from",
            variant: "collection",
            name: this.currentToken.text
        }
    }

    parseWhereExpression(){
        let where = {
            type: "where",
            expressions: null
        }
        this.getNextToken();

        if(this.currentToken.type !== "word"){
            throw Errors.Unexpectedtoken(this.currentToken.text);
        }

        where.expressions = this.parseExpressions();

        return where;
    }

    parseExpressions(){

        let expression = this.parseExpression()
        this.getNextToken();

        if (this.currentToken.text === "EOF" || this.currentToken.text === "endQuery"){
            return expression
        }

        while(this.currentToken.text === "and"){
            let expressions = {
                type: 'expression',
                variant: 'operation',
                operation: null,
                left:null,
                right:null
            }
            expressions.left = expression;
            expressions.operation = this.currentToken.text;
            this.getNextToken();
            if(this.currentToken.type !== "word"){
                throw Errors.Unexpectedtoken(this.currentToken.text);
            }
            expressions.right = this.parseExpression();
            expression = expressions;

            this.getNextToken();
            if (this.currentToken.text === "EOF" || this.currentToken.text === "endQuery"){
                return expressions;
            }
        }
    }

    parseExpression(){
        let expression = {
            type: 'expression',
            variant: 'operation',
            operation: null,
            left:null,
            right:null
        }

        expression.left = this.parseLeft();
        this.getNextToken();
        if (this.currentToken.type !== "operator" && this.currentToken.text !== "in"){
            throw Errors.Unexpectedtoken(this.currentToken.text);
        }
        expression.operation = this.currentToken.text;

        if (this.currentToken.text === "in"){
            this.getNextToken();

            if(this.currentToken.text !== "("){
                throw Errors.Unexpectedtoken(this.currentToken.text);
            }

            let rightDeclaration = {
                type: 'declaration',
                value: []
            }

            do{
                this.getNextToken();

                if(this.currentToken.type !== 'line' && this.currentToken.type !== 'number'){
                    throw Errors.Unexpectedtoken(this.currentToken.text);
                }

                rightDeclaration .value.push(this.currentToken.text);
                this.getNextToken();

                if(this.currentToken.text === ')'){
                    break;
                }

                if(this.currentToken.text !== ','){
                    throw Errors.Unexpectedtoken(this.currentToken.text);
                }

            }while(this.currentToken.text === ",");

            expression.right = rightDeclaration;
            return expression;

        }

        this.getNextToken();
        if (this.currentToken.type !== "line" && this.currentToken.type !== 'number'){
            throw Errors.Unexpectedtoken(this.currentToken.text);
        }
        expression.right = this.parseRight();
        return expression
    }

    parseLeft(){
        return{
            type: "word",
            name: this.currentToken.text,
        }
    }

    parseRight(){
        return{
            type: "literal",
            value: this.currentToken.text,
        }
    }
}

