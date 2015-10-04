/**
 * Creates d3Blocks with the existing rendererBlocks
 * @private
 */
cg.Renderer.prototype._createD3Blocks = function () {
    var renderer = this;
    renderer._renderBlockCreators = {
        Variable: this._variableBlockCreator,
        Value: this._variableBlockCreator
    };
    renderer._renderBlockUpdaters = {
        Variable: this._variableBlockUpdater,
        Value: this._variableBlockUpdater
    };
    renderer._pointPositionGetters = {
        Variable: function (rendererPoint, offsetX, offsetY) {
            return [
                offsetX + rendererPoint.rendererBlock.size[0] - this._config.block.padding,
                offsetY + this._config.block.header / 2
            ];
        },
        Value: function (rendererPoint, offsetX, offsetY) {
            return [
                offsetX + rendererPoint.rendererBlock.size[0] - this._config.block.padding,
                offsetY + this._config.block.header / 2
            ];
        }
    };
    this.d3Blocks
        .data(this._rendererBlocks, function (rendererBlock) {
            var nbPoints = Math.max(rendererBlock.cgBlock.cgInputs.length, rendererBlock.cgBlock.cgOutputs.length);
            rendererBlock.size = [
                renderer._config.block.size[0],
                nbPoints * renderer._config.point.height + renderer._config.block.header
            ];
            return rendererBlock.id;
        })
        .enter()
        .append("svg:g")
        .attr("id", function (rendererBlock) {
            return renderer._getRendererNodeUniqueID(rendererBlock);
        })
        .classed("cg-block", true)
        .call(this._dragRendererNodeBehavior())
        .call(this._removeRendererNodeFromParentBehavior())
        .each(function (rendererBlock) {
            d3.select(this).classed("cg-" + pandora.typename(rendererBlock.cgBlock).toLowerCase(), true);
            var creator = renderer._renderBlockCreators[pandora.typename(rendererBlock.cgBlock)];
            if (creator !== undefined) {
                creator.call(this, renderer);
            } else {
                renderer._defaultBlockCreator.call(this, renderer);
            }
        });
    // BUG: getBBox returns 0 when the d3Blocks are not yet rendered
    setTimeout(this._updateD3Blocks.bind(this), 10);
};

cg.Renderer.prototype._defaultBlockCreator = function (renderer) {
    var d3Block = d3.select(this);
    d3Block
        .append("svg:rect")
        .attr("rx", function () {
            return renderer._config.block.borderRadius || 0;
        })
        .attr("ry", function () {
            return renderer._config.block.borderRadius || 0;
        });
    d3Block
        .append("svg:text")
        .classed("cg-title", true)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "text-before-edge");
    d3Block
        .append("svg:g")
        .classed("cg-points", true);
    renderer._createD3Points(d3Block.select(".cg-points"));
};

cg.Renderer.prototype._variableBlockCreator = function (renderer) {
    var d3Block = d3.select(this);
    d3Block
        .append("svg:rect")
        .attr("rx", function () {
            return renderer._config.block.header / 2;
        })
        .attr("ry", function () {
            return renderer._config.block.header / 2;
        });
    d3Block
        .append("svg:text")
        .classed("cg-title", true)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "text-before-edge");
    d3Block
        .append("svg:g")
        .classed("cg-points", true);
    var createdD3Points = d3Block
        .selectAll(".cg-output, .cg-input")
        .data(function (rendererBlock) {
            return rendererBlock.rendererPoints;
        }, function (rendererPoint) {
            return rendererPoint.cgPoint.cgName;
        })
        .enter()
        .append("svg:g")
        .attr("class", function (rendererPoint) {
            return "cg-" + (rendererPoint.isOutput ? "output" : "input");
        })
        .each(function () {
            renderer._createD3PointShapes(d3.select(this));
        });
    renderer._variableBlockPointUpdater(createdD3Points);
};

/**
 * Updates all d3Blocks
 * @private
 */
cg.Renderer.prototype._updateD3Blocks = function () {
    this._updateSelectedD3Blocks(this.d3Blocks);
};

/**
 * Updates selected d3Blocks
 * @param {d3.selection} updatedD3Blocks
 * @private
 */
cg.Renderer.prototype._updateSelectedD3Blocks = function (updatedD3Blocks) {
    var renderer = this;
    updatedD3Blocks.each(function (rendererBlock) {
        var updater = renderer._renderBlockUpdaters[pandora.typename(rendererBlock.cgBlock)];
        if (updater !== undefined) {
            updater.call(this, renderer);
        } else {
            renderer._defaultBlockUpdater.call(this, renderer);
        }
    });
};

cg.Renderer.prototype._defaultBlockUpdater = function (renderer) {
    var d3Block = d3.select(this);
    d3Block
        .select("text")
        .text(function (rendererBlock) {
            return rendererBlock.cgBlock.cgName;
        });
    d3Block
        .each(function (rendererBlock) {
            return renderer._computeRendererBlockSize(rendererBlock);
        });
    d3Block
        .attr("transform", function (rendererBlock) {
            return "translate(" + rendererBlock.position + ")";
        });
    d3Block
        .select("rect")
        .attr("width", function (rendererBlock) {
            return rendererBlock.size[0];
        })
        .attr("height", function (rendererBlock) {
            return rendererBlock.size[1];
        });
    d3Block
        .select("text")
        .attr("transform", function (block) {
            return "translate(" + [block.size[0] / 2, renderer._config.block.padding] + ")";
        });
    renderer._updateSelectedD3Points(d3Block.select(".cg-points").selectAll(".cg-output, .cg-input"));
};

cg.Renderer.prototype._variableBlockUpdater = function (renderer) {
    var d3Block = d3.select(this);
    d3Block
        .select("text")
        .text(function (rendererBlock) {
            return rendererBlock.cgBlock.cgName;
        });
    d3Block
        .each(function (rendererBlock) {
            return renderer._computeRendererBlockSize(rendererBlock);
        });
    d3Block
        .attr("transform", function (rendererBlock) {
            return "translate(" + rendererBlock.position + ")";
        });
    d3Block
        .select("rect")
        .attr("width", function (rendererBlock) {
            return rendererBlock.size[0];
        })
        .attr("height", function (rendererBlock) {
            return renderer._config.block.header;
        });
    d3Block
        .select("text")
        .attr("transform", function (block) {
            return "translate(" + [block.size[0] / 2, renderer._config.block.padding] + ")";
        });
    renderer._variableBlockPointUpdater(d3Block.select(".cg-points").selectAll(".cg-output, .cg-input"));
};

cg.Renderer.prototype._variableBlockPointUpdater = function (updatedD3Points) {
    var renderer = this;
    updatedD3Points
        .classed("cg-empty", function (rendererPoint) {
            return renderer._getRendererPointRendererConnections(rendererPoint).length === 0;
        })
        .classed("cg-stream", function (rendererPoint) {
            return pandora.typename(rendererPoint.cgPoint) === "Stream";
        })
        .attr("transform", function (rendererPoint) {
            return "translate(" + renderer._getRendererPointPosition(rendererPoint, true) + ")";
        });
};

/**
 * Removes d3Blocks when rendererBlocks are removed
 * @private
 */
cg.Renderer.prototype._removeD3Blocks = function () {
    var removedRendererBlocks = this.d3Blocks
        .data(this._rendererBlocks, function (rendererBlock) {
            return rendererBlock.id;
        })
        .exit()
        .remove();
};