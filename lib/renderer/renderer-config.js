//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * Default renderer configuration
 * @type {Object}
 */
dudeGraph.Renderer.defaultConfig = {
    "zoom": {
        "min": 0.01,
        "max": 5,
        "margin": [10, 10],
        "transitionSpeed": 800
    },
    "block": {
        "padding": 10,
        "header": 50,
        "pointSpacing": 10
    },
    "grid": {
        "activated": true,
        "spacingX": 20,
        "spacingY": 20
    },
    "group": {
        "padding": 10,
        "header": 30,
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
        "Boolean": "#cc99cd",
        "Number": "#5990bd",
        "String": "#aac563",
        "Resource": "#ffa8c2",
        "Object": "#d9b762"
    },
    "defaultColor": "#ffaaff"
};

/**
 * Default renderer zoom
 * @type {{translate: Array<Number>, scale: Number}}
 */
dudeGraph.Renderer.defaultZoom = {
    "translate": [0, 0],
    "scale": 1
};