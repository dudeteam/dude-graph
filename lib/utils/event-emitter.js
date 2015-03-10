cg.EventEmitter = (function () {

    /**
     * Handle pub-sub events.
     * @constructor
     */
    function EventEmitter() {
        this._listeners = {};
    }

    /**
     * Add a listener for the given name.
     * @param name
     * @param fn
     */
    EventEmitter.prototype.on = function (name, fn) {
        if (this._listeners[name] === undefined) {
            this._listeners[name] = [];
        }
        this._listeners[name].push(fn);
    };

    /**
     * Remove all listeners for the given name.
     */
    EventEmitter.prototype.off = function (name) {
        this._listeners[name] = [];
    };

    /**
     * Emit an event for the given name.
     * @param name
     */
    EventEmitter.prototype.emit = function (name) {
        console.log(cg.functionName(this.constructor), name);
        if (this._listeners[name] === undefined) {
            return;
        }
        for (var i = 0; i < this._listeners[name].length; ++i) {
            this._listeners[name][i].apply(this, Array.prototype.slice.call(arguments, 1));
        }
    };

    return EventEmitter;

})();