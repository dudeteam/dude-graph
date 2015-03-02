var Grid = function () {
    this.elements = [];
};

Grid.prototype.push = function (name, obj) {
    obj.id = this.elements.length;
    this.elements.push(obj);
    return obj;
};

Grid.prototype.get = function (i) {
    return this.elements[i];
};

Grid.prototype.remove = function (obj) {
    this.elements.splice(this.elements.indexOf(obj), 1);
};

Grid.prototype.forEach = function (fn) {
    for (var i = 0; i < this.elements.length; ++i) {
        fn(this.elements[i], this.elements[i].name);
    }
};
