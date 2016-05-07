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
    {"renderBlock": "AssignationBlock", "type": dudeGraph.RenderFancyBlock},
    {"renderBlock": "ConditionBlock", "type": dudeGraph.RenderFancyBlock},
    {"renderBlock": "DelegateBlock", "type": dudeGraph.RenderFancyBlock},
    {"renderBlock": "EachBlock", "type": dudeGraph.RenderFancyBlock},
    {"renderBlock": "ExpressionBlock", "type": dudeGraph.RenderFancyBlock},
    {"renderBlock": "FormatBlock", "type": dudeGraph.RenderFancyBlock},
    {"renderBlock": "FunctionBlock", "type": dudeGraph.RenderFancyBlock},
    {"renderBlock": "GetterBlock", "type": dudeGraph.RenderFancyBlock},
    {"renderBlock": "InstructionBlock", "type": dudeGraph.RenderFancyBlock},
    {"renderBlock": "OperatorBlock", "type": dudeGraph.RenderFancyBlock},
    {"renderBlock": "RangeBlock", "type": dudeGraph.RenderFancyBlock},
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
        "borderRadius": 0
    },
    "grid": {
        "active": false,
        "spacingX": 20,
        "spacingY": 20
    },
    "group": {
        "padding": 10,
        "header": 30,
        "borderRadius": 0,
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
        "default": "#ff0000",
        "Stream": "#aaaaaa",
        "String": "#aac563",
        "Text": "#aac563",
        "Number": "#5990bd",
        "Boolean": "#cc99cd",
        "Object": "#d9b762",
        "Array": "#667e7f",
        "Resource": "#ffa8c2"
    },
    "blockColors": {
        "default": "#ecf0f1",
        "Start": "#a9dbb1",
        "Step": "#f4e2a0",
        "End": "#e7a297",
        "Go": "#34495e",
        "Condition": "#3498db",
        "Repeat": "#e74c3c",
        "Assign": "#f7a200",
        "Print": "#16a085",
        "format": "#2ecc71",
        "expression": "#d35400",
        "random_range": "#8e44Ad",
        "trophy": "#f1c40f"
    }
};