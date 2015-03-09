/**
 * Display a string picker on the screen.
 * @param element {Object}
 * @param value {String}
 * @param pos {cg.Vec2}
 * @param style {Object?}
 * @returns {Snap.Group}
 */
cg.pickerString = function (element, value, pos, style) {
    style = style || {
        "width": 50,
        "height": 15,
        "borderRadius": 0,
        "padding": 2
    };
    var group = element.g();
    group.addClass("picker-string");
    group.rect(pos.x, pos.y, style.width, style.height, style.borderRadius);
    var textMask = group.rect(pos.x + style.padding, pos.y, style.width - style.padding * 2, style.height);
    textMask.attr("fill", "white");
    var text = group.text(pos.x + style.padding, pos.y + style.height * 2 / 3, value);
    text.attr("mask", textMask);
    return group;
};

/**
 * Display a vec2 picker on the screen.
 * @param element {Object}
 * @param value {{x: Number, y: Number}}
 * @param pos {cg.Vec2}
 * @param style {Object?}
 * @returns {Snap.Group}
 */
cg.pickerVec2 = function (element, value, pos, style) {
    value = value || {x: 0, y: 0};
    style = style || {
        "width": 50,
        "height": 15,
        "borderRadius": 0,
        "padding": 2,
        "margin": 1
    };
    style.width /= 2;
    style.width -= style.margin;
    var group = element.g();
    group.addClass("picker-vec2");
    group.add(cg.pickerString(group, value.x.toString(), pos, style));
    group.add(cg.pickerString(group, value.y.toString(), new cg.Vec2(pos.x + style.width + style.margin * 2, pos.y), style));
    return group;
};

/**
 * Display a vec3 picker on the screen.
 * @param element {Object}
 * @param value {{x: Number, y: Number, z: Number}}
 * @param pos {cg.Vec2}
 * @param style {Object?}
 * @returns {Snap.Group}
 */
cg.pickerVec3 = function (element, value, pos, style) {
    value = value || {x: 0, y: 0, z: 0};
    style = style || {
        "width": 50,
        "height": 15,
        "borderRadius": 0,
        "padding": 2,
        "margin": 1
    };
    style.width /= 3;
    style.width -= style.margin;
    var group = element.g();
    group.addClass("picker-vec3");
    group.add(cg.pickerString(group, value.x.toString(), pos, style));
    group.add(cg.pickerString(group, value.y.toString(), new cg.Vec2(pos.x + style.width + style.margin * 2, pos.y), style));
    group.add(cg.pickerString(group, value.z.toString(), new cg.Vec2(pos.x + style.width * 2 + style.margin * 4, pos.y), style));
    return group;
};

/**
 * Display a boolean picker on the screen.
 * @param element {Object}
 * @param value {Boolean}
 * @param pos {cg.Vec2}
 * @param style {Object?}
 * @returns {Snap.Group}
 */
cg.pickerBoolean = function (element, value, pos, style) {
    style = style || {
        "size": 10,
        "borderRadius": 0
    };
    var group = element.g();
    group.addClass("picker-boolean");
    if (value === true) {
        group.addClass("selected");
    }
    group.rect(pos.x, pos.y, style.size, style.size, style.borderRadius);
    var path = group.path(Snap.format("M {x1} {y1} L {x2} {y2} L {x3} {y3}", {
        x1: pos.x + 2, y1: pos.y + 3,
        x2: pos.x + 5, y2: pos.y + 8,
        x3: pos.x + 10, y3: pos.y
    }));
    path.attr("stroke-dasharray", path.getTotalLength() + " " + path.getTotalLength());
    path.attr("stroke-dashoffset", path.getTotalLength());
    path.animate({"stroke-dashoffset": 0}, 500);
    group.mousedown(cg.preventCallback);
    group.mouseup(function () {
        if (group.hasClass("selected")) {
            group.removeClass("selected");
        } else {
            group.addClass("selected");
            path.attr("stroke-dasharray", path.getTotalLength() + " " + path.getTotalLength());
            path.attr("stroke-dashoffset", path.getTotalLength());
            path.animate({"stroke-dashoffset": 0}, 200, mina.easeout);
        }
    });
    return group;
};

cg.pickerColor = cg.pickerString;
cg.pickerNumber = cg.pickerString;

cg.pickerResource = function (element, value, pos, style) {
    style = style || {
        "width": 50,
        "height": 15,
        "borderRadius": 0,
        "padding": 2
    };
    var group = element.g();
    group.addClass("picker-resource");
    group.rect(pos.x, pos.y, style.width, style.height, style.borderRadius);
    var mask = group.rect(pos.x + style.padding, pos.y, style.width - style.padding * 2, style.height);
    mask.attr("fill", "white");
    var text = group.text(15 + pos.x + style.padding, pos.y + style.height * 2 / 3, "mario.png");
    text.attr("mask", mask);
    var path = group.path("M396.283,130.188c-3.806-9.135-8.371-16.365-13.703-21.695l-89.078-89.081c-5.332-5.325-12.56-9.895-21.697-13.704" +
    "C262.672,1.903,254.297,0,246.687,0H63.953C56.341,0,49.869,2.663,44.54,7.993c-5.33,5.327-7.994,11.799-7.994,19.414v383.719" +
    "c0,7.617,2.664,14.089,7.994,19.417c5.33,5.325,11.801,7.991,19.414,7.991h310.633c7.611,0,14.079-2.666,19.407-7.991" +
    "c5.328-5.332,7.994-11.8,7.994-19.417V155.313C401.991,147.699,400.088,139.323,396.283,130.188z M255.816,38.826" +
    "c5.517,1.903,9.418,3.999,11.704,6.28l89.366,89.366c2.279,2.286,4.374,6.186,6.276,11.706H255.816V38.826z M365.449,401.991" +
    "H73.089V36.545h146.178v118.771c0,7.614,2.662,14.084,7.992,19.414c5.332,5.327,11.8,7.994,19.417,7.994h118.773V401.991z");
    path.transform("S 0.02 T -50 200");
    return group;
};
