

export default class Errors{
    static Unexpectedtoken(token){
        return new Error('Unexpected token: ' + '"' + token + '"');
    }
}