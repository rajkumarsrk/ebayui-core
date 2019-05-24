'use strict';var emitAndFire = require('../../common/emit-and-fire');

module.exports = require('marko-widgets').defineComponent({
    template: require('./template.marko'),
    handleChange: function handleChange(originalEvent) {
        emitAndFire(this, 'switch-change', {
            originalEvent: originalEvent,
            value: originalEvent.target.value,
            checked: originalEvent.target.checked });

    } });