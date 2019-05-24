"use strict";var lastTime = 0;
var times = [];
var animation = void 0;
var interval = void 0;

/**
                        * Loop that continuously calls itself and measures the time difference between calls
                        * @param {DOMHighResTimeStamp} time
                        */
function loop(time) {
    var ms = time - lastTime;
    var fps = 1000 / ms;
    if (fps) {
        if (times.length === 0) {
            fps = 60; // start off at 60
        }
        times.push(fps);
    }
    lastTime = time;
    animation = requestAnimationFrame(loop);
}

/**
   * Start the loop and start running code at specified intervals
   * @param {Function} intervalFn
   * @param {Number} intervalMs
   */
function start(intervalFn, intervalMs) {
    lastTime = 0;
    times = [];
    interval = setInterval(intervalFn, intervalMs);
    loop();
}

function end() {
    cancelAnimationFrame(animation);
    clearInterval(interval);
}

function getAverage() {
    var avg = times.reduce(function (a, b) {return a + b;}) / times.length;
    return +avg.toFixed(2);
}

module.exports = {
    loop: loop,
    start: start,
    end: end,
    getAverage: getAverage };