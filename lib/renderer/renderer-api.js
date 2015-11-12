//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * Zooms to best fit all renderNodes
 */
dudeGraph.Renderer.prototype.zoomToFit = function () {
    var boundingRect = this.renderNodesBoundingRect(this._renderBlocks.concat(this._renderGroups));
    this._zoomToBoundingBox({
        "x": boundingRect[0][0] - this._config.zoom.margin[0] / 2,
        "y": boundingRect[0][1] - this._config.zoom.margin[1] / 2,
        "width": boundingRect[1][0] + this._config.zoom.margin[0],
        "height": boundingRect[1][1] + this._config.zoom.margin[1]
    });
};

/**
 * Zooms to best fit the selected renderNodes
 */
dudeGraph.Renderer.prototype.zoomToSelection = function () {
    if (!_.isEmpty(this._selectedRenderNodes)) {
        var boundingRect = this.renderNodesBoundingRect(this._selectedRenderNodes);
        this._zoomToBoundingBox({
            "x": boundingRect[0][0] - this._config.zoom.margin[0] / 2,
            "y": boundingRect[0][1] - this._config.zoom.margin[1] / 2,
            "width": boundingRect[1][0] + this._config.zoom.margin[0],
            "height": boundingRect[1][1] + this._config.zoom.margin[1]
        });
    }
};

/**
 * Select all the renderNodes
 * @param {Boolean?} ignoreBlocks - Whether to not select all blocks
 * @param {Boolean?} ignoreGroups - Whether to not select all groups
 */
dudeGraph.Renderer.prototype.selectAll = function (ignoreBlocks, ignoreGroups) {
    this.clearSelection();
    if (!ignoreBlocks) {
        this.addSelection(this._renderBlocks);
    }
    if (!ignoreGroups) {
        this.addSelection(this._renderGroups);
    }
};