"use strict"; /**
               * Scrolls the parent element until the child element is in view
               */
function scroll(el) {
    if (!el) {
        return;
    }

    var parentEl = el && el.parentElement;
    var offsetBottom = el.offsetTop + el.offsetHeight;
    var scrollBottom = parentEl.scrollTop + parentEl.offsetHeight;

    if (el.offsetTop < parentEl.scrollTop) {
        parentEl.scrollTop = el.offsetTop;
    } else if (offsetBottom > scrollBottom) {
        parentEl.scrollTop = offsetBottom - parentEl.offsetHeight;
    }
}

module.exports = { scroll: scroll };