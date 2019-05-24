'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};
/**
                                                                                                                                                                                                                                                                      * Convert camelCase to kebab-case
                                                                                                                                                                                                                                                                      * @param {String} s
                                                                                                                                                                                                                                                                      */
function camelToKebab(s) {
    return s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
   * Create object of HTML attributes for pass-through to the DOM
   * @param {Object} input
   */
function processHtmlAttributes() {var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var attributes = {};
    var htmlAttributes = input.htmlAttributes;
    var wildcardAttributes = input['*'];

    var obj = htmlAttributes || wildcardAttributes;
    if (htmlAttributes && wildcardAttributes) {
        obj = _extends(wildcardAttributes, htmlAttributes);
    }

    if (obj) {
        Object.keys(obj).forEach(function (key) {
            attributes[camelToKebab(key)] = obj[key];
        });
    }

    return attributes;
}

module.exports = processHtmlAttributes;