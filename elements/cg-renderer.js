Polymer({
    publish: {

        /**
         * This is the url of the graph data to load.
         * @attribute url
         * @type {String}
         */
        graphUrl: null

    },
    data: null,
    config: null,

    handleErrors: function () {
        this.loader.on("error", function (error) { this.fire("error", {error: error}); }.bind(this));
        this.saver.on("error", function (error) { this.fire("error", {error: error}); }.bind(this));
        this.graph.on("error", function (error) { this.fire("error", {error: error}); }.bind(this));
        this.renderer.on("error", function (error) { this.fire("error", {error: error}); }.bind(this));
    },

    createGroup: function (name) {
        var _id = graph.getNextGroupId();
        renderer.createSmartGroup(_id, name);
    },

    createBlock: function (name, position) {
        var _id = this.graph.getNextBlockId();
        var model = this.graph.getModel(name);
        if (model !== undefined) {
            this.graph.addEntity(new cg.Block(_id, model, position), this.graph);
        } else {
            this.fire("error", {error: new pandora.Exception("Model {0} not found", name)});
        }
    },

    removeSelection: function () {
        this.renderer.removeSelection();
    },

    zoomToFit: function () {
        this.renderer.zoomToFit();
    },


    /**
     * Create the graph when its config and data are loaded.
     * @private
     */
    _createGraph: function () {
        this.graph = new cg.Graph();
        this.loader = new cg.JSONLoader();
        this.saver = new cg.JSONSaver();
        this.renderer = new cg.Renderer(this.graph, this.$.svg, this.config);
        window.graph = this.graph;
        window.renderer = this.renderer;
        window.loader = this.loader;
        window.saver = this.saver;
        this.handleErrors();
        this.renderer.on("picker.edit", function (picker) {
            this.fire("picker.edit", {picker: picker});
        }.bind(this));
        this.loader.load(this.graph, this._graphData);
        this.renderer.render();
    },

    /**
     * Load the graph data from an external JSON file.
     * @private
     */
    _loadGraph: function () {
        this._graphData = this.$.graphData.response;
        if (this.config !== null) {
            this._createGraph();
        }
    },

    ready: function () {
        this.addEventListener("dude-config-ready", function () {
            if (this._graphData !== undefined) {
                this._createGraph();
            }
        });
    }
});