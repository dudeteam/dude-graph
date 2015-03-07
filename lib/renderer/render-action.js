/**
 * Render the action.
 * @param action {cg.Action}
 * @private
 */
cg.Renderer.prototype._renderAction = function (action) {
    var actionGroup = this._actionLayer.g();
    this._dataBinding(action, actionGroup);
    actionGroup.data('action', action);
    actionGroup.addClass("action");
    actionGroup.addClass("action-" + action.model.type);
    var actionRect = actionGroup.rect(0, 0, this._config.action["min-width"], 40 + action.height * 20, this._config.action["border-radius"]);
    var actionText = actionGroup.text(actionRect.getBBox().width / 2, 20, action.name);
    actionText.addClass("title");
    if (action.model.type === "getter") {
        actionRect.attr("stroke", "#e5678d");
        actionText.attr("fill", "#e5678d");
    }
    action.data.computedWidth = actionGroup.getBBox().width;
    for (var inputName in action.inputs) {
        if (action.inputs.hasOwnProperty(inputName)) {
            this.render(action.inputs[inputName], actionGroup);
        }
    }
    for (var outputName in action.outputs) {
        if (action.outputs.hasOwnProperty(outputName)) {
            this.render(action.outputs[outputName], actionGroup);
        }
    }
    action.on("move", this._updateAction.bind(this, action, actionGroup));
    this._updateAction(action, actionGroup);
    this._dragNode(action, actionGroup);
    return actionGroup;
};

/**
 * Update the action position.
 * @param action
 * @param actionGroup
 * @private
 */
cg.Renderer.prototype._updateAction = function (action, actionGroup) {
    actionGroup.transform("T" + action.absolutePosition().toArray());
};