'use strict';module.exports = require('marko-widgets').defineComponent({
    template: require('./template.marko'),
    handleCloseButton: function handleCloseButton() {
        this.emit('overlay-close');
    } });