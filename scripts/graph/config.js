var ACTIONS = {
    "roundedRect": {
        "inputs": [
            {"type": "color", "name": "color", value: "#fff"},
            {"type": "number", "name": "aspectRatio", value: 1.0},
            {"type": "number", "name": "strokeSize", value: 1.0},
            {"type": "number", "name": "borderRadius", value: 0.2},
            {"type": "boolean", "name": "isSolid", value: true}
        ],
        "outputs": [
            {"type": "color", "name": "gl_FragColor"}
        ]
    },
    "blurShader": {
        "inputs": [
            {"type": "number", "name": "diameter"},
            {"type": "vec2", "name": "resolution"}
        ],
        "outputs": [{"type": "color", "name": "gl_FragColor"}]
    },
    "bwShader": {
        "inputs": [],
        "outputs": [{"type": "color", "name": "gl_FragColor"}]
    },
    "mix": {
        "inputs": [
            {"type": "color", "name": "first"},
            {"type": "color", "name": "second"},
            {"type": "number", "name": "ratio"}
        ],
        "outputs": [{"type": "color", "name": "gl_FragColor"}]
    },
    "finalOutput": {
        "inputs": [{"type": "color", "name": "result"}],
        "outputs": []
    }
};

var TYPES = {
    "boolean": "#1abc9c", // turquoise
    "number": "#2ecc71", // green
    "vec3": "#3498db", // blue
    "vec2": "#2980b9", // blue
    "color": "#9b59b6", // purple
    "list": "#f1c40f", // yellow
    "dictionary": "#e67e22" // orange
};
