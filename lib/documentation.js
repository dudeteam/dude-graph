/*
 * This file must not be included in the build system
 * It is used as a placeholder for type documentation
 * and auto completion for IntelliJ/WebStorm
 */

dudeGraph.Block = {"cgId": ""};
dudeGraph.Point = {"cgName": "", "cgValueType": "", "cgValue": {}, cgConnections: [], singleConnection: true, isOutput: true};
dudeGraph.Connection = {"cgOutputPoint": dudeGraph.Point, "cgInputPoint": dudeGraph.Point};

dudeGraph.RendererBlock = {"type": "block", "id": "", "parent": dudeGraph.RendererGroup, "cgBlock": dudeGraph.Block, "rendererPoints": [dudeGraph.RendererPoint], "position": [0, 0], "size": [0, 0]};
dudeGraph.RendererGroup = {"type": "group", "id": "", "parent": dudeGraph.RendererGroup, "children": [dudeGraph.RendererNode], "position": [0, 0], "size": [0, 0]};
dudeGraph.RendererNode = {"type": "block" || "group", "id": "", "parent": dudeGraph.RendererGroup, "rendererPoints": Array, "position": [0, 0], "size": [0, 0]};
dudeGraph.RendererPoint = {"type": "point", "index": 0, "isOutput": true, "rendererBlock": dudeGraph.RendererBlock, "cgPoint": dudeGraph.Point};
dudeGraph.RendererConnection = {"cgConnection": dudeGraph.Connection, "outputRendererPoint": dudeGraph.RendererPoint, "inputRendererPoint": dudeGraph.RendererPoint};

dudeGraph._rendererBlocks = [];
dudeGraph._rendererGroups = [];
dudeGraph._rendererConnections = [];
dudeGraph._renderBlockFunctions = {};

dudeGraph.d3Nodes = d3.selection();
dudeGraph.d3Blocks = d3.selection();
dudeGraph.d3Groups = d3.selection();
dudeGraph.d3Selection = d3.selection();
dudeGraph.d3GroupedSelection = d3.selection();

d3.selection.prototype.select = function(selectQuery) {};
d3.selection.prototype.selectAll = function(selectQuery) {};
d3.selection.prototype.datum = function(datum) {};
d3.selection.prototype.data = function(data) {};
d3.selection.prototype.classed = function(classname, active) {};
d3.selection.prototype.each = function(fn) {};
d3.selection.prototype.attr = function(attr, value) {};

Element.createSVGPoint = function() {};
SVGPoint = {"x": 0, "y": 0};