'use strict';var emitAndFire = require('../../common/emit-and-fire');

module.exports = require('marko-widgets').defineComponent({
    template: require('./template.marko'),
    handleClick: function handleClick(originalEvent) {
        emitAndFire(this, 'breadcrumb-select', { originalEvent: originalEvent, el: originalEvent.target });
    } });