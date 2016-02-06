/**
 * Prevents d3 event
 */
dudeGraph.preventD3Default = function () {
    dudeGraph.browserIf(["IE"], function () {
        d3.event.sourceEvent.defaultPrevented = true;
    }, function () {
        d3.event.sourceEvent.preventDefault();
    });
};

/**
 * Stop d3 event propagation
 */
dudeGraph.stopD3ImmediatePropagation = function () {
    d3.event.sourceEvent.stopImmediatePropagation();
};