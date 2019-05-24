'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};var findIndex = require('core-js/library/fn/array/find-index');
var ActiveDescendant = require('makeup-active-descendant');
var Expander = require('makeup-expander');
var elementScroll = require('../../common/element-scroll');
var emitAndFire = require('../../common/emit-and-fire');
var eventUtils = require('../../common/event-utils');
var observer = require('../../common/property-observer');
var safeRegex = require('../../common/build-safe-regex');

module.exports = require('marko-widgets').defineComponent({
    template: require('./template.marko'),
    getInitialProps: function getInitialProps(input) {
        return _extends({
            options: [] },
        input);
    },
    getInitialState: function getInitialState(input) {
        var autocomplete = input.autocomplete === 'list' ? 'list' : 'none';
        var currentValue = input['*'] && input['*'].value;
        var index = findIndex(input.options, function (option) {return option.text === currentValue;});

        return _extends({}, input, {
            autocomplete: autocomplete,
            selectedIndex: index === -1 ? null : index,
            currentValue: currentValue });

    },
    init: function init() {var _this = this;
        observer.observeRoot(this, ['disabled'], function () {
            _this.expander.expandOnClick = !_this.state.disabled;
        });

        this.getEls('option').forEach(function (optionEl, i) {
            Object.defineProperty(optionEl, 'selected', {
                get: function get() {return _this.state.selectedIndex === i;},
                set: function set(value) {return _this.setSelectedIndex(value ? i : null);} });

        });
    },
    onRender: function onRender() {
        var selectedIndex = this.getSelectedIndex(this.state.options, this.state.currentValue);

        if (!this.state.disabled && this.state.options.length) {
            this.activeDescendant = ActiveDescendant.createLinear(
            this.el,
            this.getEl('input'),
            this.getEl('options'),
            '.combobox__option[role=option]', {
                activeDescendantClassName: 'combobox__option--active',
                autoInit: selectedIndex === -1 ? -1 : 0,
                autoReset: -1 });



            this.expander = new Expander(this.el, {
                autoCollapse: true,
                expandOnFocus: true,
                expandOnClick: this.state.readonly && !this.state.disabled,
                collapseOnFocusOut: !this.state.readonly,
                contentSelector: '.combobox__options',
                hostSelector: '.combobox__control > input',
                expandedClass: 'combobox--expanded',
                simulateSpacebarClick: true });

        }

        this.moveCursorToEnd();
    },
    onBeforeUpdate: function onBeforeUpdate() {
        this._handleDestroy();
    },
    onDestroy: function onDestroy() {
        this._handleDestroy();
    },
    _handleDestroy: function _handleDestroy() {
        if (this.activeDescendant) {
            this.activeDescendant.destroy();
        }

        if (this.expander) {
            this.expander.cancelAsync();
        }
    },
    handleExpand: function handleExpand() {
        var index = this.getSelectedIndex(this.state.options, this.state.currentValue);
        elementScroll.scroll(this.getEls('option')[index]);
        this.moveCursorToEnd();
        emitAndFire(this, 'combobox-expand');
    },
    handleCollapse: function handleCollapse() {
        emitAndFire(this, 'combobox-collapse');
    },
    moveCursorToEnd: function moveCursorToEnd() {
        var currentInput = this.getEl('input');

        if (currentInput) {
            var len = currentInput.value.length;
            currentInput.setSelectionRange(len, len);
        }
    },
    handleComboboxKeyUp: function handleComboboxKeyUp(originalEvent) {var _this2 = this;
        var optionsEl = this.getEl('options');
        var selectedEl = optionsEl && optionsEl.querySelector('.combobox__option--active');
        var newValue = this.getEl('input').value;

        eventUtils.handleUpDownArrowsKeydown(originalEvent, function () {
            if (_this2.expander && !_this2.expander.isExpanded() && _this2.getEls('option').length > 0) {
                _this2.expander.expand();
            }
            _this2.moveCursorToEnd();
        });

        eventUtils.handleEnterKeydown(originalEvent, function () {
            if (_this2.expander.isExpanded()) {
                newValue = selectedEl && selectedEl.textContent || newValue;
                _this2.setState('currentValue', newValue);
                _this2.setSelectedIndex();
                if (selectedEl) {
                    _this2.emitChangeEvent('select');
                }
                _this2.toggleListbox();
            }
        });

        eventUtils.handleEscapeKeydown(originalEvent, function () {
            _this2.expander.collapse();
        });

        eventUtils.handleTextInput(originalEvent, function () {
            _this2.setState('currentValue', newValue);
            _this2.setSelectedIndex();
            _this2.emitChangeEvent();
            _this2.toggleListbox();
        });
    },
    handleComboboxBlur: function handleComboboxBlur(evt) {
        var wasClickedOption = this.getEls('option').some(function (option) {return option === evt.relatedTarget;});

        if (wasClickedOption) {
            this.getEl('input').focus();
        }

        if (this.expander && this.expander.isExpanded() && !wasClickedOption) {
            this.emitChangeEvent('change');
            this.expander.collapse();
        }
    },
    handleOptionClick: function handleOptionClick(evt) {
        var selectedEl = evt.target.nodeName === 'DIV' ? evt.target : evt.target.parentNode;

        this.setState('currentValue', selectedEl.textContent);
        this.setSelectedIndex();
        this.emitChangeEvent('select');
        this.expander.collapse();
    },
    setSelectedIndex: function setSelectedIndex() {var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var newIndex = index || this.getSelectedIndex(this.state.options, this.state.currentValue);

        this.setState('selectedIndex', newIndex);
    },
    getSelectedIndex: function getSelectedIndex(options, value) {
        return findIndex(options, function (option) {return option.text === value;});
    },
    emitChangeEvent: function emitChangeEvent() {var eventName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'input';
        emitAndFire(this, 'combobox-' + eventName, {
            currentInputValue: this.state.currentValue,
            selectedOption: this.state.options[this.state.selectedIndex],
            options: this.state.options });

    },
    toggleListbox: function toggleListbox() {
        var query = this.getEl('input').value;
        var queryReg = safeRegex(query);

        var showListbox =
        this.state.autocomplete === 'list' && this.state.options.some(function (option) {return queryReg.test(option.text);}) ||
        this.state.autocomplete !== 'none';

        if (!showListbox) {
            this.expander.collapse();
        } else {
            this.expander.expand();
        }
    } });