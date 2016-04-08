dudeGraph.ToolbarHelper = (function () {

    var dudeToolbarHelper = {};

    /**
     * Clears the toolbar to circumvent a bug in dude-toolbar
     * @param {DudeInspectorItemElement} panel
     */
    dudeToolbarHelper.clearToolbar = function (panel) {
        panel.$.toolbar.set("commands", []);
    };

    /**
     * @param {DudeInspectorItemElement} panel
     */
    dudeToolbarHelper.saveGraph = function (panel) {
        panel.$.toolbar.addCommand({
            icon: "fa fa-save",
            description: "Save graph",
            shortcut: ["ctrl+s", "meta+s"],
            action: function () {
                panel.get("data").emitSave();
            }
        });
    };

    /**
     * @param {DudeInspectorItemElement} panel
     */
    dudeToolbarHelper.buildGraph = function (panel) {
        panel.$.toolbar.addCommand({
            icon: "fa fa-play",
            description: "Build graph",
            shortcut: ["ctrl+b", "meta+b"],
            action: function () {
                panel.get("data").emitBuild();
            }.bind(this)
        });
    };

    /**
     * @param {DudeInspectorItemElement} panel
     */
    dudeToolbarHelper.createVariable = function (panel) {
        panel.$.toolbar.addCommand({
            icon: "fa fa-cogs",
            description: "Create variable",
            shortcut: ["ctrl+shift+a", "meta+shift+a"],
            action: function () {
                panel.get("inspector").pushStack("dude-graph-create-variable");
            }.bind(this)
        });
    };

    /**
     * @param {DudeInspectorItemElement} panel
     */
    dudeToolbarHelper.zoomToFit = function (panel) {
        panel.$.toolbar.addCommand({
            icon: "fa fa-compress",
            description: "Zoom to fit",
            shortcut: ["ctrl+shift+0", "meta+shift+0"], // TODO: Windows
            action: function () {
                panel.get("data.renderer").zoomToFit();
            }.bind(this)
        });
    };

    /**
     * @param {DudeInspectorItemElement} panel
     */
    dudeToolbarHelper.zoomToSelection = function (panel) {
        panel.$.toolbar.addCommand({
            icon: "fa fa-compress",
            description: "Zoom to selection",
            shortcut: ["ctrl+shift+0", "meta+shift+0"], // TODO: Windows
            action: function () {
                panel.get("data.renderer").zoomToFitSelection();
            }.bind(this)
        });
    };

    /**
     * @param {DudeInspectorItemElement} panel
     */
    dudeToolbarHelper.removeSelection = function (panel) {
        panel.$.toolbar.addCommand({
            icon: "fa fa-trash",
            description: "Remove selection",
            shortcut: ["shift+backspace", "meta+backspace"],
            action: function () {
                panel.get("data.renderer").removeSelection();
            }.bind(this)
        });
    };

    /**
     * @param {DudeInspectorItemElement} panel
     */
    dudeToolbarHelper.groupSelection = function (panel) {
        panel.$.toolbar.addCommand({
            icon: "fa fa-object-group",
            description: "Group selection",
            shortcut: ["ctrl+shift+g", "meta+shift+g"],
            action: function () {
                panel.get("data.renderer").createRenderGroupForSelection("Group");
            }.bind(this)
        });
    };

    return dudeToolbarHelper;

})();