var ACTIONS = {
    "blurShader": {
        "inputs": [],
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
