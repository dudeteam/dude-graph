dudeGraph.ExpressionParser = function () {
    this._operators = [
        ["&&", "||"],
        ["==", "!=", ">=", "<=", "<", ">"],
        ["+", "-"],
        ["*", "/", "%"]
    ];
    this._unaryOperators = ["+", "-", "!"];
    this._lexer = new dudeGraph.ExpressionLexer(_.flatten(this._operators)
        .concat(this._unaryOperators)
        .concat(["(", ")"])
    );
    this._variables = [];
};

/**
 * @param token
 * @param op
 * @returns {Boolean}
 */
dudeGraph.ExpressionParser.prototype.isOperator = function (token, op) {
    return !_.isUndefined(token) && token.type === "Operator" && op.indexOf(token.value) !== -1;
};

/**
 * @returns {*}
 */
dudeGraph.ExpressionParser.prototype.parseVariableOrValue = function () {
    var token, expr;

    token = this._lexer.peek();

    if (typeof token === "undefined") {
        throw new SyntaxError("Unexpected termination of expression");
    }

    if (token.type === "Identifier") {
        token = this._lexer.next();
        if (this._variables.indexOf(token.value) === -1) {
            this._variables.push(token.value);
        }
        return {
            "type": "Variable",
            "name": token.value
        };
    }

    if (token.type === "Number") {
        token = this._lexer.next();
        return {
            "type": "Value",
            "value": token.value
        };
    }

    if (this.isOperator(token, "(")) {
        this._lexer.next();
        expr = this.parseOperator(0);
        token = this._lexer.next();
        if (!this.isOperator(token, ")")) {
            throw new SyntaxError("Missing closing )");
        }
        return expr;
    }

    throw new SyntaxError(token.start + ": Cannot process token " + token.value);
};

/**
 *
 * @returns {*}
 */
dudeGraph.ExpressionParser.prototype.parseUnary = function () {
    var token, expr;

    token = this._lexer.peek();
    if (this.isOperator(token, this._unaryOperators)) {
        token = this._lexer.next();
        expr = this.parseUnary();
        return {
            "type": "Unary",
            "operator": token.value,
            "expression": expr
        };
    }

    return this.parseVariableOrValue();
};

/**
 *
 * @param {Number} precedence
 * @returns {{type: String, operator: String, expression: String}}
 */
dudeGraph.ExpressionParser.prototype.parseOperator = function (precedence) {
    if (precedence >= this._operators.length) {
        return this.parseUnary();
    }
    var expr = this.parseOperator(precedence + 1);
    var token = this._lexer.peek();
    while (this.isOperator(token, this._operators[precedence])) {
        token = this._lexer.next();
        expr = {
            "type": "Operator",
            "operator": token.value,
            "first": expr,
            "second": this.parseOperator(precedence + 1)
        };
        token = this._lexer.peek();
    }
    return expr;
};

/**
 *
 * @param {String} expression
 * @returns {{variables: Array<String>, tree: Object}}
 */
dudeGraph.ExpressionParser.prototype.parse = function (expression) {
    this._lexer.reset(expression);
    this._variables = [];

    var tree = this.parseOperator(0);
    var token = this._lexer.next();
    if (typeof token !== "undefined") {
        throw new SyntaxError(token.start + ": Unexpected token " + token.value);
    }

    return {
        "variables": this._variables,
        "tree": tree
    };
};