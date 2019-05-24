'use strict';var emitAndFire = require('../../common/emit-and-fire');

module.exports = require('marko-widgets').defineComponent({
    template: require('./template.marko'),
    handleClick: function handleClick(originalEvent) {
        var target = originalEvent.target;

        if (!target.disabled) {
            emitAndFire(this, 'radio-change', {
                originalEvent: originalEvent,
                value: target.value });

        }
    } });