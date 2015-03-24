/**
 * Utility to send a d3 selection to front.
 * @returns {d3.selection}
 */
// TODO: remove this.
d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this);
    });
};