'use strict';var processHtmlAttributes = require('../../common/html-attributes');
var eventUtils = require('../../common/event-utils');
var emitAndFire = require('../../common/emit-and-fire');
var template = require('./template.marko');

var constants = {
    indexForNavigation: 2,
    minPagesRequired: 5,
    maxPagesAllowed: 9,
    margin: 8 };


function getInitialState(input) {
    var prevItem = void 0;
    var nextItem = void 0;
    var items = [];
    var inputItems = input.items || [];

    for (var i = 0; i < inputItems.length; ++i) {
        var item = inputItems[i];
        var href = item.href;
        var current = item.current;
        var tempItem = {
            htmlAttributes: processHtmlAttributes(item),
            style: item.style,
            renderBody: item.renderBody,
            href: href,
            current: current };


        if (item.type === 'previous') {
            prevItem = tempItem;
            prevItem.class = ['pagination__previous', item.class];
            prevItem.disabled = item.disabled;
            continue;
        } else if (item.type === 'next') {
            nextItem = tempItem;
            nextItem.class = ['pagination__next', item.class];
            nextItem.disabled = item.disabled;
            continue;
        } else {
            tempItem.class = ['pagination__item', item.class];
            tempItem.current = item.current;
        }

        items.push(tempItem);
    }

    return {
        htmlAttributes: processHtmlAttributes(input),
        classes: ['pagination', input.class],
        style: input.style,
        nextItem: nextItem || { class: 'pagination__next', disabled: true, htmlAttributes: {} },
        prevItem: prevItem || { class: 'pagination__previous', disabled: true, htmlAttributes: {} },
        items: items,
        a11yPreviousText: input.a11yPreviousText || 'Previous page',
        a11yNextText: input.a11yNextText || 'Next page',
        a11yCurrentText: input.a11yCurrentText || 'Results Pagination - Page 1' };

}

function getTemplateData(state) {
    return state;
}

function init() {
    this.pageContainerEl = this.el.querySelector('.pagination__items');
    this.pageContainerEl.style.flexWrap = 'nowrap';
    this.pageEls = this.pageContainerEl.children;
    this.containerEl = this.el;
    this.previousPageEl = this.el.querySelector('.pagination__previous');
    this.nextPageEl = this.el.querySelector('.pagination__next');
    this.subscribeTo(eventUtils.resizeUtil).on('resize', refresh.bind(this));
    this.timeoutRef = 0;
    this.refresh();
}

function onBeforeUpdate() {
    clearTimeout(this.timeoutRef);
}

function onDestroy() {
    clearTimeout(this.timeoutRef);
}

function onUpdate() {
    this.timeoutRef = setTimeout(this.refresh.bind(this), 0);
}

function refresh() {
    var current = 0;
    for (var i = 0; i < this.state.items.length; i++) {
        if (this.state.items[i].current) {
            current = i;
        }
        this.pageEls[i].removeAttribute('hidden');
    }

    var totalPages = this.pageEls.length;
    var pageNumWidth = this.pageEls[0].children[0].offsetWidth + constants.margin;
    var numPagesAllowed = this.pageContainerEl.offsetWidth / pageNumWidth;
    var adjustedNumPages = Math.floor(Math.min(constants.maxPagesAllowed,
    Math.max(numPagesAllowed, constants.minPagesRequired)));

    var start = 0;
    var end = adjustedNumPages;
    var rangeLeft = Math.floor(adjustedNumPages * 0.5);
    var rangeRight = Math.floor(adjustedNumPages * 0.5);

    if (rangeLeft + rangeRight + 1 > adjustedNumPages) {
        rangeLeft -= 1;
    }

    start = current - rangeLeft;
    end = current + rangeRight;

    if (totalPages < constants.maxPagesAllowed) {
        end = totalPages;
    }

    if (current + rangeRight >= totalPages) {
        end = totalPages;
        start = end - adjustedNumPages;
    }

    if (start <= 0) {
        end = adjustedNumPages - 1;
        start = 0;
    }

    for (var _i = 0; _i < totalPages; _i++) {
        if (_i < start || _i > end) {
            this.pageEls[_i].setAttribute('hidden', true);
        } else {
            this.pageEls[_i].removeAttribute('hidden');
        }
    }
}

/**
   * Handle normal mouse click for item, next page and previous page respectively.
   * @param {MouseEvent} event
   */
function handlePageClick(originalEvent) {
    var target = originalEvent.target;
    emitAndFire(this, 'pagination-select', {
        originalEvent: originalEvent,
        el: target,
        value: target.innerText });

}

function handleNextPage(originalEvent) {
    if (!this.state.nextItem.disabled) {
        emitAndFire(this, 'pagination-next', {
            originalEvent: originalEvent,
            el: this.nextPageEl });

    }
}

function handlePreviousPage(originalEvent) {
    if (!this.state.prevItem.disabled) {
        emitAndFire(this, 'pagination-previous', {
            originalEvent: originalEvent,
            el: this.previousPageEl });

    }
}

/**
   * Handle a11y for item, next page and previous page respectively.
   * @param {KeyboardEvent} event
   */
function handlePageKeyDown(event) {var _this = this;
    eventUtils.handleActionKeydown(event, function () {
        _this.handlePageClick(event);
    });
}

function handleNextPageKeyDown(event) {var _this2 = this;
    eventUtils.handleActionKeydown(event, function () {
        _this2.handleNextPage(event);
    });
}

function handlePreviousPageKeyDown(event) {var _this3 = this;
    eventUtils.handleActionKeydown(event, function () {
        _this3.handlePreviousPage(event);
    });
}

module.exports = require('marko-widgets').defineComponent({
    template: template,
    init: init,
    onUpdate: onUpdate,
    onBeforeUpdate: onBeforeUpdate,
    onDestroy: onDestroy,
    refresh: refresh,
    handlePageClick: handlePageClick,
    handleNextPage: handleNextPage,
    handlePreviousPage: handlePreviousPage,
    handlePageKeyDown: handlePageKeyDown,
    handleNextPageKeyDown: handleNextPageKeyDown,
    handlePreviousPageKeyDown: handlePreviousPageKeyDown,
    getInitialState: getInitialState,
    getTemplateData: getTemplateData });