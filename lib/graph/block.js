//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * Block is the base class of dude-graph nodes
 * A Block has a list of inputs and outputs points
 * @param {dudeGraph.Graph} cgGraph - See Getter definition
 * @param {{cgId: Number, cgTemplates: Object}} data - See getter definition
 * @class
 */
dudeGraph.Block = function (cgGraph, data) {
    data = data || {};

    /**
     * Reference to the graph
     * @type {dudeGraph.Graph}
     */
    Object.defineProperty(this, "cgGraph", {
        get: function () {
            return this._cgGraph;
        }.bind(this)
    });
    this._cgGraph = cgGraph;
    if (!cgGraph) {
        throw new Error("Block() Cannot create a Block without a graph");
    }

    /**
     * The type of this block defined as a string, "Block" by default.
     * @type {String}
     */
    Object.defineProperty(this, "blockType", {
        get: function () {
            return this._blockType;
        }.bind(this)
    });
    this._blockType = this.className;

    /**
     * Unique id of this block
     * @type {String}
     */
    Object.defineProperty(this, "cgId", {
        get: function () {
            return this._cgId;
        }.bind(this)
    });
    this._cgId = data.cgId || cgGraph.nextBlockId();

    /**
     * Block fancy name
     * @type {String}
     * @emit "dude-graph-block-name-changed" {dudeGraph.Block} {String} {String}
     */
    Object.defineProperty(this, "cgName", {
        get: function () {
            return this._cgName;
        }.bind(this),
        set: function (cgName) {
            var oldCgName = this._cgName;
            this._cgName = cgName;
            this._cgGraph.emit("dude-graph-block-name-change", this, oldCgName, cgName);
        }.bind(this)
    });
    this._cgName = data.cgName || this._blockType;

    /**
     * Template types that can be used on this block points. Each template type contains a list of possibly
     * applicable types.
     * @type {Object<String, Array>}
     */
    Object.defineProperty(this, "cgTemplates", {
        get: function () {
            return this._cgTemplates;
        }.bind(this)
    });
    this._cgTemplates = data.cgTemplates || {};

    /**
     * Input points
     * @type {Array<dudeGraph.Point>}
     */
    Object.defineProperty(this, "cgInputs", {
        get: function () {
            return this._cgInputs;
        }.bind(this)
    });
    this._cgInputs = [];

    /**
     * Output points
     * @type {Array<dudeGraph.Point>}
     */
    Object.defineProperty(this, "cgOutputs", {
        get: function () {
            return this._cgOutputs;
        }.bind(this)
    });
    this._cgOutputs = [];
};

dudeGraph.Block.prototype = _.create(Object.prototype, {
    "constructor": dudeGraph.Block,
    "className": "Block"
});

/**
 * Validates the block content
 * Called when the graph adds this block
 */
dudeGraph.Block.prototype.validate = function () {};

/**
 * Adds an input or an output point
 * @param {dudeGraph.Point} cgPoint
 * @emit "cg-point-create" {dudeGraph.Block} {dudeGraph.Point}
 * @return {dudeGraph.Point}
 */
dudeGraph.Block.prototype.addPoint = function (cgPoint) {
    if (cgPoint.cgBlock !== this) {
        throw new Error("Point `" + cgPoint.cgName + "` is not bound to this block `" + this._cgId + "`");
    }
    if (cgPoint.isOutput && this.outputByName(cgPoint.cgName) || !cgPoint.isOutput && this.inputByName(cgPoint.cgName)) {
        throw new Error("Block `" + this._cgId + "` has already an " +
            (cgPoint.isOutput ? "output" : "input") + ": `" + cgPoint.cgName + "`");
    }
    if (cgPoint.isOutput) {
        this._cgOutputs.push(cgPoint);
    } else {
        this._cgInputs.push(cgPoint);
    }
    this._cgGraph.emit("cg-point-create", this, cgPoint);
    return cgPoint;
};

/**
 * Returns whether this block contains the specified output
 * @param {String} cgOutputName
 * @return {dudeGraph.Point|null}
 */
dudeGraph.Block.prototype.outputByName = function (cgOutputName) {
    return _.find(this._cgOutputs, function (cgOutput) {
        return cgOutput.cgName === cgOutputName;
    });
};

/**
 * Returns whether this block contains the specified input
 * @param {String} cgInputName
 * @return {dudeGraph.Point|null}
 */
dudeGraph.Block.prototype.inputByName = function (cgInputName) {
    return _.find(this._cgInputs, function (cgInput) {
        return cgInput.cgName === cgInputName;
    });
};

/**
 * Tries to update the blocks types from templates parameters to match the `point` type with the given `type`.
 * @param {dudeGraph.Point} cgPoint - The point on which the connection will be created
 * @param {String} type - The type of the connection that we try to attach
 * @returns {boolean}
 */
dudeGraph.Block.prototype.updateTemplate = function (cgPoint, type) {
    if (cgPoint.cgTemplate === null || !this.cgTemplates[cgPoint.cgTemplate] ||
        this.cgTemplates[cgPoint.cgTemplate].indexOf(type) === -1) {
        return false;
    }
    cgPoint.cgValueType = type;
    var failToInfer = false;
    var updateValueType = function (currentPoint) {
        if (failToInfer) {
            return true;
        }
        if (currentPoint.cgTemplate === cgPoint.cgTemplate) {
            if (cgPoint.cgConnections.length === 0) {
                currentPoint.cgValueType = type;
            } else {
                failToInfer = true;
                return true;
            }
        }
    };
    _.forEach(this._cgInputs, updateValueType.bind(this));
    _.forEach(this._cgOutputs, updateValueType.bind(this));
    return !failToInfer;
};

/**
 * Returns a copy of this block
 * @param {dudeGraph.Graph} cgGraph - The graph on which the cloned block will be attached to
 * @return {dudeGraph.Block}
 */
dudeGraph.Block.prototype.clone = function (cgGraph) {
    if (this._blockType !== "Block") {
        throw new Error("Method `clone` must be overridden by `" + this._blockType + "`");
    }
    var cgBlockClone = new dudeGraph.Block(cgGraph);
    cgBlockClone.cgName = this._cgName;
    _.forEach(this._cgOutputs, function (cgOutput) {
        var cgOutputClone = cgOutput.clone(cgBlockClone);
        cgBlockClone.addPoint(cgOutputClone);
    });
    _.forEach(this._cgInputs, function (cgInput) {
        var cgInputClone = cgInput.clone(cgBlockClone);
        cgBlockClone.addPoint(cgInputClone);
    });
    return cgBlockClone;
};