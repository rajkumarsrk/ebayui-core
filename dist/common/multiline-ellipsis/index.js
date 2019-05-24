'use strict'; /**
               * Adds an ellipsis to a el based on the height and width
               * specified in CSS rules
               */
function truncate(el) {var _this = this;
    if (!el) {
        return;
    }

    var text = el.textContent;

    if (this.isTextOverflowing(el)) {
        var checkFunc = function checkFunc(i) {
            el.textContent = text.substring(0, i);
            return _this.isTextOverflowing(el) ? -1 : 0;
        };
        var len = binarySearch(text.length - 1, checkFunc);
        var truncatedText = text.substring(0, len).slice(0, -2);
        el.innerHTML = '<span aria-hidden="true">' + truncatedText + '\u2026</span><span class="clipped">' + text + '</span>';
    }
}

function isTextOverflowing(el) {
    var currentOverflow = el.style.overflow;
    if (!currentOverflow || currentOverflow === 'visible') {
        el.style.overflow = 'hidden';
    }

    var isOverflowing = el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;
    el.style.overflow = currentOverflow;
    return isOverflowing;
}

function binarySearch(length, callback) {
    var low = 0;
    var high = length - 1;
    var best = -1;
    var mid = void 0;

    while (low <= high) {
        mid = Math.floor((low + high) / 2);
        var result = callback(mid);
        if (result < 0) {
            high = mid - 1;
        } else if (result > 0) {
            low = mid + 1;
        } else {
            best = mid;
            low = mid + 1;
        }
    }
    return best;
}

module.exports = {
    truncate: truncate,
    isTextOverflowing: isTextOverflowing };