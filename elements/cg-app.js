Polymer({
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
    hideSidebar: function () {
        this.$.sidebar.setAttribute("hidden", "");
    },
    openGroup: function () {
        this.$.toolbar.state = "group";
    },
    openAction: function () {
        this.$.toolbar.state = "action";
        this.$.sidebar.removeAttribute("hidden");
    },
    openPicker: function () { this.$.toolbar.state = "picker"; },
    removeSelection: function () {
        this.$.renderer.removeSelection();
    },
    zoomToFit: function() {
        this.$.renderer.zoomToFit();
    },
    createGroup: function (detail) {
        this.$.renderer.createGroup(detail.value);
    },
    createAction: function (detail) {
        this.$.renderer.createBlock(detail.value, new pandora.Vec2(50, 50));
    },
    createPicker: function () {
        console.log("TODO: add a picker or getter");
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
        jwerty.key('alt+G', this.openGroup.bind(this));
        jwerty.key('alt+A', this.openAction.bind(this));
        jwerty.key('alt+P', this.openPicker.bind(this));
        jwerty.key('alt+X', this.removeSelection.bind(this));
    }
});