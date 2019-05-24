'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};var keyboardTrap = require('makeup-keyboard-trap');
var screenReaderTrap = require('makeup-screenreader-trap');
var bodyScroll = require('../../common/body-scroll');
var emitAndFire = require('../../common/emit-and-fire');
var observer = require('../../common/property-observer');
var transition = require('../../common/transition');

module.exports = require('marko-widgets').defineComponent({
    template: require('./template.marko'),
    getInitialState: function getInitialState(input) {
        return _extends({}, input, {
            open: input.open || false });

    },
    init: function init() {
        this.rootEl = this.getEl();
        this.windowEl = this.getEl('window');
        this.closeEl = this.getEl('close');
        this.bodyEl = this.getEl('body');
        this.transitionEls = [this.windowEl, this.rootEl];
        observer.observeRoot(this, ['open']);
        // Add an event listener to the dialog to fix an issue with Safari not recognizing it as a touch target.
        this.subscribeTo(this.rootEl).on('click', function () {});
    },
    onRender: function onRender(opts) {
        this._trap(opts);
    },
    onBeforeUpdate: function onBeforeUpdate() {
        this._release();
    },
    onBeforeDestroy: function onBeforeDestroy() {
        this._cancelAsync();
        this._release();

        if (this.isTrapped) {
            bodyScroll.restore();
        }
    },
    handleDialogClick: function handleDialogClick(_ref) {var target = _ref.target,clientY = _ref.clientY;var
        closeEl = this.closeEl,windowEl = this.windowEl;

        // Checks if we clicked inside the white panel of the dialog.
        if (!closeEl.contains(target) && windowEl.contains(target)) {var _windowEl$getBounding =
            windowEl.getBoundingClientRect(),bottom = _windowEl$getBounding.bottom;var _getComputedStyle =
            getComputedStyle(windowEl),paddingBottom = _getComputedStyle.paddingBottom;
            var windowBottom = bottom - parseInt(paddingBottom, 10);
            if (clientY < windowBottom) {
                return;
            }
        }

        this.close();
    },
    handleCloseButtonClick: function handleCloseButtonClick() {
        this.close();
    },
    show: function show() {
        this.setState('open', true);
    },
    close: function close() {
        this.setState('open', false);
    },
    /**
        * Ensures that if a component is supposed to be trapped that this is
        * trapped after rendering.
        */
    _trap: function _trap(opts) {var _this = this;var
        wasTrapped = this.isTrapped,restoreTrap = this.restoreTrap;
        var isTrapped = this.isTrapped = this.state.open;
        var isFirstRender = opts && opts.firstRender;
        var wasToggled = isTrapped !== wasTrapped;
        var focusEl = this.state.focus && document.getElementById(this.state.focus) || this.closeEl;

        if (restoreTrap || isTrapped && !wasTrapped) {
            screenReaderTrap.trap(this.windowEl);
            keyboardTrap.trap(this.windowEl);
        }

        // Ensure focus is set and body scroll prevented on initial render.
        if (isFirstRender && isTrapped) {
            focusEl.focus();
            bodyScroll.prevent();
        }

        if (wasToggled) {
            this._cancelAsync();
            var onFinishTransition = function onFinishTransition() {
                _this.cancelTransition = undefined;

                if (isTrapped) {
                    focusEl.focus();
                    emitAndFire(_this, 'dialog-show');
                } else {
                    bodyScroll.restore();
                    emitAndFire(_this, 'dialog-close');

                    // Reset dialog scroll position lazily to avoid jank.
                    // Note since the dialog is not in the dom at this point none of the scroll methods will work.
                    _this.cancelScrollReset = setTimeout(function () {
                        _this.rootEl.parentNode.replaceChild(_this.rootEl, _this.rootEl);
                        _this.cancelScrollReset = undefined;
                    }, 20);
                }
            };

            if (isTrapped) {
                if (!isFirstRender) {
                    bodyScroll.prevent();
                    this.cancelTransition = transition({
                        el: this.rootEl,
                        className: 'dialog--show',
                        waitFor: this.transitionEls },
                    onFinishTransition);
                }

                this.rootEl.removeAttribute('hidden');
            } else {
                if (!isFirstRender) {
                    this.cancelTransition = transition({
                        el: this.rootEl,
                        className: 'dialog--hide',
                        waitFor: this.transitionEls },
                    onFinishTransition);
                }

                this.rootEl.setAttribute('hidden', '');
            }
        }
    },
    /**
        * Releases the trap before each render and on destroy so
        * that Marko can update normally without the inserted dom nodes.
        */
    _release: function _release() {
        if (this.isTrapped) {
            this.restoreTrap = this.state.open;
            screenReaderTrap.untrap(this.windowEl);
            keyboardTrap.untrap(this.windowEl);
        } else {
            this.restoreTrap = false;
        }
    },
    _cancelAsync: function _cancelAsync() {
        if (this.cancelScrollReset) {
            clearTimeout(this.cancelScrollReset);
            this.cancelScrollReset = undefined;
        }

        if (this.cancelTransition) {
            this.cancelTransition();
            this.cancelTransition = undefined;
        }
    } });