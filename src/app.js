import Parser from './parserQuery';
import Interpreter from './interpreter';




export default class controller {
    constructor (text,keyWords){
        this.file = text;
        this.keyWords = keyWords;
        this.parserQuery = new Parser(this.file, this.keyWords)
    }

    queryMongo(){
        let parsedQuery = this.parserQuery.parseQuery();

        this.interpretator = new Interpreter(parsedQuery);
        let data = this.interpretator.sendQuery();

        return data
    }
}

