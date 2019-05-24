'use strict';var eventOptions = { passive: true };

module.exports = function onScrollDebounced(el, cb) {
    var timeout = void 0;
    waitForScroll();
    return cancel;

    function waitForScroll() {
        el.addEventListener('scroll', handleScroll, eventOptions);
    }

    function handleScroll() {
        cancelWaitForScroll();
        timeout = setTimeout(finish, 640);
    }

    function finish() {
        cb();
        waitForScroll();
    }

    function cancelWaitForScroll() {
        el.removeEventListener('scroll', handleScroll, eventOptions);
    }

    function cancel() {
        cancelWaitForScroll();
        clearTimeout(timeout);
    }
};