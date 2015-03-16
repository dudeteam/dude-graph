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

    showError: function (message) {
        this.$.error.text = message;
        this.$.error.show();
    },

    /**
     * Create the graph when its config and data are loaded.
     */
    createGraph: function () {
        var paper = Snap(this.$.graph);
        var graph = new cg.Graph();
        var loader = new cg.JSONLoader();
        var saver = new cg.JSONSaver();
        var renderer = new cg.Renderer(paper);
        loader.on("error", function (error) { this.showError(error.message); }.bind(this));
        saver.on("error", function (error) { this.showError(error); }.bind(this));
        graph.on("error", function (error) { this.showError(error); }.bind(this));
        renderer.on("picker.edit", function (picker) {
            var value = prompt("New value: ");
            if (picker.model.valueType === "vec2" || picker.model.valueType === "vec3") {
                value = value.split(" ");
            }
            picker.value = value;
        });
        renderer.initialize(graph, this.config);
        loader.load(graph, this.data);
        renderer.render(graph);
        jwerty.key('A', function () {
            var _id = graph.getNextBlockId();
            var modelName = prompt("model");
            var model = graph.getModel(modelName);
            if (model === undefined) {
                alert("Undefined model " + modelName + ".");
            } else {
                var action = new cg.Block(_id, model, renderer._mousePosition.clone());
                graph.addNode(action, graph);
            }
        });
        jwerty.key('G', function () {
            var _id = graph.getNextGroupId();
            renderer.createGroup(_id, prompt("name"));
        });
        jwerty.key('X', function () {
            renderer.removeSelectedNodes();
        });
        window.graph = graph;
        window.renderer = renderer;
        window.loader = loader;
        window.saver = saver;
    },

    /**
     * Load config and data then call createGraph().
     */
    ready: function () {
        this.addTheme(this.theme);
        this.$.config.addEventListener("core-complete", function () {
            this.config = this.$.config.response;
            if (this.data !== null) {
                this.createGraph();
            }
        }.bind(this));
        this.$.data.addEventListener("core-complete", function () {
            this.data = this.$.data.response;
            if (this.config !== null) {
                this.createGraph();
            }
        }.bind(this));
    }
});