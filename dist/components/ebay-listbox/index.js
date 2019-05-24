'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};var Expander = require('makeup-expander');
var findIndex = require('core-js/library/fn/array/find-index');
var ActiveDescendant = require('makeup-active-descendant');
var scrollKeyPreventer = require('makeup-prevent-scroll-keys');
var elementScroll = require('../../common/element-scroll');
var emitAndFire = require('../../common/emit-and-fire');
var observer = require('../../common/property-observer');

module.exports = require('marko-widgets').defineComponent({
    template: require('./template.marko'),
    getInitialProps: function getInitialProps(input) {
        return _extends({
            options: [] },
        input);
    },
    getInitialState: function getInitialState(input) {
        var index = findIndex(input.options, function (option) {return option.selected;});

        return _extends({}, input, {
            selectedIndex: index === -1 ? 0 : index });

    },
    init: function init() {var _this = this;
        // TODO: needs to be in on render.
        var optionsContainer = this.getEl('options');
        this.activeDescendant = ActiveDescendant.createLinear(
        this.el,
        optionsContainer,
        optionsContainer,
        '.listbox__option[role=option]',
        {
            activeDescendantClassName: 'listbox__option--active',
            autoInit: this.state.selectedIndex,
            autoReset: null });



        this.expander = new Expander(this.el, {
            autoCollapse: true,
            expandOnClick: !this.state.disabled,
            contentSelector: '#' + optionsContainer.id,
            hostSelector: '#' + this.getEl('button').id,
            expandedClass: 'listbox--expanded',
            focusManagement: 'content',
            simulateSpacebarClick: true });


        this.
        subscribeTo(this.el).
        on('activeDescendantChange', this.handleListboxChange.bind(this));

        observer.observeRoot(this, ['selected'], function (index) {
            _this.setSelectedIndex(index);
        });

        observer.observeRoot(this, ['disabled'], function () {
            _this.expander.expandOnClick = !_this.state.disabled;
        });

        this.getEls('option').forEach(function (optionEl, i) {
            Object.defineProperty(optionEl, 'selected', {
                get: function get() {return _this.state.selectedIndex === i;},
                set: function set(value) {return _this.setSelectedIndex(value ? i : 0);} });

        });

        scrollKeyPreventer.add(this.getEl('button'));
        scrollKeyPreventer.add(this.getEl('options'));
    },
    handleExpand: function handleExpand() {
        elementScroll.scroll(this.getEls('option')[this.state.selectedIndex]);
        emitAndFire(this, 'listbox-expand');
    },
    handleCollapse: function handleCollapse() {
        emitAndFire(this, 'listbox-collapse');
    },
    handleListboxChange: function handleListboxChange(event) {
        this.setSelectedIndex(parseInt(event.detail.toIndex, 10));
    },
    setSelectedIndex: function setSelectedIndex(selectedIndex) {
        var el = this.getEls('option')[selectedIndex];
        var option = this.state.options[selectedIndex];

        elementScroll.scroll(el);
        this.setState('selectedIndex', selectedIndex);

        // TODO: we should not cast the selected value to a string here, but this is a breaking change.
        emitAndFire(this, 'listbox-change', {
            index: selectedIndex,
            selected: [String(option.value)],
            el: el });

    } });