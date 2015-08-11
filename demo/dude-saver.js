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
        }
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

    DudeSaver.prototype._saveVariable = function (variable) {
        return "*_" + variable.cgName;
    };

    DudeSaver.prototype._saveValue = function (value) {
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