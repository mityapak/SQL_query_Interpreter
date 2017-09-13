import Parser from '../parserQuery';
import Interpreter from '../interpreter';


let text = "select * from users where age < 4 ;select * from users where name = 'ccc'" ;
const keyWords = ["select" ,"from", "where", "and"]



class controller {
    constructor (text,keyWords){
        this.file = text;
        this.keyWords = keyWords;
        this.parserQuery = new Parser(this.file, this.keyWords)
    }

    async queryMongo(){
        let parsedQuery = this.parserQuery.parseQuery();
        this.interpretator = new Interpreter(parsedQuery);
        let data = await this.interpretator.connectMongodb();
        console.log(data)
        return data
    }
}

let control = new controller (text,keyWords);

control.queryMongo()