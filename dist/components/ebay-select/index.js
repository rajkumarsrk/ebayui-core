'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};var findIndex = require('core-js/library/fn/array/find-index');
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
        var selectedIndex = index === -1 ? 0 : index;

        return _extends({}, input, {
            selectedIndex: selectedIndex,
            // Note: the line below is because of the programatic API and should be removed if that is removed.
            value: input.options[selectedIndex] && input.options[selectedIndex].value });

    },
    init: function init() {var _this = this;
        // Note: this entire function is because of the programatic API and should be removed if that is removed.
        observer.observeRoot(this, ['selectedIndex'], this.setSelectedIndex.bind(this));
        observer.observeRoot(this, ['value'], function (value) {
            var index = findIndex(_this.state.options, function (option) {return option.value === value;});
            var selectedIndex = index === -1 ? 0 : index;
            _this.setSelectedIndex(selectedIndex);
        });
    },
    handleChange: function handleChange(event) {
        this.setSelectedIndex(event.target.selectedIndex);
    },
    setSelectedIndex: function setSelectedIndex(selectedIndex) {
        var el = this.getEls('option')[selectedIndex];
        var option = this.state.options[selectedIndex];

        this.setState('selectedIndex', selectedIndex);

        // Note: this is only set because of the programatic API and should be removed if that is removed.
        this.setState('value', option && option.value);

        // TODO: we should not cast the selected value to a string here, but this is a breaking change.
        emitAndFire(this, 'select-change', {
            index: selectedIndex,
            selected: [String(option.value)],
            el: el });

    } });