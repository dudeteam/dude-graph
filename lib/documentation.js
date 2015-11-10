/*
 * This file must not be included in the build system
 * It is used as a placeholder for type documentation
 * and auto completion for IntelliJ/WebStorm
 */
throw new Error("`documentation.js` must not to be bundled");

dudeGraph.Block = {"cgId": ""};
dudeGraph.Point = {"cgName": "", "cgValueType": "", "cgValue": {}, cgConnections: [], singleConnection: true, isOutput: true};
dudeGraph.Connection = {"cgOutputPoint": dudeGraph.Point, "cgInputPoint": dudeGraph.Point};

// dudeGraph.RenderBlock = {"type": "block", "id": "", "parent": dudeGraph.RendererGroup, "cgBlock": dudeGraph.Block, "rendererPoints": [dudeGraph.RendererPoint], "position": [0, 0], "size": [0, 0]};
// dudeGraph.RenderGroup = {"type": "group", "id": "", "parent": dudeGraph.RendererGroup, "children": [dudeGraph.RendererNode], "position": [0, 0], "size": [0, 0]};
// dudeGraph.RenderNode = {"type": "block" || "group", "id": "", "parent": dudeGraph.RendererGroup, "rendererPoints": Array, "position": [0, 0], "size": [0, 0]};
// dudeGraph.RenderPoint = {"type": "point", "index": 0, "isOutput": true, "rendererBlock": dudeGraph.RendererBlock, "cgPoint": dudeGraph.Point};
dudeGraph.RenderConnection = {"cgConnection": dudeGraph.Connection, "outputRendererPoint": dudeGraph.RendererPoint, "inputRendererPoint": dudeGraph.RendererPoint};

dudeGraph.d3Nodes = d3.selection();
dudeGraph.d3Blocks = d3.selection();
dudeGraph.d3Groups = d3.selection();
dudeGraph.d3Selection = d3.selection();
dudeGraph.d3GroupedSelection = d3.selection();

d3.selection.prototype.append = function(element) {};
d3.selection.prototype.select = function(selectQuery) {};
d3.selection.prototype.selectAll = function(selectQuery) {};
d3.selection.prototype.datum = function(datum) {};
d3.selection.prototype.data = function(data) {};
d3.selection.prototype.classed = function(classname, active) {};
d3.selection.prototype.each = function(fn) {};
d3.selection.prototype.attr = function(attr, value) {};
d3.selection.prototype.remove = function() {};

Element.createSVGPoint = function() {};
SVGPoint = {"x": 0, "y": 0};
SVGGElement = SVGElement;