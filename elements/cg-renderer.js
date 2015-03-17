Polymer({
    publish: {

        /**
         * This is the url of the graph data to load. If you create the graph like so
         * <cg-graph url="path/to/graph.json"></cg-graph> the graph will be loaded from the given url.
         *
         * @attribute url
         * @type {String}
         */
        url: null,

        /**
         * This is the theme to apply on this graph. A theme is composed of 2 files, the config and the
         * stylesheet. All themes are stored in CodeGraph's themes/ folder. If you create the graph like so
         * <cg-graph url="graph.json" theme="dude"></cg-graph> the files themes/dude.json and themes/dude.css
         * will be loaded.
         *
         * @attribute theme
         * @type {String}
         * @default "default"
         */
        theme: "default"
    },
    data: null,
    config: null,

    /**
     * Dynamically load a theme to apply on the graph.
     * @param name {String} the name of the theme to apply
     */
    addTheme: function (name) {
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = '../themes/' + name + '.css';
        this.shadowRoot.appendChild(link);
        this.element.convertSheetsToStyles(this.shadowRoot);
    },

    handleErrors: function () {
        this.loader.on("error", function (error) { this.fire("error", {error: error}); }.bind(this));
        this.saver.on("error", function (error) { this.fire("error", {error: error}); }.bind(this));
        this.graph.on("error", function (error) { this.fire("error", {error: error}); }.bind(this));
    },

    removeSelectedNodes: function () {
        this.renderer.removeSelectedNodes();
    },

    createGroup: function (title) {
        var _id = graph.getNextGroupId();
        renderer.createGroup(_id, title);
    },

    createAction: function (name, position) {
        var _id = this.graph.getNextBlockId();
        var model = this.graph.getModel(name);
        this.graph.addNode(new cg.Block(_id, model, position), this.graph);
    },

    /**
     * Create the graph when its config and data are loaded.
     */
    createGraph: function () {
        this.renderer.on("picker.edit", function (picker) {
            this.fire("picker.edit", {picker: picker});
        }.bind(this));
        this.renderer.initialize(this.graph, this.config);
        this.loader.load(this.graph, this.data);
        this.renderer.render(this.graph);
    },

    /**
     * Load config and data then call createGraph().
     */
    ready: function () {
        this.paper = Snap(this.$.graph);
        this.graph = new cg.Graph();
        this.loader = new cg.JSONLoader();
        this.saver = new cg.JSONSaver();
        this.renderer = new cg.Renderer(this.paper);

        // For debug
        window.graph = this.graph;
        window.renderer = this.renderer;
        window.loader = this.loader;
        window.saver = this.saver;

        this.handleErrors();
        this.addTheme(this.theme);
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