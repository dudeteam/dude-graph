dudeGraph.ExpressionLexer = function (operators) {
    this._operators = operators;
    this._expression = '';
    this._length = 0;
    this._index = 0;
    this._marker = 0;
};

dudeGraph.ExpressionLexer.prototype.getChar = function (offset) {
    return this._expression[this._index + (offset || 0)] || '\0';
};

dudeGraph.ExpressionLexer.prototype.nextChar = function () {
    var ch = this.getChar();
    if (ch !== '\0') {
        ++this._index;
    }
    return ch;
};

dudeGraph.ExpressionLexer.prototype.isWhiteSpace = function (ch) {
    return "\t\n ".indexOf(ch) !== -1;
};

dudeGraph.ExpressionLexer.prototype.isLetter = function (ch) {
    return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
};

dudeGraph.ExpressionLexer.prototype.isDecimalDigit = function (ch) {
    return (ch >= '0') && (ch <= '9');
};

dudeGraph.ExpressionLexer.prototype.isIdentifierStart = function (ch) {
    return (ch === '_') || this.isLetter(ch);
};

dudeGraph.ExpressionLexer.prototype.isIdentifierPart = function (ch) {
    return this.isIdentifierStart(ch) || this.isDecimalDigit(ch);
};

dudeGraph.ExpressionLexer.prototype.createToken = function (type, value) {
    return {
        type: type,
        value: value,
        start: this._marker,
        end: this._index - 1
    };
};

dudeGraph.ExpressionLexer.prototype.skipSpaces = function () {
    while (this._index < this._length) {
        var ch = this.getChar();
        if (!this.isWhiteSpace(ch)) {
            break;
        }
        this.nextChar();
    }
};

dudeGraph.ExpressionLexer.prototype.scanOperator = function () {
    if (this._operators.indexOf(this.getChar()) !== -1) { // 1 char
        return this.createToken('Operator', this.nextChar());
    }
    if (this._operators.indexOf(this.getChar() + this.getChar(1)) !== -1) { // 2 chars
        return this.createToken('Operator', this.nextChar() + this.nextChar());
    }
    return undefined;
};

dudeGraph.ExpressionLexer.prototype.scanIdentifier = function () {
    var ch = this.getChar();
    if (!this.isIdentifierStart(ch)) {
        return undefined;
    }

    var id = this.nextChar();
    while (true) {
        ch = this.getChar();
        if (!this.isIdentifierPart(ch)) {
            break;
        }
        id += this.nextChar();
    }

    return this.createToken('Identifier', id);
};

dudeGraph.ExpressionLexer.prototype.scanNumber = function () {
    var ch = this.getChar();
    if (!this.isDecimalDigit(ch) && (ch !== '.')) {
        return undefined;
    }
    var number = '';
    if (ch !== '.') {
        number = this.nextChar();
        while (true) {
            ch = this.getChar();
            if (!this.isDecimalDigit(ch)) {
                break;
            }
            number += this.nextChar();
        }
    }
    if (ch === '.') {
        number += this.nextChar();
        while (true) {
            ch = this.getChar();
            if (!this.isDecimalDigit(ch)) {
                break;
            }
            number += this.nextChar();
        }
    }

    if (ch === 'e' || ch === 'E') {
        number += this.nextChar();
        ch = this.getChar();
        if (ch === '+' || ch === '-' || this.isDecimalDigit(ch)) {
            number += this.nextChar();
            while (true) {
                ch = this.getChar();
                if (!this.isDecimalDigit(ch)) {
                    break;
                }
                number += this.nextChar();
            }
        } else {
            ch = 'character ' + ch;
            if (this._index >= this._length) {
                ch = '<end>';
            }
            throw new SyntaxError('Unexpected ' + ch + ' after the exponent sign');
        }
    }

    if (number === '.') {
        throw new SyntaxError('Expecting decimal digits after the dot sign');
    }

    return this.createToken('Number', number);
};

dudeGraph.ExpressionLexer.prototype.reset = function (str) {
    this._expression = str;
    this._length = str.length;
    this._index = 0;
};

dudeGraph.ExpressionLexer.prototype.next = function () {
    this.skipSpaces();
    if (this._index >= this._length) {
        return undefined;
    }
    this._marker = this._index;
    var token = this.scanNumber() || this.scanOperator() || this.scanIdentifier();
    if (typeof token !== 'undefined') {
        return token;
    }
    throw new SyntaxError('Unknown token from character ' + this.getChar());
};

dudeGraph.ExpressionLexer.prototype.peek = function () {
    var token, savedIndex;

    savedIndex = this._index;
    try {
        token = this.next();
    } catch (e) {
        token = undefined;
    }
    this._index = savedIndex;

    return token;
};