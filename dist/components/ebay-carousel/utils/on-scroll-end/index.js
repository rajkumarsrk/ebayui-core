"use strict"; /**
               * Checks on an interval to see if the element is scrolling.
               * When the scrolling has finished it then calls the function.
               *
               * @param {HTMLElement} el The element which scrolls.
               * @param {(offset: number)=>{}} fn The function to call after scrolling completes.
               * @return {function} A function to cancel the scroll listener.
               */
module.exports = function onScrollEnd(el, fn) {
    var timeout = void 0;
    var frame = void 0;
    var lastPos = void 0;

    (function checkMoved() {var
        scrollLeft = el.scrollLeft;
        if (lastPos !== scrollLeft) {
            lastPos = scrollLeft;
            timeout = setTimeout(function () {
                frame = requestAnimationFrame(checkMoved);
            }, 90);
            return;
        }

        fn(lastPos);
    })();

    return function () {
        clearTimeout(timeout);
        cancelAnimationFrame(frame);
    };
};