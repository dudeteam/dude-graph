var DudeSaver = (function() {

    /**
     * Save a graph into JSON
     * @constructor
     */
    var DudeSaver = pandora.class_("DudeSaver", pandora.EventEmitter, function (config) {
        pandora.EventEmitter.call(this);
        this.pluginName = "MyCustomPlugin";
        this.config = config;
        this._operators = {
            "greater_than": ">",
            "add": "+",
            "subtract": "-",
            "multiply": "*",
            "divide": "/"
        };
        this._delegateSignatures = {
            "on_start": "on_start() -> void",
            "on_update": "on_update() -> void",
            "on_destroy": "on_destroy() -> void"
        };
        this._customDelegates = {};
    });

    DudeSaver.prototype.save = function (value, tabs) {
        return pandora.polymorphicMethod(this, "save", value, tabs);
    };

    DudeSaver.prototype._saveGraph = function (graph) {
        var result = "";
        pandora.forEach(graph.blocksByType("Delegate"), function (cgBlock) {
            var outConnection = cgBlock.cgOutputs[0].cgConnections[0];
            if (outConnection !== undefined) {
                if (this._delegateSignatures[cgBlock.cgName]) {
                    result += "\nauto " + this.pluginName + "::" + this._delegateSignatures[cgBlock.cgName] + " {\n";
                    result += this.save(outConnection.cgInputPoint.cgBlock, 1);
                    result += "}\n";
                } else {
                    this._customDelegates[cgBlock.cgName] = this.save(outConnection.cgInputPoint.cgBlock, 2);
                }
            }
        }.bind(this));
        result += this._saveOnEvent();
        return result;
    };

    DudeSaver.prototype._saveOnEvent = function () {
        var result = "";
        if (Object.keys(this._customDelegates).length) {
            result += "\nauto " + this.pluginName;
            result += "::on_event(std::string const &event_name, DictProperty const &outputs) -> void {\n";
            for (var customDelegate in this._customDelegates) {
                if (this._customDelegates.hasOwnProperty(customDelegate)) {
                    result += "    if (event_name == \"" + customDelegate + "\") {\n";
                    result += this._customDelegates[customDelegate];
                    result += "    }\n";
                }
            }
            result += "}\n";
        }
        return result;
    };

    DudeSaver.prototype._saveCondition = function (condition, tabs) {
        var result = "";
        result += this._indent(tabs) + "if (";
        result += this.save(condition.inputByName("test").cgConnections[0].cgOutputPoint.cgBlock) + ") {\n";
        var trueStream = condition.outputByName("true").cgConnections[0];
        if (trueStream !== undefined) {
            result += this.save(trueStream.cgInputPoint.cgBlock, tabs + 1);
        }
        result += this._indent(tabs) + "}";
        var falseStream = condition.outputByName("false").cgConnections[0];
        if (falseStream !== undefined) {
            result += " else {\n";
            result += this.save(falseStream.cgInputPoint.cgBlock, tabs + 1);
            result += "}";
        }
        result += "\n";
        return result;
    };

    DudeSaver.prototype._saveOperator = function (operator) {
        if (this._operators[operator.cgName] === "undefined") {
            throw new Error("Unsupported operator `" + operator.cgName + "`");
        }
        var result = "";
        result += this.save(operator.inputByName("first").cgConnections[0].cgOutputPoint.cgBlock);
        result += " " + this._operators[operator.cgName] + " ";
        result += this.save(operator.inputByName("second").cgConnections[0].cgOutputPoint.cgBlock);
        return result;
    };

    DudeSaver.prototype._saveAssignation = function (assignation, tabs) {
        var result = "";
        var inputThis = assignation.inputByName("this").cgConnections[0];
        var inputOther = assignation.inputByName("other").cgConnections[0];
        if (!inputThis || !inputOther) {
            throw new Error("`this` and `other` should be specified");
        }
        if (pandora.typename(inputThis.cgOutputPoint.cgBlock) !== "Variable") {
            throw new Error("`this` should always be a variable");
        }
        result += this._indent(tabs) + this.save(inputThis.cgOutputPoint.cgBlock);
        result += " = " + this.save(inputOther.cgOutputPoint.cgBlock) + ";\n";
        var outputOut = assignation.outputByName("out").cgConnections[0];
        if (outputOut) {
            result += this.save(outputOut.cgInputPoint.cgBlock, tabs);
        }
        return result;
    };

    DudeSaver.prototype._saveInstruction = function (instruction, tabs) {
        var result = "";
        result += this._indent(tabs);
        if (instruction.inputByName("this")) { // method
            var obj = instruction.inputByName("this").cgConnections[0].cgOutputPoint.cgBlock;
            if (pandora.typename(obj) !== "Variable") {
                throw new Error("`this` should always be a variable in block `" + obj.cgId + "`");
            }
            result += obj.cgName + "()->" + instruction.cgName.substr(instruction.cgName.lastIndexOf(".") + 1);
            result += this._saveFunctionArguments(instruction.cgInputs.slice(2));
        } else { // function
            result += instruction.cgName;
            result += this._saveFunctionArguments(instruction.cgInputs.slice(1));
        }
        result += ";\n";
        var outputOut = instruction.outputByName("out").cgConnections[0];
        if (outputOut) {
            result += this.save(outputOut.cgInputPoint.cgBlock, tabs);
        }
        return result;
    };

    DudeSaver.prototype._saveFunction = function (func) {
        var result = "";
        if (func.inputByName("this")) { // method
            var obj = func.inputByName("this").cgConnections[0].cgOutputPoint.cgBlock;
            if (pandora.typename(obj) !== "Variable") {
                throw new Error("`this` should always be a variable in block `" + obj.cgId + "`");
            }
            result += obj.cgName + "()->" + func.cgName.substr(func.cgName.lastIndexOf(".") + 1);
            result += this._saveFunctionArguments(func.cgInputs.slice(1));
        } else { // function
            result += func.cgName;
            result += this._saveFunctionArguments(func.cgInputs);
        }
        return result;
    };

    DudeSaver.prototype._saveFunctionArguments = function (args) {
        var result = "";
        result += "(";
        pandora.forEach(args, function (arg, index) {
            if (!arg.cgConnections[0]) {
                throw new Error("Missing argument `" + arg.cgName + "`");
            }
            if (index !== 0) {
                result += ", ";
            }
            result += this.save(arg.cgConnections[0].cgOutputPoint.cgBlock);
        }.bind(this));
        result += ")";
        return result;
    };

    DudeSaver.prototype._saveVariable = function (variable) {
        return "*_" + variable.cgName;
    };

    DudeSaver.prototype._saveValue = function (value) {
        if (value.cgValueType === "String") {
            return "\"" + value.cgName + "\"";
        }
        return value.cgName;
    };

    DudeSaver.prototype._indent = function (tabs) {
        var result = "";
        for (var i = 0; i < tabs; ++i) {
            result += "    ";
        }
        return result;
    };

    return DudeSaver;

})();