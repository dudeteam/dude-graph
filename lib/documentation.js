/*
 * This file must not be compiled
 * It is used as a placeholder for type documentation
 * and auto completion for IntelliJ/WebStorm
 */

cg.Point.isOutput = true;
cg.RendererBlock = {"type": "block", "id": "", "parent": cg.RendererGroup, "cgBlock": cg.Block, "rendererPoints": [cg.RendererPoint], "position": [0, 0], "size": [0, 0]};
cg.RendererGroup = {"type": "group", "id": "", "parent": cg.RendererGroup, "children": [cg.RendererNode], "position": [0, 0], "size": [0, 0]};
cg.RendererNode = {"type": "block"|"group", "id": "", "parent": cg.RendererGroup, "position": [0, 0], "size": [0, 0]};
cg.RendererPoint = {"type": "point", "rendererBlock": cg.RendererBlock, "cgPoint": cg.Point, "index": 0, "isOutput": true};
cg.d3Nodes = d3.selection();
cg.d3Blocks = d3.selection();
cg.d3Groups = d3.selection();
cg.d3Selection = d3.selection();
cg.d3GroupedSelection = d3.selection();
cg._rendererBlocks = d3.selection();
cg._rendererGroups = d3.selection();
d3.selection.prototype.datum = function(datum) {};
