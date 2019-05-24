'use strict';var TRANSITION_END = 'transitionend';

/**
                                                    * Applies a primer `-init` class before starting a transition
                                                    * to make transitioning properties that are not animatable easier.
                                                    *
                                                    * **Order**
                                                    * 1. Add class: "$className-init"
                                                    * 2. Wait one frame.
                                                    * 3. Remove class "$className-init".
                                                    * 4. Add class "$className".
                                                    * 5. Wait for animation to finish.
                                                    * 6. Remove class "$className".
                                                    *
                                                    * @param {HTMLElement} options.el The root element that contains the animation.
                                                    * @param {string} options.className The base className to use for the transition.
                                                    * @param {Element[]} options.waitFor Elements that will transition and should be waited for.
                                                    * @param {Function} cb A callback called after the transition as ended.
                                                    */
module.exports = function (_ref, cb) {var el = _ref.el,className = _ref.className,waitFor = _ref.waitFor;
    var ended = void 0;
    var ran = 0;
    var pending = waitFor ? waitFor.length : 0;
    var classList = el.classList;
    var initClass = className + '-init';
    var cancelFrame = nextFrame(function () {
        cancelFrame = undefined;
        classList.add(className);
        classList.remove(initClass);

        if (pending) {
            waitFor.forEach(function (child) {return child.addEventListener(TRANSITION_END, listener);});
        } else {
            cancel();

            if (cb) {
                cb();
            }
        }
    });

    classList.add(initClass);

    return cancel;

    /**
                    * Cancels the current transition and resets the className.
                    */
    function cancel() {
        if (ended) {
            return;
        }

        ended = true;

        for (var i = ran; i < pending; i++) {
            var child = waitFor[i];
            child.removeEventListener(TRANSITION_END, listener);
        }

        if (cancelFrame) {
            cancelFrame();
            classList.remove(initClass);
        } else {
            classList.remove(className);
        }
    }

    /**
       * Handles a single transition end event.
       * Once all child transitions have ended the overall animation is completed.
       */
    function listener(_ref2) {var target = _ref2.target;
        target.removeEventListener(TRANSITION_END, listener);

        if (++ran === pending) {
            ended = true;
            classList.remove(className);

            if (cb) {
                cb();
            }
        }
    }
};

/**
    * Runs a function during the next animation frame.
    *
    * @param {function} fn a function to run on the next animation frame.
    * @return {function} a function to cancel the callback.
    */
function nextFrame(fn) {
    var frame = void 0;
    var cancelFrame = void 0;

    if (window.requestAnimationFrame) {
        frame = requestAnimationFrame(function () {
            frame = requestAnimationFrame(fn);
        });
        cancelFrame = cancelAnimationFrame;
    } else {
        frame = setTimeout(fn, 26); // 16ms to simulate RAF, 10ms to ensure called after the frame.
        cancelFrame = clearTimeout;
    }

    return function () {
        if (frame) {
            cancelFrame(frame);
            frame = undefined;
        }
    };
}