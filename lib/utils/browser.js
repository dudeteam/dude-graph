(function () {

    /**
     * Returns the browser name.
     * http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
     * @return {String}
     */
    var browser = function () {
        var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        if (isOpera) {
            return "Opera";
        }
        else { //noinspection JSUnresolvedVariable
            if (typeof InstallTrigger !== 'undefined') {
                return "Firefox";
            }
            else if (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0) {
                return "Safari";
            }
            else if (navigator.userAgent.indexOf('Edge') !== -1) {
                return "Edge";
            }
            else { //noinspection JSUnresolvedVariable
                if (!!window.chrome && !isOpera) {
                    return "Chrome";
                }
                else {
                    //noinspection PointlessBooleanExpressionJS
                    if (false || !!document.documentMode) {
                        return "IE";
                    }
                    else {
                        return "Unknown";
                    }
                }
            }
        }
    };

    _.mixin({
        /**
         * Returns the browser name.
         * @return {String}
         */
        browser: browser,

        /**
         * Runs the function if the current browser is in the browsers
         * @param {Array<String>} browsers
         * @param {Function} [funcOk]
         * @param {Function} [funcKo]
         */
        browserIf: function (browsers, funcOk, funcKo) {
            if (_.contains(browsers, browser())) {
                (funcOk && funcOk || function () {})();
            } else {
                (funcKo && funcKo || function () {})();
            }
        }
    });
})();