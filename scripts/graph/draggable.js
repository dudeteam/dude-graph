Raphael.st.draggable = function(onMove, onStart, onEnd) {
    var self = this,
        lx = 0,
        ly = 0,
        ox = 0,
        oy = 0,
        moveFnc = function(dx, dy) {
            if (onMove === undefined || onMove()) {
                lx = dx + ox;
                ly = dy + oy;
                self.transform('t' + lx + ',' + ly);
            }
        },
        startFnc = function() {
            onStart && onStart();
        },
        endFnc = function() {
            ox = lx;
            oy = ly;
            onEnd && onEnd();
        };

    this.drag(moveFnc, startFnc, endFnc);
};
