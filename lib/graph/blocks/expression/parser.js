dudeGraph.ExpressionParser = function (highOperators, lowOperators, unaryOperators) {
    this._highOperators = highOperators || ['*', '/', '%'];
    this._lowOperators = lowOperators || ['+', '-'];
    this._unaryOperators = unaryOperators || ['+', '-'];
    this._lexer = new dudeGraph.ExpressionLexer();
    this._variables = [];
};

dudeGraph.ExpressionParser.prototype.isOperator = function (token, op) {
    return (typeof token !== 'undefined') &&
        token.type === 'Operator' &&
        op.indexOf(token.value) !== -1;
};

dudeGraph.ExpressionParser.prototype.parseVariableOrValue = function () {
    var token, expr;

    token = this._lexer.peek();

    if (typeof token === 'undefined') {
        throw new SyntaxError('Unexpected termination of expression');
    }

    if (token.type === 'Identifier') {
        token = this._lexer.next();
        if (this._variables.indexOf(token.value) === -1) {
            this._variables.push(token.value);
        }
        return {
            'type': 'Variable',
            'name': token.value
        };
    }

    if (token.type === 'Number') {
        token = this._lexer.next();
        return {
            'type': 'Value',
            'value': token.value
        };
    }

    if (this.isOperator(token, '(')) {
        this._lexer.next();
        expr = this.parseLowOperator();
        token = this._lexer.next();
        if (!this.isOperator(token, ')')) {
            throw new SyntaxError('Missing closing )');
        }
        return expr;
    }

    throw new SyntaxError(token.start + ': Cannot process token ' + token.value);
};

dudeGraph.ExpressionParser.prototype.parseUnary = function () {
    var token, expr;

    token = this._lexer.peek();
    if (this.isOperator(token, this._unaryOperators)) {
        token = this._lexer.next();
        expr = this.parseUnary();
        return {
            'type': 'Unary',
            'operator': token.value,
            'expression': expr
        };
    }

    return this.parseVariableOrValue();
};

dudeGraph.ExpressionParser.prototype.parseHighOperator = function () {
    var expr = this.parseUnary();
    var token = this._lexer.peek();
    while (this.isOperator(token, this._highOperators)) {
        token = this._lexer.next();
        expr = {
            'type': 'Operator',
            'operator': token.value,
            'first': expr,
            'second': this.parseUnary()
        };
        token = this._lexer.peek();
    }
    return expr;
};

dudeGraph.ExpressionParser.prototype.parseLowOperator = function () {
    var expr, token;

    expr = this.parseHighOperator();
    token = this._lexer.peek();
    while (this.isOperator(token, this._lowOperators)) {
        token = this._lexer.next();
        expr = {
            'type': 'Operator',
            'operator': token.value,
            'first': expr,
            'second': this.parseHighOperator()
        };
        token = this._lexer.peek();
    }
    return expr;
};

dudeGraph.ExpressionParser.prototype.parse = function (expression) {
    this._lexer.reset(expression);
    this._variables = [];

    var tree = this.parseLowOperator();
    var token = this._lexer.next();
    if (typeof token !== 'undefined') {
        throw new SyntaxError(token.start + ': Unexpected token ' + token.value);
    }

    return {
        'variables': this._variables,
        'tree': tree
    };
};