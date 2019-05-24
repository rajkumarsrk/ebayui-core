'use strict';var emitAndFire = require('../../common/emit-and-fire');

module.exports = require('marko-widgets').defineComponent({
    template: require('./template.marko'),
    handleExpand: function handleExpand() {
        emitAndFire(this, 'tooltip-expand');
    },
    handleCollapse: function handleCollapse() {
        this.getWidget('base').expander.collapse();
        this.getEl('host').focus();
        emitAndFire(this, 'tooltip-collapse');
    } });