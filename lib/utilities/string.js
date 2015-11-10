(function () {

    _.mixin({
        /**
         * Templates format string with data
         * e.g: _.templateString("vec2({x}, {y})", {x: 32, y: 64}) => "vec2(32, 64)"
         * @param {String} format
         * @param {Object} data
         * @return {String}
         */
        templateString: function (format, data) {
            var tokenRegex = /\{([^\}]+)\}/g;
            var objNotationRegex = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g;
            var replacer = function (all, key, obj) {
                var res = obj;
                key.replace(objNotationRegex, function (all, name, quote, quotedName, isFunc) {
                    name = name || quotedName;
                    if (res !== undefined) {
                        if (name in res) {
                            res = res[name];
                        }
                        if (typeof res === "function" && isFunc) {
                            res = res();
                        }
                    }
                });
                res = (res === null || res === obj ? all : res) + "";
                return res;
            };
            return String(format).replace(tokenRegex, function (all, key) {
                return replacer(all, key, data);
            });
        }
    });

})();