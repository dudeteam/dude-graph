cg.Zoom = (function () {

    function Zoom() {

        /**
         * Paper reference
         * @type {Snap.Element}
         * @private
         */
        this._paper = null;

        this._zoom = 1;

        this._pan = [0, 0];

    }

    Zoom.prototype.init = function (paper) {


        console.log(paper.node.childNodes);


    };

    return Zoom;

})();