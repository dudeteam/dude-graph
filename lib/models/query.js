dudeGraph.Models = {};

/**
 * Queries the suitable blocks to create for the given point
 * @param {dudeGraph.Models.modelsTypedef} models
 * @param {dudeGraph.Point} point
 */
dudeGraph.Models.query = function (models, point) {
    var eligibleModels = [];
    if (!point.emptyValue() || (point.pointSingleConnection && !point.emptyConnection())) {
        return []; // Discard if point has a value or a connection and cannot accept more than one connection
    }
    (function recursiveQuery(recursiveModels) {
        _.forEach(recursiveModels, function (model) {
            if (!_.isUndefined(model.item)) {
                var modelPoints = point.pointOutput ? model.item.data.blockInputs :  model.item.data.blockOutputs;
                var eligibleModelPoints = _.filter(modelPoints, function (modelPoint) {
                    return point.pointValueType === modelPoint.pointValueType;
                });
                if (!_.isEmpty(eligibleModelPoints)) {
                    eligibleModels.push({
                        "model": model,
                        "modelPoints": _.map(eligibleModelPoints, function (modelPoint) {
                            return modelPoint.pointName;
                        })
                    });
                }
            } else if (!_.isUndefined(model.group)) {
                recursiveQuery(model.group.items);
            }
        });
    })(models);
    return eligibleModels;
};

/**
 * @typedef {Array} dudeGraph.Models.modelsTypedef
 */