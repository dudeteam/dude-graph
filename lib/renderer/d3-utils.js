/**
 * Internal function of d3
 * @param dispatch
 * @returns {event}
 */
function d3_dispatch_event(dispatch) {
    var listeners = [], listenerByName = d3.map();

    function event() {
        var z = listeners, i = -1, n = z.length, l;
        while (++i < n) {
            l = z[i].on;
            if (l) {
                l.apply(this, arguments);
            }
        }
        return dispatch;
    }

    event.on = function (name, listener) {
        var l = listenerByName.get(name), i;
        if (arguments.length < 2) return l && l.on;
        if (l) {
            l.on = null;
            listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1));
            listenerByName.remove(name);
        }
        if (listener) listeners.push(listenerByName.set(name, {on: listener}));
        return dispatch;
    };
    return event;
}

/**
 * Internal function of d3
 * @param target
 */
function d3_eventDispatch(target) {
    var dispatch = d3.dispatch(), i = 0, n = arguments.length;
    while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
    dispatch.of = function (thiz, argumentz) {
        return function (e1) {
            var e0;
            try {
                e0 = e1.sourceEvent = d3.event;
                e1.target = target;
                d3.event = e1;
                dispatch[e1.type].apply(thiz, argumentz);
            } finally {
                d3.event = e0;
            }
        };
    };
    return dispatch;
}

/**
 * Double click behavior
 */
d3.behavior.doubleClick = function () {
    var event = d3_eventDispatch(strangeBehavior, "dblclick");

    function strangeBehavior(selection) {
        selection.each(function (i) {
            var dispatch = event.of(this, arguments);
            d3.select(this).on("dblclick", clicked);
            function clicked() {
                dispatch({
                    "type": "dblclick"
                });
            }
        });
    }

    return d3.rebind(strangeBehavior, event, "on");
};