'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};var emitAndFire = require('../../common/emit-and-fire');
var eventUtils = require('../../common/event-utils');
var observer = require('../../common/property-observer');

module.exports = require('marko-widgets').defineComponent({
    template: require('./template.marko'),
    getInitialState: function getInitialState(input) {
        return _extends({}, input, {
            disabled: input.disabled });

    },
    init: function init() {
        observer.observeRoot(this, ['disabled']);
    },
    handleClick: function handleClick(originalEvent) {
        if (!this.state.disabled) {
            emitAndFire(this, 'button-click', { originalEvent: originalEvent });
        }
    },
    handleKeydown: function handleKeydown(originalEvent) {var _this = this;
        eventUtils.handleEscapeKeydown(originalEvent, function () {
            if (!_this.state.disabled) {
                emitAndFire(_this, 'button-escape', { originalEvent: originalEvent });
            }
        });
    } });