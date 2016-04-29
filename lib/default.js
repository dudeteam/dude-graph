/**
 * @type {Array}
 */
dudeGraph.defaultBlocks = [
    {"block": "AssignationBlock", "type": dudeGraph.AssignationBlock},
    {"block": "ConditionBlock", "type": dudeGraph.ConditionBlock},
    {"block": "DelegateBlock", "type": dudeGraph.DelegateBlock},
    {"block": "EachBlock", "type": dudeGraph.EachBlock},
    {"block": "ExpressionBlock", "type": dudeGraph.ExpressionBlock},
    {"block": "FormatBlock", "type": dudeGraph.FormatBlock},
    {"block": "FunctionBlock", "type": dudeGraph.FunctionBlock},
    {"block": "GetterBlock", "type": dudeGraph.GetterBlock},
    {"block": "InstructionBlock", "type": dudeGraph.InstructionBlock},
    {"block": "OperatorBlock", "type": dudeGraph.OperatorBlock},
    {"block": "RangeBlock", "type": dudeGraph.RangeBlock},
    {"block": "VariableBlock", "type": dudeGraph.VariableBlock}
];
/**
 * @type {Array}
 */
dudeGraph.defaultPoints = [
    {"point": "ResourcePoint", "type": dudeGraph.ResourcePoint},
    {"point": "StreamPoint", "type": dudeGraph.StreamPoint},
    {"point": "VariablePoint", "type": dudeGraph.VariablePoint}
];
/**
 * @type {Array}
 */
dudeGraph.defaultRenderBlocks = [
    {"renderBlock": "AssignationBlock", "type": dudeGraph.RenderBlock},
    {"renderBlock": "ConditionBlock", "type": dudeGraph.RenderBlock},
    {"renderBlock": "DelegateBlock", "type": dudeGraph.RenderBlock},
    {"renderBlock": "EachBlock", "type": dudeGraph.RenderBlock},
    {"renderBlock": "ExpressionBlock", "type": dudeGraph.RenderBlock},
    {"renderBlock": "FormatBlock", "type": dudeGraph.RenderBlock},
    {"renderBlock": "FunctionBlock", "type": dudeGraph.RenderBlock},
    {"renderBlock": "GetterBlock", "type": dudeGraph.RenderBlock},
    {"renderBlock": "InstructionBlock", "type": dudeGraph.RenderBlock},
    {"renderBlock": "OperatorBlock", "type": dudeGraph.RenderBlock},
    {"renderBlock": "RangeBlock", "type": dudeGraph.RenderBlock},
    {"renderBlock": "VariableBlock", "type": dudeGraph.RenderVariableBlock}
];
/**
 * @type {Array}
 */
dudeGraph.defaultRenderPoints = [
    {"renderPoint": "ResourcePoint", "type": dudeGraph.RenderPoint},
    {"renderPoint": "StreamPoint", "type": dudeGraph.RenderPoint},
    {"renderPoint": "VariablePoint", "type": dudeGraph.RenderPoint}
];

/**
 * Default renderer zoom
 * @type {dudeGraph.Renderer.rendererZoomTypedef}
 */
dudeGraph.defaultRendererZoom = {
    "translate": [0, 0],
    "scale": 1
};

/**
 * Default renderer configuration
 * @type {dudeGraph.Renderer.rendererConfigTypedef}
 */
dudeGraph.defaultRendererConfig = {
    "zoom": {
        "min": 0.01,
        "max": 5,
        "margin": [10, 10],
        "transitionSpeed": 800
    },
    "block": {
        "padding": 10,
        "header": 50,
        "pointSpacing": 10,
        "borderRadius": 5
    },
    "grid": {
        "active": false,
        "spacingX": 20,
        "spacingY": 20
    },
    "group": {
        "padding": 10,
        "header": 30,
        "borderRadius": 5,
        "minSize": [200, 150]
    },
    "point": {
        "height": 20,
        "padding": 10,
        "radius": 3
    },
    "connection": {
        "step": 50
    },
    "typeColors": {
        "Stream": "#aaaaaa",
        "String": "#aac563",
        "Number": "#5990bd",
        "Boolean": "#cc99cd",
        "Object": "#d9b762",
        "Array": "#667e7f",
        "Resource": "#ffa8c2"
    },
    "defaultColor": "#ff0000"
};