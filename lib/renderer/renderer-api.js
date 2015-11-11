//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * Zooms to best fit all renderNodes
 */
dudeGraph.Renderer.prototype.zoomToFit = function () {
    this._zoomToBoundingRect(this.renderNodesBoundingRect(this._renderBlocks.concat(this._renderGroups)));
};

/**
 * Zooms to best fit the selected renderNodes
 */
dudeGraph.Renderer.prototype.zoomToSelection = function () {
    if (!_.isEmpty(this._selectedRenderNodes)) {
        this._zoomToBoundingRect(this.renderNodesBoundingRect(this._selectedRenderNodes));
    }
};

/**
 * Select all the renderNodes
 * @param {Boolean?} ignoreBlocks - Whether to not select all blocks
 * @param {Boolean?} ignoreGroups - Whether to not select all groups
 */
dudeGraph.Renderer.prototype.selectAll = function (ignoreBlocks, ignoreGroups) {
    this._clearSelection();
    if (!ignoreBlocks) {
        this._addSelection(this._renderBlocks);
    }
    if (!ignoreGroups) {
        this._addSelection(this._renderGroups);
    }
};