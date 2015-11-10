//
// Copyright (c) 2015 DudeTeam. All rights reserved.
//

/**
 * Default renderer configuration
 * @type {Object}
 */
dudeGraph.Renderer.defaultConfig = {
    "zoom": {
        "min": 0.25,
        "max": 5,
        "margin": [10, 10],
        "transitionSpeed": 800
    },
    "block": {
        "padding": 10,
        "header": 50,
        "pointSpacing": 10
    },
    "group": {
        "padding": 10,
        "header": 30
    },
    "point": {
        "height": 20,
        "padding": 10,
        "radius": 3
    }
};

/**
 * Default renderer zoom
 * @type {Object}
 */
dudeGraph.Renderer.defaultZoom = {
    "translate": [0, 0],
    "scale": 1
};