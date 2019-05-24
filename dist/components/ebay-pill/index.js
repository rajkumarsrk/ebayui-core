'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};var multilineEllipsis = require('../../common/multiline-ellipsis');
var emitAndFire = require('../../common/emit-and-fire');
var template = require('./template.marko');

module.exports = require('marko-widgets').defineComponent({
    template: template,
    getInitialState: function getInitialState(input) {
        return _extends({}, input, {
            pressed: input.pressed || false });

    },
    onRender: function onRender() {
        var activeText = this.getEl('active-text');

        if (activeText) {
            // determine whether the content overflows
            multilineEllipsis.truncate(activeText);
        }
    },
    handleButtonClick: function handleButtonClick(event) {
        this.setState('pressed', !this.state.pressed);
        emitAndFire(this, 'button-click', event);
    },
    handleButtonEscape: function handleButtonEscape(event) {
        emitAndFire(this, 'button-escape', event);
    } });