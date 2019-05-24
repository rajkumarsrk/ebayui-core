'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};var FloatingLabel = require('makeup-floating-label');
var emitAndFire = require('../../common/emit-and-fire');

module.exports = require('marko-widgets').defineComponent({
    template: require('./template.marko'),
    getWidgetConfig: function getWidgetConfig(input) {
        return { floatingLabel: input.floatingLabel };
    },
    getInitialState: function getInitialState(input) {
        return _extends({}, input, {
            disabled: Boolean(input.disabled) });

    },
    init: function init(config) {
        this.config = config;
        this.initFloatingLabel();
    },
    onUpdate: function onUpdate() {
        this.initFloatingLabel();
    },
    initFloatingLabel: function initFloatingLabel() {
        if (this.config.floatingLabel) {
            if (this.floatingLabel) {
                this.floatingLabel.refresh();
                this.handleFloatingLabelInit();
            } else if (document.readyState === 'complete') {
                if (this.el) {
                    this.floatingLabel = new FloatingLabel(this.el);
                    this.handleFloatingLabelInit();
                }
            } else {
                window.addEventListener('load', this.initFloatingLabel.bind(this));
            }
        }
    },
    handleFloatingLabelInit: forwardEvent('floating-label-init'),
    handleKeydown: forwardEvent('keydown'),
    handleChange: forwardEvent('change'),
    handleInput: forwardEvent('input'),
    handleFocus: forwardEvent('focus'),
    handleBlur: forwardEvent('blur') });


function forwardEvent(eventName) {
    return function (originalEvent, el) {
        emitAndFire(this, 'textbox-' + eventName, {
            originalEvent: originalEvent,
            value: (el || this.el.querySelector('input, textarea')).value });

    };
}