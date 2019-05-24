'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};var observer = require('../../common/property-observer');
var emitAndFire = require('../../common/emit-and-fire');
var template = require('./template.marko');

module.exports = require('marko-widgets').defineComponent({
    template: template,
    getInitialState: function getInitialState(input) {
        return _extends({}, input, {
            hidden: input.hidden || false });

    },
    init: function init() {
        observer.observeRoot(this, ['hidden'], this.setHidden.bind(this), true);
    },
    onDismiss: function onDismiss() {
        this.setHidden(true);
    },
    setHidden: function setHidden(hidden) {
        if (this.state.hidden !== hidden) {
            this.setState('hidden', hidden);
            emitAndFire(this, hidden ? 'notice-close' : 'notice-show');
        }
    } });