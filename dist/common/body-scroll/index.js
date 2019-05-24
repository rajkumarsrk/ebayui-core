'use strict';function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}var _require = require('../event-utils'),resizeUtil = _require.resizeUtil;
var previousPosition = void 0;
var previousStyles = void 0;
var isPrevented = false;

module.exports = { prevent: prevent, restore: restore };

/**
                                                          * Prevents the `<body>` element from scrolling.
                                                          *
                                                          * This is done by forcing the body to be `fixed` and setting it's height/width inline.
                                                          * The body is then translated the reverse of the scroll position using negative margins.
                                                          *
                                                          * This approach was chosen over the more common just `overflow:hidden` to address some
                                                          * issues with iOS and Android browsers.
                                                          *
                                                          * Finally the scroll position is also stored so that it can be reapplied after restoring
                                                          * scrolling.
                                                          */
function prevent() {
    if (!isPrevented) {var _document =
        document,body = _document.body;var _window =
        window,pageXOffset = _window.pageXOffset,pageYOffset = _window.pageYOffset;var _getComputedStyle =
        getComputedStyle(body),width = _getComputedStyle.width,height = _getComputedStyle.height,marginTop = _getComputedStyle.marginTop,marginLeft = _getComputedStyle.marginLeft;
        var styleText = 'position:fixed;overflow:hidden;';
        previousPosition = [pageXOffset, pageYOffset];
        previousStyles = body.getAttribute('style');
        styleText += 'height:' + height + ';';
        styleText += 'width:' + width + ';';

        if (pageYOffset) {
            styleText += 'margin-top:' + -1 * (pageYOffset - parseInt(marginTop, 10)) + 'px;';
        }

        if (pageXOffset) {
            styleText += 'margin-left:' + -1 * (pageXOffset - parseInt(marginLeft, 10)) + 'px';
        }

        if (previousStyles) {
            styleText = previousStyles + ';' + styleText;
        }

        body.setAttribute('style', styleText);
        resizeUtil.addEventListener('', recalculate);
        isPrevented = true;
    }
}

/**
   * Restores scrolling of the `<body>` element.
   *
   * This will also restore the scroll position, and inline body styles from before the body
   * scroll was prevented. You should not call this function without first preventing the
   * body scroll.
   */
function restore() {
    if (isPrevented) {var _window2;var _document2 =
        document,body = _document2.body;
        if (previousStyles) {
            body.setAttribute('style', previousStyles);
        } else {
            body.removeAttribute('style');
        }

        (_window2 = window).scrollTo.apply(_window2, _toConsumableArray(previousPosition));
        resizeUtil.removeEventListener('', recalculate);
        isPrevented = false;
    }
}

/**
   * Called during "resize" events to recalculate generated body widths and margins.
   */
function recalculate() {
    restore();
    prevent();
}