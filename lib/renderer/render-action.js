var ACTION_MIN_WIDTH = 250;
var ACTION_BORDER_RADIUS = 5;

/**
 * Render the action.
 * @param action {cg.Action}
 * @param element {Object}
 * @private
 */
cg.Renderer.prototype._renderAction = function (action, element) {
    var actionGroup = element.g();
    this._dataBinding(action, actionGroup);
    actionGroup.data('action', action);
    actionGroup.addClass("action");
    var actionRect = actionGroup.rect(0, 0, ACTION_MIN_WIDTH, 40 + action.height * 20, ACTION_BORDER_RADIUS);
    actionRect.attr("cursor", "move");
    var actionText = actionGroup.text(actionRect.getBBox().width / 2, 20, action.name);
    actionText.addClass("title");
    actionText.attr({
        "textAnchor": "middle",
        "cursor": "move"
    });
    this._updateAction(action, actionGroup);
    this._dragAction(action, actionGroup);
    return actionGroup;
};

/**
 * Drag the action around.
 * @param action {cg.Action}
 * @param actionGroup {Element}
 * @private
 */
cg.Renderer.prototype._dragAction = function (action, actionGroup) {
    actionGroup.drag(
        function onmove(dx, dy) {
            action.position.x = dx + actionGroup.data("cg.originTransform").x;
            action.position.y = dy + actionGroup.data("cg.originTransform").y;
            action.emit("move");
            this._updateAction(action, actionGroup);
        }.bind(this),
        function onstart(x, y, e) {
            cg.preventCallback(e);
            var graph = this._getNode(this._rootElement);
            if (action.parent !== graph) {
                action.changeParent(graph);
            }
            this._attachRootElement(actionGroup);
            this._updateAction(action, actionGroup);
            actionGroup.data("cg.originTransform", action.position.clone());
        }.bind(this),
        function onend(){
            // TODO: Get the group if any and drop the action within.
        }.bind(this)
    );
};

/**
 * Update the action position.
 * @param action
 * @param actionGroup
 * @private
 */
cg.Renderer.prototype._updateAction = function (action, actionGroup) {
    actionGroup.transform("T" + action.position.toArray());
};