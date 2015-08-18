/*
 * This file must not be included in the build system
 * It is used as a placeholder for type documentation
 * and auto completion for IntelliJ/WebStorm
 */

cg.Point.cgValueType = {};
cg.Point.cgValue = {};
cg.Point.cgConnections = [];
cg.Point.isOutput = true;

cg.RendererBlock = {"type": "block", "id": "", "parent": cg.RendererGroup, "cgBlock": cg.Block, "rendererPoints": [cg.RendererPoint], "position": [0, 0], "size": [0, 0]};
cg.RendererGroup = {"type": "group", "id": "", "parent": cg.RendererGroup, "children": [cg.RendererNode], "position": [0, 0], "size": [0, 0]};
cg.RendererNode = {"type": "block"|"group", "id": "", "parent": cg.RendererGroup, "rendererPoints": Array, "position": [0, 0], "size": [0, 0]};
cg.RendererPoint = {"type": "point", "rendererBlock": cg.RendererBlock, "cgPoint": cg.Point, "index": 0, "isOutput": true};
cg.RendererConnection = {"outputRendererPoint": cg.RendererPoint, "inputRendererPoint": cg.RendererPoint};

cg._rendererBlocks = [];
cg._rendererGroups = [];
cg._rendererConnections = [];
cg._renderBlockFunctions = {};

cg.d3Nodes = d3.selection();
cg.d3Blocks = d3.selection();
cg.d3Groups = d3.selection();
cg.d3Selection = d3.selection();
cg.d3GroupedSelection = d3.selection();

d3.selection.prototype.select = function(selectQuery) {};
d3.selection.prototype.selectAll = function(selectQuery) {};
d3.selection.prototype.datum = function(datum) {};
d3.selection.prototype.data = function(data) {};
d3.selection.prototype.classed = function(classname, active) {};
d3.selection.prototype.each = function(fn) {};
d3.selection.prototype.attr = function(attr, value) {};
