'use strict';var _get = require('lodash.get');
var _set = require('lodash.set');

/**
                                   * For each attribute, define getter and setter on root DOM element of the widget
                                   * @param {Object} widget
                                   * @param {Array} attributes
                                   * @param {Function} callback
                                   * @param {Boolean} skipSetState: useful for handling setState in your component, rather than here
                                   */
function observeRoot(widget, attributes, callback, skipSetState) {
    attributes.forEach(function (attribute) {
        Object.defineProperty(widget.el, attribute, {
            get: function get() {
                return widget.state[attribute];
            },
            set: function set(value) {
                if (!skipSetState) {
                    widget.setState(attribute, value);
                }
                if (callback) {
                    callback(value);
                }
            } });

    });
}

/**
   * Define getter and setter on a non-root DOM element of the widget
   * @param {Object} widget: Widget instance
   * @param {HTMLElement} el: Element for attaching observer
   * @param {String} attribute: Name of stateful property
   * @param {String} path: Path to part of state that needs to be accessed
   * @param {String} dirtyPath: Path to use with setStateDirty()
   */
function observeInner(widget, el, attribute, path, dirtyPath, callback) {
    Object.defineProperty(el, attribute, {
        get: function get() {
            return _get(widget.state, path + '.' + attribute);
        },
        set: function set(value) {
            _set(widget.state, path + '.' + attribute, value);
            if (dirtyPath) {
                widget.setStateDirty(dirtyPath);
            }
            callback(el);
        } });

}

module.exports = { observeRoot: observeRoot, observeInner: observeInner };