//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

dudeGraph.Renderer.prototype.zoomToFit = function () {
    this._zoomToBoundingBox(this._rendererNodesBoundingBox(this._renderBlocks.concat(this._renderGroups)));
};

dudeGraph.Renderer.prototype.zoomToSelection = function () {

};