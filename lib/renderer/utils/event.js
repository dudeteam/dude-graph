(function () {

    _.mixin({
        /**
         * Prevents event
         */
        "preventD3Default": function () {
            _.browserIf(["IE"], function () {
                d3.event.sourceEvent.defaultPrevented = true;
            }, function () {
                d3.event.sourceEvent.preventDefault();
            });
        },

        /**
         * Prevents event
         */
        "stopD3ImmediatePropagation": function () {
            d3.event.sourceEvent.stopImmediatePropagation();
        }
    });

})();