Polymer({
    publish: {

        /**
         * This is the url of the graph data to load. If you create the graph like so
         * <cg-graph graphUrl="path/to/graph.json"></cg-graph> the graph will be loaded from the given url.
         *
         * @attribute url
         * @type {String}
         */
        graphUrl: null,

        /**
         * This is the url of a config file that contain all the custom settings of the graph for a given theme that
         * cannot be given by the stylesheet.
         */
        configUrl: null
    },
    data: null,
    config: null,

    handleErrors: function () {
        this.loader.on("error", function (error) { this.fire("error", {error: error}); }.bind(this));
        this.saver.on("error", function (error) { this.fire("error", {error: error}); }.bind(this));
        this.graph.on("error", function (error) { this.fire("error", {error: error}); }.bind(this));
        this.renderer.on("error", function (error) { this.fire("error", {error: error}); }.bind(this));
    },

    removeSelectedNodes: function () {
        this.renderer.removeSelection();
    },

    createGroup: function (title) {
        var _id = graph.getNextGroupId();
        renderer.createGroup(_id, title);
    },

    createBlock: function (name, position) {
        var _id = this.graph.getNextBlockId();
        var model = this.graph.getModel(name);
        this.graph.addNode(new cg.Block(_id, model, position), this.graph);
    },

    /**
     * Create the graph when its config and data are loaded.
     */
    createGraph: function () {
        this.graph = new cg.Graph();
        this.loader = new cg.JSONLoader();
        this.saver = new cg.JSONSaver();
        this.renderer = new cg.Renderer(this.graph, this.$.svg, this.config);
        window.graph = this.graph;
        window.renderer = this.renderer;
        window.loader = this.loader;
        window.saver = this.saver;
        this.handleErrors();
        this.addStyle(this.styleUrl);
        this.renderer.on("picker.edit", function (picker) {
            this.fire("picker.edit", {picker: picker});
        }.bind(this));
        this.loader.load(this.graph, this.data);
        this.renderer.render();
    },

    /**
     * Load config and data then call createGraph().
     */
    ready: function () {
        this.$.config.addEventListener("core-complete", function () {
            this.config = this.$.config.response;
            if (this.data !== null) {
                this.createGraph();
            }
        }.bind(this));
        this.$.config.go();
        this.$.data.addEventListener("core-complete", function () {
            this.data = this.$.data.response;
            if (this.config !== null) {
                this.createGraph();
            }
        }.bind(this));
        this.$.data.go();
    }
});