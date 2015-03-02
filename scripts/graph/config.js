var ACTIONS = {
    "rounded_rect": {
        "inputs": [
            {"type": "color", "name": "color", value: "#fff"},
            {"type": "number", "name": "aspect_ratio", value: 1.0},
            {"type": "number", "name": "stroke_size", value: 1.0},
            {"type": "number", "name": "border_radius", value: 0.2},
            {"type": "boolean", "name": "is_solid", value: true}
        ],
        "outputs": [
            {"type": "color", "name": "frag_color"}
        ]
    },
    "blur": {
        "inputs": [
            {"type": "number", "name": "diameter"},
            {"type": "vec2", "name": "resolution"}
        ],
        "outputs": [{"type": "color", "name": "frag_color"}]
    },
    "black_and_white": {
        "inputs": [],
        "outputs": [{"type": "color", "name": "frag_color"}]
    },
    "mix": {
        "inputs": [
            {"type": "color", "name": "first"},
            {"type": "color", "name": "second"},
            {"type": "number", "name": "ratio"}
        ],
        "outputs": [{"type": "color", "name": "frag_color"}]
    },
    "output": {
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
