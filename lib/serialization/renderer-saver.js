cg.RendererSaver = (function() {

    /**
     * Save a graph into JSON
     * @constructor
     */
    var RendererSaver = pandora.class_("RendererSaver", pandora.EventEmitter, function (config) {
        pandora.EventEmitter.call(this);
        this.config = config;
    });

    RendererSaver.prototype.save = function (value, tabs) {
        return pandora.polymorphicMethod(this, "save", value, tabs);
    };

    RendererSaver.prototype._saveRenderer = function (renderer) {
        var result = {};
        //console.log(renderer);
        return result;
    };

    return RendererSaver;

})();