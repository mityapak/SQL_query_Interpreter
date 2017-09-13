import {MongoClient} from 'mongodb';

export default class Interpreter {
    constructor(parsedQuery) {
        this.parsedQuery = parsedQuery;
        this.objectParams = {};

    }


    async connectMongodb(){
        try {
            this.db = await MongoClient.connect("mongodb://localhost:27017/test");

            let arrayOfResult = [];

            let queryList = this.getQueryList();

            for (let i = 0; i < queryList.length; i++) {
                this.objectQuery = queryList[i];

                let data = await this.sendQuery();
                let result = await data.toArray();


                arrayOfResult.push(result);
            }
            await  this.db.close();
            return arrayOfResult;
        }
        catch (error){
            console.log(error)
        }
    }

    async sendQuery() {

        let collectionName = this.getCollectionName();
        let command = this.getCommand();
        let queryParams = this.getQueryParams();
        let fieldsList = this.getfieldsList();

        let collection = await this.db.collection(collectionName);
        let data = await collection[command](queryParams, fieldsList);

        return data;
    }

    getQueryList() {
        if (this.parsedQuery.query.constructor === Array) {
            return this.parsedQuery.query
        } else {
            return err;
        }
    }

    getCollectionName() {
        return this.objectQuery.from.name;
    }

    getCommand() {
        let command = this.objectQuery.text;
        switch (command) {
            case "select":
                return "find";
            default:
                return err
        }
    }


    getfieldsList() {

        if (this.objectQuery.select.items && this.objectQuery.select.items.constructor === Array) {

            let fieldList = this.objectQuery.select.items;
            let fields = {};
            for (let i = 0; i < fieldList.length; i++) {
                fields[fieldList[i].text] = 1;
            }
            return fields;
        }

        if (this.objectQuery.select.type === 'specialSymbol' && this.objectQuery.select.text === '*') {
            return {};
        }

    }

    getQueryParams() {
        if (this.objectQuery.where) {
            let expression = this.objectQuery.where.expressions;
            this.compileObjectParam(expression);
            return this.objectParams;
        }
        else {
            return {}
        }
    }

    compileObjectParam(expression) {
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
    }


    getRightParams(expression) {
        let rightObject = expression.right;
        this.compileObjectParam(rightObject);
    }

    getLeftParams(expression) {
        let leftObject = expression.left;
        this.compileObjectParam(leftObject);
    }

    equalOperation(expression) {
        let leftValue = expression.left.name;
        let rightValue = expression.right.value;
        if (!this.objectParams[leftValue]) {
            this.objectParams[leftValue] = rightValue;
        }

    }

    noEqualOperation(expression, operation) {
        let leftValue = expression.left.name;
        let rightValue = expression.right.value;
        if (!this.objectParams[leftValue]) {
            this.objectParams[leftValue] = {
                [operation]: rightValue
            };
        } else {
            if (!this.objectParams[leftValue][operation]) {
                this.objectParams[leftValue][operation] = rightValue
            }
        }
    }
}














