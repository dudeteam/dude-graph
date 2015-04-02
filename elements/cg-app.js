Polymer({
    activeBar: "tool",
    showToolbar: function () {
        this.activeBar = 'tool';
    },
    runCommand: function (event, detail) {
        console.log(event, detail)
        if (this[detail.name] === undefined) {
            console.warn("Command " + detail.name + " doesn't exist");
            return;
        }
        this[detail.name]();
    },
    root: function() {
        this.$.toolbar.reset();
    },
    addGroup: function () {
        this.$.toolbar.state = "addGroup";
    },
    addBlock: function () {
        this.activeBar = "block";
    },
    removeSelection: function () {
        this.$.renderer.removeSelection();
    },
    zoomToFit: function() {
        this.$.renderer.zoomToFit();
    },
    createGroup: function () {
        this.$.renderer.createGroup(this.groupTitle);
        this.activeBar = "tool";
        this.groupTitle = "";
    },
    createBlock: function () {
        this.$.renderer.createBlock("mix", new pandora.Vec2(50, 50));
    },
    showError: function (error) {
        this.$.error.text = error.message;
        this.$.error.show();
    },
    attached: function () {
        this.styleUrl = "themes/" + this.theme + "/app.css";
        this.$.renderer.addEventListener("error", function (e) {
            this.showError(e.detail.error);
        }.bind(this));
        this.$.renderer.addEventListener("picker.edit", function (e) {
            console.log("edit picker", e.detail.picker);
        });
        jwerty.key('alt+A', this.addBlock.bind(this));
        jwerty.key('alt+G', this.addGroup.bind(this));
        jwerty.key('alt+X', this.removeSelection.bind(this));
    }
});