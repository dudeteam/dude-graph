var DudeSaver = (function() {

    /**
     * Save a graph into JSON
     * @constructor
     */
    var DudeSaver = pandora.class_("DudeSaver", pandora.EventEmitter, function () {
        pandora.EventEmitter.call(this);
    });

    DudeSaver.prototype.save = function (value) {
        return pandora.polymorphicMethod(this, "save", value);
    };

    return DudeSaver;

})();