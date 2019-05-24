'use strict';var markoWidgets = require('marko-widgets');
var Expander = require('makeup-expander');
var findIndex = require('core-js/library/fn/array/find-index');
var scrollKeyPreventer = require('makeup-prevent-scroll-keys');
var elementScroll = require('../../common/element-scroll');
var emitAndFire = require('../../common/emit-and-fire');
var eventUtils = require('../../common/event-utils');
var processHtmlAttributes = require('../../common/html-attributes');
var observer = require('../../common/property-observer');
var template = require('./template.marko');

var comboboxOptionsClass = 'combobox__options';
var comboboxExpanderClass = 'combobox__control';
var comboboxHostSelector = '.' + comboboxExpanderClass + ' > input';
var comboboxBtnClass = 'combobox__control';
var comboboxOptionSelector = '.combobox__option[role=option]';
var comboboxSelectedOptionSelector = '.combobox__option[role=option][aria-selected=true]';

function getInitialState(input) {
    var options = (input.options || []).map(function (option) {return {
            htmlAttributes: processHtmlAttributes(option),
            class: option.class,
            style: option.style,
            value: option.value,
            text: option.text,
            selected: Boolean(option.selected),
            renderBody: option.renderBody };});


    var selectedOption = options.filter(function (option) {return option.selected;})[0] || options[0];

    if (options.length > 0 && selectedOption.value === options[0].value) {
        options[0].selected = true;
    }

    return {
        htmlAttributes: processHtmlAttributes(input),
        class: input.class,
        style: input.style,
        name: input.name,
        options: options,
        selected: selectedOption,
        disabled: input.disabled,
        borderless: Boolean(input.borderless) };

}

function getTemplateData(state) {
    var comboboxClass = ['combobox', state.class];
    var btnClass = [comboboxBtnClass];
    var optionsClass = [comboboxOptionsClass];

    if (state.borderless) {
        btnClass.push('combobox__control--borderless');
    }

    return {
        htmlAttributes: state.htmlAttributes,
        class: comboboxClass,
        style: state.style,
        btnClass: btnClass,
        optionsClass: optionsClass,
        name: state.name,
        selectedOption: state.selected,
        options: state.options,
        disabled: state.disabled };

}

function init() {var _this = this;
    var optionEls = this.el.querySelectorAll(comboboxOptionSelector);

    if (this.state.options && this.state.options.length > 0) {
        this.expander = new Expander(this.el, {
            autoCollapse: true,
            expandOnClick: !this.state.disabled,
            contentSelector: '.' + comboboxOptionsClass,
            hostSelector: comboboxHostSelector,
            expandedClass: 'combobox--expanded',
            simulateSpacebarClick: true });


        observer.observeRoot(this, ['selected'], function (index) {
            _this.processAfterStateChange(optionEls[index]);
        });

        observer.observeRoot(this, ['disabled'], function () {
            _this.expander.expandOnClick = !_this.state.disabled;
        });

        var selectedObserverCallback = function selectedObserverCallback(optionEl) {
            _this.processAfterStateChange(optionEl);
        };

        this.optionEls = optionEls.forEach(function (optionEl, i) {
            observer.observeInner(_this, optionEl, 'selected', 'options[' + i + ']', 'options', selectedObserverCallback);
        });

        scrollKeyPreventer.add(this.el.querySelector(comboboxHostSelector));
        scrollKeyPreventer.add(this.el.querySelector('.' + comboboxOptionsClass));
    }
}

function handleExpand() {
    elementScroll.scroll(this.el.querySelector(comboboxSelectedOptionSelector));
    emitAndFire(this, 'combobox-expand');
}

function handleCollapse() {
    emitAndFire(this, 'combobox-collapse');
}

/**
   * Handle mouse click for option
   * @param {MouseEvent} event
   */
function handleOptionClick(event) {
    var el = void 0;

    // find the element with the data
    // start with the target element
    if (event.target.dataset.optionValue) {
        el = event.target;
        // check up the tree one level (in case option text or status was clicked)
    } else if (event.target.parentNode.dataset.optionValue) {
        el = event.target.parentNode;
    }

    this.processAfterStateChange(el);
    this.expander.collapse();
    this.el.querySelector(comboboxHostSelector).focus();
}

/**
   * Handle selection of options when the combobox is closed
   * https://ebay.gitbooks.io/mindpatterns/content/input/listbox.html#keyboard
   * @param {KeyboardEvent} event
   */
function handleComboboxKeyDown(event) {var _this2 = this;
    eventUtils.handleUpDownArrowsKeydown(event, function () {
        var currentSelectedIndex = findIndex(_this2.state.options, function (option) {return option.selected;});
        var options = clearComboboxSelections(_this2.state.options);
        var optionEls = _this2.el.querySelectorAll(comboboxOptionSelector);
        var selectElementIndex = currentSelectedIndex;

        switch (event.charCode || event.keyCode) {
            // down
            case 40:
                selectElementIndex = traverseOptions(options, currentSelectedIndex, 1);
                break;
            // up
            case 38:
                selectElementIndex = traverseOptions(options, currentSelectedIndex, -1);
                break;
            default:
                break;}


        options[selectElementIndex].selected = true;

        _this2.setState('options', options);
        _this2.processAfterStateChange(optionEls[selectElementIndex]);
    });

    eventUtils.handleEscapeKeydown(event, function () {
        _this2.expander.collapse();
        _this2.el.querySelector(comboboxHostSelector).focus();
    });
}

/**
   * Traverse the options forward or backward for the next/prev option
   * @param {Array} options
   * @param {Number} currentIndex
   * @param {Number} distance
   * @returns {Number}
   */
function traverseOptions(options, currentIndex, distance) {
    var goToIndex = currentIndex;

    if (distance < 0 && currentIndex !== 0) {
        goToIndex = (currentIndex + options.length + distance) % options.length;
    } else if (distance > 0 && currentIndex !== options.length - 1) {
        goToIndex = (currentIndex + distance) % options.length;
    }

    return goToIndex;
}

/**
   * Common processing after data change via both UI and API
   * @param {HTMLElement} el
   */
function processAfterStateChange(el) {
    var optionValue = el.dataset.optionValue;
    var optionIndex = Array.prototype.slice.call(el.parentNode.children).indexOf(el);
    this.setSelectedOption(optionValue);
    elementScroll.scroll(el);
    emitAndFire(this, 'combobox-change', {
        index: optionIndex,
        selected: [optionValue],
        el: el });

}

/**
   * Will set the appropriate value for the option in state, view, and the hidden form select, and emit an event
   * @param {String} optionValue
   */
function setSelectedOption(optionValue) {var _this3 = this;
    var newOptionSelected = this.state.options.filter(function (option) {return option.value.toString() === optionValue;})[0];
    var newOptionSelectedValue = newOptionSelected && newOptionSelected.value;
    var options = this.clearComboboxSelections(this.state.options);

    options = options.map(function (option) {
        if (option.value === newOptionSelectedValue) {
            option.selected = true;
            _this3.setState('selected', option);
            _this3.update();
        }
        return option;
    });

    this.setState('options', options);
}

/**
   * Resets all options to un-selected
   * @param {Array} options
   */
function clearComboboxSelections(options) {
    return options.map(function (option) {
        option.selected = false;
        return option;
    });
}

module.exports = markoWidgets.defineComponent({
    template: template,
    getInitialState: getInitialState,
    getTemplateData: getTemplateData,
    init: init,
    handleExpand: handleExpand,
    handleCollapse: handleCollapse,
    handleOptionClick: handleOptionClick,
    handleComboboxKeyDown: handleComboboxKeyDown,
    processAfterStateChange: processAfterStateChange,
    setSelectedOption: setSelectedOption,
    clearComboboxSelections: clearComboboxSelections });