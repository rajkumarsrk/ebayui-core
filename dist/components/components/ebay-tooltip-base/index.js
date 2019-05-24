'use strict';var Expander = require('makeup-expander');
var focusables = require('makeup-focusables');

module.exports = require('marko-widgets').defineComponent({
    template: require('./template.marko'),
    getInitialState: function getInitialState(input) {
        return input;
    },
    onRender: function onRender() {
        var hostClass = this.state.type + '__host';
        var hostSelector = '.' + hostClass;
        var expanderEl = this.el.getElementsByClassName(this.state.type)[0];

        this.curFocusable = focusables(this.el)[0];

        if (this.curFocusable) {
            this.curFocusable.classList.add(hostClass);
        }

        this.host = this.el.querySelector(hostSelector);

        var hostAriaDescribedBy = this.host &&
        this.host.hasAttribute('aria-describedby') &&
        this.host.getAttribute('aria-describedby');
        var isTooltip = this.state.type === 'tooltip';

        if (this.host) {
            this.expander = new Expander(expanderEl, {
                hostSelector: hostSelector,
                contentSelector: '.' + this.state.type + '__overlay',
                expandedClass: this.state.type + '--expanded',
                focusManagement: null,
                expandOnFocus: isTooltip,
                expandOnHover: isTooltip && !this.state.noHover,
                expandOnClick: this.state.type === 'infotip',
                autoCollapse: isTooltip });


            if (!hostAriaDescribedBy && this.el.parentElement) {
                this.host.setAttribute('aria-describedby', this.el.parentElement.id + '-overlay');
            }
        }
    },
    onBeforeUpdate: function onBeforeUpdate() {
        if (this.expander) {
            this.expander.cancelAsync();
        }
    },
    handleExpand: function handleExpand() {
        this.emit('base-expand');
    },
    handleCollapse: function handleCollapse() {
        this.emit('base-collapse');
    } });