Polymer({
    get renderer() {
        return this.$.renderer.getDistributedNodes()[0];
    },
    showError: function (error) {
        this.$.error.text = error.message;
        this.$.error.show();
    },
    createGroup: function () {
        this.renderer.createGroup("test");
    },
    createAction: function () {
        this.renderer.createAction("mix", new pandora.Vec2(50, 50));
    },
    addGroup: function () {
        this.$.groupDialog.open();
    },
    addAction: function () {
        //this.modelList = this.graph.findModels();
        this.$.actionDialog.open();
    },
    removeSelectedNodes: function () {
        this.renderer.removeSelectedNodes();
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

        jwerty.key('alt+A', this.addAction.bind(this));
        jwerty.key('alt+G', this.addGroup.bind(this));
        jwerty.key('alt+X', this.removeSelectedNodes.bind(this));
    }
});