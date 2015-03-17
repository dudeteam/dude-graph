Polymer({
    activeBar: "tool",
    get renderer() {
        return this.$.renderer.getDistributedNodes()[0];
    },
    runCommand: function (event, detail) {
        if (this[detail.command] === undefined) {
            console.warn("Command " + detail.command + " doesnt exists");
            return;
        }
        this[detail.command]();
    },
    addGroup: function () {
        this.activeBar = "group";
    },
    addBlock: function () {
        //this.modelList = this.graph.findModels();
        this.$.blockDialog.open();
    },
    removeSelectedNodes: function () {
        this.renderer.removeSelectedNodes();
    },
    createGroup: function () {
        this.renderer.createGroup(this.groupTitle);
        this.activeBar = "tool";
        this.groupTitle = "";
    },
    createBlock: function () {
        this.renderer.createBlock("mix", new pandora.Vec2(50, 50));
    },
    showError: function (error) {
        this.$.error.text = error.message;
        this.$.error.show();
    },
    attached: function () {
        this.renderer.addEventListener("error", function (e) {
            this.showError(e.detail.error);
        }.bind(this));
        this.renderer.addEventListener("picker.edit", function (e) {
            console.log("edit picker", e.detail.picker);
        });
        this.$.groupDialog.addEventListener("core-overlay-close-completed", function () {
            this.groupTitle = "";
        }.bind(this));

        jwerty.key('alt+A', this.addBlock.bind(this));
        jwerty.key('alt+G', this.addGroup.bind(this));
        jwerty.key('alt+X', this.removeSelectedNodes.bind(this));
    }
});