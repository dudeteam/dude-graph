/*
 * This file must not be included in the build system
 * It is used as a placeholder for type documentation
 * and auto completion for IntelliJ/WebStorm
 */
throw new Error("`documentation.js` must not to be bundled");

dudeGraph.d3Nodes = d3.selection();
dudeGraph.d3Blocks = d3.selection();
dudeGraph.d3Groups = d3.selection();
dudeGraph.d3Selection = d3.selection();
dudeGraph.d3GroupedSelection = d3.selection();

d3.selection.prototype.append = function (element) {};
d3.selection.prototype.select = function (selectQuery) {};
d3.selection.prototype.selectAll = function (selectQuery) {};
d3.selection.prototype.datum = function (datum) {};
d3.selection.prototype.data = function (data) {};
d3.selection.prototype.classed = function (classname, active) {};
d3.selection.prototype.each = function (fn) {};
d3.selection.prototype.attr = function (attr, value) {};
d3.selection.prototype.remove = function () {};
d3.selection.prototype.text = function () {};

SVGElement.prototype.createSVGPoint = function () {};
SVGElement.prototype.getCTM = function () {};
SVGPoint = {"x": 0, "y": 0};
SVGPoint.prototype.matrixTransform = function () {};
SVGGElement = SVGElement;
SVGTextElement = {};
SVGTextElement.prototype = SVGElement;
SVGTextElement.prototype.textContent = "";
