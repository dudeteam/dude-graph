var ShaderSaver = (function() {

    /**
     * Save a graph into JSON
     * @constructor
     */
    var ShaderSaver = pandora.class_("ShaderSaver", pandora.EventEmitter, function (config) {
        pandora.EventEmitter.call(this);
        this.config = config;
    });

    ShaderSaver.prototype.save = function (value, tabs) {
        return pandora.polymorphicMethod(this, "save", value, tabs);
    };

    ShaderSaver.prototype._saveGraph = function (graph) {
        var result = "";
        var color = graph.blockByName("material_output").inputByName("color").cgConnections[0];
        if (color) {
            result += "// fragment shader\n";
            result += "void main(){";
            result += "gl_FlagColor=" + this.save(color.cgOutputPoint.cgBlock) + ";";
            result += "}";
        }
        var vertex = graph.blockByName("material_output").inputByName("vertex").cgConnections[0];
        if (vertex) {
            result += "\n// vertex shader\n";
            result += "void main(){";
            result += "gl_Position=" + this.save(vertex.cgOutputPoint.cgBlock) + ";";
            result += "}";
            //
        }
        return result;
    };

    ShaderSaver.prototype._saveFunction = function (func) {
        var result = "";
        result += func.cgName;
        result += this._saveFunctionArguments(func.cgInputs);
        return result;
    };

    ShaderSaver.prototype._saveVariable = function (variable) {
        return variable.cgName;
    };

    ShaderSaver.prototype._saveValue = function (variable) {
        return variable.cgValue;
    };

    ShaderSaver.prototype._saveFunctionArguments = function (args) {
        var result = "";
        result += "(";
        pandora.forEach(args, function (arg, index) {
            if (index !== 0) {
                result += ", ";
            }
            result += this.save(arg.cgConnections[0].cgOutputPoint.cgBlock);
        }.bind(this));
        result += ")";
        return result;
    };

    return ShaderSaver;

})();