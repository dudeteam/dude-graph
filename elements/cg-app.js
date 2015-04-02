Polymer({
    activeBar: "tool",
    showToolbar: function () {
        this.activeBar = 'tool';
    },
    runCommand: function (event, detail) {
        if (this[detail.name] === undefined) {
            console.warn("Command " + detail.name + " doesn't exist");
            return;
        }
        this[detail.name](detail);
    },
    root: function() {
        this.$.toolbar.reset();
    },
    openGroup: function () {
        this.$.toolbar.state = "group";
    },
    openBlock: function () {
        this.$.toolbar.state = "block";
    },
    removeSelection: function () {
        this.$.renderer.removeSelection();
    },
    zoomToFit: function() {
        this.$.renderer.zoomToFit();
    },
    createGroup: function (detail) {
        this.$.renderer.createGroup(detail.value);
        this.$.toolbar.reset();
    },
    createBlock: function () {
        console.log("create block");
        //this.$.renderer.createBlock("mix", new pandora.Vec2(50, 50));
        this.$.toolbar.reset();
    },
    showError: function (error) {
        this.$.error.text = error.message;
        this.$.error.show();
    },
    attached: function () {
        this.$.renderer.addEventListener("error", function (e) {
            this.showError(e.detail.error);
        }.bind(this));
        this.$.renderer.addEventListener("picker.edit", function (e) {
            console.log("edit picker", e.detail.picker);
        });
        jwerty.key('alt+B', this.openBlock.bind(this));
        jwerty.key('alt+G', this.openGroup.bind(this));
        jwerty.key('alt+X', this.removeSelection.bind(this));
    }
});