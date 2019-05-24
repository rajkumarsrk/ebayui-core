'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};var rovingTabindex = require('makeup-roving-tabindex');
var emitAndFire = require('../../common/emit-and-fire');
var eventUtils = require('../../common/event-utils');
var observer = require('../../common/property-observer');

module.exports = require('marko-widgets').defineComponent({
    template: require('./template.marko'),
    getInitialProps: function getInitialProps(input) {
        return _extends({
            activation: 'auto',
            headings: [],
            panels: [] },
        input);
    },
    getInitialState: function getInitialState(input) {
        return _extends({}, input, {
            index: (parseInt(input.index, 10) || 0) % (input.headings.length || 1) });

    },
    init: function init() {var _this = this;
        if (!this.state.fake) {
            var linearRovingTabindex = rovingTabindex.createLinear(
            this.getEl('headings'),
            '.tabs__item',
            { index: this.state.index });


            linearRovingTabindex.wrap = true;
        }

        observer.observeRoot(this, ['index'], function (index) {return _this.setIndex(index);}, true);
    },
    /**
        * Handle a11y for heading
        * https://ebay.gitbooks.io/mindpatterns/content/disclosure/tabs.html
        * @param {KeyboardEvent} event
        * @param {HTMLDivElement} el
        */
    handleHeadingKeydown: function handleHeadingKeydown(event, el) {var _this2 = this;
        eventUtils.handleActionKeydown(event, function () {
            event.preventDefault();

            if (_this2.state.activation === 'auto') {
                _this2.setIndex(el.dataset.index);
            }
        });

        eventUtils.handleLeftRightArrowsKeydown(event, function () {
            event.preventDefault();

            var len = _this2.state.headings.length;
            var keyCode = event.charCode || event.keyCode;
            var direction = keyCode === 37 ? -1 : 1;
            var index = (_this2.state.index + len + direction) % len;
            _this2.getEl('tab-' + index).focus();

            if (_this2.state.activation === 'auto') {
                _this2.setIndex(index);
            }
        });
    },
    handleHeadingClick: function handleHeadingClick(_, el) {
        this.setIndex(el.dataset.index);
    },
    setIndex: function setIndex(rawIndex) {
        var len = this.state.headings.length;
        var index = ((parseInt(rawIndex, 10) || 0) + len) % len;

        if (index !== this.state.index) {
            this.setState('index', index);
            emitAndFire(this, 'tab-select', { index: index });
        }
    } });