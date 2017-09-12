export default class Cursor {
    constructor (text){
       this.symbolIndex = 0;
       this.text = text
    }

    getCurrentCursor(){
        if (this.symbolIndex < this.text.length){
            return this.text[this.symbolIndex]
        }
        else {
            return "EOF"
        }
    }
}