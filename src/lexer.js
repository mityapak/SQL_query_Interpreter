import Cursor from './cursor'

export default class Lexer {
    constructor(text, keyWords) {
        this.keyWords = keyWords;
        this.cursor = new Cursor(text)
    }

    getCurrentSymbol() {
        this.symbol = this.cursor.getCurrentCursor();
        this.symbolCode = this.symbol.charCodeAt(0)
    }

    getNextWord() {
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
                return this.parseOperator()

            case this.isEndString():
                return this.endOfstring();

            case this.isEndQuery():
                return this.endOfQuery();

            default:
                throw new Error();
        }
    }

    isCharacter() {
        return (this.symbolCode >= 97
            && this.symbolCode <= 122);
    }

    isNumber() {
        return this.symbolCode >= 48
            && this.symbolCode <= 57;
    }

    isQuote() {
        if (this.symbolCode === 43 || this.symbolCode === 39) return true;
        return false;
    }

    isSpecialSign() {
        return this.symbol === "*";
    }

    isWhiteSpace() {
        return this.symbolCode === 32;
    }

    isLowerHyphen() {
        return this.symbolCode === 95;
    }

    isEndString() {
        return this.symbol === "EOF";
    }

    isComma() {
        return this.symbol === ",";
    }

    isParenthsis() {
        return this.symbolCode === 40
            || this.symbolCode === 41
    }

    isOperator() {
        if (this.symbolCode >= 60 && this.symbolCode <= 62) return true;
        return false;
    }

    isEndQuery() {
        return this.symbolCode === 59;
    }

    isKeyWord(word) {
        for (let i = 0; i < this.keyWords.length; i++) {
            if (word === this.keyWords[i]) {
                return true;
            }
        }
        return false;
    }

    parseIdent() {
        let word = '';
        word += this.symbol;
        this.cursor.symbolIndex++;
        this.getCurrentSymbol();

        while (this.isCharacter() || this.isLowerHyphen()) {
            word += this.symbol;
            this.cursor.symbolIndex++;
            this.getCurrentSymbol();
        }

        if (this.isKeyWord(word)) {
            return {
                type: "keyword",
                text: word
            }
        }
        else {
            return {
                type: "word",
                text: word
            }
        }
    }

    parseNumber() {
        let number = '';

        do {
            number += this.symbol;
            this.cursor.symbolIndex++;
            this.getCurrentSymbol();
        }
        while (this.isNumber())

        let num = parseInt(number)

        return {
            type: 'number',
            text: num
        };
    }

    parseSpecialSign() {
        this.cursor.symbolIndex++;
        this.getCurrentSymbol();

        return {
            type: 'specialSymbol',
            text: '*'
        };
    }

    parseOperator() {
        this.cursor.symbolIndex++;

        return {
            type: "operator",
            text: this.symbol
        };
    }

    parseComma() {
        this.cursor.symbolIndex++;
        return {
            type: 'specialSymbol',
            text: ','
        };
    }

    parseLine() {
        let line = '';
        let num = this.symbolCode;
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
    }

    parseParenthsis() {
        this.cursor.symbolIndex++;
        return {
            type: 'specialSymbol',
            text: this.symbol
        }
    }

    skipWhiteSpace() {
        do {
            this.cursor.symbolIndex++;
            this.getCurrentSymbol();
        }
        while (this.symbolCode === 32)

        return this.getNextWord();
    }

    endOfQuery() {
        this.cursor.symbolIndex++;
        return {
            type: 'end',
            text: 'endQuery'
        };
    }

    endOfstring() {
        return {
            type: 'end',
            text: 'EOF'
        };
    }
}