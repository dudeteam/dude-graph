(function () {

    _.mixin({
        /**
         * Prevents event to be executed by parent handlers
         */
        "preventD3Default": function () {
            _.browserIf(["IE"], function () {
                d3.event.sourceEvent.defaultPrevented = true;
            }, function () {
                d3.event.sourceEvent.preventDefault();
            });
        }
    });

})();