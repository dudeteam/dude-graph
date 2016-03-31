dudeGraph.ToolbarHelper = (function () {

    var dudeToolbarHelper = {};

    /**
     * Clears the toolbar to circumvent a bug in dude-toolbar
     * @param {DudeStackItemElement} panel
     */
    dudeToolbarHelper.clearToolbar = function (panel) {
        panel.$.toolbar.set("commands", []);
    };

    /**
     * @param {DudeStackItemElement} panel
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
     * @param {DudeStackItemElement} panel
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
     * @param {DudeStackItemElement} panel
     */
    dudeToolbarHelper.zoomToFit = function (panel) {
        panel.$.toolbar.addCommand({
            icon: "fa fa-compress",
            description: "Zoom to fit",
            shortcut: ["ctrl+0", "meta+0"],
            action: function () {
                panel.get("data").get("renderer").zoomToFit();
            }.bind(this)
        });
    };

    /**
     * @param {DudeStackItemElement} panel
     */
    dudeToolbarHelper.zoomToSelection = function (panel) {
        panel.$.toolbar.addCommand({
            icon: "fa fa-compress",
            description: "Zoom to selection",
            shortcut: ["ctrl+0", "meta+0"],
            action: function () {
                panel.get("data").get("renderer").zoomToFitSelection();
            }.bind(this)
        });
    };

    /**
     * @param {DudeStackItemElement} panel
     */
    dudeToolbarHelper.removeSelection = function (panel) {
        panel.$.toolbar.addCommand({
            icon: "fa fa-trash",
            description: "Remove selection",
            shortcut: ["ctrl+delete", "meta+backspace"],
            action: function () {
                panel.get("data").get("renderer").removeSelection();
            }.bind(this)
        });
    };

    /**
     * @param {DudeStackItemElement} panel
     */
    dudeToolbarHelper.groupSelection = function (panel) {
        panel.$.toolbar.addCommand({
            icon: "fa fa-object-group",
            description: "Group selection",
            shortcut: ["ctrl+g", "meta+g"],
            action: function () {
                panel.get("data").get("renderer").createRenderGroupForSelection("Group");
            }.bind(this)
        });
    };

    return dudeToolbarHelper;

})();