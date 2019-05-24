'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};var getItem = function getItem(text) {var href = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '#';return {
        href: href,
        navSrc: '{"actionKind":"NAVSRC","operationId":"2489527"}',
        _sp: 'p2489527.m4340.l9751.c1',
        renderBody: function renderBody(stream) {
            stream.write(text);
        } };};

var basicItems = [getItem('eBay'),
getItem('Auto Parts and Vehicles'),
getItem('Motors Parts & Accessories', null)];

var firstItemMissingHref = [getItem('eBay', null),
getItem('Auto Parts and Vehicles'),
getItem('Motors Parts & Accessories', null)];

module.exports = {
    basicItems: {
        a11yHeadingText: 'Page navigation',
        items: basicItems },

    buttons: {
        items: basicItems.map(function (item) {return _extends({}, item, { href: undefined });}) },

    firstItemMissingHref: {
        a11yHeadingText: 'Page navigation',
        items: firstItemMissingHref },

    itemsWithHeadingTag: {
        a11yHeadingText: 'Page navigation',
        a11yHeadingTag: 'h3',
        items: basicItems } };