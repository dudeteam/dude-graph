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
    var mask = group.rect(pos.x + style.padding, pos.y, style.width - style.padding * 2, style.height);
    mask.attr("fill", "white");
    var text = group.text(pos.x + style.padding, pos.y + style.height * 2 / 3, value);
    text.attr("mask", mask);
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
    group.mousedown(cg.preventCallback)
    group.mouseup(function (e) {
        if (group.hasClass("selected")) {
            group.removeClass("selected");
        } else {
            group.addClass("selected");
            path.attr("stroke-dasharray", path.getTotalLength() + " " + path.getTotalLength());
            path.attr("stroke-dashoffset", path.getTotalLength());
            path.animate({"stroke-dashoffset": 0}, 500);
        }
    });
    return group;
};

cg.pickerColor = cg.pickerString;
cg.pickerNumber = cg.pickerString;
